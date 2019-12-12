import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Icon, Input, Button } from 'antd';
import { Row, Col, message, Spin } from 'antd';
import axios from 'axios';


const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
    },
};

class EditUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            iconLoading: false,
            userName: '',
            firstname: '',
            lastname: '',
            email: '',
        }
    }

    componentDidMount() {
        document.title = "Edit User";
        this.loadUser();
    }

    loadUser = () => {
        this.setState({ "iconLoading": true });
        axios.get(process.env.REACT_APP_USERMGMT_API_BASE_URL + '/user/' + this.props.selectedRecord.username)
            .then((response) => {
                this.setState({
                    "iconLoading": false,
                    userName: response.data.username,
                    firstname: response.data.firstname,
                    lastname: response.data.lastname,
                    email: response.data.email,
                });
            })
            .catch((error) => {
                this.setState({ iconLoading: false });
            });
    }

    validateEmail = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(email)) {
            return true;
        } else {
            message.error('Please provide email address to continue!', 5);
            return false;
        }
    }

    validateData = () => {

        if (this.state.firstname.length === 0) {
            message.error('Please provide FirstName to continue!', 5);
            return false;
        }
        if (this.state.lastname.length === 0) {
            message.error('Please provide lastname to continue!', 5);
            return false;
        }
        return this.validateEmail(this.state.email);
    }

    updateUser = () => {

        var res = this.validateData();
        if (!res) {
            //message.error('Data provided is not valid!', 3);
            return;
        }

        this.setState({ "iconLoading": true });

        var data = {
            'username': this.state.userName,
            'firstname': this.state.firstname,
            'lastname': this.state.lastname,
            'email': this.state.email
        };
        axios.put(process.env.REACT_APP_USERMGMT_API_BASE_URL + '/user', data)
            .then((response) => {
                console.log(response);
                this.setState({ "iconLoading": false });
                message.success('User updated successfully.', 5);
                this.props.closeEditModel();
            })
            .catch((error) => {
                this.setState({ iconLoading: false });
            });
    }

    render() {
        return (
            <div style={{ textAlign: "center" }}>
                <Row type="flex" justify="center" align="middle">
                    <Col>
                        <Form style={{ backgroundColor: 'white' }}>
                            <label style={{ fontSize: 15, fontWeight: 'bold' }}>Edit User</label>
                            <br />
                            <Spin spinning={this.state.iconLoading} />
                            <br />
                            <FormItem {...formItemLayout} label="Username:">
                                <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 20 }} />}
                                    placeholder=" Username"
                                    value={this.state.userName}
                                    readOnly
                                />
                            </FormItem>
                            <FormItem {...formItemLayout} label="First Name:">
                                <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 20 }} />}
                                    placeholder=" First Name"
                                    value={this.state.firstname}
                                    onChange={(e) => {
                                        this.setState({ firstname: e.target.value })
                                    }} />
                            </FormItem>
                            <FormItem {...formItemLayout} label="Last Name:">
                                <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 20 }} />}
                                    placeholder=" Last Name"
                                    value={this.state.lastname}
                                    onChange={(e) => {
                                        this.setState({ lastname: e.target.value })
                                    }} />
                            </FormItem>
                            <FormItem {...formItemLayout} label="Email:">
                                <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 20 }} />}
                                    placeholder=" Email"
                                    value={this.state.email}
                                    onChange={(e) => {
                                        this.setState({ email: e.target.value })
                                    }} />
                            </FormItem>
                            <FormItem>
                                <Row type="flex" justify="center" align="middle">
                                    <Col>
                                        <Button type="primary" icon={'check-circle-o'}
                                            loading={this.state.iconLoading}
                                            htmlType="submit"
                                            onClick={this.updateUser}>Submit</Button>
                                    </Col>
                                </Row>
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.loggedInUser
    };
}

export default connect(mapStateToProps, null)(EditUser);
