import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Cart from '../components/Cart';
import '../styles/Cart.css';
import type { RootState } from '../hooks/store';
import type { CartItem } from '../types/types';


const CartPage = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector((state: RootState) => state.cart.products);

    const groupedItems = new Map<string, CartItem & { quantity: number }>();

    cartItems.forEach(item => {
        const key = `${item.id}-${item.name}-${item.color}`;
        if (groupedItems.has(key)) {
            groupedItems.get(key)!.quantity += 1;
        } else {
            groupedItems.set(key, { ...item, quantity: 1 });
        }
    });
    
    const items: CartItem[] = Array.from(groupedItems.values());
    

    return (
        <>
            <Navbar />
            <Cart items={items} dispatch={dispatch} />
            <Footer />
        </>
    );
};

export default CartPage;
