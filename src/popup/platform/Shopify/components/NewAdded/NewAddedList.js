import React, { useState, useEffect, useRef } from 'react';
import { useInfiniteScroll } from 'react-infinite-scroll-hook';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import * as Actions from './store/actions';
import { useDispatch, useSelector } from 'react-redux';
import NewAddedItem from './NewAddedItem';
import LoadingInfinity from '../../../../layout/components/LoadingInfinity';
import { useUpdateEffect } from '../../../../@fuse/utils/hooks';
import { FEATURES_ID } from '../../../../@fuse/config/constants';

let domain = new URL(window.location).host.replace('www.', '');

const NewAddedList = React.forwardRef(function ({ index }, ref) {
	const { hasNextPage, currentPage } = useSelector(({ newadded }) => newadded.ui);
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();
	const { products, user_id } = useSelector(({ newadded }) => {
		return newadded.newProductObj;
	});
	const rootRef = useRef(null);
	React.useImperativeHandle(ref, () => {
		return {
			rootRef,
			clearLoad: () => {
				dispatch(Actions.reloadScroll());
				setLoading(false);
			}
		};
	});
	function handleLoadMore() {
		setLoading(true);
		dispatch(
			Actions.appendNewProduct(
				{
					domain,
					page: currentPage
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
					return <NewAddedItem key={i} dataItem={item} userId={user_id} />;
				})}
			</div>
			{loading && <LoadingInfinity />}
		</div>
	);
});

export default NewAddedList;
