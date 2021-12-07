import React, { Component } from 'react';
import Sidebar from './Sidebar';
import SidebarObispo from './SidebarObispo';
import Topbar from './Topbar';
import Footer from './Footer';
import helpers from '../../components/Helpers';

class Layout extends Component {

    constructor(props) {
        super(props);
        this.state = {};
        if(!localStorage.getItem("infoSesion")) {
            return document.location.href = "/";
        }
        if(!helpers.isLoggedIn()) {
            return document.location.href = "/";
        }
        this.state = {
            distrito : localStorage.getItem("dto"),
            sector : localStorage.getItem("sector")
        }
    }

    render() {
        const { children } = this.props
        return (

            <React.Fragment>
                {/* CONFIGURAR RUTAS Y PAGINAS */}
                {/* Page Wrapper */}
                <div id="wrapper">

                    {this.state.sector != null ? <Sidebar /> : <SidebarObispo />}

                    {/* Content Wrapper */}
                    <div id="content-wrapper" className="d-flex flex-column">

                        {/* Main Content */}
                        <div id="content">

                            <Topbar />

                            {/* Begin Page Content */}
                            <div className="container-fluid">
                                {/* Page Heading */}
                                {children}
                            </div>
                            {/* /.container-fluid */}

                        </div>
                        {/* End of Main Content */}

                        <Footer />

                    </div>
                    {/* End of Content Wrapper */}

                </div>
                {/* End of Page Wrapper */}
            </React.Fragment>
        )
    }
}

export default Layout;