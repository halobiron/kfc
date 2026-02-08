export const authMiddleware = store => next => action => {
    const result = next(action);

    if (action.type?.startsWith('auth/')) {
        const authState = store.getState().auth;

        if (action.type === 'auth/loginUser/fulfilled' ||
            action.type === 'auth/registerUser/fulfilled' ||
            action.type === 'auth/loginGoogleUser/fulfilled' ||
            action.type === 'auth/updateUserSuccess') {
            if (authState.user) {
                localStorage.setItem('user', JSON.stringify(authState.user));
            }
        } else if (action.type === 'auth/logout' ||
            action.type === 'auth/loadUserFailure'
        ) {
            localStorage.removeItem('user');
        }
    }

    return result;
};
