export const GET_ADS = 'GET_ADS';
export const CLEAR_ADS = 'CLEAR_ADS';
export const APPEND_ADS = 'APPEND_ADS';
export const EDIT_FAVORITE_ADS = 'EDIT_FAVORITE_ADS';
export const INPROGRESS_FAVORITE_ADS = 'INPROGRESS_FAVORITE_ADS';

import { api } from '../../../../../../@fuse/utils';
import { API_GET_LIST_FACEBOOK_ADS, API_MARK_FAVORITE } from '../../../../../../@fuse/config/constants';
import * as ActionsLayout from '../../../../../../layout/store/actions';

export function getAds(obj, isClear) {
	return dispatch => {
		dispatch(ActionsLayout.onLoading(0));
		isClear && dispatch(clearAds());
		api.get(API_GET_LIST_FACEBOOK_ADS, obj).then(response => {
			dispatch(ActionsLayout.offLoading());
			dispatch({
				type: GET_ADS,
				payload: { ...response.data, page: obj.page }
			});
		});
	};
}
export function clearAds() {
	return {
		type: CLEAR_ADS
	};
}
export function appendAds(obj, done) {
	return dispatch => {
		// dispatch(ActionsLayout.onLoading(0));
		api.get(API_GET_LIST_FACEBOOK_ADS, obj).then(response => {
			// dispatch(ActionsLayout.offLoading());
			done(response.data.ads.length);
			dispatch({
				type: APPEND_ADS,
				payload: { ...response.data, page: obj.page }
			});
		});
	};
}
export function favoriteAds(post_id) {
	return dispatch =>
		api
			.post(API_MARK_FAVORITE, { data: { field_value: post_id, screen_id: 7, is_favorite: 1 } })
			.then(response =>
				dispatch({
					type: EDIT_FAVORITE_ADS,
					payload: {
						post_id,
						favorite: true
					}
				})
			)
			.catch(error => {
				if (error.response && error.response.status == 403) {
					dispatch(ActionsLayout.toggleLogin(true));
				}
				dispatch({
					type: EDIT_FAVORITE_ADS,
					payload: {
						post_id,
						favorite: false
					}
				});
			});
}
export function unFavoriteAds(post_id) {
	return dispatch =>
		api
			.post(API_MARK_FAVORITE, { data: { field_value: post_id, screen_id: 7, is_favorite: 0 } })
			.then(response =>
				dispatch({
					type: EDIT_FAVORITE_ADS,
					payload: {
						post_id,
						favorite: false
					}
				})
			)
			.catch(error => {
				if (error.response && error.response.status == 403) {
					dispatch(ActionsLayout.toggleLogin(true));
				}
				dispatch({
					type: EDIT_FAVORITE_ADS,
					payload: {
						post_id,
						favorite: true
					}
				});
			});
}
export function favoriteInProgress(post_id) {
	return dispatch =>
		dispatch({
			type: INPROGRESS_FAVORITE_ADS,
			payload: {
				post_id,
				isFavoriteInProgress: true
			}
		});
}
