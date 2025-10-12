import { useCreateCategory, useFetchCategories } from "./categories";

const useCategories = () => {
  const {
    fetchCategories,
    error: errorFetch,
    loading: loadingFetch,
    done: doneFetch,
  } = useFetchCategories();

  const {
    createCategory,
    error: errorCreate,
    loading: loadingCreate,
    done: doneCreate,
  } = useCreateCategory();

  return {
    fetchCategories,
    createCategory,
    loading: {
      fetch: loadingFetch,
      create: loadingCreate,
    },
    done: {
      fetch: doneFetch,
      create: doneCreate,
    },
    error: {
      fetch: errorFetch,
      create: errorCreate,
    },
  } as const;
};

export default useCategories;