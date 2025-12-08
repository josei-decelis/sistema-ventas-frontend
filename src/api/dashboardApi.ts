import { httpClient } from './httpClient';
import { DashboardStats } from '../types/common';

export const dashboardApi = {
  getEstadisticas: async (params?: {
    fechaInicio?: string;
    fechaFin?: string;
  }): Promise<DashboardStats> => {
    const response = await httpClient.get<DashboardStats>('/dashboard/estadisticas', params);
    return response.data!;
  },

  getVentasDelDia: async (): Promise<{
    fecha: string;
    cantidadVentas: number;
    totalDelDia: number;
    ventas: any[];
  }> => {
    const response = await httpClient.get<{
      fecha: string;
      cantidadVentas: number;
      totalDelDia: number;
      ventas: any[];
    }>('/dashboard/ventas-del-dia');
    return response.data || {
      fecha: new Date().toISOString(),
      cantidadVentas: 0,
      totalDelDia: 0,
      ventas: []
    };
  },
};
