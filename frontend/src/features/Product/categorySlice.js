import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import categoryApi from '../../api/categoryApi';

// Async Thunks
export const getAllCategories = createAsyncThunk(
    'categories/getAllCategories',
    async () => {
        const response = await categoryApi.getAll();
        return response.data;
    }
);

const categorySlice = createSlice({
    name: 'categories',
    initialState: {
        categories: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload || [];
            })
            .addCase(getAllCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

// Selectors
export const selectAllCategories = (state) => state.categories.categories;
export const selectCategoryLoading = (state) => state.categories.loading;
export const selectCategoryError = (state) => state.categories.error;

export default categorySlice.reducer;
