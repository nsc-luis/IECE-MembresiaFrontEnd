import React, { Component } from 'react';
import helpers from "../../components/Helpers";
import {
    Container, Button, Input, Modal, ModalBody, Label, Alert, CardFooter,
    CardTitle, Card, CardBody, Table, Row, Col, FormFeedback, Form, FormGroup, CardHeader
} from 'reactstrap';
import { Link } from 'react-router-dom';
import './style.css';

export default class AdministracionDistrital extends Component {

    infoSesion = JSON.parse(localStorage.getItem('infoSesion'));
    constructor(props) {
        super(props);
        this.state = {
            pem_Id_Ministro: "0",
            sec_Id_Sector: localStorage.getItem("sector"),
            dis_Id_Distrito: localStorage.getItem("dto"),
            idUsuario: this.infoSesion.pem_Id_Ministro,
            puesto: "0",
            personas: [],
            personalAdministrativo: [],
            pem_Id_MinistroInvalido: false,
            puestoInvalido: false,
            mostrarFormulario: false,
            mostrarBtnAsignarPuesto: true,
            submitBtnDisable: false,
        }
    }

    inicializarVariables = () => {
        console.log("Inicializando Variables")
        this.setState({
            pem_Id_Ministro: "0",

            dis_Id_Distrito: localStorage.getItem("dto"),
            idUsuario: this.infoSesion.pem_Id_Ministro,
            puesto: "0",
            pem_Id_MinistroInvalido: false,
            puestoInvalido: false,
            submitBtnDisable: false
        })
    }



    componentDidMount() {
        this.getPersonalAdministrativoByDistrito();
        this.getPersonalMinisterialByDistrito();
        //Sube el cursor hasta la parte superior
        window.scrollTo(0, 0);
    }




    onChange = (e) => {
        console.log("formulario cambió ", [e.target.name], e.target.value)
        this.setState({ [e.target.name]: e.target.value })
    }

    getPersonalMinisterialByDistrito = async () => {
        await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/PersonalMinisterial/GetPersonalMinisterialByDistrito/${localStorage.getItem('dto')}`)
            .then(res => {
                if (res.data.status === "success")
                    this.setState({ personas: res.data.administrativo })
                else {
                    alert("Error:\nNo se pudo consultar la lista de personas, favor de reportar o intentar mas tarde.")
                }
            })
        )
    }

    handle_BtnAsignarMostrarFormulario = () => {
        this.setState({
            mostrarFormulario: !this.state.mostrarFormulario,
            mostrarBtnAsignarPuesto: !this.state.mostrarBtnAsignarPuesto
        })

        this.inicializarVariables();
    }

    getPersonalAdministrativoByDistrito = async () => {
        await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/PersonalMinisterial/GetPersonalAdministrativoSecundarioByDistrito/${localStorage.getItem('dto')}`)

