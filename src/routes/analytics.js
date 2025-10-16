const express = require('express');
const router = express.Router();

module.exports = (analyticsController) => {
  // Аналитика платформы
  router.get('/platform/stats', analyticsController.getPlatformStats);
  router.get('/learning-trends', analyticsController.getLearningTrends);
  
  // Аналитика курсов
  router.get('/courses/:courseId/analytics', analyticsController.getCourseAnalytics);
  
  // Аналитика пользователей
  router.get('/users/:userId/learning-analytics', analyticsController.getUserLearningAnalytics);
  
  return router;
};