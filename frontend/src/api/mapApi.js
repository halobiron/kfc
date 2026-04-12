import axios from 'axios';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

const mapApi = {
    geocodeAddress: async (address) => {
        try {
            const fetchGeocoding = async (searchQuery) => {
                const response = await axios.get(`${NOMINATIM_BASE_URL}/search`, {
                    params: {
                        format: 'json',
                        q: searchQuery,
                        countrycodes: 'vn',
                        limit: 1
                    }
                });
                return response.data;
            };

            let data = await fetchGeocoding(address);

            // Fallback: Bản đồ OpenStreetMap (Nominatim) thường không tìm ra nếu có thêm số nhà/tên đường cụ thể ở định dạng lạ.
            // Nếu không tìm thấy, thử cắt bỏ phần số nhà/đường phố (phần đầu tiên trước dấu phẩy) để tìm Phường/Xã/Quận.
            if ((!data || data.length === 0) && address.includes(',')) {
                const parts = address.split(',');
                if (parts.length > 1) {
                    const fallbackAddress = parts.slice(1).join(',').trim();
                    data = await fetchGeocoding(fallbackAddress);
                }
            }

            return data && data.length > 0 ? { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), displayName: data[0].display_name } : null;
        } catch (error) {
            console.error("Geocode error:", error);
            throw error;
        }
    },

    reverseGeocode: async (lat, lng) => {
        try {
            const response = await axios.get(`${NOMINATIM_BASE_URL}/reverse`, {
                params: {
                    format: 'json',
                    lat: lat,
                    lon: lng,
                    zoom: 18,
                    addressdetails: 1
                }
            });
            const data = response.data;
            return data && data.display_name ? { displayName: data.display_name } : null;
        } catch (error) {
            console.error("Reverse geocode error:", error);
            throw error;
        }
    }
};

export default mapApi;
