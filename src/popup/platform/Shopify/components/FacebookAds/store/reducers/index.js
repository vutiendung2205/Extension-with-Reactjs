import { combineReducers } from 'redux';
import adsObj from './ads.reducer';
import ui from './ui.reducer';

const reducer = combineReducers({
	adsObj,
	ui
});

export default reducer;
