import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useClientes } from '../hooks/useClientes';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Table } from '../components/ui/Table';
import { Input } from '../components/ui/Input';
import { Cliente } from '../types/cliente';
import './ClienteList.scss';

type SortField = 'id' | 'nombre' | 'direccion' | 'compras';
type SortOrder = 'asc' | 'desc';

export const ClienteList: React.FC = () => {
  const { clientes, loading, error, pagination, fetchClientes, deleteCliente } = useClientes();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  useEffect(() => {
    fetchClientes(1, 1000);
  }, []);

  const filteredClientes = React.useMemo(() => {
    if (!searchQuery.trim()) return clientes;
    
    const query = searchQuery.toLowerCase();
    return clientes.filter(cliente => 
      cliente.nombre.toLowerCase().includes(query) ||
      cliente.telefono.includes(query) ||
      (cliente.direccion && cliente.direccion.toLowerCase().includes(query))
    );
  }, [clientes, searchQuery]);

  const sortedClientes = useMemo(() => {
    const sorted = [...filteredClientes];
    sorted.sort((a, b) => {
      // Caso especial para ordenar por compras
      if (sortField === 'compras') {
        const aCompras = a._count?.ventas || 0;
        const bCompras = b._count?.ventas || 0;
        return sortOrder === 'asc' ? aCompras - bCompras : bCompras - aCompras;
      }

      let aVal = a[sortField];
      let bVal = b[sortField];

      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

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
  }, [filteredClientes, sortField, sortOrder]);

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este cliente?')) {
      await deleteCliente(id);
    }
  };

  // Identificar clientes VIP (top 10 por cantidad de ventas)
  const clientesConEstadisticas = useMemo(() => {
    return sortedClientes.map(cliente => ({
      ...cliente,
      cantidadVentas: cliente._count?.ventas || 0,
    })).sort((a, b) => b.cantidadVentas - a.cantidadVentas);
  }, [sortedClientes]);

  const topClientes = clientesConEstadisticas.slice(0, 10).map(c => c.id);

  const columns = [
    {
      header: (
        <span onClick={() => handleSort('id')} style={{ cursor: 'pointer', userSelect: 'none' }}>
          ID {sortField === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
        </span>
      ),
      accessor: 'id' as keyof Cliente,
    },
    {
      header: (
        <span onClick={() => handleSort('nombre')} style={{ cursor: 'pointer', userSelect: 'none' }}>
          Nombre {sortField === 'nombre' && (sortOrder === 'asc' ? '↑' : '↓')}
        </span>
      ),
      accessor: (cliente: Cliente) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>{cliente.nombre}</span>
          {topClientes.includes(cliente.id) && (
            <span className="badge badge-vip">⭐ VIP</span>
          )}
        </div>
      ),
    },
    { header: 'Teléfono', accessor: 'telefono' as keyof Cliente },
    {
      header: (
        <span onClick={() => handleSort('compras')} style={{ cursor: 'pointer', userSelect: 'none' }}>
          Compras {sortField === 'compras' && (sortOrder === 'asc' ? '↑' : '↓')}
        </span>
      ),
      accessor: (cliente: Cliente) => {
        const count = cliente._count?.ventas || 0;
        return (
          <span className="ventas-count">
            {count} {count === 1 ? 'venta' : 'ventas'}
          </span>
        );
      },
    },
    {
      header: 'Acciones',
      accessor: (cliente: Cliente) => (
        <div className="actions-compact">
          <Link to={`/ventas/crear?clienteId=${cliente.id}`} className="action-link">
            <button className="action-btn action-btn--primary" data-tooltip="Nueva venta">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Venta
            </button>
          </Link>
          <Link to={`/clientes/${cliente.id}`} className="action-link">
            <button className="action-btn action-btn--info" data-tooltip="Ver historial">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
          </Link>
          <Link to={`/clientes/editar/${cliente.id}`} className="action-link">
            <button className="action-btn action-btn--secondary" data-tooltip="Editar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
          </Link>
          <button 
            className="action-btn action-btn--danger" 
            onClick={() => handleDelete(cliente.id)}
            data-tooltip="Eliminar"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="cliente-list">
      <div className="page-header">
        <h1>Clientes</h1>
      </div>

      <Card>
        <div className="search-bar-large">
          <input
            type="text"
            placeholder="🔍 Buscar cliente por nombre, teléfono o dirección..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input-large"
          />
          {searchQuery && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => setSearchQuery('')}
            >
              ✕ Limpiar
            </Button>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <>
            <Table columns={columns} data={sortedClientes} />

            {!searchQuery && pagination.totalPages > 1 && (
              <div className="pagination">
                <Button
                  disabled={pagination.page === 1}
                  onClick={() => fetchClientes(pagination.page - 1, 1000)}
                  variant="secondary"
                >
                  Anterior
                </Button>
                <span>
                  Página {pagination.page} de {pagination.totalPages}
                </span>
                <Button
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => fetchClientes(pagination.page + 1, 1000)}
                  variant="secondary"
                >
                  Siguiente
                </Button>
              </div>
            )}
          </>
        )}
      </Card>

      {/* FAB Nuevo Cliente */}
      <Link to="/clientes/crear" className="fab" title="Nuevo Cliente">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
          <line x1="19" y1="8" x2="19" y2="14"></line>
          <line x1="16" y1="11" x2="22" y2="11"></line>
        </svg>
      </Link>
    </div>
  );
};
