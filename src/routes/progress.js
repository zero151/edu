const express = require('express');
const router = express.Router();

module.exports = (progressController) => {
  // Отслеживание прогресса
  router.post('/users/:userId/courses/:courseId/materials/:materialId/complete', progressController.markMaterialCompleted);
  router.post('/users/:userId/materials/:materialId/access', progressController.updateMaterialAccess);
  
  // Получение информации о прогрессе
  router.get('/users/:userId/courses/:courseId/progress', progressController.getCourseProgress);
  router.get('/users/:userId/overall-progress', progressController.getUserOverallProgress);
  router.get('/users/:userId/recent-activities', progressController.getRecentActivities);
  
  return router;
};