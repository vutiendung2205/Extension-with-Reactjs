import React, { useState, useEffect, useRef } from 'react';
import { useInfiniteScroll } from 'react-infinite-scroll-hook';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import * as Actions from './store/actions';
import { useDispatch, useSelector } from 'react-redux';
import FacebookAdsItem from './FacebookAdsItem';
import LoadingInfinity from '../../../../layout/components/LoadingInfinity';
import { useUpdateEffect } from '../../../../@fuse/utils/hooks';
import { FEATURES_ID } from '../../../../@fuse/config/constants';

let domain = new URL(window.location).host.replace('www.', '');

const FacebookAdsList = React.forwardRef(function ({ defaultSort }, ref) {
	const domainOverview = useSelector(({ overview }) => overview.domainOverview);
	const { hasNextPage, currentPage, currentLength } = useSelector(({ facebookAds }) => facebookAds.ui);

	const [loading, setLoading] = useState(false);

	const dispatch = useDispatch();
	const { ads, user_id, page } = useSelector(({ facebookAds }) => facebookAds.adsObj);
	const { searchText, searchType } = useSelector(({ layout }) => layout.header[FEATURES_ID.FACEBOOK_ADS]);
	const sort = useSelector(({ layout }) => layout.sort[searchType]);

	let search = searchText;
	const rootRef = useRef(null);
	React.useImperativeHandle(ref, () => {
		return {
			rootRef: rootRef,
			clearLoad: () => {
				dispatch(Actions.reloadScroll());
				setLoading(false);
			}
		};
	});

	function handleLoadMore() {
		setLoading(true);
		dispatch(
			Actions.appendAds(
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
		// This value is set to "true" for this demo only. You will need to
		// get this value from the API when you request your items.
		hasNextPage,
		onLoadMore: handleLoadMore,
		scrollContainer: 'parent'
	});

	return (
		<div ref={infiniteRef}>
			<div id="pg-product-list">
				{ads.map((item, i) => {
					return <FacebookAdsItem key={i} item={item} userId={user_id} />;
				})}
			</div>
			{loading && <LoadingInfinity />}
		</div>
	);
});

export default FacebookAdsList;
