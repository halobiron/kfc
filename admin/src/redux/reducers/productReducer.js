export const productReducer = (state = { products: [], currentProduct: null }, action) => {
    switch (action.type) {
        case 'ALL_PRODUCTS':
            return {
                ...state,
                products: action.payload
            }
        case 'ADD_PRODUCT':
            return {
                ...state,
                products: action.payload
            }
        case 'GET_PRODUCT_BY_ID':
            return {
                ...state,
                currentProduct: action.payload.product || null
            }
        case 'UPDATE_PRODUCT':
            return {
                ...state,
                currentProduct: action.payload.product || null
            }
        default:
            return state
    }
}