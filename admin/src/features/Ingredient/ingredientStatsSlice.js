import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import statsApi from '../../api/statsApi';

export const getIngredientUsageStats = createAsyncThunk(
    'ingredientStats/getStats',
    async (params, { rejectWithValue }) => {
        try {
            const data = await statsApi.getIngredientUsageStats(params);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Không thể tải thống kê nguyên liệu');
        }
    }
);

const initialState = {
    stats: {
        chart: [],
        topIngredients: [],
        categoryUsage: [],
        totalQuantity: 0,
        totalDeductions: 0
    },
    loading: false,
    error: null
};

const ingredientStatsSlice = createSlice({
    name: 'ingredientStats',
    initialState,
    reducers: {
        clearErrors: (state) => { state.error = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getIngredientUsageStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getIngredientUsageStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload.data;
            })
            .addCase(getIngredientUsageStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearErrors } = ingredientStatsSlice.actions;
export default ingredientStatsSlice.reducer;