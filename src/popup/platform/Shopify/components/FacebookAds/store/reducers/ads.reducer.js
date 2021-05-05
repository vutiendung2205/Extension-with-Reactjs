import * as Actions from '../actions';
let initialState = {
	isData: false
};
const adsReducer = function (state = initialState, action) {
	switch (action.type) {
		case Actions.GET_ADS:
			return {
				...action.payload,
				isData: true
			};
		case Actions.CLEAR_ADS:
			return {
				...state,
				ads: []
			};
		case Actions.EDIT_FAVORITE_ADS:
			let indexFavorite = state.ads.findIndex(p => p.post_id === action.payload.post_id);
			state.ads[indexFavorite].favorite = action.payload.favorite;
			state.ads[indexFavorite].isFavoriteInProgress = false;
			return {
				...state
			};
		case Actions.INPROGRESS_FAVORITE_ADS:
			let indexInProgress = state.ads.findIndex(p => p.post_id === action.payload.post_id);
			state.ads[indexInProgress].isFavoriteInProgress = action.payload.isFavoriteInProgress;
			return {
				...state
			};
		case Actions.APPEND_ADS:
			// let oldAds = state.ads;
			return {
				...state,
				ads: state.ads.concat(action.payload.ads)
			};
		default:
			return state;
	}
};

export default adsReducer;
