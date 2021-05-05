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

CYCLE_TIME_GET_PEXGLE_ADS;
let isRun = false;
function AliexpressAds(props) {
	const showAds = sponsorTemplate => {
		let paramUrl = window.location.search;
		if (sponsorTemplate.length == 0) return null;
		if (paramUrl.indexOf('brandValueIds=') == -1) {
			$('.store-direct-container').prepend(sponsorTemplate[0].content_html);
		}
	};

	const dispatch = useDispatch();
	const AliexpressAdsObj = useSelector(({ pexgleAds }) => {
		return pexgleAds.pexgleAdsObj;
	});
	useFirstEffect(() => {
		dispatch(Actions.getAliexpressAds());
	}, [AliexpressAdsObj, dispatch]);
	if (
		AliexpressAdsObj != null &&
		isRun === false &&
		AliexpressAdsObj.time + CYCLE_TIME_GET_PEXGLE_ADS > new Date().getTime()
	) {
		isRun = true;
		let current = moment().isoWeekday() + '-' + moment().hour();
		let sponsorTemplate = AliexpressAdsObj.data.filter(
			s =>
				s.show_times.includes(current) &&
				s.platform == 'ALIEXPRESS' &&
				s.position == 'ALIEXPRESS_CATEGORY_BANNER'
		);
		showAds(sponsorTemplate);
	}
	return null;
}

export default withReducer('pexgleAds', reducer)(AliexpressAds);
