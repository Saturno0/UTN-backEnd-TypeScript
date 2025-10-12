import { useCallback, useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import NewIn from "../components/NewIn";
import useProducts from "../hooks/useProducts";
import "../styles/Index.css";
import type { Product } from "../types/types";

const NewInPage = () => {
    const { fetchProducts, loading, error, done } = useProducts();

    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

    const handleProductUpdate = useCallback((id: string, changes: Partial<Product>) => {
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
        const loadProducts = async () => {
            try {
                const fetchedProducts = await fetchProducts();
                if (fetchedProducts) {
                    setProducts(fetchedProducts);
                }
                setErrorMessage(null);
            } catch (err: any) {
                const message = err instanceof Error ? err.message : error.all;
                setErrorMessage(typeof message === "string" ? message : "Error al cargar los productos");
                console.error("Error fetching new in products", message);
            } finally {
                setIsLoading(false);
            }
        };

        void loadProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadingState = isLoading || loading.all;

    return(
        <>
            <Navbar />
            {loadingState && (
                <main>
                    <p>Cargando productos...</p>
                </main>
            )}
            {!loadingState && errorMessage && (
                <main>
                    <p>{errorMessage}</p>
                </main>
            )}
            {!loadingState && !errorMessage && done.all && (
                <NewIn
                    products={products}
                    onUpdateProduct={handleProductUpdate}
                    onDeleteProduct={handleProductDelete}
                />
            )}
            <Footer />
        </>
    );
}

export default NewInPage;