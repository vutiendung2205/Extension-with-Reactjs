import React, { useEffect, useRef, useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import withReducer from '../../../../store/withReducer';
import * as Actions from './store/actions';
import reducer from './store/reducers';
import { useSelector } from 'react-redux';
import '../../../../../scss/components/BestSelling';
import '../../../../../scss/components/DateFilter.scss';

import { useDebounce, useUpdateEffect, useFirstEffect, useDiffUpdateEffect } from '../../../../@fuse/utils/hooks';
import LoadingTab from '../../../../layout/components/LoadingTab';
import OrderChart from './OrderChart';
import TopBuyCountries from './TopBuyCountries';

import { helpers } from '../../../../@fuse/utils';

function OrderStatisticTab(props) {
	const dispatch = useDispatch();
	const orderStatisticObj = useSelector(({ orderStatistic }) => {
		return orderStatistic.orderStatisticObj;
	});
	if (!orderStatisticObj) {
		return (
			<div className="pg-content" id="pg-tab-3">
				<div style={{ height: 80 }}></div>
				<NoData style={{ display: 'block', marginTop: '80px' }} />
			</div>
		);
	}
	let listCountry = orderStatisticObj.productDetail ? orderStatisticObj.productDetail.chart_all_country : [];
	let orderChart = orderStatisticObj.orderChart ? orderStatisticObj.orderChart : [];
	let sumOrder7days = orderStatisticObj.productDetail ? orderStatisticObj.productDetail.sum_order_7 : 0;
	let list = useRef(listCountry);
	useFirstEffect(() => {
		let productID = helpers.getAliexpressProductId(window.location.href);
		Actions.saveProductInformation(window.location.href);
		if (!orderStatisticObj.isData) {
			dispatch(Actions.getProductDetail(productID, false));
		}
	}, [orderStatisticObj.isData, orderStatisticObj.productDetail, dispatch]);
	return orderStatisticObj.isData ? (
		<div className="pg-content" id="pg-tab-3" style={{ background: '#fff' }}>
			<OrderChart orderChart={orderChart}></OrderChart>
			<TopBuyCountries listCountry={listCountry} sumOrder7days={sumOrder7days} ref={list} />
		</div>
	) : (
		<LoadingTab />
	);
}

export default withReducer('orderStatistic', reducer)(OrderStatisticTab);
