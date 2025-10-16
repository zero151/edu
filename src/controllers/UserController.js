class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  register = async (req, res) => {
    try {
      const { email, password, name, last_name, patronymic } = req.body;

      if (!email || !password || !name || !last_name || !patronymic) {
        return res.status(400).json({
          success: false,
          error: 'Все поля обязательны для заполнения'
        });
      }

      const user = await this.userService.registerUser(req.body);
      
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

  updateUser = async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          error: 'Некорректный ID пользователя'
        });
      }

      const user = await this.userService.updateUser(userId, req.body);
      
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