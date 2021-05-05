/* global chrome */
/* eslint-disable */
import $ from 'jquery';
import React from 'react';
import cheerio from 'cheerio';
import { COLOR_CHART } from '../config/constants';
import * as config from '../config/constants';
import imgLogo from '../../../images/img/pexgle-logo.jpg';
// import { currency_list } from '../config/currencies';
import currencyList from '../config/currencies';
// import moment from 'moment';
import arrayCurrency from '../config/currencies.json';
import api from './api';

const queryString = require('query-string');
const moment = require('moment');

export function mapNewProduct(domain, products) {
	return products.map(productObj => {
		const prices = productObj.variants.map(v => parseFloat(v.price) * 100).sort((a, b) => a - b);
		const compareAtPrices = productObj.variants
			.map(v => (v.compare_at_price ? parseFloat(v.compare_at_price) * 100 : null))
			.sort((a, b) => a - b);
		const priceMin = prices[0];
		const priceMax = prices[prices.length - 1];
		const compareAtPriceMin = compareAtPrices[0];
		const compareAtPriceMax = compareAtPrices[compareAtPrices.length - 1];
		return {
			isNew: true,
			product_id: productObj.id,
			domain,
			title: productObj.title,
			handle: productObj.handle,
			currency: window.ShopifyAnalytics.meta.currency,
			published_at: productObj.published_at,
			product_created_at: productObj.created_at,
			vendor: productObj.vendor,
			link: `https://${domain}/products/${productObj.handle}`,
			price: priceMin,
			price_dollar: priceMin * arrayCurrency[window.ShopifyAnalytics.meta.currency],
			priceMin,
			priceMax,
			compare_at_price: compareAtPriceMin,
			compareAtPriceMin,
			compareAtPriceMax,
			images: productObj.images.map(im => im.src),
			image: productObj.images[0] ? productObj.images[0].src : '',
			options: productObj.options.map(elm => elm.name),
			updated_at: Date.now()
		};
	});
}
export function mapBestSellingProduct(domain, body, month) {
	// let $ = cheerio.load(body);
	const $cheerio = cheerio.load(body);
	let products = $cheerio(`a[href*='/products/']`)
		.not("a[href*='jpg']")
		.map((i, e) => {
			let link = $cheerio(e).attr('href');
			link = queryString.parseUrl(link).url;
			return link.split('/')[link.split('/').length - 1];
		})
		.get();
	products = [...new Set(products)];
	products = products.map(p =>
		api
			.get(`https://${domain}/products/${p}.js`)
			.then(d => ({ ...d, handle: p }))
			.catch(e => null)
	);
	return Promise.all(products).then(productsss => {
		productsss = productsss.filter(p => !!p);

		const productss = productsss.filter(p => {
			return (
				moment(p.created_at).startOf('month').diff(moment(month, 'YYYY/MM/DD').startOf('month'), 'months') >= 0
			);
		});
		return productss.map((productObj, i) => {
			const prices = productObj.variants.map(v => parseFloat(v.price)).sort((a, b) => a - b);
			const compareAtPrices = productObj.variants
				.map(v => (v.compare_at_price ? parseFloat(v.compare_at_price) : null))
				.sort((a, b) => a - b);
			const priceMin = prices[0];
			const priceMax = prices[prices.length - 1];
			const compareAtPriceMin = compareAtPrices[0];
			const compareAtPriceMax = compareAtPrices[compareAtPrices.length - 1];
			return {
				loadInsite: true,
				product_id: productObj.id,
				status: 2,
				traffic: products.length - i,
				title: productObj.title,
				handle: productObj.handle,
				link: `https://${domain}/products/${productObj.handle}`,
				currency: window.ShopifyAnalytics.meta.currency,
				published_at: productObj.published_at,
				product_created_at: productObj.created_at,
				vendor: productObj.vendor,
				price: priceMin,
				price_dollar: priceMin * arrayCurrency[window.ShopifyAnalytics.meta.currency],
				priceMin,
				priceMax,
				compare_at_price: compareAtPriceMin,
				compareAtPriceMin,
				compareAtPriceMax,
				statistical_time: moment(productObj.created_at).startOf('month').format('YYYY/MM/DD'),
				image: productObj.featured_image
					? productObj.featured_image.replace('//', 'https://')
					: productObj.images[0]
			};
		});
	});
}

