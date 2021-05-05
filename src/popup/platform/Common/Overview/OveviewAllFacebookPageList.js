import React, { useEffect } from 'react';
import * as Actions from './store/actions';
import { useSelector } from 'react-redux';
import '../../../../scss/components/FollowPage';
// import * as helper from "../../../@fuse/utils/helpers"
// import { PEXGLE_HOST } from '../../../@fuse/config/constants';

import OveviewFacebookPageItem from './OveviewFacebookPageItem';
import { FuseAnimate, FuseAnimateGroup } from '../../../layout/components';

function OveviewAllFacebookPageList(props) {
	const { fbPage } = useSelector(({ overview }) => overview.domainOverview);
	return (
		<div id="view-all-facebook-page">
			<div className="traffic-header">
				<span className="traffic-header-left">Referring</span>
				<span className="traffic-header-right"> Facebook</span>
			</div>
			<div className="view-all-facebook-body pg-content">
				<div className="trafic-box">
					{/* <ul id="facebookTrafficBox" className="websitePage-list"> */}
					<FuseAnimateGroup
						enter={{
							animation: 'transition.slideLeftIn'
						}}
						id="facebookTrafficBox"
						className="websitePage-list"
						style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}
					>
						{fbPage
							? fbPage.map((pageItem, i) => {
									return <OveviewFacebookPageItem key={i} index={i} pageItem={pageItem} />;
							  })
							: ''}
					</FuseAnimateGroup>
					{/* </ul> */}
				</div>
			</div>
		</div>
	);
}

export default OveviewAllFacebookPageList;
