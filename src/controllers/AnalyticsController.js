const Joi = require('joi');

class AnalyticsController {
  constructor(analyticsService) {
    this.analyticsService = analyticsService;
  }

  getPlatformStats = async (req, res) => {
    try {
      // Валидация query параметров
      const { error } = Joi.object({
        period: Joi.string().valid('day', 'week', 'month', 'year'),
        includeDetails: Joi.boolean()
      }).validate(req.query);

      if (error) {
        return res.status(400).json({
          success: false,
          error: `Неверные параметры запроса: ${error.details[0].message}`
        });
      }

      const stats = await this.analyticsService.getPlatformStats(req.query);
      
      res.json({
        success: true,
        data: stats
      });

    } catch (error) {
      console.error('Error in getPlatformStats:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  getCourseAnalytics = async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);

      // Валидация параметров
      const { error } = Joi.object({
        courseId: Joi.number().integer().positive().required()
      }).validate({ courseId });

      if (error) {
        return res.status(400).json({
          success: false,
          error: 'Некорректный ID курса'
        });
      }

      // Валидация query параметров
      const queryValidation = Joi.object({
        startDate: Joi.date().optional(),
        endDate: Joi.date().optional(),
        groupBy: Joi.string().valid('day', 'week', 'month').default('week')
      }).validate(req.query);

      if (queryValidation.error) {
        return res.status(400).json({
          success: false,
          error: `Неверные параметры запроса: ${queryValidation.error.details[0].message}`
        });
      }

      const analytics = await this.analyticsService.getCourseAnalytics({
        courseId,
        ...req.query
      });
      
      res.json({
        success: true,
        data: analytics
      });

    } catch (error) {
      console.error('Error in getCourseAnalytics:', error);
      if (error.message === 'Курс не найден') {
        return res.status(404).json({
          success: false,
          error: error.message
        });
      }
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  getUserLearningAnalytics = async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);

      // Валидация параметров
      const { error } = Joi.object({
        userId: Joi.number().integer().positive().required()
      }).validate({ userId });

      if (error) {
        return res.status(400).json({
          success: false,
          error: 'Некорректный ID пользователя'
        });
      }

      // Валидация query параметров
      const queryValidation = Joi.object({
        period: Joi.string().valid('day', 'week', 'month', 'all').default('month'),
        includeCourseDetails: Joi.boolean().default(true)
      }).validate(req.query);

      if (queryValidation.error) {
        return res.status(400).json({
          success: false,
          error: `Неверные параметры запроса: ${queryValidation.error.details[0].message}`
        });
      }

      const analytics = await this.analyticsService.getUserLearningAnalytics({
        userId,
        ...req.query
      });
      
      res.json({
        success: true,
        data: analytics
      });

    } catch (error) {
      console.error('Error in getUserLearningAnalytics:', error);
      if (error.message === 'Пользователь не найден') {
        return res.status(404).json({
          success: false,
          error: error.message
        });
      }
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  getLearningTrends = async (req, res) => {
    try {
      // Валидация query параметров
      const { error } = Joi.object({
        period: Joi.string().valid('week', 'month', 'quarter', 'year').default('month'),
        metric: Joi.string().valid('completion', 'engagement', 'performance').default('completion')
      }).validate(req.query);

      if (error) {
        return res.status(400).json({
          success: false,
          error: `Неверные параметры запроса: ${error.details[0].message}`
        });
      }

      // Здесь можно добавить логику для трендов обучения
      const trends = {
        period: req.query.period,
        metric: req.query.metric,
        data: [
          { date: '2024-01-01', value: 65 },
          { date: '2024-01-08', value: 72 },
          { date: '2024-01-15', value: 68 },
          { date: '2024-01-22', value: 75 },
          { date: '2024-01-29', value: 80 }
        ],
        summary: {
          trend: 'up',
          change: 15,
          average: 72
        }
      };
      
      res.json({
        success: true,
        data: trends
      });

    } catch (error) {
      console.error('Error in getLearningTrends:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = AnalyticsController;