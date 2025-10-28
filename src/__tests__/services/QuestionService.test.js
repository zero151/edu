const QuestionService = require('../../services/QuestionService');

describe('QuestionService', () => {
  let questionService;
  let mockQuestionRepository;

  beforeEach(() => {
    mockQuestionRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByTestId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findWithAnswers: jest.fn(),
      getCorrectAnswers: jest.fn()
    };
    questionService = new QuestionService(mockQuestionRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createQuestion', () => {
    it('should create question successfully', async () => {
      const questionData = {
        test_id: 1,
        question_text: 'What is JavaScript?',
        question_type: 'single_choice'
      };
      const createdQuestion = {
        id: 1,
        ...questionData,
        created_at: '2024-01-01T00:00:00Z'
      };

      mockQuestionRepository.create.mockResolvedValue(createdQuestion);

      const result = await questionService.createQuestion(questionData);

      expect(mockQuestionRepository.create).toHaveBeenCalledWith(questionData);
      expect(result).toEqual(createdQuestion);
    });
  });

  describe('getQuestionById', () => {
    it('should return question by id', async () => {
      const questionId = 1;
      const question = {
        id: questionId,
        test_id: 1,
        question_text: 'What is JavaScript?',
        question_type: 'single_choice'
      };

      mockQuestionRepository.findById.mockResolvedValue(question);

      const result = await questionService.getQuestionById(questionId);

      expect(mockQuestionRepository.findById).toHaveBeenCalledWith(questionId);
      expect(result).toEqual(question);
    });

    it('should throw error if question not found', async () => {
      const questionId = 999;
      mockQuestionRepository.findById.mockResolvedValue(null);

      await expect(questionService.getQuestionById(questionId)).rejects.toThrow('Вопрос не найден');
    });
  });

  describe('getQuestionsByTestId', () => {
    it('should return questions for test', async () => {
      const testId = 1;
      const questions = [
        { id: 1, test_id: testId, question_text: 'Question 1' },
        { id: 2, test_id: testId, question_text: 'Question 2' }
      ];

      mockQuestionRepository.findByTestId.mockResolvedValue(questions);

      const result = await questionService.getQuestionsByTestId(testId);

      expect(mockQuestionRepository.findByTestId).toHaveBeenCalledWith(testId);
      expect(result).toEqual(questions);
    });
  });

  describe('updateQuestion', () => {
    it('should update question successfully', async () => {
      const questionId = 1;
      const questionData = { question_text: 'Updated question?' };
      const updatedQuestion = {
        id: questionId,
        ...questionData,
        updated_at: '2024-01-01T00:00:00Z'
      };

      mockQuestionRepository.update.mockResolvedValue(updatedQuestion);

      const result = await questionService.updateQuestion(questionId, questionData);

      expect(mockQuestionRepository.update).toHaveBeenCalledWith(questionId, questionData);
      expect(result).toEqual(updatedQuestion);
    });
  });

  describe('deleteQuestion', () => {
    it('should delete question successfully', async () => {
      const questionId = 1;
      mockQuestionRepository.delete.mockResolvedValue(true);

      const result = await questionService.deleteQuestion(questionId);

      expect(mockQuestionRepository.delete).toHaveBeenCalledWith(questionId);
      expect(result).toBe(true);
    });
  });

  describe('getQuestionWithAnswers', () => {
    it('should return question with answer options', async () => {
      const questionId = 1;
      const questionWithAnswers = {
        id: questionId,
        question_text: 'What is JavaScript?',
        question_type: 'single_choice',
        answer_options: [
          { id: 1, option_text: 'A programming language', is_correct: true },
          { id: 2, option_text: 'A database', is_correct: false }
        ]
      };

      mockQuestionRepository.findWithAnswers.mockResolvedValue(questionWithAnswers);

      const result = await questionService.getQuestionWithAnswers(questionId);

      expect(mockQuestionRepository.findWithAnswers).toHaveBeenCalledWith(questionId);
      expect(result).toEqual(questionWithAnswers);
    });
  });

  describe('getCorrectAnswers', () => {
    it('should return correct answers for question', async () => {
      const questionId = 1;
      const correctAnswers = [
        { id: 1, option_text: 'Correct answer 1', is_correct: true },
        { id: 2, option_text: 'Correct answer 2', is_correct: true }
      ];

      mockQuestionRepository.getCorrectAnswers.mockResolvedValue(correctAnswers);

      const result = await questionService.getCorrectAnswers(questionId);

      expect(mockQuestionRepository.getCorrectAnswers).toHaveBeenCalledWith(questionId);
      expect(result).toEqual(correctAnswers);
    });
  });
});
