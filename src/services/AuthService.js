const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

// Схемы валидации
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email должен быть валидным адресом',
    'any.required': 'Email обязателен для заполнения'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Пароль должен содержать минимум 6 символов',
    'any.required': 'Пароль обязателен для заполнения'
  })
});

const registrationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email должен быть валидным адресом',
    'any.required': 'Email обязателен для заполнения'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Пароль должен содержать минимум 6 символов',
    'any.required': 'Пароль обязателен для заполнения'
  }),
  name: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Имя должно содержать минимум 2 символа',
    'string.max': 'Имя не должно превышать 50 символов',
    'any.required': 'Имя обязательно для заполнения'
  }),
  last_name: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Фамилия должна содержать минимум 2 символа',
    'string.max': 'Фамилия не должна превышать 50 символов',
    'any.required': 'Фамилия обязательна для заполнения'
  }),
  patronymic: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Отчество должно содержать минимум 2 символа',
    'string.max': 'Отчество не должно превышать 50 символов',
    'any.required': 'Отчество обязательно для заполнения'
  })
});

const tokenValidationSchema = Joi.object({
  token: Joi.string().required().messages({
    'any.required': 'Токен обязателен для проверки'
  })
});

class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async validateLoginData(data) {
    const { error, value } = loginSchema.validate(data, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map(detail => detail.message).join(', ');
      throw new Error(`Ошибки валидации: ${errorMessages}`);
    }
    return value;
  }

  async validateRegistrationData(data) {
    const { error, value } = registrationSchema.validate(data, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map(detail => detail.message).join(', ');
      throw new Error(`Ошибки валидации: ${errorMessages}`);
    }
    return value;
  }

  async validateTokenData(data) {
    const { error, value } = tokenValidationSchema.validate(data);
    if (error) {
      throw new Error(`Ошибка валидации: ${error.details[0].message}`);
    }
    return value;
  }

  async login(email, password) {
    try {
      // Валидация входных данных
      await this.validateLoginData({ email, password });

      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new Error('Пользователь с таким email не найден');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        throw new Error('Неверный пароль');
      }

      // Проверяем, не заблокирован ли пользователь
      if (user.is_blocked) {
        throw new Error('Учетная запись заблокирована');
      }

      // Обновляем время последнего доступа
      await this.userRepository.updateLastAccess(user.id);

      // Генерируем JWT токен
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email,
          role: user.role || 'student'
        },
        process.env.JWT_SECRET || 'edu_mobile_secret',
        { 
          expiresIn: '24h',
          issuer: 'edu-mobile-api',
          subject: user.id.toString()
        }
      );

      const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET || 'edu_mobile_refresh_secret',
        { expiresIn: '7d' }
      );

      const { password_hash, ...userWithoutPassword } = user;
      
      return {
        user: userWithoutPassword,
        token,
        refreshToken,
        expiresIn: '24h'
      };

    } catch (error) {
      console.error('Error in login:', error);
      throw error;
    }
  }

  async register(userData) {
    try {
      // Валидация входных данных
      const validatedData = await this.validateRegistrationData(userData);

      // Проверяем, существует ли пользователь с таким email
      const existingUser = await this.userRepository.findByEmail(validatedData.email);
      if (existingUser) {
        throw new Error('Пользователь с таким email уже существует');
      }

      // Хешируем пароль
      const hashedPassword = await bcrypt.hash(validatedData.password, 12);

      // Создаем пользователя
      const user = await this.userRepository.create({
        email: validatedData.email,
        password_hash: hashedPassword,
        name: validatedData.name,
        last_name: validatedData.last_name,
        patronymic: validatedData.patronymic,
        role: 'student' // По умолчанию студент
      });

      // Генерируем токен для нового пользователя
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email,
          role: user.role
        },
        process.env.JWT_SECRET || 'edu_mobile_secret',
        { 
          expiresIn: '24h',
          issuer: 'edu-mobile-api'
        }
      );

      const { password_hash, ...userWithoutPassword } = user;

      return {
        user: userWithoutPassword,
        token,
        expiresIn: '24h'
      };

    } catch (error) {
      console.error('Error in register:', error);
      throw error;
    }
  }

  async validateToken(token) {
    try {
      // Валидация входных данных
      await this.validateTokenData({ token });

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'edu_mobile_secret');
      
      // Проверяем, существует ли пользователь
      const user = await this.userRepository.findById(decoded.userId);
      if (!user) {
        throw new Error('Пользователь не найден');
      }

      // Проверяем, не заблокирован ли пользователь
      if (user.is_blocked) {
        throw new Error('Учетная запись заблокирована');
      }

      return {
        valid: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        decoded
      };

    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new Error('Неверный токен');
      }
      if (error.name === 'TokenExpiredError') {
        throw new Error('Токен истек');
      }
      throw error;
    }
  }

  async refreshToken(refreshToken) {
    try {
      if (!refreshToken) {
        throw new Error('Refresh token обязателен');
      }

      const decoded = jwt.verify(
        refreshToken, 
        process.env.JWT_REFRESH_SECRET || 'edu_mobile_refresh_secret'
      );

      const user = await this.userRepository.findById(decoded.userId);
      if (!user) {
        throw new Error('Пользователь не найден');
      }

      if (user.is_blocked) {
        throw new Error('Учетная запись заблокирована');
      }

      // Генерируем новый access token
      const newToken = jwt.sign(
        { 
          userId: user.id, 
          email: user.email,
          role: user.role
        },
        process.env.JWT_SECRET || 'edu_mobile_secret',
        { 
          expiresIn: '24h',
          issuer: 'edu-mobile-api'
        }
      );

      return {
        token: newToken,
        expiresIn: '24h'
      };

    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new Error('Неверный refresh token');
      }
      if (error.name === 'TokenExpiredError') {
        throw new Error('Refresh token истек');
      }
      throw error;
    }
  }

  async changePassword(userId, currentPassword, newPassword) {
    try {
      // Валидация новых паролей
      if (!currentPassword || !newPassword) {
        throw new Error('Текущий и новый пароль обязательны');
      }

      if (newPassword.length < 6) {
        throw new Error('Новый пароль должен содержать минимум 6 символов');
      }

      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error('Пользователь не найден');
      }

      // Проверяем текущий пароль
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isCurrentPasswordValid) {
        throw new Error('Текущий пароль неверен');
      }

      // Хешируем новый пароль
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);

      // Обновляем пароль
      await this.userRepository.update(userId, {
        password_hash: hashedNewPassword,
        updated_at: new Date()
      });

      return {
        success: true,
        message: 'Пароль успешно изменен'
      };

    } catch (error) {
      console.error('Error in changePassword:', error);
      throw error;
    }
  }
}

module.exports = AuthService;