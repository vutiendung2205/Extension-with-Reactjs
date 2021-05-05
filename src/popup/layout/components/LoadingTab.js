import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import iconLoading from "../../../images/img/loading-alt.gif";
import "../../../scss/components/Loading.scss";
import * as ActionsLayout from "../store/actions";

function Loading(props) {
    return (
        <div className="pg-loading">
            <img
                style={{
                    position: "absolute",
                    zIndex: "-1",
                }}
                src={chrome.extension.getURL(iconLoading)}
            />
        </div>
    );
}

export default Loading;
