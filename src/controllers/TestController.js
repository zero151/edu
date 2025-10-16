class TestController {
  constructor(testService) {
    this.testService = testService;
  }

  createTest = async (req, res) => {
    try {
      const { course_id, title } = req.body;

      if (!course_id || !title) {
        return res.status(400).json({
          success: false,
          error: 'ID курса и название теста обязательны'
        });
      }

      const test = await this.testService.createTest(req.body);
      
      res.status(201).json({
        success: true,
        data: test,
        message: 'Тест успешно создан'
      });

    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  getTestById = async (req, res) => {
    try {
      const testId = parseInt(req.params.id);
      
      if (isNaN(testId)) {
        return res.status(400).json({
          success: false,
          error: 'Некорректный ID теста'
        });
      }

      const test = await this.testService.getTestById(testId);
      
      res.json({
        success: true,
        data: test
      });

    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  getTestsByCourseId = async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      
      if (isNaN(courseId)) {
        return res.status(400).json({
          success: false,
          error: 'Некорректный ID курса'
        });
      }

      const tests = await this.testService.getTestsByCourseId(courseId);
      
      res.json({
        success: true,
        data: tests,
        count: tests.length
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  updateTest = async (req, res) => {
    try {
      const testId = parseInt(req.params.id);
      
      if (isNaN(testId)) {
        return res.status(400).json({
          success: false,
          error: 'Некорректный ID теста'
        });
      }

      const test = await this.testService.updateTest(testId, req.body);
      
      res.json({
        success: true,
        data: test,
        message: 'Тест успешно обновлен'
      });

    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  deleteTest = async (req, res) => {
    try {
      const testId = parseInt(req.params.id);
      
      if (isNaN(testId)) {
        return res.status(400).json({
          success: false,
          error: 'Некорректный ID теста'
        });
      }

      await this.testService.deleteTest(testId);
      
      res.json({
        success: true,
        message: 'Тест успешно удален'
      });

    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  getTestWithQuestions = async (req, res) => {
    try {
      const testId = parseInt(req.params.id);
      
      if (isNaN(testId)) {
        return res.status(400).json({
          success: false,
          error: 'Некорректный ID теста'
        });
      }

      const test = await this.testService.getTestWithQuestions(testId);
      
      res.json({
        success: true,
        data: test
      });

    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = TestController;