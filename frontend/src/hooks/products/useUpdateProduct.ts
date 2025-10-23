import { useState } from "react";
import { buildApiUrl, API_CONFIG } from "../../config/api.js";

function useUpdateProduct() {
    const [error, setError]: any = useState();
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const updateProduct = async (id: string, formData: Object) => {
        setLoading(true);
        setError(null);
        const url = buildApiUrl(API_CONFIG.PRODUCTS.UPDATE).replace(":id", `${id}`);
        try {
            const response = await fetch(url, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const res = await response.json();
                setDone(true);
                return res;
            } else {
                setError(response.statusText);
                setDone(false);
            }
        } catch (error) {
            setError(error);
            setDone(false);
        } finally {
            setLoading(false);
        }
    };

    return { updateProduct, done, error, loading };
}

export default useUpdateProduct;
