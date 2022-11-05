import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
    Card, CardBody, CardFooter, CardHeader, CardTitle, Alert,
    Button, Modal, FormGroup, Input, Col, Row, Form, ModalBody, Container
} from 'reactstrap';
import helpers from '../../components/Helpers';
import './style.css'

class BajaBautizadoDefuncion extends Component {

    infoSesion = JSON.parse(localStorage.getItem('infoSesion'));

    constructor(props) {
        super(props)
        this.state = {
            personas: [],
            formBajaNoBautizadoDefuncion: {},
            mensajeDelProceso: "",
            modalShow: false
        }
    }

    getBajaNoBautizadoDefuncion = async () => {
        await helpers.authAxios.get(helpers.url_api + "/Persona/GetNoBautizadosDefuncionBySector/" + localStorage.getItem('sector'))
            .then(res => {
                this.setState({ personas: res.data.personas });
            });
    }

    componentDidMount() {
        this.setState({
            formBajaNoBautizadoDefuncion: {
                ...this.state.formBajaNoBautizadoDefuncion,
                personaSeleccionada: '0',
                comentario: '',
                fechaTransaccion: '',
                idUsuario: this.infoSesion.pem_Id_Ministro
            },
        })
        this.getBajaNoBautizadoDefuncion()
    }

    onChangeBajaNoBautizadoDefuncion = (e) => {
        this.setState({
            formBajaNoBautizadoDefuncion: {
                ...this.state.formBajaNoBautizadoDefuncion,
                [e.target.name]: e.target.value.toUpperCase()
            }
        })
    }

    bajaNoBautizadoDefuncion = async (e) => {
        e.preventDefault();
        var datos = this.state.formBajaNoBautizadoDefuncion;

        if (datos.personaSeleccionada === '0'
            || datos.fechaTransaccion === '') {
            alert('Error!\nDebe ingresar todos los datos requeridos.');
            return false;
        }
        try {
            await helpers.authAxios.post(`${helpers.url_api}/Persona/BajaNoBautizadoDefuncion`, datos)
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
            // setTimeout(() => { document.location.href = '/ListaDePersonal'; }, 3000);
        }
    }

    render() {
        return (
            <>
                <Card>
                    <Form onSubmit={this.bajaNoBautizadoDefuncion}>
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
                                            value={this.state.formBajaNoBautizadoDefuncion.personaSeleccionada}
                                            name="personaSeleccionada"
                                            onChange={this.onChangeBajaNoBautizadoDefuncion}
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
                                            value={this.state.formBajaNoBautizadoDefuncion.comentario}
                                            onChange={this.onChangeBajaNoBautizadoDefuncion}
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
                                            name="fechaTransaccion"
                                            placeholder='DD/MM/AAAA'
                                            value={this.state.formBajaNoBautizadoDefuncion.fechaTransaccion}
                                            onChange={this.onChangeBajaNoBautizadoDefuncion}
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
            </>
        )
    }
}
export default BajaBautizadoDefuncion
