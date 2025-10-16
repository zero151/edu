const bcrypt = require('bcrypt');

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async registerUser(userData) {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Пользователь с таким email уже существует');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.userRepository.create({
      ...userData,
      password_hash: hashedPassword
    });

    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getUserById(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('Пользователь не найден');
    }
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateUser(userId, userData) {
    const user = await this.userRepository.update(userId, userData);
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async deleteUser(userId) {
    return await this.userRepository.delete(userId);
  }

  async getUserStats(userId) {
    return await this.userRepository.getUserStats(userId);
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll();
    return users.map(user => {
      const { password_hash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }
}

module.exports = UserService;