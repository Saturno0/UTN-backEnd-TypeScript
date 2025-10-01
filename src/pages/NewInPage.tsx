import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import NewIn from "../components/NewIn";
import useProducts from "../hooks/useProducts";
import "../styles/Index.css";

const NewInPage = () => {
    const { products, loading, error } = useProducts();

    return(
        <>
            <Navbar />
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
            {!loading && !error && <NewIn products={products}/>}
            <Footer />
        </>
    );
}

export default NewInPage;