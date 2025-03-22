/**
 * 配置文件
 * 包含环境变量和API端点URL定义
 */

// 环境变量
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// 基础URL
export const BASE_URL = IS_PRODUCTION
  ? 'https://api.yourdomain.com' // 生产环境API地址
  : '/api'; // 开发环境API地址（可以配合proxy使用）

// API端点
export const API_ENDPOINTS = {
  // 文章相关
  ARTICLES: {
    GET_ALL: `${BASE_URL}/articles`,
    GET_BY_ID: (id) => `${BASE_URL}/articles/${id}`,
    CREATE: `${BASE_URL}/articles`,
    UPDATE: (id) => `${BASE_URL}/articles/${id}`,
    DELETE: (id) => `${BASE_URL}/articles/${id}`,
    FETCH_WEBPAGE: `${BASE_URL}/articles/fetch-webpage`
  },

  // 日记相关
  DIARY: {
    GET_ALL: `${BASE_URL}/diary`,
    GET_BY_ID: (id) => `${BASE_URL}/diary/${id}`,
    CREATE: `${BASE_URL}/diary`,
    UPDATE: (id) => `${BASE_URL}/diary/${id}`,
    DELETE: (id) => `${BASE_URL}/diary/${id}`
  }
};

// 本地存储键
export const STORAGE_KEYS = {
  ARTICLES: 'satori_articles',
  DIARY: 'satori_diary',
  SIDEBAR_WIDTH: 'satori_sidebar_width',
  THEME: 'satori_theme'
};
