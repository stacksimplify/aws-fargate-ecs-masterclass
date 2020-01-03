import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {Row, Col, Card} from 'antd';


class Nomatch extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        document.title = "404 Resource Not Found";
    }

    render() {
        let HomeLink;
        if (this.props.user) {
            HomeLink = (
                <Link to="/profile/dashboard">
                    <span style={{fontWeight: 'bold'}}>Home</span>
                </Link>
            )
        } else {
            HomeLink = (
                <Link to="/">
                    <span style={{fontWeight: 'bold'}}>Home</span>
                </Link>
            )
        }
        return (
            <div style={{minHeight: 'calc(100vh - 64px)', backgroundColor: '#1286a3'}}>
                <Row>
                    <Col offset={10} span={8}>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <Card title={<span><b>Page Not Found</b></span>}>
                            <br/>
                            <span>The URL you have requested is not present.</span>
                            <br/>
                            <span> Go to </span>
                            {HomeLink}
                            <br/>
                        </Card>
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

export default connect(mapStateToProps, null)(Nomatch);