            .then(res => {
                console.log("personalAdministrativo: ", res.data.administrativo);
                this.setState({ personalAdministrativo: res.data.administrativo })
            })
        )
    }

    enviarInfo = async (e) => {
        e.preventDefault()

        if (this.state.submitBtnDisable) {
            return; // Evitar múltiples envíos si ya se está procesando
        }

        let info = {
            pem_Id_Ministro: this.state.pem_Id_Ministro,

            dis_Id_Distrito: this.state.dis_Id_Distrito,
            idUsuario: this.infoSesion.pem_Id_Ministro,
            puesto: this.state.puesto
        }

        console.log("info: ", info)
        if (this.state.pem_Id_Ministro === "0") {
            this.setState({
                pem_Id_MinistroInvalido: true
            })
            return false
        }

        if (this.state.puesto === "0") {
            this.setState({
                puestoInvalido: true
            })
            return false
        }

        // Envía el formulario si no hay errores
        this.setState({ submitBtnDisable: true });

        await helpers.validaToken().then(helpers.authAxios.post(`${helpers.url_api}/PersonalMinisterial/SetPersonalAdministrativoByDistrito`, info)
            .then(res => {
                if (res.data.status === "success") {
                    this.getPersonalAdministrativoByDistrito()
                    this.setState({
                        pem_Id_MinistroInvalido: false,
                        puestoInvalido: false,
                        pem_Id_Ministro: "0",
                        puesto: "0"
                    })
                }
            })
        )
        this.handle_BtnAsignarMostrarFormulario()
    }

    removerAsignacion = async (info) => {
        console.log("objeto a Borrar: ", info)
        await helpers.validaToken().then(helpers.authAxios.post(`${helpers.url_api}/PersonalMinisterial/RemoverAsignacionDeAdministracionDistrital/${localStorage.getItem("dto")}/${info.cargo}`)
            .then(res => {
                if (res.data.status === "success") {
                    this.getPersonalAdministrativoByDistrito()
                    this.setState({
                        pem_Id_MinistroInvalido: false,
                        puestoInvalido: false,
                        pem_Id_Ministro: "0",
                        puesto: "0"
                    })
                }
            })
        )
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
                                    <li>Para establecer una Nueva Designación Administrativa, presione el Botón <strong>"Nueva Designación"</strong>.</li>
                                    <li>Para dar de Baja una Designación Administrativa, seleccione el Botón <strong>"Dar de Baja"</strong> en el cargo respectivo.</li>
                                    <li> <strong>El personal cualificado</strong> para una designación de <strong>Cargo Administrativo</strong> debe ser del Personal Ministerial.</li>
                                    <li> Para ver a todos los Elementos del Personal Ministerial, asegúrese de que en cada Sector se haya realizado <strong>la Vinculación</strong> o <strong>la Alta</strong> del Personal Ministerial.</li>
                                </ul>
                            </Alert>
                        </Col>
                    </Row>
                </FormGroup>


                <div className="text-right pb-3">
                    {this.state.mostrarBtnAsignarPuesto &&
                        <FormGroup>
                            <Button
                                color="primary"
                                onClick={this.handle_BtnAsignarMostrarFormulario}
                            >
                                Nueva Designación
                            </Button>
                        </FormGroup>
                    }
                </div>

                {this.state.mostrarFormulario &&
                    <FormGroup>
                        <Form onSubmit={this.enviarInfo}  >
                            <Card className="border-info">
                                <CardHeader>
                                    <Alert color="warning">
                                        <h5>Los campos marcados con * son obligatorios.</h5>
                                    </Alert>
                                </CardHeader>
                                <CardBody>
                                    <FormGroup>
                                        <Row>
                                            <Col xs="2">
                                                * CARGO
                                            </Col>
                                            <Col xs="10">
                                                <Input
                                                    type="select"
                                                    name="puesto"
                                                    value={this.state.puesto}
                                                    onChange={this.onChange}
                                                    invalid={this.state.puestoInvalido}
                                                >
                                                    <option value="0">Selecciona un Cargo</option>
                                                    <option value="SECRETARIO">SECRETARIO</option>
                                                    <option value="SUBSECRETARIO">SUBSECRETARIO</option>
                                                    <option value="TESORERO">TESORERO</option>
                                                    <option value="SUBTESORERO">SUBTESORERO</option>
                                                </Input>
                                                <FormFeedback>Este campo es requerido</FormFeedback>
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                    <FormGroup>
                                        <Row>
                                            <Col xs="2">
                                                * PERSONAL MINISTERIAL
                                            </Col>
                                            <Col xs="10">
                                                <Input
                                                    type="select"
                                                    name="pem_Id_Ministro"
                                                    value={this.state.pem_Id_Ministro}
                                                    onChange={this.onChange}
                                                    invalid={this.state.pem_Id_MinistroInvalido}
                                                >
                                                    <option value="0">Selecciona una Persona</option>
                                                    {this.state.personas.map(persona => {
                                                        return (
                                                            <React.Fragment key={persona.pem_Id_Ministro}>
                                                                <option value={persona.pem_Id_Ministro}>{persona.pem_Nombre}</option>
                                                            </React.Fragment>
                                                        )
                                                    })}
                                                </Input>
                                                <FormFeedback>Este campo es requerido</FormFeedback>
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                </CardBody>
                                <CardFooter className="text-right pb-3">
                                    <Button
                                        onClick={this.handle_BtnAsignarMostrarFormulario}
                                        className="espacioEntreBotones"
                                    >
                                        <span className="fa fa-times faIconMarginRight"></span>
                                        Cancelar
                                    </Button>
                                    <Button
                                        color="success"
                                        disabled={this.state.submitBtnDisable}
                                    >
                                        <span className="fa fa-save faIconMarginRight"></span>
                                        Designar
                                    </Button>
                                </CardFooter>
                            </Card>
                        </Form>
                    </FormGroup>
                }

                <FormGroup>
                    <Card className="border-info">
                        <CardTitle>
                            <h4 className="text-center pt-4">PERSONAL ADMINISTRATIVO DEL DISTRITO</h4>
                        </CardTitle>
                        <CardBody>
                            <Table id="miTabla" className="table table-striped table-bordered table-sm bt-0">
                                <thead className="text-center bg-gradient-info">
                                    <th width="25%">CARGO</th>
                                    <th width="35%">NOMBRE</th>
                                    <th width="15%">GRADO</th>
                                    <th width="20%">ACCIÓN</th>
                                </thead>
                                <tbody>
                                    {this.state.personalAdministrativo.map((obj, index) => {
                                        return (
                                            <tr key={index}>
                                                <td><b>{obj.cargo}</b></td>
                                                <td>{obj.datosPersonalMinisterial != null ? obj.datosPersonalMinisterial.pem_Nombre : ""}</td>
                                                <td>{obj.datosPersonalMinisterial != null ? obj.datosPersonalMinisterial.pem_Grado_Ministerial : ""}</td>
                                                <td>
                                                    <div >
                                                        {obj.datosPersonalMinisterial != null && obj.cargo != 'PASTOR' ?
                                                            <button id="BotonAdministracion"
                                                                className="btn btn-danger"
                                                                onClick={() => this.removerAsignacion(obj)}
                                                            >
                                                                Baja de designación
                                                            </button>
                                                            : ""}
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                </FormGroup>
            </Container >
        )
    }
}