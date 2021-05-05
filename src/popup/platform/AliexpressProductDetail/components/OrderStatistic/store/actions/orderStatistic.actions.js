export const GET_ALIEXPRESS_ORDER_CHART = 'GET_ALIEXPRESS_ORDER_CHART';
export const GET_ALIEXPRESS_PRODUCT_DETAIL = 'GET_ALIEXPRESS_PRODUCT_DETAIL';
export const CLEAR_ORDER_STATISTIC = 'CLEAR_ORDER_STATISTIC';

import { api } from '../../../../../../@fuse/utils';
import {
	API_ALIEXPRESS_PRODUCT_ANALYSIS,
	API_ALIEXPRESS_PRODUCT_DETAIL,
	API_ALIEXPRESS_VISIT_TRACKING
} from '../../../../../../@fuse/config/constants';
import * as ActionsLayout from '../../../../../../layout/store/actions';

export function getOrderChart(product_id, isClear) {
	return async dispatch => {
		dispatch(ActionsLayout.onLoading(0));
		isClear && dispatch(clearOrderStatistic());
		for (let i = 0; i < 20; i++) {
			let result = await api.get(API_ALIEXPRESS_PRODUCT_ANALYSIS, {
				product_id: product_id
			});
			if (result.data.data.analysis_chart == undefined) {
				await new Promise(r => setTimeout(r, 1000));
			} else {
				dispatch(ActionsLayout.offLoading());
				dispatch({
					type: GET_ALIEXPRESS_ORDER_CHART,
					payload: { orderChart: result.data }
				});
				break;
			}
		}
	};
}

export function getProductDetail(product_id, isClear) {
	return dispatch => {
		dispatch(ActionsLayout.onLoading(0));
		isClear && dispatch(clearOrderStatistic());
		Promise.all([
			api.get(API_ALIEXPRESS_PRODUCT_ANALYSIS, { product_id: product_id }),
			api.get(API_ALIEXPRESS_PRODUCT_DETAIL, { id: product_id })
		])
			.then(response => {
				let orderChart = response[0].data;
				let productDetail = response[1].data[0];
				dispatch(ActionsLayout.offLoading());
				dispatch({
					type: GET_ALIEXPRESS_PRODUCT_DETAIL,
					payload: { productDetail: productDetail, orderChart: orderChart }
				});
			})
			.catch(err => {
				dispatch(ActionsLayout.offLoading());
			});
	};
}

export function clearOrderStatistic() {
	return {
		type: CLEAR_ORDER_STATISTIC
	};
}

export function saveProductInformation(href) {
	let objProductInfor = getAliexpressProductInformation(href);
	return api
		.post(API_ALIEXPRESS_VISIT_TRACKING, { data: objProductInfor })
		.then(res => {})
		.catch(err => {
			// console.log("saveProductInformation", err);
		});
}

function getAliexpressProductInformation(href) {
	let url = href,
		product_id = 0,
		product_slug = '';
	if (url.includes('aliexpress.com/store/product')) {
		try {
			let url_split = url.split('.html')[0].split('/');
			product_slug = url_split[url_split.length - 2];
			product_id = url_split[url_split.length - 1].split('_')[1];
		} catch (e) {
			product_id = 0;
		}
	} else {
		try {
			let url_split = url.split('.html')[0].split('/');
			product_slug = url_split[url_split.length - 2];
			product_id = url_split[url_split.length - 1];
		} catch (e) {
			product_id = 0;
		}
	}
	return {
		product_id,
		slug: product_slug,
		url
	};
}
