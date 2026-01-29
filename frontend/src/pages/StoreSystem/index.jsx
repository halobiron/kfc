import React, { useState, useEffect } from 'react';

import './StoreSystem.css';

const stores = [
    {
        id: 1,
        name: 'KFC Nguyễn Trãi',
        address: '123 Nguyễn Trãi, Quận 1, TP.HCM',
        city: 'hcm',
        phone: '1900 1166',
        openTime: '08:00 - 22:00',
        services: ['Giao hàng', 'Tại chỗ', 'Mang đi', 'Wifi'],
        location: { lat: 10.7686, lng: 106.6832 }
    },
    {
        id: 2,
        name: 'KFC Hoàn Kiếm',
        address: '456 Hoàng Diệu, Quận Hoàn Kiếm, Hà Nội',
        city: 'hn',
        phone: '1900 1166',
        openTime: '08:00 - 22:00',
        services: ['Giao hàng', 'Tại chỗ', 'Mang đi'],
        location: { lat: 21.0285, lng: 105.8542 }
    },
    {
        id: 3,
        name: 'KFC Lê Lợi',
        address: '789 Lê Lợi, Quận 1, TP.HCM',
        city: 'hcm',
        phone: '1900 1166',
        openTime: '08:00 - 23:00',
        services: ['Giao hàng', 'Tại chỗ', 'Mang đi', 'Trẻ em'],
        location: { lat: 10.7712, lng: 106.7001 }
    },
    {
        id: 4,
        name: 'KFC Hải Phòng Center',
        address: '321 Lê Thánh Tông, Quận Ngô Quyền, Hải Phòng',
        city: 'hp',
        phone: '1900 1166',
        openTime: '08:00 - 22:00',
        services: ['Giao hàng', 'Tại chỗ', 'Mang đi'],
        location: { lat: 20.8449, lng: 106.6881 }
    },
    {
        id: 5,
        name: 'KFC Đà Nẵng',
        address: '555 Trần Phú, Quận Hải Châu, Đà Nẵng',
        city: 'dn',
        phone: '1900 1166',
        openTime: '08:00 - 22:00',
        services: ['Giao hàng', 'Tại chỗ', 'Mang đi'],
        location: { lat: 16.0544, lng: 108.2022 }
    },
    {
        id: 6,
        name: 'KFC Cần Thơ',
        address: '999 Mậu Thân, Quận Ninh Kiều, Cần Thơ',
        city: 'ct',
        phone: '1900 1166',
        openTime: '08:00 - 22:00',
        services: ['Giao hàng', 'Tại chỗ', 'Mang đi'],
        location: { lat: 10.0333, lng: 105.7833 }
    },
];

const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
};

// Haversine formula to calculate distance (in km)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
};

