import axiosClient from './axiosClient';

const userApi = {
    getProfile: () => {
        const url = '/auth/me';
        return axiosClient.get(url);
    },
    updateProfile: (data) => {
        const url = '/users/profile/update';
        return axiosClient.put(url, data);
    },
    changePassword: (data) => {
        const url = '/users/change-password';
        return axiosClient.post(url, data);
    },
    addAddress: (data) => {
        const url = '/users/address/add';
        return axiosClient.post(url, data);
    },
    updateAddress: (index, data) => {
        const url = `/users/address/update/${index}`;
        return axiosClient.put(url, data);
    },
    deleteAddress: (index) => {
        const url = `/users/address/delete/${index}`;
        return axiosClient.delete(url);
    }
};

export default userApi;
