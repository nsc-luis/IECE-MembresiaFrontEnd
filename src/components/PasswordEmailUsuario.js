import React, { Component/* , useEffect */ } from 'react';
import {
    /* Form, FormGroup,  */Input, /* Button, */ Row, Col,
    Container, FormFeedback, /* Card, CardBody, CardTitle */
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
            <Container>
                <Row>
                    <Col xs="4">
                        <label><strong>*</strong> Contraseña</label>
                    </Col>
                    <Col xs="8">
                        <Input
                            type="password"
                            className="form-group"
                            onChange={handle_passEmailRegistro}
                            value={passEmailRegistro}
                        />
                    </Col>
                </Row>
                {passwordInvalido &&
                    <Row>
                        <Col xs="12">
                            <span style={{ color: "red" }}>
                                <strong>Error: </strong>No se cumplen los requisitos de complejidad. <br />
                                    Deben existir al menos un carateres de cada uno de los siguientes grupos:
                                <ul>
                                    <li> MAYUSCULAS [A-Z]. </li>
                                    <li> minusculas [a-z]. </li>
                                    <li> Número [0-9]. </li>
                                    <li> Caracteres especiales: ~!@#$%^&*_-+=`|\(){ }[]:;"',.?/ </li>
                                    <li> Longitud de 6 a 20 caracteres. </li>
                                </ul>
                            </span>
                        </Col>
                    </Row>
                }
                <Row>
                    <Col xs="4">
                        <label><strong>*</strong> Confirmar</label>
                    </Col>
                    <Col xs="8">
                        <Input
                            type="password"
                            className="form-group"
                            onChange={handle_confirmacion}
                            value={confirmacion}
                            invalid={confirmacionInvalida}
                        />
                        <FormFeedback>{msjRegexInvalido.confirmaPassInvalido}</FormFeedback>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default PasswordEmailUsuario;