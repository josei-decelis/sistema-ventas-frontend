import React, { useEffect } from 'react';
import './Toast.scss';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '';
    }
  };

  return (
    <div className={`toast toast--${type}`} onClick={onClose}>
      <div className="toast__icon">{getIcon()}</div>
      <div className="toast__message">{message}</div>
      <button className="toast__close" onClick={onClose} aria-label="Cerrar">
        ×
      </button>
    </div>
  );
};
