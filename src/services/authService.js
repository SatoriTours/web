import { API_ENDPOINTS } from '../config';
import httpClient from './httpClient';

/**
 * 身份验证服务
 * 处理用户登录、登出和认证状态管理
 */
class AuthService {
  /**
   * 用户登录
   * @param {string} username - 用户名
   * @param {string} password - 密码
   * @returns {Promise<object>} 登录结果
   */
  async login(username, password) {
    try {
      const response = await httpClient.post(API_ENDPOINTS.AUTH.LOGIN, {
        username,
        password
      }, {
        credentials: 'include'
      });

      // 存储用户信息
      localStorage.setItem('user', JSON.stringify({
        username: response.username,
        name: response.name
      }));

      return {
        success: true,
        user: response
      };
    } catch (error) {
      console.error('登录失败:', error);
      return {
        success: false,
        message: error.message || '登录失败，请稍后重试'
      };
    }
  }

  /**
   * 用户登出
   * @returns {Promise<boolean>} 登出结果
   */
  async logout() {
    try {
      await httpClient.post(API_ENDPOINTS.AUTH.LOGOUT, {}, {
        credentials: 'include'
      });
    } catch (error) {
      console.error('登出请求失败:', error);
    }

    // 清除本地存储
    localStorage.removeItem('user');
    return true;
  }

  /**
   * 检查用户认证状态
   * @returns {Promise<boolean>} 是否已认证
   */
  async checkAuthStatus() {
    try {
      const response = await httpClient.get(API_ENDPOINTS.AUTH.STATUS, {
        credentials: 'include'
      });

      if (response.authenticated) {
        // 更新本地存储中的用户信息
        localStorage.setItem('user', JSON.stringify({
          username: response.username,
          name: response.name
        }));
        return true;
      } else {
        localStorage.removeItem('user');
        return false;
      }
    } catch (error) {
      console.error('验证状态检查失败:', error);
      localStorage.removeItem('user');
      return false;
    }
  }

  /**
   * 获取当前用户信息
   * @returns {object|null} 用户信息
   */
  getCurrentUser() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      return null;
    }
  }
}

export default new AuthService();
