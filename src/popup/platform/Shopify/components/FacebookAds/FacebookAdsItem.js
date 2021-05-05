import React, { useEffect, useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import * as Actions from './store/actions';
import '../../../../../scss/components/FacebookAdsItem.scss';
import bestSellingItem from '../../../../../images/img/bestSellItem.jpg';
import noImage from '../../../../../images/img/noImage-2.jpg';
import iconPlay from '../../../../../images/img/facebook_media.png';
import iconFb from '../../../../../images/img/facebook_emoji.png';

import moment from 'moment';
import * as helper from '../../../../@fuse/utils/helpers';
import FacebookAdsChart from './FacebookAdsChart';

import { PEXGLE_HOST_PRICING } from '../../../../@fuse/config/constants';

let sortArrayData = data => {
	for (let i = 0; i < data.tracking_time_arr.length - 1; i++) {
		for (let j = 0; j < data.tracking_time_arr.length - i - 1; j++) {
			if (data.tracking_time_arr[j] > data.tracking_time_arr[j + 1]) {
				let temp = data.tracking_time_arr[j + 1];
				data.tracking_time_arr[j + 1] = data.tracking_time_arr[j];
				data.tracking_time_arr[j] = temp;
				let temp2 = data.reactions_arr[j + 1];
				data.reactions_arr[j + 1] = data.reactions_arr[j];
				data.reactions_arr[j] = temp2;
				temp2 = data.shares_arr[j + 1];
				data.shares_arr[j + 1] = data.shares_arr[j];
				data.shares_arr[j] = temp2;
				temp2 = data.comments_arr[j + 1];
				data.comments_arr[j + 1] = data.comments_arr[j];
				data.comments_arr[j] = temp2;
			}
		}
	}
	return data;
};
const renderImage = (item, isLogin) => {
	let href = isLogin ? item.link : PEXGLE_HOST_PRICING;
	let src = isLogin ? item.image : chrome.extension.getURL(bestSellingItem);

	return (
		<a style={{ cursor: 'pointer' }} target="_blank" href={'https://www.facebook.com/' + item.post_id}>
			<img
				className="play-icon"
				alt={item.post_id}
				className="product-image"
				src={src}
				onError={e => {
					e.target.src = chrome.extension.getURL(noImage);
				}} //handle error img
			/>
		</a>
	);
};
const renderIconPlay = item => {
	if (item.type == 0) {
		// video
		return (
			<a target="_blank" href={`https://www.facebook.com/${item.post_id}`}>
				<i className="play-icon" style={{ backgroundImage: `url(${chrome.extension.getURL(iconPlay)})` }}></i>
			</a>
		);
	} else {
		return null;
	}
};
const getClassOfItem = facebookAdsItem => {
	let spanClass = Number(facebookAdsItem.favorite) == 1 ? 'favorite_checked' : '';
	return spanClass;
};
const isFavorite = item => {
	return Number(item.favorite) == 1;
};

function FacebookAdsItem({ item, userId }) {
	const dispatch = useDispatch();

	let isLogin = true;
	item = sortArrayData(item);
	let clasFavorite = getClassOfItem(item);
	let productTime = item.post_date * 1000;
	const toggleFavorite = item => {
		if (!isFavorite(item) && !item.isFavoriteInProgress) {
			dispatch(Actions.favoriteInProgress(item.post_id));
			dispatch(Actions.favoriteAds(item.post_id));
		} else if (isFavorite(item) && !item.isFavoriteInProgress) {
			dispatch(Actions.favoriteInProgress(item.post_id));
			dispatch(Actions.unFavoriteAds(item.post_id));
		}
	};
	return (
		<div className="pg-products">
			<div className="pg-product-item">
				<div className={'card id-' + item.post_id}>
					<div className="product-content free-user-video-container">
						<div className="d-flex no-block align-items-center">
							<div className="description" title={item.title} style={{ height: '16px' }}>
								<a
									className="video-title"
									target="_blank"
									href={`https://www.facebook.com/${item.post_id}`}
								>
									{item.title ? item.title : '...'}
								</a>
							</div>
						</div>
						<div
							className="d-flex no-block align-items-center m-b-10"
							style={{ placeContent: 'center space-between' }}
						>
							<span
								className="text-pd-muted m-b-0 font-12 cursor-pointer cursor-pointer f-w-300"
								title={moment(productTime).format('MM/DD/YYYY HH:mm')}
							>
								{moment(productTime).fromNow()}
							</span>
						</div>
					</div>
					<div className="el-card-avatar">
						{renderImage(item, isLogin)}
						{renderIconPlay(item)}
					</div>
					<div className="pg-product-content">
						<div className="info-view">
							<div className="video-reaction-panel">
								<span className="reaction-span" style={{ zIndex: '3' }}>
									<i
										className="fb-like-icon"
										style={{ backgroundImage: `url(${chrome.extension.getURL(iconFb)})` }}
									></i>
								</span>
								<span className="reaction-span" style={{ zIndex: '2' }}>
									<i
										className="fb-haha-icon"
										style={{ backgroundImage: `url(${chrome.extension.getURL(iconFb)})` }}
									></i>
								</span>
								<span className="reaction-span" style={{ zIndex: '1' }}>
									<i
										className="fb-love-icon"
										style={{ backgroundImage: `url(${chrome.extension.getURL(iconFb)})` }}
									></i>
								</span>
								<span
									style={{
										marginTop: '7px',
										marginLeft: '5px',
										color: '#484545',
										cursor: 'pointer',
										fontFamily: 'Helvetica, Arial, sans-serif'
									}}
								>
									{' '}
									{helper.formatNumberToText(item.reactions)}
								</span>
							</div>
							{item.type == 0 && Number(item.views) ? (
								<div className="view-info" title={item.views}>
									{helper.formatNumberToText(item.views)} Views
								</div>
							) : null}
						</div>
						<div style={{ width: '158px', height: '150px' }}>
							<FacebookAdsChart
								tracking_time_arr={item.tracking_time_arr.slice(-3)}
								reactions_arr={item.reactions_arr.slice(-3)}
								shares_arr={item.shares_arr.slice(-3)}
								comments_arr={item.comments_arr.slice(-3)}
							/>
						</div>
					</div>
				</div>
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
						{!item.isFavoriteInProgress ? (
							<label
								onClick={event => toggleFavorite(item)}
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
							onClick={event => toggleFavorite(item)}
							className={`pg-add-to-favorite-detail ${clasFavorite}`}
							style={{ fontSize: '11px', cursor: 'pointer', paddingTop: '2px' }}
						>
							Add to favorite
						</span>
					</span>
				</div>
			</div>
		</div>
	);
}

export default FacebookAdsItem;
