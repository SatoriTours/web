import React from 'react';
import { NavLink } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Navbar = ({ onLogout }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center w-100">
          <div className="d-flex align-items-center">
            <h1 className="navbar-brand mb-0 h5 text-primary fw-bold">网页收藏与日记</h1>
            <div className="ms-4 d-flex">
              <NavLink
                to="/articles"
                className={({ isActive }) =>
                  isActive
                    ? "navlink-active"
                    : "navlink"
                }
              >
                <i className="bi bi-bookmark me-1"></i>
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
                <i className="bi bi-journal-text me-1"></i>
                日记
              </NavLink>
            </div>
          </div>
          <div>
            <button
              onClick={onLogout}
              className="btn btn-link text-secondary text-decoration-none"
            >
              <i className="bi bi-box-arrow-right me-1"></i>
              退出登录
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
