import { combineReducers } from 'redux';
import linkProduct from './linkProduct.reducer';
import priceObj from './priceListLink.reducer';
import ui from './ui.reducer';

const reducer = combineReducers({
    linkProduct,
    priceObj,
    ui
});

export default reducer;
