import React, { useEffect } from 'react';
import * as Actions from './store/actions';
import { useSelector } from 'react-redux';
import '../../../../scss/components/TopCountry';
import * as helper from '../../../@fuse/utils/helpers';
import { PEXGLE_HOST } from '../../../@fuse/config/constants';
import { FuseAnimate, FuseAnimateGroup } from '../../../layout/components';

function TopCountryList(props) {
	const topCountries = useSelector(({ overview }) => overview.domainOverview.topCountry);

	return topCountries.length <= 0 ? (
		<ul id="countryBox" className="websitePage-list">
			<li className="websitePage-listItem websitePage-buttonsContainer js-droppingDownItem not-enougt-data">
				<div className="">
					<span style={{ opacity: '0.8' }}>NOT ENOUGH DATA</span>
				</div>
			</li>
		</ul>
	) : (
		<ul id="countryBox" className="websitePage-list">
			<FuseAnimateGroup
				enter={{
					animation: 'transition.slideDownIn'
				}}
			>
				{topCountries.map((country, i) => {
					return (
						<li
							key={i}
							className={`websitePage-listItem websitePage-buttonsContainer js-droppingDownItem ${
								i == topCountries.length - 1 ? 'last-item' : ''
							}`}
							style={{ top: '-10px', opacity: '1' }}
						>
							<div className="websitePage-listItemTitle">
								<img
									className="websitePage-listIcon websitePage-listIcon--reffering lazy-icon lazy"
									src={
										PEXGLE_HOST +
										`/wp-content/themes/geobin-child/pexgle-template/assets/images/free-user/flags/${country.country_code}.svg`
									}
								/>
								<div className="websitePage-listItemLink js-tooltipTarget">{country.country_name}</div>
								<span className="websitePage-trafficShare">
									{helper.numberWithCommas(Number(country.traffic_percent).toFixed(2) + '')}%
								</span>
							</div>
							<div className="country-percent-box">
								<div
									className={
										'websitePage-listItemChange websitePage-relativeChange websitePage-relativeChange--inline websitePage-relativeChange--' +
										helper.getUpdown(country.change_compare)
									}
								>
									<i
										className={`fa fa-angle-${helper.getUpdown(
											country.change_compare
										)} country-traffic-arrow`}
									></i>
									<span className="websitePage-relativeChangeNumber">
										{helper.numberWithCommas(
											'' + Math.abs(Number(country.change_compare).toFixed(2))
										)}
										%
									</span>
								</div>
							</div>
						</li>
					);
				})}
			</FuseAnimateGroup>
		</ul>
	);
}

export default TopCountryList;
