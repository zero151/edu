const Joi = require('joi');

class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  login = async (req, res) => {
    try {
      const { email, password } = req.body;

      // Базовая валидация обязательных полей
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email и пароль обязательны для заполнения'
        });
      }

      const result = await this.authService.login(email, password);
      
      res.json({
        success: true,
        data: result,
        message: 'Успешная аутентификация'
      });

    } catch (error) {
      console.error('Error in login:', error);
      
      // Определяем статус код в зависимости от типа ошибки
      let statusCode = 500;
      if (error.message.includes('не найден') || error.message.includes('Неверный пароль')) {
        statusCode = 401;
      } else if (error.message.includes('заблокирована')) {
        statusCode = 403;
      } else if (error.message.includes('валидации')) {
        statusCode = 400;
      }

      res.status(statusCode).json({
        success: false,
        error: error.message
      });
    }
  }

  register = async (req, res) => {
    try {
      const { email, password, name, last_name, patronymic } = req.body;

      // Базовая валидация обязательных полей
      if (!email || !password || !name || !last_name || !patronymic) {
        return res.status(400).json({
          success: false,
          error: 'Все поля обязательны для заполнения'
        });
      }

      const result = await this.authService.register(req.body);
      
      res.status(201).json({
        success: true,
        data: result,
        message: 'Пользователь успешно зарегистрирован'
      });

    } catch (error) {
      console.error('Error in register:', error);
      
      let statusCode = 500;
      if (error.message.includes('уже существует') || error.message.includes('валидации')) {
        statusCode = 400;
      }

      res.status(statusCode).json({
        success: false,
        error: error.message
      });
    }
  }

  validateToken = async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({
          success: false,
          error: 'Токен не предоставлен'
        });
      }

      const result = await this.authService.validateToken(token);
      
      res.json({
        success: true,
        data: result,
        message: 'Токен валиден'
      });

    } catch (error) {
      console.error('Error in validateToken:', error);
      
      let statusCode = 401;
      if (error.message.includes('не найден')) {
        statusCode = 404;
      } else if (error.message.includes('заблокирована')) {
        statusCode = 403;
      }

      res.status(statusCode).json({
        success: false,
        error: error.message
      });
    }
  }

  refreshToken = async (req, res) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          error: 'Refresh token обязателен'
        });
      }

      const result = await this.authService.refreshToken(refreshToken);
      
      res.json({
        success: true,
        data: result,
        message: 'Токен успешно обновлен'
      });

    } catch (error) {
      console.error('Error in refreshToken:', error);
      
      let statusCode = 401;
      if (error.message.includes('обязателен')) {
        statusCode = 400;
      }

      res.status(statusCode).json({
        success: false,
        error: error.message
      });
    }
  }

  changePassword = async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { currentPassword, newPassword } = req.body;

      // Валидация входных данных
      const { error } = Joi.object({
        userId: Joi.number().integer().positive().required(),
        currentPassword: Joi.string().min(1).required(),
        newPassword: Joi.string().min(6).required()
      }).validate({ userId, currentPassword, newPassword });

      if (error) {
        return res.status(400).json({
          success: false,
          error: `Неверные данные: ${error.details[0].message}`
        });
      }

      const result = await this.authService.changePassword(userId, currentPassword, newPassword);
      
      res.json({
        success: true,
        data: result,
        message: 'Пароль успешно изменен'
      });

    } catch (error) {
      console.error('Error in changePassword:', error);
      
      let statusCode = 400;
      if (error.message.includes('не найден')) {
        statusCode = 404;
      } else if (error.message.includes('неверен')) {
        statusCode = 401;
      }

      res.status(statusCode).json({
        success: false,
        error: error.message
      });
    }
  }

  logout = async (req, res) => {
    try {
      // В реальном приложении здесь можно добавить логику для инвалидации токена
      // Например, добавление токена в черный список
      
      res.json({
        success: true,
        message: 'Успешный выход из системы'
      });

    } catch (error) {
      console.error('Error in logout:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  getProfile = async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({
          success: false,
          error: 'Токен не предоставлен'
        });
      }

      const validationResult = await this.authService.validateToken(token);
      
      res.json({
        success: true,
        data: {
          user: validationResult.user
        }
      });

    } catch (error) {
      console.error('Error in getProfile:', error);
      res.status(401).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = AuthController;