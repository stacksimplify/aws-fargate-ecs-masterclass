import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button } from 'antd';
import { Row, Col, message, Spin } from 'antd';
import axios from 'axios';
import AuthenticationComponent from '../Auth/Redux/containers/AuthenticationComponent';


const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
    },
};

class ActivateUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            iconLoading: false,
            username: '',
            firstname: '',
            lastname: '',
            email: '',
            role: '',
            disableSubmit: false
        }
    }

    componentDidMount() {
        document.title = "Activate User";
        this.loadUser();
    }

    loadUser = () => {
        const { match: { params } } = this.props;
        let username = params.id;
        this.setState({ "iconLoading": true });
        axios.get(process.env.REACT_APP_USERMGMT_API_BASE_URL + '/user/' + username)
            .then((response) => {
                console.log(response);

                this.setState({
                    "iconLoading": false,
                    username: response.data.username,
                    firstname: response.data.firstname,
                    lastname: response.data.lastname,
                    email: response.data.email,
                    role: response.data.role
                });
                
                if (response.data.enabled) {
                    this.setState({ disableSubmit: true });
                    message.error("User already active!", 5);
                }

            })
            .catch((error) => {
                this.setState({ iconLoading: false });
            });
    }

    activateUser = () => {
        this.setState({ "iconLoading": true });
        var config = {
            timeout: 90000
        }
        axios.get(process.env.REACT_APP_USERMGMT_API_BASE_URL + '/user/activate/' + this.state.username, config)
            .then((response) => {
                console.log(response);
                this.setState({ "iconLoading": false });
                this.setState({ disableSubmit: true });
                message.success('User activated successfully!', 5);
            })
            .catch((error) => {
                this.setState({ "iconLoading": false });
                this.setState({ disableSubmit: false });
            });
    }

    render() {
        return (
            <AuthenticationComponent {...this.props}>
                <div style={{ minHeight: 'calc(100vh - 64px)' }}>
                    <Row type="flex" justify="center" align="middle">
                        <Col span={20}>
                            <Form style={{ backgroundColor: 'white' }}>
                                <label style={{ fontSize: 15, fontWeight: 'bold' }}>Activate User</label>
                                <br />
                                <Spin spinning={this.state.iconLoading} />
                                <br />
                                <FormItem {...formItemLayout} label="Username:">
                                    <Input style={{ backgroundColor: '#e8e8e8', fontSize: 12 }}
                                        readOnly
                                        placeholder=" Username"
                                        value={this.state.username} />
                                </FormItem>
                                <FormItem {...formItemLayout} label="First Name:">
                                    <Input style={{ backgroundColor: '#e8e8e8', fontSize: 12 }}
                                        readOnly
                                        placeholder=" First Name"
                                        value={this.state.firstname} />
                                </FormItem>
                                <FormItem {...formItemLayout} label="Last Name:">
                                    <Input style={{ backgroundColor: '#e8e8e8', fontSize: 12 }}
                                        readOnly
                                        placeholder=" Last Name"
                                        value={this.state.lastname} />
                                </FormItem>
                                <FormItem {...formItemLayout} label="Email:">
                                    <Input style={{ backgroundColor: '#e8e8e8', fontSize: 12 }}
                                        readOnly
                                        placeholder=" Email"
                                        value={this.state.email} />
                                </FormItem>
                                <FormItem {...formItemLayout} label="Role:">
                                    <Input style={{ backgroundColor: '#e8e8e8', fontSize: 12 }}
                                        readOnly
                                        placeholder=" Role"
                                        value={this.state.role} />
                                </FormItem>
                                <FormItem>
                                    <Row type="flex" justify="center" align="middle">
                                        <Col>
                                            <Button type="primary" icon={'check-circle-o'}
                                                loading={this.state.iconLoading}
                                                htmlType="submit"
                                                disabled={this.state.disableSubmit}
                                                onClick={this.activateUser}>Activate</Button>
                                        </Col>
                                    </Row>
                                </FormItem>
                            </Form>
                        </Col>
                    </Row>
                </div>
            </AuthenticationComponent>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.loggedInUser
    };
}

export default connect(mapStateToProps, null)(ActivateUser);
