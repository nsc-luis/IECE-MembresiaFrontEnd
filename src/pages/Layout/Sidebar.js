import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Card, CardBody, CardFooter, CardHeader, CardTitle, Alert, 
    Button, Modal, FormGroup, Input, Col, Row, Form, ModalBody
} from 'reactstrap';
import helpers from '../../components/Helpers';
import './style.css'

class Sidebar extends Component {
    // infoSesion = JSON.parse(localStorage.getItem('infoSesion'));
    constructor(props) {
        super(props);
        this.state = {
            modalEditaPersona: false,
            modalEditaPersonaNB: false,
            modalBajaBautizadoExcomunion: false,
            personas: [],
            formBajaBautizadoExcomunion: {},
            personaSeleccionada: '0',
            mensajeDelProceso: '',
            modalShow: false,
            modalBajaBautizadoDefuncion: false,
            formBajaBautizadoDefuncion: {},
            modalBajaNoBautizadoDefuncion: false,
            modalBajaNoBautizadoAlejamiento: false,
            formBajaNoBautizadoDefuncion: {},
            formBajaNoBautizadoAlejamiento: {}
        }
    }

    componentDidMount() {
        this.setState({
            formBajaBautizadoExcomunion: {
                ...this.state.bajaBautizadoExcomunion,
                personaSeleccionada: '0',
                tipoExcomunion: '0',
                excomunionDelito: '',
                fechaExcomunion: '01/01/1900'
            },
            formBajaNoBautizadoDefuncion: {
                ...this.state.formBajaNoBautizadoDefuncion,
                personaSeleccionada: '0',
                comentario: '',
                fechaTransaccion: '01/01/1900'
            },
            formBajaNoBautizadoAlejamiento: {
                ...this.state.formBajaNoBautizadoAlejamiento,
                personaSeleccionada: '0',
                codigoTransaccion: '0',
                fechaTransaccion: '01/01/1900'
            }
        });
    }

    onChangeBajaBautizadoExcomunion = (e) => {
        this.setState({
            formBajaBautizadoExcomunion: {
                ...this.state.formBajaBautizadoExcomunion,
                [e.target.name]: e.target.value.toUpperCase()
            }
        })
    }

    onChangeBajaBautizadoDefuncion = (e) => {
        this.setState({
            formBajaBautizadoDefuncion: {
                ...this.state.formBajaBautizadoDefuncion,
                [e.target.name]: e.target.value.toUpperCase()
            }
        })
    }

    onChangeBajaNoBautizadoDefuncion = (e) => {
        this.setState({
            formBajaNoBautizadoDefuncion: {
                ...this.state.formBajaNoBautizadoDefuncion,
                [e.target.name]: e.target.value.toUpperCase()
            }
        })
    }

    onChangeBajaNoBautizadoAlejamiento = (e) => {
        this.setState({
            formBajaNoBautizadoAlejamiento: {
                ...this.state.formBajaNoBautizadoAlejamiento,
                [e.target.name]: e.target.value.toUpperCase()
            }
        })
    }

    handle_LinkEncabezado = (seccion, componente) => {
        localStorage.setItem('seccion', seccion);
        localStorage.setItem('componente', componente);
    }

    openModalEditaPersona = async () => {
        await helpers.authAxios.get(helpers.url_api + "/persona/GetBautizadosBySector/" + localStorage.getItem('sector'))
            .then(res => {
                this.setState({ personas: res.data.personas });
            });
        this.setState({ modalEditaPersona: !this.state.modalEditaPersona })
    }

    openModalEditaPersonaNB = async () => {
        await helpers.authAxios.get(helpers.url_api + "/persona/GetNoBautizadosBySector/" + localStorage.getItem('sector'))
            .then(res => {
                this.setState({ personas: res.data.personas });
            });
        this.setState({ modalEditaPersonaNB: !this.state.modalEditaPersonaNB })
    }

    handle_personaSeleccionada = (e) => {
        // console.log(JSON.stringify(bar));
        this.setState({ personaSeleccionada: e.target.value });
    }

    invocaFormularioDePersona = () => {
        localStorage.setItem("idPersona", this.state.personaSeleccionada);
        // console.log(localStorage.getItem("idPersona"));
        document.location.href = '/RegistroDePersona';
    }

    openModalBajaBautizadoExcomunion = async () => {
        await helpers.authAxios.get(helpers.url_api + "/persona/GetBautizadosComunionBySector/" + localStorage.getItem('sector'))
            .then(res => {
                this.setState({ personas: res.data.personas });
            });
        this.setState({ modalBajaBautizadoExcomunion: !this.state.modalBajaBautizadoExcomunion })
    }

