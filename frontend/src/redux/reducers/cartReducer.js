import { ADD_TO_CART, REMOVE_FROM_CART, CLEAR_CART, UPDATE_QUANTITY } from '../actions/cartActions';

const initialState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART: {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          totalQuantity: state.totalQuantity + 1,
          totalPrice: state.totalPrice + action.payload.price,
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
        totalQuantity: state.totalQuantity + 1,
        totalPrice: state.totalPrice + action.payload.price,
      };
    }
    case UPDATE_QUANTITY: {
      const { productId, quantity } = action.payload;
      const itemToUpdate = state.items.find(item => item.id === productId);
      
      if (!itemToUpdate) return state;
      
      const quantityDiff = quantity - itemToUpdate.quantity;
      const priceDiff = itemToUpdate.price * quantityDiff;
      
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== productId),
          totalQuantity: state.totalQuantity - itemToUpdate.quantity,
          totalPrice: state.totalPrice - (itemToUpdate.price * itemToUpdate.quantity),
        };
      }
      
      return {
        ...state,
        items: state.items.map(item =>
          item.id === productId ? { ...item, quantity } : item
        ),
        totalQuantity: state.totalQuantity + quantityDiff,
        totalPrice: state.totalPrice + priceDiff,
      };
    }
    case REMOVE_FROM_CART: {
      const itemToRemove = state.items.find(item => item.id === action.payload);
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        totalQuantity: state.totalQuantity - (itemToRemove?.quantity || 0),
        totalPrice: state.totalPrice - (itemToRemove?.price * itemToRemove?.quantity || 0),
      };
    }
    case CLEAR_CART:
      return initialState;
    default:
      return state;
  }
};

export default cartReducer;
