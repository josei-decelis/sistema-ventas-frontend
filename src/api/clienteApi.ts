import { httpClient } from './httpClient';
import { Cliente, CreateClienteInput, UpdateClienteInput } from '../types/cliente';
import { PaginatedResponse } from '../types/common';

export const clienteApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Cliente>> => {
    const response = await httpClient.get<any>('/clientes', params);
    return {
      data: response.data.clientes,
      pagination: response.data.pagination,
    };
  },

  getById: async (id: number): Promise<Cliente> => {
    const response = await httpClient.get<any>(`/clientes/${id}`);
    return response.data.cliente;
  },

  search: async (query: string): Promise<Cliente[]> => {
    const response = await httpClient.get<any>('/clientes/buscar', { q: query });
    return response.data?.clientes || [];
  },

  create: async (data: CreateClienteInput): Promise<Cliente> => {
    const response = await httpClient.post<any>('/clientes', data);
    return response.data.cliente;
  },

  update: async (id: number, data: UpdateClienteInput): Promise<Cliente> => {
    const response = await httpClient.put<any>(`/clientes/${id}`, data);
    return response.data.cliente;
  },

  delete: async (id: number): Promise<void> => {
    await httpClient.delete(`/clientes/${id}`);
  },
};
