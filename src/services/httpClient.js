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
      },
      // 默认添加credentials，用于处理跨域请求中的cookie
      credentials: 'include'
    };

    // 如果options中明确指定了credentials，则使用指定的值
    if (options.credentials !== undefined) {
      defaultOptions.credentials = options.credentials;
    }

    const requestOptions = {
      ...defaultOptions,
      ...options
    };

    // 在开发模式下打印请求信息，方便调试
    if (!IS_PRODUCTION) {
      console.log(`🚀 [HTTP ${requestOptions.method}]`, url);
    }

    try {
      const response = await fetch(url, requestOptions);

      // 对于204 No Content响应，直接返回null
      if (response.status === 204) {
        return null;
      }

      const responseData = await response.json();

      // 在开发模式下打印响应信息，方便调试
      if (!IS_PRODUCTION) {
        console.log(`📥 [Response]`, responseData);
      }

      // 处理新的API响应格式
      if (!responseData.success) {
        throw new Error(responseData.error || `请求失败: ${responseData.status || response.status}`);
      }

      // 返回数据部分
      return responseData.data;
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
