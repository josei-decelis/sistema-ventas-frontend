export interface Ingredient {
  id: number;
  nombre: string;
  costoUnitario: number;
  stockActual: number;
  unidadMedida: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIngredientInput {
  nombre: string;
  costoUnitario: number;
  stockActual?: number;
  unidadMedida?: string;
}

export interface UpdateIngredientInput {
  nombre?: string;
  costoUnitario?: number;
  stockActual?: number;
  unidadMedida?: string;
}

export interface UpdateStockInput {
  cantidad: number;
}
