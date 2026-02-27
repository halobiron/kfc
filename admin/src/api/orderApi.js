import axiosClient from './axiosClient';

const orderApi = {
    getAll(params) {
        return axiosClient.get('/orders', { params });
    },
    get(id) {
        return axiosClient.get(`/order/${id}`);
    },
    updateStatus(id, data) {
        return axiosClient.put(`/order/update/${id}`, data);
    },
    delete(id) {
        return axiosClient.delete(`/order/delete/${id}`);
    }
};

export default orderApi;
