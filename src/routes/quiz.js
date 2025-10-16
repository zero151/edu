const express = require('express');
const router = express.Router();

module.exports = (quizController) => {
  // Управление тестированием
  router.post('/users/:userId/tests/:testId/start', quizController.startTest);
  router.post('/answers/submit', quizController.submitAnswer);
  router.post('/attempts/:attemptId/finish', quizController.finishAttempt);
  
  // Получение информации о попытках
  router.get('/users/:userId/tests/:testId/attempts', quizController.getUserAttempts);
  router.get('/attempts/:attemptId/details', quizController.getAttemptDetails);
  
  return router;
};