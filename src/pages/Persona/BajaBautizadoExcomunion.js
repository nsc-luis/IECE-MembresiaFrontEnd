import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
    Card, CardBody, CardFooter, CardHeader, CardTitle, Alert,
    Button, Modal, FormGroup, Input, Col, Row, Form, ModalBody, Container
} from 'reactstrap';
import helpers from '../../components/Helpers';
import './style.css'
import Layout from '../Layout';

class BajaBautizadoExcomunion extends Component {

    infoSesion = JSON.parse(localStorage.getItem('infoSesion'));

    constructor(props) {
        super(props)
        this.state = {
            personas: [],
            formBajaBautizadoExcomunion: {},
        }
    }

    getBajaBautizadoExcomunion = async () => {
        await helpers.authAxios.get(helpers.url_api + "/Persona/GetBautizadosComunionBySector/" + localStorage.getItem('sector'))
            .then(res => {
                this.setState({ personas: res.data.personas });
            });
    }

    componentDidMount() {
        this.setState({
            formBajaBautizadoExcomunion: {
                ...this.state.bajaBautizadoExcomunion,
                personaSeleccionada: '0',
                tipoExcomunion: '0',
                excomunionDelito: '',
                fechaExcomunion: ''
            }
        })
        this.getBajaBautizadoExcomunion()
    }

    onChangeBajaBautizadoExcomunion = (e) => {
        this.setState({
            formBajaBautizadoExcomunion: {
                ...this.state.formBajaBautizadoExcomunion,
                [e.target.name]: e.target.value.toUpperCase()
            }
        })
    }

    bajaBautizadoExcomunion = async (e) => {
        e.preventDefault();
        var datos = this.state.formBajaBautizadoExcomunion;

        if (datos.personaSeleccionada === '0'
            || datos.tipoExcomunion === '0'
            || datos.excomunionDelito === ''
            || datos.fechaExcomunion === '') {
            alert('Error!\nDebe ingresar todos los datos requeridos.');
            return false;
        }
        try {
            await helpers.authAxios.post(
                helpers.url_api + "/Persona/BajaBautizadoExcomunion/" + datos.personaSeleccionada +
                "/" + datos.tipoExcomunion +
                "/" + datos.excomunionDelito +
                "/" + datos.fechaExcomunion +
                "/" + this.infoSesion.pem_Id_Ministro)
                .then(res => {
                    if (res.data.status === "success") {
                        // alert(res.data.mensaje);
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
                    <Form onSubmit={this.bajaBautizadoExcomunion}>
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
                                            value={this.state.formBajaBautizadoExcomunion.personaSeleccionada}
                                            name="personaSeleccionada"
                                            onChange={this.onChangeBajaBautizadoExcomunion}
                                        >
                                            <option value="0">Seleccione una Persona</option>
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
                                        * Tipo de Excomunión:
                                    </Col>
                                    <Col xs="9">
                                        <Input
                                            type="select"
                                            name="tipoExcomunion"
                                            value={this.state.formBajaBautizadoExcomunion.tipoExcomunion}
                                            onChange={this.onChangeBajaBautizadoExcomunion}
                                        >
                                            <option value="0">Seleccione una Opción</option>
                                            <option value="11102">Excomunión Temporal</option>
                                            <option value="11103">Excomunión</option>
                                        </Input>
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                    <Col xs="3">
                                        * Delito:
                                    </Col>
                                    <Col xs="9">
                                        <Input
                                            type="text"
                                            name="excomunionDelito"
                                            value={this.state.formBajaBautizadoExcomunion.excomunionDelito}
                                            onChange={this.onChangeBajaBautizadoExcomunion}
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
                                            name="fechaExcomunion"
                                            placeholder='DD/MM/AAAA'
                                            value={this.state.formBajaBautizadoExcomunion.fechaExcomunion}
                                            onChange={this.onChangeBajaBautizadoExcomunion}
                                        />
                                    </Col>
                                </Row>
                            </FormGroup>

                        </CardBody>
                        <CardFooter>
                        <Link
                                to="/ListaDePersonal"
                                onClick={() => helpers.handle_LinkEncabezado("Seccion: Monitoreo", "Información de membresía")}
                            >
                                <Button type="button" color="secondary" className="entreBotones">
                                    Cancelar
                                </Button>
                            </Link>
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
export default BajaBautizadoExcomunion
