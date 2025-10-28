/**
 * 📚 Документация API для Edu Mobile Platform
 * OpenAPI 3.0 спецификация с полным описанием всех endpoints
 * Автоматически генерирует интерактивную документацию по адресу /api-docs
 */

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Edu Mobile Platform API',
      version: '1.0.0',
      description: `
# 🎓 Edu Mobile Platform - REST API Documentation

Образовательная платформа для изучения программирования и современных фреймворков с поддержкой тестирования и уведомлений.

## 🚀 Быстрый старт

### 1. Регистрация пользователя
\`\`\`bash
POST /api/auth/register
{
  "email": "student@example.com",
  "password": "password123",
  "name": "Иван",
  "last_name": "Иванов", 
  "patronymic": "Иванович"
}
\`\`\`

### 2. Аутентификация
\`\`\`bash
POST /api/auth/login
{
  "email": "student@example.com",
  "password": "password123"
}
\`\`\`

### 3. Использование API
Добавьте JWT токен в заголовок:
\`Authorization: Bearer <ваш_токен>\`

## 📋 Основные возможности

- **👥 Управление пользователями** - регистрация, аутентификация, профили
- **📚 Учебные курсы** - создание, редактирование, просмотр курсов
- **📖 Учебные материалы** - видео, статьи, PDF материалы
- **🎯 Тестирование** - интерактивные тесты с вопросами
- **📊 Отслеживание прогресса** - мониторинг обучения
- **📈 Аналитика** - статистика и отчеты

## 🔐 Безопасность

- JWT аутентификация
- Валидация всех входных данных
- Хеширование паролей
- Защита от SQL-инъекций

## 🛠 Технологии

- Node.js + Express
- PostgreSQL
- JWT аутентификация
- Swagger/OpenAPI документация
      `,
      contact: {
        name: 'Техническая поддержка',
        email: 'support@edumobile.com',
        url: 'https://edumobile.com/support'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      },
      termsOfService: 'https://edumobile.com/terms'
    },
    externalDocs: {
      description: 'Документация по миграциям базы данных',
      url: 'https://github.com/edumobile/api/migrations'
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Сервер разработки'
      },
      {
        url: 'https://api.edumobile.com/v1',
        description: 'Продакшен сервер'
      },
      {
        url: 'https://staging-api.edumobile.com/v1',
        description: 'Стейжинг сервер'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Введите JWT токен в формате: Bearer <токен>'
        }
      },
      schemas: {
        // ========== ОСНОВНЫЕ СХЕМЫ ==========
        Error: {
          type: 'object',
          required: ['success', 'error'],
          properties: {
            success: {
              type: 'boolean',
              example: false,
              description: 'Статус операции'
            },
            error: {
              type: 'string',
              example: 'Описание ошибки',
              description: 'Сообщение об ошибке'
            }
          }
        },
        // ========== МАТЕРИАЛЫ ==========
        Material: {
          type: 'object',
          required: ['id', 'course_id', 'title', 'content_url', 'content_type'],
          properties: {
            id: { type: 'integer', example: 5 },
            course_id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Введение в JS' },
            content_url: { type: 'string', example: 'https://cdn.edumobile.com/intro.mp4' },
            content_type: { type: 'string', example: 'video', description: 'video | article | pdf' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        MaterialCreate: {
          type: 'object',
          required: ['course_id', 'title', 'content_url', 'content_type'],
          properties: {
            course_id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Введение в JS' },
            content_url: { type: 'string', example: 'https://cdn.edumobile.com/intro.mp4' },
            content_type: { type: 'string', example: 'video' }
          },
          additionalProperties: false
        },
        MaterialUpdate: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            content_url: { type: 'string' },
            content_type: { type: 'string' }
          },
          additionalProperties: false
        },

        // ========== ТЕСТЫ ==========
        Test: {
          type: 'object',
          required: ['id', 'course_id', 'title'],
          properties: {
            id: { type: 'integer', example: 4 },
            course_id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Тест по основам' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        TestCreate: {
          type: 'object',
          required: ['course_id', 'title'],
          properties: {
            course_id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Тест по основам' }
          },
          additionalProperties: false
        },
        TestUpdate: {
          type: 'object',
          properties: {
            title: { type: 'string' }
          },
          additionalProperties: false
        },

        // ========== QUIZ / ПОПЫТКИ ==========
        QuizSubmitAnswer: {
          type: 'object',
          required: ['attemptId', 'questionId'],
          properties: {
            attemptId: { type: 'integer', example: 12 },
            questionId: { type: 'integer', example: 45 },
            selectedOptionId: { type: 'integer', nullable: true, example: 3 }
          },
          additionalProperties: false
        },
        Attempt: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 12 },
            user_id: { type: 'integer', example: 7 },
            test_id: { type: 'integer', example: 3 },
            started_at: { type: 'string', format: 'date-time' },
            finished_at: { type: 'string', format: 'date-time', nullable: true }
          }
        },
        AttemptResult: {
          type: 'object',
          properties: {
            attempt_id: { type: 'integer', example: 12 },
            correct: { type: 'integer', example: 8 },
            total: { type: 'integer', example: 10 },
            score_percent: { type: 'number', example: 80 }
          }
        },

        // ========== ПРОГРЕСС ==========
        ProgressSummary: {
          type: 'object',
          properties: {
            course_id: { type: 'integer', example: 1 },
            completed_materials: { type: 'integer', example: 5 },
            total_materials: { type: 'integer', example: 10 },
            percent: { type: 'number', example: 50 }
          }
        },
        Activity: {
          type: 'object',
          properties: {
            type: { type: 'string', example: 'material_completed' },
            material_id: { type: 'integer', example: 15 },
            occurred_at: { type: 'string', format: 'date-time' }
          }
        },
        Success: {
          type: 'object',
          required: ['success'],
          properties: {
            success: {
              type: 'boolean',
              example: true,
              description: 'Статус операции'
            },
            message: {
              type: 'string',
              example: 'Операция выполнена успешно',
              description: 'Сообщение об успехе'
            },
            data: {
              type: 'object',
              description: 'Данные ответа'
            }
          }
        },

        // ========== ПОЛЬЗОВАТЕЛИ ==========
        User: {
          type: 'object',
          required: ['id', 'email', 'name', 'last_name', 'patronymic'],
          properties: {
            id: {
              type: 'integer',
              example: 1,
              description: 'Уникальный идентификатор пользователя'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'student@example.com',
              description: 'Email пользователя'
            },
            name: {
              type: 'string',
              example: 'Иван',
              description: 'Имя пользователя',
              minLength: 2,
              maxLength: 50
            },
            last_name: {
              type: 'string',
              example: 'Иванов',
              description: 'Фамилия пользователя',
              minLength: 2,
              maxLength: 50
            },
            patronymic: {
              type: 'string',
              example: 'Иванович',
              description: 'Отчество пользователя',
              minLength: 2,
              maxLength: 50
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00Z',
              description: 'Дата регистрации'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00Z',
              description: 'Дата последнего обновления'
            }
          }
        },

        UserUpdate: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email', example: 'new.email@example.com' },
            name: { type: 'string', minLength: 2, maxLength: 50, example: 'Иван' },
            last_name: { type: 'string', minLength: 2, maxLength: 50, example: 'Иванов' },
            patronymic: { type: 'string', minLength: 2, maxLength: 50, example: 'Иванович' }
          },
          additionalProperties: false
        },

        UserRegistration: {
          type: 'object',
          required: ['email', 'password', 'name', 'last_name', 'patronymic'],
          properties: {
            email: {
              type: 'string',
                  format: 'email',
              example: 'student@example.com',
              description: 'Email для регистрации'
            },
            password: {
              type: 'string',
              format: 'password',
              minLength: 6,
              example: 'password123',
              description: 'Пароль (мин. 6 символов)'
            },
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              example: 'Иван',
              description: 'Имя'
            },
            last_name: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              example: 'Иванов',
              description: 'Фамилия'
            },
            patronymic: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              example: 'Иванович',
              description: 'Отчество'
            }
          }
        },

        // ========== КУРСЫ ==========
        Course: {
          type: 'object',
          required: ['id', 'title'],
          properties: {
            id: {
              type: 'integer',
              example: 1,
              description: 'ID курса'
            },
            title: {
              type: 'string',
              example: 'JavaScript для начинающих',
              description: 'Название курса'
            },
            description: {
              type: 'string',
              example: 'Изучите основы JavaScript с нуля',
              description: 'Описание курса'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00Z'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00Z'
            }
          }
        },

        CourseCreate: {
          type: 'object',
          required: ['title'],
          properties: {
            title: { type: 'string', example: 'JavaScript для начинающих' },
            description: { type: 'string', example: 'Изучите основы JavaScript с нуля' }
          },
          additionalProperties: false
        },

        CourseUpdate: {
          type: 'object',
          properties: {
            title: { type: 'string', example: 'Обновленное название курса' },
            description: { type: 'string', example: 'Обновленное описание' }
          },
          additionalProperties: false
        },

        // ========== ВОПРОСЫ ==========
        Question: {
          type: 'object',
          required: ['id', 'test_id', 'question_text', 'question_type'],
          properties: {
            id: { type: 'integer', example: 10 },
            test_id: { type: 'integer', example: 3, description: 'ID теста' },
            question_text: { type: 'string', example: 'Какой тип данных в JavaScript представляет целые числа?' },
            question_type: { type: 'string', example: 'single_choice', description: 'single_choice | multiple_choice | text' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },

        QuestionCreate: {
          type: 'object',
          required: ['test_id', 'question_text', 'question_type'],
          properties: {
            test_id: { type: 'integer', example: 3 },
            question_text: { type: 'string', example: 'Какой оператор сравнения строго сравнивает по типу и значению?' },
            question_type: { type: 'string', example: 'single_choice' }
          },
          additionalProperties: false
        },

        QuestionUpdate: {
          type: 'object',
          properties: {
            question_text: { type: 'string' },
            question_type: { type: 'string' }
          },
          additionalProperties: false
        },

        // ========== АУТЕНТИФИКАЦИЯ ==========
        AuthLogin: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'student@example.com'
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'password123'
            }
          }
        },

        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/User'
                },
                token: {
                  type: 'string',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                },
                expiresIn: {
                  type: 'string',
                  example: '24h'
                }
              }
            },
            message: {
              type: 'string',
              example: 'Успешная аутентификация'
            }
          }
        }
        ,
        ChangePasswordRequest: {
          type: 'object',
          required: ['oldPassword', 'newPassword'],
          properties: {
            oldPassword: { type: 'string', format: 'password', example: 'oldPass123' },
            newPassword: { type: 'string', format: 'password', example: 'newPass456' }
          },
          additionalProperties: false
        },
        TokenValidationResponse: {
          type: 'object',
          properties: {
            valid: { type: 'boolean', example: true }
          }
        },
        RefreshTokenResponse: {
          type: 'object',
          properties: {
            token: { type: 'string', example: 'new.jwt.token' },
            expiresIn: { type: 'string', example: '24h' }
          }
        },
        ProfileResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { $ref: '#/components/schemas/User' }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Ошибка аутентификации',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                error: 'Требуется аутентификация'
              }
            }
          }
        },
        ValidationError: {
          description: 'Ошибка валидации данных',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                error: 'Неверный формат email'
              }
            }
          }
        },
        NotFoundError: {
          description: 'Ресурс не найден',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                error: 'Пользователь не найден'
              }
            }
          }
        }
      },
      parameters: {
        userId: {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            type: 'integer',
            minimum: 1
          },
          description: 'ID пользователя',
          example: 1
        },
        courseId: {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            type: 'integer',
            minimum: 1
          },
          description: 'ID курса',
          example: 1
        }
        ,
        materialId: {
          in: 'path',
          name: 'materialId',
          required: true,
          schema: { type: 'integer', minimum: 1 },
          description: 'ID материала',
          example: 5
        },
        testId: {
          in: 'path',
          name: 'testId',
          required: true,
          schema: { type: 'integer', minimum: 1 },
          description: 'ID теста',
          example: 3
        },
        attemptId: {
          in: 'path',
          name: 'attemptId',
          required: true,
          schema: { type: 'integer', minimum: 1 },
          description: 'ID попытки',
          example: 12
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'Эндпоинты для аутентификации и регистрации'
      },
      {
        name: 'Users',
        description: 'Управление пользователями'
      },
      {
        name: 'Courses',
        description: 'Работа с учебными курсами'
      },
      {
        name: 'Materials',
        description: 'Учебные материалы'
      },
      {
        name: 'Tests',
        description: 'Тестирование и экзамены'
      },
      {
        name: 'Progress',
        description: 'Отслеживание прогресса обучения'
      },
      {
        name: 'Analytics',
        description: 'Аналитика и статистика'
      }
    ]
  },
  apis: [
    './src/routes/*.js',
    './src/controllers/*.js',
    './src/models/*.js'
  ]
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi
};