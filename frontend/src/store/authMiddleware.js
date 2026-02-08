import {
    loginUser,
    registerUser,
    loginGoogleUser,
    logout,
    loadUserFailure,
    updateUserSuccess
} from '../features/Auth/authSlice';

export const authMiddleware = store => next => action => {
    const result = next(action);

    if (
        loginUser.fulfilled.match(action) ||
        registerUser.fulfilled.match(action) ||
        loginGoogleUser.fulfilled.match(action) ||
        updateUserSuccess.match(action)
    ) {
        const authState = store.getState().auth;
        if (authState.user) {
            localStorage.setItem('user', JSON.stringify(authState.user));
        }
    } else if (
        logout.match(action) ||
        loadUserFailure.match(action)
    ) {
        localStorage.removeItem('user');
    }

    return result;
};
