import { Cliente } from './cliente';
import { MetodoPago } from './metodoPago';
import { Product } from './product';

export interface VentaItem {
  id: number;
  ventaId: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  producto?: Product;
}

export interface Venta {
  id: number;
  clienteId: number;
  metodoPagoId: number;
  total: number;
  estado: 'pendiente' | 'completada' | 'anulada' | 'entregada';
  direccionEntrega: string;
  notas?: string;
  createdAt: string;
  updatedAt: string;
  cliente?: Cliente;
  metodoPago?: MetodoPago;
  items?: VentaItem[];
}

export interface CreateVentaInput {
  clienteId: number;
  metodoPagoId: number;
  direccionEntrega: string;
  notas?: string;
  items: Array<{
    productoId: number;
    cantidad: number;
    precioUnitario: number;
  }>;
}
