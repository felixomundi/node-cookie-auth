
import authReducer from './authSlice';
import { combineReducers } from 'redux';
import sidebarReducer from './sidebarSlice';
const rootReducer = combineReducers({
    auth: authReducer,
    sidebar:sidebarReducer  
})

export default rootReducer;