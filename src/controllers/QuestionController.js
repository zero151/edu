class QuestionController {
  constructor(questionService) {
    this.questionService = questionService;
  }

  createQuestion = async (req, res) => {
    try {
      const { test_id, question_text, question_type } = req.body;

      if (!test_id || !question_text || !question_type) {
        return res.status(400).json({
          success: false,
          error: 'Все поля обязательны для заполнения'
        });
      }

      const question = await this.questionService.createQuestion(req.body);
      
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

  updateQuestion = async (req, res) => {
    try {
      const questionId = parseInt(req.params.id);
      
      if (isNaN(questionId)) {
        return res.status(400).json({
          success: false,
          error: 'Некорректный ID вопроса'
        });
      }

      const question = await this.questionService.updateQuestion(questionId, req.body);
      
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