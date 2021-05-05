import * as Actions from '../actions';
let initialState = {
    isData: false
}
const linkProduct = function (state = initialState, action) {
    switch (action.type) {
        case Actions.GET_LINK_PRODUCT:
            return {
                ...action.payload,
                isData: true
            };
        default:
            return state;
    }
};

export default linkProduct;