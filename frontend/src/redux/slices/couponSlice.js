import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

// Async Thunks
export const getAllCoupons = createAsyncThunk(
    'coupons/getAllCoupons',
    async () => {
        const response = await axiosClient.get('/coupons');
        return response.data.data;
    }
);

export const getCouponByCode = createAsyncThunk(
    'coupons/getCouponByCode',
    async (code) => {
        const response = await axiosClient.get(`/coupon/code/${code}`);
        return response.data.data;
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
                state.error = action.error.message;
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
                state.error = action.error.message;
            });
    },
});

export const { clearSelectedCoupon } = couponSlice.actions;
export default couponSlice.reducer;
