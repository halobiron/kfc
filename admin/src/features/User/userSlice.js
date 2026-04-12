import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userApi from '../../api/userApi';
import { toast } from 'react-toastify';

// Helper để lấy error message chuẩn
const getErrorMessage = (error) => {
    return error.response?.data?.message || error.message || 'Đã có lỗi xảy ra';
};

export const getAllUsers = createAsyncThunk(
    'users/getAllUsers',
    async (params, { rejectWithValue }) => {
        try {
            const response = await userApi.getAll(params);
            return response; 
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

export const createUser = createAsyncThunk(
    'users/createUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await userApi.add(userData);
            toast.success('Thêm người dùng thành công!');
            return response.user || response.data || response; 
        } catch (error) {
            const msg = getErrorMessage(error);
            toast.error(msg);
            return rejectWithValue(msg);
        }
    }
);

export const updateUser = createAsyncThunk(
    'users/updateUser',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await userApi.update(id, data);
            toast.success('Cập nhật người dùng thành công!');
            // Quan trọng: Trả về response chứa user mới để cập nhật UI
            return response.user || response.data || response;
        } catch (error) {
            const msg = getErrorMessage(error);
            toast.error(msg);
            return rejectWithValue(msg);
        }
    }
);

export const deleteUser = createAsyncThunk(
    'users/deleteUser',
    async (id, { rejectWithValue }) => {
        try {
            await userApi.delete(id);
            toast.success('Xóa người dùng thành công!');
            return id; // Trả về ID để filter xóa khỏi list
        } catch (error) {
            const msg = getErrorMessage(error);
            toast.error(msg);
            return rejectWithValue(msg);
        }
    }
);

export const toggleUserVip = createAsyncThunk(
    'users/toggleUserVip',
    async (id, { rejectWithValue }) => {
        try {
            const response = await userApi.toggleVip(id);
            const user = response.data.data; // Backend trả về { status, message, data: user }
            const message = user?.isVip ? 'Đã gán VIP!' : 'Đã thu hồi VIP!';
            toast.success(message);
            return user; // Trả về user đã cập nhật
        } catch (error) {
            const msg = getErrorMessage(error);
            toast.error(msg);
            return rejectWithValue(msg);
        }
    }
);

const userSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        usersCount: 0,
        resPerPage: 20,
        currentPage: 1,
        loading: false,
        error: null,
    },
    reducers: {
        clearUserErrors: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // --- Get All ---
            .addCase(getAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload?.data || action.payload || [];
                state.usersCount = action.payload?.usersCount || 0;
                state.resPerPage = action.payload?.resPerPage || 20;
                state.currentPage = action.payload?.page || 1;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // --- Create ---
            .addCase(createUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
            })
            .addCase(createUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // --- Update ---
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.users.findIndex(u => u._id === action.payload._id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // --- Delete ---
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = state.users.filter(u => u._id !== action.payload);
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // --- Toggle VIP ---
            .addCase(toggleUserVip.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(toggleUserVip.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.users.findIndex(u => u._id === action.payload._id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            })
            .addCase(toggleUserVip.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Selectors
export const selectAllUsers = (state) => state.users.users;
export const selectUserLoading = (state) => state.users.loading;
export const selectUserError = (state) => state.users.error;

export const { clearUserErrors } = userSlice.actions;
export default userSlice.reducer;
