import { useState, useEffect } from 'react';
import { clienteApi } from '../api/clienteApi';
import { Cliente, CreateClienteInput, UpdateClienteInput } from '../types/cliente';

export const useClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const fetchClientes = async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await clienteApi.getAll({ page, limit });
      setClientes(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message || 'Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  };

  const searchClientes = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await clienteApi.search(query);
      setClientes(result);
    } catch (err: any) {
      setError(err.message || 'Error al buscar clientes');
    } finally {
      setLoading(false);
    }
  };

  const createCliente = async (data: CreateClienteInput): Promise<Cliente | null> => {
    setLoading(true);
    setError(null);
    try {
      const newCliente = await clienteApi.create(data);
      setClientes((prev) => [newCliente, ...prev]);
      return newCliente;
    } catch (err: any) {
      setError(err.message || 'Error al crear cliente');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateCliente = async (id: number, data: UpdateClienteInput): Promise<Cliente | null> => {
    setLoading(true);
    setError(null);
    try {
      const updated = await clienteApi.update(id, data);
      setClientes((prev) => prev.map((c) => (c.id === id ? updated : c)));
      return updated;
    } catch (err: any) {
      setError(err.message || 'Error al actualizar cliente');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteCliente = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await clienteApi.delete(id);
      setClientes((prev) => prev.filter((c) => c.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || 'Error al eliminar cliente');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    clientes,
    loading,
    error,
    pagination,
    fetchClientes,
    searchClientes,
    createCliente,
    updateCliente,
    deleteCliente,
  };
};
