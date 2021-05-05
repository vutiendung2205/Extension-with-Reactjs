import React, { useEffect, useRef, useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import withReducer from '../../../../store/withReducer';
import * as Actions from './store/actions';
import * as ActionsLayout from '../../../../layout/store/actions';

import reducer from './store/reducers';
import { useSelector } from 'react-redux';
import '../../../../../scss/components/BestSelling';
import '../../../../../scss/components/DateFilter.scss';
import { useUpdateEffect, useFirstEffect, useDiffUpdateEffect } from '../../../../@fuse/utils/hooks';
import LoadingTab from '../../../../layout/components/LoadingTab';
import BestSellingList from './BestSellingList';
import Sort from '../../../../layout/components/Sort';
import NoData from '../../../../layout/components/NoData';
import useDebounce from '../../../../layout/components/use-debounce';

import { PEXGLE_HOST, FEATURES_ID } from '../../../../@fuse/config/constants';

let domain = new URL(window.location).host.replace('www.', '');
function BestSellingTab(props) {
	const dispatch = useDispatch();
	const bestSellingObj = useSelector(({ bestSelling }) => bestSelling.bestSellingObj);
	const domainOverview = useSelector(({ overview }) => overview.domainOverview);

	let list = useRef(null);
	let defaultSort = {
		title: 'Highest Orders',
		key: 'sort-highest-recent-order-7-days'
	};
	let sorts = [
		{
			title: 'Highest Orders',
			key: 'sort-highest-recent-order-7-days'
		},
		{
			title: 'Highest Growth',
			key: 'sort-highest-grow-3-order'
		},
		{
			title: 'Highest Price',
			key: 'price_high_low'
		},
		{
			title: 'Lowest Orders',
			key: 'sort-lowest-recent-order-7-days'
		},
		{
			title: 'Lowest Growth',
			key: 'sort-lowest-grow-3-order'
		},
		{
			title: 'Lowest Price',
			key: 'price_low_high'
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
		// {
		//     title: 'Lowest Order in recent 3 days',
		//     key: 'sort-lowest-recent-order-3-days'
		// }, {
		//     title: 'Highest Order in recent 3 days',
		//     key: 'sort-highest-recent-order-3-days'
		// },
	];
	let { searchText, searchType } = useSelector(({ layout }) =>
		layout.header[FEATURES_ID.BEST_SELLING] ? layout.header[FEATURES_ID.BEST_SELLING] : {}
	);
	let { childIndex } = useSelector(({ layout }) => layout.router);

	const sort = useSelector(({ layout }) => layout.sort[searchType]);
	searchText = searchText ? searchText : {};

	let search = useDebounce(searchText[childIndex], 500);
	useDiffUpdateEffect(() => {
		list.current && list.current.clearLoad();
		dispatch(
			Actions.getBestSelling(
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
		!bestSellingObj.isData &&
			dispatch(
				Actions.getBestSelling(
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
		dispatch(ActionsLayout.setHeader({ [FEATURES_ID.BEST_SELLING]: { searchDisabled: false } }));
	}, [sort, search, domainOverview, bestSellingObj, dispatch]);
	return bestSellingObj.isData ? (
		bestSellingObj.products.length > 0 ? (
			<div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
				<div className="tab-content ads-date-filter">
					<div className="pg-header-container">
						<h2 className="pg-header">
							Winning&nbsp;
							<span style={{ color: '#fa6742' }}>
								Now
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
									href={PEXGLE_HOST + '/best-selling?only_favorite=1'}
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
					<BestSellingList ref={list} defaultSort={defaultSort} />
				</div>
			</div>
		) : (
			<NoData />
		)
	) : (
		<LoadingTab />
	);
}

export default withReducer('bestSelling', reducer)(BestSellingTab);
