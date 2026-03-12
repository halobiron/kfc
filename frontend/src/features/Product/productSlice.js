import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productApi from '../../api/productApi';

// Async Thunks
export const getAllProducts = createAsyncThunk(
    'products/getAllProducts',
    async (params) => {
        const response = await productApi.getAll(params);
        return response; // Trả về toàn bộ response bao gồm cả pagination info
    }
);

export const getProductById = createAsyncThunk(
    'products/getProductById',
    async (id) => {
        const response = await productApi.getById(id);
        return response.data;
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState: {
        products: [],
        productsCount: 0,
        resPerPage: 12,
        currentPage: 1,
        loading: false,
        error: null,
        currentProduct: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.data || [];
                state.productsCount = action.payload.productsCount || 0;
                state.resPerPage = action.payload.resPerPage || 12;
                state.currentPage = action.payload.page || 1;
            })
            .addCase(getAllProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getProductById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProductById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentProduct = action.payload;
            })
            .addCase(getProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

// Selectors
export const selectAllProducts = (state) => state.products.products;
export const selectProductsCount = (state) => state.products.productsCount;
export const selectResPerPage = (state) => state.products.resPerPage;
export const selectCurrentPage = (state) => state.products.currentPage;
export const selectProductLoading = (state) => state.products.loading;
export const selectProductError = (state) => state.products.error;
export const selectCurrentProduct = (state) => state.products.currentProduct;

export default productSlice.reducer;
