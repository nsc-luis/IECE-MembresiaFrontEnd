import React, { Component } from 'react';
import {
    Form, FormGroup, Input, Row, Col, CardTitle, FormFeedback,
    Container, Card, CardBody, Alert, Button, CardFooter
} from 'reactstrap'
import './style.css'
import helpers from '../../components/Helpers'
import axios from 'axios'

class SolicitudDeRestablecimiento extends Component {
    url = helpers.url_api;
    constructor(props) {
        super(props);
        this.state = {
            correo: '',
            solicitudGenerada: false,
            correoInvalido: false,
            mensajeCorreoInvalido: '',
            mensajenNvoPasswordInvalido: '',
            
        }
    }

    handle_Correo = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    generarSolicitud = async (e) => {
        e.preventDefault()
        if (this.state.correo === '') {
            alert('Error!\nDebes ingresar una direccion de correo.')
            return false
        }
        await axios.post(this.url + '/SendMail/GenerarValidacionParaCambio?correo=' + this.state.correo)
            .then(res => {
                if (res.data.status === 'success') {
                    this.setState({
                        correoInvalido: false,
                        solicitudGenerada: true            
                    })
                }
                else {
                    this.setState({
                        mensajeCorreoInvalido: res.data.mensaje,
                        correoInvalido: true
                    })
                }
            })
    }

    render() {
        if (!this.state.solicitudGenerada) {
            return (
                <Container>
                    <Row className="justify-content-center">
                        <Col sm='10'>
                            <Card className="o-hidden border-0 shadow-lg my-5">
                                <Row>
                                    <Col sm='12'>
                                        <CardTitle className="text-center">
                                            <h1 className="h4 text-gray-900 mb-4">Solicitud de cambio de contraseña</h1>
                                        </CardTitle>
                                    </Col>
                                </Row>
                                <Form onSubmit={this.generarSolicitud}>
                                    <CardBody className="p-0">
                                        <Row>
                                            <Col sm='2'></Col>
                                            <Col sm='8'>
                                                <Alert color='warning'>
                                                    Los campos marcados con * son requeridos. <br />
                                                    Ingrese el correo al cual desea cambiar la contraseña. <br />
                                                    Si el correo esta registrado recibira un e-mail con intrucciones para restablecer la contraseña.
                                                </Alert>
                                            </Col>
                                            <Col sm='2'></Col>
                                        </Row>
                                        <FormGroup>
                                            <Row>
                                                <Col sm='2'></Col>
                                                <Col sm='8'>
                                                    <span className='aumentarFuente'>Usuario (email del ministro): *</span> <br />
                                                    <Input
                                                        name='correo'
                                                        type='email'
                                                        placeholder='Ej: elcorreo@iece.mx'
                                                        value={this.state.correo}
                                                        onChange={this.handle_Correo}
                                                        invalid={this.state.correoInvalido}
                                                    />
                                                    <FormFeedback>{this.state.mensajeCorreoInvalido}</FormFeedback>
                                                </Col>
                                                <Col sm='2'></Col>
                                            </Row>
                                        </FormGroup>
                                        <CardFooter className="text-center">
                                            <Button
                                                type='button'
                                                color='secondary'
                                                className='paddingButton'
                                                onClick={() => window.location = '/'}>
                                                Cancelar
                                            </Button>
                                            <Button
                                                type='submit'
                                                color='primary'>
                                                Enviar solicitud
                                            </Button>
                                        </CardFooter>
                                    </CardBody>
                                </Form>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            )
        }
        else {
            return (
                <Container>
                    <Row className="justify-content-center">
                        <Col sm='10'>
                            <Card className="o-hidden border-0 shadow-lg my-5">
                                <Row>
                                    <Col sm='12'>
                                        <CardTitle className="text-center">
                                            <h1 className="h4 text-gray-900 mb-4">Solicitud enviada!</h1>
                                        </CardTitle>
                                    </Col>
                                </Row>
                                <CardBody className="p-0">
                                    <FormGroup>
                                        <Row>
                                            <Col sm='1'></Col>
                                            <Col sm='10'>
                                                Revise la "Bandeja de entrada" en la cuenta de correo: {this.state.correo} <br />
                                                Si no llega el correo en la "Bandeja de entrada" busca por favor en la carpeta de SPAM / BULK (No deseados). <br />
                                                Sigue las instrucciones del correo enviado para restablecer la contraseña.
                                            </Col>
                                            <Col sm='1'></Col>
                                        </Row>
                                    </FormGroup>
                                    <CardFooter className="text-center">
                                        <Button
                                            type='button'
                                            color='primary'
                                            onClick={() => window.location = '/'}>
                                            Aceptar
                                        </Button>
                                    </CardFooter>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            )
        }
    }
}

export default SolicitudDeRestablecimiento;