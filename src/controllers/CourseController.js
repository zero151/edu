class CourseController {
  constructor(courseService) {
    this.courseService = courseService;
  }

  /**
   * @swagger
   * /api/courses:
   *   post:
   *     tags: [Courses]
   *     summary: Создать новый курс
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CourseCreate'
   *     responses:
   *       201:
   *         description: Курс создан
   */
  createCourse = async (req, res) => {
    try {
      const { title, description } = req.body || {};
      const payload = { title, description };

      if (!title) {
        return res.status(400).json({
          success: false,
          error: 'Название курса обязательно'
        });
      }

      const course = await this.courseService.createCourse(payload);
      
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

  /**
   * @swagger
   * /api/courses:
   *   get:
   *     tags: [Courses]
   *     summary: Список курсов
   *     responses:
   *       200:
   *         description: Успешно
   */
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

  /**
   * @swagger
   * /api/courses/{id}:
   *   put:
   *     tags: [Courses]
   *     summary: Обновить курс
   *     parameters:
   *       - $ref: '#/components/parameters/courseId'
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CourseUpdate'
   *     responses:
   *       200:
   *         description: Обновлено
   */
  updateCourse = async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      
      if (isNaN(courseId)) {
        return res.status(400).json({
          success: false,
          error: 'Некорректный ID курса'
        });
      }

      const { title, description } = req.body || {};
      const updatePayload = {};
      if (title !== undefined) updatePayload.title = title;
      if (description !== undefined) updatePayload.description = description;
      const course = await this.courseService.updateCourse(courseId, updatePayload);
      
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

  /**
   * @swagger
   * /api/courses/{id}:
   *   delete:
   *     tags: [Courses]
   *     summary: Удалить курс
   *     parameters:
   *       - $ref: '#/components/parameters/courseId'
   *     responses:
   *       200:
   *         description: Удалено
   */
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

  /**
   * @swagger
   * /api/courses/{id}/materials:
   *   get:
   *     tags: [Courses]
   *     summary: Курс с материалами
   *     parameters:
   *       - $ref: '#/components/parameters/courseId'
   *     responses:
   *       200:
   *         description: Успешно
   */
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

  /**
   * @swagger
   * /api/courses/popular/list:
   *   get:
   *     tags: [Courses]
   *     summary: Популярные курсы
   *     parameters:
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 5
   *     responses:
   *       200:
   *         description: Успешно
   */
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