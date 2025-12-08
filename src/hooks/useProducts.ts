import { useState, useEffect, useCallback } from 'react';
import { productApi } from '../api/productApi';
import { Product, CreateProductInput, UpdateProductInput } from '../types/product';
import { HttpError } from '../api/httpClient';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const fetchProducts = useCallback(async (params?: {
    page?: number;
    limit?: number;
    activo?: boolean;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productApi.getAll(params);
      setProducts(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof HttpError ? err.message : 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  }, []);

  const getProduct = async (id: number): Promise<Product | null> => {
    setLoading(true);
    setError(null);
    try {
      const product = await productApi.getById(id);
      return product;
    } catch (err) {
      setError(err instanceof HttpError ? err.message : 'Error al cargar producto');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (data: CreateProductInput): Promise<Product | null> => {
    setLoading(true);
    setError(null);
    try {
      const product = await productApi.create(data);
      await fetchProducts();
      return product;
    } catch (err) {
      setError(err instanceof HttpError ? err.message : 'Error al crear producto');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (
    id: number,
    data: UpdateProductInput
  ): Promise<Product | null> => {
    setLoading(true);
    setError(null);
    try {
      const product = await productApi.update(id, data);
      await fetchProducts();
      return product;
    } catch (err) {
      setError(err instanceof HttpError ? err.message : 'Error al actualizar producto');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await productApi.delete(id);
      await fetchProducts();
      return true;
    } catch (err) {
      setError(err instanceof HttpError ? err.message : 'Error al eliminar producto');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getCost = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      return await productApi.getCost(id);
    } catch (err) {
      setError(err instanceof HttpError ? err.message : 'Error al obtener costo');
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    pagination,
    fetchProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getCost,
  };
};
