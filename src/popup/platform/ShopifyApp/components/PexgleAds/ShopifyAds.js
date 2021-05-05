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
let searchInput = '';
let searchAdsInput = '';
let isRun = false;
const trimArr = arr => {
	let result = [];
	arr.map(a => {
		result.push(a.trim());
	});
	return result;
};
function ShopifyAds(props) {
	const dispatch = useDispatch();
	const pexgleAdsObj = useSelector(({ pexgleAds }) => {
		return pexgleAds.pexgleAdsObj;
	});
	useFirstEffect(() => {
		if (pexgleAdsObj == null || pexgleAdsObj.time + CYCLE_TIME_GET_PEXGLE_ADS < new Date().getTime()) {
			dispatch(Actions.getShopifyAdsOfPexgle());
		}
	}, [pexgleAdsObj, dispatch]);

	// if (pexgleAdsObj == null || (pexgleAdsObj.time + CYCLE_TIME_GET_PEXGLE_ADS) < new Date().getTime()) {
	//   dispatch(Actions.getShopifyAdsOfPexgle());
	// }
	if (
		pexgleAdsObj != null &&
		isRun === false &&
		pexgleAdsObj.time + CYCLE_TIME_GET_PEXGLE_ADS > new Date().getTime()
	) {
		isRun = true;
		let url = window.location.href;
		let current = moment().isoWeekday() + '-' + moment().hour();
		if (url == 'https://apps.shopify.com/' || url.includes('https://apps.shopify.com/?utm_content=')) {
			// Replace Staffpick Spotlight Apps
			let sponsorSpotlight = pexgleAdsObj.data.filter(
				s => s.show_times.includes(current) && s.platform == 'SHOPIFY' && s.position == 'SHOPIFY_SPOTLIGHT_APP'
			);
			let arr = $('.featured-app-group__item');
			let listRemoveSpotLightLink = [];
			sponsorSpotlight.map(s => {
				s.new_feed_position.map(i => {
					if (i <= 4) {
						$(arr[i - 1]).replaceWith(s.content_html);
						listRemoveSpotLightLink = listRemoveSpotLightLink.concat(
							trimArr(s.data.link_remove.value.split(','))
						);
					}
				});
			});
			// Remove competitor's apps
			for (let i = 0; i < arr.length; i++) {
				let staffPickLink = $(arr[i]).find('a').first().attr('href');
				if (listRemoveSpotLightLink.indexOf(staffPickLink) >= 0) {
					$(arr[i]).remove();
				}
			}
			// Replace Trending apps
			let sponsorTrending = pexgleAdsObj.data.filter(
				s => s.show_times.includes(current) && s.platform == 'SHOPIFY' && s.position == 'SHOPIFY_TRENDING_APP'
			);
			let listSmallAppSection = $('.section.section--tight.app-collection');
			let listRemoveTrendingLink = [];
			for (let i = 0; i < listSmallAppSection.length; i++) {
				if (
					$(listSmallAppSection[i]).find('.heading--3.app-collection__heading').text().trim() ==
					'Trending apps'
				) {
					let listTrendingApps = $(listSmallAppSection[i]).find('.app-collection__item');
					sponsorTrending.map(s => {
						listRemoveTrendingLink = listRemoveTrendingLink.concat(
							trimArr(s.data.link_remove.value.split(','))
						);
						s.new_feed_position.map(i => {
							$(listTrendingApps[i - 1]).replaceWith(s.content_html);
						});
					});
					for (let i = 0; i < listTrendingApps.length; i++) {
						let trendingLink = $(listTrendingApps[i]).find('a').first().attr('href');
						if (listRemoveTrendingLink.indexOf(trendingLink) >= 0) {
							$(listTrendingApps[i]).remove();
						}
					}
				}
			}
		}
		if (
			url.includes('https://apps.shopify.com/browse') ||
			url.includes('https://apps.shopify.com/search?q=') ||
			url.includes('&q=')
		) {
			let arr = $('.grid__item.grid__item--tablet-up-half.grid-item--app-card-listing');
			let current = moment().isoWeekday() + '-' + moment().hour();
			let sponsorTemplate = pexgleAdsObj.data.filter(
				s => s.show_times.includes(current) && s.platform == 'SHOPIFY' && s.position == 'SHOPIFY_APP'
			);
			let matchSponsorTemplate = [];
			if (url.includes('https://apps.shopify.com/browse')) {
				sponsorTemplate.map(s => {
					if (s.data.categories.value) {
						let categories = trimArr(s.data.categories.value.split(','));
						categories.map(cat => {
							if (url.includes(cat)) {
								matchSponsorTemplate.push(s);
							}
						});
					}
				});
			} else {
				// get search key word
				let keyword = '';
				if (url.includes('?q=')) keyword = url.substring(url.indexOf('q=') + 2, url.indexOf('&'));
				else keyword = url.substring(url.indexOf('&q=') + 3, url.indexOf('&requirements'));
				//---------------------------------------------------------------------------
				sponsorTemplate.map(s => {
					if (s.data.keyword.value) {
						if (s.data.keyword.value.includes(keyword)) matchSponsorTemplate.push(s);
					}
				});
			}
			let results = $('.search-filters__header.search-results__grid .grid__item.grid__item--tablet-up-half');
			let str = $(results[0]).text().trim();
			let foundedNum =
				str.length <= 9
					? parseInt(str.substring(str.indexOf('result') - 2, str.indexOf('result') - 1))
					: parseInt(str.substring(str.indexOf('result') - 3, str.indexOf('result') - 1));
			let insertedNum = 0;
			matchSponsorTemplate.map(template => {
				let findPexdy = $('.grid__item.grid__item--tablet-up-half.grid-item--app-card-listing h4');
				if (arr.length == 0) {
					$('#SearchResultsListings').append(template.content_html);
				} else {
					// Check if exist Pexdy ad
					let checkPexdy = false;
					let pexdyPosition = 0;
					for (let i = 0; i < findPexdy.length; i++) {
						if ($(findPexdy[i]).text().trim() == template.data.title.value.trim()) {
							checkPexdy = true;
							pexdyPosition = i;
						}
					}
					//check pexdy position
					template.new_feed_position.map(e => {
						if (checkPexdy) {
							// if(pexdyPosition != 0 && pexdyPosition > e){
							//   $(arr[pexdyPosition]).remove()
							//   $(template.content_html).insertBefore(arr[e - 1]);
							// }
							$(arr[pexdyPosition]).remove();
							arr.length >= e
								? $(template.content_html).insertBefore(arr[e - 1])
								: $(template.content_html).insertBefore(arr[pexdyPosition]);
							insertedNum++;
						} else {
							if (arr.length >= e) {
								$(template.content_html).insertBefore(arr[e - 1]);
								insertedNum++;
							}
						}
					});
				}

				/* ===============================================================================
          Remove competitor apps
          ===============================================================================
          **/
				let listRemoveLink = trimArr(template.data.remove_ads_keyword.value.split(','));
				let listLinkOnWeb = $('a.ui-app-card');
				for (let index = 0; index < listRemoveLink.length; index++) {
					let removeItem = listRemoveLink[index];
					if (
						listLinkOnWeb.filter((index, element) => {
							return element.href.indexOf(removeItem) >= 0;
						}).length > 0
					) {
						$(arr[index].remove());
					}
				}

				/*
        ================================================================================
        **/
			});
			str = str.replace(foundedNum + '', foundedNum + insertedNum + '');
			if (foundedNum == 1) str = str.trim() + 's';
			$(results[0]).html(str);
		}
	}
	return null;
}

export default withReducer('pexgleAds', reducer)(ShopifyAds);
