import axiosClient from './axiosClient';

const couponApi = {
    getAll(params) {
        return axiosClient.get('/coupons', { params });
    },
    getByCode(code) {
        return axiosClient.get(`/coupon/code/${code}`);
    },
    add(data) {
        return axiosClient.post('/coupon/new', data);
    },
    update(id, data) {
        return axiosClient.put(`/coupon/update/${id}`, data);
    },
    delete(id) {
        return axiosClient.delete(`/coupon/delete/${id}`);
    }
};

export default couponApi;
