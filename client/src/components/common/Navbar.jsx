import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

 const navLinks = [
   { path: '/about', label: 'ہمارے بارے میں' },
    { path: '/impact', label: 'کمیونٹی' },
    { path: '/seekhna', label: 'سیکھنا' },
     
  { path: '/', label: 'ہوم' },
 
  
 
 
];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="navbar">
      <div className="container-xl nav-container">

        <Link className="navbar-brand" to="/">
          آسان<span>Digital</span>
        </Link>

        {/* Hamburger Menu */}
        <button
          className={`hamburger ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Mobile Dropdown */}
        <div className={`nav-menu ${isOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;