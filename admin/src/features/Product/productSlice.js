import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productApi from '../../api/productApi';

// Helper để xử lý lỗi chung
const handleAsyncError = (error, rejectWithValue) => {
  return rejectWithValue(error.response?.data?.message || error.message || 'Có lỗi xảy ra');
};

export const getAllProducts = createAsyncThunk(
  'products/getAllProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productApi.getAll();
      return response;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  }
);

export const getProductById = createAsyncThunk(
  'products/getProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await productApi.get(id);
      return response;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  }
);

export const addNewProduct = createAsyncThunk(
  'products/addNewProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await productApi.add(productData);
      return response; 
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await productApi.update(id, data);
      return response; 
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await productApi.delete(id);
      return id;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    loading: false,
    error: null,
    currentProduct: null,
    success: false, // Flag để nhận biết thao tác thành công
  },
  reducers: {
    resetStatus: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // GET ALL
      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data || action.payload || [];
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET BY ID
      .addCase(getProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload.data || action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD NEW
      .addCase(addNewProduct.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(addNewProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const newProduct = action.payload.data || action.payload;
        if (newProduct) {
             state.products.push(newProduct);
        }
      })
      .addCase(addNewProduct.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const updatedProduct = action.payload.data || action.payload;
        
        // Cập nhật item trong list
        const index = state.products.findIndex(p => p._id === updatedProduct._id);
        if (index !== -1) {
          state.products[index] = updatedProduct;
        }
        
        // Cập nhật currentProduct nếu đang xem chi tiết dòng đó
        if (state.currentProduct && state.currentProduct._id === updatedProduct._id) {
            state.currentProduct = updatedProduct;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(product => product._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetStatus } = productSlice.actions;
export default productSlice.reducer;
