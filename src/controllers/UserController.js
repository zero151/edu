class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  /**
   * @swagger
   * /api/users:
   *   post:
   *     tags: [Users]
   *     summary: Регистрация нового пользователя
   *     description: Создает нового пользователя. Лишние поля будут проигнорированы.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserRegistration'
   *     responses:
   *       201:
   *         description: Пользователь создан
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Success'
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   */
  register = async (req, res) => {
    try {
      const { email, password, name, last_name, patronymic } = req.body || {};
      // Разрешенные поля (отбрасываем лишнее)
      const payload = { email, password, name, last_name, patronymic };

      if (!email || !password || !name || !last_name || !patronymic) {
        return res.status(400).json({
          success: false,
          error: 'Все поля обязательны для заполнения'
        });
      }

      const user = await this.userService.registerUser(payload);
      
      res.status(201).json({
        success: true,
        data: user,
        message: 'Пользователь успешно зарегистрирован'
      });

    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * @swagger
   * /api/users/{id}:
   *   get:
   *     tags: [Users]
   *     summary: Получить пользователя по ID
   *     parameters:
   *       - $ref: '#/components/parameters/userId'
   *     responses:
   *       200:
   *         description: Успешно
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Success'
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   */
  getUserById = async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          error: 'Некорректный ID пользователя'
        });
      }

      const user = await this.userService.getUserById(userId);
      
      res.json({
        success: true,
        data: user
      });

    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * @swagger
   * /api/users/{id}:
   *   put:
   *     tags: [Users]
   *     summary: Обновить данные пользователя
   *     parameters:
   *       - $ref: '#/components/parameters/userId'
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserUpdate'
   *     responses:
   *       200:
   *         description: Обновлено
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   */
  updateUser = async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          error: 'Некорректный ID пользователя'
        });
      }

      // Вайтлист полей
      const { email, name, last_name, patronymic } = req.body || {};
      const updatePayload = { };
      if (email !== undefined) updatePayload.email = email;
      if (name !== undefined) updatePayload.name = name;
      if (last_name !== undefined) updatePayload.last_name = last_name;
      if (patronymic !== undefined) updatePayload.patronymic = patronymic;

      const user = await this.userService.updateUser(userId, updatePayload);
      
      res.json({
        success: true,
        data: user,
        message: 'Пользователь успешно обновлен'
      });

    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  deleteUser = async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          error: 'Некорректный ID пользователя'
        });
      }

      await this.userService.deleteUser(userId);
      
      res.json({
        success: true,
        message: 'Пользователь успешно удален'
      });

    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * @swagger
   * /api/users:
   *   get:
   *     tags: [Users]
   *     summary: Список пользователей
   *     responses:
   *       200:
   *         description: Успешно
   */
  getAllUsers = async (req, res) => {
    try {
      const users = await this.userService.getAllUsers();
      
      res.json({
        success: true,
        data: users,
        count: users.length
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * @swagger
   * /api/users/{id}/stats:
   *   get:
   *     tags: [Users]
   *     summary: Статистика пользователя
   *     parameters:
   *       - $ref: '#/components/parameters/userId'
   *     responses:
   *       200:
   *         description: Успешно
   */
  getUserStats = async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          error: 'Некорректный ID пользователя'
        });
      }

      const stats = await this.userService.getUserStats(userId);
      
      res.json({
        success: true,
        data: stats
      });

    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = UserController;