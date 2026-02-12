import axiosClient from './axiosClient';

const categoryApi = {
    getAll() {
        return axiosClient.get('/categories');
    },
    get(id) {
        return axiosClient.get(`/categories/${id}`);
    },
    add(data) {
        return axiosClient.post('/categories/new', data);
    },
    update(id, data) {
        return axiosClient.put(`/categories/update/${id}`, data);
    },
    delete(id) {
        return axiosClient.delete(`/categories/delete/${id}`);
    }
};

export default categoryApi;
