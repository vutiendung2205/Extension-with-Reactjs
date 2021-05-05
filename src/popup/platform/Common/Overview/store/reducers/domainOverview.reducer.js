import * as Actions from '../actions';
let initialState = {
	isData: false
};
const overviewReducer = function (state = initialState, action) {
	switch (action.type) {
		case Actions.DOMAIN_OVERVIEW:
			return {
				...state,
				...action.payload,
				isData: true
			};
		case Actions.FOLLOW_PAGE_INPROGRESS:
			let indexInProgress = state.fbPage.findIndex(p => p.slug === action.payload.page);
			state.fbPage[indexInProgress].isFollowInProgress = action.payload.isFollowInProgress;
			return {
				...state
			};
		case Actions.FOLLOW_PAGE:
			let indexFollow = state.fbPage.findIndex(p => p.slug === action.payload.page);

			state.fbPage[indexFollow].is_followed = action.payload.is_followed;
			state.fbPage[indexFollow].isFollowInProgress = false;
			return {
				...state
			};
		default:
			return state;
	}
};

export default overviewReducer;
