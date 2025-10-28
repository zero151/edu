/**
 * Контейнер зависимостей для управления зависимостями приложения
 * Устраняет сильную связанность между слоями
 * Позволяет легко тестировать компоненты и менять реализации
 */
class Container {
  constructor() {
    this.dependencies = new Map();
    this.instances = new Map();
  }

  /**
   * Регистрирует зависимость в контейнере
   * @param {string} key - Уникальный ключ зависимости
   * @param {Function} factory - Фабричная функция для создания экземпляра
   * @param {boolean} isSingleton - Создавать ли один экземпляр на все приложение
   */
  register(key, factory, isSingleton = true) {
    this.dependencies.set(key, { factory, isSingleton });
  }

  /**
   * Получает экземпляр зависимости
   * @param {string} key - Ключ зависимости
   * @returns {*} Экземпляр зависимости
   */
  get(key) {
    if (!this.dependencies.has(key)) {
      throw new Error(`Зависимость '${key}' не зарегистрирована в контейнере`);
    }

    const { factory, isSingleton } = this.dependencies.get(key);

    if (isSingleton) {
      if (!this.instances.has(key)) {
        this.instances.set(key, factory(this));
      }
      return this.instances.get(key);
    }

    return factory(this);
  }

  /**
   * Очищает все экземпляры (полезно для тестирования)
   */
  clearInstances() {
    this.instances.clear();
  }
}

module.exports = Container;