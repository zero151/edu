class MaterialController {
  constructor(materialService) {
    this.materialService = materialService;
  }

  /**
   * @swagger
   * /api/materials:
   *   post:
   *     tags: [Materials]
   *     summary: Создать материал курса
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/MaterialCreate'
   *     responses:
   *       201:
   *         description: Материал создан
   */
  createMaterial = async (req, res) => {
    try {
      const { course_id, title, content_url, content_type } = req.body || {};
      const payload = { course_id, title, content_url, content_type };

      if (!course_id || !title || !content_url || !content_type) {
        return res.status(400).json({
          success: false,
          error: 'Все поля обязательны для заполнения'
        });
      }

      const material = await this.materialService.createMaterial(payload);
      
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

  /**
   * @swagger
   * /api/materials/course/{courseId}:
   *   get:
   *     tags: [Materials]
   *     summary: Список материалов курса
   *     parameters:
   *       - $ref: '#/components/parameters/courseId'
   *     responses:
   *       200:
   *         description: Успешно
   */
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

  /**
   * @swagger
   * /api/materials/{id}:
   *   put:
   *     tags: [Materials]
   *     summary: Обновить материал
   *     parameters:
   *       - $ref: '#/components/parameters/materialId'
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/MaterialUpdate'
   *     responses:
   *       200:
   *         description: Обновлено
   */
  updateMaterial = async (req, res) => {
    try {
      const materialId = parseInt(req.params.id);
      
      if (isNaN(materialId)) {
        return res.status(400).json({
          success: false,
          error: 'Некорректный ID материала'
        });
      }

      const { title, content_url, content_type } = req.body || {};
      const updatePayload = {};
      if (title !== undefined) updatePayload.title = title;
      if (content_url !== undefined) updatePayload.content_url = content_url;
      if (content_type !== undefined) updatePayload.content_type = content_type;
      const material = await this.materialService.updateMaterial(materialId, updatePayload);
      
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

  /**
   * @swagger
   * /api/materials/{id}:
   *   delete:
   *     tags: [Materials]
   *     summary: Удалить материал
   *     parameters:
   *       - $ref: '#/components/parameters/materialId'
   *     responses:
   *       200:
   *         description: Удалено
   */
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

  /**
   * @swagger
   * /api/materials/next/{courseId}/{currentOrderIndex}:
   *   get:
   *     tags: [Materials]
   *     summary: Следующий материал в курсе
   *     parameters:
   *       - $ref: '#/components/parameters/courseId'
   *       - in: path
   *         name: currentOrderIndex
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Успешно
   */
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