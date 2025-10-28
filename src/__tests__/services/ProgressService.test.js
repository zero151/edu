const ProgressService = require('../../services/ProgressService');

describe('ProgressService', () => {
  let progressService;
  let mockProgressRepository;

  beforeEach(() => {
    mockProgressRepository = {
      markAsCompleted: jest.fn(),
      updateLastAccessed: jest.fn(),
      getCourseProgress: jest.fn(),
      getUserOverallProgress: jest.fn(),
      getRecentActivities: jest.fn()
    };
    progressService = new ProgressService(mockProgressRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('markMaterialAsCompleted', () => {
    it('should mark material as completed', async () => {
      const userId = 1;
      const courseId = 1;
      const materialId = 1;
      const progress = {
        id: 1,
        user_id: userId,
        course_id: courseId,
        material_id: materialId,
        completed_at: '2024-01-01T00:00:00Z'
      };

      mockProgressRepository.markAsCompleted.mockResolvedValue(progress);

      const result = await progressService.markMaterialAsCompleted(userId, courseId, materialId);

      expect(mockProgressRepository.markAsCompleted).toHaveBeenCalledWith(userId, courseId, materialId);
      expect(result).toEqual(progress);
    });
  });

  describe('updateMaterialAccess', () => {
    it('should update material access time', async () => {
      const userId = 1;
      const materialId = 1;
      const updatedProgress = {
        id: 1,
        user_id: userId,
        material_id: materialId,
        last_accessed_at: '2024-01-01T00:00:00Z'
      };

      mockProgressRepository.updateLastAccessed.mockResolvedValue(updatedProgress);

      const result = await progressService.updateMaterialAccess(userId, materialId);

      expect(mockProgressRepository.updateLastAccessed).toHaveBeenCalledWith(userId, materialId);
      expect(result).toEqual(updatedProgress);
    });
  });

  describe('getCourseProgress', () => {
    it('should return course progress for user', async () => {
      const userId = 1;
      const courseId = 1;
      const courseProgress = {
        course_id: courseId,
        completed_materials: 5,
        total_materials: 10,
        completion_percentage: 50
      };

      mockProgressRepository.getCourseProgress.mockResolvedValue(courseProgress);

      const result = await progressService.getCourseProgress(userId, courseId);

      expect(mockProgressRepository.getCourseProgress).toHaveBeenCalledWith(userId, courseId);
      expect(result).toEqual(courseProgress);
    });
  });

  describe('getUserOverallProgress', () => {
    it('should return user overall progress', async () => {
      const userId = 1;
      const overallProgress = {
        enrolled_courses_count: 3,
        completed_materials_count: 15,
        total_materials_count: 30,
        overall_completion_percentage: 50
      };

      mockProgressRepository.getUserOverallProgress.mockResolvedValue(overallProgress);

      const result = await progressService.getUserOverallProgress(userId);

      expect(mockProgressRepository.getUserOverallProgress).toHaveBeenCalledWith(userId);
      expect(result).toEqual(overallProgress);
    });
  });

  describe('getRecentActivities', () => {
    it('should return recent activities with default limit', async () => {
      const userId = 1;
      const activities = [
        { id: 1, type: 'material_completed', material_id: 1, occurred_at: '2024-01-01T00:00:00Z' },
        { id: 2, type: 'test_completed', test_id: 1, occurred_at: '2024-01-01T01:00:00Z' }
      ];

      mockProgressRepository.getRecentActivities.mockResolvedValue(activities);

      const result = await progressService.getRecentActivities(userId);

      expect(mockProgressRepository.getRecentActivities).toHaveBeenCalledWith(userId, 10);
      expect(result).toEqual(activities);
    });

    it('should return recent activities with custom limit', async () => {
      const userId = 1;
      const limit = 5;
      const activities = [
        { id: 1, type: 'material_completed', material_id: 1, occurred_at: '2024-01-01T00:00:00Z' }
      ];

      mockProgressRepository.getRecentActivities.mockResolvedValue(activities);

      const result = await progressService.getRecentActivities(userId, limit);

      expect(mockProgressRepository.getRecentActivities).toHaveBeenCalledWith(userId, limit);
      expect(result).toEqual(activities);
    });
  });
});
