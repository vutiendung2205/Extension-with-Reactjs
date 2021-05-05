import React, { useEffect, useRef, useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import withReducer from '../../../../store/withReducer';
import * as Actions from './store/actions';
import reducer from './store/reducers';
import { useSelector } from 'react-redux';
import '../../../../../scss/components/BestSelling';
import '../../../../../scss/components/DateFilter.scss';
import { useUpdateEffect, useFirstEffect, useDiffUpdateEffect } from '../../../../@fuse/utils/hooks';
import LoadingTab from '../../../../layout/components/LoadingTab';
import NewAddedList from './NewAddedList';
import Sort from '../../../../layout/components/Sort';
import NoData from '../../../../layout/components/NoData';
import useDebounce from '../../../../layout/components/use-debounce';

import { PEXGLE_HOST, FEATURES_ID } from '../../../../@fuse/config/constants';

let domain = new URL(window.location).host.replace('www.', '');
function NewAddedTab(props) {
	const dispatch = useDispatch();
	const newProductObj = useSelector(({ newadded }) => newadded.newProductObj);
	const domainOverview = useSelector(({ overview }) => overview.domainOverview);

	let list = useRef(null);

	const { searchText, searchType } = useSelector(({ layout }) =>
		layout.header[FEATURES_ID.BEST_SELLING] ? layout.header[FEATURES_ID.BEST_SELLING] : {}
	);
	useDiffUpdateEffect(() => {
		list.current && list.current.clearLoad();
		dispatch(
			Actions.getNewProduct(
				{
					domain,
					page: 1
				},
				true
			)
		);
	}, [domainOverview, dispatch]);

	useFirstEffect(() => {
		!newProductObj.isData &&
			dispatch(
				Actions.getNewProduct(
					{
						domain,
						page: 1
					},
					false
				)
			);
	}, [domainOverview, newProductObj, dispatch]);
	return newProductObj.isData ? (
		newProductObj.products.length > 0 ? (
			<div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
				<div className="tab-content ads-date-filter">
					<div className="pg-header-container" style={{ height: '26px' }}>
						{/* <h2 className="pg-header">
                                New &nbsp;
                                 <span style={{ color: "#fa6742" }}>
                                    Added
                                    <span style={{ color: "#fa6742" }} />
                                </span>
                            </h2> */}
					</div>
				</div>
				<div className="pg-content" id="pg-tab-2">
					<NewAddedList ref={list} />
				</div>
			</div>
		) : (
			<NoData />
		)
	) : (
		<LoadingTab />
	);
}

export default withReducer('newadded', reducer)(NewAddedTab);
