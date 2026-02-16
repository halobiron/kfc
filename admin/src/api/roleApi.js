import axiosClient from './axiosClient';

const roleApi = {
    getAll() {
        return axiosClient.get('/roles');
    },
    add(data) {
        return axiosClient.post('/roles', data);
    },
    update(id, data) {
        return axiosClient.put(`/roles/${id}`, data);
    },
    delete(id) {
        return axiosClient.delete(`/roles/${id}`);
    }
};

export default roleApi;
