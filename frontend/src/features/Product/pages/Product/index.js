import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import Card from '../../components/ProductCard';

import './product.css';
import AnimatedPage from '../../../../components/AnimatedPage';
import { getAllProducts } from '../../productSlice';
import { getAllCategories } from '../../categorySlice';

const Product = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const { products, loading } = useSelector((state) => state.products);
    const { categories } = useSelector((state) => state.categories);

    // Track active category for sticky nav highlighting
    const [activeCategory, setActiveCategory] = useState(null);

    useEffect(() => {
        dispatch(getAllProducts());
        dispatch(getAllCategories());
    }, [dispatch]);

    // Scroll to section based on URL or click
    const scrollToCategory = (slug) => {
        const element = document.getElementById(slug);
        if (element) {
            // Offset for sticky header (adjust 150px as needed based on header height)
            const headerOffset = 180;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    // Handle URL param for initial scroll
    useEffect(() => {
        if (!loading && categories.length > 0) {
            const categoryParam = searchParams.get('category');
            if (categoryParam) {
                // Small timeout to ensure DOM is ready
                setTimeout(() => scrollToCategory(categoryParam), 100);
            }
        }
    }, [searchParams, loading, categories]);

    // Intersection Observer to update active category on scroll
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-180px 0px -70% 0px', // Adjust to trigger when section is near top
            threshold: 0
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveCategory(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        categories.forEach((category) => {
            const element = document.getElementById(category.slug);
            if (element) {
                observer.observe(element);
            }
        });

        return () => {
            if (observer) observer.disconnect();
        };
    }, [categories, products]); // Re-run when content loads

    // Helper to get products for a category
    const getProductsByCategory = (categorySlug) => {
        if (!products) return [];
        return products.filter(product => product.category === categorySlug);
    };

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

                {/* Sticky Category Navigation (Matching KFC Vietnam structure) */}
                <div className="category-wrapper">
                    <div className="container">
                        <div className="category-nav-scroll">
                            <ul>
                                {categories.map(category => (
                                    <li key={category._id}>
                                        <a
                                            href={`#${category.slug}`}
                                            className={activeCategory === category.slug ? 'active' : ''}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                scrollToCategory(category.slug);
                                            }}
                                        >
                                            {category.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="container py-4">
                    {/* Products Sections */}

                    <div className="products-section">
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-danger" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <>
                                {categories.map(category => {
                                    const categoryProducts = getProductsByCategory(category.slug);
                                    if (categoryProducts.length === 0) return null;

                                    return (
                                        <div key={category._id} id={category.slug} className="category-section mb-5">
                                            <h2 className="category-title mb-4">{category.name}</h2>
                                            <div className="row">
                                                {categoryProducts.map(product => (
                                                    <div key={product._id} className="col-md-4 mb-4">
                                                        <Card product={product} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
}

export default Product;
