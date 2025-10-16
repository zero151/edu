class QuizService {
  constructor(
    quizAttemptRepository, 
    userAnswerRepository, 
    testRepository,
    answerOptionRepository
  ) {
    this.quizAttemptRepository = quizAttemptRepository;
    this.userAnswerRepository = userAnswerRepository;
    this.testRepository = testRepository;
    this.answerOptionRepository = answerOptionRepository;
  }

  async startTest(userId, testId) {
    // Проверяем существование теста
    const test = await this.testRepository.findById(testId);
    if (!test) {
      throw new Error('Тест не найден');
    }

    // Проверяем активные попытки
    const activeAttempt = await this.quizAttemptRepository.getActiveAttempt(userId, testId);
    if (activeAttempt) {
      return activeAttempt;
    }

    // Создаем новую попытку
    return await this.quizAttemptRepository.startAttempt(userId, testId);
  }

  async submitAnswer(attemptId, questionId, selectedOptionId) {
    // Проверяем существование попытки
    const attempt = await this.quizAttemptRepository.findById(attemptId);
    if (!attempt) {
      throw new Error('Попытка не найдена');
    }

    if (attempt.finished_at) {
      throw new Error('Попытка уже завершена');
    }

    // Сохраняем ответ пользователя
    return await this.userAnswerRepository.createUserAnswer(
      attemptId, 
      questionId, 
      selectedOptionId
    );
  }

  async finishAttempt(attemptId) {
    const attempt = await this.quizAttemptRepository.findById(attemptId);
    if (!attempt) {
      throw new Error('Попытка не найдена');
    }

    // Рассчитываем score
    const scoreResult = await this.userAnswerRepository.getAttemptScore(attemptId);
    const score = scoreResult.score_percentage;

    // Завершаем попытку
    return await this.quizAttemptRepository.finishAttempt(attemptId, score);
  }

  async getUserAttempts(userId, testId) {
    return await this.quizAttemptRepository.getUserAttempts(userId, testId);
  }

  async getAttemptDetails(attemptId) {
    return await this.quizAttemptRepository.getAttemptWithDetails(attemptId);
  }
}

module.exports = QuizService;