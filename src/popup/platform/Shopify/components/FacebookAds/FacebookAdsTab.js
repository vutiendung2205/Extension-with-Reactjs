import React, { useEffect, useRef, useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import withReducer from '../../../../store/withReducer';
import * as Actions from './store/actions';
import reducer from './store/reducers';
import { useSelector } from 'react-redux';
import '../../../../../scss/components/FacebookAds';
import '../../../../../scss/components/DateFilter.scss';
import { useUpdateEffect, useFirstEffect, useDiffUpdateEffect } from '../../../../@fuse/utils/hooks';
import LoadingTab from '../../../../layout/components/LoadingTab';
import FacebookAdsList from './FacebookAdsList';
import Sort from '../../../../layout/components/Sort';
import { PEXGLE_HOST, FEATURES_ID } from '../../../../@fuse/config/constants';
import NoData from '../../../../layout/components/NoData';
import useDebounce from '../../../../layout/components/use-debounce';

let domain = new URL(window.location).host.replace('www.', '');

function FacebookAdsTab(props) {
	const dispatch = useDispatch();
	const adsObj = useSelector(({ facebookAds }) => facebookAds.adsObj);
	const domainOverview = useSelector(({ overview }) => overview.domainOverview);

	let list = useRef(null);
	let defaultSort = {
		title: 'Newest',
		key: 'newest'
	};
	let sorts = [
		{
			title: 'Name',
			key: 'name'
		},
		{
			title: 'Newest',
			key: 'newest'
		},
		{
			title: 'Oldest',
			key: 'oldest'
		},
		{
			title: 'Lowest reaction',
			key: 'reaction_low_high'
		},
		{
			title: 'Highest reaction',
			key: 'reaction_high_low'
		},
		{
			title: 'Lowest view',
			key: 'view_low_high'
		},
		{
			title: 'Highest view',
			key: 'view_high_low'
		},
		{
			title: 'Lowest share',
			key: 'share_low_high'
		},
		{
			title: 'Highest share',
			key: 'share_high_low'
		},
		{
			title: 'Lowest comment',
			key: 'comment_low_high'
		},
		{
			title: 'Highest comment',
			key: 'comment_high_low'
		}
	];
	const { searchText, searchType } = useSelector(({ layout }) =>
		layout.header[FEATURES_ID.FACEBOOK_ADS] ? layout.header[FEATURES_ID.FACEBOOK_ADS] : {}
	);
	const sort = useSelector(({ layout }) => layout.sort[searchType]);
	let search = useDebounce(searchText, 500);

	useDiffUpdateEffect(() => {
		list.current && list.current.clearLoad();
		dispatch(
			Actions.getAds(
				{
					domain,
					page: 1,
					applyFilter: false,
					search,
					sort: sort ? sort.key : defaultSort.key
				},
				true
			)
		);
	}, [sort, domainOverview, search, dispatch]);
	useFirstEffect(() => {
		!adsObj.isData &&
			dispatch(
				Actions.getAds(
					{
						domain,
						page: 1,
						applyFilter: false,
						search,
						sort: sort ? sort.key : defaultSort.key
					},
					false
				)
			);
	}, [sort, search, domainOverview, adsObj, dispatch]);

	return adsObj.isData ? (
		adsObj.ads.length > 0 ? (
			<div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
				<div className="tab-content ads-date-filter">
					<div className="pg-header-container">
						<h2 className="pg-header">
							Facebook&nbsp;
							<span style={{ color: '#fa6742' }}>
								Ads
								<span style={{ color: '#fa6742' }} />
							</span>
						</h2>
						<div
							className="pg-buttons"
							style={{
								margin: '30px 3px 0px',
								display: 'flex',
								alignItems: 'center'
							}}
						>
							<Sort sorts={sorts} defaultSort={defaultSort} searchType={searchType} />
							<div style={{ display: 'flex', placeItems: 'center' }}>
								<a
									className="sort-favorite scss-tooltip scss-tooltip--s"
									data-scss-tooltip="Show me my favorites."
									style={{ color: '#758796', fontSize: '13px' }}
									target="_blank"
									href={PEXGLE_HOST + '/best-facebook-ads?only_favorite=1'}
								>
									<label
										className="fa fa-heart favorite-link"
										style={{ marginLeft: '6px', marginRight: '3px', cursor: 'pointer' }}
									></label>
								</a>
							</div>
						</div>
					</div>
				</div>
				<div className="pg-content" id="pg-tab-2">
					<FacebookAdsList ref={list} defaultSort={defaultSort} />
				</div>
			</div>
		) : (
			<NoData />
		)
	) : (
		<LoadingTab />
	);
}

export default withReducer('facebookAds', reducer)(FacebookAdsTab);
