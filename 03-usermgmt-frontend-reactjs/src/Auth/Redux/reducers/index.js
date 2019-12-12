import {combineReducers} from 'redux';
import LoginSuccessReducer from './reducer-login-success';
import LogoutSuccessReducer from './reducer-logout-success';
import LoginSuccessRedirectUrlReducer from './reducer-login-success-redirect-url';

/*
 * We combine all reducers into a single object before updated data is dispatched (sent) to store
 * Your entire applications state (store) is just whatever gets returned from all your reducers
 * */

const allReducers = combineReducers({
    loggedInUser: LoginSuccessReducer,
    loginSuccessRedirectUrl: LoginSuccessRedirectUrlReducer
});

export default allReducers
