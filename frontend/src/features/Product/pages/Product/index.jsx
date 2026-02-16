import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import Card from '../../components/ProductCard';
import useCategoryScroll from '../../hooks/useCategoryScroll';
import { getAllProducts } from '../../productSlice';
import { getAllCategories } from '../../categorySlice';
import Spinner from '../../../../components/Spinner';
import './Product.css';

const ProductHero = () => (
    <div className="product-hero">
        <div className="container">
            <h1 className="hero-title">THỰC ĐƠN</h1>
        </div>
    </div>
);

const CategoryNav = ({ categories, activeCategory, scrollToCategory }) => (
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
);

const CategorySection = ({ category, products }) => (
    <div id={category.slug} className="category-section">
        <h2 className="category-title">{category.name}</h2>
        <div className="row">
            {products.map(product => (
                <div key={product._id} className="col-md-4 product-card-wrapper">
                    <Card product={product} />
                </div>
            ))}
        </div>
    </div>
);

const ProductLoading = () => (
    <div className="product-loading">
        <Spinner variant={null} className="kfc-spinner" />
    </div>
);

const Product = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const { products, loading } = useSelector((state) => state.products);
    const { categories } = useSelector((state) => state.categories);

    const { activeCategory, scrollToCategory } = useCategoryScroll(
        categories,
        products,
        loading,
        searchParams
    );

    useEffect(() => {
        dispatch(getAllProducts());
        dispatch(getAllCategories());
    }, [dispatch]);

    return (
        <>
            <ProductHero />
            <CategoryNav
                categories={categories}
                activeCategory={activeCategory}
                scrollToCategory={scrollToCategory}
            />

            <div className="container kfc-container no-padding-y">
                {loading ? (
                    <ProductLoading />
                ) : (
                    categories.map(category => {
                        const categoryProducts = products?.filter(p => p.category === category.slug) || [];
                        if (categoryProducts.length === 0) return null;

                        return (
                            <CategorySection
                                key={category._id}
                                category={category}
                                products={categoryProducts}
                            />
                        );
                    })
                )}
            </div>
        </>
    );
};

export default Product;
