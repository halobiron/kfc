import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import categoryApi from '../../api/categoryApi';

// Thêm danh mục
export const addCategory = createAsyncThunk(
    'categories/addCategory',
    async (categoryData, { rejectWithValue }) => {
        try {
            const response = await categoryApi.add(categoryData);
            return response.data; // Giả sử API trả về { success: true, data: { ...object } }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra khi thêm danh mục');
        }
    }
);

// Lấy tất cả danh mục
export const getAllCategories = createAsyncThunk(
    'categories/getAllCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await categoryApi.getAll();
            return response.data; // Giả sử trả về mảng danh mục
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Không thể tải danh sách danh mục');
        }
    }
);

// Cập nhật danh mục
export const updateCategory = createAsyncThunk(
    'categories/updateCategory',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await categoryApi.update(id, data);
            return response.data; // Trả về object đã update
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật');
        }
    }
);

// Xóa danh mục
export const deleteCategory = createAsyncThunk(
    'categories/deleteCategory',
    async (id, { rejectWithValue }) => {
        try {
            await categoryApi.delete(id);
            return id; // Trả về id để lọc khỏi state locally
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra khi xóa');
        }
    }
);

const categorySlice = createSlice({
    name: 'categories',
    initialState: {
        categories: [],
        loading: false,
        error: null,
        success: false, // Thêm flag để báo hiệu thao tác thành công (dùng cho useEffect đóng modal)
    },
    reducers: {
        // Action đồng bộ để reset lỗi hoặc trạng thái thành công
        clearState: (state) => {
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // --- GET ALL CASES ---
            .addCase(getAllCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload || []; 
            })
            
            // --- ADD CASES ---
            .addCase(addCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                // Thêm vào đầu hoặc cuối danh sách tùy logic UI
                state.categories.push(action.payload);
            })

            // --- UPDATE CASES ---
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                const index = state.categories.findIndex(c => c._id === action.payload._id);
                if (index !== -1) {
                    state.categories[index] = action.payload;
                }
            })

            // --- DELETE CASES ---
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.categories = state.categories.filter(c => c._id !== action.payload);
            })

            // --- GENERIC MATCHERS (Xử lý chung cho loading và error) ---
            .addMatcher(
                (action) => action.type.startsWith('categories/') && action.type.endsWith('/pending'),
                (state) => {
                    state.loading = true;
                    state.error = null;
                    state.success = false;
                }
            )
            .addMatcher(
                (action) => action.type.startsWith('categories/') && action.type.endsWith('/rejected'),
                (state, action) => {
                    state.loading = false;
                    // Lấy payload từ rejectWithValue, nếu không có thì lấy message mặc định
                    state.error = action.payload || action.error.message;
                }
            );
    },
});

export const { clearState } = categorySlice.actions;
export default categorySlice.reducer;
