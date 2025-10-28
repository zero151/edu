const Container = require('./Container');
const pool = require('../config/database');

// Репозитории
const UserRepository = require('../repositories/UserRepository');
const CourseRepository = require('../repositories/CourseRepository');
const MaterialRepository = require('../repositories/MaterialRepository');
const TestRepository = require('../repositories/TestRepository');
const QuestionRepository = require('../repositories/QuestionRepository');
const AnswerOptionRepository = require('../repositories/AnswerOptionRepository');
const QuizAttemptRepository = require('../repositories/QuizAttemptRepository');
const UserAnswerRepository = require('../repositories/UserAnswerRepository');
const ProgressRepository = require('../repositories/ProgressRepository');
const CourseMaterialTestRepository = require('../repositories/CourseMaterialTestRepository');

// Сервисы
const UserService = require('../services/UserService');
const CourseService = require('../services/CourseService');
const MaterialService = require('../services/MaterialService');
const TestService = require('../services/TestService');
const QuestionService = require('../services/QuestionService');
const QuizService = require('../services/QuizService');
const ProgressService = require('../services/ProgressService');
const AuthService = require('../services/AuthService');
const AnalyticsService = require('../services/AnalyticsService');

// Контроллеры
const UserController = require('../controllers/UserController');
const CourseController = require('../controllers/CourseController');
const MaterialController = require('../controllers/MaterialController');
const TestController = require('../controllers/TestController');
const QuestionController = require('../controllers/QuestionController');
const QuizController = require('../controllers/QuizController');
const ProgressController = require('../controllers/ProgressController');
const AuthController = require('../controllers/AuthController');
const AnalyticsController = require('../controllers/AnalyticsController');

const container = new Container();

/**
 * РЕГИСТРАЦИЯ ВСЕХ ЗАВИСИМОСТЕЙ
 * Каждый компонент регистрируется в контейнере и получает зависимости через DI
 */

// База данных (синглтон)
container.register('pool', () => pool, true);

// ========== РЕПОЗИТОРИИ ==========
container.register('UserRepository', (c) => new UserRepository(c.get('pool')), true);
container.register('CourseRepository', (c) => new CourseRepository(c.get('pool')), true);
container.register('MaterialRepository', (c) => new MaterialRepository(c.get('pool')), true);
container.register('TestRepository', (c) => new TestRepository(c.get('pool')), true);
container.register('QuestionRepository', (c) => new QuestionRepository(c.get('pool')), true);
container.register('AnswerOptionRepository', (c) => new AnswerOptionRepository(c.get('pool')), true);
container.register('QuizAttemptRepository', (c) => new QuizAttemptRepository(c.get('pool')), true);
container.register('UserAnswerRepository', (c) => new UserAnswerRepository(c.get('pool')), true);
container.register('ProgressRepository', (c) => new ProgressRepository(c.get('pool')), true);
container.register('CourseMaterialTestRepository', (c) => new CourseMaterialTestRepository(c.get('pool')), true);

// ========== СЕРВИСЫ ==========
container.register('UserService', (c) => new UserService(c.get('UserRepository')), true);
container.register('CourseService', (c) => new CourseService(c.get('CourseRepository')), true);
container.register('MaterialService', (c) => new MaterialService(c.get('MaterialRepository')), true);
container.register('TestService', (c) => new TestService(c.get('TestRepository')), true);
container.register('QuestionService', (c) => new QuestionService(c.get('QuestionRepository')), true);
container.register('QuizService', (c) => new QuizService(
  c.get('QuizAttemptRepository'),
  c.get('UserAnswerRepository'),
  c.get('TestRepository'),
  c.get('AnswerOptionRepository')
), true);
container.register('ProgressService', (c) => new ProgressService(c.get('ProgressRepository')), true);
container.register('AuthService', (c) => new AuthService(c.get('UserRepository')), true);
container.register('AnalyticsService', (c) => new AnalyticsService(
  c.get('UserRepository'),
  c.get('CourseRepository'),
  c.get('ProgressRepository'),
  c.get('QuizAttemptRepository')
), true);

// ========== КОНТРОЛЛЕРЫ ==========
container.register('UserController', (c) => new UserController(c.get('UserService')), true);
container.register('CourseController', (c) => new CourseController(c.get('CourseService')), true);
container.register('MaterialController', (c) => new MaterialController(c.get('MaterialService')), true);
container.register('TestController', (c) => new TestController(c.get('TestService')), true);
container.register('QuestionController', (c) => new QuestionController(c.get('QuestionService')), true);
container.register('QuizController', (c) => new QuizController(c.get('QuizService')), true);
container.register('ProgressController', (c) => new ProgressController(c.get('ProgressService')), true);
container.register('AuthController', (c) => new AuthController(c.get('AuthService')), true);
container.register('AnalyticsController', (c) => new AnalyticsController(c.get('AnalyticsService')), true);

module.exports = container;