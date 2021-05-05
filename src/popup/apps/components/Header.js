import React, { useContext, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as ActionsLayout from "../store/actions";
import * as ActionsRoot from "../../store/actions";

import logo from "../../../images/img/pg-logo.png";

import backIcon from "../../../images/img/icon-back.svg";
import "../../../scss/components/Header.scss";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
library.add(fab, faSearch);
import AppContext from "../../platform/AppContext";
import { _, hooks } from "../../@fuse/utils";

function Header(props) {
    const appContext = useContext(AppContext);
    const { routerConfig } = appContext;
    const dispatch = useDispatch();

    let { currentIndex, childIndex } = useSelector(({ layout }) => layout.router);
    let currentFeature = routerConfig[currentIndex].currentFeature;
    let { isShowLogo, isShowBack, isShowSearch, searchText, searchType, searchTitle, searchDisabled, title, actionBack } = useSelector(({ layout }) => {
        return layout.header[currentFeature] ? layout.header[currentFeature] : {};
    });
    let value = routerConfig[currentIndex].childrenMenu && searchText ? searchText[childIndex] : searchText;
    const renderBackButton = () => {
        return (
            <div
                key="back"
                style={{
                    cursor: "pointer",
                    position: "absolute",
                    top: "23px",
                    left: "18px",
                    width: "22px",
                    zIndex: "20",
                }}
                id="back-to-main-content"
                onClick={() => {
                    actionBack(routerConfig[currentIndex].header);
                }}
            >
                <img src={chrome.extension.getURL(backIcon)} />
            </div>
        );
    };
    const renderTitle = (title) => {
        return (
            <div className="title-header-text" key="title">
                {title}
            </div>
        );
    };
    const renderLogo = () => {
        return <img key="logo" className="tab-header pg-logo" src={chrome.extension.getURL(logo)} />;
    };
    const renderSearch = (placeHoder, searchType, searchDisabled) => {
        return (
            <div key="searchBestSell" className="tab-header search" id="header-pg-tab">
                <div className="search-icon">
                    <i style={{ width: "16px", height: "16px" }} className="fa">
                        <FontAwesomeIcon icon={faSearch} size="1x" color="#90949c" />
                    </i>
                </div>
                <div>
                    <input
                        className="search-input"
                        type="text"
                        disabled={!!searchDisabled}
                        placeholder={placeHoder}
                        value={value ? value : ""}
                        onChange={(event) => {
                            let value = event.target.value;
                            if (routerConfig[currentIndex].childrenMenu) {
                                searchText = searchText ? searchText : {};
                                searchText[childIndex] = value;
                                dispatch(ActionsLayout.setHeader({ [currentFeature]: { searchText } }));
                            } else {
                                dispatch(ActionsLayout.setHeader({ [currentFeature]: { searchText: value } }));
                            }
                        }}
                    />
                </div>
            </div>
        );
    };
    let innerHeader = [];
    if (isShowBack) innerHeader.push(renderBackButton());
    if (title) innerHeader.push(renderTitle(title));
    if (isShowLogo) innerHeader.push(renderLogo());
    if (isShowSearch) innerHeader.push(renderSearch(searchTitle, searchType, searchDisabled));

    return (
        <div className="header-container">
            {innerHeader}
            <div className="pg-close-button" onClick={() => chrome.runtime.sendMessage({ type: ActionsRoot.TOGGLE_EXTENSION, isExtensionOpen: false })}>
                <div>×</div>
            </div>
        </div>
    );
}

export default Header;
