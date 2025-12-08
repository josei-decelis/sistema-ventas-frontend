import React from 'react';
import { Link } from 'react-router-dom';
import { useIngredients } from '../hooks/useIngredients';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Table } from '../components/ui/Table';
import { Ingredient } from '../types/ingredient';
import './IngredientList.scss';

export const IngredientList: React.FC = () => {
  const { ingredients, loading, error, deleteIngredient } = useIngredients();

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este ingrediente?')) {
      await deleteIngredient(id);
    }
  };

  const columns = [
    {
      header: 'ID',
      accessor: 'id' as keyof Ingredient,
    },
    {
      header: 'Nombre',
      accessor: 'nombre' as keyof Ingredient,
    },
    {
      header: 'Costo Unitario',
      accessor: (ingredient: Ingredient) => `$${ingredient.costoUnitario.toFixed(2)}`,
    },
    {
      header: 'Stock Actual',
      accessor: (ingredient: Ingredient) => (
        <span className={ingredient.stockActual < 100 ? 'stock-low' : ''}>
          {ingredient.stockActual} {ingredient.unidadMedida}
        </span>
      ),
    },
    {
      header: 'Acciones',
      accessor: (ingredient: Ingredient) => (
        <div className="actions">
          <Link to={`/ingredientes/${ingredient.id}/editar`}>
            <Button size="small">Editar</Button>
          </Link>
          <Button size="small" variant="danger" onClick={() => handleDelete(ingredient.id)}>
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="ingredient-list">
      <Card>
        <div className="ingredient-list__header">
          <h1>Ingredientes</h1>
          <Link to="/ingredientes/crear">
            <Button>+ Nuevo Ingrediente</Button>
          </Link>
        </div>

        {error && <div className="alert alert--danger">{error}</div>}

        <Table
          data={ingredients}
          columns={columns}
          loading={loading}
          emptyMessage="No hay ingredientes registrados"
        />
      </Card>
    </div>
  );
};
