import { createSlice } from '@reduxjs/toolkit';

const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : undefined;
  } catch (e) {
    console.warn("Failed to load cart from localStorage", e);
    return undefined;
  }
};

const initialState = loadCartFromStorage() || {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const addedQuantity = action.payload.quantity || 1;
      // Use _id from backend or fallback to id if mixed data
      const newItem = action.payload;

      const item = state.items.find(i => i._id === newItem._id);
      if (item) {
        item.quantity += addedQuantity;
      } else {
        state.items.push({ ...newItem, quantity: addedQuantity });
      }
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(i => i._id === productId);

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(i => i._id !== productId);
        } else {
          item.quantity = quantity;
        }
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => i._id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalQuantity = (state) => state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartTotalPrice = (state) => state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

export default cartSlice.reducer;
