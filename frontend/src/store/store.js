import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../features/Cart/cartSlice';
import productReducer from '../features/Product/productSlice';
import categoryReducer from '../features/Product/categorySlice';
import couponReducer from '../features/Cart/couponSlice';
import authReducer from '../features/Auth/authSlice';

import { authMiddleware } from './authMiddleware';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productReducer,
    categories: categoryReducer,
    coupons: couponReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authMiddleware),
});

store.subscribe(() => {
  localStorage.setItem('cart', JSON.stringify(store.getState().cart));
});

export default store;
