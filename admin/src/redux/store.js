import { combineReducers, createStore, applyMiddleware } from 'redux';
import { productReducer } from './reducers/productReducer';
import { ingredientReducer } from './reducers/ingredientReducer';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware))

const rootReducer = combineReducers({
    products: productReducer,
    ingredients: ingredientReducer
})


export const store = createStore(rootReducer, composedEnhancer)