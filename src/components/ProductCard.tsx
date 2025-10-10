import { Link } from 'react-router-dom';
import type { Product } from '../types/types';
import { useState } from 'react';

interface ProductCardProps {
    producto: Product
    admin: boolean
}


const ProductCard: React.FC<ProductCardProps> = ({ producto, admin }) => {
    const [disponible, setDisponible] = useState<boolean>(producto.estado === 'Activo'? true : false);

    const productId = typeof producto._id === 'string'
        ? producto._id
        : typeof producto.id === 'number'
            ? producto.id.toString()
            : producto.id ?? '';

    const linkTarget = productId ? `/producto/${productId}` : '#';

    const handleToggleDisponibilidad = (e: React.FormEvent) => {
        e.preventDefault();
        setDisponible(!disponible);
    }

    const handleEliminarProducto = (e: React.FormEvent) => {
        e.preventDefault();
        // logica para eliminar el producto
    }

    admin = true;
    return (
        <Link to={{
                pathname: linkTarget,
                hash: "#main"
            }}
            state={{productos: producto, producto: producto}}
        >
            <div className="card">
                <h2>{producto.name}</h2>
                <img src={producto.image} alt={`imagen de ${producto.name}`} />
                <p>{producto.description}</p>
                <p>Precio: ${producto.precio_actual}</p>
                {admin && 
                    <div className='admin-buttons'>
                        <button className='btn-remove' onClick={handleEliminarProducto}>
                            Eliminar
                        </button>
                        <button className= { disponible ? 'btn-unavailable' : 'btn-available'} onClick={handleToggleDisponibilidad}>
                            { disponible ? "Sacar disponibilidad" : "Poner disponibilidad"}
                        </button>
                    </div>
                }
            </div>
        </Link>
    );
};


export default ProductCard;