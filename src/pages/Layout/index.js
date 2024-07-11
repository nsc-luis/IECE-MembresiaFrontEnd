import React, { Component } from 'react';
import Sidebar from './Sidebar';
import SidebarObispo from './SidebarObispo';
import SidebarDirectivo from './SidebarDirectivo';
import Topbar from './Topbar';
import Footer from './Footer';
import helpers from '../../components/Helpers';

class Layout extends Component {

    constructor(props) {
        super(props);
        if (JSON.parse(localStorage.getItem('infoSesion')).dg) localStorage.setItem('LoginValido', true)
        if (!localStorage.getItem("infoSesion")) {
            return document.location.href = "/";
        }
        if (!helpers.isLoggedIn()) {
            return document.location.href = "/";
        }
        this.state = {
            sidebar: null,
            distrito: localStorage.getItem("dto"),
            sector: localStorage.getItem("sector")
        }
    }

    render() {
        const { children, seccion, componente } = this.props

        return (

            <React.Fragment>
                {/* CONFIGURAR RUTAS Y PAGINAS */}
                {/* Page Wrapper */}
                <div id="wrapper">

                    {this.state.sector !== null && <Sidebar />}
                    {this.state.sector === null && this.state.distrito !== null && <SidebarObispo />}
                    {this.state.sector === null && this.state.distrito === null && JSON.parse(localStorage.getItem('infoSesion')).dg && <SidebarDirectivo />}
                    {() => this.defineSidebar}

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

                        <Footer
                            GoToTop={this.GoToTop}
                        />

                    </div>
                    {/* End of Content Wrapper */}

                </div>
                {/* End of Page Wrapper */}
            </React.Fragment>
        )
    }
}

export default Layout;