export function CheckNeedRender(props, state) {
	const propList = Object.keys(props);
	for (const property of propList) {
		if (props[property].hasOwnProperty('tabId') && props[property].tabId !== state.tabId) {
			return false;
		}
	}
	return true;
}

export function getPropsByTabId(prop, state, rootProps) {
	return typeof state[prop][rootProps.tabId] !== 'undefined' ? state[prop][rootProps.tabId] : state[prop].default;
}

export function getLoadingPercent(state, rootProps) {
	let currentFeature = '';
	let currentLoadingArea = '';
	currentFeature = state.currentFeatureShopifyTab[rootProps.tabId]
		? state.currentFeatureShopifyTab[rootProps.tabId]
		: state.currentFeatureShopifyTab.default;
	currentLoadingArea = state.currentLoadingArea[rootProps.tabId]
		? state.currentLoadingArea[rootProps.tabId]
		: undefined;
	if (
		state.currentLoadingPercent[rootProps.tabId] === undefined ||
		state.currentLoadingPercent[rootProps.tabId][currentFeature] === undefined
	) {
		return {
			percent: 0,
			currentLoadingArea: currentLoadingArea,
			currentFeature: currentFeature,
			isFake: true,
			acceleration: 1000
		};
	}
	if (typeof state.currentLoadingPercent[rootProps.tabId][currentFeature][currentLoadingArea] !== 'undefined') {
		const p = state.currentLoadingPercent[rootProps.tabId][currentFeature][currentLoadingArea];
		return {
			percent: p.percent,
			currentLoadingArea: currentLoadingArea,
			currentFeature: currentFeature,
			isFake: p.isFake,
			acceleration: p.acceleration
		};
	} else {
		if (state.currentLoadingPercent[rootProps.tabId][currentFeature]) {
			const p = state.currentLoadingPercent[rootProps.tabId][currentFeature];
			return {
				percent: p.percent,
				currentLoadingArea: currentLoadingArea,
				currentFeature: currentFeature,
				isFake: p.isFake,
				acceleration: p.acceleration
			};
		} else {
			const p = state.currentLoadingPercent[rootProps.tabId];
			return {
				percent: p.percent,
				currentLoadingArea: currentLoadingArea,
				currentFeature: currentFeature,
				isFake: p.isFake,
				acceleration: p.acceleration
			};
		}
	}
}

/**
 * Genagrate Login Pexgle
 */
export function genPexgleLogin(divContainerSelector, pexgleShadow) {
	let pgHtmlLogin = `<div id = "pgLogin" style="z-index:999;position:absolute;top:0px;left:0px;
        background-color: rgba(255,255,255,.9);font-family: Nunito;width: 100%;height:100%;">
        <div style="display:flex;flex-direction:column;align-items: center;width: 270px;margin: auto;">
                <div style="    width: 90px;
                background-color: white;
                padding: 15px 15px;
                border-radius: 27px;
                box-shadow: 1px 1px 15px #c4c0c0;
                text-align: center;
                margin: 60px 0px 20px 0px;"> <img src="${chrome.runtime.getURL(imgLogo)}" alt="logo"></div>
                <div style="    font-size: 18px;font-weight: bold;text-align: center;margin-bottom: 15px;"> Log in to achieve financial freedom.</div>
                <div style="text-align: center;font-size: 13px;margin-bottom: 20px;padding:0px 10px;">You need to log in to start take your bussiness to the next level</div>
                <a href="${config.PEXGLE_HOST}/login/" target = "_blank" style="width: 100%;
                height: 40px;
                display: block;
                color: white;
                background-color: rgb(255,113,40);
                text-align: center;
                vertical-align: middle;
                line-height: 40px;
                border-radius: 3px; margin-bottom: 15px;text-decoration: none;"> Log in to start</a>
                <a href="${
					config.PEXGLE_HOST
				}/login/?action=forgot_password" target = "_blank" style="font-size: 12px; align-self: flex-start;    margin-bottom: 10px;
                text-decoration: underline;
                color: darkgray;"> Forgot password?</a>
                <div style="font-size:16px;align-self: flex-start;"><span>Not a member</span> <a href="${
					config.PEXGLE_HOST
				}" target = "_blank" style="text-decoration: underline;"> Join Pexgle</a></div>
                <div style="font-size:16px;align-self: center;margin-top:50px;    cursor: pointer;"><span id="pgBtnCloseLogin" style="text-decoration: underline;font-size: 12px;">No thanks.</span> </div>
        </div>
        </div>`;
	if (pexgleShadow.find('#pgLogin').length === 0) {
		pexgleShadow.find(divContainerSelector).append(pgHtmlLogin);
	}
	pexgleShadow.find('#pgBtnCloseLogin')[0].addEventListener('click', function () {
		pexgleShadow.find('#pgLogin').hide();
	});
	pexgleShadow.find('#pgLogin').show();
}

