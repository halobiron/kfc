import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderApi from '../../api/orderApi';

export const getAllOrders = createAsyncThunk(
  'orders/getAllOrders',
  async () => {
    const data = await orderApi.getAll();
    return data;
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ id, status, note }) => {
    const data = await orderApi.updateStatus(id, { status, note });
    return data;
  }
);

export const deleteOrder = createAsyncThunk(
  'orders/deleteOrder',
  async (id) => {
    const data = await orderApi.delete(id);
    return { id, message: data?.message }; // Return id to remove from state
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
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter(order => order._id !== action.payload.id);
      });
  }
});

export default orderSlice.reducer;
