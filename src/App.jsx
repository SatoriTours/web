import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Articles from './pages/Articles.jsx';
import Diary from './pages/Diary.jsx';
import Settings from './pages/Settings.jsx';
import Navbar from './components/Navbar.jsx';
import TestHeroicons from './components/TestHeroicons.jsx';
import { ThemeProvider } from './contexts/ThemeContext';
import authService from './services/authService';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  // 检查认证状态
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const isAuth = await authService.checkAuthStatus();
        setIsAuthenticated(isAuth);
      } catch (error) {
        console.error('检查认证状态失败:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 登录处理函数
  const handleLogin = async (password) => {
    try {
      const result = await authService.login(password);
      if (result.success) {
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('登录失败:', error);
      return false;
    }
  };

  // 登出处理函数
  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  // 路由保护组件
  const ProtectedRoute = ({ children }) => {
    if (isLoading) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">加载中...</span>
          </div>
        </div>
      );
    }

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
