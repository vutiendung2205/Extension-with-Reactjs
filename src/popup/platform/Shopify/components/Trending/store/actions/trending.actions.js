export const GET_TRENDING = 'GET_TRENDING';
export const CLEAR_TRENDING = 'CLEAR_TRENDING';
export const APPEND_TRENDING = 'APPEND_TRENDING';
export const EDIT_FAVORITE_TRENDING = 'EDIT_FAVORITE_TRENDING';
export const INPROGRESS_FAVORITE_TRENDING = 'INPROGRESS_FAVORITE_TRENDING';

import { api } from '../../../../../../@fuse/utils';
import {
	API_GET_TRENDING_PRODUCT,
	API_MARK_FAVORITE,
	API_GET_TRENDING
} from '../../../../../../@fuse/config/constants';
import * as ActionsLayout from '../../../../../../apps/store/actions';
import * as helper from '../../../../../../@fuse/utils/helpers';

export function getTrending(obj, isClear, currentFeature, childIndex) {
	if (!obj.screen_id) obj.screen_id = 1;
	return dispatch => {
		dispatch(ActionsLayout.onLoading(0));
		isClear && dispatch(clearTrending());
		api.get(API_GET_TRENDING_PRODUCT, obj).then(response => {
			if (!obj.search && (!response.data || !response.data.products || response.data.products.length <= 0)) {
				api.get(API_GET_TRENDING.replace('%DOMAIN%', obj.domain).replace('%PAGE%', 1)).then(async r => {
					let products = await helper.mapBestSellingProduct(obj.domain, r, '2019/09/01');
					dispatch(ActionsLayout.offLoading());
					dispatch({
						type: GET_TRENDING,
						payload: { products, page: obj.page, loadInsite: true }
					});
					dispatch(ActionsLayout.setHeader({ [currentFeature]: { searchDisabled: true } }));
				});
			} else {
				dispatch(ActionsLayout.offLoading());
				dispatch({
					type: GET_TRENDING,
					payload: { ...response.data, page: obj.page, loadInsite: false }
				});
			}
		});
	};
}
export function clearTrending() {
	return {
		type: CLEAR_TRENDING
	};
}
export function appendTrending(obj, done) {
	if (!obj.screen_id) obj.screen_id = 1;
	return dispatch => {
		// dispatch(ActionsLayout.onLoading(0));
		api.get(API_GET_TRENDING_PRODUCT, obj).then(response => {
			// dispatch(ActionsLayout.offLoading());
			done(response.data.products.length);
			dispatch({
				type: APPEND_TRENDING,
				payload: { ...response.data, page: obj.page }
			});
		});
	};
}
export function favoriteTrending(product_id) {
	return dispatch =>
		api
			.post(API_MARK_FAVORITE, { data: { field_value: product_id, screen_id: 1, is_favorite: 1 } })
			.then(response =>
				dispatch({
					type: EDIT_FAVORITE_TRENDING,
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
					type: EDIT_FAVORITE_TRENDING,
					payload: {
						product_id,
						favorite: false
					}
				});
			});
}
export function unFavoriteTrending(product_id) {
	return dispatch =>
		api
			.post(API_MARK_FAVORITE, { data: { field_value: product_id, screen_id: 1, is_favorite: 0 } })
			.then(response =>
				dispatch({
					type: EDIT_FAVORITE_TRENDING,
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
					type: EDIT_FAVORITE_TRENDING,
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
			type: INPROGRESS_FAVORITE_TRENDING,
			payload: {
				product_id,
				isFavoriteInProgress: true
			}
		});
}
