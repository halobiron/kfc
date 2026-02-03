import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../features/Product/productSlice';
import ingredientReducer from '../features/Ingredient/ingredientSlice';
import authReducer from '../features/Auth/authSlice';
import orderReducer from '../features/Order/orderSlice';
import storeReducer from '../features/Store/storeSlice';

import categoryReducer from '../features/Category/categorySlice';
import userReducer from '../features/User/userSlice';
import roleReducer from '../features/Role/roleSlice';
import couponReducer from '../features/Promotion/couponSlice';
import statsReducer from '../features/Dashboard/statsSlice';

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