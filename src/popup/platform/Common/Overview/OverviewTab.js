import React, { useEffect, useRef, useContext } from 'react';
import { useDispatch } from 'react-redux';
import withReducer from '../../../store/withReducer';
import * as Actions from './store/actions';
import reducer from './store/reducers';
import { useSelector } from 'react-redux';
import '../../../../scss/components/Overview';
import '../../../../scss/components/Footer.scss';
import moment from 'moment';
import * as helper from '../../../@fuse/utils/helpers';
import TopCountryList from './TopCountryList';
import OveviewFacebookPageList from './OveviewFacebookPageList';
import OveviewAllFacebookPageList from './OveviewAllFacebookPageList';
import LoadingTab from '../../../layout/components/LoadingTab';
import { FuseAnimate, FuseAnimateGroup } from '../../../layout/components';
import AppContext from '../../AppContext';

function OverviewTab(props) {
	const appContext = useContext(AppContext);
	const { platform } = appContext;

	const dispatch = useDispatch();
	const domainOverview = useSelector(({ overview }) => overview.domainOverview);
	useEffect(() => {
		if (!domainOverview.isData) dispatch(Actions.getStoreOverview(platform));
	}, [dispatch]);

	const { isShowAllPage } = useSelector(({ overview }) => overview.ui);
	let classFollow = domainOverview.userHasFollowDomain ? 'is-followed' : 'not-followed';
	if (isShowAllPage) return <OveviewAllFacebookPageList />;
	return domainOverview.isData ? (
		<div className="pg-content overviewContainer" id="overviewContainer">
			<div className="tab-content" style={{ display: domainOverview && domainOverview.store ? 'block' : 'none' }}>
				<div className="pg-overview-header">
					<span className="header-icon">
						<img id="domainIcon" src={domainOverview.store.icon ? domainOverview.store.icon : ''} alt="" />
					</span>
					<div>
						<h2 id="domainNameHeader" className="websiteHeader-caption" style={{ margin: '0px' }}>
							{domainOverview.store.domain}
						</h2>
						<div id="domainDateHeader" className="date-overview">
							{moment(domainOverview.store.statistical_time).utc().format(' MMMM Y')} overview
						</div>
					</div>
					{platform == 'shopify' ? (
						<div
							id="pgBtnFollowing"
							className={classFollow}
							onClick={event => {
								if (!domainOverview.userHasFollowDomain && !domainOverview.isFollowInProgress) {
									dispatch(Actions.followInProgressStore());
									dispatch(Actions.followStore(domainOverview.store.domain));
								} else if (domainOverview.userHasFollowDomain && !domainOverview.isFollowInProgress) {
									dispatch(Actions.followInProgressStore());
									dispatch(
										Actions.unFollowStore(domainOverview.store.domain, domainOverview.user_id)
									);
								}
							}}
						>
							{domainOverview.isFollowInProgress ? (
								<i className="fa fa-spinner fa-spin"></i>
							) : (
								<i className="fa fa-rss" />
							)}
							<span>
								{domainOverview.isFollowInProgress
									? 'loading'
									: domainOverview.userHasFollowDomain
									? 'Followed'
									: 'Follow'}
							</span>
						</div>
					) : (
						''
					)}
				</div>
				<FuseAnimate animation="transition.whirlIn" delay={100}>
					<div>
						<div className="web-traffic">
							<div className="desktop-traffic" title="Traffic from desktop">
								<i className="fa fa-desktop"></i>{' '}
								<span id="trafficDesktopPercent">
									{(!isNaN(Number(domainOverview.store.desktop_traffic_share))
										? Number(domainOverview.store.desktop_traffic_share)
										: 'N/A') + '%'}
								</span>
							</div>

							<div className="total-traffic" title="total visit">
								<div id="totalVist" className="total-count">
									{domainOverview.store.total_visit == 0
										? 'N/A'
										: helper.numberWithCommas(domainOverview.store.total_visit)}
								</div>
							</div>

							<div className="mobile-traffic" title="Traffic from mobile">
								<i className="fa fa-mobile" style={{ fontSize: '18px' }}></i>{' '}
								<span id="trafficMobilePercent">
									{(!isNaN(Number(domainOverview.store.mobile_traffic_share))
										? Number(domainOverview.store.mobile_traffic_share)
										: 'N/A') + '%'}
								</span>
							</div>
						</div>
						<div className="web-traffic-bottom">
							<div id="pg-line-left" />

							{domainOverview.store.visit_change == 0 ? (
								<div id="totalVisitChange" className="total-change"></div>
							) : (
								<div id="totalVisitChange" className="total-change">
									<span
										className={`websitePage-relativeChange--${helper.getUpdown(
											domainOverview.store.visit_change
										)}`}
										style={{ fontWeight: '600' }}
									>
										<i
											className={`fa fa-arrow-circle-o-${helper.getUpdown(
												domainOverview.store.visit_change
											)}`}
										></i>{' '}
										{helper.numberWithCommas(Math.abs(domainOverview.store.visit_change))}%
									</span>{' '}
									from last month
								</div>
							)}
							<div id="pg-line-right" />
						</div>
					</div>
				</FuseAnimate>
				<div className="trafic-box">
					<div className="traffic-country">
						<FuseAnimate animation="transition.slideLeftIn" delay={200}>
							<div className="traffic-header">
								<span className="traffic-header-left">Traffic by</span>
								<span className="traffic-header-right"> Countries</span>
							</div>
						</FuseAnimate>
						<TopCountryList />
					</div>
					<div id="pgTrafficFacebook" className="traffic-fb">
						<FuseAnimate animation="transition.slideLeftIn" delay={200}>
							<div className="traffic-header">
								<span className="traffic-header-left">Referring</span>
								<span className="traffic-header-right"> Facebook</span>
							</div>
						</FuseAnimate>
						<OveviewFacebookPageList />
					</div>
				</div>
			</div>
		</div>
	) : (
		<LoadingTab />
	);
}

export default withReducer('overview', reducer)(OverviewTab);
