class MaterialController {
  constructor(materialService) {
    this.materialService = materialService;
  }

  createMaterial = async (req, res) => {
    try {
      const { course_id, title, content_url, content_type } = req.body;

      if (!course_id || !title || !content_url || !content_type) {
        return res.status(400).json({
          success: false,
          error: 'Все поля обязательны для заполнения'
        });
      }

      const material = await this.materialService.createMaterial(req.body);
      
      res.status(201).json({
        success: true,
        data: material,
        message: 'Материал успешно создан'
      });

    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  getMaterialById = async (req, res) => {
    try {
      const materialId = parseInt(req.params.id);
      
      if (isNaN(materialId)) {
        return res.status(400).json({
          success: false,
          error: 'Некорректный ID материала'
        });
      }

      const material = await this.materialService.getMaterialById(materialId);
      
      res.json({
        success: true,
        data: material
      });

    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  getMaterialsByCourseId = async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      
      if (isNaN(courseId)) {
        return res.status(400).json({
          success: false,
          error: 'Некорректный ID курса'
        });
      }

      const materials = await this.materialService.getMaterialsByCourseId(courseId);
      
      res.json({
        success: true,
        data: materials,
        count: materials.length
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  updateMaterial = async (req, res) => {
    try {
      const materialId = parseInt(req.params.id);
      
      if (isNaN(materialId)) {
        return res.status(400).json({
          success: false,
          error: 'Некорректный ID материала'
        });
      }

      const material = await this.materialService.updateMaterial(materialId, req.body);
      
      res.json({
        success: true,
        data: material,
        message: 'Материал успешно обновлен'
      });

    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  deleteMaterial = async (req, res) => {
    try {
      const materialId = parseInt(req.params.id);
      
      if (isNaN(materialId)) {
        return res.status(400).json({
          success: false,
          error: 'Некорректный ID материала'
        });
      }

      await this.materialService.deleteMaterial(materialId);
      
      res.json({
        success: true,
        message: 'Материал успешно удален'
      });

    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  getNextMaterial = async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const currentOrderIndex = parseInt(req.params.currentOrderIndex);
      
      if (isNaN(courseId) || isNaN(currentOrderIndex)) {
        return res.status(400).json({
          success: false,
          error: 'Некорректные параметры'
        });
      }

      const nextMaterial = await this.materialService.getNextMaterial(courseId, currentOrderIndex);
      
      res.json({
        success: true,
        data: nextMaterial
      });

    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = MaterialController;