import React, { Component } from 'react';
import {
    Card, CardBody, CardFooter, CardHeader, CardTitle, Alert,
    Button, Modal, FormGroup, Input, Col, Row, Form, ModalBody, Container
} from 'reactstrap';
import helpers from '../../components/Helpers';
import './style.css'
import Layout from '../Layout';

class BajaBautizadoDefuncion extends Component {

    infoSesion = JSON.parse(localStorage.getItem('infoSesion'));

    constructor(props) {
        super(props)
        this.state = {
            personas: [],
            formBajaBautizadoCambioDomicilio: {},
        }
    }

    getBajaBautizadoCambioDomicilio = async () => {
        await helpers.authAxios.get(helpers.url_api + "/Persona/GetBautizadosBySector/" + localStorage.getItem('sector'))
            .then(res => {
                this.setState({ personas: res.data.personas });
            });
    }

    componentDidMount() {
        this.setState({
            formBajaBautizadoCambioDomicilio: {
                ...this.state.formBajaBautizadoCambioDomicilio,
                idPersona: '0',
                tipoDestino: '0',
                fechaTransaccion: '',
                idUsuario: this.infoSesion.pem_Id_Ministro
            }
        })
        this.getBajaBautizadoCambioDomicilio()
    }

    onChangeBajaBautizadoCambioDomicilio = (e) => {
        this.setState({
            formBajaBautizadoCambioDomicilio: {
                ...this.state.formBajaBautizadoCambioDomicilio,
                [e.target.name]: e.target.value.toUpperCase()
            }
        })
    }

    cancelarFormulario = () => {
        helpers.handle_LinkEncabezado("Seccion: Monitoreo", "Información de membresía")
        window.location = "/ListaDePersonal"
    }

    bajaBautizadoCambioDomicilio = async(e) => {
        e.preventDefault();
        if (this.state.formBajaBautizadoCambioDomicilio.per_Id_Persona === "0"
            || this.state.formBajaBautizadoCambioDomicilio.tipoDestino === "0"
            || this.state.formBajaBautizadoCambioDomicilio.fechaTransaccion === "") {
                alert ("Error:\nDebe ingresar todos los datos requeridos.")
            }
        try {
            await helpers.authAxios.post(`${helpers.url_api}/Persona/BajaPersonaCambioDomicilio`, this.state.formBajaBautizadoCambioDomicilio)
            .then(res => {
                if (res.data.status === "success") {
                    document.location.href = '/ListaDePersonal'
                } else {
                    alert(res.data.mensaje);
                }
            })
        }
        catch {
            alert("Error: Hubo un problema en la comunicacion con el servidor. Intente mas tarde.");
        }
    }

    render() {
        return (
            <>
                <Card>
                    <Form onSubmit={this.bajaBautizadoCambioDomicilio}>
                        <CardBody>
                            <FormGroup>
                                <Row>
                                    <Col xs="12">
                                        <Alert color="warning">
                                            <strong>AVISO: </strong>LOS CAMPOS MARCADOS CON * SON REQUERIDOS.
                                        </Alert>
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                    <Col xs="3">
                                        * PERSONA:
                                    </Col>
                                    <Col xs="9">
                                        <Input
                                            type="select"
                                            value={this.state.formBajaBautizadoCambioDomicilio.idPersona}
                                            name="idPersona"
                                            onChange={this.onChangeBajaBautizadoCambioDomicilio}
                                        >
                                            <option value="0">Seleccione una persona</option>
                                            {this.state.personas.map(persona => {
                                                return (
                                                    <React.Fragment key={persona.per_Id_Persona}>
                                                        <option value={persona.per_Id_Persona} >
                                                            {persona.per_Nombre} {persona.per_Apellido_Paterno} {persona.per_Apellido_Materno}
                                                        </option>
                                                    </React.Fragment>
                                                )
                                            })}
                                        </Input>
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                    <Col xs="3">
                                        * Tipo destino:
                                    </Col>
                                    <Col xs="9">
                                        <Input
                                            type="select"
                                            name="tipoDestino"
                                            value={this.state.formBajaBautizadoCambioDomicilio.tipoDestino}
                                            onChange={this.onChangeBajaBautizadoCambioDomicilio}
                                        >
                                            <option value="0">Seleccione una opción</option>
                                            <option value="INTERNO">INTERNO</option>
                                            <option value="EXTERNO">EXTERNO</option>
                                        </Input>
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                    <Col xs="3">
                                        * Fecha de transacción:
                                    </Col>
                                    <Col xs="9">
                                        <Input
                                            type="date"
                                            name="fechaTransaccion"
                                            placeholder='DD/MM/AAAA'
                                            value={this.state.formBajaBautizadoCambioDomicilio.fechaTransaccion}
                                            onChange={this.onChangeBajaBautizadoCambioDomicilio}
                                        />
                                    </Col>
                                </Row>
                            </FormGroup>

                        </CardBody>
                        <CardFooter>
                            <Button
                                type="button"
                                onClick={this.cancelarFormulario}
                                color="secondary"
                                className="entreBotones"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                color="success"
                            >
                                <span className="fa fa-pencil"></span>Proceder
                            </Button>
                        </CardFooter>
                    </Form>
                </Card>
            </>
        )
    }
}
export default BajaBautizadoDefuncion
