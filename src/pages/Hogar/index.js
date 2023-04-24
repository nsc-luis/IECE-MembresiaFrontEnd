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
/* import './style.css'; */
import DomicilioJeraquia from './DomicilioJerarquia';
import IECELogo from '../../assets/images/IECE_logo.png';

class Hogar extends Component {

    constructor(props) {
        super(props);
        this.url_api = helpers.url_api;
        this.infoSesion = JSON.parse(localStorage.getItem("infoSesion"));
        this.state = {
            listaDeHogares: [],
            domicilio: {},
            hd_Id_Domicilio: 0,
            bolHdIdDomicilioSelected: false,
            infoDistrito: {},
            infoSector: {},
            mensajeDelProceso: "",
            modalShow: false
        }
    }

    componentDidMount() {
        this.setState({
            domicilio: {
                ...this.state.domicilio,
                hd_Calle: "",
                hd_Numero_Exterior: "",
                hd_Numero_Interior: "",
                hd_Tipo_Subdivision: "COL",
                hd_Subdivision: "",
                hd_Localidad: "",
                hd_Municipio_Ciudad: "",
                pais_Id_Pais: 0,
                est_Id_Estado: 0,
                hd_Telefono: "",
                /* dis_Id_Distrito,
                sec_Id_Sector */
            },
        })
        this.getListaHogares();
        this.getInfoDistrito();
        this.getInfoSector();
    }

    getListaHogares = () => {
        helpers.validaToken().then(helpers.authAxios.get(this.url_api + "/HogarDomicilio/GetBySector/" + this.infoSesion.sec_Id_Sector)
            .then(res => {
                this.setState({ listaDeHogares: res.data.domicilios });
            })
        )
    }

    getInfoDistrito = () => {
        axios.get(this.url_api + "/Distrito/" + this.infoSesion.dis_Id_Distrito)
            .then(res => {
                this.setState({ infoDistrito: res.data });
            })
    }

    getInfoSector = () => {
        axios.get(this.url_api + "/Sector/" + this.infoSesion.sec_Id_Sector)
            .then(res => {
                this.setState({ infoSector: res.data[0] });
            })
    }

    onChangeDomicilio = (e) => {
        this.setState({
            domicilio: {
                ...this.state.domicilio,
                [e.target.name]: e.target.value.toUpperCase()
            }
        })
    }

    handle_hd_Id_Domicilio = (idHD) => {
        console.log(idHD.target.value);
    }

    handle_EditaHogar = async (info) => {
        await helpers.validaToken().then(helpers.authAxios.get(this.url_api + "/HogarDomicilio/" + info)
            .then(res => {
                this.setState({
                    domicilio: res.data,
                    modalInfoHogar: true
                });
            })
        );
    }

    modalInfoHogarClose = () => {
        this.setState({
            domicilio: {},
            modalInfoHogar: false
        });
    }

    handle_guardarDomicilio = async (info) => {
        await helpers.validaToken().then(helpers.authAxios.put(this.url_api + "/HogarDomicilio/" + info.hd_Id_Hogar, info)
            .then(res => {
                if (res.data.status === "success") {
                    // alert(res.data.mensaje);
                    setTimeout(() => { document.location.href = '/Hogar'; }, 3000);
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
                        document.location.href = '/Hogar'
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

    render() {
        if (this.state.listaDeHogares.length >= 0) {
            return (
                <Layout>
                    <Container>
                        <Row>
                            <h1 className="text-info">Listado de hogares</h1>
                        </Row>
                        <Row>
                            Pertenecientes al distrito {this.state.infoDistrito.dis_Numero} - {this.state.infoDistrito.dis_Alias}, sector {this.state.infoSector.sec_Numero} - {this.state.infoSector.sec_Alias}
                        </Row>
                        <Row>
                            <Table className="tblListaHogares">
                                <thead>
                                    <tr>
                                        <th>Repesentante del hogar</th>
                                        <th>Direccion</th>
                                        <th>Telefono</th>
                                        <th>Sector</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.listaDeHogares.map((hogar) => {
                                            return (
                                                <React.Fragment key={hogar.hd_Id_Hogar}>
                                                    <tr>
                                                        <td> {hogar.per_Nombre} {hogar.per_Apellido_Paterno} {hogar.per_Apellido_Materno}</td>
                                                        <td>
                                                            {hogar.hd_Calle} {hogar.hd_Numero_Exterior} {hogar.hd_Numero_Interior} <br />
                                                            {hogar.hd_Tipo_Subdivision} {hogar.hd_Subdivision}
                                                        </td>
                                                        <td> {hogar.hd_Telefono} </td>
                                                        <td> {this.state.infoSector.sec_Alias} </td>
                                                        <td>
                                                            <Button
                                                                color="success"
                                                                size="sm"
                                                                onClick={() => this.handle_EditaHogar(hogar.hd_Id_Hogar)}>
                                                                <span className="fas fa-pencil-alt icon-btn-p"></span>Editar
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                </React.Fragment>
                                            )
                                        })
                                    }
                                </tbody>
                            </Table>
                        </Row>
                        <Modal isOpen={this.state.modalInfoHogar} size="lg">
                            <ModalHeader>
                                Editar información del hogar.
                            </ModalHeader>
                            <ModalBody>
                                <DomicilioJeraquia
                                    onChangeDomicilio={this.onChangeDomicilio}
                                    domicilio={this.state.domicilio}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="secondary"
                                    size="sm"
                                    onClick={this.modalInfoHogarClose}>
                                    Cancelar
                                </Button>
                                <Button
                                    color="primary"
                                    size="sm"
                                    onClick={() => this.handle_guardarDomicilio(this.state.domicilio)}>
                                    <span className="fas fa-save icon-btn-p"></span>Guardar
                                </Button>
                            </ModalFooter>
                        </Modal>
                    </Container>
                </Layout>
            )
        } else if (this.state.listaDeHogares.length == 0 && this.state.status === 'success') {
            return (
                <Layout>
                    <React.Fragment>
                        <h3>Aun no hay hogares registros!</h3>
                        <p>Los hogares son agregados desde el registro de personal.</p>
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
    }
}

export default Hogar;