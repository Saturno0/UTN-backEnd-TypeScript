// useProducts.ts
import {
  useCreateProduct,
  useDeleteProduct,
  useFetchProduct,
  useFetchProducts,
  useUpdateProduct, // <- en index.ts se exporta con nombre plural
} from "./products/index.ts";

const useProducts = () => {
  // GET all
  const {
    fetchProducts,
    error: errorAll,
    loading: loadingAll,
    done: doneAll,
  } = useFetchProducts();

  // GET one
  const {
    fetchProduct,
    error: errorOne,
    loading: loadingOne,
    done: doneOne,
  } = useFetchProduct();

  // CREATE
  const {
    createProduct,
    error: errorCreate,
    loading: loadingCreate,
    done: doneCreate,
  } = useCreateProduct();

  // UPDATE
  const {
    updateProduct,
    error: errorUpdate,
    loading: loadingUpdate,
    done: doneUpdate,
  } = useUpdateProduct();

  // DELETE
  const {
    deleteProduct,
    error: errorDelete,
    loading: loadingDelete,
    done: doneDelete,
  } = useDeleteProduct();

  // Fachada unificada
  return {
    // acciones
    fetchProducts,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct,

    // estados agrupados (granulares)
    loading: {
      all: loadingAll,
      one: loadingOne,
      create: loadingCreate,
      update: loadingUpdate,
      delete: loadingDelete,
    },
    done: {
      all: doneAll,
      one: doneOne,
      create: doneCreate,
      update: doneUpdate,
      delete: doneDelete,
    },
    error: {
      all: errorAll,
      one: errorOne,
      create: errorCreate,
      update: errorUpdate,
      delete: errorDelete,
    },
  } as const;
};

export default useProducts;
