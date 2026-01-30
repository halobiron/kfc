import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Card from '../../components/Card';

import './product.css';
import { categories } from '../../data/products';
import AnimatedPage from '../../components/AnimatedPage';
import { getAllProducts } from '../../redux/slices/productSlice';

const Product = () => {
    const dispatch = useDispatch();
    const { products, loading } = useSelector((state) => state.products);

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(getAllProducts());
    }, [dispatch]);

    // Filter products based on category and search
    const filteredProducts = useMemo(() => {
        let filtered = products;

        // Filter by category
        // Note: Backend might return 'category' field differently (e.g. capitalized), we might need to normalize
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }

        // Filter by search term
        if (searchTerm.trim()) {
            filtered = filtered.filter(product =>
                product.title && product.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filtered;
    }, [selectedCategory, searchTerm, products]);

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
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-danger" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <>
                                <div className="results-count mb-3">
                                    Tìm thấy <strong>{filteredProducts.length}</strong> món ăn
                                </div>
                                <div className="row">
                                    {filteredProducts.map(product => (
                                        <div key={product._id} className="col-md-4 mb-4">
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
