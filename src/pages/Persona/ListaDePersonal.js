import React, { Component } from 'react';
import axios from 'axios';
import Global from '../../Global';
import '../../assets/css/Persona.css';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import Layout from '../Layout';

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
        currentProfesion2: {},
        MiembrosDelHogar: [],
        DatosHogarDomicilio: {},
        CasadoDivorciadoViudo: false,
        ConcubinadoSolteroConHijos: false,
        soltero: false
    };

    componentDidMount() {
        console.log(localStorage.getItem('token'));
    }

    openModalPersonaGenerales = async (persona) => {
        let pro1;
        let pro2;

        if (await this.getProfesion1(persona.per_Id_Persona)) {
            pro1 = await this.getProfesion1(persona.per_Id_Persona);
        } else {
            pro1 = [
                {
                    pro_Categoria: "Sin informacion",
                    pro_Sub_Categoria: "Sin Informacion"
                }
            ]
        }
        if (await this.getProfesion2(persona.per_Id_Persona)) {
            pro2 = await this.getProfesion2(persona.per_Id_Persona);
        } else {
            pro2 = [
                {
                    pro_Categoria: "Sin informacion",
                    pro_Sub_Categoria: "Sin Informacion"
                }
            ]
        }
        await this.setState({
            showModalPersonaGenerales: true,
            currentPersona: persona
        });
        await this.setState({
            currentProfesion1: pro1[0],
            currentProfesion2: pro2[0]
        });
    }
    closeModalPersonaGenerales = () => {
        this.setState({ showModalPersonaGenerales: false });
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

    openModalPersonaEstadoCivil = (persona) => {

        console.log(persona.per_Estado_Civil);

        switch (persona.per_Estado_Civil) {
            case 'CASADO(A)':
                this.setState({
                    CasadoDivorciadoViudo: true,
                    ConcubinadoSolteroConHijos: false,
                    soltero: false
                });
                break;
            case 'DIVORCIADO(A)':
                this.setState({
                    CasadoDivorciadoViudo: true,
                    ConcubinadoSolteroConHijos: false,
                    soltero: false
                });
                break;
            case 'VIUDO(A)':
                this.setState({
                    CasadoDivorciadoViudo: true,
                    ConcubinadoSolteroConHijos: false,
                    soltero: false
                });
                break;
            case 'CONCUBINATO':
                this.setState({
                    CasadoDivorciadoViudo: false,
                    ConcubinadoSolteroConHijos: true,
                    soltero: false
                });
                break;
            case 'SOLTERO(A) CON HIJOS':
                this.setState({
                    CasadoDivorciadoViudo: false,
                    ConcubinadoSolteroConHijos: true,
                    soltero: false
                });
                break;
            default:
                this.setState({
                    CasadoDivorciadoViudo: false,
                    ConcubinadoSolteroConHijos: false,
                    soltero: true
                });
                break;
        }

        this.setState({
            showModalPersonaEstadoCivil: true,
            currentPersona: persona
        });
        console.log(persona);
    }
    closeModalPersonaEstadoCivil = () => {
        this.setState({ showModalPersonaEstadoCivil: false })
    }

    openModalPersonaEclesiasticos = (persona) => {
        this.setState({
            showModalPersonaEclesiasticos: true,
            currentPersona: persona
        });
        console.log(persona);
    }
    closeModalPersonaEclesiasticos = () => {
        this.setState({ showModalPersonaEclesiasticos: false })
    }

    openModalPersonaHogar = async (persona) => {

        let getHogar = await axios.get(this.url + "/Hogar_Persona/GetHogarByPersona/" + persona.per_Id_Persona)
            .then(res => res.data);

        await axios.get(this.url + "/Hogar_Persona/GetMiembros/" + getHogar.hd_Id_Hogar)
            .then(res => {
                this.setState({
                    MiembrosDelHogar: res.data
                });
            });
        await axios.get(this.url + "/Hogar_Persona/GetDatosHogarDomicilio/" + getHogar.hd_Id_Hogar)
            .then(res => {
                this.setState({
                    DatosHogarDomicilio: res.data,
                    showModalPersonaHogar: true
                });
            });
        console.log(this.state.DatosHogarDomicilio);
        console.log(this.state.SelectHogarId);
    }
    closeModalPersonaHogar = () => {
        this.setState({ showModalPersonaHogar: false });
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

    componentWillMount() {
        this.getPersonas();
        //  this.getDistrito();
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

    fnEliminaPersona = async (persona) => {
        await axios.delete(this.url + "/persona/" + persona.per_Id_Persona)
            .then(res => res.data)
            .catch(error => error);
            window.location.reload();
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

    /* getDistrito = () => {
        axios.get(this.url + "/distrito/42")
            .then(res => {
                this.setState({
                    distrito: res.data,
                    status: 'success'
                });
            });
    } */

    getSector = () => {
        axios.get(this.url + "/sector/227")
            .then(res => {
                this.setState({
                    sector: res.data[0],
                    status: 'success'
                });
            });
    }

    render() {
        if (this.state.personas.length >= 1) {
            return (
                <Layout>
                <React.Fragment>
                    <h1 className="text-info">Listado de personal</h1>
                    <div className="row">
                        <div className="col-9">
                            <p>
                                Personal del {this.state.sector.dis_Tipo_Distrito} {this.state.sector.dis_Numero} ({this.state.sector.dis_Alias}, {this.state.sector.dis_Area}) <br />
                                {this.state.sector.sec_Tipo_Sector} {this.state.sector.sec_Numero}: {this.state.sector.sec_Alias}
                            </p>
                        </div>
                        <div className="col-2">
                            <Link to="/RegistroDePersona" className="btn bnt-sm btn-primary">Registrar persona</Link>
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
                                this.state.personas.map((persona) => {
                                    return (
                                        <tr key={persona.per_Id_Persona}>
                                            <td>{persona.per_Nombre} {persona.per_Apellido_Paterno} {persona.per_Apellido_Materno} </td>
                                            {
                                                <td className="text-center">
                                                    {this.InfoStatus(persona).bautizado} , {this.InfoStatus(persona).activo} , {this.InfoStatus(persona).vivo}
                                                </td>
                                            }
                                            <td className="text-center">
                                                <button onClick={() => this.openModalPersonaGenerales(persona)} className="bordeRedondo">
                                                    <span className="fas fa-info-circle fa-lg" title="Info general"></span>
                                                </button>
                                                <button onClick={() => this.openModalPersonaFamiliaAsendente(persona)} className="bordeRedondo">
                                                    <span className="fas fa-users fa-lg" title="Familia asendente"></span>
                                                </button>
                                                <button onClick={() => this.openModalPersonaEstadoCivil(persona)} className="bordeRedondo">
                                                    <span className="fas fa-baby-carriage fa-lg" title="Estado civil"></span>
                                                </button>
                                                <button onClick={() => this.openModalPersonaEclesiasticos(persona)} className="bordeRedondo">
                                                    <span className="fas fa-user-check fa-lg" title="Ecelsiasticos"></span>
                                                </button>
                                                <button onClick={() => this.openModalPersonaHogar(persona)} className="bordeRedondo">
                                                    <span className="fas fa-home fa-lg" title="Hogar"></span>
                                                </button>
                                            </td>
                                            <td className="text-center">
                                                <button onClick={this.InfoAdicional} className="btn btn-success btn-sm" title="Editar informacion"><span className="fas fa-pencil-alt"></span>Editar</button>
                                                <button onClick={() => this.fnEliminaPersona(persona)} className="btn btn-danger btn-sm" title="Eliminar persona"><span className="fas fa-trash-alt"></span>Eliminar</button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>

                    <Modal // Datos generales
                        isOpen={this.state.showModalPersonaGenerales}
                        className="modalStyle"
                        onRequestClose={this.closeModalPersonaGenerales}
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
                                        <strong>Email:</strong> {this.state.currentPersona.per_Email_Personal} <br />
                                        <strong>Fecha nacimiento:</strong> {this.state.currentPersona.per_Fecha_Nacimiento}
                                        <hr />
                                        <strong>Descripcion oficio 1:</strong> {this.state.currentProfesion1.pro_Sub_Categoria}
                                        ( {this.state.currentProfesion1.pro_Categoria} ) <br />
                                        <strong>Descripcion oficio 2:</strong> {this.state.currentProfesion2.pro_Sub_Categoria}
                                        ( {this.state.currentProfesion2.pro_Categoria} )
                                    </div>
                                </div>
                            </div>
                            <button className="btn btn-sm btn-secondary" onClick={this.closeModalPersonaGenerales}>Cerrar</button>
                        </div>
                    </Modal>

                    <Modal // Familia asendente
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

                    <Modal // Estado civil
                        isOpen={this.state.showModalPersonaEstadoCivil}
                        className="modalStyle"
                        onRequestClose={this.closeModalPersonaEstadoCivil}
                    >
                        <div className="card border-info">
                            <div className="card-header text-center">
                                <h5><strong>Datos de estado civil</strong></h5>
                            </div>
                            <div className="card-body p-3">
                                {this.state.CasadoDivorciadoViudo &&
                                    <React.Fragment>
                                        <strong>Estado civil:</strong> {this.state.currentPersona.per_Estado_Civil} <br />
                                        <strong>Conyuge:</strong> {this.state.currentPersona.per_Nombre_Conyuge} <br />
                                        <strong>Fecha boda civil:</strong> {this.state.currentPersona.per_Fecha_Boda_Civil} <br />
                                        <strong>Registro boda civil:</strong> {this.state.currentPersona.per_Registro_Civil} <br />
                                        <strong>Oficialia boda civil:</strong> {this.state.currentPersona.per_Oficialia_Boda_Civil} <br />
                                        <strong>Libro boda civil:</strong> {this.state.currentPersona.per_Libro_Acta_Boda_Civil} <br />
                                        <strong>Acta boda civil:</strong> {this.state.currentPersona.per_Num_Acta_Boda_Civil} <br />
                                        <strong>Cantidad de hijos:</strong> {this.state.currentPersona.per_Cantidad_Hijos} <br />
                                        <strong>Nombre de hijos:</strong> {this.state.currentPersona.per_Nombre_Hijos}

                                        {this.state.currentPersona.per_Bautizado &&
                                            <React.Fragment>
                                                <hr />
                                                <strong>Fecha boda eclesiastica:</strong> {this.state.currentPersona.per_Fecha_Boda_Eclesiastica} <br />
                                                <strong>Lugar boda eclesiastica:</strong> {this.state.currentPersona.per_Lugar_Boda_Eclesiastica}
                                            </React.Fragment>
                                        }
                                    </React.Fragment>
                                }
                                {this.state.ConcubinadoSolteroConHijos &&
                                    <React.Fragment>
                                        <strong>Estado civil:</strong> {this.state.currentPersona.per_Estado_Civil} <br />
                                        <strong>Numero de hijos:</strong> {this.state.currentPersona.per_Nombre_Hijos} <br />
                                        <strong>Cantidad de hijos:</strong> {this.state.currentPersona.per_Cantidad_Hijos}
                                    </React.Fragment>
                                }
                                {this.state.soltero &&
                                    <React.Fragment>
                                        <strong>Estado civil:</strong> {this.state.currentPersona.per_Estado_Civil}
                                    </React.Fragment>
                                }

                            </div>
                            <button className="btn btn-sm btn-secondary" onClick={this.closeModalPersonaEstadoCivil}>Cerrar</button>
                        </div>
                    </Modal>

                    <Modal // Datos eclesiasticos
                        isOpen={this.state.showModalPersonaEclesiasticos}
                        className="modalStyle"
                        onRequestClose={this.closeModalPersonaEclesiasticos}
                    >
                        <div className="card border-info">
                            <div className="card-header text-center">
                                <h5><strong>Datos eclesiasticos</strong></h5>
                            </div>
                            <div className="card-body p-3">
                                <strong>Bautizado: </strong>{this.state.currentPersona.per_Bautizado ? 'SI' : 'NO'} <br />
                                {this.state.currentPersona.per_Bautizado &&
                                    <React.Fragment>
                                        <strong>Lugar bautismo:</strong> {this.state.currentPersona.per_Lugar_Bautismo} <br />
                                        <strong>Ministro que bautizo:</strong> {this.state.currentPersona.per_Ministro_Que_Bautizo} <br />
                                        <strong>Fecha bautismo:</strong> {this.state.currentPersona.per_Fecha_Bautismo}
                                    </React.Fragment>
                                }
                                <br />
                                <hr />
                                <strong>Bajo imposicion de manos:</strong> {this.state.currentPersona.per_Bajo_Imposicion_De_Manos} <br />
                                <strong>Fecha recibe promesa:</strong> {this.state.currentPersona.per_Fecha_Recibio_Espiritu_Santo}
                                <hr />
                                <strong>Cambios de domicilio:</strong> {this.state.currentPersona.per_Cambios_De_Domicilio} <br />
                            </div>
                            <button className="btn btn-sm btn-secondary" onClick={this.closeModalPersonaEclesiasticos}>Cerrar</button>
                        </div>
                    </Modal>

                    <Modal // Datos del hogar
                        isOpen={this.state.showModalPersonaHogar}
                        className="modalStyle"
                        onRequestClose={this.closeModalPersonaHogar}
                    >
                        <div className="card border-info">
                            <div className="card-header text-center">
                                <h5><strong>Datos del hogar</strong></h5>
                            </div>
                            <div className="card-body p-3">
                                {this.state.showModalPersonaHogar &&
                                    this.state.DatosHogarDomicilio.map((HogarDomicilio, i) => {
                                        return (
                                            <p key={i}>
                                                {HogarDomicilio.hd_Calle} {HogarDomicilio.hd_Numero_Exterior}, {HogarDomicilio.hd_Numero_Interior} <br />
                                                            Tipo subdivision: {HogarDomicilio.hd_Tipo_Subdivision}, Subdivision: {HogarDomicilio.hd_Subdivision} <br />
                                                {HogarDomicilio.hd_Localidad}, {HogarDomicilio.hd_Municipio_Cuidad} <br />
                                                {HogarDomicilio.est_Nombre}, {HogarDomicilio.pais_Nombre_Corto} <br />
                                                            Telefono: {HogarDomicilio.hd_Telefono}
                                            </p>
                                        )
                                    })
                                }
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Miembros del hogar</th>
                                            <th scope="col">Jerarquia</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.showModalPersonaHogar &&
                                            this.state.MiembrosDelHogar.map((miembro, i) => {
                                                return (
                                                    <tr key={i}>
                                                        <td>{miembro.per_Nombre} {miembro.per_Apellido_Paterno} {miembro.per_Apellido_Materno}</td>
                                                        <td>{miembro.hp_Jerarquia}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <button className="btn btn-sm btn-secondary" onClick={this.closeModalPersonaHogar}>Cerrar</button>
                        </div>
                    </Modal>
                </React.Fragment>
                </Layout>
            );
        } else if (this.state.personas.length === 0 && this.state.status === 'success') {
            return (
                <Layout>
                <React.Fragment>
                    <h3>Aun no hay personas registras!</h3>
                    <p>Haga clic en el boton Registrar persona para registrar una persona.</p>
                </React.Fragment>
                </Layout>
            );
        } else {
            return (
                <Layout>
                <React.Fragment>
                    <h3>Cargando información...</h3>
                    <p>Por favor espere.</p>
                </React.Fragment>
                </Layout>
            );
        }
    };
}

export default ListaDePersonal;