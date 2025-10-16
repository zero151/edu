const express = require('express');
const router = express.Router();

module.exports = (userController) => {
  // CRUD операции для пользователей
  router.post('/', userController.register);
  router.get('/', userController.getAllUsers);
  router.get('/:id', userController.getUserById);
  router.put('/:id', userController.updateUser);
  router.delete('/:id', userController.deleteUser);
  
  // Дополнительные endpoints
  router.get('/:id/stats', userController.getUserStats);
  
  return router;
};