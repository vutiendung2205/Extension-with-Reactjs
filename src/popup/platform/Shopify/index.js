import React from 'react';
import { render } from 'react-dom';
import { helpers, _ } from '../../@fuse/utils';
import App from './App';
// import NotSupportWebsite from "../../components/NotSupportWebsite";
import ShadowDOM from 'react-shadow';
import * as ActionRoot from '../../store/actions';

/**
 * Khởi tạo React UI
 */
(() => {
	/**
	 * Append To body
	 */
	const body = document.getElementsByTagName('BODY')[0];
	const extensionContainer = document.createElement('div');
	extensionContainer.id = 'pexgle-container';
	helpers.embedHtmlCss();
	if (body) body.append(extensionContainer);

	/**
	 * Get Page Type
	 */
	// chrome.runtime.sendMessage({ type: "GET_TOGGLE_EXTENSION" }, ({ isExtensionOpen }) => {

	// });
	const renderBody = (pageType, platform) => {
		render(
			<ShadowDOM include={[chrome.extension.getURL('shops.css')]}>
				<div>
					<App pageType={pageType} platform={platform} />
				</div>
			</ShadowDOM>,
			document.getElementById(extensionContainer.id)
		);
	};
	let pageTypeCheck = null;
	try {
		let isWoocommerce = document.getElementsByTagName('html')[0].innerHTML.includes('/plugins/woocommerce');
		if (isWoocommerce) {
			pageTypeCheck = 'woocommerce';
			chrome.runtime.sendMessage({ type: 'UPDATE_ICON', pageType: pageTypeCheck });
			renderBody(pageTypeCheck, 'woocommerce');
		} else {
			let scripts = Array.from(document.getElementsByTagName('script'))
				.map(s => s.innerText)
				.filter(s => s.includes(`window.ShopifyAnalytics = window.ShopifyAnalytics || {};`));
			if (scripts.length > 0) {
				let {
					page: { pageType }
				} = new Function(` ${scripts[0]} return meta`)();
				chrome.runtime.sendMessage({ type: 'UPDATE_ICON', pageType });
				renderBody(pageType, 'shopify');
				pageTypeCheck = pageType;
			}
		}
	} catch (error) {
		// console.log("error: ", error);
	}
	chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
		if (message.type == 'CHECK_SUPPORT') {
			sendResponse(pageTypeCheck);
		}
		return true;
	});
})();
