export interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
  direccion?: string;
  notas?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClienteInput {
  nombre: string;
  telefono: string;
  direccion?: string;
  notas?: string;
}

export interface UpdateClienteInput {
  nombre?: string;
  telefono?: string;
  direccion?: string;
  notas?: string;
}
