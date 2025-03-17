import React from 'react';
import { useTheme, ThemeMode } from '../contexts/ThemeContext';

const Settings = () => {
  const { themeMode, setThemeMode } = useTheme();

  const handleThemeChange = (mode) => {
    setThemeMode(mode);
  };

  const handleClearLocalData = () => {
    if (window.confirm('确定要清除所有本地数据吗？这将重置您的文章和日记数据。')) {
      // 保留主题和认证状态，清除其他数据
      const themePreference = localStorage.getItem('theme-mode');
      const authStatus = localStorage.getItem('user');

      localStorage.clear();

      // 恢复主题和认证状态
      if (themePreference) localStorage.setItem('theme-mode', themePreference);
      if (authStatus) localStorage.setItem('user', authStatus);

      alert('本地数据已清除');
    }
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4 page-title">设置</h1>

      <div className="card settings-card">
        <div className="card-body">
          <h2 className="mb-4">显示</h2>

          <form>
            <div className="mb-4">
              <label className="form-label fw-bold mb-3">主题模式</label>

              <div className="theme-options d-flex flex-column flex-md-row gap-3 mt-2">
                <div
                  className={`theme-option d-flex p-3 rounded ${themeMode === ThemeMode.LIGHT ? 'border border-primary' : 'border'}`}
                  onClick={() => handleThemeChange(ThemeMode.LIGHT)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="theme-icon me-3 fs-4">
                    <i className="bi bi-sun"></i>
                  </div>
                  <div>
                    <div className="fw-bold">浅色</div>
                    <div className="text-muted small">始终使用浅色主题</div>
                  </div>
                </div>

                <div
                  className={`theme-option d-flex p-3 rounded ${themeMode === ThemeMode.DARK ? 'border border-primary' : 'border'}`}
                  onClick={() => handleThemeChange(ThemeMode.DARK)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="theme-icon me-3 fs-4">
                    <i className="bi bi-moon"></i>
                  </div>
                  <div>
                    <div className="fw-bold">深色</div>
                    <div className="text-muted small">始终使用深色主题</div>
                  </div>
                </div>

                <div
                  className={`theme-option d-flex p-3 rounded ${themeMode === ThemeMode.SYSTEM ? 'border border-primary' : 'border'}`}
                  onClick={() => handleThemeChange(ThemeMode.SYSTEM)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="theme-icon me-3 fs-4">
                    <i className="bi bi-display"></i>
                  </div>
                  <div>
                    <div className="fw-bold">系统</div>
                    <div className="text-muted small">跟随系统主题设置</div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="card settings-card mt-4">
        <div className="card-body">
          <h2 className="mb-4">数据</h2>

          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1">清除本地数据</h5>
              <p className="text-muted mb-0">重置所有文章和日记数据</p>
            </div>
            <button
              className="btn btn-outline-danger"
              onClick={handleClearLocalData}
            >
              清除数据
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
