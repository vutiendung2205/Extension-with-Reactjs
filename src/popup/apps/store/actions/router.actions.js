export const ROUTE_TO = 'ROUTE_TO';
export const ROUTE_CHILD_TO = 'ROUTE_CHILD_TO';

export function routeTo(index) {
    return {
        type: ROUTE_TO,
        payload: index
    }
}
export function routeChildTo(index) {
    return {
        type: ROUTE_CHILD_TO,
        payload: index
    }
}



