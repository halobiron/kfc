import axiosClient from './axiosClient';

const statsApi = {
    getDashboardStats(range = 'month') {
        return axiosClient.get(`/stats/dashboard?range=${range}`);
    },

    getIngredientUsageStats(params = {}) {
        const { range = 'month', ingredientId, category } = params;
        const queryParams = new URLSearchParams({ range });
        if (ingredientId) queryParams.append('ingredientId', ingredientId);
        if (category) queryParams.append('category', category);
        return axiosClient.get(`/stats/ingredient-usage?${queryParams.toString()}`);
    }
};

export default statsApi;
