import React, { useState } from 'react';
import '../../../../scss/components/ShowMoreListLink.scss';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
require('highcharts/modules/wordcloud')(Highcharts);
import LoadingTab from '../../../layout/components/LoadingTab';
import { helpers } from '../../../@fuse/utils';
import { FuseAnimate, FuseAnimateGroup } from '../../../layout/components';

const colors = [
	'rgb(124, 181, 236)',
	'rgb(124, 181, 236)',
	'#f60',
	'#B8860B',
	'#008B8B',
	'#00008B',
	'#00FFFF',
	'#DC143C',
	'#FFF8DC',
	'#6495ED',
	'#FF7F50',
	'#D2691E',
	'#7FFF00',
	'#DEB887',
	'#A52A2A',
	'#8A2BE2',
	'#0000FF'
];

const linkStyle = {
	display: 'inline-block',
	width: '55%',
	whiteSpace: 'nowrap',
	overflow: 'hidden',
	textOverflow: 'ellipsis'
};

const priceStyle = {
	display: 'inline-block',
	width: '45%',
	float: 'right',
	fontSize: '13px',
	textAlign: 'right',
	marginBottom: '18px',
	color: '#ff7e28'
};

function getWordCloudData(listLink) {
	let wordCloudData = [];
	listLink.map(e => {
		if (!e || e.price == undefined || e.price == '') return 0;
		let check = false;
		if (wordCloudData.length == 0)
			wordCloudData.push({
				name: e.roundPrice,
				weight: 1
			});
		else {
			wordCloudData.map(obj => {
				if (obj.name == e.roundPrice) {
					check = true;
					obj.weight = obj.weight + 1;
				}
			});
			if (!check)
				wordCloudData.push({
					name: e.roundPrice,
					weight: 1
				});
		}
	});
	return wordCloudData;
}

function getWordCloudChartRender(wordCloudData, listLink) {
	let rectangularEgg = function cloud(t) {
		t *= 0.01;
		return {
			x: t * Math.cos(t) * 2,
			y: t * Math.sin(t)
		};
	};
	Highcharts.seriesTypes.wordcloud.prototype.spirals.rectangular = rectangularEgg;
	let chartOptions = {
		series: [
			{
				animation: false,
				type: 'wordcloud',
				data: wordCloudData,
				name: 'Number of Stores',
				maxFontSize: 40,
				minFontSize: 12,
				spiral: 'rectangular',
				rotation: {
					from: 0,
					to: 0
				}
			}
		],
		title: {
			text: ''
		},
		credits: {
			enabled: false
		},
		legend: {
			enabled: false
		},
		chart: {
			height: 200,
			width: 342,
			animation: false
		}
	};
	let result = '';
	let checkAllNaPrice = true;
	listLink.map(e => {
		if (e && e.price) checkAllNaPrice = false;
	});
	if (listLink.length >= 15 && !checkAllNaPrice) {
		result = (
			<div style={{ width: '342px' }}>
				<HighchartsReact highcharts={Highcharts} options={chartOptions} />
			</div>
		);
	} else {
		result = <div style={{ height: 5 }}></div>;
	}
	return result;
}

function addColor(data) {
	if (data.length > 0) {
		for (let i = 0; i < data.length; i++) {
			data[i].color = colors[data[i].weight] != undefined ? colors[data[i].weight] : colors[12];
		}
	}
	return data;
}

function ShowMoreListLink({ listLink, listPriceOfLink, platform }) {
	let listLinkNotShopifyAndAli = listLink[platform].data;
	let promo = listLink[platform].promo;

	if ((listPriceOfLink && listPriceOfLink[platform]) || (platform != 'Aliexpress' && platform != 'Shopify')) {
		let wordCloudData = '';
		let result = '';
		let count = 1;
		let listLinkDoms = '';
		if (platform == 'Aliexpress' || platform == 'Shopify') {
			wordCloudData = addColor(getWordCloudData(listPriceOfLink[platform]));
			result = getWordCloudChartRender(wordCloudData, listPriceOfLink[platform]);
			listLinkDoms = listPriceOfLink[platform]
				.filter(link => {
					if (link.platform && link.platform == platform) {
						return link;
					}
				})
				.map((element, i) => {
					if (!element) return null;
					// let promoLink = element.link;
					// if (platform == 'Aliexpress' && promo) {
					//     let product_id = new URL(element.link).pathname.split("/");
					//     product_id = product_id[product_id.length - 1].replace(".html", "");
					//     promoLink = promo.filter(p => p.product_id == product_id)[0];
					//     promoLink = promoLink ? promoLink.promo_link : element.link;
					// }

					return (
						<li className="link-item" key={i}>
							<a href={element.link} target="_blank" style={linkStyle} title={element.title}>
								<span style={{ color: '#666666' }}>{count++}. </span>
								{/* {helpers.getLinkToShow(element.link, platform)} */}
								{element.price ? element.title : element.text}
							</a>
							<span style={priceStyle}>{element.price ? element.price : 'N/A'}</span>
						</li>
					);
				});
		} else {
			listLinkDoms = listLinkNotShopifyAndAli.map((element, i) => {
				return (
					<li className="link-item" key={i}>
						<a href={element.link} target="_blank" title={element.title}>
							<span style={{ color: '#666666' }}>{count++}. </span>
							{/* {helpers.getLinkToShow(element, platform)} */}
							{element.text}
						</a>
					</li>
				);
			});
		}

		return (
			<div className="show-more-supplier-and-store-container">
				<div
					ref={ref => {
						ref && ref.scrollIntoView();
					}}
				>
					{result}
				</div>
				<FuseAnimateGroup
					enter={{
						animation: 'transition.slideLeftIn'
					}}
					style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap' }}
				>
					{/* <div> */}
					{listLinkDoms}
					{/* </div> */}
				</FuseAnimateGroup>
			</div>
		);
	} else {
		return <LoadingTab />;
	}
}

export default ShowMoreListLink;
