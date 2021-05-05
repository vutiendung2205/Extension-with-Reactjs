import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import * as Actions from './store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { isoCountries } from '../../../../@fuse/config/constants';
import ReactCountryFlag from 'react-country-flag';
import '../../../../../scss/components/TopCountry2.scss';

const listCountryStyle = {
	paddingTop: '200px',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	overflowY: 'auto',
	padding: '0 12px',
	background: '#fff',
	fontSize: '13px'
};
const countryStyle = {
	borderBottom: '1px solid #ededed',
	height: '50px',
	lineHeight: '50px',
	minWidth: '260px',
	display: 'flex'
};
const uFullWidthStyle = {
	width: '60px',
	marginLeft: '10px'
};
const swProgressBar = {
	height: '13px',
	width: '100%',
	maxWidth: '300px',
	minWidth: '30px',
	background: '#E9EBED',
	overflow: 'hidden',
	borderRadius: '10px',
	perspective: '0',
	// webkitBackfaceVisibility: 'hidden',
	backfaceVisibility: 'hidden',
	transform: 'translate3d(0, 0, 0)',
	marginTop: '17px'
};
const orderCountryPercent = {
	textAlign: 'right',
	marginLeft: '5px',
	width: '55px',
	overflow: 'hidden'
};
const countryNameChart = {
	maxWidth: '85px',
	overflow: 'hidden',
	whiteSpace: 'nowrap',
	textOverflow: 'ellipsis',
	marginLeft: '5px'
};
const numberProduct = {
	marginLeft: 'auto',
	display: 'flex'
};
const TopBuyCountries = React.forwardRef(function ({ listCountry }, ref) {
	const [loading, setLoading] = useState(false);

	const dispatch = useDispatch();
	// const { listCountry } = useSelector(({ orderStatistic }) => {
	//   return orderStatistic.listCountry;
	// });

	const rootRef = useRef(null);
	React.useImperativeHandle(ref, () => {
		return {
			rootRef: rootRef,
			clearLoad: () => {
				setLoading(false);
			}
		};
	});
	let result = [];
	let sumOrder = 0;
	if (!listCountry || listCountry.length == 0) {
		return (
			<div>
				<div className="title-pexgle">
					<span>&nbsp;Top Buying Countries</span>
				</div>
				<div
					id="list-top-country"
					style={{
						background: 'rgb(255, 255, 255)',
						textAlign: 'center',
						color: 'rgb(144, 148, 156)',
						fontSize: '15px',
						textShadow: 'rgb(255, 255, 255) 0px 1px 0px',
						fontFamily: 'Helvetica, Arial, sans-serif'
					}}
				>
					NOT ENOUGH DATA
				</div>
			</div>
		);
	} else {
		sumOrder = listCountry.map(l => l.quantity).reduce((a, b) => a + b);

		listCountry.map(e => {
			let flagCode = '';
			switch (e.country_code) {
				case 'srb':
					flagCode = 'rs';
					break;
				case 'uk':
					flagCode = 'gb';
					break;
				case 'mne':
					flagCode = 'me';
					break;
				case 'ks':
					flagCode = 'xk';
					break;
				default:
					flagCode = e.country_code;
			}
			result.push(
				<div className="country" key={e.country_code} name={flagCode} style={countryStyle}>
					<ReactCountryFlag
						styleProps={{
							width: '25px',
							height: '15px',
							marginTop: '17px'
						}}
						code={flagCode}
						svg
					/>
					<span style={countryNameChart} title={isoCountries[e.country_code.toUpperCase()]}>
						{isoCountries[e.country_code.toUpperCase()]}
					</span>
					<span style={numberProduct}>
						{e.quantity} orders
						<div style={uFullWidthStyle}>
							<div style={swProgressBar}>
								<div
									style={{
										background: '#3F70C7',
										height: '100%',
										position: 'relative',
										width: (e.quantity * 100) / sumOrder + '%'
									}}
								></div>
							</div>
						</div>
						<span style={orderCountryPercent}>{((e.quantity / sumOrder) * 100).toFixed(2)}%</span>
					</span>
				</div>
			);
		});
		return (
			<div>
				<div className="title-pexgle">
					<span>&nbsp;Top Buying Countries</span>
				</div>
				<div id="list-top-country" style={listCountryStyle}>
					{result}
				</div>
			</div>
		);
	}
});

export default TopBuyCountries;
