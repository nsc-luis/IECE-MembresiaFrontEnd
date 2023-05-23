import React, { Component } from 'react';
import helpers from "../../components/Helpers";
import {
    Container, Button, Input, Modal, ModalBody, Label, Alert, CardFooter,
    CardTitle, Card, CardBody, Table, Row, Col, FormFeedback, Form, FormGroup, CardHeader
} from 'reactstrap';
import { Link } from 'react-router-dom';
import './style.css';

export default class Auxiliares extends Component {

    infoSesion = JSON.parse(localStorage.getItem('infoSesion'));
    constructor(props) {
        super(props);
        this.state = {
            infoNvoAuxiliar: {
                per_Id_Persona: "0",
                /* comentario: "",
                fecha: null */
            },
            personas: [],
            auxiliares: []
        }
    }
    componentDidMount() {
        this.getAuxiliaresPorSector();
        this.getPersonasParaAuxiliarBySector();
        //Sube el cursor hasta la parte superior
        window.scrollTo(0, 0);
    }
    onChange = (e) => {
        this.setState({
            infoNvoAuxiliar: {
                ...this.state.infoNvoAuxiliar,
                [e.target.name]: e.target.value
            }
        })
    }
    getAuxiliaresPorSector = async () => {
        await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/PersonalMinisterial/GetAuxiliaresBySector2/${localStorage.getItem('sector')}`)
            .then(res => {
                if (res.data.status === "success")
                    this.setState({ auxiliares: res.data.auxiliares })
                else {
                    alert("Error:\nNo se pudo consultar la lista de auxiliares, favor de reportar o intentar mas tarde.")
                }
            })
        )
    }
    getPersonasParaAuxiliarBySector = async () => {
        await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/Persona/GetPersonasParaAuxiliarBySector/${localStorage.getItem('sector')}`)
            .then(res => {
                if (res.data.status === "success")
                    this.setState({ personas: res.data.personas })
                else {
                    alert("Error:\nNo se pudo consultar la lista de personas, favor de reportar o intentar mas tarde.")
                }
            })
        )
    }
    AltaAuxiliar = async (e) => {
        e.preventDefault();
        await helpers.validaToken().then(helpers.authAxios.post(`${helpers.url_api}/PersonalMinisterial/AltaAuxiliarEnSector`, this.state.infoNvoAuxiliar)
            .then(res => {
                if (res.data.status === "success") {
                    window.location.reload()
                }
                else {
                    alert("Error:\nNo se pudo guardar el registro del nuevo auxiliar, favor de reportar o intentar mas tarde.")
                }
            })
        )
    }
    BajaDeAuxiliar = async (info) => {
        await helpers.validaToken().then(helpers.authAxios.post(`${helpers.url_api}/PersonalMinisterial/BajaAuxiliarEnSector/${info.pem_Id_Ministro}`)
            .then(res => {
                if (res.data.status === "success") {
                    window.location.reload()
                }
                else {
                    alert("Error:\nNo se pudo borrar el registro del auxiliar, favor de reportar o intentar mas tarde.")
                }
            })
        )
    }

    render() {
        return (
            <Container>
                <Card>
                    <Form onSubmit={this.AltaAuxiliar}>
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
                                            onChange={this.onChange}
                                            name="per_Id_Persona"
                                            value={this.state.infoNvoAuxiliar.per_Id_Persona}
                                            invalid={this.state.perIdPersonaInvalida}
                                        >
                                            <option value="0">Seleccione una persona</option>
                                            {this.state.personas.map((persona) => {
                                                return (
                                                    <React.Fragment key={persona.per_Id_Persona}>
                                                        <option value={persona.per_Id_Persona}>{persona.per_Nombre} {persona.per_Apellido_Paterno} {persona.per_Apellido_Materno}</option>
                                                    </React.Fragment>
                                                )
                                            })
                                            }
                                        </Input>
                                        <FormFeedback>Este campo es requerido</FormFeedback>
                                    </Col>
                                </Row>
                            </FormGroup>

                            {/* <FormGroup>
                                <Row>
                                    <Col xs="3">
                                        Comentario (opcional):
                                    </Col>
                                    <Col xs="9">
                                        <Input
                                            type="text"
                                            onChange={this.onChange}
                                            name="comentario"
                                            value={this.state.infoNvoAuxiliar.comentario}
                                        />
                                    </Col>
                                </Row>
                            </FormGroup>

                            <FormGroup>
                                <Row>
                                    <Col xs="3">
                                        * Fecha de transacción:
                                    </Col>
                                    <Col xs="3">
                                        <Input
                                            type="date"
                                            name="fecha"
                                            placeholder='DD/MM/AAAA'
                                            onChange={this.onChange}
                                            value={this.state.infoNvoAuxiliar.fecha}
                                            invalid={this.state.fechaInvalida}
                                        />
                                        <FormFeedback>Este campo es requerido</FormFeedback>
                                    </Col>
                                </Row>
                            </FormGroup> */}
                        </CardBody>
                        <CardFooter>
                            <Link
                                to="/ListaDePersonal"
                            >
                                <Button type="button" color="secondary" className="entreBotones">
                                    Cancelar
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                color="success"
                            >
                                <span className="fa fa-user-tie faIconMarginRight"></span>Alta como auxiliar
                            </Button>
                        </CardFooter>
                    </Form>
                </Card>
                <Table>
                    <thead>
                        <tr>
                            <th>NOMBRE</th>
                            <th>ACTIVO</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.auxiliares.map((auxiliar) => {
                            return (
                                <tr key={auxiliar.pem_Id_Ministro}>
                                    <td>{auxiliar.pem_Nombre}</td>
                                    <td>{auxiliar.pem_Activo ? "Activo" : "Inactivo"}</td>
                                    <td>
                                        <Button
                                            type="button"
                                            color="danger"
                                            onClick={() => this.BajaDeAuxiliar(auxiliar)}
                                        >
                                            <span className="fas fa-user-alt-slash faIconMarginRight"></span>
                                            Baja
                                        </Button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </Container>
        )
    }
}