export function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function getUpdown(number) {
	if (Number(number) > 0) return 'up';
	else if (Number(number) < 0) return 'down';
	else return 'normal';
}
/**
 * Get last month
 */
export function getLastMonth() {
	let m = new Date().getMonth();
	if (m === 0) {
		return 11;
	} else {
		return m - 1;
	}
}

/**
 * generate Change Compare
 */
export function generateChangeSpan(change, showZero) {
	if (change > 0) {
		return (
			<div className="text-pd-success" title="Traffic percent change from last month.">
				<i className="fa fa-arrow-up" />
				{this.formatNumberToText(parseFloat(change), true)}%
			</div>
		);
	} else if (!change || !parseFloat(change)) {
		return <div className="text-pd-muted">{showZero ? 'N/A' : ''}</div>;
	} else if (change < 0) {
		let newChange = change.toString().substr(1);
		return (
			<div className="text-pd-dangerous" title="Traffic percent change from last month.">
				<i className="fa fa-arrow-down"></i>
				{this.formatNumberToText(parseFloat(newChange), true)}%
			</div>
		);
	}
}

/**
 * Format Number To Text
 */
export function formatNumberToText(n, zeroToNA = false) {
	if (!zeroToNA && n === 0) {
		return '0';
	}
	if (!n) return 'N/A';
	let base = Math.floor(Math.log(Math.abs(n)) / Math.log(1000));
	let suffix = 'KMB'[base - 1];
	let v = 1000 ** base;
	let result = suffix ? Math.round(n / v, 2) + suffix : '' + n;
	if (zeroToNA && result === 0) {
		return 'N/A';
	}
	return result;
}

/**
 * show currency on Html
 */
export function priceToHTML(product) {
	let currency = '';
	if (currencyList[product.currency] !== undefined) {
		currency = currencyList[product.currency];
	} else {
		currency = currencyList.USD;
	}
	let productPrice = this.getProductPrice(product.priceMin, product.priceMax, product.price);
	return (
		<span
			title={currency.symbol + productPrice}
			style={{
				cursor: 'pointer',
				whiteSpace: 'nowrap',
				overflow: 'hidden',
				textOverflow: 'ellipsis',
				maxWidth: '80%'
			}}
		>
			{currency.symbol + productPrice}
		</span>
	);
}

/**
 * Get Price Product
 */
export function getProductPrice(min, max, price) {
	if (min !== max) {
		return this.numberWithCommas(min / 100) + ' - ' + this.numberWithCommas(max / 100);
	} else if (price > 0) {
		return this.numberWithCommas(price / 100);
	}
	return 0;
}

/**
 * Event Click checkbox select product
 */
export function _select_product(id, _this) {
	let jSelect = $('#list-product-' + id);
	jSelect.parents('.product-item').find('.card').toggleClass('checked');

	if ($(_this).is(':checked')) {
		jSelect.prop('checked', true);
	} else {
		jSelect.prop('checked', false);
	}
}

/**
 * Sleep
 * @param {*} ms
 */
export function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * debounce to search
 * @param {*} func
 * @param {*} wait
 * @param {*} immediate
 */
