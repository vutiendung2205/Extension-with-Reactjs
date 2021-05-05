export const TOGGLE_SHOW_ALL_LINK = 'TOGGLE_SHOW_ALL_LINK';
export const TOGGLE_SHOW_VIDEO_ALIEXPRESS = 'TOGGLE_SHOW_VIDEO_ALIEXPRESS';

export function toggleShowAllLink(platformShowMore) {
    return (dispatch) =>
        dispatch({
            type: TOGGLE_SHOW_ALL_LINK,
            payload: platformShowMore
        })
}

export function toggleShowVideoAliexpress() {
    return (dispatch) =>
        dispatch({
            type: TOGGLE_SHOW_VIDEO_ALIEXPRESS,
        })
}