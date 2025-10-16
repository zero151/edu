class CourseService {
  constructor(courseRepository) {
    this.courseRepository = courseRepository;
  }

  async createCourse(courseData) {
    return await this.courseRepository.create(courseData);
  }

  async getCourseById(courseId) {
    const course = await this.courseRepository.findById(courseId);
    if (!course) {
      throw new Error('Курс не найден');
    }
    return course;
  }

  async getAllCourses() {
    return await this.courseRepository.findAll();
  }

  async updateCourse(courseId, courseData) {
    return await this.courseRepository.update(courseId, courseData);
  }

  async deleteCourse(courseId) {
    return await this.courseRepository.delete(courseId);
  }

  async getCourseWithMaterials(courseId) {
    return await this.courseRepository.findWithMaterials(courseId);
  }

  async getPopularCourses(limit = 5) {
    return await this.courseRepository.getPopularCourses(limit);
  }
}

module.exports = CourseService;