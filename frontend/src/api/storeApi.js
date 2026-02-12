import axiosClient from './axiosClient';

const storeApi = {
    getAll: () => {
        const url = '/stores';
        return axiosClient.get(url);
    },
    getById: (id) => {
        const url = `/store/${id}`;
        return axiosClient.get(url);
    }
};

export default storeApi;
