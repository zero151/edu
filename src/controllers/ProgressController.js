class ProgressController {
  constructor(progressService) {
    this.progressService = progressService;
  }

  /**
   * @swagger
   * /api/progress/users/{userId}/courses/{courseId}/materials/{materialId}/complete:
   *   post:
   *     tags: [Progress]
   *     summary: Отметить материал как пройденный
   *     parameters:
   *       - $ref: '#/components/parameters/userId'
   *       - $ref: '#/components/parameters/courseId'
   *       - $ref: '#/components/parameters/materialId'
   *     responses:
   *       200:
   *         description: Пройдено
   */
  markMaterialCompleted = async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const courseId = parseInt(req.params.courseId);
      const materialId = parseInt(req.params.materialId);

      if (isNaN(userId) || isNaN(courseId) || isNaN(materialId)) {
        return res.status(400).json({
          success: false,
          error: 'Некорректные параметры'
        });
      }

      const progress = await this.progressService.markMaterialAsCompleted(userId, courseId, materialId);
      
      res.json({
        success: true,
        data: progress,
        message: 'Материал отмечен как пройденный'
      });

    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * @swagger
   * /api/progress/users/{userId}/materials/{materialId}/access:
   *   post:
   *     tags: [Progress]
   *     summary: Продлить доступ к материалу
   *     parameters:
   *       - $ref: '#/components/parameters/userId'
   *       - $ref: '#/components/parameters/materialId'
   *     responses:
   *       200:
   *         description: Время доступа обновлено
   */
  updateMaterialAccess = async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const materialId = parseInt(req.params.materialId);

      if (isNaN(userId) || isNaN(materialId)) {
        return res.status(400).json({
          success: false,
          error: 'Некорректные параметры'
        });
      }

      const progress = await this.progressService.updateMaterialAccess(userId, materialId);
      
      res.json({
        success: true,
        data: progress,
        message: 'Время доступа обновлено'
      });

    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * @swagger
   * /api/progress/users/{userId}/courses/{courseId}/progress:
   *   get:
   *     tags: [Progress]
   *     summary: Прогресс пользователя по курсу
   *     parameters:
   *       - $ref: '#/components/parameters/userId'
   *       - $ref: '#/components/parameters/courseId'
   *     responses:
   *       200:
   *         description: Сводка прогресса
   */
  getCourseProgress = async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const courseId = parseInt(req.params.courseId);

      if (isNaN(userId) || isNaN(courseId)) {
        return res.status(400).json({
          success: false,
          error: 'Некорректные параметры'
        });
      }

      const progress = await this.progressService.getCourseProgress(userId, courseId);
      
      res.json({
        success: true,
        data: progress
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * @swagger
   * /api/progress/users/{userId}/overall-progress:
   *   get:
   *     tags: [Progress]
   *     summary: Общий прогресс пользователя
   *     parameters:
   *       - $ref: '#/components/parameters/userId'
   *     responses:
   *       200:
   *         description: Общий прогресс
   */
  getUserOverallProgress = async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);

      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          error: 'Некорректный ID пользователя'
        });
      }

      const progress = await this.progressService.getUserOverallProgress(userId);
      
      res.json({
        success: true,
        data: progress
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * @swagger
   * /api/progress/users/{userId}/recent-activities:
   *   get:
   *     tags: [Progress]
   *     summary: Последние активности пользователя
   *     parameters:
   *       - $ref: '#/components/parameters/userId'
   *     responses:
   *       200:
   *         description: Список активностей
   */
  getRecentActivities = async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const limit = parseInt(req.query.limit) || 10;

      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          error: 'Некорректный ID пользователя'
        });
      }

      const activities = await this.progressService.getRecentActivities(userId, limit);
      
      res.json({
        success: true,
        data: activities,
        count: activities.length
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = ProgressController;