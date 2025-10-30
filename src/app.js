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
    
    // Root landing page
    this.app.get('/', (req, res) => {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(`<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Edu API</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
  <style>
    :root { --bg:#ffffff; --text:#1f2937; --muted:#6b7280; --brand:#6d28d9; --brand2:#9333ea; --card:#f9fafb; }
    *{box-sizing:border-box}
    body{margin:0;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,"Helvetica Neue",Arial,"Noto Sans",sans-serif;background:var(--bg);color:var(--text)}
    .container{max-width:1100px;margin:0 auto;padding:24px}
    .nav{display:flex;align-items:center;justify-content:space-between;padding:8px 0}
    .brand{font-weight:800;letter-spacing:.02em}
    .menu{display:flex;gap:20px;color:var(--muted)}
    .cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;margin:28px 0}
    .card{background:var(--card);border-radius:14px;padding:18px;text-align:center;border:1px solid #eef2f7}
    .card h4{margin:10px 0 6px}
    .card p{margin:0;color:var(--muted);font-size:14px;line-height:1.4}
    .hero{display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:30px;margin-top:34px}
    .hero h1{color:#5b21b6;font-weight:800;letter-spacing:.02em;margin:0 0 10px}
    .hero p{color:var(--muted);line-height:1.6;margin:0 0 10px}
    .btn{display:inline-block;background:linear-gradient(135deg,var(--brand),var(--brand2));color:#fff;text-decoration:none;padding:10px 18px;border-radius:999px;font-weight:600;box-shadow:0 6px 20px rgba(109,40,217,.35)}
    .logo{width:100%;max-width:360px;aspect-ratio:1/1;display:block;margin:auto}
    @media (max-width:900px){.cards{grid-template-columns:1fr}.hero{grid-template-columns:1fr}.menu{display:none}}
  </style>
 </head>
 <body>
  <div class="container">
    <div class="nav">
      <div class="brand">НАЗВАНИЕ</div>
      <div class="menu">
        <div>Главная</div>
        <div>Мои проекты</div>
        <div>Контакты</div>
      </div>
    </div>

    <div class="cards">
      <div class="card">
        <h4>SQL Server</h4>
        <p>Some quick example text to build on the card title and make up the bulk of the card's content.</p>
      </div>
      <div class="card">
        <h4>Web API</h4>
        <p>Some quick example text to build on the card title and make up the bulk of the card's content.</p>
      </div>
      <div class="card">
        <h4>Blazor WASM</h4>
        <p>Some quick example text to build on the card title and make up the bulk of the card's content.</p>
      </div>
    </div>

    <div class="hero">
      <img class="logo" src="https://raw.githubusercontent.com/github/explore/main/topics/nodejs/nodejs.png" alt="NodeJS" />
      <div>
        <h1>КРАТКО О ПРОЕКТЕ</h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia tenetur reiciendis in quae, rem corporis id sequi debitis aliquam laudantium illum vel unde? Praesentium laboriosam neque eaque architecto maxime nihil?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia tenetur reiciendis in quae, rem corporis id sequi debitis aliquam laudantium illum vel unde? Praesentium laboriosam neque eaque architecto maxime nihil?</p>
        <a class="btn" href="https://edu-3qeo.onrender.com/api-docs/">Подробнее</a>
      </div>
    </div>
  </div>
 </body>
 </html>`);
    });

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