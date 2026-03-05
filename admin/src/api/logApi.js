import axiosClient from './axiosClient';

const logApi = {
    getAll: (params) => {
        const url = '/logs';
        return axiosClient.get(url, { params });
    }
};

export default logApi;
