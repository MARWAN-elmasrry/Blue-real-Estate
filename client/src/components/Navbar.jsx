import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './navbar.css'

const Navbar = () => {
  const location = useLocation();

  return (
    <header>
      <span className="brand-name">Blue RealEstate</span>
      <div className="links">
        <Link to="/houses" className={location.pathname.startsWith('/houses') ? 'active' : ''}>Houses</Link>
        <Link to="/add" className={location.pathname === '/add' ? 'active' : ''}>Add Data</Link>
      </div>
    </header>
  );
};

export default Navbar;