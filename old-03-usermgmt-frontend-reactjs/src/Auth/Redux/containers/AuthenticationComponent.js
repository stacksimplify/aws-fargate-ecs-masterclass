import { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loginSuccess, setLoginSuccessRedirectUrl } from '../actions/index';
import { message } from 'antd';

/** 
Checks user in redux store and if its present than returns 
allowing the wrapped component to get loaded or opened.

If user not present in redux store, check if token is present in local storage.
if its present, use it to set missing user and token in redux store.
if token missing in both redux store and local storage, redirect to login page.

Wrapping each component with AuthenticationComponent prevents it 
from opening when token is not present in redux and localstorage.

If you dont wrap a component than that component will load(even if token is missing) but when it calls backend 
api it will be redirected to login page.

Wrapping just the parent component like AuthenticatedLayout also works just fine.
on page refresh AuthenticatedLayout will mount again 
it will redirect to login as token is missing in both redux and localstorage.

If user has not logged in and parent component is wrapped and other components are not wrapped.
he cannot open that page/component in parent container, 
as parent container will redirect to login page because 
token is missing in both redux store and local storage
*/

class AuthenticationComponent extends Component {
  componentWillMount() {
    if (this.props.user) {
      return; //token present in redux, return no further processing required.
    } else {
      //if token present in local storage, get user from local storage to set it in redux.
      if (localStorage.getItem('AuthToken')) {
        this.props.loginSuccess(JSON.parse(localStorage.getItem('LoggedInUser')));
        this.props.setLoginSuccessRedirectUrl(this.props.location.pathname);
      } else {
        //token not in redux and local storage, redirect to login page.
        this.props.setLoginSuccessRedirectUrl(this.props.location.pathname);
        this.props.history.replace("/login");
        message.info('Please login to continue.');
      }
      //   this.props.setLoginSuccessRedirectUrl(this.props.location.pathname);
      //  // console.log("Setting Redirect URL:"+this.props.location.pathname);
      //   this.props.history.replace("/login");
    }
  }

  render() {
    if (this.props.user) {
      return this.props.children
    }
    else {
      return null
    }
  }
}
// "state.activeUser" is set in reducers/index.js
function mapStateToProps(state) {
  // console.log("state", state);
  return {
    user: state.loggedInUser
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({ loginSuccess: loginSuccess, setLoginSuccessRedirectUrl: setLoginSuccessRedirectUrl }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(AuthenticationComponent);
