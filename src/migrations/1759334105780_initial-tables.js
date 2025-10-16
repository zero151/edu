exports.up = (pgm) => {
  // 1. Таблица пользователей
  pgm.createTable('users', {
    id: { type: 'SERIAL', primaryKey: true },
    email: { type: 'VARCHAR(255)', notNull: true, unique: true },
    password_hash: { type: 'VARCHAR(255)', notNull: true },
    name: { type: 'VARCHAR(50)', notNull: true },
    last_name: { type: 'VARCHAR(50)', notNull: true },
    patronymic: { type: 'VARCHAR(50)', notNull: true },
    created_at: { type: 'TIMESTAMP', notNull: true, default: pgm.func('NOW()') },
    updated_at: { type: 'TIMESTAMP', notNull: true, default: pgm.func('NOW()') }
  });

  // 2. Таблица курсов
  pgm.createTable('courses', {
    id: { type: 'SERIAL', primaryKey: true },
    title: { type: 'VARCHAR(255)', notNull: true, unique: true },
    description: { type: 'TEXT' },
    created_at: { type: 'TIMESTAMP', notNull: true, default: pgm.func('NOW()') },
    updated_at: { type: 'TIMESTAMP', notNull: true, default: pgm.func('NOW()') }
  });

  // 3. Таблица материалов
  pgm.createTable('materials', {
    id: { type: 'SERIAL', primaryKey: true },
    course_id: { 
      type: 'INTEGER', 
      notNull: true, 
      references: 'courses(id)',
      onDelete: 'CASCADE'
    },
    title: { type: 'TEXT', notNull: true },
    content_url: { type: 'TEXT', notNull: true },
    content_type: { type: 'TEXT', notNull: true },
    order_index: { type: 'INTEGER' }
  });

  // Добавляем уникальный индекс для порядка материалов в курсе
  pgm.addConstraint('materials', 'materials_course_id_order_index_unique', {
    unique: ['course_id', 'order_index']
  });

  // 4. Таблица тестов
  pgm.createTable('tests', {
    id: { type: 'SERIAL', primaryKey: true },
    course_id: { 
      type: 'INTEGER', 
      notNull: true, 
      references: 'courses(id)',
      onDelete: 'CASCADE'
    },
    title: { type: 'TEXT', notNull: true },
    description: { type: 'TEXT' },
    max_attempts: { type: 'INTEGER', default: 3 },
    passing_score: { type: 'INTEGER', default: 70 },
    time_limit_minutes: { type: 'INTEGER', default: 15 }
  });

  // 5. Таблица вопросов
  pgm.createTable('questions', {
    id: { type: 'SERIAL', primaryKey: true },
    test_id: { 
      type: 'INTEGER', 
      notNull: true, 
      references: 'tests(id)',
      onDelete: 'CASCADE'
    },
    question_text: { type: 'TEXT', notNull: true },
    question_type: { type: 'TEXT', notNull: true },
    order_index: { type: 'INTEGER' }
  });

  // 6. Таблица вариантов ответов
  pgm.createTable('answer_options', {
    id: { type: 'SERIAL', primaryKey: true },
    question_id: { 
      type: 'INTEGER', 
      notNull: true, 
      references: 'questions(id)',
      onDelete: 'CASCADE'
    },
    option_text: { type: 'TEXT', notNull: true },
    is_correct: { type: 'BOOLEAN', notNull: true, default: false },
    order_index: { type: 'INTEGER' }
  });

  // 7. Таблица попыток прохождения тестов
  pgm.createTable('user_quiz_attempts', {
    id: { type: 'SERIAL', primaryKey: true },
    user_id: { 
      type: 'INTEGER', 
      notNull: true, 
      references: 'users(id)',
      onDelete: 'CASCADE'
    },
    test_id: { 
      type: 'INTEGER', 
      notNull: true, 
      references: 'tests(id)',
      onDelete: 'CASCADE'
    },
    started_at: { type: 'TIMESTAMP', notNull: true, default: pgm.func('NOW()') },
    finished_at: { type: 'TIMESTAMP' },
    score: { type: 'INTEGER' }
  });

  // 8. Таблица ответов пользователя
  pgm.createTable('user_answers', {
    id: { type: 'SERIAL', primaryKey: true },
    attempt_id: { 
      type: 'INTEGER', 
      notNull: true, 
      references: 'user_quiz_attempts(id)',
      onDelete: 'CASCADE'
    },
    question_id: { 
      type: 'INTEGER', 
      notNull: true, 
      references: 'questions(id)',
      onDelete: 'CASCADE'
    },
    selected_option_id: { 
      type: 'INTEGER', 
      references: 'answer_options(id)',
      onDelete: 'CASCADE'
    },
    answer_text: { type: 'TEXT' }
  });

  // 9. Таблица прогресса пользователя
  pgm.createTable('user_progress', {
    id: { type: 'SERIAL', primaryKey: true },
    user_id: { 
      type: 'INTEGER', 
      notNull: true, 
      references: 'users(id)',
      onDelete: 'CASCADE'
    },
    course_id: { 
      type: 'INTEGER', 
      notNull: true, 
      references: 'courses(id)',
      onDelete: 'CASCADE'
    },
    material_id: { 
      type: 'INTEGER', 
      notNull: true, 
      references: 'materials(id)',
      onDelete: 'CASCADE'
    },
    completed: { type: 'BOOLEAN', notNull: true, default: false },
    last_accessed_at: { type: 'TIMESTAMP', notNull: true, default: pgm.func('NOW()') }
  });

  // Уникальный индекс для прогресса
  pgm.addConstraint('user_progress', 'user_progress_user_material_unique', {
    unique: ['user_id', 'material_id']
  });

  // 10. Связь материалов и тестов
  pgm.createTable('course_materials_tests', {
    id: { type: 'SERIAL', primaryKey: true },
    material_id: { 
      type: 'INTEGER', 
      notNull: true, 
      references: 'materials(id)',
      onDelete: 'CASCADE'
    },
    test_id: { 
      type: 'INTEGER', 
      notNull: true, 
      references: 'tests(id)',
      onDelete: 'CASCADE'
    }
  });

  // Уникальный индекс для связи
  pgm.addConstraint('course_materials_tests', 'course_materials_tests_unique', {
    unique: ['material_id', 'test_id']
  });
};

exports.down = (pgm) => {
  // Удаляем таблицы в обратном порядке
  pgm.dropTable('course_materials_tests');
  pgm.dropTable('user_progress');
  pgm.dropTable('user_answers');
  pgm.dropTable('user_quiz_attempts');
  pgm.dropTable('answer_options');
  pgm.dropTable('questions');
  pgm.dropTable('tests');
  pgm.dropTable('materials');
  pgm.dropTable('courses');
  pgm.dropTable('users');
};