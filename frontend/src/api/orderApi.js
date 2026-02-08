import axiosClient from './axiosClient';

const orderApi = {
    createOrder: (orderData) => {
        const url = '/order/new';
        return axiosClient.post(url, orderData);
    },
    getShippingConfig: () => {
        const url = '/config/shipping';
        return axiosClient.get(url);
    }
};

export default orderApi;
