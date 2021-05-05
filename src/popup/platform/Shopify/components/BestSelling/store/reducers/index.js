import { combineReducers } from 'redux';
import bestSellingObj from './bestSelling.reducer';
import ui from './ui.reducer';

const reducer = combineReducers({
    bestSellingObj,
    ui
});

export default reducer;
