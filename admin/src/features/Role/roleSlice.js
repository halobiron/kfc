import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import roleApi from '../../api/roleApi';
import { getErrorMessage } from '../../utils/errors';

// Get all roles
export const getAllRoles = createAsyncThunk(
    'role/getAllRoles',
    async (_, { rejectWithValue }) => {
        try {
            const data = await roleApi.getAll(); // Adjust route if needed, checking backend routes
            // Backend route was /api/v1/roles (mounted in server.js as /api/v1 and router path /)
            return data;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, 'Không thể tải danh sách vai trò'));
        }
    }
);

// Create new role
export const createRole = createAsyncThunk(
    'role/createRole',
    async (roleData, { rejectWithValue }) => {
        try {
            const data = await roleApi.add(roleData);
            return data;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, 'Không thể tạo vai trò mới'));
        }
    }
);

// Update role
export const updateRole = createAsyncThunk(
    'role/updateRole',
    async ({ id, roleData }, { rejectWithValue }) => {
        try {
            const data = await roleApi.update(id, roleData);
            return data;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, 'Không thể cập nhật vai trò'));
        }
    }
);

// Delete role
export const deleteRole = createAsyncThunk(
    'role/deleteRole',
    async (id, { rejectWithValue }) => {
        try {
            await roleApi.delete(id);
            return id;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, 'Không thể xóa vai trò'));
        }
    }
);

const initialState = {
    roles: [],
    loading: false,
    error: null,
    success: false
};

const roleSlice = createSlice({
    name: 'role',
    initialState,
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
            // Get all roles
            .addCase(getAllRoles.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllRoles.fulfilled, (state, action) => {
                state.loading = false;
                state.roles = action.payload.data;
            })
            .addCase(getAllRoles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create role
            .addCase(createRole.pending, (state) => {
                state.loading = true;
            })
            .addCase(createRole.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.roles.push(action.payload.data);
            })
            .addCase(createRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update role
            .addCase(updateRole.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateRole.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                const index = state.roles.findIndex(role => role._id === action.payload.data._id);
                if (index !== -1) {
                    state.roles[index] = action.payload.data;
                }
            })
            .addCase(updateRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete role
            .addCase(deleteRole.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteRole.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.roles = state.roles.filter(role => role._id !== action.payload);
            })
            .addCase(deleteRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearErrors, resetSuccess } = roleSlice.actions;
export default roleSlice.reducer;

// Selectors
export const selectAllRoles = (state) => state.roles.roles;
export const selectRoleLoading = (state) => state.roles.loading;
export const selectRoleError = (state) => state.roles.error;
export const selectRoleSuccess = (state) => state.roles.success;
