import React, { createContext, useContext, useState, useEffect } from 'react';

// 主题模式枚举
export const ThemeMode = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

// 创建主题上下文
const ThemeContext = createContext();

// 主题提供者组件
export const ThemeProvider = ({ children }) => {
  // 从本地存储获取主题模式，默认为系统模式
  const [themeMode, setThemeMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme-mode');
    return savedTheme || ThemeMode.SYSTEM;
  });

  // 检测系统主题偏好
  const detectSystemTheme = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ?
      ThemeMode.DARK : ThemeMode.LIGHT;
  };

  // 应用主题到文档
  const applyTheme = (mode) => {
    const themeToApply = mode === ThemeMode.SYSTEM ?
      detectSystemTheme() : mode;

    if (themeToApply === ThemeMode.DARK) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  // 变更主题模式
  const changeThemeMode = (mode) => {
    setThemeMode(mode);
    localStorage.setItem('theme-mode', mode);
    applyTheme(mode);
  };

  // 监听系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      if (themeMode === ThemeMode.SYSTEM) {
        applyTheme(ThemeMode.SYSTEM);
      }
    };

    // 初始应用主题
    applyTheme(themeMode);

    // 添加系统主题变更监听
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // 兼容旧版浏览器
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [themeMode]);

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode: changeThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 自定义钩子，方便使用主题上下文
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme必须在ThemeProvider内部使用');
  }
  return context;
};
