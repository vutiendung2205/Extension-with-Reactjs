import { combineReducers } from 'redux';
import domainOverview from './domainOverview.reducer';
import ui from './ui.reducer';

const reducer = combineReducers({
    domainOverview,
    ui
});

export default reducer;
