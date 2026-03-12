import axiosClient from './axiosClient';

const logApi = {
    createGPSLog: (data) => {
        const url = '/logs/gps';
        return axiosClient.post(url, data);
    },
};

export default logApi;