import { httpClient } from './httpClient';
import {
  Ingredient,
  CreateIngredientInput,
  UpdateIngredientInput,
} from '../types/ingredient';
import { PaginatedResponse } from '../types/common';

export const ingredientApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    orderBy?: string;
  }): Promise<PaginatedResponse<Ingredient>> => {
    const response = await httpClient.get<{
      ingredientes: Ingredient[];
      pagination: any;
    }>('/ingredientes', params);
    return {
      data: response.data?.ingredientes || [],
      pagination: response.data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 },
    };
  },

  getById: async (id: number): Promise<Ingredient> => {
    const response = await httpClient.get<{ ingrediente: Ingredient }>(`/ingredientes/${id}`);
    return response.data!.ingrediente;
  },

  create: async (data: CreateIngredientInput): Promise<Ingredient> => {
    const response = await httpClient.post<{ ingrediente: Ingredient }>('/ingredientes', data);
    return response.data!.ingrediente;
  },

  update: async (id: number, data: UpdateIngredientInput): Promise<Ingredient> => {
    const response = await httpClient.put<{ ingrediente: Ingredient }>(
      `/ingredientes/${id}`,
      data
    );
    return response.data!.ingrediente;
  },

  delete: async (id: number): Promise<void> => {
    await httpClient.delete(`/ingredientes/${id}`);
  },
};
