const UserService = require('../../services/UserService');
const bcrypt = require('bcrypt');

// Mock bcrypt
jest.mock('bcrypt');
const mockedBcrypt = bcrypt;

describe('UserService', () => {
  let userService;
  let mockUserRepository;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      getUserStats: jest.fn()
    };
    userService = new UserService(mockUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'John',
        last_name: 'Doe',
        patronymic: 'Smith'
      };

      const hashedPassword = 'hashedPassword123';
      const createdUser = {
        id: 1,
        email: userData.email,
        name: userData.name,
        last_name: userData.last_name,
        patronymic: userData.patronymic,
        password_hash: hashedPassword
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue(hashedPassword);
      mockUserRepository.create.mockResolvedValue(createdUser);

      const result = await userService.registerUser(userData);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email);
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...userData,
        password_hash: hashedPassword
      });
      expect(result).toEqual({
        id: 1,
        email: userData.email,
        name: userData.name,
        last_name: userData.last_name,
        patronymic: userData.patronymic
      });
      expect(result.password_hash).toBeUndefined();
    });

    it('should throw error if user already exists', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'John',
        last_name: 'Doe',
        patronymic: 'Smith'
      };

      const existingUser = { id: 1, email: userData.email };
      mockUserRepository.findByEmail.mockResolvedValue(existingUser);

      await expect(userService.registerUser(userData)).rejects.toThrow('Пользователь с таким email уже существует');
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it('should handle password hashing errors', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'John',
        last_name: 'Doe',
        patronymic: 'Smith'
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockedBcrypt.hash.mockRejectedValue(new Error('Hashing failed'));

      await expect(userService.registerUser(userData)).rejects.toThrow('Hashing failed');
    });
  });

  describe('getUserById', () => {
    it('should return user without password hash', async () => {
      const userId = 1;
      const user = {
        id: userId,
        email: 'test@example.com',
        name: 'John',
        password_hash: 'hashedPassword'
      };

      mockUserRepository.findById.mockResolvedValue(user);

      const result = await userService.getUserById(userId);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual({
        id: userId,
        email: 'test@example.com',
        name: 'John'
      });
      expect(result.password_hash).toBeUndefined();
    });

    it('should throw error if user not found', async () => {
      const userId = 999;
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(userService.getUserById(userId)).rejects.toThrow('Пользователь не найден');
    });
  });

  describe('updateUser', () => {
    it('should update user and return without password hash', async () => {
      const userId = 1;
      const userData = { name: 'Updated Name' };
      const updatedUser = {
        id: userId,
        email: 'test@example.com',
        name: 'Updated Name',
        password_hash: 'hashedPassword'
      };

      mockUserRepository.update.mockResolvedValue(updatedUser);

      const result = await userService.updateUser(userId, userData);

      expect(mockUserRepository.update).toHaveBeenCalledWith(userId, userData);
      expect(result.password_hash).toBeUndefined();
    });
  });

  describe('deleteUser', () => {
    it('should delete user', async () => {
      const userId = 1;
      mockUserRepository.delete.mockResolvedValue(true);

      const result = await userService.deleteUser(userId);

      expect(mockUserRepository.delete).toHaveBeenCalledWith(userId);
      expect(result).toBe(true);
    });
  });

  describe('getAllUsers', () => {
    it('should return all users without password hashes', async () => {
      const users = [
        { id: 1, email: 'user1@example.com', name: 'User1', password_hash: 'hash1' },
        { id: 2, email: 'user2@example.com', name: 'User2', password_hash: 'hash2' }
      ];

      mockUserRepository.findAll.mockResolvedValue(users);

      const result = await userService.getAllUsers();

      expect(mockUserRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual([
        { id: 1, email: 'user1@example.com', name: 'User1' },
        { id: 2, email: 'user2@example.com', name: 'User2' }
      ]);
      expect(result.every(user => !user.password_hash)).toBe(true);
    });
  });

  describe('getUserStats', () => {
    it('should return user statistics', async () => {
      const userId = 1;
      const stats = { total_courses: 5, completed_materials: 10 };

      mockUserRepository.getUserStats.mockResolvedValue(stats);

      const result = await userService.getUserStats(userId);

      expect(mockUserRepository.getUserStats).toHaveBeenCalledWith(userId);
      expect(result).toEqual(stats);
    });
  });
});
