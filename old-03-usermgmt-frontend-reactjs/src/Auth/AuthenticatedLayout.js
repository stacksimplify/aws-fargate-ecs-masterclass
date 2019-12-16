import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Route, Link, Switch} from 'react-router-dom';
import {Layout, Menu, Icon, Row, Col} from 'antd';
import AuthenticationComponent from './Redux/containers/AuthenticationComponent';
import Nomatch from '../Public/Nomatch.js'
import Dashboard from './Dashboard.js';
import ManageUsers from '../Users/ManageUsers';
import CreateUser from '../Users/CreateUser';
import ActivateUser from '../Users/ActivateUser';

const {Sider, Content} = Layout;


class AuthenticatedLayout extends Component {

    constructor(props) {
        super(props);
        //console.log(this.props);
        this.state = {
            loggedInUser: null,
            iconLoading: false,
            collapsed: false
        }
    }


    onCollapse = (collapsed) => {
        console.log(collapsed);
        this.setState({collapsed: collapsed});
    }

    showMenu = (tasks) => {
        for (let task of tasks) {
            if (this.props.user.authorizedTasks.indexOf(task) > -1) {
                return true;
            }
        }
    }

    render() {





        let createUserRoute;
        let createUserMenu;

        if (this.showMenu(["create-user"])) {
            createUserRoute = (
                <Route path="/profile/authoring/create-user" component={CreateUser}/>
            )
            createUserMenu = (
                <Menu.Item key="create-user">
                    <Link to="/profile/authoring/create-user">
                        <Icon type="user-add"/>
                        <span style={{fontWeight: 'normal'}}>Create User</span>
                    </Link>
                </Menu.Item>
            )
        }

        let manageUsersRoute;
        let manageUsersMenu;

        if (this.showMenu(["manage-users"])) {
            manageUsersRoute = (
                <Route path="/profile/authoring/manage-users" component={ManageUsers}/>
            )
            manageUsersMenu = (
                <Menu.Item key="manage-users">
                    <Link to="/profile/authoring/manage-users">
                        <Icon type="team"/>
                        <span style={{fontWeight: 'normal'}}>Manage Users</span>
                    </Link>
                </Menu.Item>
            )
        }







        let activateUserRoute;

        if (this.showMenu(["activate-user"])) {
            activateUserRoute = (
                <Route path="/profile/authoring/activate-user/:id" component={ActivateUser}/>
            )
        }




        return (
            <AuthenticationComponent {...this.props}>
                <Layout>
                    <Sider
                        width={200}
                        collapsible
                        collapsed={this.state.collapsed}
                        onCollapse={this.onCollapse}
                        style={{background: '#fff', textAlign: 'left'}}
                    >
                        <Menu mode="inline" theme="light" style={{background: '#fff', borderRight: 0}}>

                            <Menu.Item key="dashboard">
                                <Link to="/profile/dashboard">
                                    <Icon type="home"/>
                                    <span style={{fontWeight: 'normal'}}>Dashboard</span>
                                </Link>
                            </Menu.Item>
                            {createUserMenu}
                            {manageUsersMenu}
                        </Menu>
                    </Sider>


                    <Layout style={{
                        borderLeft: '1px solid #e9e9e9',
                        height: 'calc(100vh- 64px)',
                        backgroundColor: 'white',
                        paddingLeft: '5px, 5px, 0px,0px'
                    }}>
                        <Content style={{backgroundColor: 'white'}}>
                            <Row>
                                <Col span={24}>

                                    <Switch>
                                        <Route path="/profile/dashboard" component={Dashboard}/>
                                        {createUserRoute}
                                        {activateUserRoute}
                                        {manageUsersRoute}
                                        <Route component={Nomatch}/>
                                    </Switch>
                                </Col>
                            </Row>
                        </Content>
                    </Layout>
                </Layout>
            </AuthenticationComponent>
        );
    }
}


function mapStateToProps(state) {
    return {
        user: state.loggedInUser
    };
}

export default connect(mapStateToProps, null)(AuthenticatedLayout);
