import React, { Component } from 'react';
import Layout from '../Layout';
import Home from '../../components/Home';
import { withRouter } from 'react-router-dom';

class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {};
        if(!localStorage.getItem("infoSesion")) {
            document.location.href = '/';
        }
    }

    render() {
        return (
            <Layout>
                <Home />
            </Layout>
        )
    }
}

export default Main;