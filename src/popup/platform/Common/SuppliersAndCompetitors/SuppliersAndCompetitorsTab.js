import React, { useEffect, useRef, useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import withReducer from '../../../store/withReducer';
import * as Actions from './store/actions';
import reducer from './store/reducers';
import { useSelector } from 'react-redux';
import '../../../../scss/components/Overview.scss';
import { useDebounce, useUpdateEffect, useFirstEffect, useDiffUpdateEffect } from '../../../@fuse/utils/hooks';
import LoadingTab from '../../../layout/components/LoadingTab';
import AppContext from '../../AppContext';
import StackedChart from './StackedChart';
import SupplierItem from './SuppliersAndCompetitorsItem';
import ShowMoreListLink from './ShowMoreListLink';
import NoData from '../../../layout/components/NoData';

const categories = ['Shopify', 'Aliexpress', 'Amazon', 'Ebay', 'Alibaba'];

function generateSuppliersAndStores(priceObj, objData) {
	return Object.keys(objData).map((e, i) => <SupplierItem prices={priceObj} config={objData[e]} key={i} />);
}

function getDataLenghtAndDataOfOneFlatform(linkProduct) {
	let data = linkProduct.resultv2;
	if (
		data &&
		(data.aliexpressSource.length != 0 ||
			data.shopifySource.length != 0 ||
			data.alibabaSource.length != 0 ||
			data.amazonSource.length != 0 ||
			data.ebaySource.length != 0)
	) {
		return {
			Shopify: {
				type: 'Shopify',
				length: data.shopifySource.length,
				data: data.shopifySource
			},
			Aliexpress: {
				type: 'Aliexpress',
				length: data.aliexpressSource.length,
				data: data.aliexpressSource,
				promo: linkProduct.promo
			},
			Amazon: {
				type: 'Amazon',
				length: data.amazonSource.length,
				data: data.amazonSource
			},
			Ebay: {
				type: 'Ebay',
				length: data.ebaySource.length,
				data: data.ebaySource
			},
			Alibaba: {
				type: 'Alibaba',
				length: data.alibabaSource.length,
				data: data.alibabaSource
			}
		};
	} else {
		return null;
	}
}

function SuppliersAndCompetitorsTab(props) {
	const dispatch = useDispatch();
	const appContext = useContext(AppContext);
	const { platform, pageType } = appContext;
	if (platform == 'shopify' && pageType != 'product') {
		return (
			<div id="hotProductEmpty" className=" vertical">
				<h3
					className="noData-title referrals"
					style={{ fontSize: '1.1em', color: '#b4b4b4', textTransform: 'inherit', margin: '0 20px' }}
				>
					The Suppliers and Competitors analysis feature only supports product pages
				</h3>
			</div>
		);
	} else {
		const { linkProduct, priceObj } = useSelector(({ suppliersAndCompetitors }) => suppliersAndCompetitors);
		const { isShowAllLink, platformShowMore } = useSelector(
			({ suppliersAndCompetitors }) => suppliersAndCompetitors.ui
		);
		useEffect(() => {
			!linkProduct.isData && dispatch(Actions.getLinkProduct(window.location.href));
		});
		let title = 'Number of Link';
		let objData = getDataLenghtAndDataOfOneFlatform(linkProduct);
		if (!objData && linkProduct.isData) {
			return <NoData />;
		}
		let listSuppliersAndStores = generateSuppliersAndStores(priceObj.listPriceOfLink, objData ? objData : []);
		let stackedChart = '';
		let style = {};
		if (linkProduct.resultv2) {
			stackedChart = <StackedChart title={title} data={objData} categories={categories} />;
		} else {
			style = { marginTop: '80px' };
		}
		let result = isShowAllLink ? (
			<ShowMoreListLink
				listLink={objData}
				listPriceOfLink={priceObj.listPriceOfLink}
				platform={platformShowMore}
			/>
		) : (
			<div style={{ marginTop: '2px' }}>
				{stackedChart}
				<div className="suppliers-and-stores-container" style={style}>
					{listSuppliersAndStores ? listSuppliersAndStores : ''}
				</div>
			</div>
		);

		return linkProduct.isData ? (
			<div className="pg-content" id="pg-tab-3">
				{result}
			</div>
		) : (
			<LoadingTab />
		);
	}
}

export default withReducer('suppliersAndCompetitors', reducer)(SuppliersAndCompetitorsTab);
