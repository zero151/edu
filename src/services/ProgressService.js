class ProgressService {
  constructor(progressRepository) {
    this.progressRepository = progressRepository;
  }

  async markMaterialAsCompleted(userId, courseId, materialId) {
    return await this.progressRepository.markAsCompleted(userId, courseId, materialId);
  }

  async updateMaterialAccess(userId, materialId) {
    return await this.progressRepository.updateLastAccessed(userId, materialId);
  }

  async getCourseProgress(userId, courseId) {
    return await this.progressRepository.getCourseProgress(userId, courseId);
  }

  async getUserOverallProgress(userId) {
    return await this.progressRepository.getUserOverallProgress(userId);
  }

  async getRecentActivities(userId, limit = 10) {
    return await this.progressRepository.getRecentActivities(userId, limit);
  }
}

module.exports = ProgressService;