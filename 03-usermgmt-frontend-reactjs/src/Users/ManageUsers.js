import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button, Table, message, Spin, Popconfirm, Modal } from 'antd';
import axios from 'axios';
import AuthenticationComponent from '../Auth/Redux/containers/AuthenticationComponent';
import EditUser from './EditUser';

class ManageUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            dataSource: [],
            columns: [],
            showEditView: false,
            showTableView: true,
            showReadOnlyView: false,
            selectedRecord: null,
            selectedTreesIds: []
        }
    }

    componentDidMount() {
        document.title = "Manage User's";
        this.setColumns();
        this.loadAll();
    }

    setColumns = () => {
        const columns = [{
            title: '#',
            key: '#',
            render: (text, record, index) => (
                <span>{index + 1}</span>
            )
        }, {
            title: 'User Name',
            dataIndex: 'username',
            key: 'username',
        }, {
            title: 'Roles',
            dataIndex: 'role',
            key: 'roles',
        }, {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },{
            title: 'AppVersion',
            dataIndex: 'appversion',
            key: 'appversion',
        }, {
            title: 'Actions',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <span>
                    <Button type="primary" onClick={this.showDetailsView}>Edit</Button>
                    <span> </span>
                    <Popconfirm title="Confirm operation?"
                        okText="Go Ahead" cancelText="Cancel" onConfirm={() => {
                            this.stateUpdate(record.username)
                        }}>
                        <Button type="danger">{record.enabled ? 'Disable' : 'Enable'}</Button>
                    </Popconfirm>
                    <span> </span>
                    <Popconfirm title="Confirm operation?"
                        okText="Go Ahead" cancelText="Cancel" onConfirm={() => {
                            this.deleteUser(record.username)
                        }}>
                        <Button type="danger">Delete</Button>
                    </Popconfirm>
                </span>
            )
        }];

        this.setState({ "columns": columns });
    }

    setSelectedRow = (record) => {
        console.log(record);
        this.setState({ selectedRecord: record });
    }


    showDetailsView = () => {
        this.setState({ showEditView: true });
    }

    closeEditView = () => {
        this.setState({ showEditView: false });
        this.reloadTabularData();
    }

    reloadTabularData = () => {
        this.loadAll();
    }


    loadAll = () => {
        this.setState({ "iconLoading": true });
        axios.get(process.env.REACT_APP_USERMGMT_API_BASE_URL + '/users')
            .then((response) => {
                this.setState({ "iconLoading": false });
                this.setState({ "dataSource": response.data });
            })
            .catch((error) => {
                this.setState({ "iconLoading": false });
            });
    }

    setMultiSelectedRows = (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        this.setState({ selectedTreesIds: selectedRowKeys });
        //console.log(this.state.selectedTreesIds);
    }

    stateUpdate = (username) => {
        this.setState({ "iconLoading": true });
        //  console.log('selected-rec: ',this.state.selectedRecord);
        axios.get(process.env.REACT_APP_USERMGMT_API_BASE_URL + '/status/' + username)
            .then((response) => {
                console.log(response);
                this.setState({ "iconLoading": false });
                message.success('User updated successfully!', 5);
                this.reloadTabularData();
            })
            .catch((error) => {
                this.setState({ "iconLoading": false });
            });
    }


    deleteUser = (username) => {
        this.setState({ "iconLoading": true });
        //  console.log('selected-rec: ',this.state.selectedRecord);
        axios.delete(process.env.REACT_APP_USERMGMT_API_BASE_URL + '/user/' + username)
            .then((response) => {
                console.log(response);
                this.setState({ "iconLoading": false });
                message.success('User deleted successfully!', 5);
                this.reloadTabularData();
            })
            .catch((error) => {
                this.setState({ "iconLoading": false });
            });
    }


    render() {
        let EditView;
        if (this.state.showEditView) {
            EditView = (
                <Row type="flex" justify="center" align="middle">
                    <Col span={24}>
                        <Modal
                            title={<span style={{ fontWeight: 'bold' }}>{this.state.selectedRecord.username}</span>}
                            bodyStyle={{ width: 1200 }}
                            style={{ top: 20, display: 'flex', marginLeft: 100 }}
                            visible={this.state.showEditView}
                            onCancel={() => {
                                this.setState({ showEditView: false })
                            }}
                            footer={[]}
                        >
                            <Row type="flex" justify="center" align="middle">
                                <Col span={24}>
                                    <EditUser {...this.props} closeEditModel={this.closeEditView}
                                        selectedRecord={this.state.selectedRecord} />
                                </Col>
                            </Row>
                        </Modal>
                    </Col>
                </Row>
            )
        } else {
            EditView = null
        }

        let TableView;
        if (this.state.showTableView) {
            TableView = (
                <div>
                    <Row type="flex" justify="center" align="middle">
                        <Col>
                            <label style={{ fontSize: 15, fontWeight: 'bold' }}>Manage User's</label>
                            <br />
                        </Col>
                    </Row>
                    <Row type="flex" justify="center" align="middle">
                        <Col span={20}>
                            <Spin spinning={this.state.iconLoading} />
                            <br />
                            <Table dataSource={this.state.dataSource}
                                pagination={{ defaultPageSize: 8 }}
                                columns={this.state.columns}
                                onRowClick={this.setSelectedRow}
                                size="middle" rowKey={record => record.guid} />
                        </Col>
                    </Row>
                </div>
            )
        } else {
            TableView = null;
        }


        return (
            <AuthenticationComponent {...this.props}>
                <div style={{ minHeight: 'calc(100vh - 64px)' }}>
                    {TableView}
                    {EditView}
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

export default connect(mapStateToProps, null)(ManageUsers);
