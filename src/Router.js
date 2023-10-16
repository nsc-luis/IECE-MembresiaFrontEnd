import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import PaginaNoEncontrada from './pages/PaginaNoEncontrada';
import Signin from './pages/Signin';
import ListaDePersonal from './pages/Persona/ListaDePersonal';
import RegistroDePersona from './pages/Persona/RegistroDePersona';
import Hogar from './pages/Hogar';
import Signup from './pages/Signup';
import Matrimonio from './pages/Matrimonio/Matrimonio';
import Legalizacion from './pages/Matrimonio/Legalizacion';
import PresentacionDeNino from './pages/PresentacionDeNino';
import RptListaDeHogares from './pages/Reporte/RptListaDeHogares';
import RptBautizados from './pages/Reporte/RptBautizados';
import Sector from './pages/Sector';
import Login from './pages/Login';
import ResumenMembresia from './pages/ResumenMembresia';
import AltaRestitucion from './pages/Persona/AltaRestitucion';
import AltaCambioDomicilio from './pages/Persona/AltaCambioDomicilio';
import AltaReactivacion from './pages/Persona/AltaReactivacion';
import AltaCambioDomicilioNB from './pages/Persona/AltaCambioDomicilioNB';
import AnalisisPersonal from './pages/Persona/AnalisisPersonal';
import ReportePersonalBautizado from './pages/Reporte/ReportePersonalBautizado';
import ReportePersonalNoBautizado from './pages/Reporte/ReportePersonalNoBautizado';
import ReporteOficiosProfesiones from './pages/Reporte/ReporteOficiosProfesiones';
import ReporteCumpleaños from './pages/Reporte/ReporteCumpleaños';
import ReportePersonalMinisterial from './pages/Reporte/ReportePersonalMinisterial';
import ReportePersonalAdministrativo from './pages/Reporte/ReportePersonalAdministrativo';
import ReporteOrganismosInternos from './pages/Reporte/ReporteOrganismosInternos';
import ReporteMovimientoEstadistico from './pages/Reporte/ReporteMovimientoEstadistico';
import ResumenTransacciones from './pages/Reporte/ResumenTransacciones';
import SolicitudDeRestablecimiento from './pages/CambiarContrasena/SolicitudDeRestablecimiento';
import ValidaCambioDeContrasena from './pages/CambiarContrasena/ValidaCambioDeContrasena';
import EdicionDeDireccion from './pages/EdicionDeDireccion';
import RevinculaDomicilio from './pages/RevincularDomicilio';
import BajaBautizadoExcomunion from './pages/Persona/BajaBautizadoExcomunion';
import BajaBautizadoDefuncion from './pages/Persona/BajaBautizadoDefuncion';
import BajaNoBautizadoDefuncion from './pages/Persona/BajaNoBautizadoDefuncion';
import BajaBautizadoCambioDomicilio from './pages/Persona/BajaBautizadoCambioDomicilio';
import BajaNoBautizadoCambioDomicilio from './pages/Persona/BajaNoBautizadoCambioDomicilio';
import BajaNoBautizadoAlejamiento from './pages/Persona/BajaNoBautizadoAlejamiento';
import RegistrarTransaccionesHistoricas from './pages/RegistrarTransaccionesHistoricas';
import Auxiliares from './pages/PersonalAdministrativo/Auxiliares';
/* import SecretarioDelSector from './pages/PersonalAdministrativo/SecretarioDelSector';
import TesoreroDelSector from './pages/PersonalAdministrativo/TesoreroDelSector'; */
import SecretarioDelDistrito from './pages/PersonalAdministrativo/SecretarioDelDistrito';
import TesoreroDelDistrito from './pages/PersonalAdministrativo/TesoreroDelDistrito';
import Layout from './pages/Layout';
import RegistroDePersonal from './pages/Persona/RegistroDePersona';
import RegistroPersonalMinisterial from './pages/RegistroPersonalMinisterial';
import BajaPersonalMinisterial from './pages/BajaPersonalMinisterial';
import ComisionesLocales from './pages/PersonalAdministrativo/ComisionesLocales';
import Administracion from './pages/PersonalAdministrativo/Administracion';
import ComisionesDistritales from './pages/PersonalAdministrativo/ComisionesDistritales';
import AdministracionDistrital from './pages/PersonalAdministrativo/AdministracionDistrital';
import OrganismoInterno from './pages/OrganismoInterno'

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
                    <Route exact path="/" component={Signin} />
                    <Route exact path="/Signup" component={Signup} />
                    <Route exact path="/Login" component={Login} />
                    <Route exact path="/SolicitudDeRestablecimiento" component={SolicitudDeRestablecimiento} />
                    <Route exact path="/ValidaCambioDeContrasena" component={ValidaCambioDeContrasena} />
                    <Layout>
                        {/* MONITOREO */}
                        <Route exact path="/Sector" component={Sector} />
                        <Route exact path="/ResumenMembresia" component={ResumenMembresia} />
                        <Route exact path="/Main" component={ListaDePersonal} />
                        <Route exact path="/ListaDePersonal" component={ListaDePersonal} />
                        <Route exact path="/Hogar" component={Hogar} />
                        <Route exact path="/AnalisisPersonal" component={AnalisisPersonal} />
                        {/* MOVIMIENTOS ESTADISTICOS */}
                        <Route exact path="/RegistroDePersona" component={RegistroDePersona} />
                        <Route exact path="/AltaRestitucion" component={AltaRestitucion} />
                        <Route exact path="/AltaReactivacion" component={AltaReactivacion} />
                        <Route exact path="/AltaCambioDomicilio" component={AltaCambioDomicilio} />
                        <Route exact path="/AltaCambioDomicilioNB" component={AltaCambioDomicilioNB} />
                        <Route exact path="/BajaBautizadoExcomunion" component={BajaBautizadoExcomunion} />
                        <Route exact path="/BajaBautizadoDefuncion" component={BajaBautizadoDefuncion} />
                        <Route exact path="/BajaNoBautizadoDefuncion" component={BajaNoBautizadoDefuncion} />
                        <Route exact path="/BajaBautizadoCambioDomicilio" component={BajaBautizadoCambioDomicilio} />
                        <Route exact path="/BajaNoBautizadoCambioDomicilio" component={BajaNoBautizadoCambioDomicilio} />
                        <Route exact path="/BajaNoBautizadoAlejamiento" component={BajaNoBautizadoAlejamiento} />
                        {/* HOGARES */}
                        <Route exact path="/EdicionDeDireccion" component={EdicionDeDireccion} />
                        <Route exact path="/RevinculaDomicilio" component={RevinculaDomicilio} />
                        {/* SECTOR */}

                        {/* SUCESOS ESTADISTICOS */}
                        <Route exact path="/Matrimonio" component={Matrimonio} />
                        <Route exact path="/Legalizacion" component={Legalizacion} />
                        <Route exact path="/PresentacionDeNino" component={PresentacionDeNino} />
                        {/* TRANSACCIONES ESPECIALES */}
                        <Route exact path="/RegistrarTransaccionesHistoricas" component={RegistrarTransaccionesHistoricas} />
                        <Route exact path="/Auxiliares" component={Auxiliares} />
                        <Route exact path="/RegistroPersonalMinisterial" component={RegistroPersonalMinisterial} />
                        <Route exact path="/BajaPersonalMinisterial" component={BajaPersonalMinisterial} />
                        <Route exact path="/OrganismoInterno" component={OrganismoInterno} />

                        <Route exact path="/Administracion" component={Administracion} />
                        <Route exact path="/AdministracionDistrital" component={AdministracionDistrital} />
                        {/* <Route exact path="/TesoreroDelSector" component={TesoreroDelSector} />
                        <Route exact path="/SecretarioDelSector" component={SecretarioDelSector} /> */}
                        <Route exact path="/TesoreroDelDistrito" component={TesoreroDelDistrito} />
                        <Route exact path="/SecretarioDelDistrito" component={SecretarioDelDistrito} />
                        <Route exact path="/ComisionesLocales" component={ComisionesLocales} />
                        <Route exact path="/ComisionesDistritales" component={ComisionesDistritales} />

                        {/* REPORTES */}
                        <Route exact path="/RptListaDeHogares" component={RptListaDeHogares} />
                        <Route exact path="/RptBautizados" component={RptBautizados} />
                        <Route exact path="/ResumenTransacciones" component={ResumenTransacciones} />
                        {/* COMPONENTES DE VICTOR */}
                        <Route exact path="/ReportePersonalBautizado" component={ReportePersonalBautizado} />
                        <Route exact path="/ReportePersonalNoBautizado" component={ReportePersonalNoBautizado} />
                        <Route exact path="/ReporteOficiosProfesiones" component={ReporteOficiosProfesiones} />
                        <Route exact path="/ReporteCumpleaños" component={ReporteCumpleaños} />
                        <Route exact path="/ReportePersonalMinisterial" component={ReportePersonalMinisterial} />
                        <Route exact path="/ReportePersonalAdministrativo" component={ReportePersonalAdministrativo} />
                        <Route exact path="/ReporteOrganismosInternos" component={ReporteOrganismosInternos} />
                        <Route exact path="/ReporteMovimientoEstadistico" component={ReporteMovimientoEstadistico} />
                    </Layout>
                    <Route component={PaginaNoEncontrada} />
                </Switch>
            </BrowserRouter>
        )
    }
}

export default Router;