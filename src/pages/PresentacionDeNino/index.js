import React, { Component } from 'react';
import {
    Container, Row, Col, Card, CardHeader,
    CardBody, CardFooter, Form, Input, Label,
    Button, FormFeedback, Table,
    Modal, ModalFooter, ModalBody, ModalHeader
} from 'reactstrap';
import axios from 'axios';
import helpers from '../../components/Helpers';
import Layout from '../Layout';
import './style.css';
import '../../assets/css/index.css';

class PresentacionDeNino extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listaDePresentaciones: [],
            listaDeNinos: [],
            status: false,
            modalEliminaPresentacion: false,
            modalEditaPresentacion: false,
            currentPresentacion: {}
        }
        this.infoSesion = JSON.parse(localStorage.getItem('infoSesion'));
    }

    componentDidMount() {
        this.getListaDePresentaciones();
        this.getListaDeNinos();
    }

    getListaDePresentaciones = async () => {
        await helpers.authAxios.get(helpers.url_api + "/Presentacion_Nino/GetBySector/" + this.infoSesion.sec_Id_Sector)
            .then(res => {
                this.setState({
                    listaDePresentaciones: res.data.presentaciones,
                    status: res.data.status
                })
            })
    }

    getListaDeNinos = async () => {
        await helpers.authAxios.get(helpers.url_api + "/Persona/GetListaNinosBySector/" + this.infoSesion.sec_Id_Sector)
            .then(res => {
                this.setState({
                    listaDeNinos: res.data.listaDeNinos,
                    status: res.data.status
                })
            })
    }

    handle_modalEliminaPresentacion = (info) => {
        console.log(info)
        this.setState({
            currentPresentacion: info,
            modalEliminaPresentacion: true
        })
    }
    handle_modalEliminaPresentacionClose = () => {
        this.setState({
            modalEliminaPresentacion: false,
            currentPresentacion: {}
        })
    }

    handle_modalEditaPresentacion = (info) => {
        console.log(info)
        this.setState({
            currentPresentacion: info,
            modalEditaPresentacion: true
        })
    }
    handle_modalEditaPresentacionClose = () => {
        this.setState({
            modalEditaPresentacion: false,
            currentPresentacion: {}
        })
    }

    render() {
        if (this.state.listaDePresentaciones.length >= 1) {
            return (
                <Layout>
                    <Container>
                        <Row>
                            <h1 className="text-info">Presentaciones de niños</h1>
                        </Row>
                        <Row>
                            <Button color="primary" size="sm">
                                Registrar nueva presentacion
                            </Button>
                        </Row>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Nombre del niño(a)</th>
                                    <th>Ministro que oficio</th>
                                    <th>Fecha</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.listaDePresentaciones.map((presentacion) => {
                                        return (
                                            <React.Fragment>
                                                <tr>
                                                    <td> {presentacion.per_Nombre} {presentacion.per_ApellidoPaterno} {presentacion.per_ApellidoMaterno} </td>
                                                    <td> {presentacion.pdn_Ministro_Oficiante} </td>
                                                    <td> {presentacion.pdn_Fecha_Presentacion} </td>
                                                    <td>
                                                        <Button
                                                            color="success"
                                                            size="sm"
                                                            onClick={() => this.handle_modalEditaPresentacion(presentacion)}>
                                                            <span className="fas fa-pencil-alt icon-btn-p"></span>Editar
                                                        </Button>
                                                        <Button
                                                            color="danger"
                                                            size="sm"
                                                            onClick={() => this.handle_modalEliminaPresentacion(presentacion)}>
                                                            <span className="fas fa-trash-alt icon-btn-p"></span>Eliminar
                                                        </Button>
                                                    </td>
                                                </tr>
                                            </React.Fragment>
                                        )
                                    })
                                }
                            </tbody>
                        </Table>
                        <Modal isOpen={this.state.modalEliminaPresentacion}>
                            <ModalHeader>
                                <Row>
                                    Eliminar registro de presentacion.
                                </Row>
                            </ModalHeader>
                            <ModalBody>
                                ¿Esta seguro que desea eliminar el registro de la presentación del niño(a): <br />
                                <strong> {this.state.currentPresentacion.per_Nombre} {this.state.currentPresentacion.per_Apellido_Paterno} {this.state.currentPresentacion.per_Apellido_Materno}</strong>?
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="secondary"
                                    onClick={this.handle_modalEliminaPresentacionClose}
                                    size="sm">Cancelar</Button>
                                <Button
                                    color="primary"
                                    size="sm">
                                    <span className="fas fa-save icon-btn-p"></span>Guardar
                                </Button>
                            </ModalFooter>
                        </Modal>
                        <Modal isOpen={this.state.modalEditaPresentacion} size="lg">
                            <ModalHeader>
                                Editar registro de presentacion
                            </ModalHeader>
                            <ModalBody>
                                <Row>
                                    <Label>Niño(a):</Label>
                                </Row>
                                <Row>
                                    <select>
                                        <option value="0">Selecciona un registro</option>
                                        {
                                            this.state.listaDeNinos.map(nino => {
                                                return (
                                                    <React.Fragment>
                                                        <option value={nino.per_Id_Persona}> {nino.per_Nombre} {nino.per_Apellido_Paterno} {nino.per_Apellido_Materno} </option>
                                                    </React.Fragment>
                                                )
                                            })
                                        }
                                    </select>
                                </Row>
                                <Row>
                                    <Label>Ministro oficiante:</Label>
                                    <Input 
                                        type="text"
                                        value={this.state.currentPresentacion.pdn_Ministro_Oficiante}
                                    />
                                </Row>
                                <Row>
                                    <Label>Fecha de presentacion:</Label>
                                    <Input 
                                        type="text"
                                        value={this.state.currentPresentacion.pdn_Fecha_Presentacion}
                                    />
                                </Row>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="secondary"
                                    onClick={this.handle_modalEditaPresentacionClose}
                                    size="sm">Cancelar</Button>
                                <Button
                                    color="primary"
                                    size="sm">
                                    <span className="fas fa-save icon-btn-p"></span>Guardar
                                </Button>
                            </ModalFooter>
                        </Modal>
                    </Container>
                </Layout>
            )
        }
        else if (this.state.listaDePresentaciones.length === 0 && this.state.status === 'success') {
            return (
                <Layout>
                    <Container>
                        <Row>
                            <h1 className="text-info">Presentaciones de niños</h1>
                        </Row>
                        <Row>
                            <Button color="primary" size="sm">
                                Registrar nueva presentacion
                            </Button>
                        </Row>
                        <h3>Aun no hay presentacion de niños registrados!</h3>
                        <p>Haga clic en el boton Registrar para registrar una nueva presentacion de niño.</p>
                    </Container>
                </Layout >
            )
        }
        else {
            return (
                <Layout>
                    <React.Fragment>
                        <h3>Cargando información...</h3>
                        <p>Por favor espere.</p>
                    </React.Fragment>
                </Layout>
            )
        }
    }
}

export default PresentacionDeNino;