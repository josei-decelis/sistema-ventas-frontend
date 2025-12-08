import { useState, useEffect, useCallback } from 'react';
import { ingredientApi } from '../api/ingredientApi';
import {
  Ingredient,
  CreateIngredientInput,
  UpdateIngredientInput,
} from '../types/ingredient';
import { HttpError } from '../api/httpClient';

export const useIngredients = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const fetchIngredients = useCallback(async (params?: {
    page?: number;
    limit?: number;
    orderBy?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ingredientApi.getAll(params);
      setIngredients(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof HttpError ? err.message : 'Error al cargar ingredientes');
    } finally {
      setLoading(false);
    }
  }, []);

  const getIngredient = async (id: number): Promise<Ingredient | null> => {
    setLoading(true);
    setError(null);
    try {
      const ingredient = await ingredientApi.getById(id);
      return ingredient;
    } catch (err) {
      setError(err instanceof HttpError ? err.message : 'Error al cargar ingrediente');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createIngredient = async (
    data: CreateIngredientInput
  ): Promise<Ingredient | null> => {
    setLoading(true);
    setError(null);
    try {
      const ingredient = await ingredientApi.create(data);
      await fetchIngredients();
      return ingredient;
    } catch (err) {
      setError(err instanceof HttpError ? err.message : 'Error al crear ingrediente');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateIngredient = async (
    id: number,
    data: UpdateIngredientInput
  ): Promise<Ingredient | null> => {
    setLoading(true);
    setError(null);
    try {
      const ingredient = await ingredientApi.update(id, data);
      await fetchIngredients();
      return ingredient;
    } catch (err) {
      setError(err instanceof HttpError ? err.message : 'Error al actualizar ingrediente');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteIngredient = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await ingredientApi.delete(id);
      await fetchIngredients();
      return true;
    } catch (err) {
      setError(err instanceof HttpError ? err.message : 'Error al eliminar ingrediente');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (id: number, cantidad: number): Promise<Ingredient | null> => {
    setLoading(true);
    setError(null);
    try {
      const ingredient = await ingredientApi.updateStock(id, { cantidad });
      await fetchIngredients();
      return ingredient;
    } catch (err) {
      setError(err instanceof HttpError ? err.message : 'Error al actualizar stock');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getLowStock = async (limite?: number): Promise<Ingredient[]> => {
    setLoading(true);
    setError(null);
    try {
      return await ingredientApi.getLowStock(limite);
    } catch (err) {
      setError(err instanceof HttpError ? err.message : 'Error al obtener stock bajo');
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, [fetchIngredients]);

  return {
    ingredients,
    loading,
    error,
    pagination,
    fetchIngredients,
    getIngredient,
    createIngredient,
    updateIngredient,
    deleteIngredient,
    updateStock,
    getLowStock,
  };
};
