import { useState } from "react";
import { buildApiUrl, API_CONFIG } from "../../config/api.js";

function useUpdateUser() {
    const [ error, setError ]: any = useState()
    const [ done, setDone ] = useState(false)
    const [ loading, setLoading ] = useState(false)

    const updateUser = async(id: string, formData: object) => {
        setLoading(true);
        setError(null)
        try {
            const response = await fetch(`${buildApiUrl(API_CONFIG.USERS.UPDATE)}/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })

            if(response.ok){
               const res = await response.json()
                setDone(true)
                return res
            } else {
                // Error de servidor
                setError(response.statusText)
                setDone(false)
            }
        } catch (error) {
            setError(error)
            setDone(false)
        } finally {
            setLoading(false)
        }
    }
    return { updateUser, done, error, loading }
}

export default useUpdateUser;