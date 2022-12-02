import React, { Component } from 'react';
import Layout from '../Layout';
import Home from './Home';
/* import { withRouter } from 'react-router-dom';
import helpers from '../../components/Helpers'; */

class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <Home />
        )
    }
}

export default Main;