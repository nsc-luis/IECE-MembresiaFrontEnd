import React, { Component } from 'react';
import helpers from '../../components/Helpers';
import axios from 'axios';
import {
    Form, FormGroup, Input, Button, Row, Col,
    Container, FormFeedback, Card, CardBody, CardTitle
} from 'reactstrap'
import { Link } from 'react-router-dom';
import './style.css'

class Login extends Component {
    url = helpers.url_api;

    constructor(props) {
        super(props);
        this.state = {
            token: "",
            mensajes: {},
            Email: '',
            Password: '',
            emailInvalido: false,
            passwordInvalido: false,
            loginInvalido: false
        };
        if(localStorage.getItem("infoSesion")) {
            document.location.href = '/Main';
        }
    }

    // EXPRESIONES REGULARES PARA VALIDAR CAMPOS
    const_regex = {
        formatoEmail: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        formatoPassword: /^.{7,40}/
    }

    // INICIALIZACION DE VARIABLESY FUNCIONES
    componentWillMount() {
        this.setState({
            mensajes: {
                ...this.state.mensajes,
                emailAlert: 'Este campo es requerido y/o debe tener la estructura de un email.',
                passwordAlert: 'Este campo es requerido con minimo 7 caracteres.',
                loginAlert: ''
            }
        });
    }

    // FUNCION PARA CAPTURAR DATOS DEL FORMULARIO
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    // FUNCION PARA VALIDAR CAMPOS
    validaFormatos = (formato, campo, estado) => {
        if (!this.const_regex[formato].test(campo)) {
            this.setState({
                [estado]: true
            });
        } else {
            this.setState({
                [estado]: false
            });
        }
    }

    // FUNCION DE VALIDACION DE CREDENCIALES E INICIO DE SESION
    Login = async (e) => {
        e.preventDefault();

        localStorage.removeItem('token');
        localStorage.removeItem('infoSesion');

        // VALIDA CAMPOS DE LOGIN
        var camposLoginAValidar = [
            { formato: "formatoEmail", campo: "Email", estado: "emailInvalido" },
            { formato: "formatoPassword", campo: "Password", estado: "passwordInvalido" }
        ];
        camposLoginAValidar.forEach(element => {
            this.validaFormatos(element.formato, this.state[element.campo], element.estado)
        });

        if (!this.state.emailInvalido &&
            !this.state.passwordInvalido) {
            // COMPRUEBA DISPONIBILIDAD DEL SERVIDOR
            try {
                await axios.post(
                    this.url + '/usuario/login',
                    {
                        Email: this.state.Email, 
                        Password: this.state.Password
                    })
                    .then(res => {
                        // VALIDA CREDENCIALES
                        if (res.data.status === "success") {
                            this.setState({
                                token: res.data.token,
                                mensajes: {
                                    ...this.state.mensajes,
                                    loginAlert: res.data.message
                                },
                                loginInvalido: true,
                            });
                            localStorage.setItem('token', this.state.token);
                            localStorage.setItem('infoSesion', JSON.stringify(res.data.infoSesion[0]));
                            setTimeout(() => { document.location.href = '/Login'; }, 3000);
                        }
                        else {
                            this.setState({
                                mensajes: {
                                    ...this.state.mensajes,
                                    loginAlert: res.data.message
                                },
                                loginInvalido: true
                            });
                        }
                    });
            }
            // ERROR: SERVIDOR NO DISPONIBLE
            catch (error) {
                this.setState({
                    mensajes: {
                        ...this.state.mensajes,
                        loginAlert: 'Error: Servidor no disponible, intente mas tarde.'
                    },
                    loginInvalido: true
                });
            }
        } else {
            console.log("Error: formatos incorrectos.")
        }
    }

    render() {
        return (
            <React.Fragment>
                <Container>
                    {/* <!-- Outer Row --> */}
                    <Row className="justify-content-center">
                        <Col xs="12">
                            <Card className="o-hidden border-0 shadow-lg my-5">
                                <CardBody className="p-0">
                                    {/* <!-- Nested Row within Card Body --> */}
                                    <Row>
                                        <Col xs="3" />
                                        <Col xs="6" className="p-5">
                                            <CardTitle className="text-center">
                                                <h1 className="h4 text-gray-900 mb-4">Bienvenido! </h1>
                                            </CardTitle>
                                            <Form onSubmit={this.Login}>
                                                <FormGroup>
                                                    <Input
                                                        type="text"
                                                        name="Email"
                                                        onChange={this.handleChange}
                                                        value={this.state.Email}
                                                        placeholder="Direccion Email"
                                                        invalid={this.state.emailInvalido}
                                                        style={{ textTransform: 'lowercase' }} />
                                                    <FormFeedback>{this.state.mensajes.emailAlert}</FormFeedback>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Input
                                                        type="password"
                                                        name="Password"
                                                        onChange={this.handleChange}
                                                        value={this.state.Password}
                                                        placeholder="Contraseña"
                                                        invalid={this.state.passwordInvalido} />
                                                    <FormFeedback>{this.state.mensajes.passwordAlert}</FormFeedback>
                                                </FormGroup>
                                                <FormGroup className="text-center">
                                                    <Button
                                                        color="primary"
                                                        type="submit" >
                                                            <span className="fa fa-key faIconButton"></span>
                                                            Validar credenciales
                                                    </Button>
                                                    <br />
                                                    <Link to="/Signup">Registrar nuevo usuario.</Link>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Input
                                                        invalid={this.state.loginInvalido}
                                                        hidden={true} />
                                                    <FormFeedback>{this.state.mensajes.loginAlert}</FormFeedback>
                                                </FormGroup>
                                            </Form>
                                        </Col>
                                        <Col xs="3" />
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </React.Fragment>
        )
    }
};

export default Login;