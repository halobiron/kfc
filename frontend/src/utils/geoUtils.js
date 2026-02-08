import { toast } from 'react-toastify';

/**
 * Calculates distance between two coordinates (km)
 */
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

/**
 * Get current user location (Promisified)
 */
export const getCurrentLocation = () => {
    if (!navigator.geolocation) {
        toast.error("Trình duyệt không hỗ trợ Geolocation.");
        return Promise.resolve(null);
    }

    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            (err) => {
                console.error(err);
                if (err.code === err.PERMISSION_DENIED) toast.error("Bạn đã từ chối quyền truy cập vị trí.");
                else toast.error("Không thể lấy vị trí hiện tại.");
                resolve(null);
            }
        );
    });
};

/**
 * Geocode an address string to coordinates
 */
export const geocodeAddress = async (address) => {
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=vn&limit=1`);
        const data = await res.json();
        return data && data.length > 0 ? { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), displayName: data[0].display_name } : null;
    } catch (e) {
        console.error(e);
        return null;
    }
};

/**
 * Reverse geocode coordinates to address
 */
export const reverseGeocode = async (lat, lng) => {
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
        const data = await res.json();
        return data && data.display_name ? { displayName: data.display_name } : null;
    } catch (e) {
        console.error(e);
        return null;
    }
};

/**
 * Resolve a location selection value (either 'current' or 'saved-index')
 * Returns { lat, lng, address } or null
 */
export const resolveLocationFromValue = async (value, savedAddresses) => {
    if (value === 'current') {
        const loc = await getCurrentLocation();
        return loc ? { ...loc, address: 'Vị trí hiện tại' } : null;
    }

    if (typeof value === 'string' && value.startsWith('saved-')) {
        const index = parseInt(value.split('-')[1]);
        const addr = savedAddresses[index];
        if (!addr) return null;

        if (addr.latitude && addr.longitude) {
            return { lat: addr.latitude, lng: addr.longitude, address: addr.fullAddress };
        }

        // Fallback geocode
        toast.info("Đang tìm tọa độ cho địa chỉ này...");
        const geo = await geocodeAddress(addr.fullAddress);
        if (geo) return { ...geo, address: addr.fullAddress };

        toast.error("Không tìm thấy tọa độ của địa chỉ này.");
        return null;
    }
    return null;
};

/**
 * Generate standard options for location select
 */
export const getLocationOptions = (savedAddresses = []) => [
    { value: 'current', label: 'Vị trí hiện tại (GPS)', icon: 'bi bi-crosshair text-danger' },
    ...(savedAddresses.length > 0 ? [{
        label: 'Từ địa chỉ đã lưu',
        options: savedAddresses.map((addr, idx) => ({
            value: `saved-${idx}`,
            label: `${addr.label} - ${addr.fullAddress}`,
            icon: 'bi bi-house'
        }))
    }] : [])
];
