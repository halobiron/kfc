import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../../../Cart/cartSlice';
import Button from '../../../../components/Button';
import Card from '../../../../components/Card';
import { formatCurrency } from '../../../../utils/formatters';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    return (
        <motion.div
            className="card-wrapper"
            onClick={() => navigate(`/product-detail/${product._id}`)}
            whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
            <Card className="kfc-product-card">
                <img src={product.productImage} className="product-image" alt={product.title} />
                <div className="card-body">
                    <div className="title-price-row">
                        <h5 className="product-title">{product.title}</h5>
                        <span className="kfc-price price-xl">{formatCurrency(product.price)}</span>
                    </div>
                    <p className="product-description">{product.description}</p>
                    <Button
                        component={motion.button}
                        variant="primary"
                        className="w-100 mt-auto product-card-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            dispatch(addToCart(product));
                        }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Thêm
                    </Button>
                </div>
            </Card>
        </motion.div>
    )
}

export default ProductCard
