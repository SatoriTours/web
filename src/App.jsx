import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Articles from './pages/Articles.jsx';
import Diary from './pages/Diary.jsx';
import Settings from './pages/Settings.jsx';
import Navbar from './components/Navbar.jsx';
import TestHeroicons from './components/TestHeroicons.jsx';
import { ThemeProvider } from './contexts/ThemeContext';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  // 检查本地存储中是否有登录信息
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setIsAuthenticated(true);
    }
  }, []);

  // 登录处理函数
  const handleLogin = async (username, password) => {
    try {
      // 模拟API请求
      const response = await mockApiLogin(username, password);
      if (response.success) {
        localStorage.setItem('user', JSON.stringify({ username, token: response.token }));
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('登录失败:', error);
      return false;
    }
  };

  // 模拟API登录请求
  const mockApiLogin = async (username, password) => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    // 测试环境下的验证逻辑 - 任何用户名密码组合都能登录
    // 在实际项目中，这里应该是真实的API调用
    // return fetch('https://api.example.com/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ username, password })
    // }).then(res => res.json());

    // 测试账户设置 - 允许任何用户名和密码组合
    return {
      success: true,
      token: 'test-jwt-token-' + Math.random().toString(36).substring(2),
      message: '登录成功'
    };
  };

  // 登出处理函数
  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  // 路由保护组件
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
  };

  return (
    <ThemeProvider>
      {isAuthenticated && <Navbar onLogout={handleLogout} />}
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} isAuthenticated={isAuthenticated} />} />
        <Route path="/test-icons" element={<TestHeroicons />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Articles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/articles"
          element={
            <ProtectedRoute>
              <Articles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/articles/:id"
          element={
            <ProtectedRoute>
              <Articles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/diary"
          element={
            <ProtectedRoute>
              <Diary />
            </ProtectedRoute>
          }
        />
        <Route
          path="/diary/:id"
          element={
            <ProtectedRoute>
              <Diary />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
