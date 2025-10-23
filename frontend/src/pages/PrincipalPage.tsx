import Navbar from "../components/Navbar";
import Main from "../components/Main";
import Footer from "../components/Footer";
import useProducts from "../hooks/useProducts";
import "../styles/Index.css";
import { useState, useEffect, useCallback } from "react";
import type { Product } from "../types/types";

function PrincipalPage() {
    const { fetchProducts, error: errorAll, loading: loadingAll, done: doneAll } = useProducts();

    const [ products, setProducts ] = useState<Product[]>([]);
    const [ loading, setLoading ] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const resolveProductId = useCallback((product: Product): string => {
        if (typeof product._id === "string" && product._id.trim().length > 0) {
            return product._id;
        }

        if (typeof product.id === "number") {
            return product.id.toString();
        }

        if (typeof product.id === "string" && product.id.trim().length > 0) {
            return product.id;
        }

        return product.name;
    }, []);

    const handleProductStatusChange = useCallback((id: string, changes: Partial<Product>) => {
        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                resolveProductId(product) === id ? { ...product, ...changes } : product
            )
        );
    }, [resolveProductId]);

    const handleProductDelete = useCallback((id: string) => {
        setProducts((prevProducts) =>
            prevProducts.filter((product) => resolveProductId(product) !== id)
        );
    }, [resolveProductId]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const existProducts = await fetchProducts();
                if(existProducts) {
                    setProducts(existProducts);
                }
                setLoading(false);
                setError(null);
            } catch (err: any) {
                setLoading(false);
                const message = err instanceof Error ? err.message : errorAll;
                setError(typeof message === "string" ? message : "Error al cargar los productos");
                console.error('Error fetching products: ', message);
            }
        }
        void fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isLoading = loading || loadingAll.all;

    return (
        <>
            <Navbar/>
            {isLoading && (
                <main>
                    <p>Cargando productos...</p>
                </main>
            )}
            {!isLoading && error && (
                <main>
                    <p>{error}</p>
                </main>
            )}
            {!isLoading && !error && doneAll &&(
                <Main
                    products={products}
                    onUpdateProduct={handleProductStatusChange}
                    onDeleteProduct={handleProductDelete}
                />
            )}
            <Footer/>
        </>
    )
};

export default PrincipalPage;