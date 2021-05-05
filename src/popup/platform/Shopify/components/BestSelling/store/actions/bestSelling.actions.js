export const GET_BEST_SELLING = 'GET_BEST_SELLING';
export const CLEAR_BEST_SELLING = 'CLEAR_BEST_SELLING';
export const APPEND_BEST_SELLING = 'APPEND_BEST_SELLING';
export const EDIT_FAVORITE_BEST_SELLING = 'EDIT_FAVORITE_BEST_SELLING';
export const INPROGRESS_FAVORITE_BEST_SELLING = 'INPROGRESS_FAVORITE_BEST_SELLING';

import { api } from '../../../../../../@fuse/utils';
import {
	API_GET_BEST_SELLING_PRODUCT,
	API_MARK_FAVORITE,
	API_GET_NEW_ADD
} from '../../../../../../@fuse/config/constants';
import * as ActionsLayout from '../../../../../../layout/store/actions';
import * as helper from '../../../../../../@fuse/utils/helpers';

export function getBestSelling(obj, isClear) {
	return dispatch => {
		dispatch(ActionsLayout.onLoading(0));
		isClear && dispatch(clearBestSelling());
		api.get(API_GET_BEST_SELLING_PRODUCT, obj).then(response => {
			dispatch(ActionsLayout.offLoading());
			dispatch({
				type: GET_BEST_SELLING,
				payload: { ...response.data, page: obj.page }
			});
		});
	};
}
export function clearBestSelling() {
	return {
		type: CLEAR_BEST_SELLING
	};
}
export function appendBestSelling(obj, done) {
	return dispatch => {
		// dispatch(ActionsLayout.onLoading(0));
		api.get(API_GET_BEST_SELLING_PRODUCT, obj).then(response => {
			// dispatch(ActionsLayout.offLoading());
			done(response.data.products.length);
			dispatch({
				type: APPEND_BEST_SELLING,
				payload: { ...response.data, page: obj.page }
			});
		});
	};
}
export function favoriteBestSelling(product_id) {
	return dispatch =>
		api
			.post(API_MARK_FAVORITE, { data: { field_value: product_id, screen_id: 16, is_favorite: 1 } })
			.then(response =>
				dispatch({
					type: EDIT_FAVORITE_BEST_SELLING,
					payload: {
						product_id,
						favorite: true
					}
				})
			)
			.catch(error => {
				if (error.response && error.response.status == 403) {
					dispatch(ActionsLayout.toggleLogin(true));
				}
				dispatch({
					type: EDIT_FAVORITE_BEST_SELLING,
					payload: {
						product_id,
						favorite: false
					}
				});
			});
}
export function unFavoriteBestSelling(product_id) {
	return dispatch =>
		api
			.post(API_MARK_FAVORITE, { data: { field_value: product_id, screen_id: 16, is_favorite: 0 } })
			.then(response =>
				dispatch({
					type: EDIT_FAVORITE_BEST_SELLING,
					payload: {
						product_id,
						favorite: false
					}
				})
			)
			.catch(error => {
				if (error.response && error.response.status == 403) {
					dispatch(ActionsLayout.toggleLogin(true));
				}
				dispatch({
					type: EDIT_FAVORITE_BEST_SELLING,
					payload: {
						product_id,
						favorite: true
					}
				});
			});
}
export function favoriteInProgress(product_id) {
	return dispatch =>
		dispatch({
			type: INPROGRESS_FAVORITE_BEST_SELLING,
			payload: {
				product_id,
				isFavoriteInProgress: true
			}
		});
}
