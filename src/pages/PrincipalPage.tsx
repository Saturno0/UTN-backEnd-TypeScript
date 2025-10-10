import Navbar from "../components/Navbar";
import Main from "../components/Main";
import Footer from "../components/Footer";
import useProducts from "../hooks/useProducts";
import "../styles/Index.css";
import { useState, useEffect } from "react";
import type { Product } from "../types/types";

function PrincipalPage() {
    const { fetchProducts, error: errorAll, loading: loadingAll, done: doneAll } = useProducts();

    const [ products, setProducts ] = useState<Product[]>([]);
    const [ loading, setLoading ] = useState<boolean>(true);
    const [error, setError] = useState<Error | any>();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const existProducts = await fetchProducts();
                if(existProducts) {
                    setProducts(existProducts);
                    setLoading(loadingAll.all);
                }
            } catch (err: any) {
                setLoading(false);
                setError(errorAll);
                console.error('Error fetching products: ', error.message || error);
            }
        }
        fetchData();
    },[]);

    return (
        <>
            <Navbar/>
            {loading && (
                <main>
                    <p>Cargando productos...</p>
                </main>
            )}
            {!loading && error && (
                <main>
                    <p>{error}</p>
                </main>
            )}
            {!loading && !error && doneAll &&<Main products={products} />}
            <Footer/>
        </>
    )
};

export default PrincipalPage;