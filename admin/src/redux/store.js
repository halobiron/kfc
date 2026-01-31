import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import ingredientReducer from './slices/ingredientSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
    reducer: {
        products: productReducer,
        ingredients: ingredientReducer,
        auth: authReducer
    },
});