const StoreSystem = () => {
    const [selectedCity, setSelectedCity] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedStore, setExpandedStore] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [sortedStores, setSortedStores] = useState([]);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [locationError, setLocationError] = useState(null);
    const [isSearching, setIsSearching] = useState(false);

    const cities = [
        { id: 'all', name: 'Tất cả thành phố' },
        { id: 'hcm', name: 'TP. Hồ Chí Minh' },
        { id: 'hn', name: 'Hà Nội' },
        { id: 'dn', name: 'Đà Nẵng' },
        { id: 'hp', name: 'Hải Phòng' },
        { id: 'ct', name: 'Cần Thơ' },
    ];
    const handleFindNearest = () => {
        setLoadingLocation(true);
        setLocationError(null);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lng: longitude });
                    setLoadingLocation(false);
                    // Reset filters when searching by nearest
                    setSelectedCity('all');
                    setSearchTerm(''); // Clear text search if using GPS
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setLocationError("Không thể lấy vị trí của bạn.");
                    setLoadingLocation(false);
                }
            );
        } else {
            setLocationError("Trình duyệt không hỗ trợ Geolocation.");
            setLoadingLocation(false);
        }
    };

    const handleSearch = async (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            e.preventDefault(); // Prevent accidental form submit or page reload

            if (!searchTerm.trim()) return;

            setIsSearching(true);
            setLocationError(null);

            try {
                // Using OpenStreetMap Nominatim API (Free)
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}&countrycodes=vn&limit=1`);
                const data = await response.json();

                if (data && data.length > 0) {
                    const { lat, lon } = data[0];
                    setUserLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
                    setSelectedCity('all'); // Show all cities to find true nearest
                } else {
                    setLocationError("Không tìm thấy địa chỉ này.");
                    // Keep userLocation if it exists? Or reset? Logic says reset if searching new addy.
                    // But if fallback to text search is desired, we might want to keep it null.
                    setUserLocation(null);
                }
            } catch (error) {
                console.error("Search error:", error);
                setLocationError("Lỗi kết nối tìm kiếm.");
            } finally {
                setIsSearching(false);
            }
        }
    };

    useEffect(() => {
        let processedStores = stores.map(store => {
            let distance = null;
            if (userLocation) {
                distance = calculateDistance(
                    userLocation.lat,
                    userLocation.lng,
                    store.location.lat,
                    store.location.lng
                );
            }
            return { ...store, distance };
        });

        // Filter by City
        if (selectedCity !== 'all') {
            processedStores = processedStores.filter(store => store.city === selectedCity);
        }

        // If userLocation is NOT set, use searchTerm for local text filtering (fallback behavior)
        if (!userLocation && searchTerm) {
            const term = searchTerm.toLowerCase();
            processedStores = processedStores.filter(store =>
                store.name.toLowerCase().includes(term) ||
                store.address.toLowerCase().includes(term)
            );
        }

        // Sort: If userLocation exists, sort by distance.
        if (userLocation) {
            processedStores.sort((a, b) => a.distance - b.distance);
        }

        setSortedStores(processedStores);
    }, [userLocation, selectedCity, searchTerm]);


    const toggleStore = (id) => {
        if (expandedStore === id) {
            setExpandedStore(null);
        } else {
            setExpandedStore(id);
        }
    };

    return (
        <div className="store-system-container">
            {/* Sidebar */}
            <div className="store-sidebar">
                <div className="sidebar-header">
                    <h2 className="sidebar-title">HỆ THỐNG NHÀ HÀNG</h2>

                    <div className="search-wrapper">
                        {isSearching ? (
                            <div className="search-loading-spinner"></div>
                        ) : (
                            <i className="bi bi-search search-icon" onClick={handleSearch} style={{ cursor: 'pointer' }}></i>
                        )}
                        <input
                            type="text"
                            placeholder="Nhập địa chỉ (VD: 97 Tô Ngọc Vân)..."
                            className="store-search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                    </div>

                    <div className="d-flex align-items-center gap-2 mb-3">
                        <div className="flex-grow-1">
                            <select
                                className="form-select city-dropdown"
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                            >
                                {cities.map(city => (
                                    <option key={city.id} value={city.id}>{city.name}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            className="btn-location-neat"
                            onClick={handleFindNearest}
                            disabled={loadingLocation}
                            title="Tìm cửa hàng gần vị trí của bạn"
                        >
                            {loadingLocation ? (
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            ) : (
                                <i className="bi bi-crosshair me-1" style={{ fontSize: '1.2rem' }}></i>
                            )}
                            <span className="d-none d-sm-inline">Gần tôi</span>
                        </button>
                    </div>
                    {locationError && <div className="text-danger small mb-2 text-end">{locationError}</div>}
                </div>

                <div className="store-list-container">
                    <div className="results-count">
                        Có <strong>{sortedStores.length}</strong> cửa hàng phù hợp
                    </div>

                    <div className="store-items">
                        {sortedStores.map((store, index) => (
                            <div
                                key={store.id}
                                className={`store-item-card ${expandedStore === store.id ? 'expanded' : ''}`}
                                onClick={() => toggleStore(store.id)}
                            >
                                <div className="store-item-main">
                                    <div className="store-index-popcorn">
                                        {index + 1}
                                    </div>
                                    <div className="store-item-info">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <h3 className="store-item-name">{store.name}</h3>
                                            {store.distance !== null && (
                                                <span className="store-distance badge bg-light text-dark border">
                                                    {store.distance.toFixed(1)} km
                                                </span>
                                            )}
                                        </div>
                                        <p className="store-item-address">{store.address}</p>
                                    </div>
                                    <div className="expand-icon">
                                        <i className={`bi bi-chevron-${expandedStore === store.id ? 'up' : 'down'}`}></i>
                                    </div>
                                </div>

                                {expandedStore === store.id && (
                                    <div className="store-item-details" onClick={(e) => e.stopPropagation()}>
                                        <div className="detail-section">
                                            <h6><i className="bi bi-clock me-2"></i>Giờ hoạt động</h6>
                                            <p>{store.openTime}</p>
                                        </div>
                                        <div className="detail-section">
                                            <h6><i className="bi bi-telephone me-2"></i>Điện thoại</h6>
                                            <p>{store.phone}</p>
                                        </div>
                                        <div className="detail-section">
                                            <h6><i className="bi bi-gear me-2"></i>Dịch vụ</h6>
                                            <div className="service-icons">
                                                {store.services.map((s, idx) => (
                                                    <span key={idx} className="service-tag">{s}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="detail-actions">
                                            <button className="btn btn-outline-secondary w-100">XEM CHỈ ĐƯỜNG</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {sortedStores.length === 0 && (
                            <div className="no-results">
                                <i className="bi bi-search" style={{ fontSize: '2rem', opacity: 0.3 }}></i>
                                <p>Không tìm thấy cửa hàng nào</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Map View */}
            <div className="store-map-view">
                <iframe
                    title="KFC Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125424.47547514309!2d106.60155099309257!3d10.771804368936997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f1c06f4e1dd%3A0x19045145cd6a992!2sKFC!5e0!3m2!1svi!2s!4v1706240000000!5m2!1svi!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
        </div>
    );
};


export default StoreSystem;

