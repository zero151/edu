const express = require('express');
const pool = require('./config/database');

// Репозитории
const UserRepository = require('./repositories/UserRepository');
const CourseRepository = require('./repositories/CourseRepository');
const MaterialRepository = require('./repositories/MaterialRepository');
const TestRepository = require('./repositories/TestRepository');
const QuestionRepository = require('./repositories/QuestionRepository');
const AnswerOptionRepository = require('./repositories/AnswerOptionRepository');
const QuizAttemptRepository = require('./repositories/QuizAttemptRepository');
const UserAnswerRepository = require('./repositories/UserAnswerRepository');
const ProgressRepository = require('./repositories/ProgressRepository');
const CourseMaterialTestRepository = require('./repositories/CourseMaterialTestRepository');

// Сервисы
const UserService = require('./services/UserService');
const CourseService = require('./services/CourseService');
const MaterialService = require('./services/MaterialService');
const TestService = require('./services/TestService');
const QuestionService = require('./services/QuestionService');
const QuizService = require('./services/QuizService');
const ProgressService = require('./services/ProgressService');
const AuthService = require('./services/AuthService');
const AnalyticsService = require('./services/AnalyticsService');

// Контроллеры
const UserController = require('./controllers/UserController');
const CourseController = require('./controllers/CourseController');
const MaterialController = require('./controllers/MaterialController');
const TestController = require('./controllers/TestController');
const QuestionController = require('./controllers/QuestionController');
const QuizController = require('./controllers/QuizController');
const ProgressController = require('./controllers/ProgressController');
const AuthController = require('./controllers/AuthController');
const AnalyticsController = require('./controllers/AnalyticsController');

// Роуты
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');
const materialRoutes = require('./routes/materials');
const testRoutes = require('./routes/tests');
const questionRoutes = require('./routes/questions');
const quizRoutes = require('./routes/quiz');
const progressRoutes = require('./routes/progress');
const authRoutes = require('./routes/auth');
const analyticsRoutes = require('./routes/analytics');

class App {
  constructor() {
    this.app = express();
    this.setupDependencies();
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupDependencies() {
    // Инициализация репозиториев
    const userRepository = new UserRepository(pool);
    const courseRepository = new CourseRepository(pool);
    const materialRepository = new MaterialRepository(pool);
    const testRepository = new TestRepository(pool);
    const questionRepository = new QuestionRepository(pool);
    const answerOptionRepository = new AnswerOptionRepository(pool);
    const quizAttemptRepository = new QuizAttemptRepository(pool);
    const userAnswerRepository = new UserAnswerRepository(pool);
    const progressRepository = new ProgressRepository(pool);
    const courseMaterialTestRepository = new CourseMaterialTestRepository(pool);

    // Инициализация сервисов
    const userService = new UserService(userRepository);
    const courseService = new CourseService(courseRepository);
    const materialService = new MaterialService(materialRepository);
    const testService = new TestService(testRepository);
    const questionService = new QuestionService(questionRepository);
    const quizService = new QuizService(
      quizAttemptRepository,
      userAnswerRepository,
      testRepository,
      answerOptionRepository
    );
    const progressService = new ProgressService(progressRepository);
    const authService = new AuthService(userRepository);
    const analyticsService = new AnalyticsService(
      userRepository,
      courseRepository,
      progressRepository,
      quizAttemptRepository
    );

    // Инициализация контроллеров
    this.userController = new UserController(userService);
    this.courseController = new CourseController(courseService);
    this.materialController = new MaterialController(materialService);
    this.testController = new TestController(testService);
    this.questionController = new QuestionController(questionService);
    this.quizController = new QuizController(quizService);
    this.progressController = new ProgressController(progressService);
    this.authController = new AuthController(authService);
    this.analyticsController = new AnalyticsController(analyticsService);
  }

  setupMiddleware() {
    this.app.use(express.json());
    
    // Логирование запросов
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });

    // CORS
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      next();
    });
  }

  setupRoutes() {
    // API routes
    this.app.use('/api/users', userRoutes(this.userController));
    this.app.use('/api/courses', courseRoutes(this.courseController));
    this.app.use('/api/materials', materialRoutes(this.materialController));
    this.app.use('/api/tests', testRoutes(this.testController));
    this.app.use('/api/questions', questionRoutes(this.questionController));
    this.app.use('/api/quiz', quizRoutes(this.quizController));
    this.app.use('/api/progress', progressRoutes(this.progressController));
    this.app.use('/api/auth', authRoutes(this.authController));
    this.app.use('/api/analytics', analyticsRoutes(this.analyticsController));
    
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'Edu Mobile API',
        version: '1.0.0'
      });
    });

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        error: 'Маршрут не найден'
      });
    });

    // Error handler
    this.app.use((error, req, res, next) => {
      console.error('Unhandled error:', error);
      res.status(500).json({
        success: false,
        error: 'Внутренняя ошибка сервера'
      });
    });
  }

  getApp() {
    return this.app;
  }
}

module.exports = App;