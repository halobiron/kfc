import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const getDashboardStats = createAsyncThunk(
    'stats/getDashboardStats',
    async (range = 'month', { rejectWithValue }) => {
        try {
            const response = await api.get(`/stats/dashboard?range=${range}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Không thể tải thống kê');
        }
    }
);

const initialState = {
    stats: {
        revenue: 0,
        orders: 0,
        customers: 0,
        avgOrderValue: 0,
        chart: [],
        topProducts: [],
        categoryStats: []
    },
    loading: false,
    error: null
};

const statsSlice = createSlice({
    name: 'stats',
    initialState,
    reducers: {
        clearErrors: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getDashboardStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getDashboardStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload.data;
            })
            .addCase(getDashboardStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearErrors } = statsSlice.actions;
export default statsSlice.reducer;
