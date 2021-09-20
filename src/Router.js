import React, { Component } from 'react';
import { BrowserRouter, Route, Switch/* , withRouter */ } from 'react-router-dom';
import Main from './pages/Main';
import PaginaNoEncontrada from './pages/PaginaNoEncontrada';
import Signin from './pages/Signin';
import ListaDePersonal from './pages/Persona/ListaDePersonal';
import RegistroDePersona from './pages/Persona/RegistroDePersona';
import Hogar from './pages/Hogar';
import Signup from './pages/Signup';
// import App from './App';
/* import helpers from './components/Helpers'; */

class Router extends Component {
    constructor(props) {
        super(props)
        this.state = {}
        /* if(!localStorage.getItem("infoSesion")) {
            return <Signin />;
        } */
    }

    render() {
        return (
            <BrowserRouter /* basename='/webapp' */>
                <Switch>
                    <Route exact path="/Main" component={Main}/>
                    <Route exact path="/" component={Signin} />
                    <Route exact path="/Signup" component={Signup} />
                    <Route exact path="/Hogar" component={Hogar} />
                    <Route exact path="/ListaDePersonal" component={ListaDePersonal} />
                    <Route exact path="/RegistroDePersona" component={RegistroDePersona} />
                    <Route component={PaginaNoEncontrada} />
                </Switch>
            </BrowserRouter>
        )
    }
}

export default Router;