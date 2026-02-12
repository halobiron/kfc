import axiosClient from './axiosClient';

const ingredientApi = {
    getAll() {
        return axiosClient.get('/ingredients');
    },
    get(id) {
        return axiosClient.get(`/ingredient/${id}`);
    },
    getLowStock() {
        return axiosClient.get('/ingredients/low-stock');
    },
    add(data) {
        return axiosClient.post('/ingredient/new', data);
    },
    update(id, data) {
        return axiosClient.put(`/ingredient/update/${id}`, data);
    },
    updateStock(id, data) {
        return axiosClient.post(`/ingredient/stock/${id}`, data);
    },
    delete(id) {
        return axiosClient.delete(`/ingredient/delete/${id}`);
    }
};

export default ingredientApi;
