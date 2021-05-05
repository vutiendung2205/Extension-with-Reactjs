import React, { useState } from 'react';
import '../../../../scss/components/ListLinkSupplier.scss';
import { useDispatch, useSelector } from 'react-redux';
import * as helper from '../../../@fuse/utils/helpers';
import * as Actions from './store/actions';
import * as ActionsLayout from '../../../layout/store/actions';
import { FEATURES_ID } from '../../../@fuse/config/constants';
import { FuseAnimate, FuseAnimateGroup } from '../../../layout/components';

function genListLink(data, isLinkAndPriceData, listPriceOfLink, type) {
	if (data.length == 0) {
		return genNotEnoughData(type);
	}
	let count = 1;

	return (
		<div className="list-link-data">
			<ul className="list-link-items">
				<FuseAnimateGroup
					enter={{
						animation: 'transition.slideDownIn'
					}}
				>
					{data.map((element, i) => {
						if (count == 6) {
							return '';
						}
						if (type == 'Aliexpress' && isLinkAndPriceData) {
							let currentElement = listPriceOfLink[type].filter(
								l => l.origin_link == element.origin_link
							);

							element.title =
								currentElement[0] && currentElement[0].title ? currentElement[0].title : element.title;
							element.text =
								currentElement[0] && currentElement[0].title ? currentElement[0].title : element.text;
						}

						return (
							<li className="link-item" key={i}>
								<a href={element.link} target="_blank" title={element.title}>
									<span style={{ color: '#666666' }}>{count++}. </span>
									{/* {helper.getLinkToShow(element, type)} */}
									{element.text}
								</a>
							</li>
						);
					})}
				</FuseAnimateGroup>
			</ul>
		</div>
	);
}

//generate not enough data
function genNotEnoughData(type) {
	let message = '';
	if (type == 'Aliexpress' || type == 'Alibaba') {
		message = 'NOT FOUND SUPPLIERS';
	} else {
		message = 'EMERGING MARKET';
	}
	return <div className="not-enough-data-list-link">{message}</div>;
}

//generate button or not
function genButtonShowMore(data, type, isLinkAndPriceData, dispatch) {
	if (data.length < 6) return;
	let text = '';
	if (type == 'Aliexpress' || type == 'Alibaba') {
		text = 'See ' + (data.length - 5) + ' More Suppliers';
	} else {
		text = 'See ' + (data.length - 5) + ' More Competitors';
	}

	if (type == 'Aliexpress' || type == 'Shopify') {
		return isLinkAndPriceData ? (
			<div
				className={'button-show-more ' + type}
				onClick={() => {
					dispatch(
						ActionsLayout.setHeader({
							[FEATURES_ID.SUPPLIERS_AND_COMPETITORS]: {
								isShowBack: true,
								isShowLogo: false,
								title: type,
								actionBack: currentHeader => {
									dispatch(
										ActionsLayout.setHeader({
											[FEATURES_ID.SUPPLIERS_AND_COMPETITORS]: {
												...currentHeader,
												isDefault: true
											}
										})
									);
									dispatch(Actions.toggleShowAllLink(type));
								}
							}
						})
					);
					dispatch(Actions.toggleShowAllLink(type));
				}}
			>
				{text}
			</div>
		) : (
			<div className={'button-show-more ' + type}>
				<i className="fa fa-spinner fa-spin" style={{ cursor: 'pointer' }}></i>
				&nbsp; {'Loading more ...'}
			</div>
		);
	} else {
		return (
			<div
				className={'button-show-more ' + type}
				onClick={() => {
					dispatch(
						ActionsLayout.setHeader({
							[FEATURES_ID.SUPPLIERS_AND_COMPETITORS]: {
								isShowBack: true,
								isShowLogo: false,
								title: type,
								actionBack: currentHeader => {
									dispatch(
										ActionsLayout.setHeader({
											[FEATURES_ID.SUPPLIERS_AND_COMPETITORS]: {
												...currentHeader,
												isDefault: true
											}
										})
									);
									dispatch(Actions.toggleShowAllLink(type));
								}
							}
						})
					);
					dispatch(Actions.toggleShowAllLink(type));
				}}
			>
				{text}
			</div>
		);
	}
}

function ListLinkSuppliers({ config }) {
	const { data, type, promo } = config;
	const dispatch = useDispatch();
	const { isLinkAndPriceData, listPriceOfLink } = useSelector(
		({ suppliersAndCompetitors }) => suppliersAndCompetitors.priceObj
	);

	return (
		<div className="flatform-info-container">
			{genListLink(data, isLinkAndPriceData, listPriceOfLink, type)}
			{genButtonShowMore(data, type, isLinkAndPriceData, dispatch)}
		</div>
	);
}

export default ListLinkSuppliers;
