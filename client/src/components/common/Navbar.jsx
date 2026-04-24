import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState('english');
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/poochna', label: 'Poochna' },
    { path: '/seekhna', label: 'Seekhna' },
    { path: '/impact', label: 'Community' },
    { path: '/about', label: 'About' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top">
      <div className="container-xl">
        <Link className="navbar-brand" to="/">
          آسان<span>Digital 2.0</span>
        </Link>
        
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navMenu">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1">
            {navLinks.map((link) => (
              <li className="nav-item" key={link.path}>
                <Link 
                  className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="nav-item ms-lg-2">
              <select 
                className="lang-select" 
                aria-label="Language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="english">🌐 English</option>
                <option value="urdu">🇵🇰 اردو</option>
              </select>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;