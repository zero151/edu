class MaterialService {
  constructor(materialRepository) {
    this.materialRepository = materialRepository;
  }

  async createMaterial(materialData) {
    return await this.materialRepository.create(materialData);
  }

  async getMaterialById(materialId) {
    const material = await this.materialRepository.findById(materialId);
    if (!material) {
      throw new Error('Материал не найден');
    }
    return material;
  }

  async getMaterialsByCourseId(courseId) {
    return await this.materialRepository.findByCourseId(courseId);
  }

  async updateMaterial(materialId, materialData) {
    return await this.materialRepository.update(materialId, materialData);
  }

  async deleteMaterial(materialId) {
    return await this.materialRepository.delete(materialId);
  }

  async getNextMaterial(courseId, currentOrderIndex) {
    return await this.materialRepository.getNextMaterial(courseId, currentOrderIndex);
  }

  async getMaterialWithCourseInfo(materialId) {
    return await this.materialRepository.findWithCourseInfo(materialId);
  }
}

module.exports = MaterialService;