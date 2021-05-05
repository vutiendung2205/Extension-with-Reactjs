import * as Actions from '../actions';
let initialState = {
    isShowAllPage: false
}
const ui = function (state = initialState, action) {
    switch (action.type) {
        case Actions.TOGGLE_SHOW_ALL_PAGE:
            return {
                ...state,
                isShowAllPage: !state.isShowAllPage
            };
        default:
            return state;
    }
};

export default ui;