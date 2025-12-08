import { httpClient } from './httpClient';
import { MetodoPago, CreateMetodoPagoInput, UpdateMetodoPagoInput } from '../types/metodoPago';

export const metodoPagoApi = {
  getAll: async (): Promise<MetodoPago[]> => {
    const response = await httpClient.get<any>('/metodos-pago');
    return response.data?.metodosPago || [];
  },

  getById: async (id: number): Promise<MetodoPago> => {
    const response = await httpClient.get<any>(`/metodos-pago/${id}`);
    return response.data.metodoPago;
  },

  create: async (data: CreateMetodoPagoInput): Promise<MetodoPago> => {
    const response = await httpClient.post<any>('/metodos-pago', data);
    return response.data.metodoPago;
  },

  update: async (id: number, data: UpdateMetodoPagoInput): Promise<MetodoPago> => {
    const response = await httpClient.put<any>(`/metodos-pago/${id}`, data);
    return response.data.metodoPago;
  },

  delete: async (id: number): Promise<void> => {
    await httpClient.delete(`/metodos-pago/${id}`);
  },
};
