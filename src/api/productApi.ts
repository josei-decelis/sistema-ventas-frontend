import { httpClient } from './httpClient';
import {
  Product,
  CreateProductInput,
  UpdateProductInput,
  ProductCostInfo,
} from '../types/product';
import { PaginatedResponse } from '../types/common';

export const productApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    activo?: boolean;
  }): Promise<PaginatedResponse<Product>> => {
    const response = await httpClient.get<{
      productos: Product[];
      pagination: any;
    }>('/productos', params);
    return {
      data: response.data?.productos || [],
      pagination: response.data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 },
    };
  },

  getById: async (id: number): Promise<Product> => {
    const response = await httpClient.get<{ producto: Product }>(`/productos/${id}`);
    return response.data!.producto;
  },

  create: async (data: CreateProductInput): Promise<Product> => {
    const response = await httpClient.post<{ producto: Product }>('/productos', data);
    return response.data!.producto;
  },

  update: async (id: number, data: UpdateProductInput): Promise<Product> => {
    const response = await httpClient.put<{ producto: Product }>(`/productos/${id}`, data);
    return response.data!.producto;
  },

  delete: async (id: number): Promise<void> => {
    await httpClient.delete(`/productos/${id}`);
  },

  getCost: async (id: number): Promise<ProductCostInfo> => {
    const response = await httpClient.get<ProductCostInfo>(`/productos/${id}/costo`);
    return response.data!;
  },

  assignIngredients: async (
    id: number,
    ingredientes: Array<{
      ingredienteId: number;
      cantidad: number;
      unidadMedida: string;
    }>
  ): Promise<Product> => {
    const response = await httpClient.put<{ producto: Product }>(
      `/productos/${id}/ingredientes`,
      { ingredientes }
    );
    return response.data!.producto;
  },
};
