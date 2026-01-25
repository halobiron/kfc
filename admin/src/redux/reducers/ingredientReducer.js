export const ingredientReducer = (state = { ingredients: [] }, action) => {
    switch (action.type) {
        case 'ALL_INGREDIENTS':
            return {
                ...state,
                ingredients: action.payload.data
            };
        case 'UPDATE_INGREDIENT':
            return {
                ...state,
                // Update specific item in local state if needed
            };
        default:
            return state;
    }
};
