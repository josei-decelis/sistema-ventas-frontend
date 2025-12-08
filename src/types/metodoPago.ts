export interface MetodoPago {
  id: number;
  nombre: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMetodoPagoInput {
  nombre: string;
  activo?: boolean;
}

export interface UpdateMetodoPagoInput {
  nombre?: string;
  activo?: boolean;
}
