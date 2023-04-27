import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
    Card, CardBody, CardFooter, CardHeader, CardTitle, Alert, Label, ButtonGroup, Typography,
    Button, Modal, FormGroup, Input, Col, Row, Form, ModalBody, Container, FormFeedback
} from 'reactstrap';
import helpers from '../../components/Helpers';
import './style.css'
import Layout from '../Layout';

class BajaBautizadoCambioDomicilio extends Component {

    infoSesion = JSON.parse(localStorage.getItem('infoSesion'));

    constructor(props) {
        super(props)
        this.state = {
            personas: [],
            formBajaBautizadoCambioDomicilio: {},
            rSelected: false
        }
    }

    componentDidMount() {
        this.setState({
            formBajaBautizadoCambioDomicilio: {
                ...this.state.formBajaBautizadoCambioDomicilio,
                idPersona: '0',
                tipoDestino: '0',
                fechaTransaccion: '',
                idUsuario: this.infoSesion.pem_Id_Ministro,
                bajaPorBajaDePadres: false,
                ultimoBautizado: false
            }
        })
        this.getBajaBautizadoCambioDomicilio()
    }

    //Al cambiar el estado del Botón, se actualiza el estado de rSelected y el del atributo/argumento bajaPorCambioDePadres que se envía a la API
    onRadioBtnClick(rSelected) {
        this.setState({
            rSelected,
            formBajaBautizadoCambioDomicilio: {
                ...this.state.formBajaBautizadoCambioDomicilio,
                bajaPorBajaDePadres: rSelected,
            }
        });
    }

    getBajaBautizadoCambioDomicilio = async () => {
        await helpers.validaToken().then(helpers.authAxios.get(helpers.url_api + "/Persona/GetBautizadosBySector/" + localStorage.getItem('sector'))
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



    onChangeBajaBautizadoCambioDomicilio = async (e) => {
        this.setState({ //Se va conformando el Objeto FORMBAJABAUTIZADOCAMBIO DOMICILIO cada Input que se Actualiza
            formBajaBautizadoCambioDomicilio: {
                ...this.state.formBajaBautizadoCambioDomicilio,
                [e.target.name]: e.target.value.toUpperCase()
            }
        })

        //Lógica para saber si esta persona en proceso es la última bautizada para determinar si se deba de dar de baja el hogar y demás integrantes No Bautizados.
        if (e.target.name === "idPersona") { // Si el input que cambia es el Select idPersona, trae los datos del Hogar de esa persona
            await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/Hogar_Persona/GetHogarByPersona/${e.target.value}`)
                .then(res => {
                    var cuentaMiembros = 0;
                    res.data.datosDelHogarPorPersona.miembros.forEach(miembro => { //Cuenta los miembros del Hogar
                        cuentaMiembros = cuentaMiembros + 1;
                    });

                    //Lógica para Activar o Sesactivar el estado de la Variable "ultimoBautizado"
                    if (res.data.status === "success" && res.data.datosDelHogarPorPersona.bautizadosVivos === 1) {//Si es el último bautizado en el Hogar
                        this.setState({
                            formBajaBautizadoCambioDomicilio: {
                                ...this.state.formBajaBautizadoCambioDomicilio,
                                ultimoBautizado: cuentaMiembros > 1 ? true : false //si solo hay 1 bautizado, pero hay mas integrantes , activa el estado de la Variable 'ultimoBautizado'
                            }
                        })
                    }
                    else { //Si no es el último bautizado, DeActiva el estado de la variable 'ultimoBautizado'
                        this.setState({
                            formBajaBautizadoCambioDomicilio: {
                                ...this.state.formBajaBautizadoCambioDomicilio,
                                ultimoBautizado: false
                            }
                        })
                    }
                })
            )
        }
    }

    bajaBautizadoCambioDomicilio = async (e) => {
        e.preventDefault();
        //Si está vacío algun campo REQUERIDO
        if (this.state.formBajaBautizadoCambioDomicilio.idPersona === "0"
            || this.state.formBajaBautizadoCambioDomicilio.tipoDestino === "0"
            || this.state.formBajaBautizadoCambioDomicilio.fechaTransaccion === "") {
            alert("Error:\nDebe ingresar todos los datos requeridos.")
            return false;
        }
        try { //Procede a realizar la Transacción de Baja Por Cambio de Domicilio enviando el Objeto 'formBajaBautizadoCambioDomicilio'
            await helpers.validaToken().then(helpers.authAxios.post(`${helpers.url_api}/Persona/BajaPersonaCambioDomicilio`, this.state.formBajaBautizadoCambioDomicilio)
                .then(res => {
                    if (res.data.status === "success") {
                        document.location.href = '/ListaDePersonal'
                    } else {
                        alert(res.data.mensaje);
                    }
                })
            )
        }
        catch {
            alert("Error: Hubo un problema en la comunicación con el Servidor. Intente mas tarde.");
        }
    }

    render() {

        return (
            <Container>
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
                                    <Col xs="3">
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
                            {this.state.formBajaBautizadoCambioDomicilio.ultimoBautizado &&
                                <>
                                    <FormGroup>
                                        <Row>
                                            <Col xs="12">
                                                <FormGroup>
                                                    <Alert color="info">
                                                        <strong>ADVERTENCIA: </strong>
                                                        La persona seleccionada es la última persona BAUTIZADA en el Hogar, pero existen miembros NO bautizados en el mismo, los cuales se darán de Baja automáticamente.
                                                        Debe elegir el Tipo de Baja que aplicará para los miembros No Bautizados. Las opciones son:
                                                        <ul>
                                                            <li><strong>Por Cambio de Domicilio.</strong> La baja de los miembros NO bautizados se realiza por concepto de "Baja por cambio de domicilio".</li>
                                                            <li><strong>Por Baja de Padres.</strong> La baja de los miembros NO bautizados se realiza por concepto de "Baja por padres".</li>
                                                        </ul>
                                                    </Alert>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                    <FormGroup>
                                        <Row>
                                            <Col xs="3">
                                                <FormGroup>
                                                    <Label><strong>Seleccione el Tipo de Baja de los miembros NO bautizados:</strong></Label>
                                                </FormGroup>
                                            </Col>
                                            <Col xs="9">
                                                <FormGroup>
                                                    <ButtonGroup>
                                                        <Button size="sm" color="info" onClick={() => this.onRadioBtnClick(false)} active={!this.state.rSelected}>Por cambio de domicilio</Button>
                                                        <Button size="sm" color="info" onClick={() => this.onRadioBtnClick(true)} active={this.state.rSelected}>Por baja de padres</Button>
                                                    </ButtonGroup>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                </>
                            }
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
            </Container>
        )
    }
}
export default BajaBautizadoCambioDomicilio
