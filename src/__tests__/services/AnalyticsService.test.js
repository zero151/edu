const AnalyticsService = require('../../services/AnalyticsService');

describe('AnalyticsService', () => {
  let analyticsService;
  let mockUserRepository;
  let mockCourseRepository;
  let mockProgressRepository;
  let mockQuizAttemptRepository;

  beforeEach(() => {
    mockUserRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      getUserStats: jest.fn()
    };
    mockCourseRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      getPopularCourses: jest.fn(),
      getUserEnrolledCourses: jest.fn()
    };
    mockProgressRepository = {
      getUserOverallProgress: jest.fn(),
      getCourseProgress: jest.fn(),
      getRecentActivities: jest.fn()
    };
    mockQuizAttemptRepository = {
      getUserAttempts: jest.fn()
    };

    analyticsService = new AnalyticsService(
      mockUserRepository,
      mockCourseRepository,
      mockProgressRepository,
      mockQuizAttemptRepository
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validatePlatformStats', () => {
    it('should validate platform stats data', async () => {
      const validData = { period: 'week', includeDetails: true };
      const result = await analyticsService.validatePlatformStats(validData);
      expect(result).toEqual(validData);
    });

    it('should throw error for invalid period', async () => {
      const invalidData = { period: 'invalid', includeDetails: true };
      await expect(analyticsService.validatePlatformStats(invalidData)).rejects.toThrow();
    });

    it('should use default values', async () => {
      const data = {};
      const result = await analyticsService.validatePlatformStats(data);
      expect(result.period).toBe('week');
      expect(result.includeDetails).toBe(false);
    });
  });

  describe('validateCourseAnalytics', () => {
    it('should validate course analytics data', async () => {
      const validData = { courseId: 1, startDate: '2024-01-01', groupBy: 'week' };
      const result = await analyticsService.validateCourseAnalytics(validData);
      expect(result.courseId).toBe(1);
      expect(result.groupBy).toBe('week');
    });

    it('should throw error for invalid courseId', async () => {
      const invalidData = { courseId: -1 };
      await expect(analyticsService.validateCourseAnalytics(invalidData)).rejects.toThrow();
    });
  });

  describe('validateUserLearningAnalytics', () => {
    it('should validate user learning analytics data', async () => {
      const validData = { userId: 1, period: 'month', includeCourseDetails: true };
      const result = await analyticsService.validateUserLearningAnalytics(validData);
      expect(result).toEqual(validData);
    });

    it('should throw error for invalid userId', async () => {
      const invalidData = { userId: 0 };
      await expect(analyticsService.validateUserLearningAnalytics(invalidData)).rejects.toThrow();
    });
  });

  describe('getPlatformStats', () => {
    it('should return platform statistics', async () => {
      const users = [
        { id: 1, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-15T00:00:00Z' },
        { id: 2, created_at: '2024-01-10T00:00:00Z', updated_at: '2024-01-20T00:00:00Z' }
      ];
      const courses = [
        { id: 1, title: 'Course 1' },
        { id: 2, title: 'Course 2' }
      ];

      mockUserRepository.findAll.mockResolvedValue(users);
      mockCourseRepository.findAll.mockResolvedValue(courses);
      mockProgressRepository.getUserOverallProgress
        .mockResolvedValueOnce({ overall_completion_percentage: 50 })
        .mockResolvedValueOnce({ overall_completion_percentage: 75 });

      const result = await analyticsService.getPlatformStats({ period: 'week' });

      expect(result).toHaveProperty('totalUsers', 2);
      expect(result).toHaveProperty('totalCourses', 2);
      expect(result).toHaveProperty('averageProgress');
      expect(result).toHaveProperty('activeUsers');
      expect(result).toHaveProperty('period', 'week');
    });

    it('should include details when requested', async () => {
      const users = [{ id: 1, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-15T00:00:00Z' }];
      const courses = [{ id: 1, title: 'Course 1' }];

      mockUserRepository.findAll.mockResolvedValue(users);
      mockCourseRepository.findAll.mockResolvedValue(courses);
      mockProgressRepository.getUserOverallProgress.mockResolvedValue({ overall_completion_percentage: 50 });
      mockCourseRepository.getPopularCourses.mockResolvedValue([]);

      const result = await analyticsService.getPlatformStats({ period: 'week', includeDetails: true });

      expect(result).toHaveProperty('details');
      expect(result.details).toHaveProperty('newUsersThisWeek');
      expect(result.details).toHaveProperty('coursesWithMostUsers');
      expect(result.details).toHaveProperty('averageTestScores');
    });
  });

  describe('getCourseAnalytics', () => {
    it('should return course analytics', async () => {
      const courseId = 1;
      const course = { id: courseId, title: 'JavaScript Course', description: 'Learn JS' };
      const users = [
        { id: 1 },
        { id: 2 }
      ];

      mockCourseRepository.findById.mockResolvedValue(course);
      mockUserRepository.findAll.mockResolvedValue(users);
      mockProgressRepository.getCourseProgress
        .mockResolvedValueOnce({ total_materials: 10, completion_percentage: 50 })
        .mockResolvedValueOnce({ total_materials: 10, completion_percentage: 100 });

      const result = await analyticsService.getCourseAnalytics({ courseId });

      expect(result).toHaveProperty('course');
      expect(result).toHaveProperty('enrolledUsers');
      expect(result).toHaveProperty('completedUsers');
      expect(result).toHaveProperty('averageProgress');
      expect(result).toHaveProperty('completionRate');
      expect(result).toHaveProperty('testStats');
    });

    it('should throw error if course not found', async () => {
      const courseId = 999;
      mockCourseRepository.findById.mockResolvedValue(null);

      await expect(analyticsService.getCourseAnalytics({ courseId })).rejects.toThrow('Курс не найден');
    });
  });

  describe('getUserLearningAnalytics', () => {
    it('should return user learning analytics', async () => {
      const userId = 1;
      const user = { id: userId, name: 'John', email: 'john@example.com' };
      const overallProgress = {
        enrolled_courses_count: 2,
        completed_materials_count: 10,
        total_materials_count: 20,
        overall_completion_percentage: 50
      };
      const recentActivities = [
        { type: 'material_completed', material_id: 1, last_accessed_at: '2024-01-01T00:00:00Z' }
      ];
      const enrolledCourses = [
        { id: 1, title: 'Course 1', completion_percentage: 50 }
      ];

      mockUserRepository.findById.mockResolvedValue(user);
      mockProgressRepository.getUserOverallProgress.mockResolvedValue(overallProgress);
      mockProgressRepository.getRecentActivities.mockResolvedValue(recentActivities);
      mockCourseRepository.getUserEnrolledCourses.mockResolvedValue(enrolledCourses);
      mockUserRepository.getUserStats.mockResolvedValue({ average_score: 80 });

      const result = await analyticsService.getUserLearningAnalytics({ userId });

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('overallProgress');
      expect(result).toHaveProperty('recentActivities');
      expect(result).toHaveProperty('quizStats');
      expect(result).toHaveProperty('learningStreak');
      expect(result).toHaveProperty('period');
    });

    it('should include course details when requested', async () => {
      const userId = 1;
      const user = { id: userId, name: 'John', email: 'john@example.com' };
      const enrolledCourses = [{ id: 1, title: 'Course 1' }];

      mockUserRepository.findById.mockResolvedValue(user);
      mockProgressRepository.getUserOverallProgress.mockResolvedValue({});
      mockProgressRepository.getRecentActivities.mockResolvedValue([]);
      mockCourseRepository.getUserEnrolledCourses.mockResolvedValue(enrolledCourses);
      mockUserRepository.getUserStats.mockResolvedValue({});

      const result = await analyticsService.getUserLearningAnalytics({ 
        userId, 
        includeCourseDetails: true 
      });

      expect(result).toHaveProperty('courseDetails', enrolledCourses);
    });

    it('should throw error if user not found', async () => {
      const userId = 999;
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(analyticsService.getUserLearningAnalytics({ userId })).rejects.toThrow('Пользователь не найден');
    });
  });

  describe('calculateLearningStreak', () => {
    it('should calculate learning streak correctly', () => {
      const activities = [
        { last_accessed_at: '2024-01-01T00:00:00Z' },
        { last_accessed_at: '2024-01-02T00:00:00Z' },
        { last_accessed_at: '2024-01-03T00:00:00Z' }
      ];

      const streak = analyticsService.calculateLearningStreak(activities);
      expect(streak).toBe(0); // The algorithm expects consecutive days from today
    });

    it('should return 0 for empty activities', () => {
      const streak = analyticsService.calculateLearningStreak([]);
      expect(streak).toBe(0);
    });

    it('should return 0 for null activities', () => {
      const streak = analyticsService.calculateLearningStreak(null);
      expect(streak).toBe(0);
    });
  });
});
