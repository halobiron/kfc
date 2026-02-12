import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ingredientApi from '../../api/ingredientApi';

export const getAllIngredients = createAsyncThunk(
    'ingredients/getAllIngredients',
    async () => {
        const data = await ingredientApi.getAll();
        return data;
    }
);

export const updateIngredientStock = createAsyncThunk(
    'ingredients/updateStock',
    async ({ id, amount, updates }) => {
        const data = await ingredientApi.updateStock(id, {
            quantity: amount,
            type: 'add',
            ...updates
        });
        return data;
    }
);

export const createIngredient = createAsyncThunk(
    'ingredients/create',
    async (formData) => {
        const data = await ingredientApi.add(formData);
        return data;
    }
);

export const updateIngredient = createAsyncThunk(
    'ingredients/update',
    async ({ id, data }) => {
        const result = await ingredientApi.update(id, data);
        return result;
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
