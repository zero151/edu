class CourseController {
  constructor(courseService) {
    this.courseService = courseService;
  }

  createCourse = async (req, res) => {
    try {
      const { title, description } = req.body;

      if (!title) {
        return res.status(400).json({
          success: false,
          error: 'Название курса обязательно'
        });
      }

      const course = await this.courseService.createCourse(req.body);
      
      res.status(201).json({
        success: true,
        data: course,
        message: 'Курс успешно создан'
      });

    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  getCourseById = async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      
      if (isNaN(courseId)) {
        return res.status(400).json({
          success: false,
          error: 'Некорректный ID курса'
        });
      }

      const course = await this.courseService.getCourseById(courseId);
      
      res.json({
        success: true,
        data: course
      });

    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  getAllCourses = async (req, res) => {
    try {
      const courses = await this.courseService.getAllCourses();
      
      res.json({
        success: true,
        data: courses,
        count: courses.length
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  updateCourse = async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      
      if (isNaN(courseId)) {
        return res.status(400).json({
          success: false,
          error: 'Некорректный ID курса'
        });
      }

      const course = await this.courseService.updateCourse(courseId, req.body);
      
      res.json({
        success: true,
        data: course,
        message: 'Курс успешно обновлен'
      });

    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  deleteCourse = async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      
      if (isNaN(courseId)) {
        return res.status(400).json({
          success: false,
          error: 'Некорректный ID курса'
        });
      }

      await this.courseService.deleteCourse(courseId);
      
      res.json({
        success: true,
        message: 'Курс успешно удален'
      });

    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  getCourseWithMaterials = async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      
      if (isNaN(courseId)) {
        return res.status(400).json({
          success: false,
          error: 'Некорректный ID курса'
        });
      }

      const course = await this.courseService.getCourseWithMaterials(courseId);
      
      res.json({
        success: true,
        data: course
      });

    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  getPopularCourses = async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 5;
      const courses = await this.courseService.getPopularCourses(limit);
      
      res.json({
        success: true,
        data: courses,
        count: courses.length
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = CourseController;