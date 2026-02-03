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
  totalQuantity: 0,
  totalPrice: 0,
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
      state.totalQuantity += addedQuantity;
      state.totalPrice += newItem.price * addedQuantity;
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(i => i._id === productId);
      if (!item) return;

      const diff = quantity - item.quantity;
      state.totalQuantity += diff;
      state.totalPrice += item.price * diff;
      item.quantity = quantity;

      if (quantity <= 0) {
        state.items = state.items.filter(i => i._id !== productId);
      }
    },
    removeFromCart: (state, action) => {
      const item = state.items.find(i => i._id === action.payload);
      if (item) {
        state.totalQuantity -= item.quantity;
        state.totalPrice -= item.price * item.quantity;
        state.items = state.items.filter(i => i._id !== action.payload);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
