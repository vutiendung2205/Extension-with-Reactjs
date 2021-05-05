import * as Actions from '../actions';
let initialState = {
	hasNextPage: true,
	currentPage: 2,
	currentLength: 6
};
const ui = function (state = initialState, action) {
	switch (action.type) {
		case Actions.SET_SCROLL:
			return {
				...state,
				...action.payload
			};
		case Actions.RELOAD_SCROLL:
			return {
				...initialState
			};
		default:
			return state;
	}
};

export default ui;
