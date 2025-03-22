import articlesData from '../assets/data/articles.json';
import diaryData from '../assets/data/diary.json';

/**
 * 模拟API服务
 * 在开发环境下使用，返回本地JSON数据
 */
class MockService {
  /**
   * 模拟延迟
   * @param {number} ms - 延迟毫秒数
   * @returns {Promise} 延迟Promise
   */
  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 模拟GET请求
   * @param {string} url - 请求URL
   * @param {Object} mockData - 模拟数据
   * @returns {Promise<any>} 模拟响应
   */
  async mockGet(url, mockData) {
    await this.delay();

    // 检查是否是获取单个项目的请求（URL中包含ID）
    const idMatch = url.match(/\/([^\/]+)$/);
    if (idMatch) {
      const id = idMatch[1];
      const item = mockData.find(item => String(item.id) === String(id));

      if (!item) {
        throw new Error('未找到项目');
      }

      return item;
    }

    return [...mockData]; // 返回数据的副本
  }

  /**
   * 模拟POST请求
   * @param {string} url - 请求URL
   * @param {Object} data - 请求数据
   * @param {Array} mockData - 模拟数据数组
   * @returns {Promise<Object>} 创建的项目
   */
  async mockPost(url, data, mockData) {
    await this.delay();

    const newItem = {
      ...data,
      id: Date.now(), // 生成唯一ID
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // 在真实应用中，这里会将数据持久化
    // 但是在模拟服务中，每次刷新页面数据都会重置

    return newItem;
  }

  /**
   * 模拟PUT请求
   * @param {string} url - 请求URL
   * @param {Object} data - 请求数据
   * @param {Array} mockData - 模拟数据数组
   * @returns {Promise<Object>} 更新后的项目
   */
  async mockPut(url, data, mockData) {
    await this.delay();

    const idMatch = url.match(/\/([^\/]+)$/);
    if (!idMatch) {
      throw new Error('无效的URL');
    }

    const id = idMatch[1];
    const index = mockData.findIndex(item => String(item.id) === String(id));

    if (index === -1) {
      throw new Error('未找到项目');
    }

    const updatedItem = {
      ...mockData[index],
      ...data,
      updatedAt: new Date().toISOString()
    };

    // 在真实应用中，这里会更新持久化数据

    return updatedItem;
  }

  /**
   * 模拟DELETE请求
   * @param {string} url - 请求URL
   * @param {Array} mockData - 模拟数据数组
   * @returns {Promise<null>} 空响应
   */
  async mockDelete(url, mockData) {
    await this.delay();

    const idMatch = url.match(/\/([^\/]+)$/);
    if (!idMatch) {
      throw new Error('无效的URL');
    }

    const id = idMatch[1];
    const index = mockData.findIndex(item => String(item.id) === String(id));

    if (index === -1) {
      throw new Error('未找到项目');
    }

    // 在真实应用中，这里会从持久化存储中删除

    return null;
  }

  /**
   * 模拟获取网页信息
   * @param {Object} data - 包含URL的请求数据
   * @returns {Promise<Object>} 网页信息
   */
  async mockFetchWebpage(data) {
    await this.delay(800);

    const { url } = data;

    // 生成模拟的网页数据
    return {
      id: Date.now(),
      url,
      title: `关于 ${url.split('//')[1].split('/')[0]} 的文章`,
      summary: '这是一篇AI生成的文章摘要，描述了网页的主要内容和重点。在实际项目中，这部分应该由后端AI服务生成。',
      favicon: 'https://example.com/favicon.ico',
      screenshot: 'https://images.unsplash.com/photo-1481487196290-c152efe083f5',
      addedAt: new Date().toISOString()
    };
  }

  /**
   * 获取模拟数据
   * @param {string} type - 数据类型 ('articles' 或 'diary')
   * @returns {Array} 模拟数据数组
   */
  getMockData(type) {
    switch (type) {
      case 'articles':
        return articlesData;
      case 'diary':
        return diaryData;
      default:
        return [];
    }
  }
}

export default new MockService();
