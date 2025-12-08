import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useVentas } from '../hooks/useVentas';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Table } from '../components/ui/Table';
import { Input } from '../components/ui/Input';
import { Venta } from '../types/venta';
import './VentaList.scss';

type SortField = 'id' | 'cliente' | 'total' | 'fecha';
type SortOrder = 'asc' | 'desc';

export const VentaList: React.FC = () => {
  const { ventas, loading, error, pagination, fetchVentas, anularVenta } = useVentas();
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

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
  }, []);
  const [filters, setFilters] = useState({
    estado: '',
    fechaInicio: '',
    fechaFin: '',
  });

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
      await anularVenta(id);
    }
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

  const sortedVentas = useMemo(() => {
    const sorted = [...ventas];
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
  }, [ventas, sortField, sortOrder]);

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
      accessor: (venta: Venta) => (
        <span className={`status status-${venta.estado}`}>
          {venta.estado.charAt(0).toUpperCase() + venta.estado.slice(1)}
        </span>
      ),
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
          <Link to={`/ventas/${venta.id}`}>
            <Button size="small" variant="secondary">
              Ver Detalle
            </Button>
          </Link>
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
        <Link to="/ventas/crear">
          <Button>+ Nueva Venta</Button>
        </Link>
      </div>

      <Card>
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
    </div>
  );
};
