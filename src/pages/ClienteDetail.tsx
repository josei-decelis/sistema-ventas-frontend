import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import './ClienteDetail.scss';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3005/api';

interface Venta {
  id: number;
  total: number;
  estado: string;
  fecha: string;
  createdAt: string;
  metodoPago: {
    id: number;
    nombre: string;
  };
  items: Array<{
    id: number;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
    producto: {
      id: number;
      nombre: string;
      precioBase: number;
    };
  }>;
}

interface ClienteHistorial {
  cliente: {
    id: number;
    nombre: string;
    telefono: string;
    direccion: string | null;
    notas: string | null;
  };
  ventas: Venta[];
  estadisticas: {
    totalGastado: number;
    cantidadCompras: number;
    ticketPromedio: number;
  };
}

export const ClienteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [historial, setHistorial] = useState<ClienteHistorial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistorial = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/clientes/${id}/ventas`);
      const result = await response.json();
      if (result.status === 'success') {
        setHistorial(result.data);
      } else {
        setError(result.message || 'Error al cargar historial');
      }
    } catch (err) {
      setError('Error al cargar historial del cliente');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchHistorial();
  }, [fetchHistorial]);

  const formatCurrency = (value: number) => {
    return `$${Math.round(value).toLocaleString('es-ES')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!historial) return <div className="error-message">Cliente no encontrado</div>;

  return (
    <div className="cliente-detail">
      <div className="page-header">
        <h1>Historial de Cliente</h1>
        <div className="header-actions">
          <Button variant="secondary" onClick={() => navigate('/clientes')}>
            ← Volver
          </Button>
          <Link to={`/ventas/crear?clienteId=${id}`}>
            <Button>+ Nueva Venta</Button>
          </Link>
        </div>
      </div>

      <div className="cliente-info">
        <Card>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Nombre:</span>
              <span className="info-value">{historial.cliente.nombre}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Teléfono:</span>
              <span className="info-value">{historial.cliente.telefono}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Dirección:</span>
              <span className="info-value">{historial.cliente.direccion || 'N/A'}</span>
            </div>
            {historial.cliente.notas && (
              <div className="info-item full-width">
                <span className="info-label">Notas:</span>
                <span className="info-value">{historial.cliente.notas}</span>
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="estadisticas-grid">
        <Card title="Total Gastado">
          <div className="stat-value">{formatCurrency(historial.estadisticas.totalGastado)}</div>
          <div className="stat-label">en compras completadas</div>
        </Card>

        <Card title="Cantidad de Compras">
          <div className="stat-value">{historial.estadisticas.cantidadCompras}</div>
          <div className="stat-label">ventas registradas</div>
        </Card>

        <Card title="Ticket Promedio">
          <div className="stat-value">{formatCurrency(historial.estadisticas.ticketPromedio)}</div>
          <div className="stat-label">por compra</div>
        </Card>
      </div>

      <Card title="Historial de Ventas">
        {historial.ventas.length === 0 ? (
          <p className="empty-message">Este cliente no tiene ventas registradas</p>
        ) : (
          <div className="ventas-list">
            {historial.ventas.map((venta) => (
              <div key={venta.id} className="venta-card">
                <div className="venta-header">
                  <div className="venta-info">
                    <span className="venta-id">Venta #{venta.id}</span>
                    <span className={`venta-estado estado-${venta.estado}`}>
                      {venta.estado.charAt(0).toUpperCase() + venta.estado.slice(1)}
                    </span>
                  </div>
                  <div className="venta-meta">
                    <span className="venta-fecha">{formatDate(venta.createdAt)}</span>
                    <span className="venta-metodo">{venta.metodoPago.nombre}</span>
                  </div>
                </div>

                <div className="venta-items">
                  <table>
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio Unit.</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {venta.items.map((item) => (
                        <tr key={item.id}>
                          <td>{item.producto.nombre}</td>
                          <td>{item.cantidad}</td>
                          <td>{formatCurrency(item.precioUnitario)}</td>
                          <td>{formatCurrency(item.subtotal)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="venta-total">
                  <strong>Total:</strong>
                  <strong className="total-amount">{formatCurrency(venta.total)}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
