import React, { Component } from 'react';
/* import ListaDePersonal from './components/Persona/ListaDePersonal';
import Main from './pages/Main/index';
import RegistroDePersonal from './components/Persona/RegistroDePersona';
import PaginaNoEncontrada from './pages/Main/PaginaNoEncontrada';
import Signin from './pages/Signin'; */
import Sidebar from '../../components/nav/Sidebar';
import Topbar from '../../components/nav/Topbar';
import Footer from '../../components/nav/Footer';

const Layout = ({ children }) => {

    const beforeUnloadListener = () => {
        window.addEventListener("beforeunload", (ev) => {
            ev.preventDefault();
            return localStorage.clear();
        })
    }

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

export default Layout;