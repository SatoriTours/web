import { IS_PRODUCTION, API_ENDPOINTS } from '../config';
import httpClient from './httpClient';
import mockService from './mockService';

/**
 * 文章API服务
 */
export const articlesApi = {
  /**
   * 获取所有文章
   * @returns {Promise<Array>} 文章列表
   */
  async getAll() {
    if (IS_PRODUCTION) {
      return httpClient.get(API_ENDPOINTS.ARTICLES.GET_ALL);
    } else {
      const mockData = mockService.getMockData('articles');
      return mockService.mockGet(API_ENDPOINTS.ARTICLES.GET_ALL, mockData);
    }
  },

  /**
   * 获取单个文章
   * @param {string|number} id - 文章ID
   * @returns {Promise<Object>} 文章详情
   */
  async getById(id) {
    if (IS_PRODUCTION) {
      return httpClient.get(API_ENDPOINTS.ARTICLES.GET_BY_ID(id));
    } else {
      const mockData = mockService.getMockData('articles');
      return mockService.mockGet(API_ENDPOINTS.ARTICLES.GET_BY_ID(id), mockData);
    }
  },

  /**
   * 创建文章
   * @param {Object} data - 文章数据
   * @returns {Promise<Object>} 创建的文章
   */
  async create(data) {
    if (IS_PRODUCTION) {
      return httpClient.post(API_ENDPOINTS.ARTICLES.CREATE, data);
    } else {
      const mockData = mockService.getMockData('articles');
      return mockService.mockPost(API_ENDPOINTS.ARTICLES.CREATE, data, mockData);
    }
  },

  /**
   * 更新文章
   * @param {string|number} id - 文章ID
   * @param {Object} data - 更新数据
   * @returns {Promise<Object>} 更新后的文章
   */
  async update(id, data) {
    if (IS_PRODUCTION) {
      return httpClient.put(API_ENDPOINTS.ARTICLES.UPDATE(id), data);
    } else {
      const mockData = mockService.getMockData('articles');
      return mockService.mockPut(API_ENDPOINTS.ARTICLES.UPDATE(id), data, mockData);
    }
  },

  /**
   * 删除文章
   * @param {string|number} id - 文章ID
   * @returns {Promise<null>} 空返回
   */
  async delete(id) {
    if (IS_PRODUCTION) {
      return httpClient.delete(API_ENDPOINTS.ARTICLES.DELETE(id));
    } else {
      const mockData = mockService.getMockData('articles');
      return mockService.mockDelete(API_ENDPOINTS.ARTICLES.DELETE(id), mockData);
    }
  },

  /**
   * 从网页URL获取文章信息
   * @param {string} url - 网页URL
   * @returns {Promise<Object>} 从网页提取的文章信息
   */
  async fetchWebpageData(url) {
    if (IS_PRODUCTION) {
      return httpClient.post(API_ENDPOINTS.ARTICLES.FETCH_WEBPAGE, { url });
    } else {
      return mockService.mockFetchWebpage({ url });
    }
  }
};

/**
 * 日记API服务
 */
export const diaryApi = {
  /**
   * 获取所有日记
   * @returns {Promise<Array>} 日记列表
   */
  async getAll() {
    if (IS_PRODUCTION) {
      return httpClient.get(API_ENDPOINTS.DIARY.GET_ALL);
    } else {
      const mockData = mockService.getMockData('diary');
      return mockService.mockGet(API_ENDPOINTS.DIARY.GET_ALL, mockData);
    }
  },

  /**
   * 获取单篇日记
   * @param {string|number} id - 日记ID
   * @returns {Promise<Object>} 日记详情
   */
  async getById(id) {
    if (IS_PRODUCTION) {
      return httpClient.get(API_ENDPOINTS.DIARY.GET_BY_ID(id));
    } else {
      const mockData = mockService.getMockData('diary');
      return mockService.mockGet(API_ENDPOINTS.DIARY.GET_BY_ID(id), mockData);
    }
  },

  /**
   * 创建日记
   * @param {Object} data - 日记数据
   * @returns {Promise<Object>} 创建的日记
   */
  async create(data) {
    if (IS_PRODUCTION) {
      return httpClient.post(API_ENDPOINTS.DIARY.CREATE, data);
    } else {
      const mockData = mockService.getMockData('diary');
      return mockService.mockPost(API_ENDPOINTS.DIARY.CREATE, data, mockData);
    }
  },

  /**
   * 更新日记
   * @param {string|number} id - 日记ID
   * @param {Object} data - 更新数据
   * @returns {Promise<Object>} 更新后的日记
   */
  async update(id, data) {
    if (IS_PRODUCTION) {
      return httpClient.put(API_ENDPOINTS.DIARY.UPDATE(id), data);
    } else {
      const mockData = mockService.getMockData('diary');
      return mockService.mockPut(API_ENDPOINTS.DIARY.UPDATE(id), data, mockData);
    }
  },

  /**
   * 删除日记
   * @param {string|number} id - 日记ID
   * @returns {Promise<null>} 空返回
   */
  async delete(id) {
    if (IS_PRODUCTION) {
      return httpClient.delete(API_ENDPOINTS.DIARY.DELETE(id));
    } else {
      const mockData = mockService.getMockData('diary');
      return mockService.mockDelete(API_ENDPOINTS.DIARY.DELETE(id), mockData);
    }
  }
};
