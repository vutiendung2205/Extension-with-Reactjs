import React, { useState } from 'react';
import '../../../../scss/components/FaceboobAdsChart.scss';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import * as helper from '../../../@fuse/utils/helpers';

const arraySeries = [
	'Emerging market',
	'6 -> 10',
	'11 -> 15',
	'16 -> 20',
	'21 -> 25',
	'26 -> 30',
	'31 -> 35',
	'36 -> 40',
	'41 -> 45',
	'Saturated market'
];

function drawChart(title, data, categories) {
	return {
		chart: {
			type: 'column',
			reflow: false,
			height: 270,
			width: 360,
			animation: false
		},
		title: {
			text: ' '
		},
		xAxis: {
			categories: categories,
			labels: {
				rotation: 0
			}
		},
		yAxis: {
			allowDecimals: false,
			min: 0,
			title: {
				text: null
			},
			stackLabels: {
				enabled: true,
				style: {
					fontWeight: 'bold',
					color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
				}
			}
		},
		plotOptions: {
			column: {
				stacking: 'normal'
			},
			series: {
				animation: false,
				events: {
					legendItemClick: function () {
						return false;
					}
				}
			}
		},
		series: getSeries(data),
		credits: {
			enabled: false
		},
		tooltip: { enabled: false }
	};
}

//chia data vao 10 array
function getSeries(data) {
	if (!data) return;
	let arrayData = [
		data.Shopify.length,
		data.Aliexpress.length,
		data.Amazon.length,
		data.Ebay.length,
		data.Alibaba.length
	];
	let tempArray = matrix(10, 5, 0);
	let seriesArray = pushValue(tempArray, arrayData);
	let result = [];
	let count = 5;

	for (let i = 0; i < seriesArray.length; i++) {
		let tempObj = {};
		tempObj = {
			name: arraySeries[i],
			data: seriesArray[i],
			color: helper.getColorBaseValue(count),
			// states: { hover: { enabled: false } }
			showInLegend: false
		};
		count = count + 5;
		if (i == 0 || i == seriesArray.length - 1) {
			tempObj.showInLegend = true;
		}
		result.push(tempObj);
	}
	return result.reverse();
}

//create matrix
function matrix(rows, cols, defaultValue) {
	let arr = [];
	// Creates all lines:
	for (let i = 0; i < rows; i++) {
		// Creates an empty line
		arr.push([]);
		// Adds cols to the empty line:
		arr[i].push(new Array(cols));
		for (let j = 0; j < cols; j++) {
			// Initializes:
			arr[i][j] = defaultValue;
		}
	}
	return arr;
}

//push value in matrix
function pushValue(array, data) {
	for (let i = 0; i < array.length; i++) {
		let tempArray = [];
		for (let j = 0; j < array[i].length; j++) {
			//neu gia tri tru 5 lon hon hoac bang 0 thi push vao mang tam
			if (data[j] - 5 >= 0) {
				//neu gia tri tru 5 van lon hon 0 o vong cuoi thi push gia tri tru 5 vao mang
				if (i == array.length - 1) {
					tempArray.push(data[j]);
				} else {
					tempArray.push(5);
					data[j] = data[j] - 5;
				}
			} else {
				//neu gia tri tru 5 < 0 va gia tri > 0 thi push gia tri vao mang tam va set gia tri bang 0
				if (data[j] > 0) {
					tempArray.push(data[j]);
					data[j] = 0;
				} else {
					tempArray.push(0);
				}
			}
		}
		//gán lại vào mảng
		array[i] = tempArray;
	}
	return array;
}

function StackedChart({ title, data, categories }) {
	let options = drawChart(title, data, categories);
	return (
		<div
			className="stacked-chart"
			style={{
				height: '270px',
				width: '360px'
			}}
		>
			<HighchartsReact highcharts={Highcharts} options={options} />
		</div>
	);
}

export default StackedChart;
