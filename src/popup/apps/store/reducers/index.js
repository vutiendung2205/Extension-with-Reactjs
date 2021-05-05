import { combineReducers } from 'redux';

import header from './header.reducer';
import loading from './loading.reducer';
import router from './router.reducer';
import sort from './sort.reducer';
import login from './login.reducer';

const defaultReducers = combineReducers({
    header,
    loading,
    router,
    sort,
    login
});

export default defaultReducers;
