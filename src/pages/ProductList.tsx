import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Table } from '../components/ui/Table';
import { Product } from '../types/product';
import './ProductList.scss';

type SortField = 'id' | 'nombre' | 'precioBase';
type SortOrder = 'asc' | 'desc';

export const ProductList: React.FC = () => {
  const { products, loading, error, deleteProduct } = useProducts();
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

  const sortedProducts = useMemo(() => {
    const sorted = [...products].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });
    return sorted;
  }, [products, sortField, sortOrder]);

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      await deleteProduct(id);
    }
  };

  const columns = [
    {
      header: (
        <span onClick={() => handleSort('id')} style={{ cursor: 'pointer', userSelect: 'none' }}>
          ID {sortField === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
        </span>
      ),
      accessor: 'id' as keyof Product,
    },
    {
      header: (
        <span onClick={() => handleSort('nombre')} style={{ cursor: 'pointer', userSelect: 'none' }}>
          Nombre {sortField === 'nombre' && (sortOrder === 'asc' ? '↑' : '↓')}
        </span>
      ),
      accessor: 'nombre' as keyof Product,
    },
    {
      header: (
        <span onClick={() => handleSort('precioBase')} style={{ cursor: 'pointer', userSelect: 'none' }}>
          Precio {sortField === 'precioBase' && (sortOrder === 'asc' ? '↑' : '↓')}
        </span>
      ),
      accessor: (product: Product) => `$${product.precioBase.toFixed(2)}`,
    },
    {
      header: 'Estado',
      accessor: (product: Product) => (
        <span className={`badge badge--${product.activo ? 'success' : 'danger'}`}>
          {product.activo ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      header: 'Ingredientes',
      accessor: (product: Product) => 
        product.ingredientes && product.ingredientes.length > 0
          ? product.ingredientes
              .filter(pi => pi.ingrediente)
              .map(pi => pi.ingrediente!.nombre)
              .join(', ')
          : 'Sin ingredientes',
    },
    {
      header: 'Acciones',
      accessor: (product: Product) => (
        <div className="actions">
          <Link to={`/productos/${product.id}/editar`}>
            <Button size="small" variant="secondary">Editar</Button>
          </Link>
          <Button size="small" variant="danger" onClick={() => handleDelete(product.id)}>
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="product-list">
      <Card>
        <div className="product-list__header">
          <h1>Productos</h1>
          <Link to="/productos/crear">
            <Button>+ Nuevo Producto</Button>
          </Link>
        </div>

        {error && <div className="alert alert--danger">{error}</div>}

        <Table
          data={sortedProducts}
          columns={columns}
          loading={loading}
          emptyMessage="No hay productos registrados"
        />
      </Card>
    </div>
  );
};
