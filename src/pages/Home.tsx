import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../api/dashboardApi';
import { Card } from '../components/ui/Card';
import { DashboardStats } from '../types/common';
import './Home.scss';

export const Home: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardApi.getEstadisticas();
        setStats(data);
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="home">
      <h1>Dashboard - Sistema de Ventas</h1>

      <div className="stats-grid">
        <Card title="Ventas del Mes">
          <div className="stat-value">${Math.round(stats?.resumen.ventasMes || 0).toLocaleString('es-ES')}</div>
          <div className="stat-label">en {stats?.resumen.cantidadVentasMes} ventas</div>
        </Card>

        <Card title="Ventas de Hoy">
          <div className="stat-value">${Math.round(stats?.resumen.ventasHoy || 0).toLocaleString('es-ES')}</div>
          <div className="stat-label">en {stats?.resumen.cantidadVentasHoy} ventas</div>
        </Card>

        <Card title="Total Clientes">
          <div className="stat-value">{stats?.resumen.totalClientes}</div>
          <div className="stat-label">clientes registrados</div>
        </Card>
      </div>

      <div className="dashboard-content">
        <Card title="Productos Más Vendidos">
          {stats?.productosMasVendidos.slice(0, 5).map((item, index) => (
            <div key={index} className="list-item">
              <span className="list-item__name">{item.producto?.nombre}</span>
              <span className="list-item__value">
                {item.cantidadVendida} vendidos - ${Math.round(item.totalGenerado || 0).toLocaleString('es-ES')}
              </span>
            </div>
          ))}
        </Card>

        <Card title="Clientes Frecuentes">
          {stats?.clientesMasFrecuentes.slice(0, 5).map((item, index) => (
            <div key={index} className="list-item">
              <span className="list-item__name">{item.cliente?.nombre}</span>
              <span className="list-item__value">
                {item.cantidadCompras} compras - ${Math.round(item.totalGastado || 0).toLocaleString('es-ES')}
              </span>
            </div>
          ))}
        </Card>
      </div>

      <div className="quick-actions">
        <h2>Acciones Rápidas</h2>
        <div className="actions-grid">
          <Link to="/productos" className="action-card">
            <h3>Productos</h3>
            <p>Gestionar productos y pizzas</p>
          </Link>
          <Link to="/ingredientes" className="action-card">
            <h3>Ingredientes</h3>
            <p>Administrar ingredientes</p>
          </Link>
          <Link to="/ventas" className="action-card">
            <h3>Ventas</h3>
            <p>Ver y crear ventas</p>
          </Link>
          <Link to="/ventas/crear" className="action-card action-card--primary">
            <h3>+ Nueva Venta</h3>
            <p>Registrar una nueva venta</p>
          </Link>
        </div>
      </div>
    </div>
  );
};
