const TestService = require('../../services/TestService');

describe('TestService', () => {
  let testService;
  let mockTestRepository;

  beforeEach(() => {
    mockTestRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByCourseId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findWithQuestions: jest.fn(),
      getTestStats: jest.fn()
    };
    testService = new TestService(mockTestRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTest', () => {
    it('should create test successfully', async () => {
      const testData = {
        course_id: 1,
        title: 'JavaScript Fundamentals Test'
      };
      const createdTest = {
        id: 1,
        ...testData,
        created_at: '2024-01-01T00:00:00Z'
      };

      mockTestRepository.create.mockResolvedValue(createdTest);

      const result = await testService.createTest(testData);

      expect(mockTestRepository.create).toHaveBeenCalledWith(testData);
      expect(result).toEqual(createdTest);
    });
  });

  describe('getTestById', () => {
    it('should return test by id', async () => {
      const testId = 1;
      const test = {
        id: testId,
        course_id: 1,
        title: 'JavaScript Fundamentals Test'
      };

      mockTestRepository.findById.mockResolvedValue(test);

      const result = await testService.getTestById(testId);

      expect(mockTestRepository.findById).toHaveBeenCalledWith(testId);
      expect(result).toEqual(test);
    });

    it('should throw error if test not found', async () => {
      const testId = 999;
      mockTestRepository.findById.mockResolvedValue(null);

      await expect(testService.getTestById(testId)).rejects.toThrow('Тест не найден');
    });
  });

  describe('getTestsByCourseId', () => {
    it('should return tests for course', async () => {
      const courseId = 1;
      const tests = [
        { id: 1, course_id: courseId, title: 'Test 1' },
        { id: 2, course_id: courseId, title: 'Test 2' }
      ];

      mockTestRepository.findByCourseId.mockResolvedValue(tests);

      const result = await testService.getTestsByCourseId(courseId);

      expect(mockTestRepository.findByCourseId).toHaveBeenCalledWith(courseId);
      expect(result).toEqual(tests);
    });
  });

  describe('updateTest', () => {
    it('should update test successfully', async () => {
      const testId = 1;
      const testData = { title: 'Updated Test' };
      const updatedTest = {
        id: testId,
        ...testData,
        updated_at: '2024-01-01T00:00:00Z'
      };

      mockTestRepository.update.mockResolvedValue(updatedTest);

      const result = await testService.updateTest(testId, testData);

      expect(mockTestRepository.update).toHaveBeenCalledWith(testId, testData);
      expect(result).toEqual(updatedTest);
    });
  });

  describe('deleteTest', () => {
    it('should delete test successfully', async () => {
      const testId = 1;
      mockTestRepository.delete.mockResolvedValue(true);

      const result = await testService.deleteTest(testId);

      expect(mockTestRepository.delete).toHaveBeenCalledWith(testId);
      expect(result).toBe(true);
    });
  });

  describe('getTestWithQuestions', () => {
    it('should return test with questions', async () => {
      const testId = 1;
      const testWithQuestions = {
        id: testId,
        title: 'JavaScript Test',
        questions: [
          { id: 1, question_text: 'What is JavaScript?' },
          { id: 2, question_text: 'What is a variable?' }
        ]
      };

      mockTestRepository.findWithQuestions.mockResolvedValue(testWithQuestions);

      const result = await testService.getTestWithQuestions(testId);

      expect(mockTestRepository.findWithQuestions).toHaveBeenCalledWith(testId);
      expect(result).toEqual(testWithQuestions);
    });
  });

  describe('getTestStats', () => {
    it('should return test statistics', async () => {
      const testId = 1;
      const stats = {
        total_attempts: 50,
        average_score: 75.5,
        completion_rate: 80
      };

      mockTestRepository.getTestStats.mockResolvedValue(stats);

      const result = await testService.getTestStats(testId);

      expect(mockTestRepository.getTestStats).toHaveBeenCalledWith(testId);
      expect(result).toEqual(stats);
    });
  });
});
