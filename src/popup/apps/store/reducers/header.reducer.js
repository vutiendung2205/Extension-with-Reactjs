import * as Actions from "../actions";
import _ from "../../../@fuse/utils/lodash";

const initialState = {
    // isShowBack: false,
    // actionBack: () => {
    // },
    // isShowLogo: true,
    // title: '',
    // isShowSearch: false,
    // searchType: '',
    // searchTitle: "",
    // searchText: {}
};

const header = function (state = initialState, action) {
    switch (action.type) {
        case Actions.SET_HEADER: {
            if (!action.payload.isDefault) {
                let keys = Object.keys(action.payload);
                for (let i = 0; i < keys.length; i++) {
                    if (keys[i] != "isDefault") {
                        state[keys[i]] = {
                            ...state[keys[i]],
                            ...action.payload[keys[i]],
                        };
                    }
                }
            } else {
                let keys = Object.keys(action.payload);
                for (let i = 0; i < keys.length; i++) {
                    if (keys[i] != "isDefault") {
                        state[keys[i]] = action.payload[keys[i]];
                    }
                }
            }
            return {
                ...state,
            };
        }
        default: {
            return state;
        }
    }
};

export default header;
