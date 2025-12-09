import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './BottomNavigation.scss';

export const BottomNavigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: '📊', label: 'Inicio' },
    { path: '/ventas/crear', icon: '🛒', label: 'Nueva Venta' },
    { path: '/clientes', icon: '👥', label: 'Clientes' },
    { path: '/productos', icon: '🍕', label: 'Productos' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`bottom-nav__item ${isActive(item.path) ? 'bottom-nav__item--active' : ''}`}
        >
          <span className="bottom-nav__icon">{item.icon}</span>
          <span className="bottom-nav__label">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};
