import React, { useEffect, useRef, useState, useContext } from 'react';
import "../../../scss/components/menu.scss";
import * as ActionsLayout from '../store/actions';
import { useSelector, useDispatch } from 'react-redux';

function SubMenu(props) {
    const dispatch = useDispatch();

    return (
        <div style={{ width: '100%' }}>
            <ul id="menu-mobile-nav" className="menu">
                {
                    props.childrenMenu.map((item, i) => (<li key={i} className={"menu-item" + (i==props.index ? ' current-menu-item ' : '')} 
                    onClick={(event) => { 

                        dispatch(ActionsLayout.routeChildTo(i));
                        dispatch(ActionsLayout.setHeader({ [props.currentFeature]: item.header }))
                    }}>{item.label}</li>))
                }
            </ul>
        </div>
    )
}
export default SubMenu;
