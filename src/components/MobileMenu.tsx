import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './MobileMenu.scss';

interface MobileMenuProps {
  brandName?: string;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ brandName = '🍕 Sistema de Ventas' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const menuItems = [
    { path: '/productos', icon: '🍕', label: 'Productos' },
    { path: '/ingredientes', icon: '🧀', label: 'Ingredientes' },
    { path: '/ventas', icon: '📋', label: 'Historial Ventas' },
    { path: '/metodos-pago', icon: '💳', label: 'Métodos de Pago' },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <>
      <nav className="mobile-header">
        <Link to="/" className="mobile-header__brand" onClick={closeMenu}>
          {brandName}
        </Link>
        <button 
          className={`mobile-header__hamburger ${isOpen ? 'mobile-header__hamburger--open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Overlay */}
      {isOpen && (
        <div className="mobile-menu__overlay" onClick={closeMenu}></div>
      )}

      {/* Slide Menu */}
      <div className={`mobile-menu ${isOpen ? 'mobile-menu--open' : ''}`}>
        <div className="mobile-menu__header">
          <h2>Menú</h2>
          <button className="mobile-menu__close" onClick={closeMenu}>
            ✕
          </button>
        </div>
        
        <nav className="mobile-menu__nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`mobile-menu__item ${isActive(item.path) ? 'mobile-menu__item--active' : ''}`}
              onClick={closeMenu}
            >
              <span className="mobile-menu__icon">{item.icon}</span>
              <span className="mobile-menu__label">{item.label}</span>
              <span className="mobile-menu__arrow">›</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};
