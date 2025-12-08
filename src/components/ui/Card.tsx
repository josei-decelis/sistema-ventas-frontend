import React from 'react';
import './Card.scss';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, title, className = '' }) => {
  return (
    <div className={`card ${className}`}>
      {title && <div className="card__header">{title}</div>}
      <div className="card__body">{children}</div>
    </div>
  );
};
