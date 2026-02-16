import axiosClient from './axiosClient';

const userApi = {
    getAll() {
        return axiosClient.get('/users');
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
