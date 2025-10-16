const express = require('express');
const router = express.Router();

module.exports = (authController) => {
  // Аутентификация
  router.post('/login', authController.login);
  router.post('/register', authController.register);
  router.post('/logout', authController.logout);
  
  // Управление токенами
  router.post('/validate-token', authController.validateToken);
  router.post('/refresh-token', authController.refreshToken);
  
  // Управление паролями
  router.post('/:userId/change-password', authController.changePassword);
  
  // Профиль
  router.get('/profile', authController.getProfile);
  
  return router;
};