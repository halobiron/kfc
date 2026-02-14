import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import couponApi from '../../api/couponApi';

// Async Thunks
export const getAllCoupons = createAsyncThunk(
    'coupons/getAllCoupons',
    async (_, { rejectWithValue }) => {
        try {
            const data = await couponApi.getAll();
            return data.data; // data.data contains the array of coupons
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Lỗi khi tải danh sách khuyến mãi');
        }
    }
);

export const createCoupon = createAsyncThunk(
    'coupons/createCoupon',
    async (couponData, { rejectWithValue }) => {
        try {
            const data = await couponApi.add(couponData);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Lỗi khi tạo khuyến mãi');
        }
    }
);

export const updateCoupon = createAsyncThunk(
    'coupons/updateCoupon',
    async ({ id, couponData }, { rejectWithValue }) => {
        try {
            const data = await couponApi.update(id, couponData);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Lỗi khi cập nhật khuyến mãi');
        }
    }
);

export const deleteCoupon = createAsyncThunk(
    'coupons/deleteCoupon',
    async (id, { rejectWithValue }) => {
        try {
            await couponApi.delete(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Lỗi khi xóa khuyến mãi');
        }
    }
);

const couponSlice = createSlice({
    name: 'coupons',
    initialState: {
        coupons: [],
        loading: false,
        error: null,
        success: false
    },
    reducers: {
        clearErrors: (state) => {
            state.error = null;
        },
        resetSuccess: (state) => {
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get All Coupons
            .addCase(getAllCoupons.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllCoupons.fulfilled, (state, action) => {
                state.loading = false;
                state.coupons = action.payload;
            })
            .addCase(getAllCoupons.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create Coupon
            .addCase(createCoupon.pending, (state) => {
                state.loading = true;
            })
            .addCase(createCoupon.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.coupons.push(action.payload);
            })
            .addCase(createCoupon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Coupon
            .addCase(updateCoupon.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateCoupon.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                const index = state.coupons.findIndex((coupon) => coupon._id === action.payload._id);
                if (index !== -1) {
                    state.coupons[index] = action.payload;
                }
            })
            .addCase(updateCoupon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete Coupon
            .addCase(deleteCoupon.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteCoupon.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                const index = state.coupons.findIndex(coupon => coupon._id === action.payload);
                if (index !== -1) {
                    state.coupons.splice(index, 1);
                }
            })
            .addCase(deleteCoupon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearErrors, resetSuccess } = couponSlice.actions;
export default couponSlice.reducer;
