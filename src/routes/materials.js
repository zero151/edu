const express = require('express');
const router = express.Router();

module.exports = (materialController) => {
  // CRUD операции для материалов
  router.post('/', materialController.createMaterial);
  router.get('/course/:courseId', materialController.getMaterialsByCourseId);
  router.get('/:id', materialController.getMaterialById);
  router.put('/:id', materialController.updateMaterial);
  router.delete('/:id', materialController.deleteMaterial);
  
  // Дополнительные endpoints
  router.get('/:courseId/next/:currentOrderIndex', materialController.getNextMaterial);
  
  return router;
};