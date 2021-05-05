import * as Actions from '../actions';

const initialState = {
    isShowLogin: false
};

const login = function (state = initialState, action) {
    switch (action.type) {
        case Actions.TOGGLE_LOGIN:
            {
                return {
                    isShowLogin: action.payload
                }
            }
        default:
            {
                return state;
            }
    }
};

export default login;
