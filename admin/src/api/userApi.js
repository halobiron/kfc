import axiosClient from './axiosClient';

const userApi = {
    getAll(params) {
        return axiosClient.get('/users', { params });
    },
    get(id) {
        return axiosClient.get(`/users/${id}`);
    },
    add(data) {
        return axiosClient.post('/users/new', data);
    },
    update(id, data) {
        return axiosClient.put(`/users/update/${id}`, data);
    },
    delete(id) {
        return axiosClient.delete(`/users/delete/${id}`);
    }
};

export default userApi;
