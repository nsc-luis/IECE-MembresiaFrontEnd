import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ListaDePersonal from './components/Persona/ListaDePersonal';
import Home from './pages/Home';
import RegistroDePersonal from './components/Persona/RegistroDePersona';
import PaginaNoEncontrada from './pages/PaginaNoEncontrada';
import Login from './components/auth/Login';
import Sidebar from './components/nav/Sidebar';
import Topbar from './components/nav/Topbar';
import Footer from './components/nav/Footer';

class Router extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isAuth: true
        }
    }
    render() {
        if (this.state.isAuth) {
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
                                        <Route exact path="/Login" component={Login} />

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
            )
        } else {
            return (
                <BrowserRouter>
                    <Route exact path="/Login" component={Login} />

                    <Route component={PaginaNoEncontrada} />
                </BrowserRouter>
            )
        }
    }
}

export default Router;