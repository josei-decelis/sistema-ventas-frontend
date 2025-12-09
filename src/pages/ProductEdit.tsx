import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useToast } from '../components/ui/ToastContainer';
import './ProductCreate.scss';

export const ProductEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { getProduct, updateProduct, loading } = useProducts();

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precioBase: 0,
    activo: true,
  });

  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      if (id) {
        const product = await getProduct(parseInt(id));
        if (product) {
          setFormData({
            nombre: product.nombre,
            descripcion: product.descripcion || '',
            precioBase: product.precioBase,
            activo: product.activo,
          });
        }
        setLoadingData(false);
      }
    };
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'precioBase' ? (parseFloat(value) || 0) : value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      const result = await updateProduct(parseInt(id), formData);
      if (result) {
        toast.success('Producto actualizado exitosamente');
        navigate('/productos');
      } else {
        toast.error('Error al actualizar el producto');
      }
    }
  };

  if (loadingData) {
    return (
      <div className="product-create">
        <Card title="Cargando producto...">
          <p>Cargando información del producto...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="product-create">
      <Card title="Editar Producto">
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
            value={formData.descripcion}
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

          <div className="input-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="activo"
                checked={formData.activo}
                onChange={handleChange}
              />
              <span>Producto activo</span>
            </label>
          </div>

          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={() => navigate('/productos')}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
