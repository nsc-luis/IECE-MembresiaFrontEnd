import React, { Component } from 'react';
import Layout from '../../Layout';
import helpers from '../../../components/Helpers';
import {
    Container, Row, Col, Card, CardHeader,
    CardBody, CardFooter, Form, Input, Label,
    Button, FormFeedback, Table,
    Modal, ModalFooter, ModalBody, ModalHeader
} from 'reactstrap';
import axios from 'axios';
import IECELogo from '../../../assets/images/IECE_logo.png';
import './style.css';

class RptListaDeHogares extends Component {

    constructor(props) {
        super(props);
        this.url_api = helpers.url_api;
        this.infoSesion = JSON.parse(localStorage.getItem("infoSesion"));
        this.state = {
            listaDeHogares: [],
            infoDistrito: {},
            infoSector: {}
        }
    }

    componentDidMount() {
        this.getListaHogares();
        this.getInfoDistrito();
        this.getInfoSector();
    }

    getListaHogares = () => {
        helpers.authAxios.get(this.url_api + "/HogarDomicilio/GetBySector/" + this.infoSesion.sec_Id_Sector)
            .then(res => {
                this.setState({ listaDeHogares: res.data.domicilios });
            })
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
                            <Button
                                color="danger"
                                size="sm" onClick={() => helpers.ToPDF("infoListaHogares")}>
                                <span className="fas fa-file-pdf icon-btn-p"></span>Crear PDF
                            </Button>
                        </Row>
                        <div id="infoListaHogares">
                            <Row>
                                <Table className="tblListaHogares">
                                    <thead>
                                        <tr>
                                            <th>Titular</th>
                                            <th>Nacimiento</th>
                                            <th>Edad</th>
                                            <th>Celular</th>
                                            <th>Tel. Casa</th>
                                            <th>Domicilio</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.listaDeHogares.map((hogar) => {
                                                return (
                                                    <React.Fragment>
                                                        <tr>
                                                            <td> {hogar.per_Nombre} {hogar.per_Apellido_Paterno} {hogar.per_Apellido_Materno}</td>
                                                            <td>Fecha</td>
                                                            <td>Edad</td>
                                                            <td> {hogar.hd_Telefono} </td>
                                                            <td> {hogar.hd_Telefono} </td>
                                                            <td>
                                                                {hogar.hd_Calle} {hogar.hd_Numero_Exterior} {hogar.hd_Numero_Interior} <br />
                                                                {hogar.hd_Tipo_Subdivision} {hogar.hd_Subdivision}
                                                            </td>
                                                        </tr>
                                                    </React.Fragment>
                                                )
                                            })
                                        }
                                    </tbody>
                                </Table>
                            </Row>
                        </div>
                    </Container>
                </Layout>
            )
        } else if (this.state.listaDeHogares.length === 0 && this.state.status === 'success') {
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

export default RptListaDeHogares;