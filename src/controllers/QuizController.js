class QuizController {
  constructor(quizService) {
    this.quizService = quizService;
  }

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

  submitAnswer = async (req, res) => {
    try {
      const { attemptId, questionId, selectedOptionId } = req.body;

      if (!attemptId || !questionId) {
        return res.status(400).json({
          success: false,
          error: 'attemptId и questionId обязательны'
        });
      }

      const answer = await this.quizService.submitAnswer(attemptId, questionId, selectedOptionId);
      
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