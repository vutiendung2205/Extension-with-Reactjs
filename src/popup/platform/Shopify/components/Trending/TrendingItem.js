import React, { useEffect, useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import withReducer from '../../../../store/withReducer';
import * as Actions from './store/actions';
import reducer from './store/reducers';
import { useSelector } from 'react-redux';
import '../../../../../scss/components/ProductItem.scss';
import bestSellingItemImage from '../../../../../images/img/bestSellItem.jpg';
import noImage from '../../../../../images/img/noImage-2.jpg';
import iconPlay from '../../../../../images/img/facebook_media.png';
import iconBestSelling from '../../../../../images/img/facebook_emoji.png';

import moment from 'moment';
import * as helper from '../../../../@fuse/utils/helpers';
import * as ActionsLayout from '../../../../apps/store/actions';
import $ from 'jquery';
import { PEXGLE_HOST, PEXGLE_HOST_PRICING } from '../../../../@fuse/config/constants';
let sortArrayData = data => {
	// for (let i = 0; i < data.tracking_time_arr.length - 1; i++) {
	//     for (let j = 0; j < data.tracking_time_arr.length - i - 1; j++) {
	//         if (data.tracking_time_arr[j] > data.tracking_time_arr[j + 1]) {
	//             let temp = data.tracking_time_arr[j + 1];
	//             data.tracking_time_arr[j + 1] = data.tracking_time_arr[j];
	//             data.tracking_time_arr[j] = temp;
	//             let temp2 = data.reactions_arr[j + 1];
	//             data.reactions_arr[j + 1] = data.reactions_arr[j];
	//             data.reactions_arr[j] = temp2;
	//             temp2 = data.shares_arr[j + 1];
	//             data.shares_arr[j + 1] = data.shares_arr[j];
	//             data.shares_arr[j] = temp2;
	//             temp2 = data.comments_arr[j + 1];
	//             data.comments_arr[j + 1] = data.comments_arr[j];
	//             data.comments_arr[j] = temp2;
	//         }
	//     }
	// }
	return data;
};
const renderImage = (item, showInfo) => {
	let href = '';
	let src = '';

	if (showInfo) {
		if (item.image !== undefined) {
			href = item.loadInsite
				? item.link
				: `${PEXGLE_HOST + '/shopify-product-detail?product=' + item.product_id}`;
			src = item.image;
		} else {
			href = PEXGLE_HOST_PRICING;
			src = chrome.extension.getURL(bestSellingItemImage);
		}
	} else {
		src = chrome.extension.getURL(trendingItem);
		href = '#';
		return (
			<a style={{ cursor: 'pointer' }} target="_blank" href={href} onClick={() => onClickLogin()}>
				<img
					alt={item.product_id}
					className="product-image"
					src={src}
					onError={e => {
						e.target.src = chrome.extension.getURL(noImage);
					}} //handle error img
				/>
			</a>
		);
	}

	if (src == null) {
		src = chrome.extension.getURL(noImage);
	}

	return (
		<a style={{ cursor: 'pointer' }} target="_blank" href={href}>
			<img
				alt={item.product_id}
				className="product-image"
				src={src}
				onError={e => {
					e.target.src = chrome.extension.getURL(noImage);
				}} //handle error img
			/>
		</a>
	);
};
const getClassOfItem = productItem => {
	let spanClass = productItem.favorite == '1' ? 'favorite_checked' : '';
	return spanClass;
};
const isFavorite = item => {
	return Number(item.favorite) == 1;
};
//render content item description folow condition is Login ? or is Lastmonth ?
const renderContentDescription = (item, showInfo) => {
	// let href = showInfo ? item.link : PEXGLE_HOST_PRICING;
	let href = '';
	let title = '';
	let iconKey = showInfo ? '' : <i className="fa fa-key" style={{ marginRight: '5px' }} />;

	if (showInfo) {
		if (item.image !== undefined) {
			title = item.title;
			href = item.loadInsite
				? item.link
				: `${PEXGLE_HOST + '/shopify-product-detail?product=' + item.product_id}`;
		} else {
			title = 'Upgrade to unlock';
			href = PEXGLE_HOST_PRICING;
		}
	} else {
		title = 'Login to unlock';
		href = '#';
		return (
			<div className="pg-content-items">
				<div className="description">
					{iconKey}
					<a
						style={{ color: '#343a40c4', fontWeight: '600' }}
						target="_blank"
						href={href}
						title={title}
						onClick={() => onClickLogin()}
					>
						{title}
					</a>
				</div>
			</div>
		);
	}

	return (
		<div className="pg-content-items">
			<div className="description">
				{iconKey}
				<a style={{ color: '#343a40c4', fontWeight: '600' }} target="_blank" href={href} title={title}>
					{title}
				</a>
			</div>
		</div>
	);
};
//render content item price folow condition is Login ? or is Lastmonth ?
const renderContentPrice = (item, showInfo) => {
	let price = '***';

	if (showInfo && item.image !== undefined) {
		price = helper.priceToHTML(item);
	}

	return (
		<div className="pg-content-items price" style={{ marginBottom: '5px', marginTop: '3px' }}>
			{price}
		</div>
	);
};
const handleClickFavorite = (isFavorite, productId, event) => {
	event.currentTarget.classList.add('disable-click-favorite');
	if (isFavorite == '1') {
		event.currentTarget.classList.remove('favorite_checked');
		unMarkFavoriteProduct(productId);
	} else {
		event.currentTarget.classList.add('favorite_checked');
		markFavoriteProduct(productId);
	}
};
const handleClickFavoriteSpan = event => {
	event.currentTarget.classList.add('disable-click-favorite');
	let favoriteElement = $(event.currentTarget);
	favoriteElement.parent().find('label').click();
};
const removeDuplicates = (myArr, prop) => {
	return myArr.filter((obj, pos, arr) => {
		return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
	});
};
const onClickLogin = () => {
	this.props.setLoginInProgressStatus(window.location.href);
	window.location.href = PEXGLE_HOST + '/login/';
};

function trendingItem({ dataItem, userId }) {
	const [isShow, setIsShow] = useState(false);
	const dispatch = useDispatch();
	// event dropdown: show top country
	const eventDropdownCountry = () => {
		setIsShow(!isShow);
	};
	const toggleFavorite = item => {
		if (!isFavorite(item) && !item.isFavoriteInProgress) {
			dispatch(Actions.favoriteInProgress(item.product_id));
			dispatch(Actions.favoriteTrending(item.product_id));
		} else if (isFavorite(item) && !item.isFavoriteInProgress) {
			dispatch(Actions.favoriteInProgress(item.product_id));
			dispatch(Actions.unFavoriteTrending(item.product_id));
		}
	};
	let isShowInfo = true;
	if (!dataItem) return null;

	let clasFavorite = getClassOfItem(dataItem);

	let productTime = '';
	if (dataItem.product_created_at != '0000-00-00 00:00:00') {
		productTime = dataItem.product_created_at;
	}
	let titleContent =
		userId < 0 ? (
			<div>
				<i className="material-icons" style={{ color: 'black' }}>
					vpn_key
				</i>{' '}
				<span>Please upgrade to unlock</span>
			</div>
		) : (
			<a
				className="video-title"
				target="_blank"
				href={`${PEXGLE_HOST + '/shopify-product-detail?product=' + dataItem.product_id}`}
			>
				{dataItem.title ? dataItem.title : '...'}
			</a>
		);

	let titleRecentOrder = `Order volume in last 7 days 
(${dataItem.sum_order_3} volume${dataItem.sum_order_3 > 1 ? 's' : ''} in the last 3 days) 
Number of order times ${dataItem.grow_order_3 < 0 ? 'decreased by ' : 'increased by '}
${dataItem.grow_order_3 + '% '} compared to past 3 days `;

	let topCountry = false;
	let countryHtmlSubList = [];
	let countryImage = '';
	for (let index in dataItem.countries_orders) {
		let countryInformation = helper.filterCountryByName(
			dataItem.countries_orders[index].country,
			helper.countriesAllCode
		);
		if (countryInformation) {
			if (topCountry === false) {
				topCountry = {
					...dataItem.countries_orders[index],
					...{ code: countryInformation }
				};
			}
			countryHtmlSubList.push(
				<div className="country-sidebar-link" key={index}>
					<img
						className="websitePage-listIcon websitePage-listIcon--reffering lazy-icon lazy"
						style={{ maxWidth: '16px', height: '12px' }}
						src={
							PEXGLE_HOST +
							`/wp-content/themes/geobin-child/pexgle-template/assets/images/free-user/flags/${
								countryInformation === 'UK' ? 'gb' : countryInformation.toLowerCase()
							}.svg`
						}
					/>
					<span className="collection_name">
						{' '}
						{countryInformation} {dataItem.countries_orders[index].order_country_number} Order{' '}
					</span>
				</div>
			);
		}
	}
	if (topCountry) {
		let codeCountry = topCountry.code;
		if (topCountry.code === 'UK') {
			codeCountry = 'GB';
		}

		countryImage = (
			<span
				className="dropdown-country"
				style={{ marginLeft: 'auto', alignItems: 'center', display: 'flex' }}
				title="Top buying countries"
			>
				<img
					className="websitePage-listIcon websitePage-listIcon--reffering lazy-icon lazy"
					style={{ maxWidth: '16px', height: '12px' }}
					src={
						PEXGLE_HOST +
						`/wp-content/themes/geobin-child/pexgle-template/assets/images/free-user/flags/${codeCountry.toLowerCase()}.svg`
					}
				/>
				<div style={{ marginLeft: '4px', alignItems: 'center', fontSize: '14px' }} className="text-pd-muted">
					{topCountry.code}
				</div>
				<svg
					onClick={() => {
						eventDropdownCountry();
					}}
					viewBox="0 0 20 20"
					width="100%"
					height="100%"
					style={{ width: '20px', height: '20px', cursor: 'pointer' }}
					className="text-pd-muted dropdown-country-button"
				>
					<path
						fill="#7e93a5"
						d="M13.7 8.3a1 1 0 0 0-1.4 0L10 10.58l-2.3-2.3A1 1 0 1 0 6.3 9.7l3 3a1 1 0 0 0 1.4 0l3-3a1 1 0 0 0 0-1.42z"
					></path>
				</svg>
				{isShow ? (
					<div className="dropdown-country-content">
						<div className="dropdown-menu">{countryHtmlSubList}</div>
					</div>
				) : (
					''
				)}
			</span>
		);
	}
	return (
		<div className="pg-products">
			<div className="pg-product-item">
				<div className={'card id-' + dataItem.product_id}>
					<div className="el-card-avatar">{renderImage(dataItem, isShowInfo)}</div>
					<div className="pg-product-content">
						{renderContentDescription(dataItem, isShowInfo)}
						{renderContentPrice(dataItem, isShowInfo)}
						{dataItem.isNew ? (
							''
						) : (
							<div className="pg-content-items" style={{ placeContent: 'center space-between' }}>
								<div className="pg-content-item">Traffic</div>
								<div className="pg-content-item">
									<div>
										{dataItem.traffic >= 5000
											? helper.numberWithCommas(dataItem.traffic)
											: '< 5000'}
									</div>
								</div>
							</div>
						)}
						{dataItem.isNew ? (
							''
						) : (
							<div className="pg-content-items" style={{ placeContent: 'center space-between' }}>
								<div
									className="pg-content-item"
									title="Growth of traffic compare with last month"
									style={{ cursor: 'pointer' }}
								>
									Growth
								</div>
								<div className="pg-content-item">
									<div style={{ cursor: 'pointer' }}>
										{helper.generateChangeSpan(dataItem.grow_traffic, true)}
									</div>
								</div>
							</div>
						)}
						<div
							className="pg-content-items"
							style={{
								placeContent: 'center space-between',
								marginBottom: '8px'
							}}
						>
							<div className="pg-content-item" style={{ fontWeight: '300', cursor: 'pointer' }}>
								Published at
							</div>
							<div className="pg-content-item" style={{ fontWeight: '300' }}>
								<div
									style={{
										cursor: 'pointer',
										whiteSpace: 'nowrap',
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										width: '70px',
										float: 'right'
									}}
									title={moment(productTime).format('MM/DD/YYYY HH:mm')}
								>
									{moment(productTime).fromNow()}
								</div>
							</div>
						</div>
					</div>
				</div>
				{dataItem.loadInsite ? (
					''
				) : (
					<div className="show-more">
						<div className="px-custom-checkbox" style={{ marginTop: '2px' }}>
							<input
								type="checkbox"
								className="pg-custom-checkbox"
								style={{ cursor: 'pointer', display: 'none' }}
							/>
						</div>
						<span
							style={{
								display: 'flex',
								flexFlow: 'row',
								paddingTop: '3px',
								marginLeft: '5px',
								marginRight: 'auto'
							}}
						>
							{!dataItem.isFavoriteInProgress ? (
								<label
									onClick={event => toggleFavorite(dataItem)}
									ref={ref => {
										if (!clasFavorite && ref) ref.classList.remove('favorite_checked');
									}}
									className={`fa fa-heart ${clasFavorite}`}
									style={{ marginTop: '1px', marginRight: '3px', cursor: 'pointer' }}
								></label>
							) : (
								<i
									className={'fa fa-spinner fa-spin'}
									style={{ marginTop: '1px', marginRight: '3px', cursor: 'pointer' }}
								></i>
							)}
							<span
								onClick={event => toggleFavorite(dataItem)}
								className={`pg-add-to-favorite-detail ${clasFavorite}`}
								style={{ fontSize: '11px', cursor: 'pointer', paddingTop: '2px' }}
							>
								Add to favorite
							</span>
						</span>
					</div>
				)}
			</div>
		</div>
	);
}

export default trendingItem;
