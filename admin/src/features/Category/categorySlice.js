import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import categoryApi from '../../api/categoryApi';

export const getAllCategories = createAsyncThunk(
    'categories/getAllCategories',
    async (_, { rejectWithValue }) => {
        try {
            const data = await categoryApi.getAll();
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra khi lấy danh mục');
        }
    }
);

export const addNewCategory = createAsyncThunk(
    'categories/addNewCategory',
    async (categoryData, { rejectWithValue }) => {
        try {
            const data = await categoryApi.add(categoryData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra khi thêm danh mục');
        }
    }
);

export const updateCategory = createAsyncThunk(
    'categories/updateCategory',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const result = await categoryApi.update(id, data);
            return result;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật danh mục');
        }
    }
);

export const deleteCategory = createAsyncThunk(
    'categories/deleteCategory',
    async (id, { rejectWithValue }) => {
        try {
            await categoryApi.delete(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra khi xóa danh mục');
        }
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
            })
            .addCase(getAllCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload.data || action.payload;
            })
            .addCase(getAllCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addNewCategory.fulfilled, (state, action) => {
                // Assume backend returns the updated list or the new category
                if (Array.isArray(action.payload.data)) {
                    state.categories = action.payload.data;
                } else if (action.payload.data) {
                    state.categories.push(action.payload.data);
                }
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                // Handle update
                if (action.payload.data && !Array.isArray(action.payload.data)) {
                    const index = state.categories.findIndex(c => c._id === action.payload.data._id);
                    if (index !== -1) {
                        state.categories[index] = action.payload.data;
                    }
                }
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.categories = state.categories.filter(c => c._id !== action.payload);
            });
    },
});

export default categorySlice.reducer;
