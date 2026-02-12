import axiosClient from './axiosClient';

const authApi = {
    login(data) {
        return axiosClient.post('/auth/login', data);
    },
    getMe() {
        return axiosClient.get('/auth/me');
    },
    logout() {
        return axiosClient.post('/auth/logout');
    },
    changePassword(data) {
        return axiosClient.post('/users/change-password', data);
    }
};

export default authApi;
