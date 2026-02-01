import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import ingredientReducer from './slices/ingredientSlice';
import authReducer from './slices/authSlice';
import orderReducer from './slices/orderSlice';
import storeReducer from './slices/storeSlice';

import categoryReducer from './slices/categorySlice';
import userReducer from './slices/userSlice';
import roleReducer from './slices/roleSlice';
import couponReducer from './slices/couponSlice';
import statsReducer from './slices/statsSlice';

export const store = configureStore({
    reducer: {
        products: productReducer,
        ingredients: ingredientReducer,
        auth: authReducer,
        orders: orderReducer,
        stores: storeReducer,
        categories: categoryReducer,
        users: userReducer,
        roles: roleReducer,
        coupons: couponReducer,
        stats: statsReducer
    },
});