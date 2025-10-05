import { useState } from "react";
import { buildApiUrl, API_CONFIG } from "../../config/api.js";

function useFetchProduct() {
    const [error, setError]: any = useState();
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const urlBuild = buildApiUrl(API_CONFIG.PRODUCTS.GET_ONE);

    const fetchProduct = async (id: string) => {
        urlBuild.replace(":id", `${id}`);
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(urlBuild);

            if (response.status === 404) {
                // No existe tal producto
                setDone(true);
                return;
            } else if (response.ok) {
                const product = await response.json();
                setDone(true);
                return product;
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

    return { fetchProduct, error, loading, done };
}

export default useFetchProduct;