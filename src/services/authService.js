import { API_ENDPOINTS } from '../config';
import httpClient from './httpClient';

/**
 * 身份验证服务
 * 处理用户登录、登出和认证状态管理
 */
class AuthService {
  /**
   * 用户登录
   * @param {string} password - 密码
   * @returns {Promise<object>} 登录结果
   */
  async login(password) {
    try {
      const response = await httpClient.post(API_ENDPOINTS.AUTH.LOGIN, {
        password
      }, {
        credentials: 'include'
      });

      console.log(response.success);
      console.log(response.data);

      // 根据API响应格式处理
      if (response.success) {
        return {
          success: true
        };
      } else {
        throw new Error('登录响应格式不正确');
      }
    } catch (error) {
      console.error('登录失败:', error);
      return {
        success: false,
        message: error.message || '密码不正确，请重试'
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
      return true;
    } catch (error) {
      console.error('登出请求失败:', error);
      return false;
    }
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

      return response.authenticated === true;
    } catch (error) {
      console.error('验证状态检查失败:', error);
      return false;
    }
  }

  /**
   * 获取当前用户信息
   * @returns {Promise<object|null>} 用户信息
   */
  async getCurrentUser() {
    try {
      const response = await httpClient.get(API_ENDPOINTS.AUTH.STATUS, {
        credentials: 'include'
      });

      if (response.authenticated && response.user) {
        return response.user;
      }
      return null;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      return null;
    }
  }
}

export default new AuthService();
