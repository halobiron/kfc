import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authApi from '../../api/authApi';

// Async thunk for login
export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const data = await authApi.login({ email, password });
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Đăng nhập thất bại');
        }
    }
);

// Async thunk for loading user
export const loadUser = createAsyncThunk(
    'auth/loadUser',
    async (_, { rejectWithValue }) => {
        try {
            const data = await authApi.getMe();
            return data;
        } catch (error) {
            localStorage.removeItem('token');
            return rejectWithValue(error.response?.data?.message || 'Không thể tải thông tin người dùng');
        }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await authApi.logout();
            localStorage.removeItem('token');
        } catch (error) {
            localStorage.removeItem('token');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const changePassword = createAsyncThunk(
    'auth/changePassword',
    async (passwords, { rejectWithValue }) => {
        try {
            const data = await authApi.changePassword(passwords);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Đổi mật khẩu thất bại');
        }
    }
);

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    token: localStorage.getItem('token') || null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearErrors: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.data;
                state.token = action.payload.token;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.error = action.payload;
            })
            // Load User
            .addCase(loadUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.data;
            })
            .addCase(loadUser.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
            })
            // Logout
            .addCase(logout.pending, (state) => {
                state.loading = true;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Change Password
            .addCase(changePassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearErrors } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
