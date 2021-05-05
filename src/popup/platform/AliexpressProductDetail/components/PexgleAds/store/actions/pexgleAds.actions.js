export const GET_ALIEXPRESS_DETAIL_ADS_OF_PEXGLE = 'GET_ALIEXPRESS_DETAIL_ADS_OF_PEXGLE';
import { api } from '../../../../../../@fuse/utils';
import { API_GET_PEXGLE_SPONSOR_TEMPLATE } from '../../../../../../@fuse/config/constants';
export function getAliexpressDetailAds() {
	return dispatch => {
		api.get(API_GET_PEXGLE_SPONSOR_TEMPLATE).then(result => {
			dispatch({
				type: GET_ALIEXPRESS_DETAIL_ADS_OF_PEXGLE,
				payload: { data: result.data, time: new Date().getTime() }
			});
		});
	};
}
