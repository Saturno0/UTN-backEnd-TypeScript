import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CartState } from '../types/types';



const cartData = localStorage.getItem('cart');
const storedCart: CartState | null = cartData ? JSON.parse(cartData) : null;

const normalizeStoredProducts = (products: CartState['products']) =>
  products.map((product) => ({
    ...product,
    id: String(product.id),
  }));

const initialState: CartState = storedCart
  ? {
      totalItems: storedCart.totalItems,
      products: normalizeStoredProducts(storedCart.products),
    }
  : {
      totalItems: 0,
      products: [],
    };

const updateLocalStorage = (state: CartState) => {
  localStorage.setItem('cart', JSON.stringify(state));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (
      state: CartState,
      action: PayloadAction<{ name: string; id: string; color: string; price: number; quantity: number; image: string }>
    ) => {
      const { name, id, color, price, quantity, image } = action.payload;
      state.products.push({
        name,
        id,
        color,
        precio_actual: price,
        quantity: quantity,
        image,
      });
      state.totalItems += 1;
      updateLocalStorage(state);
    },
    removeFromCart: (
      state: CartState,
      action: PayloadAction<{ id: string; name: string; color: string }>
    ) => {
      const { id, name, color } = action.payload;
      const index = state.products.findIndex(
        (item) => item.id === id && item.name === name && item.color === color
      );
      if (index !== -1) {
        state.products.splice(index, 1);
        state.totalItems -= 1;
        updateLocalStorage(state);
      }
    },
    clearCart: (state: CartState) => {
      state.products = [];
      state.totalItems = 0;
      updateLocalStorage(state);
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
