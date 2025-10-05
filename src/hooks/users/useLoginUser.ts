import { useState } from "react";
import { buildApiUrl, API_CONFIG } from "../../config/api";

/** 
 * Hook para autenticar al usuario
 * @returns {Objects}
*/ 

const useLoginUser = () => {
    const [error, setError]: any = useState();
    const [done, setDone] = useState(false);
    const [loading, setLoading] = useState(false);
    const initialUrl = buildApiUrl(API_CONFIG.USERS.LOGIN);

    const loginUser = async (formData: Object) =>{
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(initialUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (response.ok){
                const res = await response.json();
                sessionStorage.setItem("token", res.token); //Guardo el token
                setDone(true);
                return res;
            } else {
                setError(response.statusText);
                setDone(false);
            }
        } catch (error) {
            console.log(error);
            setError(error)
            setDone(false);
        } finally {
            setLoading(false);
        }
    }

    return { loginUser, error, done, loading };
}

export default useLoginUser;