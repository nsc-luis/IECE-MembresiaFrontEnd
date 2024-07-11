import React, { Component } from 'react';
import {
    Container, Row, Col, Form, Input, Label,
    Button, FormFeedback, FormGroup, Card,
    CardHeader, CardBody, CardFooter,
    Modal, ModalBody, Alert
} from 'reactstrap';
import { Link } from 'react-router-dom';
import helpers from '../../components/Helpers';
import '../../assets/css/index.css';

class PresentacionDeNino extends Component {

    sector = localStorage.getItem('sector');
    infoSesion = JSON.parse(localStorage.getItem(this.infoSesion));

    constructor(props) {
        super(props);
        this.state = {
            listaDePresentaciones: [],
            listaDeNinos: [],
            status: true,
            modalFrmPresentacion: true,
            bolAgregarPresentacion: true,
            currentPresentacion: {},
            tituloModalFrmPresentacion: "Registro de una Presentación de Niños",
            nombreNino: "",
            ninoSelectInvalido: false,
            fechaPresentacionInvalida: false,
            ministroOficianteInvalido: false,
            modalShow: false,
            mensajeDelProceso: "",
            ministros: [],
            habilitaOtroMinistro: false,
            otroMinistro: "",
            submitBtnDisable: false,
            optionFamiliaCristianaSelected: true,
            optionFamiliaVisitanteSelected: false,
            nombreNinoVisitante: "",
            nombreNinoVisitanteInvalido: false
        }
        this.infoSesion = JSON.parse(localStorage.getItem('infoSesion'));
        this.msjNinoSelectInvalido = "Debe seleccionar al Niño(a) para continuar.";
    }

    componentDidMount() {
        this.setState({
            currentPresentacion: {
                ...this.state.currentPresentacion,
                per_Id_Persona: "0",
                pdn_Ministro_Oficiante: "",
                pdn_Fecha_Presentacion: null,
                sec_Id_Sector: localStorage.getItem("sector"),
                usu_Id_Usuario: this.infoSesion.pem_Id_Ministro
            }
        });
        this.getListaDePresentaciones(); //Trae los registros de las Presentaciones de Niños de ese Sector desde la Tabla 'Presentacion_Nino'. 
        this.getListaDeNinos(); //Trae la lista de niños del Sector y que No se encuentren en la Tabla 'Presentacion_Nino'
        this.getMinistrosAncianoActivo(); //Trae a los Ministros con grado de Anciano de Distrito
    }

    ChangeSubmitBtnDisable = (bol) => {//Sirve para evitar multiples registros por dobleclick en botón Submit
        this.setState({ submitBtnDisable: bol });
    }

    getListaDePresentaciones = async () => { //Trae los registros de las Presentaciones de Niños de ese Sector desde la Tabla 'Presentacion_Nino'. 
        await helpers.validaToken().then(helpers.authAxios.get(helpers.url_api + "/Presentacion_Nino/GetBySector/" + localStorage.getItem("sector"))
            .then(res => {
                this.setState({
                    listaDePresentaciones: res.data.presentaciones,
                    status: res.data.status
                })
            })
        )
    }

    getListaDeNinos = async () => {//Trae la lista de niños del Sector y que No se encuentren en la Tabla 'Presentacion_Nino'
        await helpers.validaToken().then(helpers.authAxios.get(helpers.url_api + "/Persona/GetListaNinosBySector/" + localStorage.getItem("sector"))
            .then(res => {
                this.setState({
                    listaDeNinos: res.data.listaDeNinos,
                    status: res.data.status
                })
            })
        )
    }

    getMinistrosAncianoActivo = async () => {//Trae a los Ministros con grado de Anciano de Distrito
        await helpers.validaToken().then(helpers.authAxios.get(helpers.url_api + "/PersonalMinisterial/GetMinistrosAncianoActivoByDistrito/" + localStorage.getItem("dto"))
            .then(res => {
                this.setState({ ministros: res.data.ministros })
            })
        );
    }

    handle_onChange = (e) => {//Al cambiar los Input Niño, MinistroOficiante o Fecha.
        this.setState({
            currentPresentacion: {
                ...this.state.currentPresentacion,
                [e.target.name]: e.target.value
            }
        });
        if (e.target.name === "pdn_Ministro_Oficiante") {
            if (e.target.value === "OTRO MINISTRO") { //Si elige la Opción Otro Ministro, debe Mostrar el Input 'otroMinistro'
                this.setState({ habilitaOtroMinistro: true, })
            }
            else {//Pero si es algun Ministro Registrado del Distrito, no Muestra el input de 'otroMinistro'
                this.setState({ otroMinistro: "", habilitaOtroMinistro: false })
            }
        }
        if (e.target.name === "nombreNinoVisitante") {
            this.setState({ nombreNinoVisitante: e.target.value.toUpperCase() })
        }
    }

