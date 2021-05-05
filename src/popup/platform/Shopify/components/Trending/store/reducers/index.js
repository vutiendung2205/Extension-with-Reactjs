import { combineReducers } from 'redux';
import trendingObj from './trending.reducer';

import ui from './ui.reducer';

const reducer = combineReducers({
    trendingObj,
    ui
});

export default reducer;
