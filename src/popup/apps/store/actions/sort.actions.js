export const SET_SORT = 'SET_SORT';

export function setSort(searchType, obj) {
    return {
        type: SET_SORT,
        payload: { [searchType]: obj }
    }
}



