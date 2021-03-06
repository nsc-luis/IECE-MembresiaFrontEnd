import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ListaDePersonal from './pages/ListaDePersonal';
import Home from './pages/Home';
import RegistroDePersonal from './pages/RegistroDePersona';
import PaginaNoEncontrada from './pages/PaginaNoEncontrada';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Footer from './components/Footer';

class Router extends Component {
    render() {
        return (
            <BrowserRouter>
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
                                <Switch>
                                    <Route exact path="/" component={Home} />
                                    <Route exact path="/ListaDePersonal" component={ListaDePersonal} />
                                    <Route exact path="/RegistroDePersonal" component={RegistroDePersonal} />

                                    <Route component={PaginaNoEncontrada} />
                                </Switch>
                            </div>
                            {/* /.container-fluid */}

                        </div>
                        {/* End of Main Content */}

                        <Footer />

                    </div>
                    {/* End of Content Wrapper */}

                </div>
                {/* End of Page Wrapper */}
            </BrowserRouter>
        );
    }
}

export default Router;