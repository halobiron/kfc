import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import ingredientReducer from './slices/ingredientSlice';

export const store = configureStore({
    reducer: {
        products: productReducer,
        ingredients: ingredientReducer
    },
});