import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './ProductDetail.css';
import { formatCurrency } from '../../../../utils/formatters';
import QuantityPicker from '../../../../components/QuantityPicker/QuantityPicker';
import Button from '../../../../components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../../Cart/cartSlice';
import { getProductById } from '../../productSlice';
import { getAllCategories } from '../../categorySlice';
import { useParams, Link } from 'react-router-dom';

import Card from '../../../../components/Card';

const ProductDetail = () => {
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);
    const dispatch = useDispatch();
    const { currentProduct: product, loading } = useSelector((state) => state.products);
    const { categories } = useSelector((state) => state.categories);

    useEffect(() => {
        dispatch(getAllCategories());
    }, [dispatch]);

    useEffect(() => {
        if (id) {
            dispatch(getProductById(id));
        }
    }, [dispatch, id]);

    const handleIncrease = () => setQuantity(prev => prev + 1);
    const handleDecrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    const handleAddToCart = () => {
        if (!product) return;
        dispatch(addToCart({ ...product, quantity }));
        toast.success(`Đã thêm ${quantity} ${product.title} vào giỏ hàng!`);
    };

    if (loading) {
        return (
            <div>
                <div className="spinner-border text-danger" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!product) {
        return <div>Không tìm thấy sản phẩm</div>;
    }

    const price = product.price || 0;
    const categoryName = categories.find(c => c.slug === product.category)?.name || product.category;

    return (
        <div className="product-detail-page">
            <div className="product-breadcrumb">
                <Link to="/">Trang chủ</Link> <span className="separator">/</span>
                <Link to="/products">Thực đơn</Link> <span className="separator">/</span>
                <Link to={`/products?category=${product.category}`}>
                    {categoryName}
                </Link> <span className="separator">/</span>
                <span className="current">{product.title}</span>
            </div>

            <div className="row g-4 justify-content-center">
                <div className="col-lg-7 col-md-6">
                    <Card className="product-image-wrapper">
                        <img src={product.productImage} alt={product.title} className="img-fluid" />
                    </Card>
                </div>
                <div className="col-lg-5 col-md-6">
                    <Card className="product-info-wrapper">
                        <div className="product-category-badge">{categoryName}</div>
                        <h1 className="product-title">{product.title}</h1>
                        <p>{product.description}</p>

                        <div className="product-price-section">
                            <span className="kfc-price price-xl">{formatCurrency(price)}</span>
                        </div>

                        <div className="quantity-section">
                            <span className="section-label">Số lượng</span>
                            <QuantityPicker
                                quantity={quantity}
                                onIncrease={handleIncrease}
                                onDecrease={handleDecrease}
                            />
                        </div>

                        <Button
                            variant="primary"
                            onClick={handleAddToCart}
                            fullWidth
                        >
                            Thêm vào giỏ hàng
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
