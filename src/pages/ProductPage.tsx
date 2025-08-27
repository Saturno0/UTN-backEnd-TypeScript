import Navbar from '../components/Navbar';
import ProductDetail from '../components/ProductDetail';
import Footer from '../components/Footer';
import { useLocation } from 'react-router-dom';
import '../styles/Product.css';


const ProductPage = () => {
    const { state } = useLocation();
    const producto = state.producto;

    return (
        <>
            <Navbar />
            <ProductDetail product={producto} />
            <Footer />
        </>
    );
}

export default ProductPage;