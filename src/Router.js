import React, { Component } from 'react';
import { BrowserRouter, Route, Switch/* , withRouter */ } from 'react-router-dom';
import Main from './pages/Main';
import PaginaNoEncontrada from './pages/PaginaNoEncontrada';
import Signin from './pages/Signin';
import ListaDePersonal from './pages/Persona/ListaDePersonal';
import RegistroDePersona from './pages/Persona/RegistroDePersona';
import Hogar from './pages/Hogar';
import Signup from './pages/Signup';
import Matrimonio from './pages/Matrimonio';
import PresentacionDeNino from './pages/PresentacionDeNino';
import RptListaDeHogares from './pages/Reporte/RptListaDeHogares';
import RptBautizados from './pages/Reporte/RptBautizados';
import Sector from './pages/Sector';
import Login from './pages/Login';
import ResumenMembresia from './pages/ResumenMembresia';
import AltaRestitucion from './pages/Persona/AltaRestitucion';
import AltaCambioDomicilio from './pages/Persona/AltaCambioDomicilio'
import AltaNuevoIngreso from './pages/Persona/AltaNuevoIngreso'
import AltaReactivacion from './pages/Persona/AltaReactivacion'
import AltaCambioDomicilioNB from './pages/Persona/AltaCambioDomicilioNB'
import AnalisisPersonal from './pages/Persona/AnalisisPersonal';
import ReportePersonalBautizado from './pages/Reporte/ReportePersonalBautizado';
import ReportePersonalNoBautizado from './pages/Reporte/ReportePersonalNoBautizado';
import ReporteOficiosProfesiones from './pages/Reporte/ReporteOficiosProfesiones';
import ReporteCumpleaños from './pages/Reporte/ReporteCumpleaños';
import ReporteMovimientoEstadistico from './pages/Reporte/ReporteMovimientoEstadistico';
import SolicitudDeRestablecimiento from './pages/CambiarContrasena/SolicitudDeRestablecimiento';
import ValidaCambioDeContrasena from './pages/CambiarContrasena/ValidaCambioDeContrasena';
import EdicionDeDireccion from './pages/EdicionDeDireccion';
import RevinculaDomicilio from './pages/RevincularDomicilio';
// import App from './App';
/* import helpers from './components/Helpers'; */

class Router extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        if (localStorage.getItem('infoSesion')) {
            //console.log(localStorage.getItem('infoSesion'));
            //document.location.href = '/';
        }
    }

    render() {
        return (
            <BrowserRouter /* basename='/webapp' */>
                <Switch>
                    {/* <Route exact path="/Main" component={Main}/> */}
                    <Route exact path="/Main" component={ListaDePersonal}/>
                    <Route exact path="/" component={Signin} />
                    <Route exact path="/Signup" component={Signup} />
                    <Route exact path="/Hogar" component={Hogar} />
                    <Route exact path="/ListaDePersonal" component={ListaDePersonal} />
                    <Route exact path="/RegistroDePersona" component={RegistroDePersona} />
                    <Route exact path="/PresentacionDeNino" component={PresentacionDeNino} />
                    <Route exact path="/Matrimonio" component={Matrimonio} />
                    <Route exact path="/RptListaDeHogares" component={RptListaDeHogares} />
                    <Route exact path="/RptBautizados" component={RptBautizados} />
                    <Route exact path="/Sector" component={Sector} />
                    <Route exact path="/Login" component={Login} />
                    <Route exact path="/ResumenMembresia" component={ResumenMembresia} />
                    <Route exact path="/AltaRestitucion" component={AltaRestitucion} />
                    <Route exact path="/AltaCambioDomicilio" component={AltaCambioDomicilio} />
                    {/* <Route exact path="/AltaNuevoIngreso" component={AltaNuevoIngreso} /> */}
                    <Route exact path="/AltaReactivacion" component={AltaReactivacion} />
                    <Route exact path="/AltaCambioDomicilioNB" component={AltaCambioDomicilioNB} />
                    <Route exact path="/AnalisisPersonal" component={AnalisisPersonal} />
                    <Route exact path="/ReportePersonalBautizado" component={ReportePersonalBautizado} />
                    <Route exact path="/ReportePersonalNoBautizado" component={ReportePersonalNoBautizado} />
                    <Route exact path="/ReporteOficiosProfesiones" component={ReporteOficiosProfesiones} />
                    <Route exact path="/SolicitudDeRestablecimiento" component={SolicitudDeRestablecimiento} />
                    <Route exact path="/ValidaCambioDeContrasena" component={ValidaCambioDeContrasena} />
                    <Route exact path="/EdicionDeDireccion" component={EdicionDeDireccion} />
                    <Route exact path="/RevinculaDomicilio" component={RevinculaDomicilio} />
                    <Route exact path="/ReporteCumpleaños" component={ReporteCumpleaños} />
                    <Route exact path="/ReporteMovimientoEstadistico" component={ReporteMovimientoEstadistico} />
                    <Route component={PaginaNoEncontrada} />
                </Switch>
            </BrowserRouter>
        )
    }
}

export default Router;