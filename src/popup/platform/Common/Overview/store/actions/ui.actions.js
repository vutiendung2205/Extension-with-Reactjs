export const TOGGLE_SHOW_ALL_PAGE = 'TOGGLE_SHOW_ALL_PAGE';


export function toggleShowAllPage() {
    return (dispatch) =>
        dispatch({
            type: TOGGLE_SHOW_ALL_PAGE
        })
}
