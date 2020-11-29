import React, { Component } from 'react';
import axios from 'axios';
import Global from '../../Global';
import '../../assets/css/Persona.css';
import Modal from 'react-modal';

class ListaDePersonal extends Component {

    url = Global.url_api;

    state = {
        personas: [],
        status: null,
        sector: {},
        distrito: {},
        modalOpen: false,
        showModalPersonaGenerales: false,
        showModalPersonaFamiliaAsendente: false,
        showModalPersonaEclesiasticos: false,
        showModalPersonaEstadoCivil: false,
        showModalPersonaHogar: false,
        currentPersona: {},
        currentProfesion1: {},
        currentProfesion2: {}
    };

    modalPersonaGenerales = (persona) => {
        this.setState({
            modalOpen: !this.state.modalOpen
        });
        console.log(persona);
    }

    openModalPersonaFamiliaAsendente = async (persona) => {
        await this.setState({
            showModalPersonaFamiliaAsendente: true,
            currentPersona: persona
        });
    }

    closeModalPersonaFamiliaAsendente = () => {
        this.setState({ showModalPersonaFamiliaAsendente: false })
    }

    modalPersonaEstadoCivil = (persona) => {
        this.setState({
            modalOpen: !this.state.modalOpen
        });
        console.log(persona);
    }

    modalPersonaEclesiasticos = (persona) => {
        this.setState({
            modalOpen: !this.state.modalOpen
        });
        console.log(persona);
    }

    openModalPersonaHogar = async (persona) => {
        let pro1;
        let pro2;

        if (await this.getProfesion1(persona.per_Id_Persona)) {
            pro1 = await this.getProfesion1(persona.per_Id_Persona);
        } else {
            pro1 = [
                {
                    pro_Definicion_Profesion_Oficio: "Sin informacion",
                    pro_Desc_Profesion_Oficio: "Sin Informacion"
                }
            ]
        }
        if (await this.getProfesion2(persona.per_Id_Persona)) {
            pro2 = await this.getProfesion2(persona.per_Id_Persona);
        } else {
            pro2 = [
                {
                    pro_Definicion_Profesion_Oficio: "Sin informacion",
                    pro_Desc_Profesion_Oficio: "Sin Informacion"
                }
            ]
        }
        await this.setState({
            showModalPersonaHogar: true,
            currentPersona: persona
        });
        await this.setState({
            currentProfesion1: pro1[0],
            currentProfesion2: pro2[0]
        });
    }

    getProfesion1 = async (persona) => {
        return await axios.get(this.url + "/persona/GetProfesion1/" + persona)
            .then(res => res.data)
            .catch(error => error);
    }

    getProfesion2 = async (persona) => {
        return await axios.get(this.url + "/persona/GetProfesion2/" + persona)
            .then(res => res.data)
            .catch(error => error);
        /* .then(res => {
            this.setState({
                currentProfesion2: res.data
            });
        }); */
    }

    closeModalPersonaHogar = () => {
        this.setState({ showModalPersonaHogar: false })
    }

    componentWillMount() {
        this.getPersonas();
        this.getDistrito();
        this.getSector();
    };

    getPersonas = () => {
        axios.get(this.url + "/persona")
            .then(res => {
                this.setState({
                    personas: res.data,
                    status: 'success'
                });
            });
    };

    InfoAdicional = () => {
        return (
            alert("Disponible proximamente.")
        );
    }

    InfoStatus = (persona) => {
        let bautizado = persona.per_Bautizado === true ? "Bautizado" : "No bautizado";
        let activo = persona.per_Activo === true ? "Activo" : "No activo";
        let vivo = persona.per_Vivo === true ? "Vivo" : "Finado";

        let infoStatus = {
            bautizado,
            activo,
            vivo
        }
        // console.log(infoStatus);
        return infoStatus;
    }

    getDistrito = () => {
        axios.get(this.url + "/distrito/42")
            .then(res => {
                this.setState({
                    distrito: res.data,
                    status: 'success'
                });
            });
    }

    getSector = () => {
        axios.get(this.url + "/sector/227")
            .then(res => {
                this.setState({
                    sector: res.data,
                    status: 'success'
                });
            });
    }

