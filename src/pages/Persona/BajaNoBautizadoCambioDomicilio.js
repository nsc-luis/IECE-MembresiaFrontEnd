import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
    Card, CardBody, CardFooter, CardHeader, CardTitle, Alert,
    Button, Modal, FormGroup, Input, Col, Row, Form, ModalBody, Container
} from 'reactstrap';
import helpers from '../../components/Helpers';
import './style.css'

class BajaBautizadoCambioDomicilio extends Component {

    infoSesion = JSON.parse(localStorage.getItem('infoSesion'));

    constructor(props) {
        super(props)
        this.state = {
            personas: [],
            formBajaNoBautizadoCambioDomicilio: {},
            mensajeDelProceso: "",
            modalShow: false
        }
    }

    componentDidMount() {
        this.setState({
            formBajaNoBautizadoCambioDomicilio: {
                ...this.state.formBajaNoBautizadoCambioDomicilio,
                idPersona: '0',
                tipoDestino: '0',
                fechaTransaccion: '',
                idUsuario: this.infoSesion.pem_Id_Ministro
            },
        })
        this.getBajaNoBautizadoCambioDomicilio()
    }

    getBajaNoBautizadoCambioDomicilio = async () => {
        await helpers.authAxios.get(helpers.url_api + "/Persona/GetNoBautizadosAlejamientoBySector/" + localStorage.getItem('sector'))
            .then(res => {
                this.setState({ personas: res.data.personas.sort((a,b)=>{
                    const nameA = a.per_Nombre; // ignore upper and lowercase
                    const nameB = b.per_Nombre; // ignore upper and lowercase
                    if (nameA < nameB) {
                      return -1;
                    }
                    if (nameA > nameB) {
                      return 1;
                    }

                    // names must be equal
                    return 0;
                }) });
            });
    }



    onChangeBajaNoBautizadoCambioDomicilio = (e) => {
        this.setState({
            formBajaNoBautizadoCambioDomicilio: {
                ...this.state.formBajaNoBautizadoCambioDomicilio,
                [e.target.name]: e.target.value.toUpperCase()
            }
        })
    }

    bajaNoBautizadoCambioDomicilio = async (e) => {
        e.preventDefault();
        if (this.state.formBajaNoBautizadoCambioDomicilio.per_Id_Persona === "0"
            || this.state.formBajaNoBautizadoCambioDomicilio.tipoDestino === "0"
            || this.state.formBajaNoBautizadoCambioDomicilio.fechaTransaccion === ""){
            alert("Error:\nDebe ingresar todos los datos requeridos.")
        }
        try {
            await helpers.authAxios.post(`${helpers.url_api}/Persona/BajaPersonaCambioDomicilio`, this.state.formBajaNoBautizadoCambioDomicilio)
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
                })
        }
        catch {
            alert("Error: Hubo un problema en la comunicacion con el servidor. Intente mas tarde.");
            // setTimeout(() => { document.location.href = '/ListaDePersonal'; }, 3000);
        }
    }

    render() {
        return (
            <Container>
                <Card>
                    <Form onSubmit={this.bajaNoBautizadoCambioDomicilio}>
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
                                            value={this.state.formBajaNoBautizadoCambioDomicilio.idPersona}
                                            name="idPersona"
                                            onChange={this.onChangeBajaNoBautizadoCambioDomicilio}
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
                                            value={this.state.formBajaNoBautizadoCambioDomicilio.tipoDestino}
                                            onChange={this.onChangeBajaNoBautizadoCambioDomicilio}
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
                                    <Col xs="3">
                                        <Input
                                            type="date"
                                            name="fechaTransaccion"
                                            placeholder='DD/MM/AAAA'
                                            value={this.state.formBajaNoBautizadoCambioDomicilio.fechaTransaccion}
                                            onChange={this.onChangeBajaNoBautizadoCambioDomicilio}
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
export default BajaBautizadoCambioDomicilio
