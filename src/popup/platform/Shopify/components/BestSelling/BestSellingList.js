import React, { useState, useEffect, useRef } from 'react';
import { useInfiniteScroll } from 'react-infinite-scroll-hook';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import * as Actions from './store/actions';
import { useDispatch, useSelector } from 'react-redux';
import BestSellingItem from './BestSellingItem';
import LoadingInfinity from '../../../../layout/components/LoadingInfinity';
import { useUpdateEffect } from '../../../../@fuse/utils/hooks';
import { FEATURES_ID } from '../../../../@fuse/config/constants';

let domain = new URL(window.location).host.replace('www.', '');

const BestSellingList = React.forwardRef(function ({ defaultSort }, ref) {
	const domainOverview = useSelector(({ overview }) => overview.domainOverview);
	const { hasNextPage, currentPage, currentLength } = useSelector(({ bestSelling }) => bestSelling.ui);

	const [loading, setLoading] = useState(false);

	const dispatch = useDispatch();
	const { products, user_id, page } = useSelector(({ bestSelling }) => {
		return bestSelling.bestSellingObj;
	});
	let { searchText, searchType } = useSelector(({ layout }) => layout.header[FEATURES_ID.BEST_SELLING]);
	const sort = useSelector(({ layout }) => layout.sort[searchType]);
	searchText = searchText ? searchText : {};
	let search = searchText[1];
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
	//   //   hasNextPage: listBestSelling.length != 0 && currentLength >= 6
	//   // }));
	// }, [listBestSelling]);
	function handleLoadMore() {
		setLoading(true);
		dispatch(
			Actions.appendBestSelling(
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
		hasNextPage,
		onLoadMore: handleLoadMore,
		scrollContainer: 'parent'
	});
	return (
		<div ref={infiniteRef}>
			<div id="pg-product-list">
				{products.map((item, i) => {
					return <BestSellingItem key={i} dataItem={item} userId={user_id} length={products.length} />;
				})}
			</div>
			{loading && <LoadingInfinity />}
		</div>
	);
});

export default BestSellingList;
