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
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');

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
      accessor: (product: Product) => `$${product.precioBase.toLocaleString('es-CL')}`,
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
      <div className="product-list__header">
        <h1>Productos</h1>
        <div className="header-actions">
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Vista Tarjetas"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </button>
            <button 
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Vista Tabla"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
          <Link to="/productos/crear">
            <Button>+ Nuevo Producto</Button>
          </Link>
        </div>
      </div>

      {error && <div className="alert alert--danger">{error}</div>}

      {loading ? (
        <div className="loading">Cargando productos...</div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="products-grid">
              {sortedProducts.length === 0 ? (
                <Card><p className="empty-message">No hay productos registrados</p></Card>
              ) : (
                sortedProducts.map((product) => (
                  <Card key={product.id} className="product-card">
                    <div className="product-card__header">
                      <div className="product-icon">🍕</div>
                      <span className={`badge badge--${product.activo ? 'success' : 'danger'}`}>
                        {product.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    <h3 className="product-card__name">{product.nombre}</h3>
                    <div className="product-card__price">${product.precioBase.toLocaleString('es-CL')}</div>
                    {product.ingredientes && product.ingredientes.length > 0 && (
                      <div className="product-card__ingredients">
                        <span className="ingredients-badge">
                          🧪 {product.ingredientes.length} ingrediente{product.ingredientes.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                    <div className="product-card__actions">
                      <Link to={`/productos/${product.id}/editar`}>
                        <Button size="small" variant="secondary">✏️ Editar</Button>
                      </Link>
                      <Button size="small" variant="danger" onClick={() => handleDelete(product.id)}>
                        🗑️ Eliminar
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          ) : (
            <Card>
              <Table
                data={sortedProducts}
                columns={columns}
                loading={loading}
                emptyMessage="No hay productos registrados"
              />
            </Card>
          )}
        </>
      )}
    </div>
  );
};
