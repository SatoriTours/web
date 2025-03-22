// HTTP客户端服务
import { IS_PRODUCTION } from '../config';

/**
 * 通用HTTP客户端封装
 */
class HttpClient {
  async fetch(url, options = {}) {
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };

    // 添加credentials选项，用于处理跨域请求中的cookie
    if (options.credentials) {
      defaultOptions.credentials = options.credentials;
    }

    const requestOptions = {
      ...defaultOptions,
      ...options
    };

    try {
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `请求失败: ${response.status}`);
      }

      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('HTTP请求错误:', error);
      throw error;
    }
  }

  get(url, options = {}) {
    return this.fetch(url, {
      method: 'GET',
      ...options
    });
  }

  post(url, data, options = {}) {
    return this.fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    });
  }

  put(url, data, options = {}) {
    return this.fetch(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options
    });
  }

  delete(url, options = {}) {
    return this.fetch(url, {
      method: 'DELETE',
      ...options
    });
  }
}

export default new HttpClient();
