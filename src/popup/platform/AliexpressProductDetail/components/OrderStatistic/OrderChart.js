import React, { useState } from 'react';
import '../../../../../scss/components/FaceboobAdsChart.scss';
import * as helper from '../../../../@fuse/utils/helpers';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import moment from 'moment';

function OrderChart({ orderChart }) {
	let dataChart = orderChart.analysis_chart ? orderChart.analysis_chart : [];
	let chartTotal = [];
	let arrayChart7Day = [];

	for (let i = 0; i < 7; i++) {
		if (dataChart[dataChart.length - 1]) {
			let trim_date = moment(
				new Date(dataChart[dataChart.length - 1].trim_date.replace(/\//g, '-') + 'T00:00:00+00:00')
			)
				.subtract(i, 'days')
				.format('YYYY/MM/DD');
			let quantity = dataChart.filter(d => d.trim_date == trim_date)[0]
				? dataChart.filter(d => d.trim_date == trim_date)[0].value
				: 0;

			// chartTotal.push({
			//   trim_date: moment(new Date(dataChart[dataChart.length - 1].trim_date.replace(/\//g, "-") + "T00:00:00+00:00")).subtract(i, 'days').valueOf(),
			//   quantity
			// });
			arrayChart7Day.push([
				moment(new Date(dataChart[dataChart.length - 1].trim_date.replace(/\//g, '-') + 'T00:00:00+00:00'))
					.subtract(i, 'days')
					.valueOf(),
				quantity
			]);
		}
	}

	arrayChart7Day = arrayChart7Day.reverse();

	if (arrayChart7Day.length > 0) {
		const options = {
			chart: {
				type: 'spline',
				backgroundColor: '#fff',
				height: '250px'
			},
			title: {
				text: ''
			},

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
				useHTML: true,
				crosshairs: true,
				shared: true,
				headerFormat: '<b>{point.x:%b %e, %Y}</b><br>',
				pointFormatter: function () {
					let index = this.index;
					let previousData = 0;
					if (index > 0) {
						previousData = this.series.yData[index - 1];
					}
					let change = 0;
					if (previousData > 0) {
						change = helper.round(((this.y - previousData) * 100) / previousData, 2);
					}
					let changeSpan = '';
					if (change > 0) {
						changeSpan = `<span class="text-pd-success"><i class="fa fa-arrow-up"></i> ${helper.numberWithCommas(
							helper.round(change, 2)
						)}%</span>`;
					} else if (change < 0) {
						changeSpan = `<span class="text-pd-dangerous"><i class="fa fa-arrow-down"></i> ${helper.numberWithCommas(
							helper.round(change * -1, 2)
						)}%</span>`;
					}
					let totalOrder = chartTotal.filter(d => d.trim_date == this.x)[0];
					if (totalOrder && totalOrder.quantity != 0) {
						let currentIndex = chartTotal.findIndex(d => d.trim_date == this.x);
						let beforeOrder = chartTotal[currentIndex - 1];
						let changeTotalOrder = 0;
						if (beforeOrder && beforeOrder.quantity) {
							changeTotalOrder = helper.round(
								((totalOrder.quantity - beforeOrder.quantity) * 100) / beforeOrder.quantity,
								2
							);
							if (changeTotalOrder > 0) {
								changeTotalOrder = `<span class="text-pd-success"><i class="fa fa-arrow-up"></i> ${helper.numberWithCommas(
									helper.round(changeTotalOrder, 2)
								)}%</span>`;
							} else if (changeTotalOrder < 0) {
								changeTotalOrder = `<span class="text-pd-dangerous"><i class="fa fa-arrow-down"></i> ${helper.numberWithCommas(
									helper.round(changeTotalOrder * -1, 2)
								)}%</span>`;
							}
						}
						return `
              <span style="color:${this.color}">\u25CF</span> ${this.series.name}: <b> ${helper.numberWithCommas(
							helper.formatNumberToText(this.y)
						)}  ${changeSpan}</b><br>
              <span style="color:#e62e04">\u25CF</span> Orders in all time: <b> ${totalOrder.quantity}  ${
							changeTotalOrder != 0 ? changeTotalOrder : ''
						}</b><br>
              `;
					} else {
						return `
              <span style="color:${this.color}">\u25CF</span> ${this.series.name}: <b> ${helper.numberWithCommas(
							helper.formatNumberToText(this.y)
						)}  ${changeSpan}</b><br>
              `;
					}
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
					label: {
						enabled: false
					}
				}
			},
			exporting: {
				enabled: false
			},
			credits: { enabled: false },
			colors: ['#fd9729'],

			series:
				arrayChart7Day && arrayChart7Day.length > 0
					? [
							{
								name: 'Sale Volume',
								data: arrayChart7Day
							}
					  ]
					: []
		};
		var result = <HighchartsReact highcharts={Highcharts} options={options} />;
		return (
			<div>
				<div className="title-pexgle">
					<span>&nbsp;Daily Orders Chart</span>
				</div>
				<div style={{ width: '352px' }} className="order-chart" id="order-chart">
					{result}
				</div>
			</div>
		);
	} else {
		return (
			<div>
				<div className="title-pexgle">
					<span>&nbsp;Daily Orders Chart</span>
				</div>
				<div
					style={{
						background: '#fff',
						textAlign: 'center',
						color: '#90949c',
						fontSize: '15px',
						textShadow: '0 1px 0 rgba(255, 255, 255, 1)',
						fontFamily: 'Helvetica, Arial, sans-serif'
					}}
					className="order-chart"
					id="order-chart"
				>
					NOT ENOUGH DATA
				</div>
			</div>
		);
	}
}

export default OrderChart;
