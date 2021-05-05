import { combineReducers } from 'redux';
import newProductObj from './newProduct.reducer';

import ui from './ui.reducer';

const reducer = combineReducers({
    newProductObj,
    ui
});

export default reducer;
