import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import couponApi from '../../api/couponApi';

// Async Thunks
export const getAllCoupons = createAsyncThunk(
    'coupons/getAllCoupons',
    async (_, { rejectWithValue }) => {
        try {
            const response = await couponApi.getAll();
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Không thể tải danh sách mã giảm giá');
        }
    }
);

export const getCouponByCode = createAsyncThunk(
    'coupons/getCouponByCode',
    async (code, { rejectWithValue }) => {
        try {
            const response = await couponApi.getByCode(code);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Mã giảm giá không hợp lệ hoặc đã hết hạn');
        }
    }
);

const couponSlice = createSlice({
    name: 'coupons',
    initialState: {
        coupons: [],
        selectedCoupon: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearSelectedCoupon: (state) => {
            state.selectedCoupon = null;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllCoupons.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllCoupons.fulfilled, (state, action) => {
                state.loading = false;
                state.coupons = action.payload || [];
            })
            .addCase(getAllCoupons.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            .addCase(getCouponByCode.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCouponByCode.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedCoupon = action.payload;
            })
            .addCase(getCouponByCode.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export const { clearSelectedCoupon, clearError } = couponSlice.actions;

// Selectors
export const selectCoupons = (state) => state.coupons.coupons;
export const selectSelectedCoupon = (state) => state.coupons.selectedCoupon;
export const selectCouponLoading = (state) => state.coupons.loading;
export const selectCouponError = (state) => state.coupons.error;

export default couponSlice.reducer;
