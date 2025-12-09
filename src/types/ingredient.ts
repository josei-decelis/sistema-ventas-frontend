export interface Ingredient {
  id: number;
  nombre: string;
  costoUnitario: number;
  createdAt: string;
  updatedAt: string;
  productos?: Array<{
    productoId: number;
    ingredienteId: number;
  }>;
  _count?: {
    productos: number;
  };
}

export interface CreateIngredientInput {
  nombre: string;
  costoUnitario: number;
}

export interface UpdateIngredientInput {
  nombre?: string;
  costoUnitario?: number;
}
