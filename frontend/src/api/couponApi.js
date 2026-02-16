import axiosClient from './axiosClient';

const couponApi = {
    getAll: () => {
        const url = '/coupons';
        return axiosClient.get(url);
    },
    getByCode: (code) => {
        const url = `/coupon/code/${code}`;
        return axiosClient.get(url);
    }
};

export default couponApi;
