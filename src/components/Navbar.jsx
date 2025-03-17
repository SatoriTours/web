import React from 'react';
import { NavLink } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './NavbarStyles.css';

const Navbar = ({ onLogout }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container-fluid">
        <NavLink to="/" className="navbar-brand d-flex align-items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-journal-bookmark text-primary me-2" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M6 8V1h1v6.117L8.743 6.07a.5.5 0 0 1 .514 0L11 7.117V1h1v7a.5.5 0 0 1-.757.429L9 7.083 6.757 8.43A.5.5 0 0 1 6 8z"/>
            <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-12a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3z"/>
          </svg>
          <span className="fw-bold">Daily Satori</span>
        </NavLink>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto">
            <li className="nav-item mx-1">
              <NavLink
                to="/articles"
                className={({ isActive }) =>
                  isActive
                    ? "nav-link active fw-medium"
                    : "nav-link"
                }
              >
                <i className="bi bi-bookmark me-1"></i>
                收藏
              </NavLink>
            </li>
            <li className="nav-item mx-1">
              <NavLink
                to="/diary"
                className={({ isActive }) =>
                  isActive
                    ? "nav-link active fw-medium"
                    : "nav-link"
                }
              >
                <i className="bi bi-journal-text me-1"></i>
                日记
              </NavLink>
            </li>
          </ul>

          <div className="d-flex">
            <button
              onClick={onLogout}
              className="btn btn-sm btn-outline-secondary"
            >
              <i className="bi bi-box-arrow-right me-1"></i>
              退出
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
