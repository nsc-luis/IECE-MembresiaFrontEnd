import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
    Card, CardBody, CardFooter, CardHeader, CardTitle, Alert,
    Button, Modal, FormGroup, Input, Col, Row, Form, ModalBody
} from 'reactstrap';
import helpers from '../../components/Helpers';
import './style.css'


class Sidebar extends Component {
    infoSesion = JSON.parse(localStorage.getItem('infoSesion'));
    constructor(props) {
        super(props);
        this.state = {
            modalEditaPersona: false,
            modalEditaPersonaNB: false,
            personas: [],
            personaSeleccionada: '0',
            mensajeDelProceso: '',
            modalShow: false,
            modalBajaNoBautizadoAlejamiento: false,
            modalBajaNoBautizadoCambioDomicilio: false,
            modalEstableceVisibilidadAbierta: false,
            formEstableceVisibilidadAbierta: {}
        }
    }

    componentDidMount() {
        this.setState({
            formEstableceVisibilidadAbierta: {
                ...this.state.formEstableceVisibilidadAbierta,
                idPersona: '0',
                idUsuario: this.infoSesion.pem_Id_Ministro
            }
        });
    }

    onChangeEstableceVisibilidadAbierta = (e) => {
        this.setState({
            formEstableceVisibilidadAbierta: {
                ...this.state.formEstableceVisibilidadAbierta,
                [e.target.name]: e.target.value.toUpperCase()
            }
        })
    }

    handle_LinkEncabezado = (seccion, componente) => {
        localStorage.setItem('seccion', seccion);
        localStorage.setItem('componente', componente);
    }

    openModalEditaPersona = async () => {
        //Trae los nombres de todo el Personal Activo para seleccionar a quien se desea Actualizar
        await helpers.validaToken().then(helpers.authAxios.get(helpers.url_api + "/persona/GetBautizadosBySector/" + localStorage.getItem('sector'))
            .then(res => {
                this.setState({
                    personas: res.data.personas.sort((a, b) => {
                        const nameA = a.per_Nombre; // ignore upper and lowercase
                        const nameB = b.per_Nombre; // ignore upper and lowercase
                        if (nameA < nameB) {
                            return -1;
                        }
                        if (nameA > nameB) {
                            return 1;
                        }

                        // names must be equal
                        return 0;
                    })
                });
            })
        );
        this.setState({ modalEditaPersona: !this.state.modalEditaPersona })
    }

    openModalEditaPersonaNB = async () => {
        await helpers.validaToken().then(helpers.authAxios.get(helpers.url_api + "/persona/GetNoBautizadosBySector/" + localStorage.getItem('sector'))
            .then(res => {
                this.setState({
                    personas: res.data.personas.sort((a, b) => {
                        const nameA = a.per_Nombre; // ignore upper and lowercase
                        const nameB = b.per_Nombre; // ignore upper and lowercase
                        if (nameA < nameB) {
                            return -1;
                        }
                        if (nameA > nameB) {
                            return 1;
                        }

                        // names must be equal
                        return 0;
                    })
                });
            })
        );
        this.setState({ modalEditaPersonaNB: !this.state.modalEditaPersonaNB })
    }

    handle_personaSeleccionada = (e) => {
        // console.log(JSON.stringify(bar));
        this.setState({ personaSeleccionada: e.target.value });
    }

    //Despues de Seleccionar a un Bautizado para Edición/Actualización
    invocaFormularioDePersona = () => {

        if (this.state.personaSeleccionada == 0) {
            alert("No ha elegido la Persona que desea actualizar. Elija una.");
            return false;
        }
        this.handle_LinkEncabezado("Sección: Movimientos estadísticos", "Edición de Persona Bautizada")
        localStorage.setItem("idPersona", this.state.personaSeleccionada);
        localStorage.setItem("nvaAltaBautizado", true);
        localStorage.setItem("nvaAltaComunion", true);
        window.location = "/RegistroDePersona";
    }

    //Despues de Seleccionar a un NoBautizado para Edición/Actualización
    invocaFormularioDePersonaNB = () => {
        if (this.state.personaSeleccionada == 0) {
            alert("No ha elegido la Persona que desea actualizar. Elija una.");
            return false;
        }
        this.handle_LinkEncabezado("Sección: Movimientos estadísticos", "Edición de Persona NO Bautizada")
        localStorage.setItem("idPersona", this.state.personaSeleccionada);
        localStorage.setItem("nvaAltaBautizado", false);
        localStorage.setItem("nvaAltaComunion", false);
        window.location = "/RegistroDePersona";


    }

    openModalVisibilidadAbierta = async () => {
        await helpers.validaToken().then(helpers.authAxios.get(helpers.url_api + "/persona/GetVivoNoActivoBySector/" + localStorage.getItem('sector'))
            .then(res => {
                this.setState({ personas: res.data.personas });
            })
        );
        this.setState({ modalEstableceVisibilidadAbierta: !this.state.modalEstableceVisibilidadAbierta })
    }

