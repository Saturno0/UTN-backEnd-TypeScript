import { Link } from 'react-router-dom';

const EmptyCart = () => {
    return (
        <div className='empty-cart'>
            <h2 className="empty-cart-msg">No hay productos en tu carrito.</h2>
            <p className="empty-cart-msg">¡Agrega algunos productos para comenzar!</p>
            <Link to="/"><p className="link">Ir a la tienda</p></Link>
        </div>
    );
}

export default EmptyCart;