class QuestionService {
  constructor(questionRepository) {
    this.questionRepository = questionRepository;
  }

  async createQuestion(questionData) {
    return await this.questionRepository.create(questionData);
  }

  async getQuestionById(questionId) {
    const question = await this.questionRepository.findById(questionId);
    if (!question) {
      throw new Error('Вопрос не найден');
    }
    return question;
  }

  async getQuestionsByTestId(testId) {
    return await this.questionRepository.findByTestId(testId);
  }

  async updateQuestion(questionId, questionData) {
    return await this.questionRepository.update(questionId, questionData);
  }

  async deleteQuestion(questionId) {
    return await this.questionRepository.delete(questionId);
  }

  async getQuestionWithAnswers(questionId) {
    return await this.questionRepository.findWithAnswers(questionId);
  }

  async getCorrectAnswers(questionId) {
    return await this.questionRepository.getCorrectAnswers(questionId);
  }
}

module.exports = QuestionService;