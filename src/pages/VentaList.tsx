import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useVentas } from '../hooks/useVentas';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Table } from '../components/ui/Table';
import { Input } from '../components/ui/Input';
import { useToast } from '../components/ui/ToastContainer';
import { Venta } from '../types/venta';
import './VentaList.scss';

type SortField = 'id' | 'cliente' | 'total' | 'fecha';
type SortOrder = 'asc' | 'desc';

export const VentaList: React.FC = () => {
  const toast = useToast();
  const { ventas, loading, error, pagination, fetchVentas, anularVenta } = useVentas();
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVenta, setSelectedVenta] = useState<Venta | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  useEffect(() => {
    fetchVentas();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const [filters, setFilters] = useState({
    estado: '',
    fechaInicio: '',
    fechaFin: '',
  });

  // Calcular estadísticas
  const stats = useMemo(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const ventasHoy = ventas.filter(v => {
      const fecha = new Date(v.createdAt);
      fecha.setHours(0, 0, 0, 0);
      return fecha.getTime() === hoy.getTime() && v.estado !== 'anulada';
    });
    
    const ventasPendientes = ventas.filter(v => v.estado === 'pendiente');
    const ventasCompletadas = ventas.filter(v => v.estado === 'completada');
    
    return {
      totalHoy: ventasHoy.reduce((sum, v) => sum + v.total, 0),
      cantidadHoy: ventasHoy.length,
      pendientes: ventasPendientes.length,
      completadas: ventasCompletadas.length,
    };
  }, [ventas]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    fetchVentas({
      page: 1,
      ...filters,
      estado: filters.estado || undefined,
      fechaInicio: filters.fechaInicio || undefined,
      fechaFin: filters.fechaFin || undefined,
    });
  };

  const handleClearFilters = () => {
    setFilters({ estado: '', fechaInicio: '', fechaFin: '' });
    fetchVentas();
  };

  const handleAnular = async (id: number) => {
    if (window.confirm('¿Está seguro de anular esta venta?')) {
      const result = await anularVenta(id);
      if (result) {
        toast.success('Venta anulada exitosamente');
      } else {
        toast.error('Error al anular la venta');
      }
    }
  };

  const handleVerDetalle = (venta: Venta) => {
    setSelectedVenta(venta);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedVenta(null);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
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

  // Filtrar por búsqueda
  const filteredVentas = useMemo(() => {
    if (!searchQuery.trim()) return ventas;
    
    const query = searchQuery.toLowerCase();
    return ventas.filter(venta => 
      venta.cliente?.nombre.toLowerCase().includes(query) ||
      venta.cliente?.telefono.includes(query) ||
      venta.id.toString().includes(query)
    );
  }, [ventas, searchQuery]);

  const sortedVentas = useMemo(() => {
    const sorted = [...filteredVentas];
    sorted.sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (sortField) {
        case 'id':
          aVal = a.id;
          bVal = b.id;
          break;
        case 'cliente':
          aVal = a.cliente?.nombre || '';
          bVal = b.cliente?.nombre || '';
          break;
        case 'total':
          aVal = a.total;
          bVal = b.total;
          break;
        case 'fecha':
          aVal = new Date(a.createdAt).getTime();
          bVal = new Date(b.createdAt).getTime();
          break;
        default:
          return 0;
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });
    return sorted;
  }, [filteredVentas, sortField, sortOrder]);

  const columns = [
    {
      header: (
        <span onClick={() => handleSort('id')} style={{ cursor: 'pointer', userSelect: 'none' }}>
          ID {sortField === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
        </span>
      ),
      accessor: 'id' as keyof Venta,
    },
    {
      header: (
        <span onClick={() => handleSort('cliente')} style={{ cursor: 'pointer', userSelect: 'none' }}>
          Cliente {sortField === 'cliente' && (sortOrder === 'asc' ? '↑' : '↓')}
        </span>
      ),
      accessor: (venta: Venta) => venta.cliente?.nombre || 'N/A',
    },
    {
      header: (
        <span onClick={() => handleSort('total')} style={{ cursor: 'pointer', userSelect: 'none' }}>
          Total {sortField === 'total' && (sortOrder === 'asc' ? '↑' : '↓')}
        </span>
      ),
      accessor: (venta: Venta) => formatCurrency(venta.total),
    },
    {
      header: 'Estado',
      accessor: (venta: Venta) => {
        const estadoMap: Record<string, { label: string; class: string }> = {
          'pendiente': { label: 'Pendiente', class: 'warning' },
          'completada': { label: 'Completada', class: 'success' },
          'entregada': { label: 'Entregada', class: 'info' },
          'anulada': { label: 'Anulada', class: 'danger' },
        };
        const estado = estadoMap[venta.estado] || { label: venta.estado, class: 'default' };
        return <span className={`badge badge-${estado.class}`}>{estado.label}</span>;
      },
    },
    {
      header: 'Método de Pago',
      accessor: (venta: Venta) => venta.metodoPago?.nombre || 'N/A',
    },
    {
      header: (
        <span onClick={() => handleSort('fecha')} style={{ cursor: 'pointer', userSelect: 'none' }}>
          Fecha {sortField === 'fecha' && (sortOrder === 'asc' ? '↑' : '↓')}
        </span>
      ),
      accessor: (venta: Venta) => formatDate(venta.createdAt),
    },
    {
      header: 'Acciones',
      accessor: (venta: Venta) => (
        <div className="actions">
          <Button size="small" variant="secondary" onClick={() => handleVerDetalle(venta)}>
            Ver Detalle
          </Button>
          {venta.estado === 'pendiente' && (
            <Button size="small" variant="danger" onClick={() => handleAnular(venta.id)}>
              Anular
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="venta-list">
      <div className="page-header">
        <h1>Ventas</h1>
      </div>

      {/* Cards de Resumen */}
      <div className="stats-summary">
        <Card className="stat-card">
          <div className="stat-card__icon stat-card__icon--primary">💰</div>
          <div className="stat-card__content">
            <div className="stat-card__label">Ventas de Hoy</div>
            <div className="stat-card__value">${Math.round(stats.totalHoy).toLocaleString('es-ES')}</div>
            <div className="stat-card__sublabel">{stats.cantidadHoy} ventas</div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-card__icon stat-card__icon--warning">⏳</div>
          <div className="stat-card__content">
            <div className="stat-card__label">Pendientes</div>
            <div className="stat-card__value">{stats.pendientes}</div>
            <div className="stat-card__sublabel">por procesar</div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-card__icon stat-card__icon--success">✓</div>
          <div className="stat-card__content">
            <div className="stat-card__label">Completadas</div>
            <div className="stat-card__value">{stats.completadas}</div>
            <div className="stat-card__sublabel">finalizadas</div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-card__icon stat-card__icon--info">📊</div>
          <div className="stat-card__content">
            <div className="stat-card__label">Total Ventas</div>
            <div className="stat-card__value">{pagination?.total || 0}</div>
            <div className="stat-card__sublabel">registradas</div>
          </div>
        </Card>
      </div>

      <Card>
        {/* Búsqueda Rápida */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 Buscar por cliente, teléfono o # de venta..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <Button 
            variant="secondary" 
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? '✕ Ocultar Filtros' : '⚙ Filtros Avanzados'}
          </Button>
        </div>

        {/* Filtros Colapsables */}
        {showFilters && (
          <div className="filters">
          <div className="filter-group">
            <label htmlFor="estado">Estado</label>
            <select
              id="estado"
              name="estado"
              value={filters.estado}
              onChange={handleFilterChange}
              className="select-input"
            >
              <option value="">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="completada">Completada</option>
              <option value="entregada">Entregada</option>
              <option value="anulada">Anulada</option>
            </select>
          </div>

          <Input
            label="Fecha Inicio"
            name="fechaInicio"
            type="date"
            value={filters.fechaInicio}
            onChange={handleFilterChange}
          />

          <Input
            label="Fecha Fin"
            name="fechaFin"
            type="date"
            value={filters.fechaFin}
            onChange={handleFilterChange}
          />

          <div className="filter-actions">
            <Button onClick={handleApplyFilters}>Filtrar</Button>
            <Button variant="secondary" onClick={handleClearFilters}>
              Limpiar
            </Button>
          </div>
        </div>
        )}

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <>
            <Table columns={columns} data={sortedVentas} />

            {pagination.totalPages > 1 && (
              <div className="pagination">
                <Button
                  disabled={pagination.page === 1}
                  onClick={() => fetchVentas({ ...filters, page: pagination.page - 1 })}
                  variant="secondary"
                >
                  Anterior
                </Button>
                <span>
                  Página {pagination.page} de {pagination.totalPages}
                </span>
                <Button
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => fetchVentas({ ...filters, page: pagination.page + 1 })}
                  variant="secondary"
                >
                  Siguiente
                </Button>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Modal Detalle de Venta */}
      {showModal && selectedVenta && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalle de Venta #{selectedVenta.id}</h2>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h3>Información General</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Cliente:</span>
                    <span className="detail-value">{selectedVenta.cliente?.nombre || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Teléfono:</span>
                    <span className="detail-value">{selectedVenta.cliente?.telefono || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Método de Pago:</span>
                    <span className="detail-value">{selectedVenta.metodoPago?.nombre || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Estado:</span>
                    <span className={`badge badge-${
                      selectedVenta.estado === 'pendiente' ? 'warning' :
                      selectedVenta.estado === 'completada' ? 'success' :
                      selectedVenta.estado === 'entregada' ? 'info' : 'danger'
                    }`}>
                      {selectedVenta.estado.charAt(0).toUpperCase() + selectedVenta.estado.slice(1)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Fecha:</span>
                    <span className="detail-value">{formatDate(selectedVenta.createdAt)}</span>
                  </div>
                  {selectedVenta.direccionEntrega && (
                    <div className="detail-item detail-item--full">
                      <span className="detail-label">Dirección de Entrega:</span>
                      <span className="detail-value">{selectedVenta.direccionEntrega}</span>
                    </div>
                  )}
                  {selectedVenta.notas && (
                    <div className="detail-item detail-item--full">
                      <span className="detail-label">Notas:</span>
                      <span className="detail-value">{selectedVenta.notas}</span>
                    </div>
                  )}
                </div>
              </div>

              {selectedVenta.items && selectedVenta.items.length > 0 && (
                <div className="detail-section">
                  <h3>Productos</h3>
                  <table className="detail-table">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio Unit.</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedVenta.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.producto?.nombre || 'N/A'}</td>
                          <td>{item.cantidad}</td>
                          <td>{formatCurrency(item.precioUnitario)}</td>
                          <td>{formatCurrency(item.subtotal)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="detail-section">
                <div className="detail-total">
                  <span className="detail-total__label">Total:</span>
                  <span className="detail-total__value">{formatCurrency(selectedVenta.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAB Nueva Venta */}
      <Link to="/ventas/crear" className="fab" title="Nueva Venta">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </Link>
    </div>
  );
};
