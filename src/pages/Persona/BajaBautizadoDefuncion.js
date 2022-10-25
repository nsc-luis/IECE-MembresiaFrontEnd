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
            formBajaBautizadoDefuncion: {},
        }
    }

    getBajaBautizadoDefuncion = async () => {
        await helpers.authAxios.get(helpers.url_api + "/Persona/GetBautizadosComunionVivoBySector/" + localStorage.getItem('sector'))
            .then(res => {
                this.setState({ personas: res.data.personas });
            });
    }

    componentDidMount() {
        this.setState({
            formBajaBautizadoDefuncion: {
                ...this.state.formBajaBautizadoDefuncion,
                personaSeleccionada: '0',
                comentario: '',
                fechaTransaccion: ''
            },
        })
        this.getBajaBautizadoDefuncion()
    }

    onChangeBajaBautizadoDefuncion = (e) => {
        this.setState({
            formBajaBautizadoDefuncion: {
                ...this.state.formBajaBautizadoDefuncion,
                [e.target.name]: e.target.value.toUpperCase()
            }
        })
    }

    cancelarFormulario = () => {
        helpers.handle_LinkEncabezado("Seccion: Monitoreo", "Información de membresía")
        window.location = "/ListaDePersonal"
    }

    bajaBautizadoDefuncion = async (e) => {
        e.preventDefault();
        var datos = this.state.formBajaBautizadoDefuncion;

        if (datos.personaSeleccionada === '0'
            || datos.fechaDefuncion === '') {
            alert('Error!\nDebe ingresar todos los datos requeridos.');
            return false;
        }
        try {
            await helpers.authAxios.post(
                helpers.url_api + "/Persona/BajaBautizadoDefuncion/" + datos.personaSeleccionada +
                "/" + datos.comentarioDefuncion +
                "/" + datos.fechaDefuncion +
                "/" + this.infoSesion.pem_Id_Ministro)
                .then(res => {
                    if (res.data.status === "success") {
                        document.location.href = '/ListaDePersonal'
                    } else {
                        alert(res.data.mensaje);
                    }
                });
        } catch (error) {
            alert("Error: Hubo un problema en la comunicacion con el servidor. Intente mas tarde.");
        }
    }

    render() {
        return (
            <>
                <Card>
                    <Form onSubmit={this.bajaBautizadoDefuncion}>
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
                                            value={this.state.formBajaBautizadoDefuncion.personaSeleccionada}
                                            name="personaSeleccionada"
                                            onChange={this.onChangeBajaBautizadoDefuncion}
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
                                        Comentario:
                                    </Col>
                                    <Col xs="9">
                                        <Input
                                            type="text"
                                            name="comentarioDefuncion"
                                            value={this.state.formBajaBautizadoDefuncion.comentarioDefuncion}
                                            onChange={this.onChangeBajaBautizadoDefuncion}
                                        />
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
                                            name="fechaDefuncion"
                                            placeholder='DD/MM/AAAA'
                                            value={this.state.formBajaBautizadoDefuncion.fechaDefuncion}
                                            onChange={this.onChangeBajaBautizadoDefuncion}
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
