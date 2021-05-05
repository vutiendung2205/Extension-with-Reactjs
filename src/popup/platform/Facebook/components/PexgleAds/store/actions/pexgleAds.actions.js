import { api } from '../../../../../../@fuse/utils';
import {
	API_GET_PEXGLE_SPONSOR_TEMPLATE,
	API_GET_BLOCK_ADS_OPTION,
	API_SAVE_FACEBOOK_ADS_TRACKING,
	API_GET_CSS_SELECTOR_FACEBOOK_ADS
} from '../../../../../../@fuse/config/constants';
import 'babel-core/register';
import 'babel-polyfill';
export const GET_FACEBOOK_ADS_OF_PEXGLE = 'GET_FACEBOOK_ADS_OF_PEXGLE';
export const GET_BLOCK_ADS_OPTION = 'GET_BLOCK_ADS_OPTION';
export const SAVE_FACEBOOK_ADS_TRACKING = 'SAVE_FACEBOOK_ADS_TRACKING';
export const GET_FACEBOOK_ADS_TRACKING_CSS_SELECTOR = 'GET_FACEBOOK_ADS_TRACKING_CSS_SELECTOR';
export function getFacebookAdsOfPexgle() {
	return async dispatch => {
		Promise.all([
			api.get(API_GET_PEXGLE_SPONSOR_TEMPLATE),
			api.get(API_GET_BLOCK_ADS_OPTION),
			api.get(API_GET_CSS_SELECTOR_FACEBOOK_ADS)
		]).then(result => {
			let cssSelector = getSelector(result[2]);
			dispatch({
				type: GET_FACEBOOK_ADS_OF_PEXGLE,
				payload: {
					data: result[0].data,
					time: new Date().getTime(),
					blockAdsOption: result[1].data,
					facebookAdsTrackingCssSelector: cssSelector
				}
			});
		});
	};
}

export function saveFacebookAdsTracking(adsData) {
	return async dispatch => {
		let result = await api
			.post(API_SAVE_FACEBOOK_ADS_TRACKING, { data: adsData })
			.then(result => {
				dispatch({
					type: SAVE_FACEBOOK_ADS_TRACKING,
					payload: result.data
				});
			})
			.catch(err => {
				console.log('ads error:', err);
			});
	};
}
function getSelector(result) {
	let selectors = result.data.css_selector;
	// comments
	let comments = selectors.comments;
	if (selectors.comments !== selectors.old_comments) {
		comments += ',' + selectors.old_comments;
	}
	// content
	let content = selectors.content;
	if (selectors.content !== selectors.old_content) {
		content += ',' + selectors.old_content;
	}
	// image
	let image = selectors.image;
	if (selectors.image !== selectors.old_image) {
		image += ',' + selectors.old_image;
	}
	// sponsored
	let is_sponsored = selectors.is_sponsored;
	if (selectors.is_sponsored !== selectors.old_is_sponsored) {
		is_sponsored += ',' + selectors.old_is_sponsored;
	}
	// page_id
	let page_id = selectors.page_id;
	if (selectors.page_id !== selectors.old_page_id) {
		page_id += ',' + selectors.old_page_id;
	}
	// post area
	let post_area = selectors.post_area;
	if (selectors.post_area !== selectors.old_post_area) {
		post_area += ',' + selectors.old_post_area;
	}
	// post id
	let post_id = selectors.post_id;
	if (selectors.post_id !== selectors.old_post_id) {
		post_id += ',' + selectors.old_post_id;
	}
	// reaction
	let reactions = selectors.reactions;
	if (selectors.reactions !== selectors.old_reactions) {
		reactions += ',' + selectors.old_reactions;
	}
	// share
	let shares = selectors.shares;
	if (selectors.shares !== selectors.old_shares) {
		shares += ',' + selectors.old_shares;
	}
	// view
	let views = selectors.views;
	if (selectors.views !== selectors.old_views) {
		views += ',' + selectors.old_views;
	}
	// type
	let type_post = selectors.type_post;
	if (selectors.type_post !== selectors.old_type_post) {
		type_post += ',' + selectors.old_type_post;
	}
	let overall_post = selectors.overall_post;
	if (selectors.overall_post !== selectors.old_overall_post) {
		overall_post += ',' + selectors.old_overall_post;
	}
	let css_selector = {
		comments,
		content,
		image,
		is_sponsored,
		page_id,
		post_area,
		post_id,
		reactions,
		shares,
		views,
		type_post,
		overall_post
	};
	return css_selector;
}
