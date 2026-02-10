import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../../../Cart/cartSlice';
import Button from '../../../../components/Button';
import { formatCurrency } from '../../../../utils/formatters';
import './ProductCard.css';

const Card = ({ product }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    return (
        <div className='card-wrapper'>
            <motion.div
                className="kfc-product-card"
                onClick={() => navigate(`/product-detail/${product._id}`)}
                whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
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
            </motion.div>
        </div>
    )
}

export default Card