import { combineReducers } from 'redux';
import orderStatisticObj from './orderStatistic.reducer';
import ui from './ui.reducer';

const reducer = combineReducers({
    orderStatisticObj,
    ui
});

export default reducer;
