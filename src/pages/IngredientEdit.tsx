import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useIngredients } from '../hooks/useIngredients';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { UpdateIngredientInput } from '../types/ingredient';
import './IngredientCreate.scss';

export const IngredientEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getIngredient, updateIngredient, loading } = useIngredients();

  const [formData, setFormData] = useState<UpdateIngredientInput>({
    nombre: '',
    costoUnitario: 0,
  });

  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const loadIngredient = async () => {
      if (!id) return;
      
      const ingredient = await getIngredient(Number(id));
      if (ingredient) {
        setFormData({
          nombre: ingredient.nombre,
          costoUnitario: ingredient.costoUnitario,
        });
      }
      setLoadingData(false);
    };

    loadIngredient();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['costoUnitario'].includes(name) ? (parseFloat(value) || 0) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    const result = await updateIngredient(Number(id), formData);
    if (result) {
      navigate('/ingredientes');
    }
  };

  if (loadingData) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="ingredient-create">
      <Card title="Editar Ingrediente">
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
            step="0.01"
            value={formData.costoUnitario}
            onChange={handleChange}
            required
          />

          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={() => navigate('/ingredientes')}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Actualizando...' : 'Actualizar Ingrediente'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
