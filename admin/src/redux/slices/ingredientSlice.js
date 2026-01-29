import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock data
const mockIngredients = {
    success: true,
    data: [
        {
            _id: 'ing_001',
            name: 'Thịt Gà tươi (Phi lê/Cánh/Đùi)',
            unit: 'Kg',
            stock: 15.5,
            minStock: 50.0,
            category: 'Thực phẩm tươi'
        }
    ]
};

export const getAllIngredients = createAsyncThunk(
    'ingredients/getAllIngredients',
    async () => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return mockIngredients;
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
