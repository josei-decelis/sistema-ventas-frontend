import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useVentas } from '../hooks/useVentas';
import { useClientes } from '../hooks/useClientes';
import { useMetodosPago } from '../hooks/useMetodosPago';
import { useProducts } from '../hooks/useProducts';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Autocomplete } from '../components/ui/Autocomplete';
import { CreateVentaInput } from '../types/venta';
import './VentaCreate.scss';

export const VentaCreate: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { createVenta, loading } = useVentas();
  const { clientes, fetchClientes } = useClientes();
  const { metodosPago, fetchMetodosPago } = useMetodosPago();
  const { products, fetchProducts } = useProducts();

  const [formData, setFormData] = useState<CreateVentaInput>({
    clienteId: 0,
    metodoPagoId: 0,
    direccionEntrega: '',
    notas: '',
    items: [],
  });

  useEffect(() => {
    fetchClientes(1, 1000);
    fetchMetodosPago();
    fetchProducts({ page: 1, limit: 1000 });
  }, []);

  useEffect(() => {
    const clienteId = searchParams.get('clienteId');
    if (clienteId && clientes.length > 0) {
      const cliente = clientes.find(c => c.id === parseInt(clienteId));
      if (cliente) {
        setFormData(prev => ({
          ...prev,
          clienteId: cliente.id,
          direccionEntrega: cliente.direccion || '',
        }));
      }
    }
  }, [searchParams, clientes]);

  useEffect(() => {
    if (metodosPago.length > 0 && formData.metodoPagoId === 0) {
      const transferencia = metodosPago.find(m => m.nombre.toLowerCase().includes('transferencia'));
      if (transferencia) {
        setFormData(prev => ({ ...prev, metodoPagoId: transferencia.id }));
      }
    }
  }, [metodosPago]);

  const [selectedItem, setSelectedItem] = useState({
    productoId: 0,
    cantidad: 1,
    precioUnitario: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'clienteId') {
      const clienteId = parseInt(value) || 0;
      const cliente = clientes.find(c => c.id === clienteId);
      setFormData((prev) => ({
        ...prev,
        clienteId,
        direccionEntrega: cliente?.direccion || '',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: ['metodoPagoId'].includes(name) ? (parseInt(value) || 0) : value,
      }));
    }
  };

  const handleProductChange = (productoId: number) => {
    const product = products.find((p) => p.id === productoId);
    if (product) {
      setSelectedItem({
        productoId,
        cantidad: 1,
        precioUnitario: product.precioBase,
      });
    }
  };

  const handleAddItem = () => {
    if (selectedItem.productoId && selectedItem.cantidad > 0) {
      setFormData((prev) => ({
        ...prev,
        items: [...prev.items, { ...selectedItem }],
      }));
      setSelectedItem({ productoId: 0, cantidad: 1, precioUnitario: 0 });
    }
  };

  const handleRemoveItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_: any, i: number) => i !== index),
    }));
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + item.cantidad * item.precioUnitario, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clienteId || formData.clienteId === 0) {
      alert('Debe seleccionar un cliente');
      return;
    }
    
    if (!formData.metodoPagoId || formData.metodoPagoId === 0) {
      alert('Debe seleccionar un método de pago');
      return;
    }
    
    if (formData.items.length === 0) {
      alert('Debe agregar al menos un producto');
      return;
    }
    
    if (!formData.direccionEntrega || formData.direccionEntrega.trim() === '') {
      alert('Debe especificar una dirección de entrega');
      return;
    }
    
    const result = await createVenta(formData);
    if (result) {
      navigate('/ventas');
    }
  };

  return (
    <div className="venta-create">
      <div className="page-header">
        <h1>Nueva Venta</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <Autocomplete
                label="Cliente"
                placeholder="Buscar cliente por nombre o teléfono..."
                options={clientes.map(cliente => ({
                  value: cliente.id,
                  label: cliente.nombre,
                  secondary: cliente.telefono,
                }))}
                value={formData.clienteId}
                onChange={(clienteId) => {
                  const cliente = clientes.find(c => c.id === clienteId);
                  setFormData(prev => ({
                    ...prev,
                    clienteId,
                    direccionEntrega: cliente?.direccion || '',
                  }));
                }}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input
                id="telefono"
                type="text"
                value={clientes.find(c => c.id === formData.clienteId)?.telefono || ''}
                className="select-input"
                disabled
                readOnly
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="metodoPagoId">Método de Pago *</label>
              <select
                id="metodoPagoId"
                name="metodoPagoId"
                value={formData.metodoPagoId}
                onChange={handleChange}
                className="select-input"
                required
              >
                <option value={0}>Seleccionar método</option>
                {metodosPago.map((metodo) => (
                  <option key={metodo.id} value={metodo.id}>
                    {metodo.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Dirección de Entrega *"
            name="direccionEntrega"
            type="text"
            value={formData.direccionEntrega}
            onChange={handleChange}
            required
          />

          <div className="form-group">
            <label htmlFor="notas">Notas</label>
            <textarea
              id="notas"
              name="notas"
              value={formData.notas}
              onChange={handleChange}
              rows={3}
              className="input-field"
            />
          </div>

          <div className="items-section">
            <h3>Productos</h3>

            <div className="item-form">
              <Autocomplete
                label="Producto"
                placeholder="Buscar producto..."
                options={products.map(product => ({
                  value: product.id,
                  label: product.nombre,
                  secondary: `$${product.precioBase.toLocaleString()}`,
                }))}
                value={selectedItem.productoId}
                onChange={(productoId) => handleProductChange(productoId)}
              />

              <Input
                label="Cantidad"
                name="cantidad"
                type="number"
                min="1"
                value={selectedItem.cantidad}
                onChange={(e) =>
                  setSelectedItem((prev) => ({
                    ...prev,
                    cantidad: parseInt(e.target.value) || 1,
                  }))
                }
              />

              <Input
                label="Precio Unit."
                name="precioUnitario"
                type="number"
                
                min="0"
                value={selectedItem.precioUnitario}
                onChange={(e) =>
                  setSelectedItem((prev) => ({
                    ...prev,
                    precioUnitario: parseFloat(e.target.value) || 0,
                  }))
                }
              />

              <Button type="button" variant="secondary" onClick={handleAddItem}>
                Agregar
              </Button>
            </div>

            {formData.items.length > 0 && (
              <div className="items-list">
                <table>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Precio Unit.</th>
                      <th>Subtotal</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items.map((item: any, index: number) => {
                      const product = products.find((p) => p.id === item.productoId);
                      return (
                        <tr key={index}>
                          <td>{product?.nombre}</td>
                          <td>{item.cantidad}</td>
                          <td>${item.precioUnitario.toLocaleString()}</td>
                          <td>${(item.cantidad * item.precioUnitario).toLocaleString()}</td>
                          <td>
                            <Button
                              type="button"
                              variant="danger"
                              size="small"
                              onClick={() => handleRemoveItem(index)}
                            >
                              Eliminar
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3}><strong>Total:</strong></td>
                      <td><strong>${calculateTotal().toLocaleString()}</strong></td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>

          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={() => navigate('/ventas')}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creando...' : 'Crear Venta'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
