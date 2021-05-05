import React, { useEffect, useRef, useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import withReducer from '../../../../store/withReducer';
import * as Actions from './store/actions';
import * as ActionsLayout from '../../../../apps/store/actions';

import reducer from './store/reducers';
import { useSelector } from 'react-redux';
import '../../../../../scss/components/BestSelling';
import '../../../../../scss/components/DateFilter.scss';
import { useUpdateEffect, useFirstEffect, useDiffUpdateEffect } from '../../../../@fuse/utils/hooks';
import LoadingTab from '../../../../apps/components/LoadingTab';
import TrendingList from './TrendingList';
import Sort from '../../../../apps/components/Sort';
import NoData from '../../../../apps/components/NoData';
import useDebounce from '../../../../apps/components/use-debounce';

import { PEXGLE_HOST, FEATURES_ID } from '../../../../@fuse/config/constants';

let domain = new URL(window.location).host.replace('www.', '');
function TrendingTab(props) {
	const dispatch = useDispatch();
	const trendingObj = useSelector(({ trending }) => trending.trendingObj);
	const domainOverview = useSelector(({ overview }) => overview.domainOverview);
	let list = useRef(null);
	let defaultSort = {
		title: 'Highest traffic',
		key: 'highest_traffic'
	};
	let sorts = [
		{
			title: 'Highest traffic',
			key: 'highest_traffic'
		},
		{
			title: 'Highest growth',
			key: 'highest_change'
		},
		{
			title: 'Highest price',
			key: 'highest_price'
		},
		{
			title: 'Lowest traffic',
			key: 'lowest_traffic'
		},
		{
			title: 'Lowest growth',
			key: 'lowest_change'
		},
		{
			title: 'Lowest price',
			key: 'lowest_price'
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
			title: 'Name',
			key: 'name'
		}
	];
	let { childIndex } = useSelector(({ layout }) => layout.router);

	let { searchText, searchType } = useSelector(({ layout }) =>
		layout.header[FEATURES_ID.BEST_SELLING] ? layout.header[FEATURES_ID.BEST_SELLING] : {}
	);
	const sort = useSelector(({ layout }) => layout.sort[searchType]);
	searchText = searchText ? searchText : {};
	let search = useDebounce(searchText[childIndex], 500);
	useDiffUpdateEffect(() => {
		list.current && list.current.clearLoad();
		dispatch(
			Actions.getTrending(
				{
					domain,
					page: 1,
					applyFilter: false,
					search,
					sort: sort ? sort.key : defaultSort.key
				},
				true,
				FEATURES_ID.BEST_SELLING
			)
		);
	}, [sort, domainOverview, search, dispatch]);

	useFirstEffect(() => {
		!trendingObj.isData &&
			dispatch(
				Actions.getTrending(
					{
						domain,
						page: 1,
						applyFilter: false,
						search,
						sort: sort ? sort.key : defaultSort.key
					},
					false,
					FEATURES_ID.BEST_SELLING
				)
			);
		trendingObj.loadInsite &&
			dispatch(ActionsLayout.setHeader({ [FEATURES_ID.BEST_SELLING]: { searchDisabled: true } }));
	}, [sort, search, domainOverview, trendingObj, dispatch]);
	return trendingObj.isData ? (
		trendingObj.products.length > 0 ? (
			<div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
				<div className="tab-content ads-date-filter">
					<div className="pg-header-container">
						<h2 className="pg-header">
							Lastest&nbsp;
							<span style={{ color: '#fa6742' }}>
								Trending
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
							<Sort
								sorts={sorts}
								defaultSort={defaultSort}
								searchType={searchType}
								disabled={trendingObj.loadInsite}
							/>
							<div style={{ display: 'flex', placeItems: 'center' }}>
								<a
									className="sort-favorite scss-tooltip scss-tooltip--s"
									data-scss-tooltip="Show me my favorites."
									style={{ color: '#758796', fontSize: '13px' }}
									target="_blank"
									href={PEXGLE_HOST + '/trending-products?only_favorite=1'}
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
					<TrendingList ref={list} defaultSort={defaultSort} />
				</div>
			</div>
		) : (
			<NoData />
		)
	) : (
		<LoadingTab />
	);
}

export default withReducer('trending', reducer)(TrendingTab);
