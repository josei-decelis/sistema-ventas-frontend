import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useIngredients } from '../hooks/useIngredients';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Autocomplete } from '../components/ui/Autocomplete';
import { CreateProductInput } from '../types/product';
import './ProductCreate.scss';

export const ProductCreate: React.FC = () => {
  const navigate = useNavigate();
  const { createProduct, loading } = useProducts();
  const { ingredients } = useIngredients();

  const [formData, setFormData] = useState<CreateProductInput>({
    nombre: '',
    descripcion: '',
    precioBase: 0,
    ingredientes: [],
  });

  const [selectedIngredient, setSelectedIngredient] = useState({
    ingredienteId: 0,
    cantidad: 0,
    unidadMedida: 'gramos',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'precioBase' ? (parseFloat(value) || 0) : value,
    }));
  };

  const handleAddIngredient = () => {
    if (selectedIngredient.ingredienteId && selectedIngredient.cantidad > 0) {
      const ingrediente = ingredients.find((i: any) => i.id === selectedIngredient.ingredienteId);
      setFormData((prev) => ({
        ...prev,
        ingredientes: [...(prev.ingredientes || []), {
          ...selectedIngredient,
          unidadMedida: ingrediente?.unidadMedida || 'gramos',
        }],
      }));
      setSelectedIngredient({
        ingredienteId: 0,
        cantidad: 0,
        unidadMedida: 'gramos',
      });
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setFormData((prev: CreateProductInput) => ({
      ...prev,
      ingredientes: prev.ingredientes?.filter((_: any, i: number) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createProduct(formData);
    if (result) {
      navigate('/productos');
    }
  };

  return (
    <div className="product-create">
      <Card title="Crear Nuevo Producto">
        <form onSubmit={handleSubmit}>
          <Input
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />

          <Input
            label="Descripción"
            name="descripcion"
            value={formData.descripcion || ''}
            onChange={handleChange}
          />

          <Input
            label="Precio Base"
            name="precioBase"
            type="number"
            
            min="0"
            value={formData.precioBase}
            onChange={handleChange}
            required
          />

          <div className="ingredient-section">
            <h3>Ingredientes</h3>
            
            <div className="ingredient-form">
              <Autocomplete
                label="Ingrediente"
                placeholder="Buscar ingrediente..."
                options={ingredients.map((ing: any) => ({
                  value: ing.id,
                  label: ing.nombre,
                  secondary: ing.unidadMedida,
                }))}
                value={selectedIngredient.ingredienteId}
                onChange={(ingredienteId) =>
                  setSelectedIngredient((prev: any) => ({
                    ...prev,
                    ingredienteId,
                  }))
                }
              />

              <Input
                label="Cantidad"
                name="cantidad"
                type="number"
                
                min="0"
                value={selectedIngredient.cantidad}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSelectedIngredient((prev: any) => ({
                    ...prev,
                    cantidad: parseFloat(e.target.value),
                  }))
                }
              />

              <Button type="button" variant="secondary" onClick={handleAddIngredient}>
                Agregar
              </Button>
            </div>

            {formData.ingredientes && formData.ingredientes.length > 0 && (
              <div className="ingredients-list">
                <h4>Ingredientes agregados:</h4>
                {formData.ingredientes.map((ing: any, index: number) => {
                  const ingrediente = ingredients.find((i: any) => i.id === ing.ingredienteId);
                  return (
                    <div key={index} className="ingredient-item">
                      <span>
                        {ingrediente?.nombre}: {ing.cantidad} {ing.unidadMedida}
                      </span>
                      <Button
                        type="button"
                        variant="danger"
                        size="small"
                        onClick={() => handleRemoveIngredient(index)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={() => navigate('/productos')}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creando...' : 'Crear Producto'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
