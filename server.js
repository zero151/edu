const App = require('./src/app');
require('dotenv').config();

const app = new App().getApp();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('🚀 Сервер запущен!');
  console.log(`📡 Порт: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log('📚 API образовательного приложения готов к работе!');
  console.log('\n📋 Доступные endpoints:');
  
  console.log('\n=== USERS ===');
  console.log('  POST   /api/users                 - Регистрация пользователя');
  console.log('  GET    /api/users                 - Все пользователи');
  console.log('  GET    /api/users/:id             - Пользователь по ID');
  console.log('  PUT    /api/users/:id             - Обновить пользователя');
  console.log('  DELETE /api/users/:id             - Удалить пользователя');
  console.log('  GET    /api/users/:id/stats       - Статистика пользователя');
  
  console.log('\n=== COURSES ===');
  console.log('  POST   /api/courses               - Создать курс');
  console.log('  GET    /api/courses               - Все курсы');
  console.log('  GET    /api/courses/:id           - Курс по ID');
  console.log('  PUT    /api/courses/:id           - Обновить курс');
  console.log('  DELETE /api/courses/:id           - Удалить курс');
  console.log('  GET    /api/courses/:id/materials - Курс с материалами');
  console.log('  GET    /api/courses/popular/list  - Популярные курсы');
  
  console.log('\n=== MATERIALS ===');
  console.log('  POST   /api/materials             - Создать материал');
  console.log('  GET    /api/materials/course/:id  - Материалы курса');
  console.log('  GET    /api/materials/:id         - Материал по ID');
  
  console.log('\n=== AUTH ===');
  console.log('  POST   /api/auth/login            - Вход в систему');
  console.log('  POST   /api/auth/validate-token   - Проверка токена');
  
  console.log('\n=== QUIZ ===');
  console.log('  POST   /api/quiz/users/:id/tests/:id/start - Начать тест');
  console.log('  POST   /api/quiz/answers/submit   - Ответить на вопрос');
  
  console.log('\n=== SYSTEM ===');
  console.log('  GET    /health                    - Проверка здоровья');
});