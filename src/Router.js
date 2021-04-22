import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Main from './pages/Main';
import PaginaNoEncontrada from './pages/PaginaNoEncontrada';
import Signin from './pages/Signin';
import ListaDePersonal from './pages/Persona/ListaDePersonal';
import RegistroDePersona from './pages/Persona/RegistroDePersona';

class Router extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isAuth: true
        }
    }
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={Main} />
                    <Route exact path="/Signin" component={Signin} />
                    <Route exact path="/ListaDePersonal" component={ListaDePersonal} />
                    <Route exact path="/RegistroDePersona" component={RegistroDePersona} />
                    <Route component={PaginaNoEncontrada} />
                </Switch>
            </BrowserRouter>
        )
    }
}

export default Router;