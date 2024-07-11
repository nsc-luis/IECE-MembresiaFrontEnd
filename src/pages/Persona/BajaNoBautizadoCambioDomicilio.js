import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
    Card, CardBody, CardFooter, CardHeader, CardTitle, Alert,
    Button, Modal, FormGroup, Input, Col, Row, Form, ModalBody, Container, FormFeedback
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
            modalShow: false,
            fechaTransaccionInvalida: false,
            submitting: false //Sirve para cntrolar botón de Enviar Solicitud a API
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
            }
        })
        this.getBajaNoBautizadoCambioDomicilio()
    }

    getBajaNoBautizadoCambioDomicilio = async () => {
        await helpers.validaToken().then(helpers.authAxios.get(helpers.url_api + "/Persona/GetNoBautizadosAlejamientoBySector/" + localStorage.getItem('sector'))
            .then(res => {
                this.setState({
                    personas: res.data.personas.sort((a, b) => {
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
                    })
                });
            })
        );
    }



    onChangeBajaNoBautizadoCambioDomicilio = (e) => {
        console.log("Persona: ", e.target.value)

        this.setState({
            formBajaNoBautizadoCambioDomicilio: {
                ...this.state.formBajaNoBautizadoCambioDomicilio,
                [e.target.name]: e.target.value.toUpperCase()
            }
        })
    }

    handleBlur = () => {
        //Resetea el estado de Fecha Invalida para quitar la Alerta de error en controles input        
        let fechaTransaccionInvalida = !this.validateFechaTransaccion(this.state.formBajaNoBautizadoCambioDomicilio.fechaTransaccion);// Validación de la fecha: no anterior a 1924 ni posterior a la fecha actual
        // Si la fecha es inválida, actualiza el estado correspondiente
        this.setState({
            fechaTransaccionInvalida: fechaTransaccionInvalida ? true : false
        });
    }

    validateFechaTransaccion = (fecha) => {
        // Validación de la fecha: no anterior a 1924 ni posterior a la fecha actual
        const fechaSeleccionada = new Date(fecha);
        const fechaLimiteInferior = new Date('1924-01-01');
        const fechaActual = new Date();

        console.log(fechaSeleccionada, ("fechas", fechaSeleccionada >= fechaLimiteInferior && fechaSeleccionada <= fechaActual))
        return fechaSeleccionada >= fechaLimiteInferior && fechaSeleccionada <= fechaActual;
    };


    bajaNoBautizadoCambioDomicilio = async (e) => {
        e.preventDefault();

        if (this.state.submitting) {
            return; // Evitar múltiples envíos si ya se está procesando
        }

        console.log("info: ", this.state.formBajaNoBautizadoCambioDomicilio)
        if (this.state.formBajaNoBautizadoCambioDomicilio.idPersona == "0"
            || this.state.formBajaNoBautizadoCambioDomicilio.tipoDestino == "0"
            || this.state.formBajaNoBautizadoCambioDomicilio.fechaTransaccion === "") {
            alert("Error:\nDebe ingresar todos los datos requeridos.")
            return false;
        }

        // Validación de la fecha: no anterior a 1924 ni posterior a la fecha actual
        let fechaTransaccionInvalida = !this.validateFechaTransaccion(this.state.formBajaNoBautizadoCambioDomicilio.fechaTransaccion);

        // Si la fecha es inválida, actualiza el estado correspondiente y detén el envío del formulario
        if (fechaTransaccionInvalida) {
            this.setState({
                fechaTransaccionInvalida: true,
            });
            return;
        }

        this.setState({ submitting: true }); //Controla la propiedad disabled del Botón de Submit para evitar multiples clicks

        try {
            await helpers.validaToken().then(helpers.authAxios.post(`${helpers.url_api}/Persona/BajaPersonaCambioDomicilio`, this.state.formBajaNoBautizadoCambioDomicilio)
                .then(res => {
                    if (res.data.status === "success") {
                        // alert(res.data.mensaje);
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
                            document.location.href = '/Main'
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
            )
        }
        catch {
            alert("Error: Hubo un problema en la comunicacion con el servidor. Intente mas tarde.");
            // setTimeout(() => { document.location.href = '/ListaDePersonal'; }, 3000);
        }
    }

    render() {
        return (
            <Container>
                <FormGroup>
                    <Row>
                        <Col xs="12">
                            <Alert color="warning">
                                <strong>AVISO: </strong>
                                <ul>
                                    <li><strong>Tipo de Destino Interno</strong> aplica a cambios de domicilio en el mismo Distrito. Esta Baja se contabilizan a nivel Sector pero no a nivel Distrito.</li>
                                    <li><strong>Tipo de Destino Externo</strong> aplica a cambios de domicilio a otro Distrito. Esta Baja Se contabiliza a nivel Sector y a nivel Distrito</li>
                                    <li>Este tipo de Baja de Personal, activa una bandera para que esta persona pueda ser vista desde otros Sectores o Distritos.</li>
                                </ul>
                            </Alert>
                        </Col>
                    </Row>
                </FormGroup>
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
                                            invalid={this.state.fechaTransaccionInvalida}
                                            onBlur={this.handleBlur}
                                        />
                                        <FormFeedback>¡Parece una Fecha Incorrecta! Favor de elegir una correcta</FormFeedback>
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
                                disabled={this.state.submitting}
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
