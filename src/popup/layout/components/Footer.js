import React, { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../../../scss/components/Footer.scss";
import iconGoldIcon from "../../../images/img/gold-icon.png";
import * as ActionsLayout from "../store/actions";
import AppContext from "../../platform/AppContext";
import SubMenu from "./SubMenu";

function Footer(props) {
    let { currentIndex, childIndex } = useSelector(({ layout }) => layout.router);
    const dispatch = useDispatch();
    const appContext = useContext(AppContext);
    const { routerConfig, platform, pageType } = appContext;
    let childrenMenu = routerConfig[currentIndex].childrenMenu;
    const currentHeader = useSelector(({ layout }) => layout.header[routerConfig[currentIndex].currentFeature]);

    let routersElement = routerConfig
        .filter((element) => {
            return !element.platform || element.platform.indexOf(platform) > -1;
        })
        .map((element, i) => {
            let className = "tab-menu";

            let ableClick = element.isDisable && typeof element.isDisable == "function" ? element.isDisable(pageType) : true;
            className += currentIndex == i ? " active" : " inactive";
            // className += currentIndex == i ? " disabled" : "";
            let style = {};
            return (
                <div key={i} className="tab-content">
                    <a
                        href="#"
                        id={element.currentFeature}
                        title={ableClick ? element.title : element.title_second ? element.title_second : "This page do not supported"}
                        className={className}
                        style={style}
                        onClick={() => {
                            // if (ableClick) {
                            !currentHeader &&
                                (childrenMenu
                                    ? dispatch(ActionsLayout.setHeader({ [element.currentFeature]: element.childrenMenu[childIndex].header }))
                                    : dispatch(ActionsLayout.setHeader({ [element.currentFeature]: element.header })));
                            dispatch(ActionsLayout.routeTo(i));
                            // }
                        }}
                    >
                        <img src={chrome.extension.getURL(element.icon)} className={element.currentFeature} />
                    </a>
                </div>
            );
        });
    return (
        <div className="footer-container">
            <div className="learn-more-container">
                <div className="content-container" style={childrenMenu && childrenMenu.length > 0 ? { paddingBottom: "1px" } : {}}>
                    {childrenMenu && childrenMenu.length > 0 ? (
                        <SubMenu childrenMenu={childrenMenu} index={childIndex} currentFeature={routerConfig[currentIndex].currentFeature} />
                    ) : (
                        <React.Fragment>
                            <div>
                                <img className="gold-icon" src={chrome.extension.getURL(iconGoldIcon)} alt="gold icon" />
                            </div>
                            <a href="//www.pexgle.com" target="_blank">
                                Learn more about how Pexgle can help grow your business
                            </a>
                        </React.Fragment>
                    )}
                </div>
            </div>
            <div className="footer-tab">{routersElement}</div>
        </div>
    );
}

export default Footer;