    handle_OtroMinistro = (e) => { //Al cambiar el Input de Otro Mnistro, se graba en la varibale el Nombre del Ministro que se escribió
        this.setState({ otroMinistro: e.target.value.toUpperCase() });
        console.log("NuevoMinistro: ", e.target.value.toUpperCase())
    }

    validaFormatos = (formato, campo, estado) => {
        if (!helpers.regex[formato].test(campo)) {
            this.setState({
                [estado]: true
            })
        } else {
            this.setState({
                [estado]: false
            })
        }
    }

    handleBlur = () => {
        //Resetea el estado de Fecha Invalida para quitar la Alerta de error en controles input        
        let fechaTransaccionInvalida = !this.validateFechaTransaccion(this.state.currentPresentacion.pdn_Fecha_Presentacion);// Validación de la fecha: no anterior a 1924 ni posterior a la fecha actual
        // Si la fecha es inválida, actualiza el estado correspondiente
        this.setState({
            fechaPresentacionInvalida: fechaTransaccionInvalida ? true : false
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

    guardarPresentacion = async (e) => { //Gestiona la Transacción del Registro de la Presentación de Niños.
        e.preventDefault();

        if (this.state.submitBtnDisable) {
            return; // Evitar múltiples envíos si ya se está procesando
        }

        if (this.state.bolAgregarPresentacion) {

            this.setState({ //Verifica que los Inputs Obligatorios no vengan vacíos.
                ministroOficianteInvalido: this.state.currentPresentacion.pdn_Ministro_Oficiante === '' ? true : false,
                ninoSelectInvalido: this.state.optionFamiliaCristianaSelected === true && this.state.currentPresentacion.per_Id_Persona === '0' ? true : false,
                fechaPresentacionInvalida: this.state.currentPresentacion.pdn_Fecha_Presentacion === '' || this.state.currentPresentacion.pdn_Fecha_Presentacion === null ? true : false,
                nombreNinoVisitanteInvalido: this.state.optionFamiliaVisitanteSelected === true && this.state.nombreNinoVisitante === "" ? true : false
            })

            if (this.state.optionFamiliaCristianaSelected === true && this.state.currentPresentacion.per_Id_Persona === "0") return false;
            if (this.state.currentPresentacion.pdn_Fecha_Presentacion === "" || this.state.currentPresentacion.pdn_Fecha_Presentacion === null) return false;
            if (this.state.currentPresentacion.pdn_Ministro_Oficiante === "") return false;
            if (this.state.otroMinistro === "" && this.state.currentPresentacion.pdn_Ministro_Oficiante === "") return false;
            if (this.state.optionFamiliaVisitanteSelected === true && this.state.nombreNinoVisitante === "") return false;

            // Validación de la fecha: no anterior a 1924 ni posterior a la fecha actual
            let fechaTransaccionInvalida = !this.validateFechaTransaccion(this.state.currentPresentacion.pdn_Fecha_Presentacion);

            // Si la fecha es inválida, actualiza el estado correspondiente y detén el envío del formulario
            if (fechaTransaccionInvalida) {
                this.setState({
                    fechaPresentacionInvalida: true,
                });
                return;
            }

            //Para deshabilitar el botón y evitar multiples registros de Matrimonio y Ediciones de Persona
            this.ChangeSubmitBtnDisable(true)

            //Procede a enviar los datos de la Presentación a la API
            var info = this.state.currentPresentacion;
            info.pdn_Ministro_Oficiante = this.state.currentPresentacion.pdn_Ministro_Oficiante === "OTRO MINISTRO" ? this.state.otroMinistro : this.state.currentPresentacion.pdn_Ministro_Oficiante;
            info.nombreNinoVisitante = this.state.nombreNinoVisitante
            console.log("MinistroOficianteaAPI: ", info.pdn_Ministro_Oficiante);
            //Si es una Presentación de Niños de Familia Cristiana
            if (this.state.optionFamiliaCristianaSelected === true) {
                try {
                    helpers.validaToken().then(helpers.authAxios.post(`${helpers.url_api}/Presentacion_Nino/${localStorage.getItem("sector")}/${this.infoSesion.mu_pem_Id_Pastor}`, info)
                        .then(res => {
                            if (res.data.status === "success") {
                                alert("RECORDATORIO: No olvide Actualizar, si es aplicable, los datos de los Padres modificando el Número y Nombre de los Hijos.");
                                setTimeout(() => {
                                    this.setState({
                                        mensajeDelProceso: "Los datos fueron grabados satisfactoriamente.",
                                        modalShow: true
                                    });
                                }, 1000);
                                setTimeout(() => {
                                    document.location.href = '/ListaDePersonal'
                                }, 1500);
                            } else {
                                // alert(res.data.mensaje);
                                alert("Error: No se pudo guardar. Revise los datos ingresados");
                            }
                        })
                    );
                } catch (error) {
                    alert("Error: Hubo un problema en la comunicación con el servidor. Intente mas tarde.");
                    //setTimeout(() => { document.location.href = '/ListaDePersonal'; }, 1000);
                }
            }
            else {
                //Si es una Presentación de Niños de Visitantes
                try {
                    helpers.validaToken().then(helpers.authAxios.post(`${helpers.url_api}/Presentacion_Nino/PresentacionNinoVisitante/${localStorage.getItem("sector")}/${this.infoSesion.mu_pem_Id_Pastor}`, info)
                        .then(res => {
                            if (res.data.status === "success") {
                                alert("RECORDATORIO: Si se trata de un Nuevo Hijo en una Familia Cristiana, No olvide actualizar los datos de los Padres modificando el Número y Nombre de los Hijos.");
                                setTimeout(() => {
                                    this.setState({
                                        mensajeDelProceso: "Los datos fueron grabados satisfactoriamente.",
                                        modalShow: true
                                    });
                                }, 1000);
                                setTimeout(() => {
                                    document.location.href = '/ListaDePersonal'
                                }, 1500);
                            } else {
                                // alert(res.data.mensaje);
                                alert("Error: No se pudo guardar. Revise los datos ingresados");
                            }
                        })
                    );
                } catch (error) {
                    alert("Error: Hubo un problema en la comunicación con el servidor. Intente mas tarde.");
                    //setTimeout(() => { document.location.href = '/ListaDePersonal'; }, 1000);
                }
            }
        }
    }

    handleOptionChange = (option) => {
        if (option === 'A') {
            this.setState({
                optionFamiliaCristianaSelected: true,
                optionFamiliaVisitanteSelected: false
            });
        } else if (option === 'B') {
            this.setState({
                optionFamiliaCristianaSelected: false,
                optionFamiliaVisitanteSelected: true
            })
        }
        console.log("familiaCristiana:", this.state.optionFamiliaCristianaSelected)
        console.log("familiaVisitante", this.state.optionFamiliaVisitanteSelected)
    }
    render() {
        return (
            <>
                <Container>
                    <Container isOpen={this.state.modalFrmPresentacion}>
                        <FormGroup>
                            <Row>
                                <Col xs="12">
                                    <Alert color="warning">
                                        <strong>AVISO: </strong>
                                        <ul>
                                            <li>Para presentaciones de Niños de <strong>"Familia Cristiana"</strong> debe primeramente registrar al Niño en la membresía No Bautizada.</li>
                                            <li>Para presentaciones de Niños de <strong>"Familia Visitante"</strong> debe escribir el Nombre completo a Texto libre. Sólo se registrará la Presentación del Niño(a), pero el Infante no se agregará a la membresía No Bautizada.</li>
                                        </ul>
                                    </Alert>
                                </Col>
                            </Row>
                        </FormGroup>
                        <Form onSubmit={this.guardarPresentacion}>
                            <Card>
                                <CardHeader className="text-center">
                                    <h1>{this.state.tituloModalFrmPresentacion}</h1>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col sm="4">
                                            <Label>Tipo de Presentación:</Label>
                                        </Col>
                                        <Col className="pb-4">
                                            <div className="form-check">
                                                <input
                                                    class="form-check-input "
                                                    type="radio"
                                                    checked={this.state.optionFamiliaCristianaSelected}
                                                    onChange={() => this.handleOptionChange('A')}
                                                />
                                                <label class="form-check-label radio-label">
                                                    Presentación de Niño(a) de <b>Familia Cristiana</b>
                                                </label>
                                            </div>

                                            <div className="form-check">
                                                <input
                                                    class="form-check-input"
                                                    type="radio"
                                                    checked={this.state.optionFamiliaVisitanteSelected}
                                                    onChange={() => this.handleOptionChange('B')}
                                                />
                                                <label class="form-check-label radio-label">
                                                    Presentación de Niño(a) de <b>Familia Visitante</b>
                                                </label>

                                            </div>
                                        </Col>
                                    </Row>

                                    {this.state.optionFamiliaCristianaSelected && !this.state.optionFamiliaVisitanteSelected &&
                                        <FormGroup>
                                            <Row>
                                                <Col sm="4">
                                                    <Label>Niño(a):</Label>
                                                </Col>
                                                <Col sm="8">
                                                    <Input
                                                        name="per_Id_Persona"
                                                        type="select"
                                                        value={this.state.currentPresentacion.per_Id_Persona}
                                                        onChange={this.handle_onChange}
                                                        invalid={this.state.ninoSelectInvalido}
                                                    >
                                                        <option value="0">Selecciona un registro</option>
                                                        {
                                                            this.state.listaDeNinos.map(nino => {
                                                                return (
                                                                    <React.Fragment key={nino.per_Id_Persona}>
                                                                        <option value={nino.per_Id_Persona}> {nino.per_Nombre} {nino.per_Apellido_Paterno} {nino.per_Apellido_Materno} </option>
                                                                    </React.Fragment>
                                                                )
                                                            })
                                                        }
                                                    </Input>
                                                    <FormFeedback>{this.state.msjNinoSelectInvalido}</FormFeedback>
                                                </Col>
                                            </Row>
                                        </FormGroup>
                                    }
                                    {this.state.optionFamiliaVisitanteSelected && !this.state.optionFamiliaCristianaSelected &&
                                        <FormGroup>
                                            <Row>
                                                <Col sm="4">
                                                    <Label>Niño(a):</Label>
                                                </Col>
                                                <Col sm="8">
                                                    <Input
                                                        name="nombreNinoVisitante"
                                                        type="text"
                                                        value={this.state.nombreNinoVisitante}
                                                        onChange={this.handle_onChange}
                                                        invalid={this.state.nombreNinoVisitanteInvalido}
                                                    >
                                                    </Input>
                                                    <FormFeedback>{this.state.msjNinoSelectInvalido}</FormFeedback>
                                                </Col>
                                            </Row>
                                        </FormGroup>
                                    }

                                    <FormGroup>
                                        <Row>
                                            <Col sm="4">
                                                <Label>Ministro Oficiante:</Label>
                                            </Col>
                                            <Col sm="8">
                                                <Input
                                                    name="pdn_Ministro_Oficiante"
                                                    type="select"
                                                    value={this.state.currentPresentacion.pdn_Ministro_Oficiante}
                                                    onChange={this.handle_onChange}
                                                    invalid={this.state.ministroOficianteInvalido}
                                                >
                                                    <option value="0">Selecciona un Ministro</option>
                                                    {
                                                        this.state.ministros.map(ministro => {
                                                            return (
                                                                <React.Fragment key={ministro.pem_Id_Ministro}>
                                                                    <option value={ministro.pem_Nombre}>{ministro.pem_Nombre}</option>
                                                                </React.Fragment>
                                                            )
                                                        })
                                                    }
                                                    <option value="OTRO MINISTRO">OTRO MINISTRO</option>
                                                </Input>
                                                <FormFeedback>{helpers.msjRegexInvalido.alphaSpaceRequired}</FormFeedback>
                                            </Col>
                                        </Row>
                                    </FormGroup>

                                    {this.state.habilitaOtroMinistro &&
                                        <FormGroup>
                                            <Row>
                                                <Col sm="4">
                                                    <Label>Nombre del Ministro:</Label>
                                                </Col>
                                                <Col sm="8">
                                                    <Input
                                                        type="text"
                                                        name="otroMinistro"
                                                        value={this.state.otroMinistro}
                                                        onChange={this.handle_OtroMinistro}
                                                    />
                                                    <FormFeedback>{ }</FormFeedback>
                                                </Col>
                                            </Row>
                                        </FormGroup>
                                    }

                                    <FormGroup>
                                        <Row>
                                            <Col sm="4">
                                                <Label>Fecha de la Presentación:</Label>
                                            </Col>
                                            <Col sm="8">
                                                <Input
                                                    name="pdn_Fecha_Presentacion"
                                                    type="date"
                                                    value={this.state.currentPresentacion.pdn_Fecha_Presentacion}
                                                    onChange={this.handle_onChange}
                                                    invalid={this.state.fechaPresentacionInvalida}
                                                    onBlur={this.handleBlur}
                                                />
                                                <FormFeedback>¡Parece una Fecha Incorrecta! Favor de elegir una correcta</FormFeedback>
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                </CardBody>
                                <CardFooter>
                                    <div className="text-right pb-3">
                                        <Link
                                            to="/ListaDePersonal"
                                        >
                                            <Button type="button" color="secondary" className="entreBotones" >
                                                Cancelar
                                            </Button>
                                        </Link>
                                        <Button
                                            color="success"
                                            type="submit"
                                            disabled={this.state.submitBtnDisable}
                                        >
                                            <span className="fas fa-save  entreBotones"></span>Guardar
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        </Form>
                    </Container>
                </Container >
                {/*Modal success*/}
                < Modal isOpen={this.state.modalShow} >
                    {/* <ModalHeader>
                        Solo prueba.
                    </ModalHeader> */}
                    < ModalBody >
                        {this.state.mensajeDelProceso}
                    </ModalBody >
                    {/* <ModalFooter>
                        <Button color="secondary" onClick={this.handle_modalClose}>Cancel</Button>
                    </ModalFooter> */}
                </Modal >
            </ >
        )
    }
}

export default PresentacionDeNino;