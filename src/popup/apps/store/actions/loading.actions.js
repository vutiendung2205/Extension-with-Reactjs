export const ON_LOADING = 'ON_LOADING';
export const OFF_LOADING = 'OFF_LOADING';
export const SHOW_DATA = 'SHOW_DATA';

export function onLoading(addTime) {
    return {
        type: ON_LOADING,
        payload: addTime
    }
}
export function offLoading() {
    return {
        type: OFF_LOADING
    }
}
// export function showData() {
//     return {
//         type: SHOW_DATA
//     }
// }



