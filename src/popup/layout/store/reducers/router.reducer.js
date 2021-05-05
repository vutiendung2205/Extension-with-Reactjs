import * as Actions from '../actions';

const initialState = {
    currentIndex: 0,
    childIndex: 0
};

const router = function (state = initialState, action) {
    switch (action.type) {
        case Actions.ROUTE_TO:
            {
                return {
                    ...state,
                    currentIndex: action.payload
                };
            }
        case Actions.ROUTE_CHILD_TO:
            {
                return {
                    ...state,
                    childIndex: action.payload
                };
            }
        default:
            {
                return state;
            }
    }
};

export default router;
