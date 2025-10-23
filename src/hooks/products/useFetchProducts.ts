import { useState } from "react";
import { buildApiUrl, API_CONFIG } from "../../config/api.js";
import type { Product } from "../../types/types.js";

function useFetchProducts() {
    const [error, setError]: any = useState();
    const [loading, setLoading] = useState<boolean>(false);
    const [done, setDone] = useState(false);
    
    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(buildApiUrl(API_CONFIG.PRODUCTS.GET_ALL));

            if (response.status === 204) {
                setDone(true);
                return [];
            } else if (response.ok) {
                const products: Product[] = await response.json();
                setDone(true);
                return products;
            } else {
                throw new Error(`Error: ${response.statusText}`);
            }
        } catch (error) {
            setError(error);
            setDone(true);
            return [];
        } finally {
            setLoading(false);
        }
    };

    return { fetchProducts, error, loading, done };
}

export default useFetchProducts;
