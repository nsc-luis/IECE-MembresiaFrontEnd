import React, { Component } from 'react';
import {
    Container, Row, Col, Card, CardHeader,
    CardBody, CardFooter, Form, Input, Label,
    Button, FormFeedback, Table, FormGroup,
    Modal, ModalFooter, ModalBody, ModalHeader
} from 'reactstrap';
import axios from 'axios';
import helpers from '../../components/Helpers';
import Layout from '../Layout';
import './style.css';

class FrmMatrimonioLegalizacion extends Component {

    url = helpers.url_api;
    fechaNoIngresada = "01/01/1900";

    constructor(props) {
        super(props);
        this.state = {
            matLegal: {},
            bolMatrimonio: true,
            hombres: [],
            mujeres: []
        }
        this.sec_Id_Sector = JSON.parse(localStorage.getItem('infoSesion')).sec_Id_Sector;
    }

    getHombres = async (str) => {
        if (str === "Matrimonio") {
            await helpers.authAxios.get(this.url + "/Matrimonio_Legalizacion/GetHombresPorSectorParaMatrimonio/" + this.sec_Id_Sector)
                .then(res => {
                    this.setState({
                        hombres: res.data.hombresParaMatrimonio
                    })
                })
        }
        else {
            await helpers.authAxios.get(this.url + "/Matrimonio_Legalizacion/GetHombresPorSectorParaLegalizacion/" + this.sec_Id_Sector)
                .then(res => {
                    this.setState({
                        hombres: res.data.hombresParaLegalizacion
                    })
                })
        }
    }

    getMujeres = async (str) => {
        if (str === "Matrimonio") {
            await helpers.authAxios.get(this.url + "/Matrimonio_Legalizacion/GetMujeresPorSectorParaMatrimonio/" + this.sec_Id_Sector)
                .then(res => {
                    this.setState({
                        mujeres: res.data.mujeresParaMatrimonio
                    })
                })
        }
        else {
            await helpers.authAxios.get(this.url + "/Matrimonio_Legalizacion/GetMujeresPorSectorParaLegalizacion/" + this.sec_Id_Sector)
                .then(res => {
                    this.setState({
                        mujeres: res.data.mujeresParaLegalizacion
                    })
                })
        }
    }

    onChange = (e) => {
        if (e.target.name === "mat_Tipo_Enlace") {
            switch (e.target.value) {
                case "0":
                    this.setState({
                        hombres: [],
                        mujeres: []
                    });
                    break;
                case "Legalizacion":
                    //this.setState({ bolMatrimonio: false });
                    this.getHombres(e.target.value);
                    this.getMujeres(e.target.value);
                    break;
                default:
                    //this.setState({ bolMatrimonio: true });
                    this.getHombres(e.target.value);
                    this.getMujeres(e.target.value);
                    break;
            }

        }
    }

    render() {
        const {
            handle_CancelaCaptura
        } = this.props

        const handle_Submit = (e) => {
            e.preventDefault();
        }

        return (
            <Container>
                <Row>
                    <Col xs="12">
                        <Form onSubmit={handle_Submit}>
                            <Card>
                                <CardHeader>
                                    <h5><strong>Registro de Matrimonios y legalizaciones.</strong></h5>
                                </CardHeader>
                                <CardBody>
                                    <FormGroup>
                                        <Row>
                                            <Col xs="2">
                                                <Label><strong>Elige una opcion: *</strong></Label>
                                            </Col>
                                            <Col xs="4">
                                                <Input type="select"
                                                    name="mat_Tipo_Enlace"
                                                    onChange={this.onChange}
                                                >
                                                    <option value="0">Selecionar categoria</option>
                                                    <option value="Matrimonio">Matrimonio</option>
                                                    <option value="Legalizacion">Legalización</option>
                                                </Input>
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                    <Row>
                                        <Col xs="6">
                                            <Card>
                                                <CardHeader>
                                                    Contrayente hombre
                                                </CardHeader>
                                                <CardBody>
                                                    <FormGroup>
                                                        <Row>
                                                            <Col xs="3">
                                                                <Label>Foraneo:</Label>
                                                            </Col>
                                                            <Col xs="1">
                                                                <Input
                                                                    type="checkbox"
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Row>
                                                            <Col xs="3">
                                                                <Label><strong>Hombre: *</strong></Label>
                                                            </Col>
                                                            <Col xs="9">
                                                                <Input type="select"
                                                                    name="mat_per_Id_Persona_Hombre"
                                                                    onChange={this.onChange}
                                                                >
                                                                    <option value="0">Seleccionar hombre</option>
                                                                    {
                                                                        this.state.hombres.map((hombre) => {
                                                                            return (
                                                                                <option key={hombre.per_Id_Persona} value={hombre.per_Id_Persona}> {hombre.per_Nombre} {hombre.per_Apellido_Paterno} {hombre.per_Apellido_Materno} </option>
                                                                            )
                                                                        })
                                                                    }
                                                                </Input>
                                                            </Col>
                                                        </Row>
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Row>
                                                            <Col xs="3">
                                                                <Label><strong>Nombre: *</strong></Label>
                                                            </Col>
                                                            <Col xs="9">
                                                                <Input
                                                                    name="mat_Nombre_Contrayente_Hombre_Foraneo"
                                                                    type="text"
                                                                    onChange={this.onChange}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </FormGroup>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                        <Col xs="6">
                                            <Card>
                                                <CardHeader>
                                                    Contrayente mujer
                                                </CardHeader>
                                                <CardBody>
                                                    <FormGroup>
                                                        <Row>
                                                            <Col xs="3">
                                                                <Label>Foraneo:</Label>
                                                            </Col>
                                                            <Col xs="1">
                                                                <Input
                                                                    type="checkbox"
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Row>
                                                            <Col xs="3">
                                                                <Label><strong>Mujer: *</strong></Label>
                                                            </Col>
                                                            <Col xs="9">
                                                                <Input type="select"
                                                                    name="mat_per_Id_Persona_Mujer"
                                                                    onChange={this.onChange}
                                                                >
                                                                    <option value="0">Seleccionar mujer</option>
                                                                    {
                                                                        this.state.mujeres.map((mujer) => {
                                                                            return (
                                                                                <option key={mujer.per_Id_Persona} value={mujer.per_Id_Persona}> {mujer.per_Nombre} {mujer.per_Apellido_Paterno} {mujer.per_Apellido_Materno} </option>
                                                                            )
                                                                        })
                                                                    }
                                                                </Input>
                                                            </Col>
                                                        </Row>
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Row>
                                                            <Col xs="3">
                                                                <Label><strong>Nombre: *</strong></Label>
                                                            </Col>
                                                            <Col xs="9">
                                                                <Input
                                                                    name="mat_Nombre_Contrayente_Mujer_Foraneo"
                                                                    onChange={this.onChange}
                                                                    type="text"
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </FormGroup>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                </CardBody>
                                <CardFooter>
                                    <Button
                                        type="button"
                                        onClick={handle_CancelaCaptura}
                                        className="btnCancelarCaptura"
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        color="primary"
                                    >
                                        <span className="fas fa-save icon-btn-p"></span>Guardar
                                    </Button>
                                </CardFooter>
                            </Card>
                        </Form>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default FrmMatrimonioLegalizacion;