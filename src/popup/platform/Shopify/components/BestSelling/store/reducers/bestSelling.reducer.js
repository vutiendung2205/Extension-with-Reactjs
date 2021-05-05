import * as Actions from '../actions';
let initialState = {
    isData: false
}
const bestSellingReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.GET_BEST_SELLING:
            return {
                ...action.payload,
                isData: true
            };
        case Actions.CLEAR_BEST_SELLING:
            return {
                ...state,
                products: []
            };
        case Actions.EDIT_FAVORITE_BEST_SELLING:
            let indexFavorite = state.products.findIndex(p => p.product_id === action.payload.product_id);
            state.products[indexFavorite].favorite = action.payload.favorite;
            state.products[indexFavorite].isFavoriteInProgress = false;
            return {
                ...state
            };
        case Actions.INPROGRESS_FAVORITE_BEST_SELLING:

            let indexInProgress = state.products.findIndex(p => p.product_id === action.payload.product_id);
            state.products[indexInProgress].isFavoriteInProgress = action.payload.isFavoriteInProgress;
            return {
                ...state
            };
        case Actions.APPEND_BEST_SELLING:
            // let oldAds = state.ads;
            return {
                ...state,
                products: state.products.concat(action.payload.products)
            };
        default:
            return state;
    }
};

export default bestSellingReducer;