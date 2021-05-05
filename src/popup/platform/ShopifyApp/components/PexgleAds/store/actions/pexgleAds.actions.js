export const GET_SHOPIFY_ADS_OF_PEXGLE = 'GET_SHOPIFY_ADS_OF_PEXGLE';

import { api } from '../../../../../../@fuse/utils';
import {
	API_GET_PEXGLE_SPONSOR_TEMPLATE,
	API_GET_BLOCK_ADS_OPTION,
	API_SAVE_FACEBOOK_ADS_TRACKING,
	API_GET_CSS_SELECTOR_FACEBOOK_ADS
} from '../../../../../../@fuse/config/constants';
import 'babel-core/register';
import 'babel-polyfill';
export function getShopifyAdsOfPexgle() {
	return async dispatch => {
		let result = await api.get(API_GET_PEXGLE_SPONSOR_TEMPLATE);
		dispatch({
			type: GET_SHOPIFY_ADS_OF_PEXGLE,
			payload: { data: result.data, time: new Date().getTime() }
		});
	};
}
