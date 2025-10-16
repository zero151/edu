const express = require('express');
const router = express.Router();

module.exports = (testController) => {
  // CRUD операции для тестов
  router.post('/', testController.createTest);
  router.get('/course/:courseId', testController.getTestsByCourseId);
  router.get('/:id', testController.getTestById);
  router.put('/:id', testController.updateTest);
  router.delete('/:id', testController.deleteTest);
  
  // Дополнительные endpoints
  router.get('/:id/with-questions', testController.getTestWithQuestions);
  
  return router;
};