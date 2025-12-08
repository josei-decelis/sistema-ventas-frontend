export interface Product {
  id: number;
  nombre: string;
  descripcion?: string;
  precioBase: number;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
  ingredientes?: ProductIngredient[];
}

export interface ProductIngredient {
  id: number;
  productoId: number;
  ingredienteId: number;
  cantidad: number;
  ingrediente?: Ingredient;
  producto?: Product;
}

export interface CreateProductInput {
  nombre: string;
  descripcion?: string;
  precioBase: number;
  ingredientes?: {
    ingredienteId: number;
    cantidad: number;
  }[];
}

export interface UpdateProductInput {
  nombre?: string;
  descripcion?: string;
  precioBase?: number;
  activo?: boolean;
}

export interface ProductCostInfo {
  producto: {
    id: number;
    nombre: string;
    precioBase: number;
  };
  costoEstimado: number;
  margenGanancia: number;
  porcentajeMargen: number;
  ingredientes: {
    nombre: string;
    cantidad: number;
    costoUnitario: number;
    costoTotal: number;
  }[];
}

export interface Ingredient {
  id: number;
  nombre: string;
  costoUnitario: number;
  createdAt: string;
  updatedAt: string;
}
