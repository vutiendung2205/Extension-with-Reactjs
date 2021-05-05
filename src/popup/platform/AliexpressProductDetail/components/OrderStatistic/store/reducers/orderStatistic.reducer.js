import * as Actions from '../actions';
let initialState = {
    orderChart: null,
    productDetail: null,
    sumOrder7: null,
    isData: false
}
const orderStatisticReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.GET_ALIEXPRESS_ORDER_CHART:
            state.orderChart = action.payload.orderChart;
            state.isData = true;
            return state;
        case Actions.GET_ALIEXPRESS_PRODUCT_DETAIL:
            return {
                productDetail: action.payload.productDetail,
                orderChart: action.payload.orderChart,
                isData: true
            };
        case Actions.CLEAR_ORDER_STATISTIC:
            return {
                ...state,
                orderChart: {}
            };
        default:
            return state;
    }
};

export default orderStatisticReducer;