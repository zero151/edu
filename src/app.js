const express = require('express');
const container = require('./container/dependencies');
const { specs, swaggerUi } = require('./docs/swagger');

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

/**
 * Обновленное приложение с Dependency Injection
 * Теперь компоненты не создаются напрямую, а получаются из контейнера
 * Это устраняет сильную связанность между слоями
 */
class App {
  constructor() {
    this.app = express();
    this.container = container;
    this.setupMiddleware();
    this.setupDocumentation(); // 👈 ДОБАВЛЯЕМ ДОКУМЕНТАЦИЮ ПЕРВОЙ
    this.setupRoutes();
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

  setupDocumentation() {
    // 🔧 Настройка Swagger документации
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Edu Mobile API Documentation',
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true
      }
    }));

    // 📋 Endpoint для получения сырой спецификации
    this.app.get('/api-docs.json', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(specs);
    });

    console.log('📚 Swagger документация доступна по адресу: http://localhost:3000/api-docs');
  }

  setupRoutes() {
    // Получаем контроллеры из контейнера
    const userController = this.container.get('UserController');
    const courseController = this.container.get('CourseController');
    const materialController = this.container.get('MaterialController');
    const testController = this.container.get('TestController');
    const questionController = this.container.get('QuestionController');
    const quizController = this.container.get('QuizController');
    const progressController = this.container.get('ProgressController');
    const authController = this.container.get('AuthController');
    const analyticsController = this.container.get('AnalyticsController');

    // API routes
    this.app.use('/api/users', userRoutes(userController));
    this.app.use('/api/courses', courseRoutes(courseController));
    this.app.use('/api/materials', materialRoutes(materialController));
    this.app.use('/api/tests', testRoutes(testController));
    this.app.use('/api/questions', questionRoutes(questionController));
    this.app.use('/api/quiz', quizRoutes(quizController));
    this.app.use('/api/progress', progressRoutes(progressController));
    this.app.use('/api/auth', authRoutes(authController));
    this.app.use('/api/analytics', analyticsRoutes(analyticsController));
    
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'Edu Mobile API',
        version: '1.0.0',
        documentation: '/api-docs'
      });
    });

    // 404 handler
    this.app.use((req, res) => {
      res.status(404).json({
        success: false,
        error: 'Маршрут не найден',
        documentation: 'Посмотрите доступные endpoints в документации: /api-docs'
      });
    });

    // Error handler
    this.app.use((error, req, res, next) => {
      console.error('Unhandled error:', error);
      res.status(500).json({
        success: false,
        error: 'Внутренняя ошибка сервера',
        documentation: 'Для получения помощи обратитесь к документации: /api-docs'
      });
    });
  }

  getApp() {
    return this.app;
  }
}

module.exports = App;