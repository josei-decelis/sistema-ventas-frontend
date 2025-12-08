import { httpClient } from './httpClient';
import { Venta, CreateVentaInput } from '../types/venta';
import { PaginatedResponse } from '../types/common';

export const ventaApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    estado?: string;
    clienteId?: number;
    fechaInicio?: string;
    fechaFin?: string;
  }): Promise<PaginatedResponse<Venta>> => {
    const response = await httpClient.get<any>('/ventas', params);
    return {
      data: response.data.ventas,
      pagination: response.data.pagination,
    };
  },

  getById: async (id: number): Promise<Venta> => {
    const response = await httpClient.get<any>(`/ventas/${id}`);
    return response.data.venta;
  },

  create: async (data: CreateVentaInput): Promise<Venta> => {
    const response = await httpClient.post<any>('/ventas', data);
    return response.data.venta;
  },

  anular: async (id: number): Promise<Venta> => {
    const response = await httpClient.patch<any>(`/ventas/${id}/anular`);
    return response.data.venta;
  },
};
