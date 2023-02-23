import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
    Card, CardBody, CardFooter, CardHeader, CardTitle, Alert,
    Button, Modal, FormGroup, Input, Col, Row, Form, ModalBody, Container
} from 'reactstrap';
import helpers from '../../components/Helpers';
import './style.css'

class BajaBautizadoExcomunion extends Component {

    infoSesion = JSON.parse(localStorage.getItem('infoSesion'));

    constructor(props) {
        super(props)
        this.state = {
            personas: [],
            formBajaNoBautizadoAlejamiento: {},
            mensajeDelProceso: "",
            modalShow: false
        }
    }

    getBajaNoBautizadoAlejamiento = async () => {
        await helpers.authAxios.get(helpers.url_api + "/persona/GetNoBautizadosAlejamientoBySector/" + localStorage.getItem('sector'))
            .then(res => {
                this.setState({ personas: res.data.personas });
            });
        this.setState({ modalBajaNoBautizadoAlejamiento: !this.state.modalBajaNoBautizadoAlejamiento })
    }

    componentDidMount() {
        this.setState({
            formBajaNoBautizadoAlejamiento: {
                ...this.state.formBajaNoBautizadoAlejamiento,
                personaSeleccionada: '0',
                comentario: "",
                fechaTransaccion: '',
                idUsuario: this.infoSesion.pem_Id_Ministro
            },
        })
        this.getBajaNoBautizadoAlejamiento()
    }

    onChangeBajaNoBautizadoAlejamiento = (e) => {
        this.setState({
            formBajaNoBautizadoAlejamiento: {
                ...this.state.formBajaNoBautizadoAlejamiento,
                [e.target.name]: e.target.value.toUpperCase()
            }
        })
    }

    bajaNoBautizadoAlejamiento = async (e) => {
        e.preventDefault();
        var datos = this.state.formBajaNoBautizadoAlejamiento;

        if (datos.personaSeleccionada === '0'
            || datos.fechaTransaccion === ''
            || datos.fechaTransaccion === '01/01/1900') {
            alert('Error!\nDebe ingresar todos los datos requeridos.');
            return false;
        }
        try {
            await helpers.authAxios.post(`${helpers.url_api}/Persona/BajaNoBautizadoAlejamiento`, datos)
                .then(res => {
                    if (res.data.status === "success") {
                        // alert(res.data.mensaje);
                        setTimeout(() => { document.location.href = '/ListaDePersonal'; }, 1000);
                        this.setState({
                            mensajeDelProceso: "Procesando...",
                            modalShow: true
                        });
                        setTimeout(() => {
                            this.setState({
                                mensajeDelProceso: "Los datos fueron grabados satisfactoriamente."
                            });
                        }, 1000);
                        setTimeout(() => {
                            document.location.href = '/ListaDePersonal'
                        }, 1000);
                    } else {
                        // alert(res.data.mensaje);
                        this.setState({
                            mensajeDelProceso: "Procesando...",
                            modalShow: true
                        });
                        setTimeout(() => {
                            this.setState({
                                mensajeDelProceso: res.data.mensaje,
                                modalShow: false
                            });
                        }, 1000);
                    }
                });
        } catch (error) {
            alert("Error: Hubo un problema en la comunicacion con el servidor. Intente mas tarde.");
        }
    }

    render() {
        return (
            <Container>
                <Card>
                    <Form onSubmit={this.bajaNoBautizadoAlejamiento}>
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
                                            value={this.state.formBajaNoBautizadoAlejamiento.personaSeleccionada}
                                            name="personaSeleccionada"
                                            onChange={this.onChangeBajaNoBautizadoAlejamiento}
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
                                            name="comentario"
                                            value={this.state.formBajaNoBautizadoAlejamiento.comentario}
                                            onChange={this.onChangeBajaNoBautizadoAlejamiento}
                                        />
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                    <Col xs="3">
                                        * Fecha de transacción:
                                    </Col>
                                    <Col xs="3">
                                        <Input
                                            type="date"
                                            name="fechaTransaccion"
                                            placeholder='DD/MM/AAAA'
                                            value={this.state.formBajaNoBautizadoAlejamiento.fechaTransaccion}
                                            onChange={this.onChangeBajaNoBautizadoAlejamiento}
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
                {/*Modal success*/}
                <Modal isOpen={this.state.modalShow}>
                    <ModalBody>
                        {this.state.mensajeDelProceso}
                    </ModalBody>
                </Modal>
            </Container>
        )
    }
}
export default BajaBautizadoExcomunion
