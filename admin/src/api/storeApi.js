import axiosClient from './axiosClient';

const storeApi = {
    getAll() {
        return axiosClient.get('/stores');
    },
    get(id) {
        return axiosClient.get(`/store/${id}`);
    },
    add(data) {
        return axiosClient.post('/store/new', data);
    },
    update(id, data) {
        return axiosClient.put(`/store/update/${id}`, data);
    },
    delete(id) {
        return axiosClient.delete(`/store/delete/${id}`);
    }
};

export default storeApi;
