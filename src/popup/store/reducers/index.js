import { combineReducers } from 'redux';
import message from './message.reducer';

const defaultReducers = combineReducers({
    message
});

export default defaultReducers;
