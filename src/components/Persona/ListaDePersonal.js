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
        modalOpen: false
    };

    modal = (persona) => {
        this.setState({
            modalOpen: !this.state.modalOpen
        });
        console.log(persona);
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

    RenderBtnRegistro = () => {
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
            </React.Fragment>
        );
    }

    InfoAdicional = () => {
        return (
            alert("Disponible proximamente.")
        );
    }

    InfoStatus = (persona) => {
        var bautizado = "";
        var activo = "";
        var vivo = "";

        bautizado = persona.per_Bautizado === true ? "Bautizado" : "No bautizado";
        activo = persona.per_Activo === true ? "Activo" : "No activo";
        vivo = persona.per_Vivo === true ? "Vivo" : "Finado";

        return (
            <React.Fragment>
                {bautizado} , {activo} , {vivo}
            </React.Fragment>
        );
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
                    {this.RenderBtnRegistro()}
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
                                            <td className="text-center">
                                                {this.InfoStatus(persona)}
                                            </td>
                                            <td className="text-center">
                                                {/* persona.per_Telefono_Fijo} , {persona.per_Telefono_Movil} , {persona.per_Email_Personal */}
                                                <a href="#" onClick={this.modal} className="fas fa-info-circle fa-2x icon-btn-p" title="Info general" ></a>
                                                <a href="#" onClick={this.InfoAdicional} className="fas fa-users fa-2x icon-btn-p" title="Familia asendente"></a>
                                                <a href="#" onClick={this.InfoAdicional} className="fas fa-baby-carriage fa-2x icon-btn-p" title="Estado civil"></a>
                                                <a href="#" onClick={this.InfoAdicional} className="fas fa-user-check fa-2x icon-btn-p" title="Ecelsiasticos"></a>
                                                <a href="#" onClick={this.InfoAdicional} className="fas fa-home fa-2x icon-btn-p" title="Hogar"></a>
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

                    <Modal isOpen={this.state.modalOpen} className="modalStyle">
                        <div className="card border-info">
                            <div className="card-header text-center">
                                <h5><strong>Datos generales</strong></h5>
                            </div>
                            <div className="card-body p-3">
                                Estos son los datos generales de la persona. <br />
                            </div>
                            <button className="btn btn-sm btn-secondary" onClick={this.modal}>Cerrar</button>
                        </div>
                    </Modal>

                </React.Fragment>
            );
        } else if (this.state.personas.length === 0 && this.state.status === 'success') {
            return (
                <React.Fragment>
                    {this.RenderBtnRegistro}
                    <h3>Aun no hay personas registras!</h3>
                    <p>Haga clic en el boton Registrar persona para registrar una persona.</p>
                </React.Fragment>
            );
        } else {
            return (
                <React.Fragment>
                    {this.RenderBtnRegistro}
                    <h3>Cargando información...</h3>
                    <p>Por favor espere.</p>
                </React.Fragment>
            );
        }
    };
}

export default ListaDePersonal;