    render() {
        if (this.state.personas.length >= 1) {
            return (
                <React.Fragment>
                    <h1 className="text-info">Listado de personal</h1>
                    <div className="row">
                        <div className="col-9">
                            <p>
                                Personal del distrito {this.state.distrito.dis_Numero} ({this.state.distrito.dis_Localidad}),
                                sector {this.state.sector.sec_Numero} ({this.state.sector.sec_Localidad})
                            </p>
                        </div>
                        <div className="col-2">
                            <a href="/RegistroDePersonal" className="btn bnt-sm btn-primary">Registrar persona</a>
                        </div>
                    </div>
                    <br />
                    <table className="table" id="tblPersonas">
                        <thead>
                            <tr>
                                <th scope="col">Nombre</th>
                                <th scope="col" className="text-center">Status</th>
                                <th scope="col" className="text-center">Informacion</th>
                                <th scope="col" className="text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.personas.map((persona, i) => {
                                    return (
                                        <tr key={i}>
                                            <td>{persona.per_Nombre} {persona.per_Apellido_Paterno} {persona.per_Apellido_Materno} </td>
                                            {
                                                <td className="text-center">
                                                    {this.InfoStatus(persona).bautizado} , {this.InfoStatus(persona).activo} , {this.InfoStatus(persona).vivo}
                                                </td>
                                            }
                                            <td className="text-center">
                                                <button onClick={() => this.openModalPersonaHogar(persona)} className="bordeRedondo">
                                                    <span className="fas fa-info-circle fa-lg" title="Info general"></span>
                                                </button>
                                                <button onClick={() => this.openModalPersonaFamiliaAsendente(persona)} className="bordeRedondo">
                                                    <span className="fas fa-users fa-lg" title="Familia asendente"></span>
                                                </button>
                                                <button onClick={this.modalPersonaEstadoCivil} className="bordeRedondo">
                                                    <span className="fas fa-baby-carriage fa-lg" title="Estado civil"></span>
                                                </button>
                                                <button onClick={this.modalPersonaEclesiasticos} className="bordeRedondo">
                                                    <span className="fas fa-user-check fa-lg" title="Ecelsiasticos"></span>
                                                </button>
                                                <button onClick={this.modalPersonaHogar} className="bordeRedondo">
                                                    <span className="fas fa-home fa-lg" title="Hogar"></span>
                                                </button>
                                            </td>
                                            <td className="text-center">
                                                <button onClick={this.InfoAdicional} className="btn btn-success btn-sm" title="Editar informacion"><span className="fas fa-pencil-alt"></span>Editar</button>
                                                <button onClick={this.InfoAdicional} className="btn btn-danger btn-sm" title="Eliminar persona"><span className="fas fa-trash-alt"></span>Eliminar</button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>

                    <Modal
                        isOpen={this.state.showModalPersonaHogar}
                        className="modalStyle"
                        onRequestClose={this.closeModalPersonaHogar}
                    >
                        <div className="card border-info">
                            <div className="card-header text-center">
                                <h5><strong>Datos generales</strong></h5>
                            </div>

                            <div className="card-body p-3">
                                <div className="row">
                                    <div className="col-3">
                                        <img src="./images/logo_signin.png" alt="Acceso a listado de personal" className="mx-auto card-img-top imgHome" />
                                    </div>
                                    <div className="col">
                                        <strong>Nombre:</strong> {this.state.currentPersona.per_Nombre} {this.state.currentPersona.per_Apellido_Paterno} {this.state.currentPersona.per_ApellidoMaterno} <br />
                                        <strong>Telefono:</strong> {this.state.currentPersona.per_Telefono_Fijo} <br />
                                        <strong>Celular:</strong> {this.state.currentPersona.per_Telefono_Movil} <br />
                                        <strong>Email:</strong> {this.state.currentPersona.per_Email_Personal}
                                        <hr />
                                        <strong>Descripcion oficio 1:</strong> {this.state.currentProfesion1.pro_Desc_Profesion_Oficio}
                                        ( {this.state.currentProfesion1.pro_Definicion_Profesion_Oficio} ) <br />
                                        <strong>Descripcion oficio 2:</strong> {this.state.currentProfesion2.pro_Desc_Profesion_Oficio}
                                        ( {this.state.currentProfesion2.pro_Definicion_Profesion_Oficio} )
                                    </div>
                                </div>
                            </div>
                            <button className="btn btn-sm btn-secondary" onClick={this.closeModalPersonaHogar}>Cerrar</button>
                        </div>
                    </Modal>

                    <Modal
                        isOpen={this.state.showModalPersonaFamiliaAsendente}
                        className="modalStyle"
                        onRequestClose={this.closeModalPersonaFamiliaAsendente}
                    >
                        <div className="card border-info">
                            <div className="card-header text-center">
                                <h5><strong>Familia asendente</strong></h5>
                            </div>
                            <div className="card-body p-3">
                                <strong>Padre:</strong> {this.state.currentPersona.per_Nombre_Padre} <br />
                                <strong>Madre:</strong> {this.state.currentPersona.per_Nombre_Madre} <br />
                                <strong>Abuelo paterno:</strong> {this.state.currentPersona.per_Nombre_Abuelo_Paterno} <br />
                                <strong>Abuela paterna:</strong> {this.state.currentPersona.per_Nombre_Abuela_Materna} <br />
                                <strong>Abuelo materno:</strong> {this.state.currentPersona.per_Nombre_Abuelo_Materno} <br />
                                <strong>Abuela materna:</strong> {this.state.currentPersona.per_Nombre_Abuela_Materna} <br />
                            </div>
                            <button className="btn btn-sm btn-secondary" onClick={this.closeModalPersonaFamiliaAsendente}>Cerrar</button>
                        </div>
                    </Modal>

                </React.Fragment>
            );
        } else if (this.state.personas.length === 0 && this.state.status === 'success') {
            return (
                <React.Fragment>
                    <h3>Aun no hay personas registras!</h3>
                    <p>Haga clic en el boton Registrar persona para registrar una persona.</p>
                </React.Fragment>
            );
        } else {
            return (
                <React.Fragment>
                    <h3>Cargando información...</h3>
                    <p>Por favor espere.</p>
                </React.Fragment>
            );
        }
    };
}

export default ListaDePersonal;