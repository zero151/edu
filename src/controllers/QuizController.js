class QuizController {
  constructor(quizService) {
    this.quizService = quizService;
  }

  /**
   * @swagger
   * /api/quiz/users/{userId}/tests/{testId}/start:
   *   post:
   *     tags: [Tests]
   *     summary: Начать попытку прохождения теста
   *     parameters:
   *       - $ref: '#/components/parameters/userId'
   *       - $ref: '#/components/parameters/testId'
   *     responses:
   *       200:
   *         description: Попытка начата
   */
  startTest = async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const testId = parseInt(req.params.testId);

      if (isNaN(userId) || isNaN(testId)) {
        return res.status(400).json({
          success: false,
          error: 'Некорректные параметры'
        });
      }

      const attempt = await this.quizService.startTest(userId, testId);
      
      res.json({
        success: true,
        data: attempt,
        message: 'Тест начат'
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
   * /api/quiz/answers/submit:
   *   post:
   *     tags: [Tests]
   *     summary: Отправить ответ на вопрос
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/QuizSubmitAnswer'
   *     responses:
   *       200:
   *         description: Ответ сохранен
   */
  submitAnswer = async (req, res) => {
    try {
      const { attemptId, questionId, selectedOptionId } = req.body || {};
      const payload = { attemptId, questionId };
      if (selectedOptionId !== undefined) payload.selectedOptionId = selectedOptionId;

      if (!attemptId || !questionId) {
        return res.status(400).json({
          success: false,
          error: 'attemptId и questionId обязательны'
        });
      }

      const answer = await this.quizService.submitAnswer(payload.attemptId, payload.questionId, payload.selectedOptionId);
      
      res.json({
        success: true,
        data: answer,
        message: 'Ответ сохранен'
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
   * /api/quiz/attempts/{attemptId}/finish:
   *   post:
   *     tags: [Tests]
   *     summary: Завершить попытку
   *     parameters:
   *       - $ref: '#/components/parameters/attemptId'
   *     responses:
   *       200:
   *         description: Результаты попытки
   */
  finishAttempt = async (req, res) => {
    try {
      const attemptId = parseInt(req.params.attemptId);

      if (isNaN(attemptId)) {
        return res.status(400).json({
          success: false,
          error: 'Некорректный ID попытки'
        });
      }

      const result = await this.quizService.finishAttempt(attemptId);
      
      res.json({
        success: true,
        data: result,
        message: 'Тест завершен'
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
   * /api/quiz/users/{userId}/tests/{testId}/attempts:
   *   get:
   *     tags: [Tests]
   *     summary: Список попыток пользователя по тесту
   *     parameters:
   *       - $ref: '#/components/parameters/userId'
   *       - $ref: '#/components/parameters/testId'
   *     responses:
   *       200:
   *         description: Список попыток
   */
  getUserAttempts = async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const testId = parseInt(req.params.testId);

      if (isNaN(userId) || isNaN(testId)) {
        return res.status(400).json({
          success: false,
          error: 'Некорректные параметры'
        });
      }

      const attempts = await this.quizService.getUserAttempts(userId, testId);
      
      res.json({
        success: true,
        data: attempts,
        count: attempts.length
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
   * /api/quiz/attempts/{attemptId}/details:
   *   get:
   *     tags: [Tests]
   *     summary: Детали попытки
   *     parameters:
   *       - $ref: '#/components/parameters/attemptId'
   *     responses:
   *       200:
   *         description: Детали попытки
   */
  getAttemptDetails = async (req, res) => {
    try {
      const attemptId = parseInt(req.params.attemptId);

      if (isNaN(attemptId)) {
        return res.status(400).json({
          success: false,
          error: 'Некорректный ID попытки'
        });
      }

      const attempt = await this.quizService.getAttemptDetails(attemptId);
      
      res.json({
        success: true,
        data: attempt
      });

    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = QuizController;