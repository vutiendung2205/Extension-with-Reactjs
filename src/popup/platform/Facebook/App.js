import React, { useState } from 'react';
import Provider from 'react-redux/es/components/Provider';

import FacebookAds from './components/PexgleAds/FacebookAds';
import * as ActionRoot from '../../store/actions';

import store from '../../store';
import AppContext from '../AppContext';
import '../../../scss/components/App';
import axios from 'axios';
import moment from 'moment';

var _ = require('lodash');
import { api } from '../../@fuse/utils';
import { API_SAVE_FACEBOOK_ADS_TRACKING } from '../../@fuse/config/constants';
let findValuesDeepByKey = (obj, key, res = []) =>
	_.cloneDeepWith(obj, (v, k) => {
		k == key && res.push(v);
	}) && res;
import $ from 'jquery';

let isBody = true;
const getDetailAds = html1 => {
	var feedback_context = findValuesDeepByKey(html1, 'feedback_context')[0];
	var post_id = findValuesDeepByKey(feedback_context, 'subscription_target_id')[0];

	var total_comments = findValuesDeepByKey(html1, 'comment_count')[0].total_count;
	var shares = findValuesDeepByKey(html1, 'share_count')[0].count;
	var reactions = findValuesDeepByKey(html1, 'reaction_count').filter(t => typeof t == 'object')[0].count;

	var video_id = findValuesDeepByKey(html1, 'videoId')[0];
	let page_id = findValuesDeepByKey(html1, 'owning_profile_id')[0];

	var comet_sections = findValuesDeepByKey(html1, 'comet_sections')[0];
	var content = comet_sections ? findValuesDeepByKey(comet_sections, 'text')[0] : '';
	var action = findValuesDeepByKey(html1, 'call_to_action_renderer')[0];
	var post_date = findValuesDeepByKey(html1, 'publish_time')[0]
		? findValuesDeepByKey(html1, 'publish_time')[0]
		: findValuesDeepByKey(html1, 'creation_time')[0];
	var comet_footer_renderer = findValuesDeepByKey(html1, 'comet_footer_renderer')[0];
	// let urls = [].concat.apply([], findValuesDeepByKey(html1, "url")).filter(e => !!e && e.includes("com/l.php"));
	let title = '';
	try {
		title = findValuesDeepByKey(comet_footer_renderer, 'title_with_entities')[0]
			? findValuesDeepByKey(comet_footer_renderer, 'title_with_entities')[0].text
			: findValuesDeepByKey(html1, 'link_title').filter(e => !!e)[0];
	} catch (error) {}
	action = action ? findValuesDeepByKey(action, 'link_type')[0] : '';

	let media = findValuesDeepByKey(html1, 'media')[0];
	let image = media[Object.keys(media).filter(key => media[key] && media[key].uri)[0]];

	return {
		post_id,
		page_id,
		comments: total_comments ? total_comments : 0,
		shares: shares ? shares : 0,
		reactions: reactions ? reactions : 0,
		video_id,
		content,
		action,
		// urls,
		post_date: post_date ? post_date : 0,
		title,
		image: image.uri,
		feature_image: image.uri
	};
};
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.type == 'request_post') {
		if (isBody) {
			isBody = false;
			const scripts = $('script');

			for (let i = 0; i < scripts.length; i++) {
				var html = $(scripts[i]).html();
				if (html.includes(`"SPONSORED"`)) {
					var htmlx = html.substring(
						html.indexOf('(new ServerJS()).handleWithCustomApplyEach(ScheduledApplyEach,{'),
						html.length
					);
					htmlx = htmlx
						.replace(`(new ServerJS()).handleWithCustomApplyEach(ScheduledApplyEach,`, '')
						.split('});')[0];
					htmlx = JSON.parse(htmlx + '}');
					htmlx = htmlx.require
						.filter(elm => elm && elm[0] == 'RelayPrefetchedStreamCache')
						.map(e => {
							e = findValuesDeepByKey(e, '__bbox');
							e = findValuesDeepByKey(e, 'data')[0];
							if (findValuesDeepByKey(e, 'category')[0] == 'SPONSORED') {
								// let post_id = findValuesDeepByKey(e, "subscription_target_id")[0];
								// let page_id = findValuesDeepByKey(e, "owning_profile")[0].id;

								// let reactions = findValuesDeepByKey(e, "reaction_count")[0].count;
								// let shares = findValuesDeepByKey(e, "share_count")[0].count;
								// let comments = findValuesDeepByKey(e, "comment_count")[0].total_count;
								api.post(API_SAVE_FACEBOOK_ADS_TRACKING, { data: { ...getDetailAds(e) } });
							}
						});
				}
			}
		}

		if (message.body.includes('RELAY_INCREMENTAL_DELIVERY')) {
			axios
				.post(message.url, message.body + '&test=1')
				.then(result => {
					// Do somthing
					// console.log(result.data);
					let d = result.data
						.split('\n')
						.filter(e => !!e.trim())
						.map(e => JSON.parse(e))
						.filter(e => findValuesDeepByKey(e, 'category')[0] == 'SPONSORED');
					for (let ads of d) {
						api.post(API_SAVE_FACEBOOK_ADS_TRACKING, { data: { ...getDetailAds(ads) } });
					}
				})
				.catch(err => {
					// Do somthing
					console.log(err);
				});
		}
	}
	return true;
});
/**
 * Cấu trúc các thành phần giao diện
 * Truyền các config chính cho platfrom
 * Quản lý event Ẩn/Hiện extension
 * @param {*} pageType Loại page của platform
 * @param {*} isExtensionOpen status Open Extension
 */
const App = ({ pageType }) => {
	return (
		<AppContext.Provider>
			<Provider store={store}>
				{
					<div id="pexgle-shadow" className="pexgle-shadow">
						<div id="cornerContent" className="corner-content">
							<div id="pgContentContainer" className="content-container">
								<div id="main-content">
									<FacebookAds></FacebookAds>
								</div>
							</div>
						</div>
					</div>
				}
			</Provider>
		</AppContext.Provider>
	);
};

export default App;
