import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderApi from '../../api/orderApi';
import { toast } from 'react-toastify';

export const getAllOrders = createAsyncThunk(
  'orders/getAllOrders',
  async (_, { rejectWithValue }) => {
    try {
      const data = await orderApi.getAll();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra khi lấy danh sách đơn hàng');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ id, status, note }, { rejectWithValue }) => {
    try {
      const data = await orderApi.updateStatus(id, { status, note });
      toast.success('Cập nhật trạng thái đơn hàng thành công!');
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cập nhật trạng thái thất bại');
      return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật đơn hàng');
    }
  }
);

export const deleteOrder = createAsyncThunk(
  'orders/deleteOrder',
  async (id, { rejectWithValue }) => {
    try {
      await orderApi.delete(id);
      toast.success('Xóa đơn hàng thành công!');
      return { id };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Xóa đơn hàng thất bại');
      return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra khi xóa đơn hàng');
    }
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
      // Get all orders
      .addCase(getAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.data || action.payload;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        // Provide optimistic update if data returned includes updated order
        if (action.payload.data) {
          const index = state.orders.findIndex(o => o._id === action.payload.data._id);
          if (index !== -1) {
            state.orders[index] = action.payload.data;
          }
        } else if (action.payload) {
             // Fallback if data structure is different
             const index = state.orders.findIndex(o => o._id === action.payload._id);
             if (index !== -1) {
               state.orders[index] = action.payload;
             }
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete order
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter(order => order._id !== action.payload.id);
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default orderSlice.reducer;
