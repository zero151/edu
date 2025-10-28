class TestController {
  constructor(testService) {
    this.testService = testService;
  }

  /**
   * @swagger
   * /api/tests:
   *   post:
   *     tags: [Tests]
   *     summary: Создать тест
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/TestCreate'
   *     responses:
   *       201:
   *         description: Тест создан
   */
  createTest = async (req, res) => {
    try {
      const { course_id, title } = req.body || {};
      const payload = { course_id, title };

      if (!course_id || !title) {
        return res.status(400).json({
          success: false,
          error: 'ID курса и название теста обязательны'
        });
      }

      const test = await this.testService.createTest(payload);
      
      res.status(201).json({
        success: true,
        data: test,
        message: 'Тест успешно создан'
      });

    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  getTestById = async (req, res) => {
    try {
      const testId = parseInt(req.params.id);
      
      if (isNaN(testId)) {
        return res.status(400).json({
          success: false,
          error: 'Некорректный ID теста'
        });
      }

      const test = await this.testService.getTestById(testId);
      
      res.json({
        success: true,
        data: test
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
   * /api/tests/course/{courseId}:
   *   get:
   *     tags: [Tests]
   *     summary: Список тестов по курсу
   *     parameters:
   *       - $ref: '#/components/parameters/courseId'
   *     responses:
   *       200:
   *         description: Успешно
   */
  getTestsByCourseId = async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      
      if (isNaN(courseId)) {
        return res.status(400).json({
          success: false,
          error: 'Некорректный ID курса'
        });
      }

      const tests = await this.testService.getTestsByCourseId(courseId);
      
      res.json({
        success: true,
        data: tests,
        count: tests.length
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
   * /api/tests/{id}:
   *   put:
   *     tags: [Tests]
   *     summary: Обновить тест
   *     parameters:
   *       - $ref: '#/components/parameters/testId'
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/TestUpdate'
   *     responses:
   *       200:
   *         description: Обновлено
   */
  updateTest = async (req, res) => {
    try {
      const testId = parseInt(req.params.id);
      
      if (isNaN(testId)) {
        return res.status(400).json({
          success: false,
          error: 'Некорректный ID теста'
        });
      }

      const { title } = req.body || {};
      const updatePayload = {};
      if (title !== undefined) updatePayload.title = title;
      const test = await this.testService.updateTest(testId, updatePayload);
      
      res.json({
        success: true,
        data: test,
        message: 'Тест успешно обновлен'
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
   * /api/tests/{id}:
   *   delete:
   *     tags: [Tests]
   *     summary: Удалить тест
   *     parameters:
   *       - $ref: '#/components/parameters/testId'
   *     responses:
   *       200:
   *         description: Удалено
   */
  deleteTest = async (req, res) => {
    try {
      const testId = parseInt(req.params.id);
      
      if (isNaN(testId)) {
        return res.status(400).json({
          success: false,
          error: 'Некорректный ID теста'
        });
      }

      await this.testService.deleteTest(testId);
      
      res.json({
        success: true,
        message: 'Тест успешно удален'
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
   * /api/tests/{id}/with-questions:
   *   get:
   *     tags: [Tests]
   *     summary: Тест с вопросами
   *     parameters:
   *       - $ref: '#/components/parameters/testId'
   *     responses:
   *       200:
   *         description: Успешно
   */
  getTestWithQuestions = async (req, res) => {
    try {
      const testId = parseInt(req.params.id);
      
      if (isNaN(testId)) {
        return res.status(400).json({
          success: false,
          error: 'Некорректный ID теста'
        });
      }

      const test = await this.testService.getTestWithQuestions(testId);
      
      res.json({
        success: true,
        data: test
      });

    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = TestController;