import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import NewIn from "../components/NewIn";
import productos from '../../public/products.json';
import '../styles/Index.css'

const NewInPage = () => {
    const products = productos.products;
    
    return(
        <>
            <Navbar />
            <NewIn products={products}/>
            <Footer />
        </>
    );
}

export default NewInPage;