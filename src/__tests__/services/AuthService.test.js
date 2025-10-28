const AuthService = require('../../services/AuthService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock dependencies
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const mockedBcrypt = bcrypt;
const mockedJwt = jwt;

describe('AuthService', () => {
  let authService;
  let mockUserRepository;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateLastAccess: jest.fn()
    };
    authService = new AuthService(mockUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const user = {
        id: 1,
        email,
        password_hash: 'hashedPassword',
        is_blocked: false,
        role: 'student'
      };

      mockedBcrypt.compare.mockResolvedValue(true);
      mockUserRepository.findByEmail.mockResolvedValue(user);
      mockUserRepository.updateLastAccess.mockResolvedValue();
      mockedJwt.sign.mockReturnValue('mockToken');

      const result = await authService.login(email, password);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(password, user.password_hash);
      expect(mockUserRepository.updateLastAccess).toHaveBeenCalledWith(user.id);
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('expiresIn');
      expect(result.user.password_hash).toBeUndefined();
    });

    it('should throw error for non-existent user', async () => {
      const email = 'nonexistent@example.com';
      const password = 'password123';

      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(authService.login(email, password)).rejects.toThrow('Пользователь с таким email не найден');
    });

    it('should throw error for invalid password', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';
      const user = {
        id: 1,
        email,
        password_hash: 'hashedPassword',
        is_blocked: false
      };

      mockUserRepository.findByEmail.mockResolvedValue(user);
      mockedBcrypt.compare.mockResolvedValue(false);

      await expect(authService.login(email, password)).rejects.toThrow('Неверный пароль');
    });

    it('should throw error for blocked user', async () => {
      const email = 'blocked@example.com';
      const password = 'password123';
      const user = {
        id: 1,
        email,
        password_hash: 'hashedPassword',
        is_blocked: true
      };

      mockUserRepository.findByEmail.mockResolvedValue(user);
      mockedBcrypt.compare.mockResolvedValue(true);

      await expect(authService.login(email, password)).rejects.toThrow('Учетная запись заблокирована');
    });

    it('should validate input data', async () => {
      await expect(authService.login('invalid-email', '123')).rejects.toThrow();
      await expect(authService.login('', 'password123')).rejects.toThrow();
      await expect(authService.login('test@example.com', '')).rejects.toThrow();
    });
  });

  describe('register', () => {
    it('should register user successfully', async () => {
      const userData = {
        email: 'new@example.com',
        password: 'password123',
        name: 'John',
        last_name: 'Doe',
        patronymic: 'Smith'
      };

      const hashedPassword = 'hashedPassword';
      const createdUser = {
        id: 1,
        ...userData,
        password_hash: hashedPassword,
        role: 'student'
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue(hashedPassword);
      mockUserRepository.create.mockResolvedValue(createdUser);
      mockedJwt.sign.mockReturnValue('mockToken');

      const result = await authService.register(userData);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email);
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(userData.password, 12);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        email: userData.email,
        password_hash: hashedPassword,
        name: userData.name,
        last_name: userData.last_name,
        patronymic: userData.patronymic,
        role: 'student'
      });
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user.password_hash).toBeUndefined();
    });

    it('should throw error if user already exists', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'John',
        last_name: 'Doe',
        patronymic: 'Smith'
      };

      mockUserRepository.findByEmail.mockResolvedValue({ id: 1, email: userData.email });

      await expect(authService.register(userData)).rejects.toThrow('Пользователь с таким email уже существует');
    });

    it('should validate registration data', async () => {
      const invalidData = {
        email: 'invalid-email',
        password: '123',
        name: 'A',
        last_name: 'B',
        patronymic: 'C'
      };

      await expect(authService.register(invalidData)).rejects.toThrow();
    });
  });

  describe('validateToken', () => {
    it('should validate token successfully', async () => {
      const token = 'validToken';
      const decoded = { userId: 1, email: 'test@example.com' };
      const user = {
        id: 1,
        email: 'test@example.com',
        name: 'John',
        is_blocked: false,
        role: 'student'
      };

      mockedJwt.verify.mockReturnValue(decoded);
      mockUserRepository.findById.mockResolvedValue(user);

      const result = await authService.validateToken(token);

      expect(mockedJwt.verify).toHaveBeenCalledWith(token, expect.any(String));
      expect(mockUserRepository.findById).toHaveBeenCalledWith(decoded.userId);
      expect(result.valid).toBe(true);
      expect(result.user).toBeDefined();
    });

    it('should throw error for invalid token', async () => {
      const token = 'invalidToken';
      const error = new Error('Invalid token');
      error.name = 'JsonWebTokenError';

      mockedJwt.verify.mockImplementation(() => {
        throw error;
      });

      await expect(authService.validateToken(token)).rejects.toThrow('Неверный токен');
    });

    it('should throw error for expired token', async () => {
      const token = 'expiredToken';
      const error = new Error('Token expired');
      error.name = 'TokenExpiredError';

      mockedJwt.verify.mockImplementation(() => {
        throw error;
      });

      await expect(authService.validateToken(token)).rejects.toThrow('Токен истек');
    });

    it('should throw error if user not found', async () => {
      const token = 'validToken';
      const decoded = { userId: 999 };

      mockedJwt.verify.mockReturnValue(decoded);
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(authService.validateToken(token)).rejects.toThrow('Пользователь не найден');
    });

    it('should throw error for blocked user', async () => {
      const token = 'validToken';
      const decoded = { userId: 1 };
      const user = { id: 1, is_blocked: true };

      mockedJwt.verify.mockReturnValue(decoded);
      mockUserRepository.findById.mockResolvedValue(user);

      await expect(authService.validateToken(token)).rejects.toThrow('Учетная запись заблокирована');
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const refreshToken = 'validRefreshToken';
      const decoded = { userId: 1 };
      const user = {
        id: 1,
        email: 'test@example.com',
        role: 'student',
        is_blocked: false
      };

      mockedJwt.verify.mockReturnValue(decoded);
      mockUserRepository.findById.mockResolvedValue(user);
      mockedJwt.sign.mockReturnValue('newToken');

      const result = await authService.refreshToken(refreshToken);

      expect(mockedJwt.verify).toHaveBeenCalledWith(refreshToken, expect.any(String));
      expect(mockUserRepository.findById).toHaveBeenCalledWith(decoded.userId);
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('expiresIn');
    });

    it('should throw error for invalid refresh token', async () => {
      const refreshToken = 'invalidRefreshToken';
      const error = new Error('Invalid refresh token');
      error.name = 'JsonWebTokenError';

      mockedJwt.verify.mockImplementation(() => {
        throw error;
      });

      await expect(authService.refreshToken(refreshToken)).rejects.toThrow('Неверный refresh token');
    });

    it('should throw error if refresh token is missing', async () => {
      await expect(authService.refreshToken()).rejects.toThrow('Refresh token обязателен');
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const userId = 1;
      const currentPassword = 'oldPassword';
      const newPassword = 'newPassword123';
      const user = {
        id: userId,
        password_hash: 'hashedOldPassword'
      };

      mockUserRepository.findById.mockResolvedValue(user);
      mockedBcrypt.compare.mockResolvedValue(true);
      mockedBcrypt.hash.mockResolvedValue('hashedNewPassword');
      mockUserRepository.update.mockResolvedValue();

      const result = await authService.changePassword(userId, currentPassword, newPassword);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(currentPassword, user.password_hash);
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(newPassword, 12);
      expect(mockUserRepository.update).toHaveBeenCalledWith(userId, {
        password_hash: 'hashedNewPassword',
        updated_at: expect.any(Date)
      });
      expect(result.success).toBe(true);
    });

    it('should throw error if user not found', async () => {
      const userId = 999;
      const currentPassword = 'oldPassword';
      const newPassword = 'newPassword123';

      mockUserRepository.findById.mockResolvedValue(null);

      await expect(authService.changePassword(userId, currentPassword, newPassword)).rejects.toThrow('Пользователь не найден');
    });

    it('should throw error for invalid current password', async () => {
      const userId = 1;
      const currentPassword = 'wrongPassword';
      const newPassword = 'newPassword123';
      const user = { id: userId, password_hash: 'hashedPassword' };

      mockUserRepository.findById.mockResolvedValue(user);
      mockedBcrypt.compare.mockResolvedValue(false);

      await expect(authService.changePassword(userId, currentPassword, newPassword)).rejects.toThrow('Текущий пароль неверен');
    });

    it('should throw error for short new password', async () => {
      const userId = 1;
      const currentPassword = 'oldPassword';
      const newPassword = '123';

      await expect(authService.changePassword(userId, currentPassword, newPassword)).rejects.toThrow('Новый пароль должен содержать минимум 6 символов');
    });

    it('should throw error for missing passwords', async () => {
      const userId = 1;

      await expect(authService.changePassword(userId, '', 'newPassword')).rejects.toThrow('Текущий и новый пароль обязательны');
      await expect(authService.changePassword(userId, 'oldPassword', '')).rejects.toThrow('Текущий и новый пароль обязательны');
    });
  });
});
