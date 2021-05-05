import * as Actions from '../actions';

const initialState = {
    isExtensionOpen: true,
    domain: new URL(window.location).host
};

const message = function (state = initialState, action) {
    switch (action.type) {
        case Actions.TOGGLE_EXTENSION:
            {
                return {
                    ...state,
                    isExtensionOpen: typeof action.payload =='undefined' ?  !state.isExtensionOpen : action.payload
                };
            }
        default:
            {
                return state;
            }
    }
};

export default message;
