import React, { Component } from 'react';
import Sidebar from '../../components/nav/Sidebar';
import Topbar from '../../components/nav/Topbar';
import Footer from '../../components/nav/Footer';

class Layout extends Component {

    constructor(props) {
        super(props);
        this.state = {};
        if (!localStorage.getItem("token")) {
            document.location.href = '/';
        }
    }

    render() {
        const { children } = this.props
        return (

            <React.Fragment>
                {/* CONFIGURAR RUTAS Y PAGINAS */}
                {/* Page Wrapper */}
                <div id="wrapper">

                    <Sidebar />

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