import React, { useEffect, useRef, useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import withReducer from '../../../../store/withReducer';
import * as Actions from './store/actions';
import reducer from './store/reducers';
import { useSelector } from 'react-redux';
import $ from 'jquery';
import { useDebounce, useUpdateEffect, useFirstEffect, useDiffUpdateEffect } from '../../../../@fuse/utils/hooks';
import moment from 'moment';

import { CYCLE_TIME_GET_PEXGLE_ADS } from '../../../../@fuse/config/constants';
let isRun = false;
function GoogleAds(props) {
	const showAds = sponsorTemplate => {
		let blockGoogle = $('.ads-ad, #search .bkWMgd  .g');
		for (let i = 0; i < blockGoogle.length; i++) {
			$.each(sponsorTemplate, function (index, template) {
				// let queryIndex = window.location.href.indexOf("q=");
				// if (queryIndex >= 0) {
				//     let href = window.location.href.substr(queryIndex + 2);
				//     let queryText = href.substr(0, href.indexOf("&"));
				//     if (template.new_feed_position.indexOf(i + 1) != -1 && template.data.keyword.value.indexOf(queryText) > -1) {
				//         $(template.content_html).insertBefore($(blockGoogle[i]));
				//     }
				// }
				if (template.new_feed_position.indexOf(i + 1) != -1) {
					$(template.content_html).insertBefore($(blockGoogle[i]));
				}
			});
		}
	};

	const dispatch = useDispatch();
	const googleAdsObj = useSelector(({ pexgleAds }) => {
		return pexgleAds.pexgleAdsObj;
	});
	useFirstEffect(() => {
		dispatch(Actions.getGoogleAds());
	}, [googleAdsObj, dispatch]);
	if (googleAdsObj && isRun === false && googleAdsObj.time + CYCLE_TIME_GET_PEXGLE_ADS > new Date().getTime()) {
		isRun = true;
		let textSearch = $('input[name=q]').val().toLowerCase();
		let current = moment().isoWeekday() + '-' + moment().hour();
		let sponsorTemplate = googleAdsObj.data.filter(
			s =>
				s.show_times.includes(current) &&
				s.platform == 'GOOGLE' &&
				s.position == 'GOOGLE_SEARCH' &&
				s.data.keyword.value.split('\n').filter(str => textSearch.includes(str) == true).length > 0
		);

		if (sponsorTemplate.length == 0) return null;
		showAds(sponsorTemplate);
	}
	return null;
}

export default withReducer('pexgleAds', reducer)(GoogleAds);
