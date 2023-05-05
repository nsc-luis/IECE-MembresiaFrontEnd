import React, { Component } from 'react';
import {
    Container, Row, Col, Form, Input, Label,
    Button, FormFeedback, FormGroup, Card,
    CardHeader, CardBody, CardFooter,
    Modal, ModalBody,
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
            tituloModalFrmPresentacion: "Registro de Nueva Presentación de Niños",
            nombreNino: "",
            ninoSelectInvalido: false,
            fechaPresentacionInvalida: false,
            ministroOficianteInvalido: false,
            modalShow: false,
            mensajeDelProceso: "",
            ministros: [],
            habilitaOtroMinistro: false,
            otroMinistro: "",
            submitBtnDisable: false
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
        await helpers.authAxios.get(helpers.url_api + "/Presentacion_Nino/GetBySector/" + localStorage.getItem("sector"))
            .then(res => {
                this.setState({
                    listaDePresentaciones: res.data.presentaciones,
                    status: res.data.status
                })
            })
    }

    getListaDeNinos = async () => {//Trae la lista de niños del Sector y que No se encuentren en la Tabla 'Presentacion_Nino'
        await helpers.authAxios.get(helpers.url_api + "/Persona/GetListaNinosBySector/" + localStorage.getItem("sector"))
            .then(res => {
                this.setState({
                    listaDeNinos: res.data.listaDeNinos,
                    status: res.data.status
                })
            })
    }

    getMinistrosAncianoActivo = async () => {//Trae a los Ministros con grado de Anciano de Distrito
        await helpers.authAxios.get(helpers.url_api + "/PersonalMinisterial/GetMinistrosAncianoActivoByDistrito/" + localStorage.getItem("dto"))
            .then(res => {
                this.setState({ ministros: res.data.ministros })
            });
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

    guardarPresentacion = async (e) => { //Gestiona la Transacción del Registro de la Presentación de Niños.
        e.preventDefault();

        if (this.state.bolAgregarPresentacion) {

            this.setState({ //Verifica que los Inputs Obligatorios no vengan vacíos.
                ministroOficianteInvalido: this.state.currentPresentacion.pdn_Ministro_Oficiante === '' ? true : false,
                ninoSelectInvalido: this.state.currentPresentacion.per_Id_Persona === '0' ? true : false,
                fechaPresentacionInvalida: this.state.currentPresentacion.pdn_Fecha_Presentacion === '' || this.state.currentPresentacion.pdn_Fecha_Presentacion === null ? true : false
            })

            if (this.state.currentPresentacion.per_Id_Persona === "0") return false;
            if (this.state.currentPresentacion.pdn_Fecha_Presentacion === "" || this.state.currentPresentacion.pdn_Fecha_Presentacion === null) return false;
            if (this.state.currentPresentacion.pdn_Ministro_Oficiante === "") return false;
            if (this.state.otroMinistro === "" && this.state.currentPresentacion.pdn_Ministro_Oficiante === "") return false;

            //Para deshabilitar el botón y evitar multiples registros de Matrimonio y Ediciones de Persona
            this.ChangeSubmitBtnDisable(true)

            //Procede a enviar los datos de la Presentación a la API
            var info = this.state.currentPresentacion;
            info.pdn_Ministro_Oficiante = this.state.currentPresentacion.pdn_Ministro_Oficiante === "OTRO MINISTRO" ? this.state.otroMinistro : this.state.currentPresentacion.pdn_Ministro_Oficiante;
            console.log("MinistroOficianteaAPI: ", info.pdn_Ministro_Oficiante);
            try {
                helpers.authAxios.post(`${helpers.url_api}/Presentacion_Nino/${localStorage.getItem("sector")}/${this.infoSesion.mu_pem_Id_Pastor}`, info)
                    .then(res => {
                        if (res.data.status === "success") {
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
                    });
            } catch (error) {
                alert("Error: Hubo un problema en la comunicacion con el servidor. Intente mas tarde.");
                //setTimeout(() => { document.location.href = '/ListaDePersonal'; }, 1000);
            }
        }
    }

    render() {

        return (
            <>
                <Container>
                    <Container isOpen={this.state.modalFrmPresentacion}>
                        <Form onSubmit={this.guardarPresentacion}>
                            <Card>
                                <CardHeader className="text-center">
                                    <h1>{this.state.tituloModalFrmPresentacion}</h1>
                                </CardHeader>
                                <CardBody>
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
                                    {/* } */}
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
                                                />
                                                <FormFeedback>{helpers.msjRegexInvalido.formatoFecha}</FormFeedback>
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                </CardBody>
                                <CardFooter>
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
                                </CardFooter>
                            </Card>
                        </Form>
                    </Container>
                </Container>
                {/*Modal success*/}
                <Modal isOpen={this.state.modalShow}>
                    {/* <ModalHeader>
                        Solo prueba.
                    </ModalHeader> */}
                    <ModalBody>
                        {this.state.mensajeDelProceso}
                    </ModalBody>
                    {/* <ModalFooter>
                        <Button color="secondary" onClick={this.handle_modalClose}>Cancel</Button>
                    </ModalFooter> */}
                </Modal>
            </ >
        )
    }
}

export default PresentacionDeNino;