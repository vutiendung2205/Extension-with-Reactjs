import React, { useContext, useEffect, Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Footer, Header, Loading, Login } from "./components";
import withReducer from "../store/withReducer";
import reducer from "./store/reducers";
import * as ActionsLayout from "./store/actions";
import AppContext from "../platform/AppContext";
import LoadingTab from "./components/LoadingTab";

// let component = React.lazy(() => import('../platform/Shopify/components/Overview/OverviewTab'));
function Layout(props) {
    const appContext = useContext(AppContext);
    const { routerConfig, platform } = appContext;
    const { isShow, isShowData, addTime } = useSelector(({ layout }) => layout.loading);
    const dispatch = useDispatch();

    let { currentIndex, childIndex } = useSelector(({ layout }) => layout.router);
    let childrenMenu = routerConfig[currentIndex].childrenMenu;

    const currentHeader = useSelector(({ layout }) => layout.header[routerConfig[currentIndex].currentFeature]);

    useEffect(() => {
        !currentHeader &&
            (childrenMenu
                ? dispatch(ActionsLayout.setHeader({ [routerConfig[currentIndex].currentFeature]: routerConfig[currentIndex].childrenMenu[childIndex].header }))
                : dispatch(ActionsLayout.setHeader({ [routerConfig[currentIndex].currentFeature]: routerConfig[currentIndex].header })));
    }, [dispatch, currentIndex, currentHeader]);
    let CurrentComponent = routerConfig[currentIndex].component;
    // let addTime = routerConfig[currentIndex].addTime ? routerConfig[currentIndex].addTime : 0;

    if (childrenMenu) {
        CurrentComponent = childrenMenu[childIndex].component;
    }

    return (
        <div id="pexgle-shadow" className="pexgle-shadow">
            <div id="cornerContent" className="corner-content">
                <div id="pgContentContainer" className="content-container">
                    <div id="main-content">
                        <Header />
                        <Login />
                        {/* <Suspense fallback={<LoadingTab />}> */}
                        <div style={{ position: "relative", height: "500px", overflow: "auto" }}>
                            <CurrentComponent />
                            {/* {routerConfig[currentIndex].component} */}
                            {isShow ? <Loading addTime={addTime} /> : ""}
                        </div>
                        {/* </Suspense> */}
                        <Footer />
                    </div>
                </div>
            </div>
        </div>
    );
}
export default withReducer("layout", reducer)(Layout);
