import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIngredients } from '../hooks/useIngredients';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { CreateIngredientInput } from '../types/ingredient';
import './IngredientCreate.scss';

export const IngredientCreate: React.FC = () => {
  const navigate = useNavigate();
  const { createIngredient, loading } = useIngredients();

  const [formData, setFormData] = useState<CreateIngredientInput>({
    nombre: '',
    costoUnitario: 0,
    stockActual: 0,
    unidadMedida: 'gramos',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['costoUnitario', 'stockActual'].includes(name) ? (parseFloat(value) || 0) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createIngredient(formData);
    if (result) {
      navigate('/ingredientes');
    }
  };

  return (
    <div className="ingredient-create">
      <Card title="Crear Nuevo Ingrediente">
        <form onSubmit={handleSubmit}>
          <Input
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />

          <Input
            label="Costo Unitario"
            name="costoUnitario"
            type="number"
            min="0"
            value={formData.costoUnitario}
            onChange={handleChange}
            required
          />

          <Input
            label="Stock Actual"
            name="stockActual"
            type="number"
            min="0"
            value={formData.stockActual || 0}
            onChange={handleChange}
          />

          <div className="input-group">
            <label htmlFor="unidadMedida" className="input-group__label">
              Unidad de Medida
            </label>
            <select
              name="unidadMedida"
              id="unidadMedida"
              value={formData.unidadMedida}
              onChange={handleChange}
              className="input-group__input"
            >
              <option value="gramos">Gramos</option>
              <option value="kilogramos">Kilogramos</option>
              <option value="litros">Litros</option>
              <option value="mililitros">Mililitros</option>
              <option value="unidades">Unidades</option>
            </select>
          </div>

          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={() => navigate('/ingredientes')}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creando...' : 'Crear Ingrediente'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
