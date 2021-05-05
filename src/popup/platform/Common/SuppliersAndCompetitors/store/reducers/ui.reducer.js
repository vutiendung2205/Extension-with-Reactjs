import * as Actions from '../actions';
let initialState = {
    isShowVideoAliexpress: false,
    isShowAllLink: false,
    platformShowMore: ''
}
const ui = function (state = initialState, action) {
    switch (action.type) {
        case Actions.TOGGLE_SHOW_ALL_LINK:
            return {
                ...state,
                isShowAllLink: !state.isShowAllLink,
                platformShowMore: action.payload
            };
        case Actions.TOGGLE_SHOW_VIDEO_ALIEXPRESS:
            return {
                ...state,
                isShowVideoAliexpress: !state.isShowVideoAliexpress,
            };
        default:
            return state;
    }
};

export default ui;