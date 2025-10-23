import Navbar from "../components/Navbar";
import Checkout from "../components/Checkout";
import Footer from "../components/Footer";
import '../styles/Checkout.css'

const CheckoutPage = () => {
    return(
        <>
            <Navbar />
            <Checkout />
            <Footer />
        </>
    );
}

export default CheckoutPage;