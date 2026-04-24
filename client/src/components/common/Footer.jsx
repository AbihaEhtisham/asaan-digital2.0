import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer mt-5">
      <div className="container-xl">
        <div className="row align-items-center gy-3 mb-3">
          <div className="col-md-4 text-md-start">
            <strong className="fs-5">آسان ڈیجیٹل</strong><br />
            <span className="small opacity-75">Apni Madad Aap — Empowering Pakistan Digitally</span>
          </div>
          <div className="col-md-4 text-center">
            <Link to="/">Home</Link> |
            <Link to="/poochna">Poochna</Link> |
            <Link to="/seekhna">Seekhna</Link> |
            <Link to="/impact">Community</Link> |
            <Link to="/about">About</Link>
          </div>
          <div className="col-md-4 text-md-end">🌐 Language: English / اردو</div>
        </div>
        <hr />
        <div className="text-center opacity-75 small">
          © 2026 Asaan Digital 2.0. All rights reserved. | Empowering Pakistan Digitally
        </div>
      </div>
    </footer>
  );
};

export default Footer;