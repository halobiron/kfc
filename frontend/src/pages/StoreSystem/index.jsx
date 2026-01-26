import React, { useState } from 'react';
import Layout from '../../components/Layout';
import './StoreSystem.css';

const StoreSystem = () => {
    const [selectedCity, setSelectedCity] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedStore, setExpandedStore] = useState(null);

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

    const cities = [
        { id: 'all', name: 'Tất cả thành phố' },
        { id: 'hcm', name: 'TP. Hồ Chí Minh' },
        { id: 'hn', name: 'Hà Nội' },
        { id: 'dn', name: 'Đà Nẵng' },
        { id: 'hp', name: 'Hải Phòng' },
        { id: 'ct', name: 'Cần Thơ' },
    ];

    const filteredStores = stores.filter(store => {
        const matchesCity = selectedCity === 'all' || store.city === selectedCity;
        const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            store.address.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCity && matchesSearch;
    });

    const toggleStore = (id) => {
        if (expandedStore === id) {
            setExpandedStore(null);
        } else {
            setExpandedStore(id);
        }
    };

    return (
        <Layout>
            <div className="store-system-container">
                {/* Sidebar */}
                <div className="store-sidebar">
                    <div className="sidebar-header">
                        <h2 className="sidebar-title">HỆ THỐNG NHÀ HÀNG</h2>
                        <div className="search-wrapper">
                            <i className="bi bi-search search-icon"></i>
                            <input
                                type="text"
                                placeholder="Tìm theo tên hoặc địa chỉ..."
                                className="store-search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="city-select-wrapper">
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
                    </div>

                    <div className="store-list-container">
                        <div className="results-count">
                            Có <strong>{filteredStores.length}</strong> cửa hàng phù hợp
                        </div>

                        <div className="store-items">
                            {filteredStores.map(store => (
                                <div
                                    key={store.id}
                                    className={`store-item-card ${expandedStore === store.id ? 'expanded' : ''}`}
                                    onClick={() => toggleStore(store.id)}
                                >
                                    <div className="store-item-main">
                                        <div className="store-marker-icon">
                                            <i className="bi bi-geo-alt-fill"></i>
                                        </div>
                                        <div className="store-item-info">
                                            <h3 className="store-item-name">{store.name}</h3>
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

                            {filteredStores.length === 0 && (
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
        </Layout>
    );
};


export default StoreSystem;
