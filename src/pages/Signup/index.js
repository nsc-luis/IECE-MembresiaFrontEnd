import React, { Component } from 'react';
import {
    Form, FormGroup, Input, Button, Row, Col, FormFeedback, Alert,
    Container, Card, CardHeader, CardBody, CardTitle, CardFooter
} from 'reactstrap'
import helpers from '../../components/Helpers';
import "./style.css"

class Signup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            confirmacion: "",
            claveFase1: "",
            claveFase2: "",
            fase1Invalida: false,
            mesajeFase1Invalida: "",
            fase2Invalida: false,
            mesajeFase2Invalida: ""
        }
    }

    handle_onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    verificaFase1 = async (e) => {
        e.preventDefault();
        await helpers.authAxios.get(helpers.url_api + "/Usuario/VerificaEmail/" + this.state.email + "/" + this.state.claveFase1)
            .then(res => {
                if (res.data.status === "success") {
                    console.log("ok");
                    this.setState({
                        fase1Invalida: false,
                        mesajeFase1Invalida: ""
                    });
                }
                else {
                    console.log("email y/o clave incorrectos.")
                    this.setState({
                        fase1Invalida: true,
                        mesajeFase1Invalida: "Error: " + res.data.mensaje
                    });
                }
            });
    }

    cancelarRegistro = () => {
        document.location.href = '/';
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col sm="2"></Col>
                    <Col sm="8">
                        <Card className="tarjetaDeRegitro">
                            <Form onSubmit={this.verificaFase1}>
                                <CardHeader className="center">
                                    <CardTitle className="txtNegrita txtEncabezadoTarjeta">Registro de usuarios</CardTitle>
                                    Fase 1
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col sm="12">
                                            <Alert color="warning">
                                                <span className="txtNegrita">Instrucciones:</span>
                                                <ul>
                                                    <li><span className="txtSubrayado">Fase 1</span>
                                                        <ul>
                                                            <li>
                                                                Email: debe ser un correo registrado en la base de datos; si su correo no esta registrado contacte al personal de soporte técnico.
                                                            </li>
                                                            <li>
                                                                Clave fase 1: esta clave es proporcionada por el personal de soporte técnico y sirve para verificar si el Email ingresado esta registrado en la base de datos.
                                                            </li>
                                                        </ul>
                                                    </li>
                                                    <li><span className="txtSubrayado">Fase 2</span>
                                                        <ul>
                                                            <li>
                                                                Contraseña: debe ingresar una contraseña y confirmarla.
                                                            </li>
                                                            <li>
                                                                Clave fase 2: esta clave es proporcionada por el personal de soporte técnico y sirve para realizar el alta del definitiva del usuario (email) y contraseña para ser usado en el sistema.
                                                            </li>
                                                        </ul>
                                                    </li>
                                                </ul>
                                            </Alert>
                                        </Col>
                                    </Row>
                                    <FormGroup>
                                        <Row>
                                            <Col sm="3"></Col>
                                            <Col sm="2" className="txtNegrita">Email: *</Col>
                                            <Col sm="4">
                                                <Input
                                                    type="email"
                                                    placeholder="Ej: correo@dominio.com"
                                                    name="email"
                                                    value={this.state.email}
                                                    onChange={this.handle_onChange}
                                                />
                                            </Col>
                                            <Col sm="3"></Col>
                                        </Row>
                                    </FormGroup>
                                    <FormGroup>
                                        <Row>
                                            <Col sm="3"></Col>
                                            <Col sm="2" className="txtNegrita">Clave fase 1: *</Col>
                                            <Col sm="4">
                                                <Input
                                                    type="text"
                                                    name="claveFase1"
                                                    onChange={this.handle_onChange}
                                                />
                                            </Col>
                                            <Col sm="3"></Col>
                                        </Row>
                                    </FormGroup>
                                    <FormGroup>
                                        <Row>
                                            <Col sm="3"></Col>
                                            <Col sm="6">
                                                <Input
                                                    invalid={this.state.fase1Invalida}
                                                    hidden={true}
                                                />
                                                <FormFeedback>{this.state.mesajeFase1Invalida}</FormFeedback>
                                            </Col>
                                            <Col sm="3"></Col>
                                        </Row>
                                    </FormGroup>
                                </CardBody>
                                <CardFooter>
                                    <FormGroup>
                                        <Row>
                                            <Col sm="3"></Col>
                                            <Col sm="6" className="center">
                                                <Button
                                                    type="button"
                                                    className="faIconButton"
                                                    onClick={this.cancelarRegistro}
                                                >
                                                    Cancelar
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    color="primary"
                                                >
                                                    Verificar Fase 1
                                                </Button>
                                            </Col>
                                            <Col sm="3"></Col>
                                        </Row>
                                    </FormGroup>
                                </CardFooter>
                            </Form>
                        </Card>
                    </Col>
                    <Col sm="2"></Col>
                </Row>

                <Row>
                    <Col sm="2"></Col>
                    <Col sm="8">
                        <Card className="tarjetaDeRegitro">
                            <Form onSubmit={this.verificaFase1}>
                                <CardHeader className="center">
                                    <CardTitle className="txtNegrita txtEncabezadoTarjeta">Registro de usuarios</CardTitle>
                                    Fase 2
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col sm="12">
                                            <Alert color="warning">
                                                <span className="txtNegrita">Instrucciones:</span> <br />
                                                Se requiere contraseña para el nuevo usuario, confirmación de la contraseña y clave de la fase 2 para el alta definita del usuario.
                                            </Alert>
                                        </Col>
                                    </Row>
                                    <FormGroup>
                                        <Row>
                                            <Col sm="3"></Col>
                                            <Col sm="2" className="txtNegrita">Usuario/email: </Col>
                                            <Col sm="4">
                                                <Input
                                                    type="email"
                                                    value={this.state.email}
                                                    readOnly={true}
                                                />
                                            </Col>
                                            <Col sm="3"></Col>
                                        </Row>
                                    </FormGroup>
                                    <FormGroup>
                                        <Row>
                                            <Col sm="3"></Col>
                                            <Col sm="2" className="txtNegrita">Contraseña: *</Col>
                                            <Col sm="4">
                                                <Input
                                                    type="text"
                                                    name="password"
                                                    onChange={this.handle_onChange}
                                                    value={this.state.password}
                                                />
                                            </Col>
                                            <Col sm="3"></Col>
                                        </Row>
                                    </FormGroup>
                                    <FormGroup>
                                        <Row>
                                            <Col sm="3"></Col>
                                            <Col sm="2" className="txtNegrita">Confirmación: *</Col>
                                            <Col sm="4">
                                                <Input
                                                    type="text"
                                                    name="confirmacion"
                                                    onChange={this.handle_onChange}
                                                    value={this.state.confirmacion}
                                                />
                                            </Col>
                                            <Col sm="3"></Col>
                                        </Row>
                                    </FormGroup>
                                    <FormGroup>
                                        <Row>
                                            <Col sm="3"></Col>
                                            <Col sm="2" className="txtNegrita">Clave fase 2: *</Col>
                                            <Col sm="4">
                                                <Input
                                                    type="text"
                                                    name="claveFase2"
                                                    onChange={this.handle_onChange}
                                                    value={this.state.claveFase2}
                                                />
                                            </Col>
                                            <Col sm="3"></Col>
                                        </Row>
                                    </FormGroup>
                                </CardBody>
                                <CardFooter>
                                    <FormGroup>
                                        <Row>
                                            <Col sm="3"></Col>
                                            <Col sm="6" className="center">
                                                <Button
                                                    type="button"
                                                    className="faIconButton"
                                                    onClick={this.cancelarRegistro}
                                                >
                                                    Cancelar
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    color="primary"
                                                >
                                                    Verificar Fase 2
                                                </Button>
                                            </Col>
                                            <Col sm="3"></Col>
                                        </Row>
                                        <Row>
                                            <Col sm="3"></Col>
                                            <Col sm="6">
                                                <FormFeedback></FormFeedback>
                                            </Col>
                                            <Col sm="3"></Col>
                                        </Row>
                                    </FormGroup>
                                </CardFooter>
                            </Form>
                        </Card>
                    </Col>
                    <Col sm="2"></Col>
                </Row>
            </Container>
        )
    }
}

export default Signup;