    // METODO PARA INVOCAR UN FORMULARIO DE PERSONA NUEVO
    handle_AltaPersonaBautizada = () => {
        this.handle_LinkEncabezado("Sección: Movimientos estadísticos", "Alta de Persona por Bautismo");
        localStorage.setItem("idPersona", "0");
        localStorage.setItem("nvaAltaBautizado", true);
        localStorage.setItem("nvaAltaComunion", true);
    }

    handle_AltaRestitucion = () => {

        this.handle_LinkEncabezado("Sección: Movimientos estadísticos", "Alta de Persona por Restitución");
        //document.location.href = "/AltaRestitucion";
    }

    handle_AltaCambioDomicilio = () => {
        this.handle_LinkEncabezado("Sección: Movimientos estadísticos", "Alta de Persona por Cambio de Domicilio");
        //document.location.href = "/AltaCambioDomicilio";
    }

    //Para dar de Alta a un No Bautizado por Nuevo Ingreso. Resetea algunas variables en LocalStorage y el Encabezado.
    handle_AltaPersonaNoBautizada = () => {
        this.handle_LinkEncabezado("Sección: Movimientos estadísticos", "Alta de Persona NO Bautizada");
        localStorage.setItem("idPersona", "0");
        localStorage.setItem("nvaAltaBautizado", false);
        localStorage.setItem("nvaAltaComunion", false);
    }

    handle_Reactivacion = () => {

        this.handle_LinkEncabezado("Sección: Movimientos estadísticos", "Alta de Persona por Reactivación");
        //document.location.href = "/AltaReactivacion";
    }

    handle_AltaCambioDomicilioNB = () => {
        this.handle_LinkEncabezado("Sección: Movimientos estadísticos", "Alta de Persona NO Bautizada por Cambio de Domicilio");
        //document.location.href = "/AltaCambioDomicilioNB";
    }

    estableceVisibilidadAbierta = async (e) => {
        e.preventDefault();
        try {
            await helpers.validaToken().then(helpers.authAxios.post(`${helpers.url_api}/Historial_Transacciones_Estadisticas/CambiarVisibilidad/${this.state.formEstableceVisibilidadAbierta.idPersona}/${this.state.formEstableceVisibilidadAbierta.idUsuario}`)
                .then(res => {
                    if (res.data.status === "success") {
                        // alert(res.data.mensaje);
                        setTimeout(() => { document.location.href = '/ListaDePersonal'; }, 3000);
                        this.setState({
                            mensajeDelProceso: "Procesando...",
                            modalShow: true
                        });
                        setTimeout(() => {
                            this.setState({
                                mensajeDelProceso: "Los datos fueron grabados satisfactoriamente."
                            });
                        }, 1500);
                        setTimeout(() => {
                            document.location.href = '/ListaDePersonal'
                        }, 3500);
                    } else {
                        // alert(res.data.mensaje);
                        this.setState({
                            mensajeDelProceso: "Procesando...",
                            modalShow: true
                        });
                        setTimeout(() => {
                            this.setState({
                                mensajeDelProceso: res.data.mensaje,
                                modalShow: false
                            });
                        }, 1500);
                    }
                })
            )
        }
        catch {
            alert("Error: Hubo un problema en la comunicacion con el servidor. Intente mas tarde.");
            // setTimeout(() => { document.location.href = '/ListaDePersonal'; }, 3000);
        }



    }

