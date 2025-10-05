import { useState } from "react";
import { buildApiUrl, API_CONFIG } from "../../config/api";

const useCreateProduct = () => {
    const [error, setError]: any = useState();
    const [done, setDone] = useState(false);
    const [loading, setLoading] = useState(false);

    const createProduct = async (formData: Object) =>{
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(buildApiUrl(API_CONFIG.PRODUCTS.CREATE), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (response.ok){
                const res = await response.json();
                setDone(true);
                return res;
            } else {
                setError(response.statusText);
                setDone(false);
            }
        } catch (error) {
            setError(error)
            setDone(false);
        } finally {
            setLoading(false);
        }
    }

    return { createProduct, error, done, loading };
}

export default useCreateProduct;