import React from 'react';
import { render } from 'react-dom';
import { helpers, _ } from '../../@fuse/utils';
import App from './App';
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

	let pageTypeCheck = null;

	try {
		// chrome.runtime.sendMessage({ type: "UPDATE_ICON", pageType });
		render(
			<ShadowDOM include={[chrome.extension.getURL('shops.css')]}>
				<div>
					<App />
				</div>
			</ShadowDOM>,
			document.getElementById(extensionContainer.id)
		);
	} catch (error) {
		console.log('error: ', error);
	}
})();
