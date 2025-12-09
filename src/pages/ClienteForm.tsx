import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useClientes } from '../hooks/useClientes';
import { clienteApi } from '../api/clienteApi';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useToast } from '../components/ui/ToastContainer';
import { CreateClienteInput } from '../types/cliente';
import './ClienteForm.scss';

export const ClienteForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const { createCliente, updateCliente, loading } = useClientes();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<CreateClienteInput>({
    nombre: '',
    telefono: '',
    direccion: '',
    notas: '',
  });

  useEffect(() => {
    if (id) {
      clienteApi.getById(Number(id)).then((cliente) => {
        setFormData({
          nombre: cliente.nombre,
          telefono: cliente.telefono,
          direccion: cliente.direccion || '',
          notas: cliente.notas || '',
        });
      });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEdit && id) {
      const result = await updateCliente(Number(id), formData);
      if (result) {
        toast.success('Cliente actualizado exitosamente');
        navigate('/clientes');
      } else {
        toast.error('Error al actualizar el cliente');
      }
    } else {
      const result = await createCliente(formData);
      if (result) {
        toast.success('Cliente creado exitosamente');
        navigate('/clientes');
      } else {
        toast.error('Error al crear el cliente');
      }
    }
  };

  return (
    <div className="cliente-form">
      <div className="page-header">
        <h1>{isEdit ? 'Editar Cliente' : 'Nuevo Cliente'}</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <Input
            label="Nombre *"
            name="nombre"
            type="text"
            value={formData.nombre}
            onChange={handleChange}
            required
          />

          <Input
            label="Teléfono *"
            name="telefono"
            type="tel"
            value={formData.telefono}
            onChange={handleChange}
            required
          />

          <Input
            label="Dirección"
            name="direccion"
            type="text"
            value={formData.direccion}
            onChange={handleChange}
          />

          <div className="input-group">
            <label htmlFor="notas">Notas</label>
            <textarea
              id="notas"
              name="notas"
              value={formData.notas}
              onChange={handleChange}
              rows={4}
              className="input-field"
            />
          </div>

          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={() => navigate('/clientes')}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : isEdit ? 'Actualizar Cliente' : 'Crear Cliente'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
