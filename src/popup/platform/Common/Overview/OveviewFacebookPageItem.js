import React, { useEffect } from 'react';
import * as Actions from './store/actions';
import { useSelector, useDispatch } from 'react-redux';
import '../../../../scss/components/FollowPage';
// import * as helper from "../../../@fuse/utils/helpers"
import { PEXGLE_HOST, FOLLOW_STATUS } from '../../../@fuse/config/constants';

function OveviewFacebookPageItem({ pageItem, index }) {
	const dispatch = useDispatch();

	let facebook_icon = PEXGLE_HOST + '/wp-content/themes/geobin-child/pexgle-template/assets/images/noIcon.png';
	let spanClass = pageItem.is_followed ? 'is-followed' : 'not-followed';
	let iClass = pageItem.isFollowInProgress ? 'fa fa-spinner fa-spin' : 'fa fa-rss';

	return (
		<div
			key={index}
			className={`websitePage-listItemPageList-mobile websitePage-listItem websitePage-buttonsContainer js-droppingDownItem  ${
				index == pageItem.length - 1 ? 'last-item' : ''
			}`}
			style={{ top: '-10px', opacity: '1' }}
		>
			<div className="websitePage-listItemTitlePage">
				<img className="websitePage-listPageImage" src={pageItem.image ? pageItem.image : facebook_icon} />
				{pageItem.status != 1 ? (
					<a
						className="websitePage-listItemPage js-tooltipTarget"
						target="_blank"
						href={`https://www.facebook.com/${pageItem.slug}`}
					>
						<strong title={pageItem.name ? pageItem.name : 'fb.com/' + pageItem.slug}>
							{pageItem.name ? pageItem.name : 'fb.com/' + pageItem.slug}
						</strong>
					</a>
				) : (
					<a
						className="text-danger websitePage-listItemPage"
						target="_blank"
						href={`https://www.facebook.com/${pageItem.slug}`}
					>
						<strong>Invalid</strong>
					</a>
				)}
				<span className="websitePage-slug" title={`@${pageItem.slug}`}>
					<strong>@{pageItem.slug}</strong>
				</span>
				<span
					id={`follow${pageItem.id}`}
					className={`follow-${pageItem.id} ` + spanClass}
					onClick={event => {
						if (!pageItem.is_followed && !pageItem.isFollowInProgress) {
							dispatch(Actions.followInProgressPage(pageItem.slug));
							dispatch(Actions.followFacebookPage(pageItem.slug));
						} else if (pageItem.is_followed && !pageItem.isFollowInProgress) {
							dispatch(Actions.followInProgressPage(pageItem.slug));
							dispatch(Actions.unFollowFacebookPage(pageItem.slug));
						}
					}}
				>
					{pageItem.slug && pageItem.status != 1 ? (
						<div style={{ position: 'absolute', right: '0px', top: '0px', cursor: 'pointer' }}>
							{<i className={iClass} style={{ cursor: 'pointer' }}></i>}
						</div>
					) : (
						''
					)}
				</span>
			</div>
		</div>
	);
}

export default OveviewFacebookPageItem;
