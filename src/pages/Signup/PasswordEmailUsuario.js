import React, { Component/* , useEffect */ } from 'react';
import {
    /* Form, FormGroup,  */Input, /* Button, */ Row, Col,
    Container, FormFeedback, FormGroup, /* Card, CardBody, CardTitle */
} from 'reactstrap';

class PasswordEmailUsuario extends Component {

    constructor(props) {
        super(props);
        this.state = {

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
                        <Col xs="3"></Col>
                        <Col xs="2" className="txtNegrita">Contraseña: *</Col>
                        <Col xs="4">
                            <Input
                                type="password"
                                onChange={handle_passEmailRegistro}
                                value={passEmailRegistro}
                            />
                        </Col>
                        <Col xs="3"></Col>
                    </Row>
                </FormGroup>
                {passwordInvalido &&
                    <FormGroup>
                        <Row>
                            <Col sm="3"></Col>
                            <Col xs="6">
                                <span style={{ color: "red" }}>
                                    <strong>Error: </strong>No se cumplen los requisitos de complejidad. <br />
                                    Deben existir al menos un carateres de cada uno de los siguientes grupos:
                                    <ul>
                                        <li> MAYUSCULAS [A-Z]. </li>
                                        <li> minusculas [a-z]. </li>
                                        <li> Número [0-9]. </li>
                                        <li> Caracteres especiales: $#@!%*?& </li>
                                        <li> Longitud de 6 a 20 caracteres. </li>
                                    </ul>
                                </span>
                            </Col>
                            <Col sm="3"></Col>
                        </Row>
                    </FormGroup>
                }
                <Row>
                    <Col sm="3"></Col>
                    <Col xs="2" className="txtNegrita">Confirmar: *</Col>
                    <Col xs="4">
                        <Input
                            type="password"
                            onChange={handle_confirmacion}
                            value={confirmacion}
                            invalid={confirmacionInvalida}
                        />
                        <FormFeedback>{msjRegexInvalido.confirmaPassInvalido}</FormFeedback>
                    </Col>
                    <Col sm="3"></Col>
                </Row>
            </React.Fragment>
        )
    }
}

export default PasswordEmailUsuario;