    render() {
        console.log("PersonaSeleccionada: ", this.state.personaSeleccionada);
        return (
            <React.Fragment>
                {/* Sidebar */}
                <ul className="navbar-nav bg-SideBar sidebar sidebar-dark accordion" id="accordionSidebar">

                    {/* Sidebar - Brand */}
                    <Link
                        className="sidebar-brand d-flex align-items-center justify-content-center"
                        to="/Main"
                        onClick={() => this.handle_LinkEncabezado("", "")}
                    >
                        <div className="sidebar-brand-icon">
                            <i className="fas fa-building"></i>
                        </div>
                        <div className="sidebar-brand-text mx-3">IECE</div>
                    </Link>

                    {/* Divider */}
                    <hr className="sidebar-divider" />

                    {/* Heading */}
                    <div className="sidebar-heading">
                        Monitoreo
                    </div>

                    {/* Nav Item - Resumen Membresia Actual */}
                    <li className="nav-item">
                        <Link
                            className="nav-link collapsed"
                            to="/ResumenMembresia"
                            onClick={() => this.handle_LinkEncabezado("Sección: Monitoreo", "Resumen de Membresía Actual")}
                        >
                            <i className="fas fa-fw fa-address-book"></i>
                            <span>Resumen de Membresía Actual</span>
                        </Link>
                    </li>

                    {/* Nav Item - Información de Membresía */}
                    <li className="nav-item">
                        <Link
                            className="nav-link"
                            to="/ListaDePersonal"
                            onClick={() => this.handle_LinkEncabezado("Sección: Monitoreo", "Análisis de membresía")}
                        >
                            <i className="fas fa-fw fa-home"></i>
                            <span>Análisis de Membresía</span>
                        </Link>
                    </li>

                    {/* Nav Item - Info. del sector */}
                    {/* <li className="nav-item">
                        <Link className="nav-link" to="/Sector">
                            <i className="fas fa-fw fa-place-of-worship"></i>
                            <span>Info. del sector</span>
                        </Link>
                    </li> */}

                    {/* <li className="nav-item"> */}
                    {/* <Link className="nav-link collapsed" to="/RegistroDePersona">
                        <Link className="nav-link collapsed" to="#" onClick={helpers.handle_RegistroNvaPersona}>
                            <i className="fas fa-fw fa-id-card"></i>
                            <span>Regitrar miembro</span>
                        </Link>
                    </li> */}

                    {/* Nav Item - Personal bautizado */}
                    {/* <li className="nav-item">
                        <Link className="nav-link collapsed" to="/PersonalBautizado/Index">
                            <i className="fas fa-fw fa-id-card"></i>
                            <span>Personal bautizado</span>
                        </Link>
                    </li> */}

                    {/* Nav Item - Personal no bautizado */}
                    {/* <li className="nav-item">
                        <Link className="nav-link collapsed" to="/PersonalNoBautizado/Index">
                            <i className="fas fa-fw fa-users"></i>
                            <span>Personal no bautizado</span>
                        </Link>
                    </li> */}

                    {/* Divider */}
                    <hr className="sidebar-divider" />

                    {/* Heading */}
                    <div className="sidebar-heading">
                        Movimientos Estadísticos
                    </div>

                    {/* Nav Item - Altas Collapse Menu */}
                    <li className="nav-item">
                        <Link className="nav-link collapsed" to="#" data-toggle="collapse" data-target="#collapseMPAltas" aria-expanded="true" aria-controls="collapsePages">
                            <i className="fas fa-fw fa-user-check"></i>
                            <span>Alta de personal</span>
                        </Link>
                        <div id="collapseMPAltas" className="collapse" aria-labelledby="headingMPAltas" data-parent="#accordionSidebar">
                            <div className="bg-white py-2 collapse-inner rounded">
                                {/* <h6 className="collapse-header">Personal bautizado:</h6> */}
                                <Link className="collapse-item" to="#" data-toggle="collapse" data-target="#collapseAltaBautizado" aria-expanded="true" aria-controls="collapseBautizado">
                                    Personal Bautizado
                                </Link>
                                <div id="collapseAltaBautizado" className="collapse" aria-labelledby="headingBautizado" data-parent="#collapseMPAltas">
                                    <div className="bg-white py-2 collapse-inner rounded">
                                        <Link className="collapse-item" onClick={this.handle_AltaPersonaBautizada} to="/RegistroDePersona">Bautismo</Link>
                                        <Link className="collapse-item" to="/AltaRestitucion" onClick={this.handle_AltaRestitucion}>Restitución</Link>
                                        <Link className="collapse-item" to="/AltaCambioDomicilio" onClick={this.handle_AltaCambioDomicilio}>Cambio de Domicilio</Link>
                                    </div>
                                </div>

                                {/* <Link className="collapse-item" to="#">Cambio de domicilio</Link> */}
                                <Link className="collapse-item" to="#" data-toggle="collapse" data-target="#collapseAltaNoBautizado" aria-expanded="true" aria-controls="collapseNoBautizado">
                                    Personal No Bautizado
                                </Link>
                                <div id="collapseAltaNoBautizado" className="collapse" aria-labelledby="headingnoBautizado" data-parent="#collapseMPAltas">
                                    <div className="bg-white py-2 collapse-inner rounded">
                                        <Link className="collapse-item" onClick={this.handle_AltaPersonaNoBautizada} to="/RegistroDePersona">Nuevo Ingreso</Link>
                                        <Link className="collapse-item" to="/AltaReactivacion" onClick={this.handle_Reactivacion}>Reativación</Link>
                                        <Link className="collapse-item" to="/AltaCambioDomicilioNB" onClick={this.handle_AltaCambioDomicilioNB}>Cambio de Domicilio</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>


                    {/* Nav Item - Bajas Collapse Menu */}
                    <li className="nav-item">
                        <Link className="nav-link collapsed" to="#" data-toggle="collapse" data-target="#collapseMPBajas" aria-expanded="true" aria-controls="collapsepages">
                            <i className="fas fa-fw fa-user-times"></i>
                            <span>Baja de personal</span>
                        </Link>
                        <div id="collapseMPBajas" className="collapse" aria-labelledby="headingMPBajas" data-parent="#accordionSidebar">
                            <div className="bg-white py-2 collapse-inner rounded">
                                {/* <h6 className="collapse-header">Personal bautizado:</h6>
                                <Link className="collapse-item" to="#">Cambio de domicilio</Link>
                                <Link className="collapse-item" to="#">Defuncion</Link> */}
                                {/* <h6 className="collapse-header">Personal no bautizado:</h6> */}
                                <Link className="collapse-item" to="#" data-toggle="collapse" data-target="#collapseBajaBautizado" aria-expanded="true" aria-controls="collapseBautizado">
                                    Personal Bautizado
                                </Link>
                                <div id="collapseBajaBautizado" className="collapse" aria-labelledby="headingBautizado" data-parent="#collapseMPBajas">
                                    <div className="bg-white py-2 collapse-inner rounded">
                                        <Link
                                            className="collapse-item"
                                            to="/BajaBautizadoDefuncion"
                                            onClick={() => this.handle_LinkEncabezado("Sección: Movimientos estadísticos", "Baja de bautizado por defunción")}
                                        >Defunción
                                        </Link>
                                        <Link
                                            className="collapse-item"
                                            to="/BajaBautizadoExcomunion"
                                            onClick={() => this.handle_LinkEncabezado("Sección: Movimientos estadísticos", "Baja por excomunión")}
                                        >Excomunión</Link>
                                        <Link
                                            className="collapse-item"
                                            to="/BajaBautizadoCambioDomicilio"
                                            onClick={() => this.handle_LinkEncabezado("Sección: Movimientos estadísticos", "Baja de bautizado por cambio de domicilio")}
                                        >Cambio de Domicilio</Link>
                                    </div>
                                </div>
                                <Link className="collapse-item" to="#" data-toggle="collapse" data-target="#collapseBajaNoBautizado" aria-expanded="true" aria-controls="collapseNoBautizado">
                                    Personal No Bautizado
                                </Link>
                                <div id="collapseBajaNoBautizado" className="collapse" aria-labelledby="headingnoBautizado" data-parent="#collapseMPBajas">
                                    <div className="bg-white py-2 collapse-inner rounded">
                                        <Link
                                            className="collapse-item"
                                            to="/BajaNoBautizadoDefuncion"
                                            onClick={() => this.handle_LinkEncabezado("Sección: Movimientos estadísticos", "Baja de NO bautizado por defunción")}
                                        >Defunción
                                        </Link>
                                        <Link
                                            className="collapse-item"
                                            to="/BajaNoBautizadoAlejamiento"
                                            onClick={() => this.handle_LinkEncabezado("Sección: Movimientos estadísticos", "Baja de NO bautizado por alejamiento")}
                                        >Alejamiento
                                        </Link>
                                        <Link
                                            className="collapse-item"
                                            to="/BajaNoBautizadoCambioDomicilio"
                                            onClick={() => this.handle_LinkEncabezado("Sección: Movimientos estadísticos", "Baja de NO bautizado por cambio de domicilio")}
                                        >Cambio de Domicilio</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>


                    {/* Nav Item - Actualización Collapse Menu */}
                    <li className="nav-item">
                        <Link className="nav-link collapsed" to="#" data-toggle="collapse" data-target="#collapseMPAct" aria-expanded="true" aria-controls="collapsepages">
                            <i className="fas fa-fw fa-user-edit"></i>
                            <span>Actualización de personal</span>
                        </Link>
                        <div id="collapseMPAct" className="collapse" aria-labelledby="headingMPAct" data-parent="#accordionSidebar">
                            <div className="bg-white py-2 collapse-inner rounded">
                                {/* <h6 className="collapse-header">Personal bautizado:</h6>
                                <Link className="collapse-item" to="#">Cambio de domicilio</Link>
                                <Link className="collapse-item" to="#">Defuncion</Link> */}
                                {/* <h6 className="collapse-header">Personal no bautizado:</h6> */}
                                <Link className="collapse-item" to="#" data-toggle="collapse" data-target="#collapseActBautizado" aria-expanded="true" aria-controls="collapseActBautizado">
                                    Personal Bautizado
                                </Link>
                                <div id="collapseActBautizado" className="collapse" aria-labelledby="headinActBautizado" data-parent="#collapseMPAct">
                                    <div className="bg-white py-2 collapse-inner rounded">
                                        <Link
                                            className="collapse-item"
                                            to="#"
                                            onClick={this.openModalEditaPersona}
                                        >Actualización</Link>
                                    </div>
                                </div>
                                <Link className="collapse-item" to="#" data-toggle="collapse" data-target="#collapseActNoBautizado" aria-expanded="true" aria-controls="collapseActNoBautizado">
                                    Personal No Bautizado
                                </Link>
                                <div id="collapseActNoBautizado" className="collapse" aria-labelledby="headingActNoBautizado" data-parent="#collapseMPAct">
                                    <div className="bg-white py-2 collapse-inner rounded">
                                        <Link
                                            className="collapse-item"
                                            to="#"
                                            onClick={this.openModalEditaPersonaNB}
                                        >Actualización</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>

                    {/* Divider */}
                    <hr className="sidebar-divider" />

                    {/* Heading */}
                    <div className="sidebar-heading">
                        Sucesos Estadísticos
                    </div>

                    {/* Nav Item - Matrimonios */}
                    <li className="nav-item">
                        <Link className="nav-link"
                            to="/Matrimonio"
                            onClick={() => this.handle_LinkEncabezado('Sucesos Estadisticos', 'Matrimonio')}
                        >
                            <i className="fas fa-fw fa-user-friends"></i>
                            <span>Matrimonio</span>
                        </Link>
                    </li>
                    {/* Nav Item - Matrimonios */}
                    <li className="nav-item">
                        <Link className="nav-link"
                            to="/Legalizacion"
                            onClick={() => this.handle_LinkEncabezado('Sucesos Estadisticos', 'Legalización')}
                        >
                            <i className="fas fa-fw fa-user-friends"></i>
                            <span>Legalización</span>
                        </Link>
                    </li>

                    {/* Nav Item - Presentaciones  */}
                    <li className="nav-item">
                        <Link className="nav-link"
                            to="/PresentacionDeNino"
                            onClick={() => this.handle_LinkEncabezado('Sucesos Estádisticos', 'Presentación de niños')}
                        >
                            <i className="fas fa-fw fa-baby"></i>
                            <span>Presentación de Niños</span>
                        </Link>
                    </li>

                    {/* Divider */}
                    <hr className="sidebar-divider" />

                    {/* Heading */}
                    <div className="sidebar-heading">
                        Hogares
                    </div>

                    {/* Nav Item - Hogares  */}
                    <li className="nav-item">
                        <Link
                            className="nav-link"
                            to="/EdicionDeDireccion"
                            onClick={() => this.handle_LinkEncabezado('Hogares', 'Edición de dirección.')}>
                            <i className="fas fa-address-book"></i>
                            <span>Edición de Dirección</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            className="nav-link text-wrap"
                            to="/RevinculaDomicilio"
                            onClick={() => this.handle_LinkEncabezado('Hogares', 'Revinculación persona-hogar.')}
                        >
                            <i className="fas fa-house-user"></i>
                            <span>Revinculación Persona-Hogar</span>
                        </Link>
                    </li>

                    {/* Divider */}
                    <hr className="sidebar-divider" />

                    {/* Heading */}
                    <div className="sidebar-heading">
                        Transacciones Especiales
                    </div>

                    {/* Nav Item - Hogares  */}
                    {/* <li className="nav-item">
                        <Link
                            className="nav-link"
                            to="#"
                            onClick={this.openModalVisibilidadAbierta}
                        >
                            <i className="fas fa-address-book"></i>
                            <span>Habilitar Visibilidad Abierta</span>
                        </Link>
                    </li> */}

                    <li className="nav-item">
                        <Link
                            className="nav-link"
                            onClick={() => this.handle_LinkEncabezado('Transacciones especiales', 'Transacciones extemporaneas.')}
                            to="/RegistrarTransaccionesHistoricas"
                        >
                            <i className="fas fa-address-book"></i>
                            <span>Transacciones Extemporaneas</span>
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link collapsed" to="#" data-toggle="collapse" data-target="#collapseAdministrativo" aria-expanded="true" aria-controls="collapsePages">
                            <i className="fas fa-user-tie"></i>
                            <span>Personal Administrativo</span>
                        </Link>
                        <div id="collapseAdministrativo" className="collapse" aria-labelledby="headingAdministrativo" data-parent="#accordionSidebar">
                            <div className="bg-white py-2 collapse-inner rounded">
                                <Link
                                    className="collapse-item"
                                    onClick={() => this.handle_LinkEncabezado('Transacciones especiales', 'Secretario del sector.')}
                                    to="/SecretarioDelSector"
                                >
                                    {/* <i className="fas fa-edit"></i> */}
                                    <span>Secretario del sector</span>
                                </Link>
                                <Link
                                    className="collapse-item"
                                    onClick={() => this.handle_LinkEncabezado('Transacciones especiales', 'Tesorero del sector.')}
                                    to="/TesoreroDelSector"
                                >
                                    {/* <i className="fas fa-hand-holding-usd"></i> */}
                                    <span>Tesorero del sector</span>
                                </Link>
                                {/* <Link
                                    className="collapse-item"
                                    onClick={() => this.handle_LinkEncabezado('Transacciones especiales', 'Auxiliares del sector.')}
                                    to="/Auxiliares"
                                >
                                    {/* <i className="fas fa-user-tie"></i> 
                                    <span>Auxiliares del sector</span>
                                </Link> */}
                            </div>
                        </div>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link collapsed" to="#" data-toggle="collapse" data-target="#collapseMinisterial" aria-expanded="true" aria-controls="collapsePages">
                            <i className="fas fa-user-tie"></i>
                            <span>Personal Ministerial</span>
                        </Link>
                        <div id="collapseMinisterial" className="collapse" aria-labelledby="headingMinisterial" data-parent="#accordionSidebar">
                            <div className="bg-white py-2 collapse-inner rounded">
                                <Link
                                    onClick={() => this.handle_LinkEncabezado('Transacciones especiales', 'Alta de Personal Ministerial')}
                                    to="/RegistroPersonalMinisterial"
                                    className="collapse-item"
                                >
                                    <span>Alta de Personal Ministerial</span>
                                </Link>
                                <Link
                                    onClick={() => this.handle_LinkEncabezado('Transacciones especiales', 'Baja de Personal Ministerial')}
                                    to="/BajaPersonalMinisterial"
                                    className="collapse-item"
                                >
                                    <span>Baja de Personal Ministerial</span>
                                </Link>
                            </div>
                        </div>
                    </li>

                    {/* Divider */}
                    <hr className="sidebar-divider" />

                    {/* Heading */}
                    <div className="sidebar-heading">
                        Reportes
                    </div>

                    {/* Nav Item - Reportes Collapse Menu */}
                    <li className="nav-item">
                        <Link className="nav-link collapsed" to="#" data-toggle="collapse" data-target="#collapseReportes" aria-expanded="true" aria-controls="collapsePages">
                            <i className="fas fa-fw fa-clipboard-list"></i>
                            <span>Reportes</span>
                        </Link>
                        <div id="collapseReportes" className="collapse" aria-labelledby="headingReportes" data-parent="#accordionSidebar">
                            <div className="bg-white py-2 collapse-inner rounded">
                                <h6 className="collapse-header">Seleccione un reporte:</h6>
                                <Link className="collapse-item text-wrap"
                                    to="/ResumenMembresia"
                                    onClick={() => this.handle_LinkEncabezado("Sección: Reportes", "Reporte de Membresía Actual")}
                                >Reporte de Membresía Actual
                                </Link>
                                <Link className="collapse-item text-wrap"
                                    to="/ReportePersonalBautizado"
                                    onClick={() => this.handle_LinkEncabezado("Sección: Reportes", "Lista de Personal Bautizado")}
                                >Lista de Personal Bautizado</Link>
                                <Link className="collapse-item text-wrap"
                                    to="/ReportePersonalNoBautizado"
                                    onClick={() => this.handle_LinkEncabezado("Sección: Reportes", "Lista de Personal No Bautizado")}
                                >Lista de Personal No Bautizado</Link>
                                <Link className="collapse-item text-wrap"
                                    to="/RptListaDeHogares"
                                    onClick={() => this.handle_LinkEncabezado("Sección: Reportes", "Lista de hogares")}
                                >Lista de hogares</Link>
                                <Link className="collapse-item text-wrap"
                                    to="/ReporteOficiosProfesiones"
                                    onClick={() => this.handle_LinkEncabezado("Sección: Reportes", "Lista por Profesiones/Oficios")}
                                >Lista por Profesiones/Oficios</Link>
                                <Link className="collapse-item text-wrap"
                                    to="/ReporteCumpleaños"
                                    onClick={() => this.handle_LinkEncabezado("Sección: Reportes", "Lista por Fecha de Cumpleaños")}
                                >Lista por Fecha de Cumpleaños</Link>
                                <Link className="collapse-item text-wrap"
                                    to="/ReportePersonalMinisterial"
                                    onClick={() => this.handle_LinkEncabezado("Sección: Reportes", "Lista de Personal Ministerial")}
                                >Lista de Personal Ministerial</Link>
                                <Link className="collapse-item text-wrap"
                                    to="/ReporteMovimientoEstadistico"
                                    onClick={() => this.handle_LinkEncabezado("Sección: Reportes", "Reporte de Movimientos Estadísticos")}
                                >Reporte de Movimientos Estadísticos</Link>
                                <Link className="collapse-item text-wrap"
                                    to="/ResumenTransacciones"
                                    onClick={() => this.handle_LinkEncabezado("Sección: Reportes", "Resumen de Transacciones")}
                                >Resumen de Transacciones</Link>
                            </div>
                        </div>
                    </li>

                    {/* Divider */}
                    {/* <hr className="sidebar-divider" /> */}

                    {/* Heading */}
                    {/* <div className="sidebar-heading">
                        Exportaciones
                    </div> */}
                    {/* Nav Item - Exportaciones  */}
                    {/* <li className="nav-item">
                        <Link className="nav-link" to="#">
                            <i className="fas fa-fw fa-baby"></i>
                            <span>Membresía a Excel</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link text-wrap" to="#">
                            <i className="fas fa-fw fa-baby"></i>
                            <span>Hogares a Excel</span>
                        </Link>
                    </li> */}

                    {/* Divider */
                        <hr className="sidebar-divider d-none d-md-block" />
                    }


                    {/* Sidebar Toggler (Sidebar) */}
                    <div className="text-center d-none d-md-inline">
                        <button className="rounded-circle border-0" id="sidebarToggle"></button>
                    </div>

                </ul >

                {/* MODAL ACTUALIZAR PERSONA BAUTIZADA */}
                < Modal isOpen={this.state.modalEditaPersona} size="lg" >
                    <Card>
                        <CardHeader>
                            <CardTitle><h3>Seleccione la Persona a Editar:</h3></CardTitle>
                        </CardHeader>
                        <CardBody>
                            <FormGroup>
                                <Row>
                                    <Col xs="3">
                                        <strong>PERSONA:</strong>
                                    </Col>
                                    <Col xs="9">
                                        <Input
                                            type="select"
                                            value={this.state.personaSeleccionada}
                                            onChange={this.handle_personaSeleccionada}
                                        >
                                            <option value="0">Selecciona una persona</option>
                                            {this.state.personas.map(persona => {
                                                return (
                                                    <React.Fragment key={persona.per_Id_Persona}>
                                                        <option value={persona.per_Id_Persona} >
                                                            {persona.per_Nombre} {(persona.per_Apellido_Casada == "" || persona.per_Apellido_Casada == null) ? persona.per_Apellido_Paterno : (persona.per_Apellido_Casada + "* " + persona.per_Apellido_Paterno)} {persona.per_Apellido_Materno}
                                                        </option>
                                                    </React.Fragment>
                                                )
                                            })}
                                        </Input>
                                    </Col>
                                </Row>
                            </FormGroup>

                        </CardBody>
                        <CardFooter>
                            <Button
                                type="button"
                                onClick={this.openModalEditaPersona}
                                color="secondary"
                                className="entreBotones"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="button"
                                color="success"
                                onClick={this.invocaFormularioDePersona}
                            >
                                <span className="fa fa-pencil"></span>Editar
                            </Button>
                        </CardFooter>
                    </Card>
                </Modal >

                {/* MODAL ACTUALIZAR PERSONA NO BAUTIZADA */}
                < Modal isOpen={this.state.modalEditaPersonaNB} >
                    <Card>
                        <CardHeader>
                            <CardTitle><h3>Seleccione una Persona a Editar.</h3></CardTitle>
                        </CardHeader>
                        <CardBody>
                            <FormGroup>
                                <Row>
                                    <Col xs="3">
                                        PERSONA:
                                    </Col>
                                    <Col xs="9">
                                        <Input
                                            type="select"
                                            value={this.state.personaSeleccionada}
                                            onChange={this.handle_personaSeleccionada}
                                        >
                                            <option value="0">Selecciona una persona</option>
                                            {this.state.personas.map(persona => {
                                                return (
                                                    <React.Fragment key={persona.per_Id_Persona}>
                                                        <option value={persona.per_Id_Persona} >
                                                            {persona.per_Nombre} {persona.per_Apellido_Paterno} {persona.per_Apellido_Materno}
                                                        </option>
                                                    </React.Fragment>
                                                )
                                            })}
                                        </Input>
                                    </Col>
                                </Row>
                            </FormGroup>

                        </CardBody>
                        <CardFooter>
                            <Button
                                type="button"
                                onClick={this.openModalEditaPersonaNB}
                                color="secondary"
                                className="entreBotones"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="button"
                                color="success"
                                onClick={this.invocaFormularioDePersonaNB}>
                                <span className="fa fa-pencil"></span>Editar
                            </Button>
                        </CardFooter>
                    </Card>
                </Modal >

                {/* MODAL BAJA/NOBAUTIZADO/ALEJAMIENTO */}
                {/* <Modal isOpen={this.state.modalBajaNoBautizadoAlejamiento} size="lg">
                    <Card>
                        <Form onSubmit={this.bajaNoBautizadoAlejamiento}>
                            <CardHeader>
                                <CardTitle><h3>Baja de persona No Bautizada por alejamiento.</h3></CardTitle>
                            </CardHeader>
                            <CardBody>
                                <FormGroup>
                                    <Row>
                                        <Col xs="12">
                                            <Alert color="warning">
                                                <strong>AVISO: </strong>LOS CAMPOS MARCADOS CON * SON REQUERIDOS.
                                            </Alert>
                                        </Col>
                                    </Row>
                                </FormGroup>
                                <FormGroup>
                                    <Row>
                                        <Col xs="3">
                                            * PERSONA:
                                        </Col>
                                        <Col xs="9">
                                            <Input
                                                type="select"
                                                value={this.state.formBajaNoBautizadoAlejamiento.personaSeleccionada}
                                                name="personaSeleccionada"
                                                onChange={this.onChangeBajaNoBautizadoAlejamiento}
                                            >
                                                <option value="0">Seleccione una persona</option>
                                                {this.state.personas.map(persona => {
                                                    return (
                                                        <React.Fragment key={persona.per_Id_Persona}>
                                                            <option value={persona.per_Id_Persona} >
                                                                {persona.per_Nombre} {persona.per_Apellido_Paterno} {persona.per_Apellido_Materno}
                                                            </option>
                                                        </React.Fragment>
                                                    )
                                                })}
                                            </Input>
                                        </Col>
                                    </Row>
                                </FormGroup>
                                <FormGroup>
                                    <Row>
                                        <Col xs="3">
                                            Comentario:
                                        </Col>
                                        <Col xs="9">
                                            <Input
                                                type="text"
                                                name="comentario"
                                                value={this.state.formBajaNoBautizadoAlejamiento.comentario}
                                                onChange={this.onChangeBajaNoBautizadoAlejamiento}
                                            />
                                        </Col>
                                    </Row>
                                </FormGroup>
                                <FormGroup>
                                    <Row>
                                        <Col xs="3">
                                            * Fecha de transacción:
                                        </Col>
                                        <Col xs="9">
                                            <Input
                                                type="date"
                                                name="fechaTransaccion"
                                                placeholder='DD/MM/AAAA'
                                                value={this.state.formBajaNoBautizadoAlejamiento.fechaTransaccion}
                                                onChange={this.onChangeBajaNoBautizadoAlejamiento}
                                            />
                                        </Col>
                                    </Row>
                                </FormGroup>

                            </CardBody>
                            <CardFooter>
                                <Button
                                    type="button"
                                    onClick={this.openModalBajaNoBautizadoAlejamiento}
                                    color="secondary"
                                    className="entreBotones"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    color="success"
                                >
                                    <span className="fa fa-pencil"></span>Proceder
                                </Button>
                            </CardFooter>
                        </Form>
                    </Card>
                </Modal> */}

                {/* MODAL ESTABLECE VISIBILIDAD ABIERTA */}
                <Modal isOpen={this.state.modalEstableceVisibilidadAbierta} size="lg">
                    <Card>
                        <Form onSubmit={this.estableceVisibilidadAbierta}>
                            <CardHeader>
                                <CardTitle><h3>Cambia estatus de la persona a Visibilidad Abierta.</h3></CardTitle>
                            </CardHeader>
                            <CardBody>
                                <FormGroup>
                                    <Row>
                                        <Col xs="12">
                                            <Alert color="warning">
                                                <strong>AVISO: </strong>Esta Transacción permite que una persona inactiva de este Sector, sea vista por algun otro Distrito que quiere darla de Alta.
                                            </Alert>
                                        </Col>
                                    </Row>
                                </FormGroup>
                                <FormGroup>
                                    <Row>
                                        <Col xs="3">
                                            * PERSONA:
                                        </Col>
                                        <Col xs="9">
                                            <Input
                                                type="select"
                                                value={this.state.formEstableceVisibilidadAbierta.idPersona}
                                                name="idPersona"
                                                onChange={this.onChangeEstableceVisibilidadAbierta}
                                            >
                                                <option value="0">Seleccione una persona</option>
                                                {this.state.personas.map(persona => {
                                                    return (
                                                        <React.Fragment key={persona.per_Id_Persona}>
                                                            <option value={persona.per_Id_Persona} >
                                                                {persona.per_Nombre} {(persona.per_Apellido_Casada == "" || persona.per_Apellido_Casada == null) ? persona.per_Apellido_Paterno : (persona.per_Apellido_Casada + "* " + persona.per_Apellido_Paterno)} {persona.per_Apellido_Materno}
                                                            </option>
                                                        </React.Fragment>
                                                    )
                                                })}
                                            </Input>
                                        </Col>
                                    </Row>
                                </FormGroup>
                            </CardBody>
                            <CardFooter>
                                <Button
                                    type="button"
                                    onClick={this.openModalVisibilidadAbierta}
                                    color="secondary"
                                    className="entreBotones"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    color="success"
                                >
                                    <span className="fa fa-pencil"></span>Aceptar
                                </Button>
                            </CardFooter>
                        </Form>
                    </Card>
                </Modal>

                {/*Modal success*/}
                <Modal isOpen={this.state.modalShow}>
                    <ModalBody>
                        {this.state.mensajeDelProceso}
                    </ModalBody>
                </Modal>

                {/* End of Sidebar */}
            </React.Fragment >
        );
    }
}
export default Sidebar;