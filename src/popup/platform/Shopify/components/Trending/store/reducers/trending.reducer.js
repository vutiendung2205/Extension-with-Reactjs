import * as Actions from '../actions';
let initialState = {
    isData: false,
    loadInsite: false
}
const trendingReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.GET_TRENDING:
            return {
                ...action.payload,
                isData: true
            };
        case Actions.CLEAR_TRENDING:
            return {
                ...state,
                products: []
            };
        case Actions.EDIT_FAVORITE_TRENDING:
            let indexFavorite = state.products.findIndex(p => p.product_id === action.payload.product_id);
            state.products[indexFavorite].favorite = action.payload.favorite;
            state.products[indexFavorite].isFavoriteInProgress = false;
            return {
                ...state
            };
        case Actions.INPROGRESS_FAVORITE_TRENDING:

            let indexInProgress = state.products.findIndex(p => p.product_id === action.payload.product_id);
            state.products[indexInProgress].isFavoriteInProgress = action.payload.isFavoriteInProgress;
            return {
                ...state
            };
        case Actions.APPEND_TRENDING:
            // let oldAds = state.ads;
            return {
                ...state,
                products: state.products.concat(action.payload.products)
            };
        default:
            return state;
    }
};

export default trendingReducer;