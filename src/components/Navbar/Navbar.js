import React from 'react';
import {NavLink} from 'react-router-dom';

const Navbar = () => (
  <nav className="navbar navbar-expand-md navbar-dark bg-primary">
    <ul className="navbar-nav mr-auto">
      <li className="nav-item">
        <NavLink exact to="/" className="nav-link">Главная</NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/users" className="nav-link">План в часах</NavLink>
      </li>
    </ul>
  </nav>
);

export default Navbar;
