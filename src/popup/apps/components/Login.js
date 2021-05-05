import React from "react";
import { useSelector, useDispatch } from "react-redux";
import "../../../scss/components/Login.scss";
import imgLogo from "../../../images/img/pexgle-logo.jpg";
import * as ActionsLayout from "../store/actions";
import { PEXGLE_HOST } from "../../@fuse/config/constants";
function Login(props) {
    const { isShowLogin } = useSelector(({ layout }) => layout.login);
    const dispatch = useDispatch();

    return (
        isShowLogin && (
            <div id="pgLogin" className="pg-login">
                <div className="pg-login-container">
                    <div className="pg-login-image">
                        <img src={chrome.runtime.getURL(imgLogo)} alt="logo" />
                    </div>
                    <div style={{ fontSize: "18px", fontWeight: "bold", textAlign: "center", marginBottom: "15px" }}>Log in to achieve financial freedom.</div>
                    <div style={{ textAlign: "center", fontSize: "13px", marginBottom: "20px", padding: "0 10px" }}>You need to log in to start take your bussiness to the next level</div>
                    <a href={PEXGLE_HOST + "/login/"} className="pg-login-button">
                        {" "}
                        Log in to start
                    </a>
                    {/* <a href="javascript:;"
                        onClick={() => this.onClickLogin()}
                        className="pg-login-button"> Log in to start</a> */}
                    <a
                        href={PEXGLE_HOST + "/login/?action=forgot_password"}
                        target="_blank"
                        style={{ fontSize: "12px", alignSelf: "flex-start", marginBottom: "10px", textDecoration: "underline", color: "darkgray" }}
                    >
                        Forgot password?
                    </a>
                    <div style={{ fontSize: "16px", alignSelf: "flex-start" }}>
                        <span>Not a member</span>
                        <a href={PEXGLE_HOST} target="_blank" style={{ textDecoration: "underline" }}>
                            {" "}
                            Join Pexgle
                        </a>
                    </div>
                    <div style={{ fontSize: "16px", alignSelf: "center", marginTop: "50px", cursor: "pointer" }}>
                        <span id="pgBtnCloseLogin" onClick={() => dispatch(ActionsLayout.toggleLogin(false))} style={{ textDecoration: "underline", fontSize: "12px" }}>
                            No thanks.
                        </span>
                    </div>
                </div>
            </div>
        )
    );
}

export default Login;
