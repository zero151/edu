/**
 * Миграция для добавления начальных данных в базу
 * Позволяет быстро развернуть тестовое окружение с готовыми данными
 */
exports.up = async (pgm) => {
  // Добавляем тестовых пользователей
  await pgm.sql(`
    INSERT INTO users (email, password_hash, name, last_name, patronymic) VALUES
    ('student1@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Иван', 'Иванов', 'Иванович'),
    ('student2@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Мария', 'Петрова', 'Сергеевна'),
    ('teacher@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Алексей', 'Сидоров', 'Викторович');
  `);

  // Добавляем тестовые курсы
  await pgm.sql(`
    INSERT INTO courses (title, description) VALUES
    ('JavaScript для начинающих', 'Изучите основы JavaScript с нуля'),
    ('React и современный фронтенд', 'Освойте React, Redux и современные инструменты'),
    ('Node.js и серверная разработка', 'Научитесь создавать серверные приложения на Node.js');
  `);

  // Добавляем материалы для первого курса
  await pgm.sql(`
    INSERT INTO materials (course_id, title, content_url, content_type, order_index) VALUES
    (1, 'Введение в JavaScript', '/materials/js-intro.pdf', 'pdf', 1),
    (1, 'Переменные и типы данных', '/materials/js-variables.mp4', 'video', 2),
    (1, 'Функции и области видимости', '/materials/js-functions.pdf', 'pdf', 3);
  `);

  // Добавляем тесты
  await pgm.sql(`
    INSERT INTO tests (course_id, title, description, max_attempts, passing_score, time_limit_minutes) VALUES
    (1, 'Основы JavaScript', 'Тест по основам JavaScript', 3, 70, 30),
    (2, 'React компоненты', 'Тест по React компонентам', 2, 80, 45);
  `);

  // Добавляем вопросы для первого теста
  await pgm.sql(`
    INSERT INTO questions (test_id, question_text, question_type, order_index) VALUES
    (1, 'Что такое JavaScript?', 'single_choice', 1),
    (1, 'Какие типы данных есть в JavaScript?', 'multiple_choice', 2),
    (1, 'Что такое hoisting в JavaScript?', 'single_choice', 3);
  `);

  // Добавляем варианты ответов
  await pgm.sql(`
    INSERT INTO answer_options (question_id, option_text, is_correct, order_index) VALUES
    (1, 'Язык программирования', true, 1),
    (1, 'База данных', false, 2),
    (1, 'Фреймворк', false, 3),
    
    (2, 'String', true, 1),
    (2, 'Number', true, 2),
    (2, 'Boolean', true, 3),
    (2, 'Array', true, 4),
    
    (3, 'Поднятие переменных и функций', true, 1),
    (3, 'Оптимизация кода', false, 2),
    (3, 'Сборка мусора', false, 3);
  `);

  // Связываем материалы с тестами
  await pgm.sql(`
    INSERT INTO course_materials_tests (material_id, test_id) VALUES
    (1, 1),
    (2, 1),
    (3, 1);
  `);

  console.log('✅ Начальные данные успешно добавлены в базу');
};

exports.down = async (pgm) => {
  // Удаляем все добавленные данные в обратном порядке
  await pgm.sql(`DELETE FROM course_materials_tests`);
  await pgm.sql(`DELETE FROM answer_options`);
  await pgm.sql(`DELETE FROM questions`);
  await pgm.sql(`DELETE FROM tests`);
  await pgm.sql(`DELETE FROM materials`);
  await pgm.sql(`DELETE FROM courses`);
  await pgm.sql(`DELETE FROM users`);

  // Сбрасываем последовательности (autoincrement)
  await pgm.sql(`ALTER SEQUENCE users_id_seq RESTART WITH 1`);
  await pgm.sql(`ALTER SEQUENCE courses_id_seq RESTART WITH 1`);
  await pgm.sql(`ALTER SEQUENCE materials_id_seq RESTART WITH 1`);
  await pgm.sql(`ALTER SEQUENCE tests_id_seq RESTART WITH 1`);
  await pgm.sql(`ALTER SEQUENCE questions_id_seq RESTART WITH 1`);
  await pgm.sql(`ALTER SEQUENCE answer_options_id_seq RESTART WITH 1`);
  await pgm.sql(`ALTER SEQUENCE course_materials_tests_id_seq RESTART WITH 1`);

  console.log('✅ Начальные данные успешно удалены из базы');
};