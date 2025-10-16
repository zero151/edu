class TestService {
  constructor(testRepository) {
    this.testRepository = testRepository;
  }

  async createTest(testData) {
    return await this.testRepository.create(testData);
  }

  async getTestById(testId) {
    const test = await this.testRepository.findById(testId);
    if (!test) {
      throw new Error('Тест не найден');
    }
    return test;
  }

  async getTestsByCourseId(courseId) {
    return await this.testRepository.findByCourseId(courseId);
  }

  async updateTest(testId, testData) {
    return await this.testRepository.update(testId, testData);
  }

  async deleteTest(testId) {
    return await this.testRepository.delete(testId);
  }

  async getTestWithQuestions(testId) {
    return await this.testRepository.findWithQuestions(testId);
  }

  async getTestStats(testId) {
    return await this.testRepository.getTestStats(testId);
  }
}

module.exports = TestService;