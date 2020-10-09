import React, {Component} from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ListaDePersonal from './components/Persona/ListaDePersonal';
import Home from './components/Home';
import RegistroDePersonal from './components/Persona/RegistroDePersona';
import PaginaNoEncontrada from './components/PaginaNoEncontrada';

class Router extends Component {
    render(){
        return(
            <BrowserRouter>
                {/* CONFIGURAR RUTAS Y PAGINAS */}
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/ListaDePersonal" component={ListaDePersonal} />
                    <Route exact path="/RegistroDePersonal" component={RegistroDePersonal} />

                    <Route component={PaginaNoEncontrada} />
                </Switch>
            </BrowserRouter>
        );
    }
}

export default Router;