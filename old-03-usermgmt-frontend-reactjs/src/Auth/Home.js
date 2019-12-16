import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Route, Link, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { logoutSuccess } from './Redux/actions/index';
import { setLoginSuccessRedirectUrl } from './Redux/actions/index'

import axios from 'axios';
import { Layout, Menu, Icon, message, Spin, Popover, Avatar, Modal } from 'antd';
import { Row, Col } from 'antd';
import Login from './Login.js';
import Profile from './Profile.js';
import Nomatch from '../Public/Nomatch.js';
import { properties } from './properties.js';


const { Header, Content } = Layout;

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            access_token: '',
            iconLoading: false,
            showValidationErrorsView: false,
            subErrors: null
        }
    }

    componentDidMount() {

        // Add a request interceptor
        axios.defaults.timeout = 30000;
        axios.interceptors.request.use((config) => {
            // Do something before request is sent
            var auth_token = localStorage.getItem("AuthToken");
            if (auth_token) {
                config.headers.common['Authorization'] = 'Bearer ' + auth_token;
            }
            this.setState({ iconLoading: false });
            //config.timeout = 15000;
            return config;
        }, (error) => {
            // Do something with request error
            return Promise.reject(error);
        });

        axios.interceptors.response.use((response) => {
            this.setState({ iconLoading: false });
            console.log("response:" + response);
            return response;
        }, (error) => {
            try {
                this.setState({ iconLoading: false });
                if (error.response) {
                    console.log("Error response:", error.response);
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    let responseStatus = error.response.status;
                    //let errorMessage = error.response.data.apierror.message || error.response.data.error_description;
                    let errorMessage = "";
                    if (error.response.data.apierror && error.response.data.apierror.message) {
                        errorMessage = error.response.data.apierror.message;
                    } else if (error.response.data.error_description) {
                        errorMessage = error.response.data.error_description;
                    } else {
                        errorMessage = "";
                    }
                    //console.log(error.response.data);
                    //console.log(responseStatus);
                    //console.log(error.response.headers);
                    if (responseStatus === 401) {
                        message.error('Authentication required, Please login to continue.', 5);
                        localStorage.removeItem("AuthToken");
                        localStorage.removeItem("LoggedInUser");
                        this.props.logoutSuccess();
                        this.props.history.replace("/login");
                    } else if (responseStatus === 403) {
                        message.error('Access denied, If you think you should have access to this resource, please contact support.', 5);
                    } else if (responseStatus === 404) {
                        message.error('Resource not found, ' + errorMessage, 5);
                    } else if (responseStatus === 400) {
                        let subErrors = "";
                        if (error.response.data.apierror && error.response.data.apierror.subErrors) {
                            subErrors = error.response.data.apierror.subErrors;
                            // Modal.error({
                            //     title: 'Invalid request, ' + errorMessage,
                            //     content: this.parseSubErrors(subErrors)
                            // });
                            this.setState({ subErrors: subErrors });
                            this.setState({ showValidationErrorsView: true });
                        }else{
                            message.error('Invalid request, ' + errorMessage, 5);
                        }
                       // message.error('Invalid request, ' + errorMessage, 5);
                    } else if (responseStatus === 500) {
                        message.error('Something went wrong, please try again later! If the problem persists, please contact support.', 5);
                    } else {
                        message.error('Something went wrong, please try again later! If the problem persists, kindly contact support.', 5);
                    }
                } else if (error.request) {
                    //when no response from server, like Timeout, Server down, CORS issue, Network issue.
                    // The request was made but no response was received.
                    //console.log(error.request);
                    message.error('Application server is not accessible, please try again!', 5);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    //console.log('Error', error.message);
                    message.error('Request processing failed, Invalid request.', 5);
                }
                return Promise.reject(error);
            } catch (error) {
                console.log(error);
                message.error('Something went wrong! If the problem persists, kindly contact support.', 5);
                return Promise.reject(error);
            };
        });
    }

    render() {


        let validationErrorsView;
        if (this.state.showValidationErrorsView) {
            validationErrorsView = (
                <Row type="flex" justify="center" align="middle">
                    <Col span={24}>
                        <Modal
                            title={"Validation Errors"}
                            bodyStyle={{ width: 1200 }}
                            style={{ top: 150, display: 'flex', marginLeft: 100 }}
                            visible={this.state.showValidationErrorsView}
                            onCancel={() => {
                                this.setState({ showValidationErrorsView: false })
                            }}
                            footer={[]}
                        >
                            <Row type="flex" justify="center" align="middle">
                                <Col span={24}>
                                    <ul>
                                        {this.state.subErrors.map((value, index) => {
                                            return <li key={index}>{value.field} : {value.message}</li>
                                        })}
                                    </ul>
                                </Col>
                            </Row>
                        </Modal>
                    </Col>
                </Row>
            )
        } else {
            validationErrorsView = null
        }





        let userProfileButton;
        let loginButton;
        let logoLink;



        if (this.props.user) {
            const profileContent = (
                <div>
                    <span>User: </span>
                    <span style={{ fontWeight: 'bold' }}>{this.props.user.id}</span>
                    <br />
                    <span>Role: </span>
                    <span style={{ fontWeight: 'bold' }}>{this.props.user.roles.replace("ROLE_", "")}</span>
                    <br />
                    <Link to="/login"
                        onClick={() => {
                            localStorage.removeItem("AuthToken");
                            localStorage.removeItem("LoggedInUser");
                            this.props.setLoginSuccessRedirectUrl("/profile/dashboard");
                            this.props.logoutSuccess();
                        }}>
                        <span style={{ fontWeight: 'bold' }}>Sign Out</span>
                    </Link>
                </div>
            );

            logoLink = (
                <Link to="/profile/dashboard">
                    <img src="https://www.stacksimplify.com/e-books/spring-security-handbook/logo.png"
                        alt="stacksimplify logo"
                        className="logo" />
                </Link>
            )

            userProfileButton = (
                <Menu.Item key="username" style={{ float: "right" }}>
                    <Popover placement="bottomLeft" content={profileContent} trigger={"click"}>
                        <Avatar style={{ backgroundColor: '#f56a00', verticalAlign: 'middle' }} size="large">
                            {this.props.user.id}
                        </Avatar>
                    </Popover>
                </Menu.Item >
            )
        } else {
            logoLink = (
                <Link to="/">
                    <img src="https://www.stacksimplify.com/e-books/spring-security-handbook/logo.png"
                        alt="stacksimplify logo"
                        className="logo" />
                </Link>
            )

            loginButton = (
                <Menu.Item key="login" style={{ float: "right" }}>
                    <Link to="/login">
                        <Icon type="login" />
                        <span style={{ fontWeight: 'bold' }}>Sign In</span>
                    </Link>
                </Menu.Item>
            )
        }


        return (
            <Layout style={{ height: '100vh' }}>
                <Header className="App-header">
                    <Row>
                        <Col span={24}>
                            {logoLink}

                            <Menu
                                theme="light"
                                mode="horizontal"
                            >
                                <Menu.Item key="Heading" style={{ fontWeight: 'bold' }}>
                                    <span style={{ fontSize: 20 }}> User Management Application {properties.version} </span>
                                    <Spin spinning={this.state.iconLoading} />
                                </Menu.Item>

                                {userProfileButton}
                                {loginButton}

                           </Menu>
                        </Col>
                    </Row>
                </Header>
                <Content style={{ height: 'calc(100vh - 64px)' }}>
                    {validationErrorsView}
                    <Switch>
                        <Route path="/login" component={Login} />
                        <Route path="/profile" component={Profile} />
                        <Route exact path="/" component={Login} />
                        <Route component={Nomatch} />
                    </Switch>
                </Content>
            </Layout>

        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.loggedInUser
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        logoutSuccess: logoutSuccess,
        setLoginSuccessRedirectUrl: setLoginSuccessRedirectUrl
    }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Home);
