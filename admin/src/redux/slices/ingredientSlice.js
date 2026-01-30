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
    async (data) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return data; // Demo logic
    }
);

export const createIngredient = createAsyncThunk(
    'ingredients/create',
    async (formData) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return { ...formData, _id: Date.now() };
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
