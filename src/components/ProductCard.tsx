import { Link } from 'react-router-dom';
import type { Product } from '../types/types';

interface ProductCardProps {
    producto: Product
}


const ProductCard: React.FC<ProductCardProps> = ({ producto }) => {
    return (
        <Link to={{
                pathname: `/producto/${producto.id}`,
                hash: "#main"
            }} 
            state={{productos: producto, producto: producto}}
        >
            <div className="card">
                <h2>{producto.name}</h2>
                <img src={producto.image} alt={`imagen de ${producto.name}`} />
                <p>{producto.description}</p>
                <p>Precio: ${producto.precio_actual}</p>
            </div>
        </Link>
    );
};


export default ProductCard;