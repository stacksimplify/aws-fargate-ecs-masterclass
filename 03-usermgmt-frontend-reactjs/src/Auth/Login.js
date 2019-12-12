import React, {Component} from 'react';
import {Form, Icon, Input, Button, Spin, Modal, message, Divider} from 'antd';
import {Row, Col} from 'antd';
import axios from 'axios';
import qs from 'qs';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {loginSuccess} from './Redux/actions/index';
import jwt_decode from 'jwt-decode';
import RegisterUser from '../Users/RegisterUser.js';

const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 6},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
    },
};

class Login extends Component {
    state = {
        loadingIcon: false,
        username: '',
        password: '',
        isUserNameValid: true,
        isPasswordValid: true,
        showForgotPasswordView: false,
        showSignUpView: false
    }

    componentWillMount() {
        //get user from Token and logged In local storage
        if (localStorage.getItem('AuthToken')) {
            this.props.loginSuccess(JSON.parse(localStorage.getItem('LoggedInUser')));
            if (this.props.redirectUrl) {
                console.log("Redirect Url:" + this.props.redirectUrl);
                this.props.history.replace(this.props.redirectUrl);
            } else {
                console.log("Redirect Url: /profile/dashboard");
                this.props.history.replace("/profile/dashboard");
            }

        }

    }

    componentDidMount() {
        document.title = "Login";
    }

    validateUserInput = () => {
        let isUserNameValid = false;
        let isPasswordValid = false;
        if (this.state.username === '') {
            isUserNameValid = false;
        } else {
            isUserNameValid = true;
        }

        if (this.state.password === '') {
            isPasswordValid = false;
        } else {
            isPasswordValid = true;
        }
        console.log("user", isUserNameValid);
        console.log("pass", isPasswordValid);
        if (isUserNameValid && isPasswordValid) {
            return true;
        } else {
            message.error("Please enter a valid username and password!");
            return false;
        }
    }

    handleClick = () => {
        //Store  Token and logged In user in local storage
        if (!(this.validateUserInput())) {
            return;
        }
        this.setState({loadingIcon: true});

        var params = {
            "grant_type": "password",
            'username': this.state.username,
            'password': this.state.password
        };

        var authHeader = {
            username: 'service-account-1',
            password: 'service-account-1-secret',
            scope: 'all'
        };

        axios.request({
            url: "/oauth/token",
            method: "post",
            baseURL: process.env.REACT_APP_USERMGMT_API_BASE_URL,
            auth: authHeader,
            data: qs.stringify(params),
            headers: {"content-type": "application/x-www-form-urlencoded"}
        }).then((response) => {
            console.log(response);
            this.setState({loadingIcon: false});
            var decoded_token = jwt_decode(response.data.access_token);
            console.log(decoded_token);
            var role = decoded_token.authorities[0];
            var tasks = [];
            if (role.indexOf('ROLE_ADMIN') > -1) {
                tasks = [
                    'activate-user', 'manage-users',  'create-user'];
            } else if (role.indexOf('ROLE_MODERATOR') > -1) {
                tasks = [
                    'activate-user', 'manage-users', 'create-user'];
            } else if (role.indexOf('ROLE_USER') > -1) {
                tasks = [
                    'activate-user', 'manage-users'];
            }
            else {
                tasks = [];
            }


            localStorage.setItem('AuthToken', response.data.access_token);
            localStorage.setItem('LoggedInUser', JSON.stringify({
                id: this.state.username,
                first: this.state.username,
                roles: role,
                authorizedTasks: tasks,
                authResponse: response.data
            }));

            this.props.loginSuccess({
                id: this.state.username,
                first: this.state.username,
                roles: role,
                authorizedTasks: tasks,
                authResponse: response.data
            });
            if (this.props.redirectUrl) {
                this.props.history.replace(this.props.redirectUrl);
            } else {
                this.props.history.replace("/profile/dashboard");
            }
        })
            .catch((error) => {
                console.log(error);
                this.setState({loadingIcon: false});
            });

    }



    closeRegisterUserView = () => {
        this.setState({showSignUpView: false});
    }

    render() {
       

        let SignUpView;
        if (this.state.showSignUpView) {
            SignUpView = (
                <Row type="flex" justify="center" align="middle">
                    <Col>
                        <Modal
                            centered
                            title={<span style={{fontWeight: 'bold'}}> Sign Up </span>}
                            visible={this.state.showSignUpView}
                            onCancel={() => {
                                this.setState({showSignUpView: false})
                            }}
                            footer={[]}
                        >
                            <RegisterUser {...this.props} closeRegisterUserView={this.closeRegisterUserView}/>
                        </Modal>
                    </Col>
                </Row>
            )
        } else {
            SignUpView = null
        }

        return (
            <div>
                <div style={{height: 'calc(100vh - 64px)', backgroundColor: '#1286a3', paddingTop: '50px'}}>
                    <Row type="flex" justify="center" align="middle">
                        <Col span={8}>

                            <Form style={{backgroundColor: 'white'}}>
                                <br/>
                                <label style={{fontSize: 15}}><b>Login</b></label>
                                <br/>

                                <Spin spinning={this.state.loadingIcon}>
                                </Spin>

                                <br/>
                                <br/>
                                <FormItem {...formItemLayout} label="Username:"
                                          validateStatus={this.state.isUserNameValid ? '' : 'error'}
                                          hasFeedback
                                          help={this.state.isUserNameValid ? '' : 'Please enter a valid username.'}>
                                    <Input prefix={<Icon type="user" style={{fontSize: 20}}/>} placeholder=" Username"
                                           value={this.state.username}
                                           onChange={(e) => {
                                               this.setState({username: e.target.value})
                                           }}/>
                                </FormItem>
                                <FormItem {...formItemLayout} label="Password:"
                                          validateStatus={this.state.isPasswordValid ? '' : 'error'}
                                          hasFeedback
                                          help={this.state.isPasswordValid ? '' : 'Please enter a valid password.'}>
                                    <Input prefix={<Icon type="lock" style={{fontSize: 20}}/>} type="password"
                                           placeholder=" Password"
                                           value={this.state.password}
                                           onChange={(e) => {
                                               this.setState({password: e.target.value})
                                           }}/>
                                </FormItem>
                                <FormItem>
                                    <Button type="primary"
                                            loading={this.state.loadingIcon}
                                            icon={'login'}
                                            htmlType="submit"
                                            onClick={this.handleClick}>Log In</Button>
                                    <Divider type="vertical"/>
                                    <a style={{color: '#003a8c'}} onClick={
                                        () => {
                                            console.log('inside sign in');
                                            this.setState({showSignUpView: true})
                                        }}>Sign Up</a>
                                </FormItem>
                                          <FormItem>
                                </FormItem>
                            </Form>
                        </Col>
                    </Row>
                </div>
                {SignUpView}

            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.loggedInUser,
        redirectUrl: state.loginSuccessRedirectUrl
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({loginSuccess: loginSuccess}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Login);
