import React, { Component } from 'react';
import {
    Form, FormGroup, Input, Button, Row, Col, FormFeedback, Alert,
    Container, Card, CardHeader, CardBody, CardTitle, CardFooter
} from 'reactstrap'
import helpers from '../../components/Helpers';
import axios from 'axios';
import PasswordEmailUsuario from './PasswordEmailUsuario';
import "./style.css"

class Signup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            passEmailRegistro: "",
            nombre: "",
            confirmacion: "",
            claveFase1: "",
            claveFase2: "",
            superSecreto: "",
            fase1Invalida: false,
            mesajeFase1Invalida: "",
            fase2Invalida: false,
            mesajeFase2Invalida: "",
            desplegarFase2: false,
            passwordInvalido: false,
            confirmacionInvalida: false,
            idMinistro: "0"
        }
    }

    handle_onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    verificaFase1 = async (e) => {
        e.preventDefault();
        await helpers.authAxios.get(helpers.url_api + "/Usuario/VerificaEmail/" + this.state.email/*  + "/" + this.state.claveFase1 */)
            .then(res => {
                if (res.data.status === "success") {
                    console.log("ok");
                    this.setState({
                        fase1Invalida: false,
                        mesajeFase1Invalida: "",
                        desplegarFase2: true,
                        nombre: res.data.datos[0].pem_Nombre,
                        idMinistro: res.data.datos[0].pem_Id_Ministro
                    });
                }
                else {
                    console.log("email y/o clave incorrectos.")
                    this.setState({
                        fase1Invalida: true,
                        mesajeFase1Invalida: "Error: " + res.data.mensaje,
                        desplegarFase2: false,
                        nombre: "",
                        idMinistro: "0"
                    });
                }
            });
    }

    verificaFase2 = async (e) => {
        e.preventDefault();
        var data = {
            Email: this.state.email,
            Password: this.state.passEmailRegistro,
            /* superSecreto: this.state.claveFase2 */
            superSecreto: this.state.superSecreto
        };
        var altaUsuario = false;
        var AspNetUserId = "";
        this.setState({ claveFase2: "" });
        await axios.post(helpers.url_api + "/Usuario/Create/", data)
            .then(res => {
                if (res.data.status === "success") {
                    alert(res.data.mensaje);
                    altaUsuario = true;
                    AspNetUserId = res.data.nvoUsuario.Id;
                } else {
                    let mensaje = "Error! \n";
                    if (Array.isArray(res.data.mensaje)) {
                        res.data.mensaje.forEach(msj => {
                            mensaje += "Codigo: " + msj.code + "\nDescripcion: " + msj.description + "\n";
                        })
                        alert(mensaje);
                    }
                    else {
                        alert(res.data.mensaje);
                    }
                }
            })
        if (altaUsuario) {
            await axios.post(
                helpers.url_api + "/Ministro_Usuario",
                {
                    mu_aspNetUsers_Id: AspNetUserId,
                    mu_pem_Id_Pastor: this.state.idMinistro,
                    mu_permiso: "CRUD"
                }
            );
            setTimeout(() => { document.location.href = '/'; }, 1500);
        }
    }

    cancelarRegistro = () => {
        document.location.href = '/';
    }

    handle_passEmailRegistro = (e) => {
        this.setState({ passEmailRegistro: e.target.value })

        if (helpers.validaFormatos(helpers.regex.formatoPassword, e.target.value)) {
            this.setState({ passwordInvalido: true });
        } else {
            this.setState({ passwordInvalido: false });
        }
        if (e.target.value === this.state.confirmacion) {
            this.setState({
                confirmacionInvalida: false
            })
        } else {
            this.setState({
                confirmacionInvalida: true
            })
        }
    }

    // METODO PARA VALIDAR CONFIRMACION DE PASSWORD
    handle_confirmacion = (e) => {
        if (e.target.value !== "") {
            this.setState({ confirmacion: e.target.value })
        } else {
            this.setState({ confirmacion: e.target.value })
        }
        if (this.state.passEmailRegistro === e.target.value) {
            this.setState({
                confirmacionInvalida: false
            })
        } else {
            this.setState({
                confirmacionInvalida: true
            })
        }
    }

    render() {
        return (
            <Container>
                {!this.state.desplegarFase2 &&
                    <Row>
                        <Col sm="12">
                            <Card className="tarjetaDeRegitro">
                                <Form onSubmit={this.verificaFase1}>
                                    <CardHeader className="center">
                                        <CardTitle className="txtNegrita txtEncabezadoTarjeta">Registro de usuarios</CardTitle>
                                        {/* Fase 1 */}
                                    </CardHeader>
                                    <CardBody>
                                        <FormGroup>
                                            <Row>
                                            <Col sm="1"></Col>
                                                <Col sm="2" className="txtNegrita">Email: *</Col>
                                                <Col sm="8">
                                                    <Input
                                                        type="email"
                                                        placeholder="Ej: correo@dominio.com"
                                                        name="email"
                                                        value={this.state.email}
                                                        onChange={this.handle_onChange}
                                                        invalid={this.state.fase1Invalida}
                                                    />
                                                    <FormFeedback>{this.state.mesajeFase1Invalida}</FormFeedback>
                                                </Col>
                                                <Col sm="1"></Col>
                                            </Row>
                                        </FormGroup>
                                    </CardBody>
                                    <CardFooter>
                                        <FormGroup>
                                            <Row>
                                                <Col sm="1"></Col>
                                                <Col sm="10" className="center">
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
                                                        {/* Verificar Fase 1 */}
                                                        Verficar e-mail
                                                    </Button>
                                                </Col>
                                                <Col sm="1"></Col>
                                            </Row>
                                        </FormGroup>
                                    </CardFooter>
                                </Form>
                            </Card>
                        </Col>
                    </Row>
                }

                {this.state.desplegarFase2 &&
                    <Row>
                        <Col sm="12">
                            <Card className="tarjetaDeRegitro">
                                <Form onSubmit={this.verificaFase2}>
                                    <CardHeader className="center">
                                        <CardTitle className="txtNegrita txtEncabezadoTarjeta m-0 p-0">Registro de usuarios</CardTitle>
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
                                                <Col sm="1"></Col>
                                                <Col sm="2" className="txtNegrita">Usuario/email: </Col>
                                                <Col sm="8">
                                                    <Input
                                                        type="email"
                                                        value={this.state.email}
                                                        readOnly={true}
                                                    />
                                                </Col>
                                                <Col sm="1"></Col>
                                            </Row>
                                        </FormGroup>
                                        <FormGroup>
                                            <Row>
                                                <Col sm="1"></Col>
                                                <Col sm="2" className="txtNegrita">Nombre: </Col>
                                                <Col sm="8">
                                                    <Input
                                                        type="text"
                                                        value={this.state.nombre}
                                                        readOnly={true}
                                                    />
                                                </Col>
                                                <Col sm="1"></Col>
                                            </Row>
                                        </FormGroup>
                                        <FormGroup>
                                            <PasswordEmailUsuario
                                                handle_passEmailRegistro={this.handle_passEmailRegistro}
                                                passEmailRegistro={this.state.passEmailRegistro}
                                                passwordInvalido={this.state.passwordInvalido}
                                                msjRegexInvalido={helpers.msjRegexInvalido}
                                                handle_confirmacion={this.handle_confirmacion}
                                                confirmacionInvalida={this.state.confirmacionInvalida}
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Row>
                                                <Col sm="1"></Col>
                                                <Col sm="2" className="txtNegrita">Super secreto: *</Col>
                                                <Col sm="8">
                                                    <Input
                                                        type="text"
                                                        name="superSecreto"
                                                        onChange={this.handle_onChange}
                                                        value={this.state.superSecreto}
                                                        invalid={this.state.fase2Invalida}
                                                    />
                                                </Col>
                                                <Col sm="1"></Col>
                                            </Row>
                                        </FormGroup>
                                    </CardBody>
                                    <CardFooter>
                                        <FormGroup>
                                            <Row>
                                                <Col sm="1"></Col>
                                                <Col sm="10" className="center">
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
                                                        {/* Verificar Fase 2 */}
                                                        Registrar
                                                    </Button>
                                                </Col>
                                                <Col sm="1"></Col>
                                            </Row>
                                            <Row>
                                                <Col sm="1"></Col>
                                                <Col sm="10">
                                                    <FormGroup>
                                                        <Row>
                                                            <Col sm="1"></Col>
                                                            <Col sm="10">
                                                                <Input
                                                                    invalid={this.state.fase2Invalida}
                                                                    hidden={true}
                                                                />
                                                                <FormFeedback>{this.state.mesajeFase2Invalida}</FormFeedback>
                                                            </Col>
                                                            <Col sm="1"></Col>
                                                        </Row>
                                                    </FormGroup>
                                                </Col>
                                                <Col sm="1"></Col>
                                            </Row>
                                        </FormGroup>
                                    </CardFooter>
                                </Form>
                            </Card>
                        </Col>
                    </Row>
                }
            </Container>
        )
    }
}

export default Signup;