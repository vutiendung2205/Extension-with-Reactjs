import React, { useState } from 'react';
import '../../../../../scss/components/FaceboobAdsChart.scss';

import { numberWithCommas, formatNumberToText, round } from '../../../../@fuse/utils/helpers';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import moment from 'moment';

import { Line } from 'react-chartjs-2';

function FacebookAdsChart({ tracking_time_arr, reactions_arr, shares_arr, comments_arr }) {
	const data = {
		labels: tracking_time_arr.map(t => moment(new Date(t)).format('MMM-DD')),
		datasets: [
			{
				label: 'Shares',
				fill: false,
				backgroundColor: 'rgb(0, 102, 204)',
				borderColor: 'rgb(0, 102, 204)',
				data: reactions_arr
			},
			{
				label: 'Likes',
				fill: false,
				backgroundColor: 'rgb(51, 153, 255)',
				borderColor: 'rgb(51, 153, 255)',
				data: shares_arr
			},
			{
				label: 'Comments',
				fill: false,
				backgroundColor: 'rgb(102, 204, 204)',
				borderColor: 'rgb(102, 204, 204)',
				data: comments_arr
			}
		]
	};
	let [options, setOptions] = useState({
		chart: {
			height: 150,
			type: 'spline',
			backgroundColor: 'rgba(255, 255, 255, 0.0)',
			fontSize: '9px',
			animation: false
		},
		title: {
			text: ''
		},
		responsive: true,
		maintainAspectRatio: false,
		xAxis: {
			type: 'datetime',
			dateTimeLabelFormats: {
				// don't display the dummy year
				month: '%e %b'
			},
			labels: {
				format: '{value:%b %e}'
			},
			title: {
				text: ''
			}
		},
		yAxis: {
			title: {
				text: ''
			}
		},
		tooltip: {
			fontSize: '9px',
			useHTML: true,
			crosshairs: true,
			shared: true,
			headerFormat: '<b>{point.x:%b %e, %Y}</b><br>',
			// pointFormat: '{point.x:%e. %b}: {point.y:.2f} m'
			pointFormatter: function () {
				let index = this.index;
				let previousData = 0;
				if (index > 0) {
					previousData = this.series.yData[index - 1];
				}
				let change = 0;
				if (previousData > 0) {
					change = round(((this.y - previousData) * 100) / previousData, 2);
				}
				let changeSpan = '';
				if (change > 0) {
					changeSpan = `<span class="text-pd text-pd-success"><i class='fa fa-arrow-up'></i>${numberWithCommas(
						round(change, 2)
					)}%</span>`;
				} else if (change < 0) {
					changeSpan = `<span class="text-pd text-pd-dangerous"><i class='fa fa-arrow-down'></i>${numberWithCommas(
						round(change * -1, 2)
					)}%</span>`;
				}
				return `<span style="color:${this.color}">\u25CF</span> ${
					this.series.name
				}: <b style="font-size:11px;"> ${numberWithCommas(formatNumberToText(this.y))}  ${changeSpan}</b><br>`;
			}
		},
		legend: {
			enabled: false
		},
		plotOptions: {
			spline: {
				marker: {
					enabled: true
				}
			},
			series: {
				animation: false,
				label: {
					enabled: false
				}
			}
		},
		exporting: {
			enabled: false
		},
		credits: { enabled: false },
		colors: ['#6CC', '#39F', '#06C', '#036', '#000'],

		// Define the data points. All series have a dummy year
		// of 1970/71 in order to be compared on the same x axis. Note
		// that in JavaScript, months start at 0 for January, 1 for February etc.
		series: [
			{
				name: 'Reactions',
				data: [
					[new Date(tracking_time_arr[0]).getTime(), reactions_arr[0]],
					[new Date(tracking_time_arr[1]).getTime(), reactions_arr[1]],
					[new Date(tracking_time_arr[2]).getTime(), reactions_arr[2]]
				]
			},
			{
				name: 'Shares',
				data: [
					[new Date(tracking_time_arr[0]).getTime(), shares_arr[0]],
					[new Date(tracking_time_arr[1]).getTime(), shares_arr[1]],
					[new Date(tracking_time_arr[2]).getTime(), shares_arr[2]]
				]
			},
			{
				name: 'Comments',
				data: [
					[new Date(tracking_time_arr[0]).getTime(), comments_arr[0]],
					[new Date(tracking_time_arr[1]).getTime(), comments_arr[1]],
					[new Date(tracking_time_arr[2]).getTime(), comments_arr[2]]
				]
			}
		]
	});
	return (
		<HighchartsReact highcharts={Highcharts} options={options} />
		// <Line data={data} options={
		//     {
		//         legend: {
		//             display: false
		//         },
		//         animation: {
		//             duration: 0
		//         },
		//         responsive: true,
		//         maintainAspectRatio: false,
		//         scales: {
		//             xAxes: [{
		//                 gridLines: {
		//                     display: false
		//                 }
		//             }],
		//             yAxes: [{
		//                 gridLines: {
		//                     display: false
		//                 },
		//                 labels: {
		//                     show: true
		//                 }
		//             }]
		//         },
		//         tooltips: {
		//             mode: 'index',
		//             intersect: false,
		//             titleFontSize: 8,
		//             bodyFontSize: 10,
		//             callbacks: {
		//                 title: () => '',
		//                 label: function (tooltipItem, data) {
		//                     var label = data.datasets[tooltipItem.datasetIndex].label || '';

		//                     if (label) {
		//                         label += ': ' + numberWithCommas(formatNumberToText(tooltipItem.yLabel));
		//                     }
		//                     // label += Math.round(tooltipItem.yLabel * 100) / 100;
		//                     return label;
		//                 }
		//             }
		//         },
		//         hover: {
		//             mode: 'nearest',
		//             intersect: true
		//         },
		//         layout: {
		//             padding: {
		//                 bottom: 10
		//             }
		//         }
		//     }
		// } />
	);
}

export default FacebookAdsChart;
