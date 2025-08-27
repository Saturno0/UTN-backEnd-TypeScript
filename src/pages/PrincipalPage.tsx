import Navbar from "../components/Navbar";
import Main from "../components/Main";
import Footer from "../components/Footer";
import productsJson from '../../public/products.json';
import '../styles/Index.css';
import type { Product } from "../types/types";

function PrincipalPage() {
    const productsData: Product[] = productsJson.products;
    return (
        <>
            <Navbar/>
            <Main products={productsData} />
            <Footer/>
        </>
    )
};

export default PrincipalPage;