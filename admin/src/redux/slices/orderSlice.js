import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const getAllOrders = createAsyncThunk(
  'orders/getAllOrders',
  async () => {
    const response = await api.get('/orders');
    return response.data;
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ id, status }) => {
    const response = await api.put(`/order/update/${id}`, { status });
    return response.data;
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
        .addCase(getAllOrders.pending, (state) => {
            state.loading = true;
        })
        .addCase(getAllOrders.fulfilled, (state, action) => {
            state.loading = false;
            state.orders = action.payload.data || action.payload;
        })
        .addCase(getAllOrders.rejected, (state, action) => {
             state.loading = false;
             state.error = action.error.message;
        })
        .addCase(updateOrderStatus.fulfilled, (state, action) => {
           // Provide optimistic update if data returned includes updated order
           if (action.payload.data) {
               const index = state.orders.findIndex(o => o._id === action.payload.data._id);
               if (index !== -1) {
                   state.orders[index] = action.payload.data;
               }
           }
        });
  }
});

export default orderSlice.reducer;
