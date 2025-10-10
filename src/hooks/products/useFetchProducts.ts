
import { useState } from "react";
import { buildApiUrl, API_CONFIG } from "../../config/api.js";

function useFetchProducts() {
    const [error, setError]: any = useState();
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    
    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(buildApiUrl(API_CONFIG.PRODUCTS.GET_ALL));

            if (response.status === 204) {
                // No hay categorías - devolver array vacío
                setDone(true);
                return [];
            } else if (response.ok) {
                const categories = await response.json();
                setDone(true);
                return categories;
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
