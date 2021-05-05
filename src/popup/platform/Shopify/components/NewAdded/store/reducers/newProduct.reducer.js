import * as Actions from '../actions';
let initialState = {
    isData: false
}
const trendingReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.GET_NEW_PRODUCT:
            return {
                ...action.payload,
                isData: true
            };
        case Actions.CLEAR_NEW_PRODUCT:
            return {
                ...state,
                products: []
            };
        case Actions.APPEND_NEW_PRODUCT:
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