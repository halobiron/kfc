import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    isAuthenticated: !!localStorage.getItem('user'),
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload;
            state.error = null;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.error = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
            localStorage.removeItem('user');
        },
        loadUserStart: (state) => {
            state.loading = true;
        },
        loadUserSuccess: (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload;
        },
        loadUserFailure: (state) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
            localStorage.removeItem('user');
        },
        updateUserSuccess: (state, action) => {
            if (state.user) {
                state.user.user = { ...state.user.user, ...action.payload };
                localStorage.setItem('user', JSON.stringify(state.user));
            }
        },
    },
});

export const { 
    loginStart, 
    loginSuccess, 
    loginFailure, 
    logout, 
    loadUserStart, 
    loadUserSuccess, 
    loadUserFailure,
    updateUserSuccess 
} = authSlice.actions;

export default authSlice.reducer;
