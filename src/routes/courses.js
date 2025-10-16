const express = require('express');
const router = express.Router();

module.exports = (courseController) => {
  // CRUD операции для курсов
  router.post('/', courseController.createCourse);
  router.get('/', courseController.getAllCourses);
  router.get('/:id', courseController.getCourseById);
  router.put('/:id', courseController.updateCourse);
  router.delete('/:id', courseController.deleteCourse);
  
  // Дополнительные endpoints
  router.get('/:id/materials', courseController.getCourseWithMaterials);
  router.get('/popular/list', courseController.getPopularCourses);
  
  return router;
};