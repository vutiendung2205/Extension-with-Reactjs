import React, { useEffect, useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import * as Actions from './store/actions';
import '../../../../scss/components/SupplierItem.scss';
import { useSelector } from 'react-redux';
import iconAlibaba from '../../../../images/img/icon_Alibaba.svg';
import iconAliexpress from '../../../../images/img/icon_Aliexpress.svg';
import iconAmazon from '../../../../images/img/icon_Amazon.svg';
import iconEbay from '../../../../images/img/icon_Ebay.svg';
import iconShopify from '../../../../images/img/icon_Shopify.svg';
import loading from '../../../../images/img/loading.svg';

import * as helper from '../../../@fuse/utils/helpers';
import CircleChart from './CircleChart';
import ListLinkSuppliers from './ListLinkSuppliers';

const mapSource = {
	Alibaba: 'alibabaSource',
	Aliexpress: 'aliexpressSource',
	Amazon: 'amazonSource',
	Ebay: 'ebaySource',
	Shopify: 'shopifySource'
};

function genTitleFlatform(isLinkAndPriceData, isShowVideoAliexpress, data, type, dispatch) {
	let srcImg = '';
	let styleImg = null;
	switch (type) {
		case 'Alibaba':
			srcImg = iconAlibaba;
			styleImg = { width: '18px' };
			break;
		case 'Aliexpress':
			srcImg = iconAliexpress;
			styleImg = { width: '23px', marginBottom: '-3px' };
			break;
		case 'Amazon':
			srcImg = iconAmazon;
			styleImg = { width: '20px', marginBottom: '-2px' };
			break;
		case 'Ebay':
			srcImg = iconEbay;
			styleImg = { width: '22px', marginBottom: '-1px' };
			break;
		case 'Shopify':
			srcImg = iconShopify;
			styleImg = { width: '22px', marginBottom: '-2px' };
			break;
	}
	let checkBox =
		type == 'Aliexpress' ? (
			<div className="ali-checkbox">
				{isLinkAndPriceData ? (
					<input
						type="checkbox"
						checked={isShowVideoAliexpress}
						onChange={event => handleChecked(dispatch)}
					/>
				) : (
					<div style={{ marginTop: '2px', marginRight: '3px' }}>
						<img width="20px" height="20px" src={chrome.extension.getURL(loading)} />
					</div>
				)}
				<span
					onClick={event => (isLinkAndPriceData ? handleSpanChecked(dispatch) : '')}
					style={{ marginLeft: '5px', cursor: 'pointer' }}
				>
					Have Video
				</span>
			</div>
		) : (
			''
		);

	return (
		<div className="list-link-title">
			<img src={chrome.extension.getURL(srcImg)} style={styleImg} />
			<span>&nbsp;{type}</span>
			{checkBox}
		</div>
	);
}

function handleChecked(dispatch) {
	dispatch(Actions.toggleShowVideoAliexpress());
}

function handleSpanChecked(dispatch) {
	return handleChecked(dispatch);
}

function configCircleChartBaseValue(value) {
	let borderColor = helper.getColorBaseValue(value);
	let waveColor = helper.getColorBaseValue(value);
	let waveFrequency = 1;
	let waveAmplitude = 1;

	if (value <= 20) {
		waveFrequency = 1; // mật độ sóng
		waveAmplitude = 7; // chiều cao sóng
	}

	if (value > 20 && value <= 40) {
		waveFrequency = 2;
		waveAmplitude = 10;
	}

	if (value > 40) {
		waveFrequency = 1;
		waveAmplitude = 10;
	}

	let configCircle = {
		radius: 140,
		value: value,
		borderColor: borderColor,
		waveColor: waveColor,
		waveFrequency: waveFrequency,
		waveAmplitude: waveAmplitude
	};

	return configCircle;
}

function SuppliersAndCompetitorsItem({ prices, config }) {
	const dispatch = useDispatch();
	const { isShowVideoAliexpress } = useSelector(({ suppliersAndCompetitors }) => suppliersAndCompetitors.ui);
	const { isLinkAndPriceData } = useSelector(({ suppliersAndCompetitors }) => suppliersAndCompetitors.priceObj);
	let dataShow = config.data;
	if (config.type == 'Aliexpress') {
		if (isShowVideoAliexpress) {
			let currentPrices = prices['Aliexpress'];
			dataShow = dataShow.filter(d => {
				let price = currentPrices.filter(c => {
					if (c && c.origin_link) {
						return c.origin_link == d.origin_link;
					}
				});
				return price[0] && price[0].video_id;
			});
		}
	}
	let configListLink = {
		data: dataShow,
		type: config.type,
		promo: config.promo
	};
	let configCircle = configCircleChartBaseValue(config.length);

	return (
		<div className="supplier-and-store-container">
			{genTitleFlatform(isLinkAndPriceData, isShowVideoAliexpress, dataShow, config.type, dispatch)}
			<div className="left-supplier">
				<CircleChart config={configCircle} type={config.type} />
			</div>
			<div className="right-supplier">
				<ListLinkSuppliers config={configListLink} />
			</div>
		</div>
	);
}

export default SuppliersAndCompetitorsItem;
