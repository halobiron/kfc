import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ingredientApi from '../../api/ingredientApi';

export const getAllIngredients = createAsyncThunk(
    'ingredients/getAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await ingredientApi.getAll();
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getIngredient = createAsyncThunk(
    'ingredients/get',
    async (id, { rejectWithValue }) => {
        try {
            const response = await ingredientApi.get(id);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateIngredientStock = createAsyncThunk(
    'ingredients/updateStock',
    async ({ id, amount, updates }, { rejectWithValue }) => {
        try {
            const response = await ingredientApi.updateStock(id, {
                quantity: amount,
                type: 'add',
                ...updates
            });
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createIngredient = createAsyncThunk(
    'ingredients/create',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await ingredientApi.add(formData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateIngredient = createAsyncThunk(
    'ingredients/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const result = await ingredientApi.update(id, data);
            return result;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteIngredient = createAsyncThunk(
    'ingredients/delete',
    async (id, { rejectWithValue }) => {
        try {
            await ingredientApi.delete(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const ingredientSlice = createSlice({
    name: 'ingredients',
    initialState: {
        ingredients: [],
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetSuccess: (state) => {
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get All
            .addCase(getAllIngredients.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllIngredients.fulfilled, (state, action) => {
                state.loading = false;
                state.ingredients = action.payload.data || action.payload;
            })
            .addCase(getAllIngredients.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            
            // Create
            .addCase(createIngredient.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createIngredient.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.ingredients.push(action.payload.data || action.payload);
            })
            .addCase(createIngredient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            
             // Update
            .addCase(updateIngredient.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updateIngredient.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                const updatedIngredient = action.payload.data || action.payload;
                const index = state.ingredients.findIndex(item => item._id === updatedIngredient._id);
                if (index !== -1) {
                    state.ingredients[index] = updatedIngredient;
                }
            })
            .addCase(updateIngredient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })

            // Update Stock
            .addCase(updateIngredientStock.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updateIngredientStock.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                const updatedIngredient = action.payload.data || action.payload;
                const index = state.ingredients.findIndex(item => item._id === updatedIngredient._id);
                if (index !== -1) {
                    state.ingredients[index] = updatedIngredient;
                }
            })
            .addCase(updateIngredientStock.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })

            // Delete
            .addCase(deleteIngredient.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteIngredient.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.ingredients = state.ingredients.filter(item => item._id !== action.payload);
            })
            .addCase(deleteIngredient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    }
});

export const { clearError, resetSuccess } = ingredientSlice.actions;

export default ingredientSlice.reducer;
