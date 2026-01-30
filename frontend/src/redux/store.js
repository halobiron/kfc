import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
import categoryReducer from './slices/categorySlice';
import couponReducer from './slices/couponSlice';
import authReducer from './slices/authSlice';

export default configureStore({
  reducer: {
    cart: cartReducer,
    products: productReducer,
    categories: categoryReducer,
    coupons: couponReducer,
    auth: authReducer,
  },
});
