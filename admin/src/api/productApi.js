import axiosClient from './axiosClient';

const productApi = {
    getAll(params) {
        return axiosClient.get('/products', { params });
    },
    get(id) {
        return axiosClient.get(`/product/${id}`);
    },
    add(data) {
        return axiosClient.post('/product/new', data);
    },
    update(id, data) {
        return axiosClient.put(`/product/update/${id}`, data);
    },
    delete(id) {
        return axiosClient.delete(`/product/delete/${id}`);
    }
};

export default productApi;
