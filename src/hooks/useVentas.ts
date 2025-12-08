import { useState, useEffect } from 'react';
import { ventaApi } from '../api/ventaApi';
import { Venta, CreateVentaInput } from '../types/venta';

export const useVentas = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const fetchVentas = async (params?: {
    page?: number;
    limit?: number;
    estado?: string;
    clienteId?: number;
    fechaInicio?: string;
    fechaFin?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ventaApi.getAll(params);
      setVentas(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message || 'Error al cargar ventas');
    } finally {
      setLoading(false);
    }
  };

  const createVenta = async (data: CreateVentaInput): Promise<Venta | null> => {
    setLoading(true);
    setError(null);
    try {
      const newVenta = await ventaApi.create(data);
      setVentas((prev) => [newVenta, ...prev]);
      return newVenta;
    } catch (err: any) {
      setError(err.message || 'Error al crear venta');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const anularVenta = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const updated = await ventaApi.anular(id);
      setVentas((prev) => prev.map((v) => (v.id === id ? updated : v)));
      return true;
    } catch (err: any) {
      setError(err.message || 'Error al anular venta');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    ventas,
    loading,
    error,
    pagination,
    fetchVentas,
    createVenta,
    anularVenta,
  };
};
