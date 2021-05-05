import React, { useState } from 'react';
import Provider from 'react-redux/es/components/Provider';

import Layout from '../../apps';
import * as ActionRoot from '../../store/actions';

import store from '../../store';
import routerConfig from './routerConfig';
import AppContext from '../AppContext';
import '../../../scss/components/App';
import { useFirstEffect } from '../../@fuse/utils/hooks';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.type == ActionRoot.TOGGLE_EXTENSION) {
		store.dispatch(ActionRoot.toggleExtension(message.isExtensionOpen));
	} else if (message.type == ActionRoot.CHECK_SUPPORT) {
		sendResponse({ pageType });
	} else if (message.type == 'CHECK_OPEN') {
		sendResponse({ isExtensionOpen: store.getState().root.message.isExtensionOpen });
	}
	return true;
});
chrome.storage.sync.get(['isExtensionOpen'], function (result) {
	result.isExtensionOpen = typeof result.isExtensionOpen == 'undefined' ? true : result.isExtensionOpen;
	store.dispatch(ActionRoot.toggleExtension(result.isExtensionOpen));
});

/**
 * Cấu trúc các thành phần giao diện
 * Truyền các config chính cho platfrom
 * Quản lý event Ẩn/Hiện extension
 * @param {*} pageType Loại page của platform
 * @param {*} isExtensionOpen status Open Extension
 */
const App = ({ pageType, platform }) => {
	const [isOpen, setIsOpen] = useState(store.getState().root.message.isExtensionOpen);
	store.subscribe(() => {
		isOpen != store.getState().root.message.isExtensionOpen &&
			setIsOpen(store.getState().root.message.isExtensionOpen);
	});
	return (
		<AppContext.Provider
			value={{
				routerConfig,
				pageType,
				platform
			}}
		>
			<Provider store={store}>
				{isOpen && (
					<div id="pexgle-shadow" className="pexgle-shadow">
						<div id="cornerContent" className="corner-content">
							<div id="pgContentContainer" className="content-container">
								<div id="main-content">
									<Layout />
								</div>
							</div>
						</div>
					</div>
				)}
			</Provider>
		</AppContext.Provider>
	);
};

export default App;
