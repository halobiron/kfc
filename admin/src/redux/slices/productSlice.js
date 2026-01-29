import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import product1 from '@shared-assets/img/product1.png';
import product2 from '@shared-assets/img/product2.png';
import product3 from '@shared-assets/img/product3.png';

// Mock data
const mockProducts = {
  success: true,
  data: [
    {
      _id: 'P1001',
      title: 'Gà Rán Giòn Cay',
      description: 'Gà rán giòn tan với lớp vỏ cay nồng đặc trưng, ướp theo công thức bí mật 11 loại gia vị',
      price: 45000,
      stock: 25,
      category: 'Gà Rán',
      image: product1
    },
    {
      _id: 'P1002',
      title: 'Gà Rán Truyền Thống',
      description: 'Gà rán giòn rụm với hương vị truyền thống, được yêu thích nhất tại KFC',
      price: 42000,
      stock: 30,
      category: 'Gà Rán',
      image: product2
    },
    {
      _id: 'P1003',
      title: 'Burger Zinger',
      description: 'Burger gà giòn cay đặc biệt với rau xà lách tươi, sốt mayonnaise đậm đà',
      price: 52000,
      stock: 18,
      category: 'Burger',
      image: product3
    }
  ]
};

// Async Thunks
export const getAllProducts = createAsyncThunk(
  'products/getAllProducts',
  async () => {
    const response = await api.get('/products');
    return response.data;
  }
);

export const getAllProductsMock = createAsyncThunk(
  'products/getAllProductsMock',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockProducts;
  }
);

export const getProductById = createAsyncThunk(
  'products/getProductById',
  async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockProducts.data.find(p => p._id === id);
  }
);

export const addNewProduct = createAsyncThunk(
  'products/addNewProduct',
  async (productData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ...productData, _id: `P${Date.now()}` };
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, data }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    return { id, ...data };
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    loading: false,
    error: null,
    currentProduct: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getAllProductsMock.fulfilled, (state, action) => {
        state.products = action.payload;
      });
  },
});

export default productSlice.reducer;
