import React, { Component } from 'react';
import {
    Form, FormGroup, Input, Row, Col,
    Container, Card, CardBody, Alert, Button
} from 'reactstrap'
import './style.css'
import helpers from '../../components/Helpers'

class Login extends Component {

    url = helpers.url_api;
    infoSesion = JSON.parse(localStorage.getItem('infoSesion'));

    constructor(props) {
        super(props);
        this.state = {
            distritoSeleccionado: "0",
            listaDistritosPorMinistro: [],
            listaSectoresPorDistrito: [],
            sectorSeleccionado: "0"
        }
    }

    componentDidMount() {
        this.getListaDistritosPorMinistro();
    }

    onChangeMinistro = (e) => {
        console.log(e.target.value);
        if (e.target.value !== "0") {
            this.getListaDistritosPorMinistro(e.target.value);
            this.setState({
                ministroSeleccionado: e.target.value,
                distritoSeleccionado: "0",
                sectorSeleccionado: "0"
            });
        } else {
            this.setState({
                ministroSeleccionado: "0",
                distritoSeleccionado: "0",
                sectorSeleccionado: "0"
            })
        }
    }

    getListaDistritosPorMinistro = async () => {
        await helpers.authAxios.get(this.url + '/PersonalMinisterial/GetAlcancePastoralByMinistro/' + this.infoSesion.mu_pem_Id_Pastor)
            .then(res => {
                // console.log(res.data.datos);
                this.setState({ listaDistritosPorMinistro: res.data.datos });
            });
    }

    getListaSectoresPorDistrito = async (idDistrito) => {
        await helpers.authAxios.get(this.url + '/Sector/GetSectoresByDistrito/' + idDistrito)
            .then(res => {
                this.setState({ listaSectoresPorDistrito: res.data.sectores });
            });
    }

    onChangeDistrito = (e) => {
        // console.log(e.target.value);
        this.setState({ distritoSeleccionado: e.target.value });
        this.getListaSectoresPorDistrito(e.target.value);
    }

    onChangeSector = (e) => {
        // console.log(e.target.value);
        this.setState({ sectorSeleccionado: e.target.value });
    }

    handleLogoff = () => {
        localStorage.clear();
        document.location.href = '/';
    }

    iniciarSesion = (e) => {
        e.preventDefault();
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col sm="12">
                        <Card className="margen">
                            <CardBody>
                                <Form onSubmit={this.iniciarSesion}>
                                    {this.state.listaDistritosPorMinistro.length > 0 &&
                                        <React.Fragment>
                                        <Alert color="warning" className="alertLogin">
                                            <strong>Aviso: </strong> <br />
                                            <ul>
                                                <li>Si el usuario (ministro) es <strong>obispo</strong>: 
                                                    <ul>
                                                        <li>Podra iniciar sesión seleccionando tan solo el distrito: en cuyo caso vera la información que correspone a los sectores del distrito.</li>
                                                        <li>Si selecciona el sector ademas del distrito: vera solo la información que corresponde al sector.</li>
                                                    </ul>
                                                </li>
                                                <li>Si el usuario (ministro) es <strong>pastor</strong>: debera seleccionar distrito y sector para poder iniciar sesión.</li>
                                            </ul>
                                        </Alert>
                                        <FormGroup>
                                            <Row>
                                                <Col sm="2">
                                                    Distrito:
                                                </Col>
                                                <Col sm="4">
                                                    <Input
                                                        type="select"
                                                        name="listaDistritos"
                                                        value={this.state.distritoSeleccionado}
                                                        onChange={this.onChangeDistrito}
                                                    >
                                                        <option value="0">Selecciona un distrito</option>
                                                        {
                                                            this.state.listaDistritosPorMinistro.map(distrito => {
                                                                return (
                                                                    <React.Fragment key={distrito.dis_Id_Distrito}>
                                                                        <option value={distrito.dis_Id_Distrito}>{distrito.dis_Tipo_Distrito} {distrito.dis_Numero}: {distrito.dis_Alias}</option>
                                                                    </React.Fragment>
                                                                )
                                                            })
                                                        }
                                                    </Input>
                                                </Col>
                                            </Row>
                                        </FormGroup>
                                        </React.Fragment>
                                    }
                                    {this.state.distritoSeleccionado !== "0" &&
                                        <FormGroup>
                                            <Row>
                                                <Col sm="2">
                                                    Sector:
                                                </Col>
                                                <Col sm="4">
                                                    <Input
                                                        type="select"
                                                        name="listaSectores"
                                                        value={this.state.sectorSeleccionado}
                                                        onChange={this.onChangeSector}
                                                    >
                                                        <option value="0">Selecciona un sector</option>
                                                        {
                                                            this.state.listaSectoresPorDistrito.map(sector => {
                                                                return (
                                                                    <React.Fragment key={sector.sec_Id_Sector}>
                                                                        <option value={sector.sec_Id_Sector}>{sector.sec_Alias}</option>
                                                                    </React.Fragment>
                                                                )
                                                            })
                                                        }
                                                    </Input>
                                                </Col>
                                            </Row>
                                        </FormGroup>
                                    }
                                    <FormGroup>
                                        <Row>
                                            <Col sm="8"></Col>
                                            <Col sm="4">
                                                <Button
                                                    type="button"
                                                    className="btnForm"
                                                    onClick={this.handleLogoff}
                                                >
                                                    Cancelar
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    color="primary"
                                                >
                                                    <span className="fa fa-user faIconButton"></span>
                                                    Iniciar sesión
                                                </Button>
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Login;