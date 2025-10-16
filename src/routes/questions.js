const express = require('express');
const router = express.Router();

module.exports = (questionController) => {
  // CRUD операции для вопросов
  router.post('/', questionController.createQuestion);
  router.get('/test/:testId', questionController.getQuestionsByTestId);
  router.get('/:id', questionController.getQuestionById);
  router.put('/:id', questionController.updateQuestion);
  router.delete('/:id', questionController.deleteQuestion);
  
  // Дополнительные endpoints
  router.get('/:id/with-answers', questionController.getQuestionWithAnswers);
  
  return router;
};