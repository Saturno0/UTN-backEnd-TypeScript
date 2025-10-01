import Navbar from "../components/Navbar";
import Main from "../components/Main";
import Footer from "../components/Footer";
import useProducts from "../hooks/useProducts";
import "../styles/Index.css";

function PrincipalPage() {
    const { products, loading, error } = useProducts();

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
            {!loading && !error && <Main products={products} />}
            <Footer/>
        </>
    )
};

export default PrincipalPage;