import { useState, useEffect } from 'react';

/**
 * 使用localStorage存储和管理数据的Hook
 * @param {string} key - localStorage键名
 * @param {any} initialValue - 默认值，如果localStorage中没有数据
 * @returns {Array} [storedValue, setValue, resetToInitial] - 存储值、设置函数和重置函数
 */
const useLocalStorage = (key, initialValue) => {
  // 从localStorage获取初始值，如果没有则使用提供的初始值
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      // 解析存储的JSON，或者返回initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 当storageValue变化时，更新localStorage
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // 重置为初始值的函数
  const resetToInitial = () => {
    setStoredValue(initialValue);
  };

  return [storedValue, setStoredValue, resetToInitial];
};

export default useLocalStorage;
