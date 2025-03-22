/**
 * 配置文件
 * 包含API端点URL定义
 */

// 环境变量
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// 基础URL - 直接指向实际API服务器地址
export const BASE_URL = 'https://api.yourdomain.com';

// API端点
export const API_ENDPOINTS = {
  // 认证相关
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
    LOGOUT: `${BASE_URL}/auth/logout`,
    STATUS: `${BASE_URL}/auth/status`,
    REGISTER: `${BASE_URL}/auth/register`
  },

  // 文章相关
  ARTICLES: {
    GET_ALL: `${BASE_URL}/articles`,
    GET_BY_ID: (id) => `${BASE_URL}/articles/${id}`,
    CREATE: `${BASE_URL}/articles`,
    UPDATE: (id) => `${BASE_URL}/articles/${id}`,
    DELETE: (id) => `${BASE_URL}/articles/${id}`,
    FETCH_WEBPAGE: `${BASE_URL}/articles/fetch-webpage`,
    SEARCH: `${BASE_URL}/articles/search`
  },

  // 日记相关
  DIARY: {
    GET_ALL: `${BASE_URL}/diary`,
    GET_BY_ID: (id) => `${BASE_URL}/diary/${id}`,
    CREATE: `${BASE_URL}/diary`,
    UPDATE: (id) => `${BASE_URL}/diary/${id}`,
    DELETE: (id) => `${BASE_URL}/diary/${id}`,
    SEARCH: `${BASE_URL}/diary/search`
  }
};

// 本地存储键
export const STORAGE_KEYS = {
  SIDEBAR_WIDTH: 'satori_sidebar_width',
  THEME: 'satori_theme',
  USER: 'satori_user'
};
