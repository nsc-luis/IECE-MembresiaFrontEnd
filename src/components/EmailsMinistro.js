import React, { Component } from 'react'
import helpers from './Helpers'
import { Row, Col, Container, FormFeedback, /* FormGroup, */ Input } from 'reactstrap'

class EmailMinistro extends Component {
    url = helpers.url_api

    /* constructor(props) {
        super(props)
    } */

    render() {
        const { 
            noExisteCorreo, 
            emailsMinistro, 
            emailParaRegistro, 
            handle_emailParaRegistro,
            emailInvalido,
            msjRegexInvalido
        } = this.props

        return (
            <Container>
                {noExisteCorreo &&
                    <React.Fragment>
                        <Row>
                            <Col xs="12">
                                <p style={{ color: "orange" }}>
                                    <strong>Aviso: </strong>No se encontraron correos
                                registrados para el ministro seleccionado; debera
                                ingresar un correo para continuar con el registro.
                            </p>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="4">
                                <label><strong>*</strong> Email</label>
                            </Col>
                            <Col xs="8">
                                <Input
                                    type="text"
                                    className="form-group"
                                    onChange={handle_emailParaRegistro}
                                    value={emailParaRegistro}
                                    invalid={emailInvalido}
                                    className="inputEmail"
                                />
                                <FormFeedback>{msjRegexInvalido.emailInvalido}</FormFeedback>
                            </Col>
                        </Row>
                    </React.Fragment>
                }
                {emailsMinistro.length > 0 &&
                    <React.Fragment>
                        <Row>
                            <Col xs="4">
                                <label><strong>*</strong> Email</label>
                            </Col>
                            <Col xs="8">
                                <Input
                                    type="select"
                                    name="emailMinistroRegistro"
                                    className="form-control"
                                    onChange={handle_emailParaRegistro}
                                    value={emailParaRegistro}
                                    invalid={emailInvalido}
                                    className="inputEmail"
                                >
                                    <option value="0">Seleccione un correo</option>
                                    {
                                        emailsMinistro.map((email, i) => {
                                            return (
                                                <option key={i} value={email}>
                                                    {email}
                                                </option>
                                            )
                                        })
                                    }
                                </Input>
                                <FormFeedback>{msjRegexInvalido.emailInvalido}</FormFeedback>
                            </Col>
                        </Row>
                    </React.Fragment>
                }
            </Container>
        )
    }
}

export default EmailMinistro