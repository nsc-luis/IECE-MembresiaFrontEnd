import React, { Component/* , useEffect */ } from 'react';
import {
    /* Form, FormGroup,  */Input, /* Button, */ Row, Col,
    Container, FormFeedback, FormGroup, /* Card, CardBody, CardTitle */
} from 'reactstrap';

class PasswordEmailUsuario extends Component {

    constructor(props) {
        super(props);
        this.state = {
            verPassword: false,
            verPassword2: false
        };
    }

    render() {
        const {
            msjRegexInvalido,
            passwordInvalido,
            passEmailRegistro,
            handle_passEmailRegistro,
            confirmacion,
            handle_confirmacion,
            confirmacionInvalida
        } = this.props

        return (
            <React.Fragment>
                <FormGroup>
                    <Row>
                        <Col xs="1"></Col>
                        <Col xs="2" className="txtNegrita">Contraseña: *</Col>
                        <Col xs="7">
                            <Input
                                type={this.state.verPassword ? "text" : "password"}
                                onChange={handle_passEmailRegistro}
                                value={passEmailRegistro}
                            />
                        </Col>
                        <Col xs="1">
                            <div onClick={() => this.setState({ verPassword: !this.state.verPassword })}>
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
                            </div>
                        </Col>

                        <Col xs="1"></Col>
                    </Row>
                </FormGroup>
                {passwordInvalido &&
                    <FormGroup>
                        <Row>
                            <Col sm="3"></Col>
                            <Col xs="9">
                                <span style={{ color: "red" }}>
                                    <strong>Error: </strong>No se cumplen los requisitos de complejidad. <br />
                                    Deben existir al menos un carateres de cada uno de los siguientes grupos:
                                    <ul>
                                        <li> MAYUSCULAS [A-Z]. </li>
                                        <li> minusculas [a-z]. </li>
                                        <li> Número [0-9]. </li>
                                        <li> Caracteres especiales: $#@!%*?& </li>
                                        <li> Longitud de 8 a 20 caracteres. </li>
                                    </ul>
                                </span>
                            </Col>
                            <Col sm="1"></Col>
                        </Row>
                    </FormGroup>
                }
                <Row>
                    <Col sm="1"></Col>
                    <Col xs="2" className="txtNegrita">Confirmar: *</Col>
                    <Col xs="7">
                        <Input
                            type={this.state.verPassword2 ? "text" : "password"}
                            onChange={handle_confirmacion}
                            value={confirmacion}
                            invalid={confirmacionInvalida}
                        />
                        <FormFeedback>{msjRegexInvalido.confirmaPassInvalido}</FormFeedback>
                    </Col>
                    <Col xs="1">
                        <div onClick={() => this.setState({ verPassword2: !this.state.verPassword2 })}>
                            {this.state.verPassword2 ?

                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash-fill" viewBox="0 0 16 16">
                                    <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z" />
                                    <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z" />
                                </svg> :
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                </svg>
                            }
                        </div>
                    </Col>
                    <Col sm="1"></Col>
                </Row>
            </React.Fragment>
        )
    }
}

export default PasswordEmailUsuario;