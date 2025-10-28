const MaterialService = require('../../services/MaterialService');

describe('MaterialService', () => {
  let materialService;
  let mockMaterialRepository;

  beforeEach(() => {
    mockMaterialRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByCourseId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getNextMaterial: jest.fn(),
      findWithCourseInfo: jest.fn()
    };
    materialService = new MaterialService(mockMaterialRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createMaterial', () => {
    it('should create material successfully', async () => {
      const materialData = {
        course_id: 1,
        title: 'Introduction to JavaScript',
        content_url: 'https://example.com/video.mp4',
        content_type: 'video'
      };
      const createdMaterial = {
        id: 1,
        ...materialData,
        created_at: '2024-01-01T00:00:00Z'
      };

      mockMaterialRepository.create.mockResolvedValue(createdMaterial);

      const result = await materialService.createMaterial(materialData);

      expect(mockMaterialRepository.create).toHaveBeenCalledWith(materialData);
      expect(result).toEqual(createdMaterial);
    });
  });

  describe('getMaterialById', () => {
    it('should return material by id', async () => {
      const materialId = 1;
      const material = {
        id: materialId,
        course_id: 1,
        title: 'Introduction to JavaScript',
        content_url: 'https://example.com/video.mp4',
        content_type: 'video'
      };

      mockMaterialRepository.findById.mockResolvedValue(material);

      const result = await materialService.getMaterialById(materialId);

      expect(mockMaterialRepository.findById).toHaveBeenCalledWith(materialId);
      expect(result).toEqual(material);
    });

    it('should throw error if material not found', async () => {
      const materialId = 999;
      mockMaterialRepository.findById.mockResolvedValue(null);

      await expect(materialService.getMaterialById(materialId)).rejects.toThrow('Материал не найден');
    });
  });

  describe('getMaterialsByCourseId', () => {
    it('should return materials for course', async () => {
      const courseId = 1;
      const materials = [
        { id: 1, course_id: courseId, title: 'Material 1' },
        { id: 2, course_id: courseId, title: 'Material 2' }
      ];

      mockMaterialRepository.findByCourseId.mockResolvedValue(materials);

      const result = await materialService.getMaterialsByCourseId(courseId);

      expect(mockMaterialRepository.findByCourseId).toHaveBeenCalledWith(courseId);
      expect(result).toEqual(materials);
    });
  });

  describe('updateMaterial', () => {
    it('should update material successfully', async () => {
      const materialId = 1;
      const materialData = { title: 'Updated Material' };
      const updatedMaterial = {
        id: materialId,
        ...materialData,
        updated_at: '2024-01-01T00:00:00Z'
      };

      mockMaterialRepository.update.mockResolvedValue(updatedMaterial);

      const result = await materialService.updateMaterial(materialId, materialData);

      expect(mockMaterialRepository.update).toHaveBeenCalledWith(materialId, materialData);
      expect(result).toEqual(updatedMaterial);
    });
  });

  describe('deleteMaterial', () => {
    it('should delete material successfully', async () => {
      const materialId = 1;
      mockMaterialRepository.delete.mockResolvedValue(true);

      const result = await materialService.deleteMaterial(materialId);

      expect(mockMaterialRepository.delete).toHaveBeenCalledWith(materialId);
      expect(result).toBe(true);
    });
  });

  describe('getNextMaterial', () => {
    it('should return next material in course', async () => {
      const courseId = 1;
      const currentOrderIndex = 2;
      const nextMaterial = {
        id: 3,
        course_id: courseId,
        title: 'Next Material',
        order_index: 3
      };

      mockMaterialRepository.getNextMaterial.mockResolvedValue(nextMaterial);

      const result = await materialService.getNextMaterial(courseId, currentOrderIndex);

      expect(mockMaterialRepository.getNextMaterial).toHaveBeenCalledWith(courseId, currentOrderIndex);
      expect(result).toEqual(nextMaterial);
    });

    it('should return null if no next material', async () => {
      const courseId = 1;
      const currentOrderIndex = 5;

      mockMaterialRepository.getNextMaterial.mockResolvedValue(null);

      const result = await materialService.getNextMaterial(courseId, currentOrderIndex);

      expect(result).toBeNull();
    });
  });

  describe('getMaterialWithCourseInfo', () => {
    it('should return material with course information', async () => {
      const materialId = 1;
      const materialWithCourse = {
        id: materialId,
        title: 'Introduction to JavaScript',
        course: {
          id: 1,
          title: 'JavaScript Basics'
        }
      };

      mockMaterialRepository.findWithCourseInfo.mockResolvedValue(materialWithCourse);

      const result = await materialService.getMaterialWithCourseInfo(materialId);

      expect(mockMaterialRepository.findWithCourseInfo).toHaveBeenCalledWith(materialId);
      expect(result).toEqual(materialWithCourse);
    });
  });
});
