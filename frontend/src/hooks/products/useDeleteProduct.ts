import { useState } from "react";
import { buildApiUrl, API_CONFIG } from "../../config/api.js";

function useDeleteProduct() {
    const [error, setError]: any = useState();
    const [done, setDone] = useState(false);
    const [loading, setLoading] = useState(false);

    const deleteProduct = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(buildApiUrl(API_CONFIG.PRODUCTS.DELETE).replace(":id", `${id}`), {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
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

    return { deleteProduct, done, error, loading };
}

export default useDeleteProduct;