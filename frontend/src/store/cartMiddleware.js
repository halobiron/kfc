import { addToCart, updateQuantity, removeFromCart, clearCart } from '../features/Cart/cartSlice';

export const cartMiddleware = store => next => action => {
    const result = next(action);

    if (
        addToCart.match(action) ||
        updateQuantity.match(action) ||
        removeFromCart.match(action) ||
        clearCart.match(action)
    ) {
        const cartState = store.getState().cart;
        localStorage.setItem('cart', JSON.stringify(cartState));
    }

    return result;
};
