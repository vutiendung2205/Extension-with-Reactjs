import React from "react";
// import { useSelector, useDispatch } from 'react-redux';
// import "../../../scss/components/Login.scss";
import "../../../scss/components/NoData.scss";
import imageNoData from "../../../images/img/no-data-sprite.png";

function NoData(props) {
    return (
        <div id="hotProductEmpty" className=" vertical">
            <div className="noData-image">
                <img src={chrome.runtime.getURL(imageNoData)} />
            </div>
            <h2 className="noData-title referrals">Not enough data</h2>
        </div>
    );
}

export default NoData;
