import React, { useState } from 'react';
import '../../../../scss/components/CircleChart.scss';
import LiquidFillGauge from 'react-liquid-gauge';
import { color } from 'd3-color';

function CircleChart({ config, type }) {
	let { radius, value, borderColor, waveColor, waveFrequency, waveAmplitude } = config;
	let title = type == 'Aliexpress' || type == 'Alibaba' ? ' Suppliers' : ' Competitors';
	return (
		<div className="container-circle-fluid" title={value + title} style={{ width: '140px', height: '200px' }}>
			<LiquidFillGauge
				style={{ margin: '0 auto' }}
				width={radius} //chieu rong
				height={radius} //chieu cao
				value={value * 2}
				percent=""
				textRenderer={({ value, width, height, textSize, percent }) => {
					value = Math.round(value);
					const radius = Math.min(height / 2, width / 2);
					const textPixels = (textSize * radius) / 2;
					const valueStyle = {
						fontSize: textPixels
					};
					const percentStyle = {
						fontSize: textPixels * 0.6
					};

					return (
						<tspan>
							<tspan className="value" style={valueStyle}>
								{Math.round(value / 2)}
							</tspan>
							<tspan style={percentStyle}></tspan>
						</tspan>
					);
				}}
				textSize={1}
				textOffsetX={0}
				textOffsetY={0}
				// riseAnimation
				waveAnimation
				waveFrequency={waveFrequency} // mật độ sóng
				waveAmplitude={waveAmplitude} // chiều cao sóng
				gradient
				circleStyle={{
					fill: borderColor //màu viền vòng tròn
				}}
				waveStyle={{
					fill: waveColor //màu sóng
				}}
				textStyle={{
					fill: color('#444').toString(), //màu chữ khi sóng chưa tràn
					fontFamily: 'Arial'
				}}
				waveTextStyle={{
					fill: color('#fff').toString(), //màu chữ khi sóng tràn
					fontFamily: 'Arial'
				}}
				margin={0.08} // margin giua vong tron ben trong va vien
				innerRadius={0.95}
				//   onClick={() => {
				//     this.setState({ value: Math.random() * 100 });
				//   }}
				circleThickness={0.1}
			/>
		</div>
	);
}

export default CircleChart;
