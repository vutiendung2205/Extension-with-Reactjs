import React, { useState, useEffect, useRef } from 'react';
import { useInfiniteScroll } from 'react-infinite-scroll-hook';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import * as ActionsLayout from '../store/actions';

import "../../../scss/components/Sorting.scss";


// Hook
function useOnClickOutside(ref, handler) {
  useEffect(
    () => {
      const listener = event => {
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || ref.current.contains(event.path[0])) {
          return;
        }

        handler(event);
      };

      document.addEventListener('mousedown', listener);
      document.addEventListener('touchstart', listener);

      return () => {
        document.removeEventListener('mousedown', listener);
        document.removeEventListener('touchstart', listener);
      };
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    [ref, handler]
  );
}

function Sort({ sorts, defaultSort, searchType, disabled }) {
  const sortObject = useSelector(({ layout }) => layout.sort[searchType]);
  const [isShow, setIsShow] = useState(false);
  const dispatch = useDispatch();
  const ref = useRef();
  useOnClickOutside(ref, () => setIsShow(false));


  return (

    <div ref={ref} className="dropdown sort-by" onClick={event => !disabled && setIsShow(isShow => !isShow)}>
      <a className={"dropbtn " + (isShow ? "toggled" : "")}>
        <span>Sort by:&nbsp; </span>
        <span>
          <b id="sort-by-label-fba" style={disabled ? { opacity: 0.5 } : {}}>{sortObject && sortObject.title ? sortObject.title : defaultSort.title}&nbsp;</b>
          <i className="fa fa-caret-down" />
        </span>
      </a>
      {
        isShow ? (<div className="dropdown-content sort-by">
          <div className="dropdown-menu">{
            sorts.map((sort, i) => (
              <a
                key={i}
                className="sidebar-link"
                onClick={() => dispatch(ActionsLayout.setSort(searchType, sort))}
                href="#"
                aria-expanded="false"
              >
                <span className="collection_name"> {sort.title} </span>
              </a>
            ))
          }</div>
        </div>) : ''
      }
    </div>


  );
}

export default Sort;