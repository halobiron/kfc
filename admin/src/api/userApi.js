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
    },
    getVipUsers(params) {
        return axiosClient.get('/users/vip/list', { params });
    },
    toggleVip(id) {
        return axiosClient.patch(`/users/${id}/vip/toggle`);
    }
};

export default userApi;
