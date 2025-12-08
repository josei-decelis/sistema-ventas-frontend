import React, { useState, useEffect } from 'react';
import { useMetodosPago } from '../hooks/useMetodosPago';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Table } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { MetodoPago, CreateMetodoPagoInput } from '../types/metodoPago';
import './MetodoPagoList.scss';

export const MetodoPagoList: React.FC = () => {
  const { metodosPago, loading, error, fetchMetodosPago, createMetodoPago, updateMetodoPago, deleteMetodoPago } = useMetodosPago();

  useEffect(() => {
    fetchMetodosPago();
  }, []);
  const [showModal, setShowModal] = useState(false);
  const [editingMetodo, setEditingMetodo] = useState<MetodoPago | null>(null);
  const [formData, setFormData] = useState<CreateMetodoPagoInput>({
    nombre: '',
    activo: true,
  });

  const handleOpenModal = (metodo?: MetodoPago) => {
    if (metodo) {
      setEditingMetodo(metodo);
      setFormData({
        nombre: metodo.nombre,
        activo: metodo.activo,
      });
    } else {
      setEditingMetodo(null);
      setFormData({ nombre: '', activo: true });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMetodo(null);
    setFormData({ nombre: '', activo: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingMetodo) {
      await updateMetodoPago(editingMetodo.id, formData);
    } else {
      await createMetodoPago(formData);
    }

    handleCloseModal();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este método de pago?')) {
      await deleteMetodoPago(id);
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id' as keyof MetodoPago },
    { header: 'Nombre', accessor: 'nombre' as keyof MetodoPago },
    {
      header: 'Estado',
      accessor: (metodo: MetodoPago) => (
        <span className={`status ${metodo.activo ? 'active' : 'inactive'}`}>
          {metodo.activo ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      header: 'Acciones',
      accessor: (metodo: MetodoPago) => (
        <div className="actions">
          <Button size="small" variant="secondary" onClick={() => handleOpenModal(metodo)}>
            Editar
          </Button>
          <Button size="small" variant="danger" onClick={() => handleDelete(metodo.id)}>
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="metodo-pago-list">
      <div className="page-header">
        <h1>Métodos de Pago</h1>
        <Button onClick={() => handleOpenModal()}>+ Nuevo Método</Button>
      </div>

      <Card>
        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <Table columns={columns} data={metodosPago} />
        )}
      </Card>

      <Modal isOpen={showModal} onClose={handleCloseModal} title={editingMetodo ? 'Editar Método de Pago' : 'Nuevo Método de Pago'}>
        <form onSubmit={handleSubmit}>
          <Input
            label="Nombre *"
            name="nombre"
            type="text"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
          />

          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={formData.activo}
                onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
              />
              <span>Activo</span>
            </label>
          </div>

          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : editingMetodo ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
