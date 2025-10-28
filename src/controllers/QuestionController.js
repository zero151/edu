class QuestionController {
  constructor(questionService) {
    this.questionService = questionService;
  }

  /**
   * @swagger
   * /api/questions:
   *   post:
   *     tags: [Tests]
   *     summary: Создать вопрос
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/QuestionCreate'
   *     responses:
   *       201:
   *         description: Вопрос создан
   */
  createQuestion = async (req, res) => {
    try {
      const { test_id, question_text, question_type } = req.body || {};
      const payload = { test_id, question_text, question_type };

      if (!test_id || !question_text || !question_type) {
        return res.status(400).json({
          success: false,
          error: 'Все поля обязательны для заполнения'
        });
      }

      const question = await this.questionService.createQuestion(payload);
      
      res.status(201).json({
        success: true,
        data: question,
        message: 'Вопрос успешно создан'
      });

    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  getQuestionById = async (req, res) => {
    try {
      const questionId = parseInt(req.params.id);
      
      if (isNaN(questionId)) {
        return res.status(400).json({
          success: false,
          error: 'Некорректный ID вопроса'
        });
      }

      const question = await this.questionService.getQuestionById(questionId);
      
      res.json({
        success: true,
        data: question
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
   * /api/questions/test/{testId}:
   *   get:
   *     tags: [Tests]
   *     summary: Список вопросов по тесту
   *     parameters:
   *       - $ref: '#/components/parameters/testId'
   *     responses:
   *       200:
   *         description: Успешно
   */
  getQuestionsByTestId = async (req, res) => {
    try {
      const testId = parseInt(req.params.testId);
      
      if (isNaN(testId)) {
        return res.status(400).json({
          success: false,
          error: 'Некорректный ID теста'
        });
      }

      const questions = await this.questionService.getQuestionsByTestId(testId);
      
      res.json({
        success: true,
        data: questions,
        count: questions.length
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
   * /api/questions/{id}:
   *   put:
   *     tags: [Tests]
   *     summary: Обновить вопрос
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/QuestionUpdate'
   *     responses:
   *       200:
   *         description: Обновлено
   */
  updateQuestion = async (req, res) => {
    try {
      const questionId = parseInt(req.params.id);
      
      if (isNaN(questionId)) {
        return res.status(400).json({
          success: false,
          error: 'Некорректный ID вопроса'
        });
      }

      const { question_text, question_type } = req.body || {};
      const updatePayload = {};
      if (question_text !== undefined) updatePayload.question_text = question_text;
      if (question_type !== undefined) updatePayload.question_type = question_type;
      const question = await this.questionService.updateQuestion(questionId, updatePayload);
      
      res.json({
        success: true,
        data: question,
        message: 'Вопрос успешно обновлен'
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
   * /api/questions/{id}:
   *   delete:
   *     tags: [Tests]
   *     summary: Удалить вопрос
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Удалено
   */
  deleteQuestion = async (req, res) => {
    try {
      const questionId = parseInt(req.params.id);
      
      if (isNaN(questionId)) {
        return res.status(400).json({
          success: false,
          error: 'Некорректный ID вопроса'
        });
      }

      await this.questionService.deleteQuestion(questionId);
      
      res.json({
        success: true,
        message: 'Вопрос успешно удален'
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
   * /api/questions/{id}/with-answers:
   *   get:
   *     tags: [Tests]
   *     summary: Вопрос с вариантами ответов
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Успешно
   */
  getQuestionWithAnswers = async (req, res) => {
    try {
      const questionId = parseInt(req.params.id);
      
      if (isNaN(questionId)) {
        return res.status(400).json({
          success: false,
          error: 'Некорректный ID вопроса'
        });
      }

      const question = await this.questionService.getQuestionWithAnswers(questionId);
      
      res.json({
        success: true,
        data: question
      });

    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = QuestionController;