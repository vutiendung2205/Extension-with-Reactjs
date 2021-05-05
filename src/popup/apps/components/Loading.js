import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import iconLoading from "../../../images/img/loading-alt.gif";
import "../../../scss/components/Loading.scss";
import * as ActionsLayout from "../store/actions";

function useTimeout(callback, delay) {
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        if (delay && callback && typeof callback === "function") {
            let timer = setTimeout(callbackRef.current, delay || 0);
            return () => {
                if (timer) {
                    clearTimeout(timer);
                }
            };
        }
    }, [callback, delay]);
}
function Loading(props) {
    const { addTime } = props;
    const [loadingPercent, setLoadingPercent] = useState(0);
    useEffect(() => {
        let acceleration = Math.floor(Math.random() * (6 - 3 + 1)) + 3 + Math.floor((addTime * 100) / 99);

        const interval = setInterval(() => {
            if (loadingPercent > 98) {
                clearInterval(interval);
            } else {
                setLoadingPercent((loadingPercent) => loadingPercent + 1);
            }
        }, acceleration * 10);

        return () => clearInterval(interval);
    }, [loadingPercent]);

    return (
        <div className="pg-loading">
            <img
                style={{
                    position: "absolute",
                    zIndex: "-1",
                }}
                src={chrome.extension.getURL(iconLoading)}
            />
            <h3>{loadingPercent + "%"}</h3>
        </div>
    );
}

export default Loading;
