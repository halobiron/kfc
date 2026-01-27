import React, { useState, useMemo } from 'react';
import Card from '../../components/Card';
import Layout from '../../components/Layout';
import './product.css';

// Mock products data
const allProducts = [
    { id: 1, name: 'Combo Gà Rán 1 Người', price: 89000, category: 'combo', image: 'product1.png' },
    { id: 2, name: 'Burger Zinger', price: 69000, category: 'burger', image: 'product2.png' },
    { id: 3, name: 'Gà Popcorn (Vừa)', price: 38000, category: 'ga-ran', image: 'product3.png' },
    { id: 4, name: 'Gà Rán Giòn 2 Miếng', price: 54000, category: 'ga-ran', image: 'product1.png' },
    { id: 5, name: 'Burger Tôm', price: 59000, category: 'burger', image: 'product2.png' },
    { id: 6, name: 'Combo Nhóm 4-6 Người', price: 399000, category: 'combo', image: 'product1.png' },
    { id: 7, name: 'Cơm Gà Giòn Cay', price: 45000, category: 'com', image: 'product3.png' },
    { id: 8, name: 'Pepsi Lon', price: 20000, category: 'nuoc-uong', image: 'product2.png' },
    { id: 9, name: 'Khoai Tây Chiên (L)', price: 25000, category: 'mon-phu', image: 'product1.png' },
    { id: 10, name: 'Sundae Kem Dâu', price: 15000, category: 'trang-mieng', image: 'product3.png' },
];

const Product = () => {

    const categories = [
        { id: 'all', name: 'Tất cả', slug: 'all' },
        { id: 'combo', name: 'Combo', slug: 'combo' },
        { id: 'ga-ran', name: 'Gà Rán', slug: 'ga-ran' },
        { id: 'burger', name: 'Burger', slug: 'burger' },
        { id: 'com', name: 'Cơm', slug: 'com' },
        { id: 'nuoc-uong', name: 'Nước Uống', slug: 'nuoc-uong' },
        { id: 'mon-phu', name: 'Món Phụ', slug: 'mon-phu' },
        { id: 'trang-mieng', name: 'Tráng Miệng', slug: 'trang-mieng' },
    ];

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Filter products based on category and search
    const filteredProducts = useMemo(() => {
        let filtered = allProducts;

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }

        // Filter by search term
        if (searchTerm.trim()) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filtered;
    }, [selectedCategory, searchTerm]);

    return (
        <Layout>
            <div className='product-wrapper'>
                {/* Hero Banner */}
                <div className="product-hero">
                    <div className="container">
                        <h1 className="hero-title">THỰC ĐƠN</h1>
                        <div className="title-underline"></div>
                    </div>
                </div>

                <div className="container py-4">
                    {/* Search Bar */}
                    <div className="search-section mb-4">
                        <div className="search-box">
                            <i className="bi bi-search"></i>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Tìm kiếm món ăn..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button
                                    className="clear-search"
                                    onClick={() => setSearchTerm('')}
                                >
                                    <i className="bi bi-x-circle-fill"></i>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div className="category-filter mb-4">
                        <div className="category-scroll">
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory(category.id)}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="products-section">
                        {filteredProducts.length > 0 ? (
                            <>
                                <div className="results-count mb-3">
                                    Tìm thấy <strong>{filteredProducts.length}</strong> món ăn
                                </div>
                                <div className="row">
                                    {filteredProducts.map(product => (
                                        <div key={product.id} className="col-md-4 mb-4">
                                            <Card />
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="no-results">
                                <i className="bi bi-search" style={{ fontSize: '48px', color: '#ccc' }}></i>
                                <p className="mt-3">Không tìm thấy món ăn nào phù hợp</p>
                                <button
                                    className="btn btn-danger mt-2"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedCategory('all');
                                    }}
                                >
                                    Xem tất cả món
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Product;