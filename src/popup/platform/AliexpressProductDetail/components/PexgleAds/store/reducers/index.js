import { combineReducers } from 'redux';
import pexgleAdsObj from './pexgleAds.reducer';
import ui from './ui.reducer';

const reducer = combineReducers({
    pexgleAdsObj,
    ui
});

export default reducer;
