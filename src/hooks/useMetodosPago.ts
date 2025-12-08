import { useState, useEffect } from 'react';
import { metodoPagoApi } from '../api/metodoPagoApi';
import { MetodoPago, CreateMetodoPagoInput, UpdateMetodoPagoInput } from '../types/metodoPago';

export const useMetodosPago = () => {
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetodosPago = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await metodoPagoApi.getAll();
      setMetodosPago(result);
    } catch (err: any) {
      setError(err.message || 'Error al cargar métodos de pago');
    } finally {
      setLoading(false);
    }
  };

  const createMetodoPago = async (data: CreateMetodoPagoInput): Promise<MetodoPago | null> => {
    setLoading(true);
    setError(null);
    try {
      const newMetodo = await metodoPagoApi.create(data);
      setMetodosPago((prev) => [...prev, newMetodo]);
      return newMetodo;
    } catch (err: any) {
      setError(err.message || 'Error al crear método de pago');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateMetodoPago = async (id: number, data: UpdateMetodoPagoInput): Promise<MetodoPago | null> => {
    setLoading(true);
    setError(null);
    try {
      const updated = await metodoPagoApi.update(id, data);
      setMetodosPago((prev) => prev.map((m) => (m.id === id ? updated : m)));
      return updated;
    } catch (err: any) {
      setError(err.message || 'Error al actualizar método de pago');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteMetodoPago = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await metodoPagoApi.delete(id);
      setMetodosPago((prev) => prev.filter((m) => m.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || 'Error al eliminar método de pago');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    metodosPago,
    loading,
    error,
    fetchMetodosPago,
    createMetodoPago,
    updateMetodoPago,
    deleteMetodoPago,
  };
};
