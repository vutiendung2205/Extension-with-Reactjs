export const SET_SCROLL = 'SET_SCROLL';
export const RELOAD_SCROLL = 'RELOAD_SCROLL';

export function setScroll(obj) {
    return (dispatch) =>
        dispatch({
            type: SET_SCROLL,
            payload: obj
        })

}
export function reloadScroll() {
    return (dispatch) =>
        dispatch({
            type: RELOAD_SCROLL
        })

}
