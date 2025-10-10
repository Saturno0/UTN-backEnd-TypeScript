import { useCallback, useEffect, useMemo, useState } from 'react';

import type { Product } from '../types/types';

interface UseProductsOptions {
  autoFetch?: boolean;
}

interface UpdateResponse {
  message: string;
  product?: Product;
}

const DEFAULT_API_BASE_URL = 'http://localhost:3000/api';

const toStringId = (value: unknown): string | undefined => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  return undefined;
};

const normalizeProduct = (product: Product): Product => {
  const normalizedId = toStringId(product._id) ?? toStringId(product.id);

  return {
    ...product,
    _id: toStringId(product._id) ?? normalizedId,
    id: normalizedId ?? product.id,
    colores: Array.isArray(product.colores)
      ? product.colores.map((color) => ({
          ...color,
          _id: toStringId(color._id) ?? toStringId(color.id),
          id: toStringId(color.id) ?? toStringId(color._id) ?? color.id,
          cantidad: typeof color.cantidad === 'number' ? color.cantidad : Number(color.cantidad) || 0,
          stock: typeof color.stock === 'number' ? color.stock : Number(color.stock) || 0,
        }))
      : [],
  };
};

const normalizeProductsList = (products: Product[]): Product[] =>
  products.map(normalizeProduct);

const useProducts = (options: UseProductsOptions = {}) => {
  const { autoFetch = true } = options;

  const apiBaseUrl = useMemo(() => {
    const envUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
    const base = (envUrl || DEFAULT_API_BASE_URL).trim();
    return base.endsWith('/') ? base.slice(0, -1) : base;
  }, []);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(Boolean(autoFetch));
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${apiBaseUrl}/products/getAllProducts`);

      if (response.status === 204) {
        setProducts([]);
        return [];
      }

      if (!response.ok) {
        throw new Error('No se pudieron obtener los productos.');
      }

      const data: Product[] = await response.json();
      const normalized = Array.isArray(data) ? normalizeProductsList(data) : [];
      setProducts(normalized);
      return normalized;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error inesperado.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiBaseUrl]);

  const fetchProductById = useCallback(
    async (id: string) => {
      try {
        setError(null);

        const response = await fetch(`${apiBaseUrl}/products/getProduct/${id}`);

        if (!response.ok) {
          throw new Error('No se pudo encontrar el producto solicitado.');
        }

        const product: Product = await response.json();
        const normalizedProduct = normalizeProduct(product);

        setProducts((prev) => {
          const index = prev.findIndex((item) => {
            const productId = item._id ?? (typeof item.id === 'number' ? item.id.toString() : item.id);
            return productId === id;
          });

          if (index === -1) {
            return [...prev, normalizedProduct];
          }

          const updated = [...prev];
          updated[index] = normalizedProduct;
          return updated;
        });

        return normalizedProduct;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error inesperado.';
        setError(message);
        throw err;
      }
    },
    [apiBaseUrl]
  );

  const updateProduct = useCallback(
    async (id: string, updates: Partial<Product>) => {
      try {
        setError(null);

        const response = await fetch(`${apiBaseUrl}/products/updateProduct/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updates),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'No se pudo actualizar el producto.');
        }

        const data: UpdateResponse = await response.json();
        const updatedProduct = data.product ? normalizeProduct(data.product) : undefined;

        if (updatedProduct) {
          setProducts((prev) => {
            const index = prev.findIndex((item) => {
              const productId = item._id ?? (typeof item.id === 'number' ? item.id.toString() : item.id);
              return productId === id;
            });

            if (index === -1) {
              return [...prev, updatedProduct];
            }

            const nextProducts = [...prev];
            nextProducts[index] = updatedProduct;
            return nextProducts;
          });
        }

        return updatedProduct;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error inesperado.';
        setError(message);
        throw err;
      }
    },
    [apiBaseUrl]
  );

  useEffect(() => {
    if (autoFetch) {
      void fetchProducts();
    }
  }, [autoFetch, fetchProducts]);

  return {
    products,
    loading,
    error,
    fetchProducts,
    fetchProductById,
    updateProduct,
    setProducts,
  } as const;
};

export default useProducts;
