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
            modalBajaNoBautizadoDefuncion: false,
            modalBajaNoBautizadoAlejamiento: false,
            modalBajaNoBautizadoCambioDomicilio: false,
            modalEstableceVisibilidadAbierta: false,
            formBajaNoBautizadoDefuncion: {},
            formBajaNoBautizadoAlejamiento: {},
            formBajaNoBautizadoCambioDomicilio: {},
            formEstableceVisibilidadAbierta: {}
        }
    }

    componentDidMount() {
        this.setState({
            formBajaNoBautizadoDefuncion: {
                ...this.state.formBajaNoBautizadoDefuncion,
                personaSeleccionada: '0',
                comentario: '',
                fechaTransaccion: ''
            },
            formBajaNoBautizadoAlejamiento: {
                ...this.state.formBajaNoBautizadoAlejamiento,
                personaSeleccionada: '0',
                comentario: "",
                codigoTransaccion: '0',
                fechaTransaccion: ''
            },
            formBajaNoBautizadoCambioDomicilio: {
                ...this.state.formBajaNoBautizadoCambioDomicilio,
                idPersona: '0',
                tipoDestino: '0',
                fechaTransaccion: '',
                idUsuario: this.infoSesion.pem_Id_Ministro
            },
            formEstableceVisibilidadAbierta: {
                ...this.state.formEstableceVisibilidadAbierta,
                idPersona: '0',
                idUsuario: this.infoSesion.pem_Id_Ministro
            }
        });
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

    onChangeBajaNoBautizadoCambioDomicilio = (e) => {
        this.setState({
            formBajaNoBautizadoCambioDomicilio: {
                ...this.state.formBajaNoBautizadoCambioDomicilio,
                [e.target.name]: e.target.value.toUpperCase()
            }
        })
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
        this.handle_LinkEncabezado("Seccion: Movimientos estadísticos", "Edición de Persona Bautizada")
        localStorage.setItem("idPersona", this.state.personaSeleccionada);
        // console.log(localStorage.getItem("idPersona"));
        localStorage.setItem("nvaAltaBautizado", true);
        localStorage.setItem("nvaAltaComunion", true);
        document.location.href = '/RegistroDePersona';
    }

    invocaFormularioDePersonaNB = () => {
        this.handle_LinkEncabezado("Seccion: Movimientos estadísticos", "Edición de Persona NO Bautizada")
        localStorage.setItem("idPersona", this.state.personaSeleccionada);
        // console.log(localStorage.getItem("idPersona"));
        localStorage.setItem("nvaAltaBautizado", false);
        localStorage.setItem("nvaAltaComunion", false);
        document.location.href = '/RegistroDePersona';
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

    openModalBajaNoBautizadoCambioDomicilio = async () => {
        await helpers.authAxios.get(helpers.url_api + "/persona/GetNoBautizadosAlejamientoBySector/" + localStorage.getItem('sector'))
            .then(res => {
                this.setState({ personas: res.data.personas });
            });
        this.setState({ modalBajaNoBautizadoCambioDomicilio: !this.state.modalBajaNoBautizadoCambioDomicilio })
    }

    openModalVisibilidadAbierta = async () => {
        await helpers.authAxios.get(helpers.url_api + "/persona/GetVivoNoActivoBySector/" + localStorage.getItem('sector'))
            .then(res => {
                this.setState({ personas: res.data.personas });
            });
        this.setState({ modalEstableceVisibilidadAbierta: !this.state.modalEstableceVisibilidadAbierta })
    }

    // METODO PARA INVOCAR UN FORMULARIO DE PERSONA NUEVO
    handle_AltaPersonaBautizada = () => {
        this.handle_LinkEncabezado("Seccion: Movimientos estadísticos", "Alta de Persona Bautizada");
        localStorage.setItem("idPersona", "0");
        localStorage.setItem("nvaAltaBautizado", true);
        localStorage.setItem("nvaAltaComunion", true);
        document.location.href = "/RegistroDePersona";
    }

    handle_AltaRestitucion = () => {
        this.handle_LinkEncabezado("Seccion: Movimientos estadísticos", "Alta de Persona por Restitución");
        document.location.href = "/AltaRestitucion";
    }

    handle_AltaCambioDomicilio = () => {
        this.handle_LinkEncabezado("Seccion: Movimientos estadísticos", "Alta de Persona por Cambio de Domicilio");
        document.location.href = "/AltaCambioDomicilio";
    }

    handle_AltaPersonaNoBautizada = () => {
        this.handle_LinkEncabezado("Seccion: Movimientos estadísticos", "Alta de Persona NO Bautizada");
        localStorage.setItem("idPersona", "0");
        localStorage.setItem("nvaAltaBautizado", false);
        localStorage.setItem("nvaAltaComunion", false);
        document.location.href = "/RegistroDePersona";
    }

<<<<<<< HEAD
    handle_BajaBautizadoExcomunion = () => {
        this.handle_LinkEncabezado("Seccion: Movimientos estadísticos", "Baja por excomunion");
        document.location.href = "/BajaBautizadoExcomunion";
=======
    handle_Reactivacion = () => {
        this.handle_LinkEncabezado("Seccion: Movimientos estadísticos", "Alta de Persona por Reactivación");
        document.location.href = "/AltaReactivacion";
    }

    handle_AltaCambioDomicilioNB = () => {
        this.handle_LinkEncabezado("Seccion: Movimientos estadísticos", "Alta de Persona NO Bautizada por Cambio de Domicilio");
        document.location.href = "/AltaCambioDomicilioNB";
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
        try {
            await helpers.authAxios.post(
                helpers.url_api + "/Persona/BajaBautizadoExcomunion/" + datos.personaSeleccionada +
                "/" + datos.tipoExcomunion +
                "/" + datos.excomunionDelito +
                "/" + datos.fechaExcomunion +
                "/" + this.infoSesion.pem_Id_Ministro)
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
>>>>>>> origin/feature/bautizado-rest-cambioDomicilio
    }

    handle_BajaBautizadoCambioDomicilio = () => {
        this.handle_LinkEncabezado("Seccion: Movimientos estadísticos", "Baja de bautizado por cambio de domicilio");
        document.location.href = "/BajaBautizadoCambioDomicilio";
    }

    handle_BajaBautizadoDefuncion = () => {
        this.handle_LinkEncabezado("Seccion: Movimientos estadísticos", "Baja de bautizado por excomunion");
        document.location.href = "/BajaBautizadoDefuncion";
    }

    bajaNoBautizadoDefuncion = async (e) => {
        e.preventDefault();
        var datos = this.state.formBajaNoBautizadoDefuncion;

        if (datos.personaSeleccionada === '0'
            || datos.fechaTransaccion === '') {
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

    bajaNoBautizadoCambioDomicilio = async(e) => {
        e.preventDefault();
        if (this.state.formBajaNoBautizadoCambioDomicilio.per_Id_Persona === "0"
            || this.state.formBajaNoBautizadoCambioDomicilio.tipoDestino === "0"
            || this.state.formBajaNoBautizadoCambioDomicilio.fechaTransaccion === "") {
                alert ("Error:\nDebe ingresar todos los datos requeridos.")
            }
        try {
            await helpers.authAxios.post(`${helpers.url_api}/Persona/BajaPersonaCambioDomicilio`, this.state.formBajaNoBautizadoCambioDomicilio)
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
        }
        catch {
            alert("Error: Hubo un problema en la comunicacion con el servidor. Intente mas tarde.");
            // setTimeout(() => { document.location.href = '/ListaDePersonal'; }, 3000);
        }
    }

    estableceVisibilidadAbierta = async(e) => {
        e.preventDefault();
        try {
            await helpers.authAxios.post(`${helpers.url_api}/Historial_Transacciones_Estadisticas/CambiarVisibilidad/${this.state.formEstableceVisibilidadAbierta.idPersona}/${this.state.formEstableceVisibilidadAbierta.idUsuario}`)
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
        }
        catch {
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
                            <span>Anális de Membresía</span>
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
                                        <Link className="collapse-item" to="#" onClick={this.handle_AltaPersonaBautizada}>Bautismo</Link>
                                        <Link className="collapse-item" to="#" onClick={this.handle_AltaRestitucion}>Restitución</Link>
                                        <Link className="collapse-item" to="#" onClick={this.handle_AltaCambioDomicilio}>Cambio de Domicilio</Link>
                                    </div>
                                </div>

                                {/* <Link className="collapse-item" to="#">Cambio de domicilio</Link> */}
                                <Link className="collapse-item" to="#" data-toggle="collapse" data-target="#collapseAltaNoBautizado" aria-expanded="true" aria-controls="collapseNoBautizado">
                                    Personal No Bautizado
                                </Link>
                                <div id="collapseAltaNoBautizado" className="collapse" aria-labelledby="headingnoBautizado" data-parent="#collapseMPAltas">
                                    <div className="bg-white py-2 collapse-inner rounded">
                                        <Link className="collapse-item" to="#" onClick={this.handle_AltaPersonaNoBautizada}>Nuevo Ingreso</Link>
                                        <Link className="collapse-item" to="#" onClick={this.handle_Reactivacion}>Reativación</Link>
                                        <Link className="collapse-item" to="#" onClick={this.handle_AltaCambioDomicilioNB}>Cambio de Domicilio</Link>
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
                                            onClick={this.handle_BajaBautizadoDefuncion}
                                        >Defunción</Link>
                                        <Link
                                            className="collapse-item"
                                            to="#"
                                            onClick={this.handle_BajaBautizadoExcomunion}
                                        >Excomunión</Link>
                                        <Link 
                                            className="collapse-item" 
                                            to="#"
                                            onClick={this.handle_BajaBautizadoCambioDomicilio}
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
                                        <Link
                                            className="collapse-item" 
                                            to="#"
                                            onClick={this.openModalBajaNoBautizadoCambioDomicilio}
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
                            onClick={()=>this.handle_LinkEncabezado('Sucesos Estadisticos', 'Matrimonio / Legalización')}
                        >
                            <i className="fas fa-fw fa-user-friends"></i>
                            <span>Matrimonio / Legalización</span>
                        </Link>
                    </li>

                    {/* Nav Item - Presentaciones  */}
                    <li className="nav-item">
                        <Link className="nav-link" 
                            to="/PresentacionDeNino"
                            onClick={()=>this.handle_LinkEncabezado('Sucesos Estádisticos', 'Presentación de niños')}
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
                            onClick={()=>this.handle_LinkEncabezado('Hogares', 'Edición de dirección.')}>
                            <i className="fas fa-address-book"></i>
                            <span>Edición de Dirección</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link 
                            className="nav-link text-wrap" 
                            to="/RevinculaDomicilio"
                            onClick={()=>this.handle_LinkEncabezado('Hogares', 'Revinculación persona-hogar.')}
                        >
                            <i className="fas fa-house-user"></i>
                            <span>Revinculación Persona-Hogar</span>
                        </Link>
                    </li>

                    {/* Heading */}
                    <div className="sidebar-heading">
                        Transacciones Especiales
                    </div>

                    {/* Nav Item - Hogares  */}
                    <li className="nav-item">
                        <Link 
                            className="nav-link" 
                            to="#"
                            onClick={this.openModalVisibilidadAbierta}
                        >
                            <i className="fas fa-address-book"></i>
                            <span>Habilitar Visibilidad Abierta</span>
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
                                <Link className="collapse-item text-wrap" to="/ResumenMembresia">Reporte de Membresía Actual</Link>
                                <Link className="collapse-item text-wrap" to="/ReportePersonalBautizado">Lista de Personal Bautizado</Link>
                                <Link className="collapse-item text-wrap" to="/ReportePersonalNoBautizado">Lista de Personal No Bautizado</Link>
                                <Link className="collapse-item text-wrap" to="/RptListaDeHogares">Lista de hogares</Link>
                                <Link className="collapse-item text-wrap" to="/ReporteOficiosProfesiones">Lista por Profesiones/Oficios</Link>
                                <Link className="collapse-item text-wrap" to="/ReporteCumpleaños">Lista por Fecha de Cumpleaños</Link>
                                <Link className="collapse-item text-wrap" to="/ReporteMovimientoEstadistico">Reporte de Movimiento Estadístico</Link>
                                <Link className="collapse-item text-wrap" to="/ReporteTransacciones">Reporte de Transacciones</Link>
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
                            <span>Membresía a Excel</span>
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
                            <CardTitle><h3>Seleccione la Persona a Editar.</h3></CardTitle>
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
                                onClick={this.invocaFormularioDePersonaNB}
                            >
                                <span className="fa fa-pencil"></span>Editar
                            </Button>
                        </CardFooter>
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
                </Modal>

                {/* MODAL BAJA/NO BAUTIZADO/CAMBIODOMICILIO */}
                <Modal isOpen={this.state.modalBajaNoBautizadoCambioDomicilio} size="lg">
                    <Card>
                        <Form onSubmit={this.bajaNoBautizadoCambioDomicilio}>
                            <CardHeader>
                                <CardTitle><h3>Baja de persona NO Bautizada por Cambio de Domicilio.</h3></CardTitle>
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
                                                value={this.state.formBajaNoBautizadoCambioDomicilio.idPersona}
                                                name="idPersona"
                                                onChange={this.onChangeBajaNoBautizadoCambioDomicilio}
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
                                            * Tipo destino:
                                        </Col>
                                        <Col xs="9">
                                            <Input
                                                type="select"
                                                name="tipoDestino"
                                                value={this.state.formBajaNoBautizadoCambioDomicilio.tipoDestino}
                                                onChange={this.onChangeBajaNoBautizadoCambioDomicilio}
                                            >
                                                <option value="0">Seleccione una opción</option>
                                                <option value="INTERNO">INTERNO</option>
                                                <option value="EXTERNO">EXTERNO</option>
                                            </Input>
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
                                                value={this.state.formBajaNoBautizadoCambioDomicilio.fechaTransaccion}
                                                onChange={this.onChangeBajaNoBautizadoCambioDomicilio}
                                            />
                                        </Col>
                                    </Row>
                                </FormGroup>

                            </CardBody>
                            <CardFooter>
                                <Button
                                    type="button"
                                    onClick={this.openModalBajaNoBautizadoCambioDomicilio}
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
                                                value={this.state.formEstableceVisibilidadAbierta.idPersona}
                                                name="idPersona"
                                                onChange={this.onChangeEstableceVisibilidadAbierta}
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
            </React.Fragment>
        );
    }
}
export default Sidebar;