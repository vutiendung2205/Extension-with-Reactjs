import React, { useState } from 'react';
import Provider from 'react-redux/es/components/Provider';

import AliexpressAds from './components/PexgleAds/AliexpressAds';
import * as ActionRoot from '../../store/actions';

import store from "../../store";
import AppContext from '../AppContext';
import '../../../scss/components/App';

/**
 * Cấu trúc các thành phần giao diện
 * Truyền các config chính cho platfrom
 * Quản lý event Ẩn/Hiện extension
 * @param {*} pageType Loại page của platform 
 * @param {*} isExtensionOpen status Open Extension
 */
const App = ({ pageType }) => {
    return (

        <AppContext.Provider>
            <Provider store={store}>
                {(<div id="pexgle-shadow" className="pexgle-shadow">
                    <div id="cornerContent" className="corner-content">
                        <div id="pgContentContainer" className="content-container">
                            <div id="main-content">
                                <AliexpressAds></AliexpressAds>
                            </div>
                        </div>
                    </div>
                </div>)}
            </Provider>
        </AppContext.Provider >
    );
};

export default App;
