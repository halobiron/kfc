export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 99999;
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const getCurrentLocation = () => {
    if (!navigator.geolocation) {
        return Promise.reject(new Error("Trình duyệt không hỗ trợ Geolocation."));
    }

    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            (err) => {
                console.error(err);
                if (err.code === err.PERMISSION_DENIED) {
                    reject(new Error("Bạn đã từ chối quyền truy cập vị trí."));
                } else {
                    reject(new Error("Không thể lấy vị trí hiện tại."));
                }
            }
        );
    });
};

export const getStoresWithDistance = (lat, lng, stores = []) => {
    if (!lat || !lng) return stores.map(s => ({ ...s, distance: null }));

    return stores
        .map(store => ({
            ...store,
            distance: calculateDistance(
                lat,
                lng,
                store.latitude || store.location?.lat,
                store.longitude || store.location?.lng
            )
        }))
        .sort((a, b) => (a.distance ?? 99999) - (b.distance ?? 99999));
};
