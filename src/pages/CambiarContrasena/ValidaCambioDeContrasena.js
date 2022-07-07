import React, { Component } from 'react';
import './style.css'
import {
    Form, FormGroup, Input, Row, Col, CardTitle, FormFeedback,
    Container, Card, CardBody, Alert, Button, CardFooter
} from 'reactstrap'
import helpers from '../../components/Helpers'
import axios from 'axios';

class ValidaCambioDeContrasena extends Component {
    url = helpers.url_api;

    constructor(props) {
        super(props);
        this.state = {
            cadenaValida: false,
            datosParaCambio: {},
            nvoPassword: '',
            confirmacion: '',
            nvoPasswordInvalido: true,
            confirmacionInvalida: false,
            mensajenNvoPasswordInvalido: 'La contraseña no cumple con los requisitos de complejidad.',
            confirmacionInvalida: true,
            mensajenConfirmacionInvalida: 'Las contraseñas no coinciden.',
            procesoExistoso: false
        }
    }

    componentDidMount() {
        this.ValidaCambioDeContrasena(window.location.search);
    }

    ValidaCambioDeContrasena = async (gets) => {
        let cadena = gets
        cadena = cadena.split('=')
        if (gets === '') this.setState({ cadenaValida: false })
        if (cadena[0] !== '?cadenaDeValidacion') {
            this.setState({ cadenaValida: false })
        }
        else {
            await axios.get(this.url + '/SendMail/ValidaCambioDeContrasena?cadenaDeValidacion=' + cadena[1])
                .then(res => {
                    if (res.data.status === 'success') {
                        this.setState({
                            cadenaValida: true,
                            datosParaCambio: res.data.datosParaCambio[0]
                        })
                    }
                    else {
                        this.setState({ cadenaValida: false })
                    }
                })
        }
    }

    handle_OnChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    cambiarPassword = async (e) => {
        e.preventDefault()

        if (!helpers.regex.formatoPassword.test(this.state.nvoPassword)) {
            this.setState({
                nvoPasswordInvalido: true,
                mensajenNvoPasswordInvalido: true
            })
            return false
        }
        else {
            this.setState({
                nvoPasswordInvalido: false,
                mensajenNvoPasswordInvalido: false
            })
        }

        if (this.state.nvoPassword !== this.state.confirmacion) {
            this.setState({
                confirmacionInvalida: true,
                mensajenConfirmacionInvalida: true
            })
            return false
        }
        else {
            this.setState({
                confirmacionInvalida: false,
                mensajenConfirmacionInvalida: false
            })
        }

        let datos = {
            cadenaDeValidacion: this.state.datosParaCambio.vcc_Cadena,
            nvaContrasena: this.state.nvoPassword
        }

        await axios.post(this.url + '/SendMail/CambiarContrasena', datos)
            .then(res => {
                if (res.data.status = 'success') {
                    this.setState({ procesoExistoso: true })
                }
                else {
                    this.setState({ procesoExistoso: false })
                }
            })
    }

    render() {
        if (this.state.cadenaValida) {
            if (!this.state.procesoExistoso) {
                return (
                    <Container>
                        <Row className="justify-content-center">
                            <Col sm='12'>
                                <Form onSubmit={this.cambiarPassword}>
                                    <Card className="o-hidden border-0 shadow-lg my-5">
                                        <CardTitle className="text-center">
                                            <h1 className="h4 text-gray-900 mb-4">Ingresa la nueva contraseña <br /> ({this.state.datosParaCambio.vcc_Correo}) </h1>
                                        </CardTitle>
                                        <CardBody className="p-0">
                                            <Row>
                                                <Col sm='2'></Col>
                                                <Col sm='8'>
                                                    <Alert color='warning'>
                                                        Ingrese una nueva contraseña y confirmela. <br />
                                                        La contraseña debe contener al menos 5 caracteres con MAYUSCULAS, minusculas y numeros.
                                                    </Alert>
                                                </Col>
                                                <Col sm='2'></Col>
                                            </Row>
                                            <FormGroup>
                                                <Row>
                                                    <Col sm='2'></Col>
                                                    <Col sm='2' className='aumentarFuente'>Contraseña</Col>
                                                    <Col sm='6'>
                                                        <Input
                                                            name='nvoPassword'
                                                            type='password'
                                                            value={this.state.nvoPassword}
                                                            onChange={this.handle_OnChange}
                                                            invalid={this.state.nvoPasswordInvalido}
                                                        />
                                                        <FormFeedback>{this.state.mensajenNvoPasswordInvalido}</FormFeedback>
                                                    </Col>
                                                    <Col sm='2'></Col>
                                                </Row>
                                            </FormGroup>
                                            <FormGroup>
                                                <Row>
                                                    <Col sm='2'></Col>
                                                    <Col sm='2' className='aumentarFuente'>Confirmación</Col>
                                                    <Col sm='6'>
                                                        <Input
                                                            name='confirmacion'
                                                            type='password'
                                                            value={this.state.confirmacion}
                                                            onChange={this.handle_OnChange}
                                                            invalid={this.state.confirmacionInvalida}
                                                        />
                                                        <FormFeedback>{this.state.mensajenConfirmacionInvalida}</FormFeedback>
                                                    </Col>
                                                    <Col sm='2'></Col>
                                                </Row>
                                            </FormGroup>
                                        </CardBody>
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
                                                Cambiar contraseña
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </Form>
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
                                                <h1 className="h4 text-gray-900 mb-4">Contraseña restablecida satisfactoriamente!</h1>
                                            </CardTitle>
                                        </Col>
                                    </Row>
                                    <CardBody className="p-0">
                                        <FormGroup>
                                            <Row>
                                                <Col sm='1'></Col>
                                                <Col sm='10'>
                                                    La nueva contraseña esta lista para usarse.
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
        else {
            return (
                <Container>
                    <Row className="justify-content-center">
                        <Col sm='10'>
                            <Card className="o-hidden border-0 shadow-lg my-5">
                                <Row>
                                    <Col sm='12'>
                                        <CardTitle className="text-center">
                                            <h1 className="h4 text-gray-900 mb-4">Solicitud invalida</h1>
                                        </CardTitle>
                                    </Col>
                                </Row>
                                <CardBody className="p-0">
                                    <FormGroup>
                                        <Row>
                                            <Col sm='1'></Col>
                                            <Col sm='10' className='center'>
                                                <img src="./images/alto.png" />
                                            </Col>
                                            <Col sm='1'></Col>
                                        </Row>
                                        <Row>
                                            <Col sm='1'></Col>
                                            <Col sm='10' className='center'>
                                                La cadena de validacion es incorrecta o la solicitud de cambio de contraseña ya caducó. <br />
                                                Recuerde que las solicides de cambio de contraseña tiene vigencia de 24 horas.
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

export default ValidaCambioDeContrasena;