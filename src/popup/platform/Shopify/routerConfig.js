import React from 'react';

import OverviewTab from '../Common/Overview/OverviewTab';
import FacebookAdsTab from './components/FacebookAds/FacebookAdsTab';
import SuppliersAndCompetitorsTab from '../Common/SuppliersAndCompetitors/SuppliersAndCompetitorsTab';
import BestSellingTab from './components/BestSelling/BestSellingTab';
import TrendingTab from './components/Trending/TrendingTab';
import NewAddedTab from './components/NewAdded/NewAddedTab';

import iconHome from '../../../images/img/icon_home.svg';
import iconBestSelling from '../../../images/img/icon_best_selling.svg';
import iconFacebookAds from '../../../images/img/icon_fb_ads.svg';
import iconSupplierAndStore from '../../../images/img/icon-cart.svg';
import { FEATURES_ID, SEARCH_TYPE } from '../../@fuse/config/constants';
/**
 * Config component của các tab và các config mặc định
 */
export default [
	{
		component: OverviewTab,
		title: 'Overview',
		icon: iconHome,
		currentFeature: FEATURES_ID.OVER_VIEW,
		platform: ['shopify', 'woocommerce'],
		header: {
			isShowLogo: true,
			title: '',
			isShowBack: false,
			isShowSearch: false
		}
	},
	{
		title: 'Winning product',
		icon: iconBestSelling,
		currentFeature: FEATURES_ID.BEST_SELLING,
		platform: ['shopify'],

		childrenMenu: [
			{
				id: 'newAdded',
				label: 'Newly Added',
				component: NewAddedTab,
				addTime: 10,
				header: {
					isShowLogo: false,
					title: 'Newly Added Products',
					isShowBack: false,
					isShowSearch: false,
					searchType: SEARCH_TYPE.BEST_SELLING,
					searchTitle: 'Search new added product'
				}
			},
			{
				id: 'winning',
				label: 'Winning',
				component: BestSellingTab,
				header: {
					isShowLogo: false,
					title: '',
					isShowBack: false,
					isShowSearch: true,
					searchType: SEARCH_TYPE.BEST_SELLING,
					searchTitle: 'Search winning product'
				}
			},
			{
				id: 'trending',
				label: 'Trending',
				component: TrendingTab,
				header: {
					isShowLogo: false,
					title: '',
					isShowBack: false,
					isShowSearch: true,
					searchType: SEARCH_TYPE.TRENDING,
					searchTitle: 'Search trending product'
				}
			}
		]
	},
	{
		component: FacebookAdsTab,
		title: 'Best Facebook Ads',
		icon: iconFacebookAds,
		currentFeature: FEATURES_ID.FACEBOOK_ADS,
		platform: ['shopify'],
		header: {
			isShowLogo: false,
			title: '',
			isShowBack: false,
			isShowSearch: true,
			searchType: SEARCH_TYPE.FACEBOOK_ADS,
			searchTitle: 'Search Ads'
		}
	},
	{
		component: SuppliersAndCompetitorsTab,
		title: 'Suppliers And Competitors',
		title_second: 'Only support product pages',
		icon: iconSupplierAndStore,
		currentFeature: FEATURES_ID.SUPPLIERS_AND_COMPETITORS,
		platform: ['shopify'],
		header: {
			isShowLogo: false,
			title: 'Suppliers & Competitors',
			isShowBack: false,
			isShowSearch: false
		},
		isDisable(pageType) {
			return pageType == 'product';
		}
	}
];