export function debounce(func, wait, immediate) {
	let timeout;
	return function () {
		let context = this,
			args = arguments;
		let later = function () {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		let callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}

/**
 * round Down Price
 * @param {*} num
 * @param {*} byPass
 */
export function roundDown(num, byPass = false) {
	if (num < 1 || byPass) {
		return num.toFixed(2);
	} else return Math.floor(num);
}

export function embedHtmlCss() {
	$('head').append(`
          <style>
              @font-face{
                  font-family:'FontAwesome';
                  src:url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont.eot?v=4.7.0');
                  src:url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont.eot?#iefix&v=4.7.0') format('embedded-opentype'),url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont.woff2?v=4.7.0') format('woff2'),url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont.woff?v=4.7.0') format('woff'),url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont.ttf?v=4.7.0') format('truetype'),url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont.svg?v=4.7.0#fontawesomeregular') format('svg');
                  font-weight:normal;
                  font-style:normal
              }
              /* vietnamese */
              @font-face {
              font-family: 'Asap';
              font-style: italic;
              font-weight: 400;
              src: local('Asap Italic'), local('Asap-Italic'), url(https://fonts.gstatic.com/s/asap/v9/KFOmCniXp96ayz4u7WxKOzY.woff2) format('woff2');
              unicode-range: U+0102-0103, U+0110-0111, U+1EA0-1EF9, U+20AB;
              }
              /* latin-ext */
              @font-face {
              font-family: 'Asap';
              font-style: italic;
              font-weight: 400;
              src: local('Asap Italic'), local('Asap-Italic'), url(https://fonts.gstatic.com/s/asap/v9/KFOmCniXp96ayz4u7GxKOzY.woff2) format('woff2');
              unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
              }
              /* latin */
              @font-face {
              font-family: 'Asap';
              font-style: italic;
              font-weight: 400;
              src: local('Asap Italic'), local('Asap-Italic'), url(https://fonts.gstatic.com/s/asap/v9/KFOmCniXp96ayz4u4mxK.woff2) format('woff2');
              unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
              }
              /* vietnamese */
              @font-face {
              font-family: 'Asap';
              font-style: italic;
              font-weight: 500;
              src: local('Asap Medium Italic'), local('Asap-MediumItalic'), url(https://fonts.gstatic.com/s/asap/v9/KFOlCniXp96ayz4mEU9fCxc4EsA.woff2) format('woff2');
              unicode-range: U+0102-0103, U+0110-0111, U+1EA0-1EF9, U+20AB;
              }
              /* latin-ext */
              @font-face {
              font-family: 'Asap';
              font-style: italic;
              font-weight: 500;
              src: local('Asap Medium Italic'), local('Asap-MediumItalic'), url(https://fonts.gstatic.com/s/asap/v9/KFOlCniXp96ayz4mEU9fChc4EsA.woff2) format('woff2');
              unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
              }
              /* latin */
              @font-face {
              font-family: 'Asap';
              font-style: italic;
              font-weight: 500;
              src: local('Asap Medium Italic'), local('Asap-MediumItalic'), url(https://fonts.gstatic.com/s/asap/v9/KFOlCniXp96ayz4mEU9fBBc4.woff2) format('woff2');
              unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
              }
              /* vietnamese */
              @font-face {
              font-family: 'Nunito';
              font-style: normal;
              font-weight: 400;
              src: local('Nunito Regular'), local('Nunito-Regular'), url(https://fonts.gstatic.com/s/nunito/v10/XRXV3I6Li01BKofIOuaBXso.woff2) format('woff2');
              unicode-range: U+0102-0103, U+0110-0111, U+1EA0-1EF9, U+20AB;
              }
              /* latin-ext */
              @font-face {
              font-family: 'Nunito';
              font-style: normal;
              font-weight: 400;
              src: local('Nunito Regular'), local('Nunito-Regular'), url(https://fonts.gstatic.com/s/nunito/v10/XRXV3I6Li01BKofIO-aBXso.woff2) format('woff2');
              unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
              }
              /* latin */
              @font-face {
              font-family: 'Nunito';
              font-style: normal;
              font-weight: 400;
              src: local('Nunito Regular'), local('Nunito-Regular'), url(https://fonts.gstatic.com/s/nunito/v10/XRXV3I6Li01BKofINeaB.woff2) format('woff2');
              unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
              }
              /* vietnamese */
              @font-face {
              font-family: 'Nunito';
              font-style: normal;
              font-weight: 800;
              src: local('Nunito ExtraBold'), local('Nunito-ExtraBold'), url(https://fonts.gstatic.com/s/nunito/v10/XRXW3I6Li01BKofAksCUbuvISTs.woff2) format('woff2');
              unicode-range: U+0102-0103, U+0110-0111, U+1EA0-1EF9, U+20AB;
              }
              /* latin-ext */
              @font-face {
              font-family: 'Nunito';
              font-style: normal;
              font-weight: 800;
              src: local('Nunito ExtraBold'), local('Nunito-ExtraBold'), url(https://fonts.gstatic.com/s/nunito/v10/XRXW3I6Li01BKofAksCUb-vISTs.woff2) format('woff2');
              unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
              }
              /* latin */
              @font-face {
              font-family: 'Nunito';
              font-style: normal;
              font-weight: 800;
              src: local('Nunito ExtraBold'), local('Nunito-ExtraBold'), url(https://fonts.gstatic.com/s/nunito/v10/XRXW3I6Li01BKofAksCUYevI.woff2) format('woff2');
              unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
              }
              /* vietnamese */
              @font-face {
                font-family: 'Muli';
                font-style: normal;
                font-weight: 400;
                src: local('Muli Regular'), local('Muli-Regular'), url(https://fonts.gstatic.com/s/muli/v16/7Auwp_0qiz-afT3GLRrX.woff2) format('woff2');
                unicode-range: U+0102-0103, U+0110-0111, U+1EA0-1EF9, U+20AB;
              }
              /* latin-ext */
              @font-face {
                font-family: 'Muli';
                font-style: normal;
                font-weight: 400;
                src: local('Muli Regular'), local('Muli-Regular'), url(https://fonts.gstatic.com/s/muli/v16/7Auwp_0qiz-afTzGLRrX.woff2) format('woff2');
                unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
              }
              /* latin */
              @font-face {
                font-family: 'Muli';
                font-style: normal;
                font-weight: 400;
                src: local('Muli Regular'), local('Muli-Regular'), url(https://fonts.gstatic.com/s/muli/v16/7Auwp_0qiz-afTLGLQ.woff2) format('woff2');
                unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
              }
              /* cyrillic-ext */
              @font-face {
                font-family: 'Roboto';
                font-style: normal;
                font-weight: 400;
                src: local('Roboto'), local('Roboto-Regular'), url(https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu72xKOzY.woff2) format('woff2');
                unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
              }
              /* cyrillic */
              @font-face {
                font-family: 'Roboto';
                font-style: normal;
                font-weight: 400;
                src: local('Roboto'), local('Roboto-Regular'), url(https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu5mxKOzY.woff2) format('woff2');
                unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
              }
              /* greek-ext */
              @font-face {
                font-family: 'Roboto';
                font-style: normal;
                font-weight: 400;
                src: local('Roboto'), local('Roboto-Regular'), url(https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu7mxKOzY.woff2) format('woff2');
                unicode-range: U+1F00-1FFF;
              }
              /* greek */
              @font-face {
                font-family: 'Roboto';
                font-style: normal;
                font-weight: 400;
                src: local('Roboto'), local('Roboto-Regular'), url(https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4WxKOzY.woff2) format('woff2');
                unicode-range: U+0370-03FF;
              }
              /* vietnamese */
              @font-face {
                font-family: 'Roboto';
                font-style: normal;
                font-weight: 400;
                src: local('Roboto'), local('Roboto-Regular'), url(https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu7WxKOzY.woff2) format('woff2');
                unicode-range: U+0102-0103, U+0110-0111, U+1EA0-1EF9, U+20AB;
              }
              /* latin-ext */
              @font-face {
                font-family: 'Roboto';
                font-style: normal;
                font-weight: 400;
                src: local('Roboto'), local('Roboto-Regular'), url(https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu7GxKOzY.woff2) format('woff2');
                unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
              }
              /* latin */
              @font-face {
                font-family: 'Roboto';
                font-style: normal;
                font-weight: 400;
                src: local('Roboto'), local('Roboto-Regular'), url(https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxK.woff2) format('woff2');
                unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
              }
              /* devanagari */
              @font-face {
                font-family: 'Poppins';
                font-style: normal;
                font-weight: 400;
                src: local('Poppins Regular'), local('Poppins-Regular'), url(https://fonts.gstatic.com/s/poppins/v8/pxiEyp8kv8JHgFVrJJbecmNE.woff2) format('woff2');
                unicode-range: U+0900-097F, U+1CD0-1CF6, U+1CF8-1CF9, U+200C-200D, U+20A8, U+20B9, U+25CC, U+A830-A839, U+A8E0-A8FB;
              }
              /* latin-ext */
              @font-face {
                font-family: 'Poppins';
                font-style: normal;
                font-weight: 400;
                src: local('Poppins Regular'), local('Poppins-Regular'), url(https://fonts.gstatic.com/s/poppins/v8/pxiEyp8kv8JHgFVrJJnecmNE.woff2) format('woff2');
                unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
              }
              /* latin */
              @font-face {
                font-family: 'Poppins';
                font-style: normal;
                font-weight: 400;
                src: local('Poppins Regular'), local('Poppins-Regular'), url(https://fonts.gstatic.com/s/poppins/v8/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
                unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
              }
          </style>    
      `);
	$('body').append(`
          <div id="pexgle-extension-container" style="all:initial"></div>
      `);
}

//get location
export function getLocation(href) {
	var l = document.createElement('a');
	l.href = href;
	return l;
}

export function round(n, precision) {
	let prec = Math.pow(10, precision);
	return Math.round(n * prec) / prec;
}

//get color base value //
export function getColorBaseValue(value) {
	let color = '';
	switch (true) {
		case value <= 5:
			color = COLOR_CHART.UNDER_5;
			break;
		case value > 5 && value <= 10:
			color = COLOR_CHART.UNDER_10;
			break;
		case value > 10 && value <= 15:
			color = COLOR_CHART.UNDER_15;
			break;
		case value > 15 && value <= 20:
			color = COLOR_CHART.UNDER_20;
			break;
		case value > 20 && value <= 25:
			color = COLOR_CHART.UNDER_25;
			break;
		case value > 25 && value <= 30:
			color = COLOR_CHART.UNDER_30;
			break;
		case value > 30 && value <= 35:
			color = COLOR_CHART.UNDER_35;
			break;
		case value > 35 && value <= 40:
			color = COLOR_CHART.UNDER_40;
			break;
		case value > 40 && value <= 45:
			color = COLOR_CHART.UNDER_45;
			break;
		case value > 45 && value <= 50:
			color = COLOR_CHART.UNDER_50;
			break;
		case value > 50:
			color = COLOR_CHART.UNDER_50;
			break;
		default:
			color = COLOR_CHART.DEFAULT;
	}
	return color;
}

// edit link to show //
export function getLinkToShow(link, type) {
	let numberSplice = 0;
	if (type === 'Aliexpress' || type === 'Shopify' || type === 'Ebay' || type === 'Alibaba') {
		numberSplice = 4;
	} else if (type === 'Amazon') {
		numberSplice = 3;
	}

	let newLink = link.replace('.html', '');
	let result = newLink.split('/').splice(numberSplice).join('/');
	return result;
}
/**
 * Get id of an aliexpress product detail from URL
 * @param href: page url of aliexpress product detail
 */
export function getAliexpressProductId(href) {
	let id = href.slice(href.lastIndexOf('/') + 1, href.indexOf('.html'));
	if (id.indexOf('_') > -1) {
		id = id.split('_')[1];
	}
	if (id.indexOf('_') > -1) {
		id = id.split('_')[1];
	}
	return id;
}
/**
 * Get country information by name
 * @param name
 * @param arrayCountry
 */
export function filterCountryByName(name, arrayCountry) {
	return Object.keys(arrayCountry).filter(key => arrayCountry[key] === name)[0];
}

export const countriesAllCode = {
	BD: 'Bangladesh',
	BE: 'Belgium',
	BF: 'Burkina Faso',
	BG: 'Bulgaria',
	BA: 'Bosnia and Herzegovina',
	BB: 'Barbados',
	WF: 'Wallis and Futuna',
	BL: 'Saint' + ' Barthelemy',
	BM: 'Bermuda',
	BN: 'Brunei',
	BO: 'Bolivia',
	BH: 'Bahrain',
	BI: 'Burundi',
	BJ: 'Benin',
	BT: 'Bhutan',
	JM: 'Jamaica',
	BV: 'Bouvet Island',
	BW: 'Botswana',
	WS: 'Samoa',
	BQ: 'Bonaire, Saint Eustatius and Saba ',
	BR: 'Brazil',
	BS: 'Bahamas',
	JE: 'Jersey',
	BY: 'Belarus',
	BZ: 'Belize',
	RU: 'Russia',
	RW: 'Rwanda',
	RS: 'Serbia',
	TL: 'East Timor',
	RE: 'Reunion',
	TM: 'Turkmenistan',
	TJ: 'Tajikistan',
	RO: 'Romania',
	TK: 'Tokelau',
	GW: 'Guinea-Bissau',
	GU: 'Guam',
	GT: 'Guatemala',
	GS: 'South Georgia and the South Sandwich Islands',
	GR: 'Greece',
	GQ: 'Equatorial Guinea',
	GP: 'Guadeloupe',
	JP: 'Japan',
	GY: 'Guyana',
	GG: 'Guernsey',
	GF: 'French Guiana',
	GE: 'Georgia',
	GD: 'Grenada',
	UK: 'United Kingdom',
	GA: 'Gabon',
	SV: 'El Salvador',
	GN: 'Guinea',
	GM: 'Gambia',
	GL: 'Greenland',
	GI: 'Gibraltar',
	GH: 'Ghana',
	OM: 'Oman',
	TN: 'Tunisia',
	JO: 'Jordan',
	HR: 'Croatia',
	HT: 'Haiti',
	HU: 'Hungary',
	HK: 'Hong Kong',
	HN: 'Honduras',
	HM: 'Heard Island and McDonald Islands',
	VE: 'Venezuela',
	PR: 'Puerto Rico',
	PS: 'Palestinian Territory',
	PW: 'Palau',
	PT: 'Portugal',
	SJ: 'Svalbard and Jan Mayen',
	PY: 'Paraguay',
	IQ: 'Iraq',
	PA: 'Panama',
	PF: 'French Polynesia',
	PG: 'Papua New Guinea',
	PE: 'Peru',
	PK: 'Pakistan',
	PH: 'Philippines',
	PN: 'Pitcairn',
	PL: 'Poland',
	PM: 'Saint Pierre and Miquelon',
	ZM: 'Zambia',
	EH: 'Western Sahara',
	EE: 'Estonia',
	EG: 'Egypt',
	ZA: 'South Africa',
	EC: 'Ecuador',
	IT: 'Italy',
	VN: 'Vietnam',
	SB: 'Solomon Islands',
	ET: 'Ethiopia',
	SO: 'Somalia',
	ZW: 'Zimbabwe',
	SA: 'Saudi Arabia',
	ES: 'Spain',
	ER: 'Eritrea',
	ME: 'Montenegro',
	MD: 'Moldova',
	MG: 'Madagascar',
	MF: 'Saint Martin',
	MA: 'Morocco',
	MC: 'Monaco',
	UZ: 'Uzbekistan',
	MM: 'Myanmar',
	ML: 'Mali',
	MO: 'Macao',
	MN: 'Mongolia',
	MH: 'Marshall Islands',
	MK: 'Macedonia',
	MU: 'Mauritius',
	MT: 'Malta',
	MW: 'Malawi',
	MV: 'Maldives',
	MQ: 'Martinique',
	MP: 'Northern Mariana Islands',
	MS: 'Montserrat',
	MR: 'Mauritania',
	IM: 'Isle of Man',
	UG: 'Uganda',
	TZ: 'Tanzania',
	MY: 'Malaysia',
	MX: 'Mexico',
	IL: 'Israel',
	FR: 'France',
	IO: 'British Indian Ocean Territory',
	SH: 'Saint Helena',
	FI: 'Finland',
	FJ: 'Fiji',
	FK: 'Falkland Islands',
	FM: 'Micronesia',
	FO: 'Faroe Islands',
	NI: 'Nicaragua',
	NL: 'Netherlands',
	NO: 'Norway',
	NA: 'Namibia',
	VU: 'Vanuatu',
	NC: 'New Caledonia',
	NE: 'Niger',
	NF: 'Norfolk Island',
	NG: 'Nigeria',
	NZ: 'New Zealand',
	NP: 'Nepal',
	NR: 'Nauru',
	NU: 'Niue',
	CK: 'Cook Islands',
	XK: 'Kosovo',
	CI: 'Ivory Coast',
	CH: 'Switzerland',
	CO: 'Colombia',
	CN: 'China',
	CM: 'Cameroon',
	CL: 'Chile',
	CC: 'Cocos Islands',
	CA: 'Canada',
	CG: 'Republic of the Congo',
	CF: 'Central African Republic',
	CD: 'Democratic Republic of the Congo',
	CZ: 'Czech Republic',
	CY: 'Cyprus',
	CX: 'Christmas Island',
	CR: 'Costa Rica',
	CW: 'Curacao',
	CV: 'Cape Verde',
	CU: 'Cuba',
	SZ: 'Swaziland',
	SY: 'Syria',
	SX: 'Sint Maarten',
	KG: 'Kyrgyzstan',
	KE: 'Kenya',
	SS: 'South Sudan',
	SR: 'Suriname',
	KI: 'Kiribati',
	KH: 'Cambodia',
	KN: 'Saint Kitts and Nevis',
	KM: 'Comoros',
	ST: 'Sao Tome and Principe',
	SK: 'Slovakia',
	KR: 'South Korea',
	SI: 'Slovenia',
	KP: 'North Korea',
	KW: 'Kuwait',
	SN: 'Senegal',
	SM: 'San Marino',
	SL: 'Sierra Leone',
	SC: 'Seychelles',
	KZ: 'Kazakhstan',
	KY: 'Cayman Islands',
	SG: 'Singapore',
	SE: 'Sweden',
	SD: 'Sudan',
	DO: 'Dominican Republic',
	DM: 'Dominica',
	DJ: 'Djibouti',
	DK: 'Denmark',
	VG: 'British Virgin Islands',
	DE: 'Germany',
	YE: 'Yemen',
	DZ: 'Algeria',
	US: 'United States',
	UY: 'Uruguay',
	YT: 'Mayotte',
	UM: 'United States Minor Outlying Islands',
	LB: 'Lebanon',
	LC: 'Saint Lucia',
	LA: 'Laos',
	TV: 'Tuvalu',
	TW: 'Taiwan',
	TT: 'Trinidad and Tobago',
	TR: 'Turkey',
	LK: 'Sri Lanka',
	LI: 'Liechtenstein',
	LV: 'Latvia',
	TO: 'Tonga',
	LT: 'Lithuania',
	LU: 'Luxembourg',
	LR: 'Liberia',
	LS: 'Lesotho',
	TH: 'Thailand',
	TF: 'French Southern Territories',
	TG: 'Togo',
	TD: 'Chad',
	TC: 'Turks and Caicos Islands',
	LY: 'Libya',
	VA: 'Vatican',
	VC: 'Saint Vincent and the Grenadines',
	AE: 'United Arab Emirates',
	AD: 'Andorra',
	AG: 'Antigua and Barbuda',
	AF: 'Afghanistan',
	AI: 'Anguilla',
	VI: 'U.S. Virgin Islands',
	IS: 'Iceland',
	IR: 'Iran',
	AM: 'Armenia',
	AL: 'Albania',
	AO: 'Angola',
	AQ: 'Antarctica',
	AS: 'American Samoa',
	AR: 'Argentina',
	AU: 'Australia',
	AT: 'Austria',
	AW: 'Aruba',
	IN: 'India',
	AX: 'Aland Islands',
	AZ: 'Azerbaijan',
	IE: 'Ireland',
	ID: 'Indonesia',
	UA: 'Ukraine',
	QA: 'Qatar',
	MZ: 'Mozambique'
};
