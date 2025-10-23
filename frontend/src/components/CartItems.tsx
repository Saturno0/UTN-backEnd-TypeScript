import { removeFromCart } from "../hooks/cartSlice";
import type { CartItemsProps } from "../types/types";

const CartItems: React.FC<CartItemsProps> = ({ items, dispatch }) => {
  return (
    <div className="cart-card-container">
      {items.map((item) => (
        <div
          className="cart-card"
          key={`${item.id}-${item.name}-${item.color}`}
        >
          <div className="card-header">
            <p className="product-title">{item.name}</p>
          </div>

          <div className="card-body">
            <p>
              <strong>Color:</strong> {item.color}
            </p>
            <p>
              <strong>Cantidad:</strong> {("quantity" in item ? item.quantity : 1)}
            </p>
            <p>
              <strong>Precio unidad:</strong> ${item.precio_actual || 100}
            </p>
            <p>
              <strong>Precio final:</strong> $
              {(item.precio_actual || 100) *
                ("quantity" in item ? item.quantity : 1)}
            </p>
          </div>
          <button
            className="btn-remove"
            onClick={() =>
              dispatch(
                removeFromCart({
                  id: item.id,
                  name: item.name,
                  color: item.color,
                })
              )
            }
          >
            Quitar uno
          </button>
        </div>
      ))}
    </div>
  );
};

export default CartItems;
