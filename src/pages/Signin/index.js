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
            loginInvalido: false,
            loginSuccess: "",
            verPassword: false,
        };
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
                emailAlert: 'Este campo es requerido y debe tener la estructura de un Email.',
                passwordAlert: 'Este campo es requerido con mínimo 7 caracteres.',
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
                            if (res.data.infoSesion[0] === undefined) {
                                this.setState({
                                    mensajes: {
                                        ...this.state.mensajes,
                                        loginAlert: "Error: El usuario/ministro no tiene asignado algún Sector."
                                    },
                                    loginInvalido: true,
                                    loginSuccess: ""
                                });

                                localStorage.removeItem('token');
                                localStorage.removeItem('infoSesion');
                            }
                            else {
                                this.setState({
                                    token: res.data.token,
                                    mensajes: {
                                        ...this.state.mensajes,
                                        loginAlert: res.data.message
                                    },
                                    loginInvalido: true,
                                    loginSuccess: "loginAlertSuccess"
                                });
                                localStorage.setItem('token', this.state.token);
                                localStorage.setItem('infoSesion', JSON.stringify(res.data.infoSesion[0]));
                                localStorage.setItem('seccion', '');
                                localStorage.setItem('componente', '');

                                document.location.href = '/Login';
                                // setTimeout(() => { document.location.href = '/Login'; }, 3000);
                            }
                        }
                        else {
                            this.setState({
                                mensajes: {
                                    ...this.state.mensajes,
                                    loginAlert: res.data.message
                                },
                                loginInvalido: true,
                                loginSuccess: ""
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
                                    <Row className="text-center bg-logo">
                                        <Col xs="3" />
                                        <Col xs="6" className="mt-3">
                                            <img
                                                src="../favicon.png"
                                                alt="Logo de la App"
                                                width="100" height="100"
                                            />

                                            <h1 className="h4 text-gray-900 mb-4">IECE MEMBRESIA</h1>

                                        </Col>
                                        <Col xs="3" />
                                    </Row>
                                    <hr className="mt-1" />

                                    <Row>
                                        <Col xs="3" />
                                        <Col xs="6" className="p-3">
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
                                                        placeholder="Dirección Email"
                                                        invalid={this.state.emailInvalido}
                                                        style={{ textTransform: 'lowercase' }} />
                                                    <FormFeedback>{this.state.mensajes.emailAlert}</FormFeedback>
                                                </FormGroup>
                                                <Row>
                                                    <Col xs="11" id="noPaddingRigth">
                                                        <FormGroup>
                                                            <Input
                                                                type={this.state.verPassword ? "text" : "password"}
                                                                name="Password"
                                                                onChange={this.handleChange}
                                                                value={this.state.Password}
                                                                placeholder="Contraseña"
                                                                invalid={this.state.passwordInvalido}
                                                            />
                                                            <FormFeedback>{this.state.mensajes.passwordAlert}</FormFeedback>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col xs="1" id="noPaddingLeft">
                                                        <div onClick={() => this.setState({ verPassword: !this.state.verPassword })}>
                                                            <button type="button" class="btn btn-secondary" >

                                                                {this.state.verPassword ?
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash-fill" viewBox="0 0 16 16">
                                                                        <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z" />
                                                                        <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z" />
                                                                    </svg> :
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                                                        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                                                        <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                                                    </svg>
                                                                }
                                                            </button>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <FormGroup className="text-center">
                                                    <Button
                                                        color="primary"
                                                        type="submit" >
                                                        <span className="fa fa-key faIconButton"></span>
                                                        Validar credenciales
                                                    </Button>
                                                    <br />
                                                    <Row>
                                                        <Col className='text-right'>
                                                            <Link to="/Signup" >Registrar Nuevo Usuario</Link>
                                                        </Col>
                                                        <Col className='col-1'>|</Col>
                                                        <Col className='text-left'>
                                                            <Link to="/SolicitudDeRestablecimiento">Olvidé Contraseña</Link>
                                                        </Col>
                                                    </Row>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Input
                                                        invalid={this.state.loginInvalido}
                                                        hidden={true} />
                                                    <FormFeedback className={`loginAlert ${this.state.loginSuccess}`} >{this.state.mensajes.loginAlert}</FormFeedback>
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