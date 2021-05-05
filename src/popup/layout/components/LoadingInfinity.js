import React from "react";
import spinner from "../../../images/img/spinner.gif";

function LoadingInfinity(props) {
    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <img src={chrome.extension.getURL(spinner)} />
        </div>
    );
}

export default LoadingInfinity;
