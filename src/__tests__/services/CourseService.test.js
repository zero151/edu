const CourseService = require('../../services/CourseService');

describe('CourseService', () => {
  let courseService;
  let mockCourseRepository;

  beforeEach(() => {
    mockCourseRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findWithMaterials: jest.fn(),
      getPopularCourses: jest.fn()
    };
    courseService = new CourseService(mockCourseRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCourse', () => {
    it('should create course successfully', async () => {
      const courseData = {
        title: 'JavaScript Basics',
        description: 'Learn JavaScript fundamentals'
      };
      const createdCourse = {
        id: 1,
        ...courseData,
        created_at: '2024-01-01T00:00:00Z'
      };

      mockCourseRepository.create.mockResolvedValue(createdCourse);

      const result = await courseService.createCourse(courseData);

      expect(mockCourseRepository.create).toHaveBeenCalledWith(courseData);
      expect(result).toEqual(createdCourse);
    });

    it('should handle repository errors', async () => {
      const courseData = { title: 'Test Course' };
      const error = new Error('Database error');

      mockCourseRepository.create.mockRejectedValue(error);

      await expect(courseService.createCourse(courseData)).rejects.toThrow('Database error');
    });
  });

  describe('getCourseById', () => {
    it('should return course by id', async () => {
      const courseId = 1;
      const course = {
        id: courseId,
        title: 'JavaScript Basics',
        description: 'Learn JavaScript fundamentals'
      };

      mockCourseRepository.findById.mockResolvedValue(course);

      const result = await courseService.getCourseById(courseId);

      expect(mockCourseRepository.findById).toHaveBeenCalledWith(courseId);
      expect(result).toEqual(course);
    });

    it('should throw error if course not found', async () => {
      const courseId = 999;
      mockCourseRepository.findById.mockResolvedValue(null);

      await expect(courseService.getCourseById(courseId)).rejects.toThrow('Курс не найден');
    });
  });

  describe('getAllCourses', () => {
    it('should return all courses', async () => {
      const courses = [
        { id: 1, title: 'Course 1' },
        { id: 2, title: 'Course 2' }
      ];

      mockCourseRepository.findAll.mockResolvedValue(courses);

      const result = await courseService.getAllCourses();

      expect(mockCourseRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(courses);
    });
  });

  describe('updateCourse', () => {
    it('should update course successfully', async () => {
      const courseId = 1;
      const courseData = { title: 'Updated Course' };
      const updatedCourse = {
        id: courseId,
        ...courseData,
        updated_at: '2024-01-01T00:00:00Z'
      };

      mockCourseRepository.update.mockResolvedValue(updatedCourse);

      const result = await courseService.updateCourse(courseId, courseData);

      expect(mockCourseRepository.update).toHaveBeenCalledWith(courseId, courseData);
      expect(result).toEqual(updatedCourse);
    });
  });

  describe('deleteCourse', () => {
    it('should delete course successfully', async () => {
      const courseId = 1;
      mockCourseRepository.delete.mockResolvedValue(true);

      const result = await courseService.deleteCourse(courseId);

      expect(mockCourseRepository.delete).toHaveBeenCalledWith(courseId);
      expect(result).toBe(true);
    });
  });

  describe('getCourseWithMaterials', () => {
    it('should return course with materials', async () => {
      const courseId = 1;
      const courseWithMaterials = {
        id: courseId,
        title: 'JavaScript Basics',
        materials: [
          { id: 1, title: 'Introduction' },
          { id: 2, title: 'Variables' }
        ]
      };

      mockCourseRepository.findWithMaterials.mockResolvedValue(courseWithMaterials);

      const result = await courseService.getCourseWithMaterials(courseId);

      expect(mockCourseRepository.findWithMaterials).toHaveBeenCalledWith(courseId);
      expect(result).toEqual(courseWithMaterials);
    });
  });

  describe('getPopularCourses', () => {
    it('should return popular courses with default limit', async () => {
      const popularCourses = [
        { id: 1, title: 'Popular Course 1', enrollment_count: 100 },
        { id: 2, title: 'Popular Course 2', enrollment_count: 80 }
      ];

      mockCourseRepository.getPopularCourses.mockResolvedValue(popularCourses);

      const result = await courseService.getPopularCourses();

      expect(mockCourseRepository.getPopularCourses).toHaveBeenCalledWith(5);
      expect(result).toEqual(popularCourses);
    });

    it('should return popular courses with custom limit', async () => {
      const limit = 10;
      const popularCourses = [
        { id: 1, title: 'Popular Course 1' },
        { id: 2, title: 'Popular Course 2' }
      ];

      mockCourseRepository.getPopularCourses.mockResolvedValue(popularCourses);

      const result = await courseService.getPopularCourses(limit);

      expect(mockCourseRepository.getPopularCourses).toHaveBeenCalledWith(limit);
      expect(result).toEqual(popularCourses);
    });
  });
});
