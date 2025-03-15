import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Articles from './pages/Articles.jsx';
import Diary from './pages/Diary.jsx';
import Navbar from './components/Navbar.jsx';

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
  const handleLogin = (username, password) => {
    // 简单的认证逻辑，实际项目中应该连接后端API
    if (username && password) {
      localStorage.setItem('user', JSON.stringify({ username }));
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  // 登出处理函数
  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  // 保护路由组件
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      {isAuthenticated && <Navbar onLogout={handleLogout} />}

      <main className="flex-grow-1">
        <Routes>
          <Route path="/login" element={
            isAuthenticated
              ? <Navigate to="/articles" replace />
              : <Login onLogin={handleLogin} />
          } />

          <Route path="/articles" element={
            <ProtectedRoute>
              <Articles />
            </ProtectedRoute>
          } />

          <Route path="/articles/:id" element={
            <ProtectedRoute>
              <Articles />
            </ProtectedRoute>
          } />

          <Route path="/diary" element={
            <ProtectedRoute>
              <Diary />
            </ProtectedRoute>
          } />

          <Route path="/diary/:id" element={
            <ProtectedRoute>
              <Diary />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to={isAuthenticated ? "/articles" : "/login"} replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
