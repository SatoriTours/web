import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = ({ onLogout }) => {
  return (
    <nav style={{ backgroundColor: 'white', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', paddingLeft: '1rem', paddingRight: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', height: '4rem' }}>
          <div style={{ display: 'flex' }}>
            <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary-strong)' }}>网页收藏与日记</h1>
            </div>
            <div style={{ marginLeft: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <NavLink
                to="/articles"
                className={({ isActive }) =>
                  isActive
                    ? "navlink-active"
                    : "navlink"
                }
              >
                网页收藏
              </NavLink>
              <NavLink
                to="/diary"
                className={({ isActive }) =>
                  isActive
                    ? "navlink-active"
                    : "navlink"
                }
              >
                日记
              </NavLink>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button
              onClick={onLogout}
              style={{ color: 'var(--neutral-moderate)', padding: '0.5rem 0.75rem' }}
              className="logout-button"
            >
              退出登录
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
