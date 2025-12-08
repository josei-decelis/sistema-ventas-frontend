import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useClientes } from '../hooks/useClientes';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Table } from '../components/ui/Table';
import { Input } from '../components/ui/Input';
import { Cliente } from '../types/cliente';
import './ClienteList.scss';

type SortField = 'id' | 'nombre' | 'direccion';
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
      accessor: 'nombre' as keyof Cliente,
    },
    { header: 'Teléfono', accessor: 'telefono' as keyof Cliente },
    {
      header: (
        <span onClick={() => handleSort('direccion')} style={{ cursor: 'pointer', userSelect: 'none' }}>
          Dirección {sortField === 'direccion' && (sortOrder === 'asc' ? '↑' : '↓')}
        </span>
      ),
      accessor: 'direccion' as keyof Cliente,
    },
    {
      header: 'Acciones',
      accessor: (cliente: Cliente) => (
        <div className="actions">
          <Link to={`/clientes/${cliente.id}`}>
            <Button size="small" variant="primary">
              Ver Historial
            </Button>
          </Link>
          <Link to={`/ventas/crear?clienteId=${cliente.id}`}>
            <Button size="small" variant="secondary">
              + Venta
            </Button>
          </Link>
          <Link to={`/clientes/editar/${cliente.id}`}>
            <Button size="small" variant="secondary">
              Editar
            </Button>
          </Link>
          <Button size="small" variant="danger" onClick={() => handleDelete(cliente.id)}>
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="cliente-list">
      <div className="page-header">
        <h1>Clientes</h1>
        <Link to="/clientes/crear">
          <Button>+ Nuevo Cliente</Button>
        </Link>
      </div>

      <Card>
        <div className="search-form">
          <Input
            label=""
            name="search"
            placeholder="Buscar por nombre, teléfono o dirección..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => setSearchQuery('')}
            >
              Limpiar
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
    </div>
  );
};
