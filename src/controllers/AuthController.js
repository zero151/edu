/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Аутентификация пользователей и управление сессиями
 */

class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: 🔐 Аутентификация пользователя
   *     description: |
   *       Вход в систему с email и паролем.
   *       При успешной аутентификации возвращает JWT токен для доступа к защищенным endpoints.
   *       
   *       **Пример использования:**
   *       \`\`\`json
   *       {
   *         "email": "student@example.com",
   *         "password": "password123"
   *       }
   *       \`\`\`
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/AuthLogin'
   *           examples:
   *             student:
   *               summary: Пример для студента
   *               value:
   *                 email: student@example.com
   *                 password: password123
   *             teacher:
   *               summary: Пример для преподавателя
   *               value:
   *                 email: teacher@example.com
   *                 password: teacher123
   *     responses:
   *       200:
   *         description: ✅ Успешная аутентификация
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthResponse'
   *             examples:
   *               success:
   *                 summary: Успешный ответ
   *                 value:
   *                   success: true
   *                   data:
   *                     user:
   *                       id: 1
   *                       email: student@example.com
   *                       name: Иван
   *                       last_name: Иванов
   *                       patronymic: Иванович
   *                       created_at: "2024-01-15T10:30:00Z"
   *                       updated_at: "2024-01-15T10:30:00Z"
   *                     token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   *                     expiresIn: "24h"
   *                   message: "Успешная аутентификация"
   *       400:
   *         description: ❌ Ошибка валидации
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *             examples:
   *               validation:
   *                 summary: Ошибка валидации
   *                 value:
   *                   success: false
   *                   error: "Email и пароль обязательны для заполнения"
   *       401:
   *         description: 🔒 Неверные учетные данные
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *             examples:
   *               invalid:
   *                 summary: Неверный email или пароль
   *                 value:
   *                   success: false
   *                   error: "Неверный пароль"
   *       403:
   *         description: 🚫 Учетная запись заблокирована
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *             examples:
   *               blocked:
   *                 summary: Аккаунт заблокирован
   *                 value:
   *                   success: false
   *                   error: "Учетная запись заблокирована"
   */
  login = async (req, res) => {
    try {
      const { email, password } = req.body || {};
      if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Email и пароль обязательны' });
      }
      const result = await this.authService.login(email, password);
      return res.json({ success: true, data: result, message: 'Успешная аутентификация' });
    } catch (error) {
      const code = /парол|не найден|заблок/i.test(error.message) ? 401 : 400;
      return res.status(code).json({ success: false, error: error.message });
    }
  }

  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     summary: 🧾 Регистрация пользователя
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserRegistration'
   *     responses:
   *       201:
   *         description: Пользователь зарегистрирован
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Success'
   */
  register = async (req, res) => {
    try {
      const { email, password, name, last_name, patronymic } = req.body || {};
      const payload = { email, password, name, last_name, patronymic };
      const result = await this.authService.register(payload);
      return res.status(201).json({ success: true, data: result, message: 'Пользователь зарегистрирован' });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  /**
   * @swagger
   * /api/auth/logout:
   *   post:
   *     summary: 🚪 Выход из системы
   *     tags: [Authentication]
   *     responses:
   *       200:
   *         description: Сессия завершена
   */
  logout = async (req, res) => {
    try {
      // Если используется blacklist/refresh rotation — здесь бы инвалидировали токен
      return res.json({ success: true, message: 'Вы вышли из системы' });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  /**
   * @swagger
   * /api/auth/validate-token:
   *   post:
   *     summary: Проверка валидности токена
   *     tags: [Authentication]
   *     responses:
   *       200:
   *         description: Валиден/не валиден
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TokenValidationResponse'
   */
  validateToken = async (req, res) => {
    try {
      const { token } = req.body || {};
      const result = await this.authService.validateToken(token);
      return res.json({ success: true, data: result });
    } catch (error) {
      return res.status(401).json({ success: false, error: error.message });
    }
  }

  /**
   * @swagger
   * /api/auth/refresh-token:
   *   post:
   *     summary: Обновить токен
   *     tags: [Authentication]
   *     responses:
   *       200:
   *         description: Новый JWT и срок действия
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/RefreshTokenResponse'
   */
  refreshToken = async (req, res) => {
    try {
      const { refreshToken } = req.body || {};
      const result = await this.authService.refreshToken(refreshToken);
      return res.json({ success: true, data: result, message: 'Токен обновлён' });
    } catch (error) {
      return res.status(401).json({ success: false, error: error.message });
    }
  }

  /**
   * @swagger
   * /api/auth/{userId}/change-password:
   *   post:
   *     summary: Сменить пароль
   *     tags: [Authentication]
   *     parameters:
   *       - $ref: '#/components/parameters/userId'
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ChangePasswordRequest'
   *     responses:
   *       200:
   *         description: Пароль изменен
   */
  changePassword = async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { oldPassword, newPassword } = req.body || {};
      if (isNaN(userId)) {
        return res.status(400).json({ success: false, error: 'Некорректный ID пользователя' });
      }
      const result = await this.authService.changePassword(userId, oldPassword, newPassword);
      return res.json({ success: true, ...result });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  /**
   * @swagger
   * /api/auth/profile:
   *   get:
   *     summary: Профиль текущего пользователя
   *     tags: [Authentication]
   *     responses:
   *       200:
   *         description: Данные профиля
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ProfileResponse'
   */
  getProfile = async (req, res) => {
    try {
      // Предполагается, что middleware аутентификации добавляет req.user
      const user = req.user || null;
      if (!user) {
        return res.status(401).json({ success: false, error: 'Требуется аутентификация' });
      }
      return res.json({ success: true, data: user });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }
}

module.exports = AuthController;