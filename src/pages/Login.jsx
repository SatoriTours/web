import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme, ThemeMode } from '../contexts/ThemeContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Login = ({ onLogin, isAuthenticated }) => {
  const { themeMode } = useTheme();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 当isAuthenticated变为true时，重定向到首页或者之前尝试访问的页面
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!password.trim()) {
      setError('请输入密码');
      setIsLoading(false);
      return;
    }

    try {
      // 只使用密码进行登录
      const success = await onLogin(password);
      if (!success) {
        setError('密码不正确');
      }
    } catch (error) {
      setError('登录失败: ' + (error.message || '请稍后重试'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`container-fluid min-vh-100 d-flex align-items-center justify-content-center py-5 ${themeMode === ThemeMode.DARK ? 'bg-dark' : 'bg-light'}`}>
      <div className={`card border-0 shadow-lg ${themeMode === ThemeMode.DARK ? 'bg-dark text-light' : ''}`} style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-header bg-primary text-white text-center py-4">
          <h2 className="mb-0 fs-4">Daily Satori</h2>
          <p className="mb-0 small">记录当下，思考未来</p>
        </div>
        <div className="card-body p-4">
          {error && (
            <div className={`alert py-2 small ${themeMode === ThemeMode.DARK ? 'alert-danger text-light border border-danger' : 'alert-danger'}`} role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="password" className={`form-label small fw-bold ${themeMode === ThemeMode.DARK ? 'text-light' : ''}`}>
                密码
              </label>
              <div className="input-group">
                <span className={`input-group-text ${themeMode === ThemeMode.DARK ? 'bg-secondary text-light border-secondary' : ''}`}>
                  <i className="bi bi-lock-fill"></i>
                </span>
                <input
                  type="password"
                  className={`form-control ${themeMode === ThemeMode.DARK ? 'bg-dark text-light border-secondary' : ''}`}
                  id="password"
                  placeholder="请输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ height: '45px' }}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="rememberMe"
                />
                <label className={`form-check-label small ${themeMode === ThemeMode.DARK ? 'text-light' : ''}`} htmlFor="rememberMe">
                  记住我
                </label>
              </div>
            </div>

            <div className="d-grid mb-2 w-100">
              <button
                type="submit"
                className="btn"
                disabled={isLoading}
                style={{
                  padding: "0.5rem 1rem",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  width: "100%",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.2s ease-in-out",
                  height: '45px',
                  backgroundColor: "var(--bs-primary, #0d6efd)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "4px",
                  background: "linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                    <span>登录中...</span>
                  </>
                ) : '登录'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
