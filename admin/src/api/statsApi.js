import axiosClient from './axiosClient';

const statsApi = {
    getDashboardStats(range = 'month') {
        return axiosClient.get(`/stats/dashboard?range=${range}`);
    }
};

export default statsApi;
