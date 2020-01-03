import React, {Component} from 'react';
import {connect} from 'react-redux';
import AuthenticationComponent from './Redux/containers/AuthenticationComponent';
import AuthenticatedLayout from './AuthenticatedLayout'


class Profile extends Component {

    constructor(props) {
        super(props);
        //console.log(this.props);
        this.state = {
            loggedInUser: null,
            iconLoading: false,
            collapsed: false
        }
    }

    render() {
        return (
            <AuthenticationComponent {...this.props}>
                <AuthenticatedLayout {...this.props} />
            </AuthenticationComponent>
        );
    }
}


function mapStateToProps(state) {
    // console.log("state", state);
    return {
        user: state.loggedInUser
    };
}

export default connect(mapStateToProps, null)(Profile);
