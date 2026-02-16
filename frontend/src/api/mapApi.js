import axios from 'axios';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

const mapApi = {
    geocodeAddress: async (address) => {
        try {
            const response = await axios.get(`${NOMINATIM_BASE_URL}/search`, {
                params: {
                    format: 'json',
                    q: address,
                    countrycodes: 'vn',
                    limit: 1
                }
            });
            const data = response.data;
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
