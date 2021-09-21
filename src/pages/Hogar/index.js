import React, { Component } from 'react';
import {
    Container, Row, Col, Card, CardHeader,
    CardBody, CardFooter, Form, Input, Label,
    Button, FormFeedback, Table
} from 'reactstrap';
import axios from 'axios';
import Layout from '../Layout';
import helpers from '../../components/Helpers';
import PaisEstado from '../../components/PaisEstado';

class Hogar extends Component {

    constructor(props) {
        super(props);
        this.url_api = helpers.url_api;
        this.infoSesion = JSON.parse(localStorage.getItem("infoSesion"));
        this.state = {
            listaDeHogares: [],
            domicilio: {},
            currentDomicio: {},
            hd_Id_Domicilio: 0,
            bolHdIdDomicilioSelected: false,
            infoDistrito: {},
            infoSector: {},
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
                pais_Id_Pais: "0",
                est_Id_Estado: "0",
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

    handle_onChange = (e) => {
        this.setState({
            domicilio: {
                ...this.state.domicilio,
                [e.target.name]: e.target.value
            }
        })
    }

    handle_hd_Id_Domicilio = (idHD) => {
        console.log(idHD.target.value);
    }

    handle_EditaHogar = (info) => {
        console.log(info);
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
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Jefe de hogar</th>
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
                                                <React.Fragment>
                                                    <tr key={hogar.hd_Id_Domicilio}>
                                                        <td> {hogar.per_Nombre} {hogar.per_Apellido_Paterno} {hogar.per_Apellido_Materno}</td>
                                                        <td> 
                                                            {hogar.hd_Calle} {hogar.hd_Numero_Exterior} {hogar.hd_Numero_Exterior} <br />
                                                            {hogar.hd_Tipo_Subdivision} {hogar.hd_Subdivision}
                                                        </td>
                                                        <td> {hogar.hd_Telefono} </td>
                                                        <td> {this.state.infoSector.sec_Alias} </td>
                                                        <td> <Button color="success" onClick={() => this.handle_EditaHogar(hogar)}>Editar</Button> </td>
                                                    </tr>
                                                </React.Fragment>
                                            )
                                        })
                                    }
                                </tbody>
                            </Table>
                        </Row>
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