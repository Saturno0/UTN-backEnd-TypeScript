import { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import ProductDetail from '../components/ProductDetail';
import useProducts from '../hooks/useProducts';
import type { Product } from '../types/types';
import '../styles/Product.css';

interface LocationState {
    producto?: Product;
}

const ProductPage = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const locationState = location.state as LocationState | null;
    const initialProduct = locationState?.producto ?? null;

    const { fetchProduct, error } = useProducts();

    const [product, setProduct] = useState<Product | null>(initialProduct);
    const [loading, setLoading] = useState<boolean>(!initialProduct && Boolean(id));
    const [status, setStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        if (!product && id) {
            setLoading(true);
            fetchProduct(id)
                .then((fetchedProduct) => {
                    setProduct(fetchedProduct);
                    setStatus(null);
                })
                .catch((err) => {
                    const message = err instanceof Error ? err.message : 'No se pudo cargar el producto.';
                    setStatus({ message, type: 'error' });
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [fetchProduct, id, product]);


    const feedbackMessage = useMemo(() => {
        if (status) {
            return status;
        }
        if (error) {
            return { message: error.one, type: 'error' as const };
        }
        return null;
    }, [error, status]);

    return (
        <>
            <Navbar />
            <main className="product-page">
                {loading && <p>Cargando producto...</p>}
                {!loading && feedbackMessage && (
                    <p className={`product-feedback ${feedbackMessage.type}`}>
                        {feedbackMessage.message}
                    </p>
                )}
                {!loading && product && (
                    <ProductDetail product={product} />
                )}
                {!loading && !product && !feedbackMessage && (
                    <p>No se encontró el producto solicitado.</p>
                )}
            </main>
            <Footer />
        </>
    );
}

export default ProductPage;