import * as Actions from '../actions';

const initialState = {
    
};

const sort = function (state = initialState, action) {
    switch (action.type) {
        case Actions.SET_SORT:
            {
                return {
                    ...state,
                    ...action.payload
                };
            }
        default:
            {
                return state;
            }
    }
};

export default sort;
