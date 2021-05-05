import * as Actions from '../actions';
let initialState = {
    isLinkAndPriceData: false
}
const priceLinkProduct = function (state = initialState, action) {
    switch (action.type) {
        case Actions.GET_PRICE_LINK_PRODUCT:
            return {
                listPriceOfLink: action.payload,
                isLinkAndPriceData: true
            };
        default:
            return state;
    }
};

export default priceLinkProduct;