    openModalBajaBautizadoDefuncion = async () => {
        await helpers.authAxios.get(helpers.url_api + "/persona/GetBautizadosComunionVivoBySector/" + localStorage.getItem('sector'))
            .then(res => {
                this.setState({ personas: res.data.personas });
            });
        this.setState({ modalBajaBautizadoDefuncion: !this.state.modalBajaBautizadoDefuncion })
    }

    openModalBajaNoBautizadoDefuncion = async () => {
        await helpers.authAxios.get(helpers.url_api + "/persona/GetNoBautizadosDefuncionBySector/" + localStorage.getItem('sector'))
            .then(res => {
                this.setState({ personas: res.data.personas });
            });
        this.setState({ modalBajaNoBautizadoDefuncion: !this.state.modalBajaNoBautizadoDefuncion })
    }

    openModalBajaNoBautizadoAlejamiento = async () => {
        await helpers.authAxios.get(helpers.url_api + "/persona/GetNoBautizadosAlejamientoBySector/" + localStorage.getItem('sector'))
            .then(res => {
                this.setState({ personas: res.data.personas });
            });
        this.setState({ modalBajaNoBautizadoAlejamiento: !this.state.modalBajaNoBautizadoAlejamiento })
    }

    bajaBautizadoExcomunion = async (e) => {
        e.preventDefault();
        var datos = this.state.formBajaBautizadoExcomunion;

        if (datos.personaSeleccionada === '0'
            || datos.tipoExcomunion === '0'
            || datos.excomunionDelito === ''
            || datos.fechaExcomunion === ''
            || datos.fechaExcomunion === '01/01/1900') {
            alert('Error!\nDebe ingresar todos los datos requeridos.');
            return false;
        }
        if (helpers.regex.formatoFecha.test(datos.fechaExcomunion) === false) {
            alert('Error!\nEl formato de fecha es incorrecto; debe ingresar de acuerdo al formato: DD/MM/AAAA.');
            return false;
        }
        else {
            var fechaExcomunion = helpers.fnFormatoFecha2(datos.fechaExcomunion);
        }
        console.log(fechaExcomunion);
        try {
            await helpers.authAxios.post(
                helpers.url_api + "/Persona/BajaBautizadoExcomunion/" + datos.personaSeleccionada +
                "/" + datos.tipoExcomunion +
                "/" + datos.excomunionDelito +
                "/" + fechaExcomunion)
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
                });
        } catch (error) {
            alert("Error: Hubo un problema en la comunicacion con el servidor. Intente mas tarde.");
            // setTimeout(() => { document.location.href = '/ListaDePersonal'; }, 3000);
        }
    }

    bajaBautizadoDefuncion = async (e) => {
        e.preventDefault();
        var datos = this.state.formBajaBautizadoDefuncion;

        if (datos.personaSeleccionada === '0'
            || datos.comentarioDefuncion === ''
            || datos.fechaDefuncion === ''
            || datos.fechaDefuncion === '01/01/1900') {
            alert('Error!\nDebe ingresar todos los datos requeridos.');
            return false;
        }
        if (helpers.regex.formatoFecha.test(datos.fechaDefuncion) === false) {
            alert('Error!\nEl formato de fecha es incorrecto; debe ingresar de acuerdo al formato: DD/MM/AAAA.');
            return false;
        }
        else {
            var fechaDefuncion = helpers.fnFormatoFecha2(datos.fechaDefuncion);
        }
        try {
            await helpers.authAxios.post(
                helpers.url_api + "/Persona/BajaBautizadoDefuncion/" + datos.personaSeleccionada +
                "/" + datos.comentarioDefuncion +
                "/" + fechaDefuncion)
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
                });
        } catch (error) {
            alert("Error: Hubo un problema en la comunicacion con el servidor. Intente mas tarde.");
            // setTimeout(() => { document.location.href = '/ListaDePersonal'; }, 3000);
        }
    }

    bajaNoBautizadoDefuncion = async (e) => {
        e.preventDefault();
        var datos = this.state.formBajaNoBautizadoDefuncion;

        if (datos.personaSeleccionada === '0'
            || datos.fechaTransaccion === ''
            || datos.fechaTransaccion === '01/01/1900') {
            alert('Error!\nDebe ingresar todos los datos requeridos.');
            return false;
        }
        try {
            await helpers.authAxios.post(
                helpers.url_api + "/Persona/BajaNoBautizadoDefuncion/" + datos.personaSeleccionada +
                "/" + datos.comentario +
                "/" + datos.fechaTransaccion)
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
                });
        } catch (error) {
            alert("Error: Hubo un problema en la comunicacion con el servidor. Intente mas tarde.");
            // setTimeout(() => { document.location.href = '/ListaDePersonal'; }, 3000);
        }
    }

    bajaNoBautizadoAlejamiento = async (e) => {
        e.preventDefault();
        var datos = this.state.formBajaNoBautizadoAlejamiento;

        if (datos.personaSeleccionada === '0'
            || datos.fechaTransaccion === ''
            || datos.fechaTransaccion === '01/01/1900') {
            alert('Error!\nDebe ingresar todos los datos requeridos.');
            return false;
        }
        try {
            await helpers.authAxios.post(
                helpers.url_api + "/Persona/BajaNoBautizadoAlejamiento/" + datos.personaSeleccionada +
                "/" + datos.comentario +
                "/" + datos.fechaTransaccion)
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
                });
        } catch (error) {
            alert("Error: Hubo un problema en la comunicacion con el servidor. Intente mas tarde.");
            // setTimeout(() => { document.location.href = '/ListaDePersonal'; }, 3000);
        }
    }

    render() {
        return (
            <React.Fragment>
                {/* Sidebar */}
                <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

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
                            onClick={() => this.handle_LinkEncabezado("Seccion: Monitoreo", "Resúmen de membresía actual")}
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
                            onClick={() => this.handle_LinkEncabezado("Seccion: Monitoreo", "Información de membresía")}
                        >
                            <i className="fas fa-fw fa-home"></i>
                            <span>Anális de Membresia</span>
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
                        Movimientos Estadisticos
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
                                        <Link className="collapse-item" to="#" onClick={helpers.handle_RegistroNvaPersona}>Bautismo</Link>
                                        <Link className="collapse-item" to="/AltaRestitucion">Restitución</Link>
                                        <Link className="collapse-item" to="/AltaCambioDomicilio">Cambio de Domicilio</Link>
                                    </div>
                                </div>

                                {/* <Link className="collapse-item" to="#">Cambio de domicilio</Link> */}
                                <Link className="collapse-item" to="#" data-toggle="collapse" data-target="#collapseAltaNoBautizado" aria-expanded="true" aria-controls="collapseNoBautizado">
                                    Personal No Bautizado
                                </Link>
                                <div id="collapseAltaNoBautizado" className="collapse" aria-labelledby="headingnoBautizado" data-parent="#collapseMPAltas">
                                    <div className="bg-white py-2 collapse-inner rounded">
                                        <Link className="collapse-item" to="#">Nuevo Ingreso</Link>
                                        <Link className="collapse-item" to="#">Reativación</Link>
                                        <Link className="collapse-item" to="#">Cambio de Domicilio</Link>
                                    </div>
                                </div>
                                {/* <h6 className="collapse-header">Personal no bautizado:</h6>
                                    <Link className="collapse-item" to="#">Nuevo ingreso</Link>
                                    <Link className="collapse-item" to="#">Cambio de domicilio</Link>
                                    <Link className="collapse-item" to="#">Reactivación</Link> */}
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
                                            to="#"
                                            onClick={this.openModalBajaBautizadoDefuncion}
                                        >Defunción</Link>
                                        <Link
                                            className="collapse-item"
                                            to="#"
                                            onClick={this.openModalBajaBautizadoExcomunion}
                                        >Excomunión</Link>
                                        <Link className="collapse-item" to="#">Cambio de Domicilio</Link>
                                    </div>
                                </div>
                                <Link className="collapse-item" to="#" data-toggle="collapse" data-target="#collapseBajaNoBautizado" aria-expanded="true" aria-controls="collapseNoBautizado">
                                    Personal No Bautizado
                                </Link>
                                <div id="collapseBajaNoBautizado" className="collapse" aria-labelledby="headingnoBautizado" data-parent="#collapseMPBajas">
                                    <div className="bg-white py-2 collapse-inner rounded">
                                        <Link 
                                            className="collapse-item" 
                                            to="#"
                                            onClick={this.openModalBajaNoBautizadoDefuncion}
                                        >
                                            Defunción
                                        </Link>
                                        <Link 
                                            className="collapse-item" 
                                            to="#"
                                            onClick={this.openModalBajaNoBautizadoAlejamiento}
                                        >
                                            Alejamiento
                                        </Link>
                                        <Link className="collapse-item" to="#">Cambio de Domicilio</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>


                    {/* Nav Item - Actualización Collapse Menu */}
                    <li className="nav-item">
                        <Link className="nav-link collapsed" to="#" data-toggle="collapse" data-target="#collapseMPAct" aria-expanded="true" aria-controls="collapsepages">
                            <i className="fas fa-fw fa-user-times"></i>
                            <span>Actualizacion de personal</span>
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
                        Sucesos Estadisticos
                    </div>

                    {/* Nav Item - Matrimonios */}
                    <li className="nav-item">
                        <Link className="nav-link" to="Matrimonio">
                            <i className="fas fa-fw fa-user-friends"></i>
                            <span>Matrimonio / Legalización</span>
                        </Link>
                    </li>

                    {/* Nav Item - Presentaciones  */}
                    <li className="nav-item">
                        <Link className="nav-link" to="PresentacionDeNino">
                            <i className="fas fa-fw fa-baby"></i>
                            <span>Presentacion de niños</span>
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
                        <Link className="nav-link" to="/Hogar">
                            <i className="fas fa-fw fa-baby"></i>
                            <span>Edicion de dirección</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link text-wrap" to="#">
                            <i className="fas fa-fw fa-baby"></i>
                            <span>Revinculación persona-hogar</span>
                        </Link>
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
                                <Link className="collapse-item text-wrap" to="#">Reporte de Membresia Actual</Link>
                                <Link className="collapse-item text-wrap" to="#">Lista de Personal Bautizado</Link>
                                <Link className="collapse-item text-wrap" to="#">Lista de Personal No Bautizado</Link>
                                <Link className="collapse-item text-wrap" to="/RptListaDeHogares">Lista de hogares</Link>
                                <Link className="collapse-item text-wrap" to="#">Lista por Profesiones/Oficios</Link>
                                <Link className="collapse-item text-wrap" to="#">Lista por fecha de cumpleaños</Link>
                                <Link className="collapse-item text-wrap" to="#">Reporte de Movimiento Estadístico</Link>
                            </div>
                        </div>
                    </li>

                    {/* Divider */}
                    <hr className="sidebar-divider" />

                    {/* Heading */}
                    <div className="sidebar-heading">
                        Exportaciones
                    </div>
                    {/* Nav Item - Exportaciones  */}
                    <li className="nav-item">
                        <Link className="nav-link" to="#">
                            <i className="fas fa-fw fa-baby"></i>
                            <span>Membresia a Excel</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link text-wrap" to="#">
                            <i className="fas fa-fw fa-baby"></i>
                            <span>Hogares a Excel</span>
                        </Link>
                    </li>

                    {/* Divider */
                        <hr className="sidebar-divider d-none d-md-block" />}


                    {/* Sidebar Toggler (Sidebar) */}
                    <div className="text-center d-none d-md-inline">
                        <button className="rounded-circle border-0" id="sidebarToggle"></button>
                    </div>

                </ul>

                {/* MODAL ACTUALIZAR PERSONA BAUTIZADA */}
                <Modal isOpen={this.state.modalEditaPersona}>
                    <Card>
                        <CardHeader>
                            <CardTitle><h3>Seleccione la persona a editar.</h3></CardTitle>
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
                </Modal>

                {/* MODAL ACTUALIZAR PERSONA NO BAUTIZADA */}
                <Modal isOpen={this.state.modalEditaPersonaNB}>
                    <Card>
                        <CardHeader>
                            <CardTitle><h3>Seleccione una persona a editar.</h3></CardTitle>
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
                                onClick={this.invocaFormularioDePersona}
                            >
                                <span className="fa fa-pencil"></span>Editar
                            </Button>
                        </CardFooter>
                    </Card>
                </Modal>

                {/* MODAL BAJA/BAUTIZADO/EXCOMUNION */}
                <Modal isOpen={this.state.modalBajaBautizadoExcomunion} size="lg">
                    <Card>
                        <Form onSubmit={this.bajaBautizadoExcomunion}>
                            <CardHeader>
                                <CardTitle><h3>Seleccione una persona.</h3></CardTitle>
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
                                                value={this.state.formBajaBautizadoExcomunion.personaSeleccionada}
                                                name="personaSeleccionada"
                                                onChange={this.onChangeBajaBautizadoExcomunion}
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
                                <FormGroup>
                                    <Row>
                                        <Col xs="3">
                                            * Tipo de Excomunión:
                                        </Col>
                                        <Col xs="9">
                                            <Input
                                                type="select"
                                                name="tipoExcomunion"
                                                value={this.state.formBajaBautizadoExcomunion.tipoExcomunion}
                                                onChange={this.onChangeBajaBautizadoExcomunion}
                                            >
                                                <option value="0">Selecciona una opcion</option>
                                                <option value="11102">Excomunión temporal</option>
                                                <option value="11103">Excomunión</option>
                                            </Input>
                                        </Col>
                                    </Row>
                                </FormGroup>
                                <FormGroup>
                                    <Row>
                                        <Col xs="3">
                                            * Delito:
                                        </Col>
                                        <Col xs="9">
                                            <Input
                                                type="text"
                                                name="excomunionDelito"
                                                value={this.state.formBajaBautizadoExcomunion.excomunionDelito}
                                                onChange={this.onChangeBajaBautizadoExcomunion}
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
                                                type="text"
                                                name="fechaExcomunion"
                                                placeholder='DD/MM/AAAA'
                                                value={this.state.formBajaBautizadoExcomunion.fechaExcomunion}
                                                onChange={this.onChangeBajaBautizadoExcomunion}
                                            />
                                        </Col>
                                    </Row>
                                </FormGroup>

                            </CardBody>
                            <CardFooter>
                                <Button
                                    type="button"
                                    onClick={this.openModalBajaBautizadoExcomunion}
                                    color="secondary"
                                    className="entreBotones"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    color="success"
                                /* onClick={this.invocaFormularioDePersona} */
                                >
                                    <span className="fa fa-pencil"></span>Proceder
                                </Button>
                            </CardFooter>
                        </Form>
                    </Card>
                </Modal>

                {/* MODAL BAJA/BAUTIZADO/DEFUNCION */}
                <Modal isOpen={this.state.modalBajaBautizadoDefuncion} size="lg">
                    <Card>
                        <Form onSubmit={this.bajaBautizadoDefuncion}>
                            <CardHeader>
                                <CardTitle><h3>Seleccione una persona.</h3></CardTitle>
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
                                                value={this.state.formBajaBautizadoDefuncion.personaSeleccionada}
                                                name="personaSeleccionada"
                                                onChange={this.onChangeBajaBautizadoDefuncion}
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
                                <FormGroup>
                                    <Row>
                                        <Col xs="3">
                                            Comentario:
                                        </Col>
                                        <Col xs="9">
                                            <Input
                                                type="text"
                                                name="comentarioDefuncion"
                                                value={this.state.formBajaBautizadoDefuncion.comentarioDefuncion}
                                                onChange={this.onChangeBajaBautizadoDefuncion}
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
                                                type="text"
                                                name="fechaDefuncion"
                                                placeholder='DD/MM/AAAA'
                                                value={this.state.formBajaBautizadoDefuncion.fechaDefuncion}
                                                onChange={this.onChangeBajaBautizadoDefuncion}
                                            />
                                        </Col>
                                    </Row>
                                </FormGroup>

                            </CardBody>
                            <CardFooter>
                                <Button
                                    type="button"
                                    onClick={this.openModalBajaBautizadoDefuncion}
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
                </Modal>

                {/* MODAL BAJA/NOBAUTIZADO/DEFUNCION */}
                <Modal isOpen={this.state.modalBajaNoBautizadoDefuncion} size="lg">
                    <Card>
                        <Form onSubmit={this.bajaNoBautizadoDefuncion}>
                            <CardHeader>
                                <CardTitle><h3>Baja de persona No Bautizada por defunción.</h3></CardTitle>
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
                                                value={this.state.formBajaNoBautizadoDefuncion.personaSeleccionada}
                                                name="personaSeleccionada"
                                                onChange={this.onChangeBajaNoBautizadoDefuncion}
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
                                <FormGroup>
                                    <Row>
                                        <Col xs="3">
                                            Comentario:
                                        </Col>
                                        <Col xs="9">
                                            <Input
                                                type="text"
                                                name="comentario"
                                                value={this.state.formBajaNoBautizadoDefuncion.comentario}
                                                onChange={this.onChangeBajaNoBautizadoDefuncion}
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
                                                value={this.state.formBajaNoBautizadoDefuncion.fechaTransaccion}
                                                onChange={this.onChangeBajaNoBautizadoDefuncion}
                                            />
                                        </Col>
                                    </Row>
                                </FormGroup>

                            </CardBody>
                            <CardFooter>
                                <Button
                                    type="button"
                                    onClick={this.openModalBajaNoBautizadoDefuncion}
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
                </Modal>

                {/* MODAL BAJA/NOBAUTIZADO/ALEJAMIENTO */}
                <Modal isOpen={this.state.modalBajaNoBautizadoAlejamiento} size="lg">
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
                </Modal>

                {/*Modal success*/}
                <Modal isOpen={this.state.modalShow}>
                    <ModalBody>
                        {this.state.mensajeDelProceso}
                    </ModalBody>
                </Modal>

                {/* End of Sidebar */}
            </React.Fragment>
        );
    }
}
export default Sidebar;