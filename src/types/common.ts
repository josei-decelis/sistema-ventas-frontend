export interface ApiResponse<T = any> {
  status: 'success' | 'fail' | 'error';
  data?: T;
  message?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface DashboardStats {
  resumen: {
    ventasMes: number;
    cantidadVentasMes: number;
    ventasMesAnterior: number;
    diferenciaVsMesAnterior: number;
    ventasHoy: number;
    cantidadVentasHoy: number;
    ventasHoyHaceUnMes: number;
    diferenciaVsHaceUnMes: number;
    totalClientes: number;
    totalVentas: number;
    cantidadVentas: number;
    promedioVenta: number;
  };
  ventasPorDia: Array<{
    fecha: string;
    total: number;
    cantidad: number;
  }>;
  productosMasVendidos: Array<{
    producto: {
      id: number;
      nombre: string;
      precioBase: number;
    };
    cantidadVendida: number;
    totalGenerado: number;
  }>;
  clientesMasFrecuentes: Array<{
    cliente: {
      id: number;
      nombre: string;
      telefono: string;
    };
    cantidadCompras: number;
    totalGastado: number;
  }>;
  ventasPorMetodoPago: Array<{
    metodoPago: {
      id: number;
      nombre: string;
    };
    cantidadVentas: number;
    totalGenerado: number;
  }>;
}
