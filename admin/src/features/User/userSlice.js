import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userApi from '../../api/userApi';
import { toast } from 'react-toastify';

export const getAllUsers = createAsyncThunk(
    'users/getAllUsers',
    async (_, { rejectWithValue }) => {
        try {
            const data = await userApi.getAll();
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra khi lấy danh sách người dùng');
        }
    }
);

export const createUser = createAsyncThunk(
    'users/createUser',
    async (userData, { rejectWithValue }) => {
        try {
            const data = await userApi.add(userData);
            toast.success('Thêm người dùng thành công!');
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Thêm người dùng thất bại');
            return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra khi thêm người dùng');
        }
    }
);

export const updateUser = createAsyncThunk(
    'users/updateUser',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const result = await userApi.update(id, data);
            toast.success('Cập nhật người dùng thành công!');
            return result;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Cập nhật người dùng thất bại');
            return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật người dùng');
        }
    }
);

export const deleteUser = createAsyncThunk(
    'users/deleteUser',
    async (id, { rejectWithValue }) => {
        try {
            await userApi.delete(id);
            toast.success('Xóa người dùng thành công!');
            return id;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Xóa người dùng thất bại');
            return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra khi xóa người dùng');
        }
    }
);

const userSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
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
            // Get All Users
            .addCase(getAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.users || action.payload.data || [];
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create User
            .addCase(createUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.loading = false;
                // Assuming payload contains the created user
                const newUser = action.payload.user || action.payload.data;
                if (newUser) {
                    state.users.push(newUser);
                }
            })
            .addCase(createUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update User
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                // Assuming payload contains the updated user
                const updatedUser = action.payload.user || action.payload.data;
                if (updatedUser) {
                    const index = state.users.findIndex(u => u._id === updatedUser._id);
                    if (index !== -1) {
                        state.users[index] = updatedUser;
                    }
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete User
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
            });
    },
});

export const { clearUserErrors } = userSlice.actions;
export default userSlice.reducer;
