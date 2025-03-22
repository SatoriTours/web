import { IS_PRODUCTION, API_ENDPOINTS } from '../config';
import httpClient from './httpClient';

/**
 * 文章API服务
 */
export const articlesApi = {
  /**
   * 获取所有文章
   * @returns {Promise<Array>} 文章列表
   */
  async getAll() {
    return httpClient.get(API_ENDPOINTS.ARTICLES.GET_ALL);
  },

  /**
   * 获取单个文章
   * @param {string|number} id - 文章ID
   * @returns {Promise<Object>} 文章详情
   */
  async getById(id) {
    return httpClient.get(API_ENDPOINTS.ARTICLES.GET_BY_ID(id));
  },

  /**
   * 创建文章
   * @param {Object} data - 文章数据
   * @returns {Promise<Object>} 创建的文章
   */
  async create(data) {
    return httpClient.post(API_ENDPOINTS.ARTICLES.CREATE, data);
  },

  /**
   * 更新文章
   * @param {string|number} id - 文章ID
   * @param {Object} data - 更新数据
   * @returns {Promise<Object>} 更新后的文章
   */
  async update(id, data) {
    return httpClient.put(API_ENDPOINTS.ARTICLES.UPDATE(id), data);
  },

  /**
   * 删除文章
   * @param {string|number} id - 文章ID
   * @returns {Promise<null>} 空返回
   */
  async delete(id) {
    return httpClient.delete(API_ENDPOINTS.ARTICLES.DELETE(id));
  },

  /**
   * 从网页URL获取文章信息
   * @param {string} url - 网页URL
   * @returns {Promise<Object>} 从网页提取的文章信息
   */
  async fetchWebpageData(url) {
    return httpClient.post(API_ENDPOINTS.ARTICLES.FETCH_WEBPAGE, { url });
  },

  /**
   * 搜索文章
   * @param {string} query - 搜索关键词
   * @returns {Promise<Array>} 搜索结果
   */
  async search(query) {
    return httpClient.get(`${API_ENDPOINTS.ARTICLES.SEARCH}?q=${encodeURIComponent(query)}`);
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
    return httpClient.get(API_ENDPOINTS.DIARY.GET_ALL);
  },

  /**
   * 获取单篇日记
   * @param {string|number} id - 日记ID
   * @returns {Promise<Object>} 日记详情
   */
  async getById(id) {
    return httpClient.get(API_ENDPOINTS.DIARY.GET_BY_ID(id));
  },

  /**
   * 创建日记
   * @param {Object} data - 日记数据
   * @returns {Promise<Object>} 创建的日记
   */
  async create(data) {
    return httpClient.post(API_ENDPOINTS.DIARY.CREATE, data);
  },

  /**
   * 更新日记
   * @param {string|number} id - 日记ID
   * @param {Object} data - 更新数据
   * @returns {Promise<Object>} 更新后的日记
   */
  async update(id, data) {
    return httpClient.put(API_ENDPOINTS.DIARY.UPDATE(id), data);
  },

  /**
   * 删除日记
   * @param {string|number} id - 日记ID
   * @returns {Promise<null>} 空返回
   */
  async delete(id) {
    return httpClient.delete(API_ENDPOINTS.DIARY.DELETE(id));
  },

  /**
   * 搜索日记
   * @param {string} query - 搜索关键词
   * @returns {Promise<Array>} 搜索结果
   */
  async search(query) {
    return httpClient.get(`${API_ENDPOINTS.DIARY.SEARCH}?q=${encodeURIComponent(query)}`);
  }
};
