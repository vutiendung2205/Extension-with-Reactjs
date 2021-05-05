import * as Actions from '../actions';
let initialState = {
	data: null,
	time: null,
	blockAdsOption: null,
	facebookAdsTrackingCssSelector: null,
	isData: false
};
const pexgleAdsReducer = function (state = initialState, action) {
	switch (action.type) {
		case Actions.GET_FACEBOOK_ADS_OF_PEXGLE:
			return { ...state, ...action.payload, isData: true };
		case Actions.SAVE_FACEBOOK_ADS_TRACKING:
			return state;
		default:
			return state;
	}
};

export default pexgleAdsReducer;
