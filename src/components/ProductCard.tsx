import { Link } from 'react-router-dom';
import type { Product } from '../types/types';
import { useState } from 'react';
import useProducts from '../hooks/useProducts';

interface ProductCardProps {
    producto: Product
    admin: boolean
}


const ProductCard: React.FC<ProductCardProps> = ({ producto, admin }) => {
    const { updateProduct, deleteProduct } = useProducts();

    const [disponible, setDisponible] = useState<boolean>(producto.estado === 'Activo'? true : false);

    const productId = typeof producto._id === 'string'
        ? producto._id
        : typeof producto.id === 'number'
            ? producto.id.toString()
            : producto.id ?? '';

    const linkTarget = productId ? `/producto/${productId}` : '#';

    const handleToggleDisponibilidad = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDisponible(!disponible);
    }

    const handleEliminarProducto = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        
        const confirmDelete = window.confirm(`¿Estás seguro de que deseas eliminar el producto "${producto.name}"? Esta acción no se puede deshacer.`);
        
        if (confirmDelete) {
            try {
                const response = await deleteProduct(productId);
                alert(`${response.message || 'Producto eliminado correctamente.'}`);
            } catch (error: any) {
                alert('Error al eliminar el producto.');
                console.error('Error deleting product: ', error.message || error);
            }
        }
    }

    const handleSaveChanges = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            const updateProductResponse = await updateProduct(productId, {estado: disponible ? 'Activo' : 'Inactivo'});
            alert(updateProductResponse.message || 'Cambios guardados correctamente.');
        } catch (error: any) {
            alert('Error al guardar los cambios.');
            console.error('Error updating product: ', error.message || error);
        }
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
                        <button className='btn-save' onClick={handleSaveChanges}>
                            Guardar
                        </button>
                    </div>
                }
            </div>
        </Link>
    );
};


export default ProductCard;