export const GET_NEW_PRODUCT = 'GET_NEW_PRODUCT';
export const CLEAR_NEW_PRODUCT = 'CLEAR_NEW_PRODUCT';
export const APPEND_NEW_PRODUCT = 'APPEND_NEW_PRODUCT';

import { api } from '../../../../../../@fuse/utils';
import { API_GET_TRENDING_PRODUCT, API_MARK_FAVORITE, API_GET_NEW_ADD } from '../../../../../../@fuse/config/constants';
import * as ActionsLayout from '../../../../../../layout/store/actions';
import * as helper from '../../../../../../@fuse/utils/helpers';

export function getNewProduct(obj, isClear) {
	return async dispatch => {
		dispatch(ActionsLayout.onLoading(5));
		isClear && dispatch(clearNewProduct());
		if (obj.page == 1)
			await api.get(
				API_GET_NEW_ADD.replace('%DOMAIN%', obj.domain).replace('%PAGE%', obj.page).replace('%LIMIT%', 1)
			);
		api.get(API_GET_NEW_ADD.replace('%DOMAIN%', obj.domain).replace('%PAGE%', obj.page).replace('%LIMIT%', 6)).then(
			async r => {
				let products = await helper.mapNewProduct(obj.domain, r.products);
				dispatch(ActionsLayout.offLoading());
				dispatch({
					type: GET_NEW_PRODUCT,
					payload: { products, page: obj.page }
				});
			}
		);

		// api.get(API_GET_TRENDING_PRODUCT, obj).then((response) => {
		//     dispatch(ActionsLayout.offLoading());
		//     dispatch({
		//         type: GET_TRENDING,
		//         payload: { ...response.data, page: obj.page }
		//     })
		// })
	};
}
export function clearNewProduct() {
	return {
		type: CLEAR_NEW_PRODUCT
	};
}
export function appendNewProduct(obj, done) {
	return dispatch => {
		// dispatch(ActionsLayout.onLoading(0));
		api.get(API_GET_NEW_ADD.replace('%DOMAIN%', obj.domain).replace('%PAGE%', obj.page).replace('%LIMIT%', 6)).then(
			async r => {
				let products = await helper.mapNewProduct(obj.domain, r.products);
				done(products.length);

				dispatch(ActionsLayout.offLoading());
				dispatch({
					type: APPEND_NEW_PRODUCT,
					payload: { products, page: obj.page }
				});
			}
		);
	};
}
