class ProgressController {
  constructor(progressService) {
    this.progressService = progressService;
  }

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