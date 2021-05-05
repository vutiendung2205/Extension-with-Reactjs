import * as Actions from '../actions';
let initialState = {
    time: null,
    isData: false
}
const pexgleAdsReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.GET_ALIEXPRESS_DETAIL_ADS_OF_PEXGLE:
            return { ...action.payload , isData: true };
        default:
            return state;
    }
};

export default pexgleAdsReducer;