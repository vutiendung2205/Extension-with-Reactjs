import * as Actions from '../actions';

const initialState = {
    addTime: 0,
    isShow: false,
    isShowData: false
};

const loading = function (state = initialState, action) {
    switch (action.type) {
        case Actions.ON_LOADING:
            {
                return {
                    ...state,
                    addTime: action.payload,
                    isShow: true,
                    isShowData: false
                };
            }
        case Actions.OFF_LOADING:
            {
                return {
                    ...initialState,
                    isShow: false

                };
            }
        case Actions.SHOW_DATA:
            {
                return {
                    ...state,
                    isShowData: true
                };
            }
        default:
            {
                return state;
            }
    }
};

export default loading;
