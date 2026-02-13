import axiosClient from './axiosClient';

const categoryApi = {
    getAll() {
        return axiosClient.get('/categories');
    },
    get(id) {
        return axiosClient.get(`/category/${id}`);
    },
    add(data) {
        return axiosClient.post('/category/new', data);
    },
    update(id, data) {
        return axiosClient.put(`/category/update/${id}`, data);
    },
    delete(id) {
        return axiosClient.delete(`/category/delete/${id}`);
    }
};

export default categoryApi;
