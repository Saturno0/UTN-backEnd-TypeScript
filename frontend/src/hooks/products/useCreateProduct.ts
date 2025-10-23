import { useState } from "react";
import { buildApiUrl, API_CONFIG } from "../../config/api.js";

const useCreateProduct = () => {
    const [error, setError]: any = useState();
    const [done, setDone] = useState(false);
    const [loading, setLoading] = useState(false);

    const createProduct = async (payload: any, imageFile?: File | null) =>{
        setLoading(true);
        setError(null);

        try {
            // Enviar como FormData para permitir archivo + datos
            const form = new FormData();
            console.log(form)

            // Adjuntar archivo de imagen si existe (clave esperada por el backend: 'image')
            if (imageFile) {
                form.append('image', imageFile);
            }

            // Adjuntar el resto de los campos. Para objetos/arreglos, usar JSON.
            Object.entries(payload || {}).forEach(([key, value]) => {
                if (value === undefined || key === 'image') return;
                const isObject = typeof value === 'object' && value !== null;
                form.append(key, isObject ? JSON.stringify(value) : String(value));
            });

            const response = await fetch(buildApiUrl(API_CONFIG.PRODUCTS.CREATE), {
                method: "POST",
                body: form,
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
