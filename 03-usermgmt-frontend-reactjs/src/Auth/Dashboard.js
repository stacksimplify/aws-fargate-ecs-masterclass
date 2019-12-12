import React, { Component } from 'react';
import { Row, Col } from 'antd';
import AuthenticationComponent from './Redux/containers/AuthenticationComponent';

class Dashboard extends Component {
    render() {
        return (
            <AuthenticationComponent {...this.props}>
                <div style={{ height: '100vh' }}>
                    <Row type="flex" justify="center" align="middle">
                        <Col>
                            <label style={{ fontSize: 40, fontWeight: 'bold' }}>AWS Elastic Bean Stalk</label>
                            <br />
                        </Col>
                    </Row>
                    <br />
                    <Row type="flex" justify="center" align="middle">
                        <Col>
                            <label style={{ fontSize: 30, fontWeight: 'normal' }}>
                                Welcome to this course on AWS Elastic Bean Stalk - Master class. 
                            </label>
                            <br />
                        </Col>
                    </Row>
                    <br />
                    <Row type="flex" justify="center" align="middle">
                        <Col>
                            <label style={{ fontSize: 20, fontWeight: 'normal' }}>
                                We are going to deploy this react and springboot based application to aws elastic bean stalk.
                            </label>
                            <br />
                        </Col>
                    </Row>

              
                </div>
            </AuthenticationComponent>
        );
    }
}



export default Dashboard;

