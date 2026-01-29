import React, { useState, useMemo } from 'react';
import Card from '../../components/Card';

import './product.css';
import { allProducts, categories } from '../../data/products';
import AnimatedPage from '../../components/AnimatedPage';

const Product = () => {


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
        <AnimatedPage>
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
                                            <Card product={product} />
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
        </AnimatedPage>
    );
}

export default Product;