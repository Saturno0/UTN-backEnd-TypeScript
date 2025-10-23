import { Link } from 'react-router-dom';
import type { Product } from '../types/types';
import { useEffect, useMemo, useState } from 'react';
import useProducts from '../hooks/useProducts';

interface ProductCardProps {
  producto: Product;
  admin: boolean;
  onStatusChange?: (id: string, changes: Partial<Product>) => void;
  onDelete?: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  producto,
  admin,
  onStatusChange,
  onDelete,
}) => {
  const { updateProduct, deleteProduct } = useProducts();

  // Estado local de disponibilidad (derivado del estado del producto)
  const [disponible, setDisponible] = useState<boolean>(
    producto.estado === 'Activo'
  );

  useEffect(() => {
    setDisponible(producto.estado === 'Activo');
  }, [producto.estado]);

  // Normalizar ID a string (evita llamadas con ID vacío)
  const productId: string = useMemo(() => {
    const raw =
      typeof producto._id === 'string'
        ? producto._id
        : typeof (producto as any).id === 'number'
        ? String((producto as any).id)
        : (producto as any).id;

    return (raw ?? '').toString().trim();
  }, [producto]);

  const linkTarget = productId ? `/producto/${productId}` : '#';

  const handleToggleDisponibilidad = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDisponible((prev) => !prev);
  };

  const handleEliminarProducto = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!productId) {
      alert('ID de producto inválido.');
      return;
    }

    const confirmDelete = window.confirm(
      `¿Eliminar "${producto.name}"? Esta acción no se puede deshacer.`
    );
    if (!confirmDelete) return;

    try {
      const response = await deleteProduct(productId);
      alert(response?.message || 'Producto eliminado correctamente.');
      onDelete?.(productId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar el producto.';
      alert(message);
      console.error('Error deleting product:', err);
    }
  };

  const handleSaveChanges = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!productId) {
      alert('ID de producto inválido.');
      return;
    }

    try {
      const payload = { estado: disponible ? 'Activo' : 'Inactivo' as const };
      const res = await updateProduct(productId, payload);
      alert(res?.message || 'Cambios guardados correctamente.');
      onStatusChange?.(productId, payload);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al guardar los cambios.';
      alert(message);
      console.error('Error updating product:', err);
    }
  };


  // Clase del botón toggle según la ACCIÓN (peligrosa si va a “sacar disponibilidad”)
  const toggleBtnClass = disponible ? 'btn-unavailable' : 'btn-available';
  const toggleBtnText = disponible ? 'Sacar disponibilidad' : 'Poner disponibilidad';

  return (
    <Link
      to={{ pathname: linkTarget, hash: '#main' }}
      state={{ producto }}
      onClick={(e) => {
        // Evitar navegar si no hay ID válido
        if (!productId) e.preventDefault();
      }}
    >
      <div className="card">
        <h2>{producto.name}</h2>
        <img
          src={producto.imageUrl}
          alt={`imagen de ${producto.name}`}
          loading="lazy"
        />
        <p>Precio: ${producto.precio_actual}</p>

        {admin && (
          <p className={`status-indicator ${disponible ? 'status-active' : 'status-inactive'}`}>
            Estado: {disponible ? 'Activo' : 'Inactivo'}
          </p>
        )}

        {admin && (
          <div className="admin-buttons">
            <button className="btn-remove-item" onClick={handleEliminarProducto}>
              Eliminar
            </button>

            <button className={toggleBtnClass} onClick={handleToggleDisponibilidad}>
              {toggleBtnText}
            </button>

            <button className="btn-save" onClick={handleSaveChanges}>
              Guardar
            </button>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;