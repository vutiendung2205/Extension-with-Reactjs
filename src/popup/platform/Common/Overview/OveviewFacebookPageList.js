import React, { useEffect } from 'react';
import * as Actions from './store/actions';
import * as ActionsLayout from '../../../layout/store/actions';

import { useSelector, useDispatch } from 'react-redux';
import '../../../../scss/components/FollowPage';
import * as helper from '../../../@fuse/utils/helpers';
import { PEXGLE_HOST, FEATURES_ID } from '../../../@fuse/config/constants';

import OveviewFacebookPageItem from './OveviewFacebookPageItem';
import { FuseAnimate, FuseAnimateGroup } from '../../../layout/components';

function OveviewFacebookPageList(props) {
	const {
		fbPage,
		store: { domain, has_data }
	} = useSelector(({ overview }) => overview.domainOverview);
	const dispatch = useDispatch();
	let facebook_icon = PEXGLE_HOST + '/wp-content/themes/geobin-child/pexgle-template/assets/images/noIcon.png';
	return fbPage.length <= 0 ? (
		<ul id="facebookTrafficBox" className="websitePage-list">
			<li
				className={`websitePage-listItemPageList-mobile websitePage-listItem websitePage-buttonsContainer js-droppingDownItem not-enougt-data`}
				style={{ marginLeft: '-20px', opacity: '1', height: '35px' }}
			>
				<div className="websitePage-listItemTitlePage">
					<img className="websitePage-listPageImage" src={facebook_icon} />
					<span style={{ opacity: '0.8', marginTop: '-25px', display: 'block', marginLeft: '30px' }}>
						{has_data ? 'NOT ENOUGH DATA' : 'IN PROGRESSING'}
					</span>
					<span className="websitePage-slug">
						<strong></strong>
					</span>
				</div>
			</li>
		</ul>
	) : (
		<div>
			<ul id="facebookTrafficBox" className="websitePage-list">
				<FuseAnimateGroup
					enter={{
						animation: 'transition.slideDownIn'
					}}
				>
					{fbPage.slice(0, 5).map((pageItem, i) => {
						return <OveviewFacebookPageItem key={i} index={i} pageItem={pageItem} />;
					})}
				</FuseAnimateGroup>
			</ul>
			{fbPage.length > 5 ? (
				<div
					id="btnShowMoreFb"
					onClick={() => {
						dispatch(
							ActionsLayout.setHeader({
								[FEATURES_ID.OVER_VIEW]: {
									isShowBack: true,
									isShowLogo: false,
									title: domain,
									actionBack: currentHeader => {
										dispatch(
											ActionsLayout.setHeader({
												[FEATURES_ID.OVER_VIEW]: { ...currentHeader, isDefault: true }
											})
										);
										dispatch(Actions.toggleShowAllPage());
									}
								}
							})
						);
						dispatch(Actions.toggleShowAllPage());
					}}
				>
					{' '}
					See {fbPage.length - 5} more pages{' '}
				</div>
			) : null}
		</div>
	);
}

export default OveviewFacebookPageList;
