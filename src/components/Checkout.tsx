import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CheckOutForm from "./CheckOutForm";
import CartItems from "./CartItems";
import { clearCart } from "../hooks/cartSlice";
import type { CartItem, FormData } from "../types/types";
import type { RootState, AppDispatch } from "../hooks/store";



const Checkout: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  // Usamos RootState para acceder al tipado completo del store
  const cartItems = useSelector((state: RootState) => state.cart.products);
  const user = useSelector((state: RootState) => state.user);

  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    email: user.email,
    telefono: "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
    metodoPago: "tarjeta",
  });

  // Agrupar items iguales
  const groupedItems = cartItems.reduce<Record<string, CartItem & { quantity: number }>>(
    (acc: Record<string, CartItem & { quantity: number }>, item: CartItem) => {
      const key = `${item.id}-${item.name}-${item.color}`;
      if (!acc[key]) {
        acc[key] = { ...item, quantity: 1 };
      } else {
        acc[key].quantity += 1;
      }
      return acc;
    },
    {}
  );

  const items: Array<CartItem & { quantity: number }> = Object.values(groupedItems);
  const total = items.reduce(
    (sum, item) => sum + (item.precio_actual || 100) * item.quantity,
    0
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState: FormData) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const shipping = 500;
      const finalTotal = total + shipping;

      const orderData = {
        ...formData,
        items,
        total: finalTotal,
      };

      const response = await fetch(
        "http://localhost:3001/api/send-confirmation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert(
          "¡Compra realizada con éxito! En breve recibirás un mensaje para realizar el pago."
        );
        navigate("/");
        dispatch(clearCart());
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        "Hubo un error al procesar tu compra. Por favor intenta nuevamente." +
          error
      );
    }
  };

  return (
    <div className="checkout-container">
      <h1>Finalizar Compra</h1>

      <div className="checkout-content">
        <div className="checkout-form">
          <CheckOutForm
            handleSubmit={handleSubmit}
            formData={formData}
            handleInputChange={handleInputChange}
          />
        </div>
        <div className="order-summary">
          <CartItems items={items} dispatch={dispatch} />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
