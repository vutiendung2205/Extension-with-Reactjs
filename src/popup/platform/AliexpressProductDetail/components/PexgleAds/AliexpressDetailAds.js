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
function AliexpressDetailAds(props) {
	const showAds = sponsorTemplate => {
		if (sponsorTemplate.length == 0) return null;
		$('.product-main-wrap .may-like[exp_page_area=recommended_for_you]').html(sponsorTemplate[0].content_html);
	};

	const dispatch = useDispatch();
	const AliexpressDetailAdsObj = useSelector(({ pexgleAds }) => {
		return pexgleAds.pexgleAdsObj;
	});
	useFirstEffect(() => {
		dispatch(Actions.getAliexpressDetailAds());
	}, [AliexpressDetailAdsObj, dispatch]);
	if (
		AliexpressDetailAdsObj &&
		isRun === false &&
		AliexpressDetailAdsObj.time + CYCLE_TIME_GET_PEXGLE_ADS > new Date().getTime()
	) {
		isRun = true;
		let current = moment().isoWeekday() + '-' + moment().hour();
		let sponsorTemplate = AliexpressDetailAdsObj.data.filter(
			s =>
				s.show_times.includes(current) &&
				s.platform == 'ALIEXPRESS' &&
				s.position == 'ALIEXPRESS_PRODUCT_DETAIL'
		);
		if (sponsorTemplate.length > 0) {
			showAds(sponsorTemplate);
		}
	}
	return null;
}

export default withReducer('pexgleAds', reducer)(AliexpressDetailAds);
