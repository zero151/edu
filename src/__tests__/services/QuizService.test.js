const QuizService = require('../../services/QuizService');

describe('QuizService', () => {
  let quizService;
  let mockQuizAttemptRepository;
  let mockUserAnswerRepository;
  let mockTestRepository;
  let mockAnswerOptionRepository;

  beforeEach(() => {
    mockQuizAttemptRepository = {
      getActiveAttempt: jest.fn(),
      startAttempt: jest.fn(),
      findById: jest.fn(),
      finishAttempt: jest.fn(),
      getUserAttempts: jest.fn(),
      getAttemptWithDetails: jest.fn()
    };
    mockUserAnswerRepository = {
      createUserAnswer: jest.fn(),
      getAttemptScore: jest.fn()
    };
    mockTestRepository = {
      findById: jest.fn()
    };
    mockAnswerOptionRepository = {
      findById: jest.fn()
    };

    quizService = new QuizService(
      mockQuizAttemptRepository,
      mockUserAnswerRepository,
      mockTestRepository,
      mockAnswerOptionRepository
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('startTest', () => {
    it('should start new test attempt', async () => {
      const userId = 1;
      const testId = 1;
      const test = { id: testId, title: 'JavaScript Test' };
      const newAttempt = {
        id: 1,
        user_id: userId,
        test_id: testId,
        started_at: '2024-01-01T00:00:00Z'
      };

      mockTestRepository.findById.mockResolvedValue(test);
      mockQuizAttemptRepository.getActiveAttempt.mockResolvedValue(null);
      mockQuizAttemptRepository.startAttempt.mockResolvedValue(newAttempt);

      const result = await quizService.startTest(userId, testId);

      expect(mockTestRepository.findById).toHaveBeenCalledWith(testId);
      expect(mockQuizAttemptRepository.getActiveAttempt).toHaveBeenCalledWith(userId, testId);
      expect(mockQuizAttemptRepository.startAttempt).toHaveBeenCalledWith(userId, testId);
      expect(result).toEqual(newAttempt);
    });

    it('should return existing active attempt', async () => {
      const userId = 1;
      const testId = 1;
      const test = { id: testId, title: 'JavaScript Test' };
      const activeAttempt = {
        id: 1,
        user_id: userId,
        test_id: testId,
        started_at: '2024-01-01T00:00:00Z'
      };

      mockTestRepository.findById.mockResolvedValue(test);
      mockQuizAttemptRepository.getActiveAttempt.mockResolvedValue(activeAttempt);

      const result = await quizService.startTest(userId, testId);

      expect(mockQuizAttemptRepository.startAttempt).not.toHaveBeenCalled();
      expect(result).toEqual(activeAttempt);
    });

    it('should throw error if test not found', async () => {
      const userId = 1;
      const testId = 999;

      mockTestRepository.findById.mockResolvedValue(null);

      await expect(quizService.startTest(userId, testId)).rejects.toThrow('Тест не найден');
    });
  });

  describe('submitAnswer', () => {
    it('should submit answer successfully', async () => {
      const attemptId = 1;
      const questionId = 1;
      const selectedOptionId = 2;
      const attempt = {
        id: attemptId,
        user_id: 1,
        test_id: 1,
        finished_at: null
      };
      const userAnswer = {
        id: 1,
        attempt_id: attemptId,
        question_id: questionId,
        selected_option_id: selectedOptionId
      };

      mockQuizAttemptRepository.findById.mockResolvedValue(attempt);
      mockUserAnswerRepository.createUserAnswer.mockResolvedValue(userAnswer);

      const result = await quizService.submitAnswer(attemptId, questionId, selectedOptionId);

      expect(mockQuizAttemptRepository.findById).toHaveBeenCalledWith(attemptId);
      expect(mockUserAnswerRepository.createUserAnswer).toHaveBeenCalledWith(
        attemptId,
        questionId,
        selectedOptionId
      );
      expect(result).toEqual(userAnswer);
    });

    it('should throw error if attempt not found', async () => {
      const attemptId = 999;
      const questionId = 1;
      const selectedOptionId = 2;

      mockQuizAttemptRepository.findById.mockResolvedValue(null);

      await expect(quizService.submitAnswer(attemptId, questionId, selectedOptionId))
        .rejects.toThrow('Попытка не найдена');
    });

    it('should throw error if attempt already finished', async () => {
      const attemptId = 1;
      const questionId = 1;
      const selectedOptionId = 2;
      const finishedAttempt = {
        id: attemptId,
        user_id: 1,
        test_id: 1,
        finished_at: '2024-01-01T01:00:00Z'
      };

      mockQuizAttemptRepository.findById.mockResolvedValue(finishedAttempt);

      await expect(quizService.submitAnswer(attemptId, questionId, selectedOptionId))
        .rejects.toThrow('Попытка уже завершена');
    });
  });

  describe('finishAttempt', () => {
    it('should finish attempt and calculate score', async () => {
      const attemptId = 1;
      const attempt = {
        id: attemptId,
        user_id: 1,
        test_id: 1,
        finished_at: null
      };
      const scoreResult = { score_percentage: 85 };
      const finishedAttempt = {
        id: attemptId,
        score: 85,
        finished_at: '2024-01-01T01:00:00Z'
      };

      mockQuizAttemptRepository.findById.mockResolvedValue(attempt);
      mockUserAnswerRepository.getAttemptScore.mockResolvedValue(scoreResult);
      mockQuizAttemptRepository.finishAttempt.mockResolvedValue(finishedAttempt);

      const result = await quizService.finishAttempt(attemptId);

      expect(mockQuizAttemptRepository.findById).toHaveBeenCalledWith(attemptId);
      expect(mockUserAnswerRepository.getAttemptScore).toHaveBeenCalledWith(attemptId);
      expect(mockQuizAttemptRepository.finishAttempt).toHaveBeenCalledWith(attemptId, 85);
      expect(result).toEqual(finishedAttempt);
    });

    it('should throw error if attempt not found', async () => {
      const attemptId = 999;

      mockQuizAttemptRepository.findById.mockResolvedValue(null);

      await expect(quizService.finishAttempt(attemptId)).rejects.toThrow('Попытка не найдена');
    });
  });

  describe('getUserAttempts', () => {
    it('should return user attempts for test', async () => {
      const userId = 1;
      const testId = 1;
      const attempts = [
        { id: 1, user_id: userId, test_id: testId, score: 85 },
        { id: 2, user_id: userId, test_id: testId, score: 92 }
      ];

      mockQuizAttemptRepository.getUserAttempts.mockResolvedValue(attempts);

      const result = await quizService.getUserAttempts(userId, testId);

      expect(mockQuizAttemptRepository.getUserAttempts).toHaveBeenCalledWith(userId, testId);
      expect(result).toEqual(attempts);
    });
  });

  describe('getAttemptDetails', () => {
    it('should return attempt with details', async () => {
      const attemptId = 1;
      const attemptDetails = {
        id: attemptId,
        user_id: 1,
        test_id: 1,
        score: 85,
        answers: [
          { question_id: 1, selected_option_id: 2, is_correct: true },
          { question_id: 2, selected_option_id: 3, is_correct: false }
        ]
      };

      mockQuizAttemptRepository.getAttemptWithDetails.mockResolvedValue(attemptDetails);

      const result = await quizService.getAttemptDetails(attemptId);

      expect(mockQuizAttemptRepository.getAttemptWithDetails).toHaveBeenCalledWith(attemptId);
      expect(result).toEqual(attemptDetails);
    });
  });
});
