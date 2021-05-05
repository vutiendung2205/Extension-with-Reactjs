import React, { useState, useEffect, useRef } from 'react';
import { useInfiniteScroll } from 'react-infinite-scroll-hook';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import * as Actions from './store/actions';
import { useDispatch, useSelector } from 'react-redux';
import TrendingItem from './TrendingItem';
import LoadingInfinity from '../../../../apps/components/LoadingInfinity';
import { useUpdateEffect } from '../../../../@fuse/utils/hooks';
import { FEATURES_ID } from '../../../../@fuse/config/constants';

let domain = new URL(window.location).host.replace('www.', '');

const TrendingList = React.forwardRef(function ({ defaultSort, index }, ref) {
	const domainOverview = useSelector(({ overview }) => overview.domainOverview);
	const { hasNextPage, currentPage, currentLength } = useSelector(({ trending }) => trending.ui);
	const [loading, setLoading] = useState(false);
	let { childIndex } = useSelector(({ layout }) => layout.router);

	const dispatch = useDispatch();
	const { products, user_id, page, loadInsite } = useSelector(({ trending }) => {
		return trending.trendingObj;
	});
	let { searchText, searchType } = useSelector(({ layout }) => layout.header[FEATURES_ID.BEST_SELLING]);
	const sort = useSelector(({ layout }) => layout.sort[searchType]);
	searchText = searchText ? searchText : {};
	let search = searchText[childIndex];
	const rootRef = useRef(null);
	React.useImperativeHandle(ref, () => {
		return {
			rootRef: rootRef,
			clearLoad: () => {
				dispatch(Actions.reloadScroll());
				// setCurrentPage(2);
				// setHasNextPage(true);
				// setCurrentLength(6);
				setLoading(false);
			}
		};
	});
	// useEffect(() => {
	//   // dispatch(Actions.setScroll({
	//   //   hasNextPage: listTrending.length != 0 && currentLength >= 6
	//   // }));
	// }, [listTrending]);
	function handleLoadMore() {
		setLoading(true);
		dispatch(
			Actions.appendTrending(
				{
					domain,
					page: currentPage,
					search,
					sort: sort && sort.key ? sort.key : defaultSort.key,
					applyFilter: false
				},
				length => {
					dispatch(
						Actions.setScroll({
							hasNextPage: length >= 6,
							currentPage: currentPage + 1,
							currentLength: length
						})
					);

					setLoading(false);
				}
			)
		);
	}
	const infiniteRef = useInfiniteScroll({
		loading,
		hasNextPage: hasNextPage,
		onLoadMore: handleLoadMore,
		scrollContainer: 'parent'
	});
	return (
		<div ref={infiniteRef}>
			<div id="pg-product-list">
				{products.map((item, i) => {
					return <TrendingItem key={i} dataItem={item} userId={user_id} />;
				})}
			</div>
			{loading && <LoadingInfinity />}
		</div>
	);
});

export default TrendingList;
