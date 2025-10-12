import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import EmptyCart from "./EmptyCart";
import CartItems from "./CartItems";
import { clearCart } from "../hooks/cartSlice";
import type { CartItemsProps, UserState } from "../types/types";

const Cart: React.FC<CartItemsProps> = ({ items, dispatch }) => {
  const [user, setUser] = useState<UserState>({
    nombre: "",
    email: "",
    password: "",
    rol: "user",
    activo: false,
  });

  const total: number = items.reduce(
    (sum, item) => sum + (item.precio_actual * item.quantity),
    0
  );

  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData) as UserState);
      } catch {
        setUser({
          nombre: "",
          email: "",
          password: "",
          rol: "user",
          activo: false,
        });
      }
    } else {
      setUser({
        nombre: "",
        email: "",
        password: "",
        rol: "user",
        activo: false,
      });
    }
  }, []);

  const handleNavigate = () => {
    console.log(user.activo)
    if (!user.activo) {
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <main className="cart-page container">
      <h1 className="cart-title" style={{ textDecoration: "underline" }}>
        Tu carrito:
      </h1>

      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <>
          <CartItems items={items} dispatch={dispatch} />

          <div className="cart-summary" id="cart-summary">
            <h2>Total: ${total}</h2>
            <button
              className="btn-clear"
              onClick={() => dispatch(clearCart())}
            >
              Vaciar carrito
            </button>
            <div className="cart-actions">
              <button className="btn-buy" onClick={handleNavigate}>
                Comprar
              </button>

              <Link to="/" className="btn-continue">
                Seguir comprando
              </Link>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default Cart;
