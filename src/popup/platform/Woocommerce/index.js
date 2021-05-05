import React from 'react';
import { render } from 'react-dom';
import { helpers, _ } from '../../@fuse/utils';
// import NotSupportWebsite from "../../components/NotSupportWebsite";
import ShadowDOM from 'react-shadow';
import App from './App';
import * as ActionRoot from '../../store/actions';

/**
 * Khởi tạo React UI
 */
(() => {
	/**
	 * Append To body
	 */
	const extensionContainer = document.createElement('div');
	const body = document.getElementsByTagName('BODY')[0];
	if (!document.getElementById('pexgle-container')) {
		extensionContainer.id = 'pexgle-container';
		helpers.embedHtmlCss();
		if (body) body.append(extensionContainer);
	}

	/**
	 * Get Page Type
	 */
	// chrome.runtime.sendMessage({ type: "GET_TOGGLE_EXTENSION" }, ({ isExtensionOpen }) => {

	// });

	let pageTypeCheck = 'Woo';
	try {
		let isWoocommerce = document.getElementsByTagName('html')[0].innerHTML.includes('plugins/woocommerce');
		if (isWoocommerce) {
			chrome.runtime.sendMessage({ type: 'UPDATE_ICON', pageType: pageTypeCheck });
			render(
				<ShadowDOM include={[chrome.extension.getURL('shops.css')]}>
					<div>
						<App pageType={pageTypeCheck} />
					</div>
				</ShadowDOM>,
				document.getElementById(extensionContainer.id)
			);
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
