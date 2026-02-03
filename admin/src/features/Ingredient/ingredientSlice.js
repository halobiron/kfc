import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const getAllIngredients = createAsyncThunk(
    'ingredients/getAllIngredients',
    async () => {
        const response = await api.get('/ingredients');
        return response.data;
    }
);

export const updateIngredientStock = createAsyncThunk(
    'ingredients/updateStock',
    async ({ id, amount, updates }) => {
        const response = await api.post(`/ingredient/stock/${id}`, {
            quantity: amount,
            type: 'add',
            ...updates
        });
        return response.data;
    }
);

export const createIngredient = createAsyncThunk(
    'ingredients/create',
    async (formData) => {
        const response = await api.post('/ingredient/new', formData);
        return response.data;
    }
);

export const updateIngredient = createAsyncThunk(
    'ingredients/update',
    async ({ id, data }) => {
        const response = await api.put(`/ingredient/update/${id}`, data);
        return response.data;
    }
);

const ingredientSlice = createSlice({
    name: 'ingredients',
    initialState: {
        ingredients: [],
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllIngredients.fulfilled, (state, action) => {
                state.ingredients = action.payload.data;
            });
    }
});

export default ingredientSlice.reducer;
