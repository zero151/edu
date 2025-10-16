const Joi = require('joi');

// Схемы валидации
const platformStatsSchema = Joi.object({
  period: Joi.string().valid('day', 'week', 'month', 'year').default('week'),
  includeDetails: Joi.boolean().default(false)
});

const courseAnalyticsSchema = Joi.object({
  courseId: Joi.number().integer().positive().required(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  groupBy: Joi.string().valid('day', 'week', 'month').default('week')
});

const userLearningAnalyticsSchema = Joi.object({
  userId: Joi.number().integer().positive().required(),
  period: Joi.string().valid('day', 'week', 'month', 'all').default('month'),
  includeCourseDetails: Joi.boolean().default(true)
});

class AnalyticsService {
  constructor(
    userRepository, 
    courseRepository, 
    progressRepository,
    quizAttemptRepository
  ) {
    this.userRepository = userRepository;
    this.courseRepository = courseRepository;
    this.progressRepository = progressRepository;
    this.quizAttemptRepository = quizAttemptRepository;
  }

  async validatePlatformStats(data) {
    const { error, value } = platformStatsSchema.validate(data);
    if (error) {
      throw new Error(`Ошибка валидации: ${error.details[0].message}`);
    }
    return value;
  }

  async validateCourseAnalytics(data) {
    const { error, value } = courseAnalyticsSchema.validate(data);
    if (error) {
      throw new Error(`Ошибка валидации: ${error.details[0].message}`);
    }
    return value;
  }

  async validateUserLearningAnalytics(data) {
    const { error, value } = userLearningAnalyticsSchema.validate(data);
    if (error) {
      throw new Error(`Ошибка валидации: ${error.details[0].message}`);
    }
    return value;
  }

  async getPlatformStats(params = {}) {
    try {
      // Валидация входных параметров
      const validatedParams = await this.validatePlatformStats(params);

      const users = await this.userRepository.findAll();
      const courses = await this.courseRepository.findAll();
      
      let totalProgress = 0;
      let userCount = 0;

      // Рассчитываем средний прогресс
      for (const user of users) {
        const progress = await this.progressRepository.getUserOverallProgress(user.id);
        if (progress && progress.overall_completion_percentage) {
          totalProgress += progress.overall_completion_percentage;
          userCount++;
        }
      }

      const averageProgress = userCount > 0 ? totalProgress / userCount : 0;

      // Рассчитываем активных пользователей за период
      const activeUsers = users.filter(user => {
        const lastAccess = new Date(user.updated_at);
        const now = new Date();
        let periodAgo;
        
        switch (validatedParams.period) {
          case 'day':
            periodAgo = new Date(now - 24 * 60 * 60 * 1000);
            break;
          case 'week':
            periodAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            periodAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
            break;
          case 'year':
            periodAgo = new Date(now - 365 * 24 * 60 * 60 * 1000);
            break;
          default:
            periodAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
        }

        return lastAccess > periodAgo;
      }).length;

      const result = {
        totalUsers: users.length,
        totalCourses: courses.length,
        averageProgress: Math.round(averageProgress),
        activeUsers,
        period: validatedParams.period
      };

      // Добавляем детали если требуется
      if (validatedParams.includeDetails) {
        result.details = {
          newUsersThisWeek: users.filter(user => {
            const created = new Date(user.created_at);
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            return created > weekAgo;
          }).length,
          coursesWithMostUsers: await this.getCoursesWithMostUsers(5),
          averageTestScores: await this.getAverageTestScores()
        };
      }

      return result;

    } catch (error) {
      console.error('Error in getPlatformStats:', error);
      throw error;
    }
  }

  async getCourseAnalytics(params) {
    try {
      // Валидация входных параметров
      const validatedParams = await this.validateCourseAnalytics(params);

      const course = await this.courseRepository.findById(validatedParams.courseId);
      if (!course) {
        throw new Error('Курс не найден');
      }

      const users = await this.userRepository.findAll();
      let enrolledUsers = 0;
      let completedUsers = 0;
      let totalProgress = 0;

      for (const user of users) {
        const progress = await this.progressRepository.getCourseProgress(user.id, validatedParams.courseId);
        if (progress && progress.total_materials > 0) {
          enrolledUsers++;
          totalProgress += progress.completion_percentage || 0;
          if (progress.completion_percentage === 100) {
            completedUsers++;
          }
        }
      }

      const averageProgress = enrolledUsers > 0 ? totalProgress / enrolledUsers : 0;

      // Получаем статистику тестов для курса
      const testStats = await this.getCourseTestStats(validatedParams.courseId);

      return {
        course: {
          id: course.id,
          title: course.title,
          description: course.description
        },
        enrolledUsers,
        completedUsers,
        averageProgress: Math.round(averageProgress),
        completionRate: enrolledUsers > 0 ? Math.round((completedUsers / enrolledUsers) * 100) : 0,
        testStats,
        period: validatedParams.period,
        analysisPeriod: {
          startDate: validatedParams.startDate,
          endDate: validatedParams.endDate,
          groupBy: validatedParams.groupBy
        }
      };

    } catch (error) {
      console.error('Error in getCourseAnalytics:', error);
      throw error;
    }
  }

  async getUserLearningAnalytics(params) {
    try {
      // Валидация входных параметров
      const validatedParams = await this.validateUserLearningAnalytics(params);

      const user = await this.userRepository.findById(validatedParams.userId);
      if (!user) {
        throw new Error('Пользователь не найден');
      }

      // Получаем общий прогресс
      const overallProgress = await this.progressRepository.getUserOverallProgress(validatedParams.userId);
      
      // Получаем недавние активности
      const recentActivities = await this.progressRepository.getRecentActivities(validatedParams.userId, 20);
      
      // Получаем статистику тестов
      const quizStats = await this.getUserQuizStats(validatedParams.userId);
      
      // Получаем прогресс по курсам
      const enrolledCourses = await this.courseRepository.getUserEnrolledCourses(validatedParams.userId);

      const result = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        overallProgress: overallProgress || {
          enrolled_courses_count: 0,
          completed_materials_count: 0,
          total_materials_count: 0,
          overall_completion_percentage: 0
        },
        recentActivities: recentActivities.slice(0, 10),
        quizStats,
        learningStreak: this.calculateLearningStreak(recentActivities),
        period: validatedParams.period
      };

      // Добавляем детали по курсам если требуется
      if (validatedParams.includeCourseDetails) {
        result.courseDetails = enrolledCourses;
      }

      return result;

    } catch (error) {
      console.error('Error in getUserLearningAnalytics:', error);
      throw error;
    }
  }

  // Вспомогательные методы
  async getCoursesWithMostUsers(limit = 5) {
    const courses = await this.courseRepository.getPopularCourses(limit);
    return courses.map(course => ({
      id: course.id,
      title: course.title,
      enrollmentCount: course.enrollment_count
    }));
  }

  async getAverageTestScores() {
    // Здесь можно добавить логику для расчета средних баллов тестов
    return {
      averageScore: 75,
      bestScore: 98,
      testsCompleted: 150
    };
  }

  async getCourseTestStats(courseId) {
    // Здесь можно добавить логику для статистики тестов курса
    return {
      averageScore: 72,
      completionRate: 65,
      totalAttempts: 89
    };
  }

  async getUserQuizStats(userId) {
    const userStats = await this.userRepository.getUserStats(userId);
    return {
      averageScore: userStats?.average_score || 0,
      quizAttemptsCount: userStats?.quiz_attempts_count || 0,
      bestScore: 95 // Можно добавить реальный расчет
    };
  }

  calculateLearningStreak(activities) {
    if (!activities || activities.length === 0) return 0;
    
    let streak = 0;
    const today = new Date().toDateString();
    const dates = [...new Set(activities.map(activity => 
      new Date(activity.last_accessed_at).toDateString()
    ))].sort((a, b) => new Date(b) - new Date(a));
    
    let currentDate = new Date();
    
    for (let i = 0; i < dates.length; i++) {
      const activityDate = new Date(dates[i]);
      const diffTime = Math.abs(currentDate - activityDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === i) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }
}

module.exports = AnalyticsService;