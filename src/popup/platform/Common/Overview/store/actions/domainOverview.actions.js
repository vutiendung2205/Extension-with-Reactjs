export const DOMAIN_OVERVIEW = 'DOMAIN_OVERVIEW';
export const FOLLOW_PAGE_INPROGRESS = 'FOLLOW_PAGE_INPROGRESS';
export const FOLLOW_PAGE = 'FOLLOW_PAGE';

import { api } from '../../../../../@fuse/utils';
import {
	API_OVERVIEW,
	API_FOLLOW_A_DOMAIN,
	API_UN_FOLLOW_A_DOMAIN,
	API_FOLLOW_A_FB_PAGE,
	API_UN_FOLLOW_A_FB_PAGE,
	API_GET_TRENDING
} from '../../../../../@fuse/config/constants';
import * as ActionsLayout from '../../../../../layout/store/actions';
import * as helper from '../../../../../@fuse/utils/helpers';

export function getStoreOverview(platform) {
	return dispatch => {
		dispatch(ActionsLayout.onLoading(0));
		api.get(API_OVERVIEW, { domain: new URL(window.location).host, platform }).then(async response => {
			if (response.data.hasBestSelling) {
				dispatch(ActionsLayout.routeChildTo(1));
			} else if (response.data.hasTrending) {
				dispatch(ActionsLayout.routeChildTo(2));
			} else {
				dispatch(ActionsLayout.routeChildTo(0));
			}
			dispatch(ActionsLayout.offLoading());

			dispatch({
				type: DOMAIN_OVERVIEW,
				payload: response.data
			});
		});
	};
}
export function followStore(domain) {
	return dispatch =>
		api
			.post(API_FOLLOW_A_DOMAIN, { domains: [domain] })
			.then(response => {
				dispatch({
					type: DOMAIN_OVERVIEW,
					payload: {
						isFollowInProgress: false,
						userHasFollowDomain: true
					}
				});
			})
			.catch(error => {
				if (error.response && error.response.status == 403) {
					dispatch(ActionsLayout.toggleLogin(true));
				} else if (error.response.data && error.response.data.data.obj) {
					let { current_domain_length, just_added, limit_number_of_domain } = error.response.data.data.obj;
					alert(
						`Your number of current stores are ${current_domain_length}. You can only add maximum ${limit_number_of_domain}, you have just added ${just_added} store more!`
					);
				} else {
					alert(error.response.data.message);
				}
				dispatch({
					type: DOMAIN_OVERVIEW,
					payload: {
						isFollowInProgress: false,
						userHasFollowDomain: false
					}
				});
			});
}
export function unFollowStore(domain, user_id) {
	return dispatch =>
		api
			.delete(API_UN_FOLLOW_A_DOMAIN, { data: { domain } })
			.then(response => {
				dispatch({
					type: DOMAIN_OVERVIEW,
					payload: {
						isFollowInProgress: false,
						userHasFollowDomain: false
					}
				});
			})
			.catch(error => {
				if (error.response && error.response.status == 403) {
					dispatch(ActionsLayout.toggleLogin(true));
				}

				dispatch({
					type: DOMAIN_OVERVIEW,
					payload: {
						isFollowInProgress: false,
						userHasFollowDomain: true
					}
				});
			});
}
export function followFacebookPage(page) {
	return dispatch =>
		api
			.post(API_FOLLOW_A_FB_PAGE, { pages: [`facebook.com/${page}`] })
			.then(response =>
				dispatch({
					type: FOLLOW_PAGE,
					payload: {
						page,
						is_followed: true
					}
				})
			)
			.catch(error => {
				if (error.response && error.response.status == 403) {
					dispatch(ActionsLayout.toggleLogin(true));
				} else if (error.response.data && error.response.data.data.obj) {
					let {
						current_page_length,
						just_added,
						limit_number_of_facebook_page
					} = error.response.data.data.obj;
					alert(
						`Your number of current pages are ${current_page_length}. You can only add maximum ${limit_number_of_facebook_page}, You are only allowed to add ${just_added} pages more!`
					);
				} else {
					alert(error.response.data.message);
				}

				dispatch({
					type: FOLLOW_PAGE,
					payload: {
						page,
						is_followed: false
					}
				});
			});
}
export function unFollowFacebookPage(page) {
	return dispatch =>
		api
			.post(API_UN_FOLLOW_A_FB_PAGE, { data: { slug: page } })
			.then(response =>
				dispatch({
					type: FOLLOW_PAGE,
					payload: {
						page,
						is_followed: false
					}
				})
			)
			.catch(error => {
				if (error.response && error.response.status == 403) {
					dispatch(ActionsLayout.toggleLogin(true));
				}
				dispatch({
					type: FOLLOW_PAGE,
					payload: {
						page,
						is_followed: true
					}
				});
			});
}
export function followInProgressPage(page) {
	return dispatch =>
		dispatch({
			type: FOLLOW_PAGE_INPROGRESS,
			payload: {
				page,
				isFollowInProgress: true
			}
		});
}
export function followInProgressStore() {
	return dispatch =>
		dispatch({
			type: DOMAIN_OVERVIEW,
			payload: {
				isFollowInProgress: true
			}
		});
}
