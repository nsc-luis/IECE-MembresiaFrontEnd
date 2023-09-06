import React, { Component } from 'react';
import helpers from "../../components/Helpers";
import {
    Container, Button, Input, Modal, ModalBody, Label, Alert, CardFooter,
    CardTitle, Card, CardBody, Table, Row, Col, FormFeedback, Form, FormGroup, CardHeader
} from 'reactstrap';
import { Link } from 'react-router-dom';
import './style.css';

export default class Administracion extends Component {

    infoSesion = JSON.parse(localStorage.getItem('infoSesion'));
    constructor(props) {
        super(props);
        this.state = {
            pem_Id_Ministro: "0",
            sec_Id_Sector: localStorage.getItem("sector"),
            idUsuario: this.infoSesion.pem_Id_Ministro,
            puesto: "",
            personas: [],
            personalAdministrativo: [],
            pem_Id_MinistroInvalido: false,
            puestoInvalido: false,
            mostrarFormulario: false,
            mostrarBtnAsignarPuesto: true
        }
    }

    componentDidMount() {
        this.getPersonalAdministrativoBySector();
        this.getPersonalMinisterialBySector();
        //Sube el cursor hasta la parte superior
        window.scrollTo(0, 0);
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    getPersonalMinisterialBySector = async () => {
        await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/PersonalMinisterial/GetPersonalMinisterialBySector/${localStorage.getItem('sector')}`)
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
    }

    getPersonalAdministrativoBySector = async () => {
        await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/PersonalMinisterial/GetPersonalAdministrativoBySector/${localStorage.getItem('sector')}`)
            .then(res => {
                this.setState({ personalAdministrativo: res.data.personalAdministrativo })
            })
        )
    }

    getPersonalMinisterialBySector = async () => {
        await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/PersonalMinisterial/GetPersonalMinisterialBySector/${localStorage.getItem('sector')}`)
            .then(res => {
                if (res.data.status === "success")
                    this.setState({ personas: res.data.administrativo })
                else {
                    alert("Error:\nNo se pudo consultar la lista de personas, favor de reportar o intentar mas tarde.")
                }
            })
        )
    }

    enviarInfo = async (e) => {
        e.preventDefault()
        let info = {
            pem_Id_Ministro: this.state.pem_Id_Ministro,
            sec_Id_Sector: this.state.sec_Id_Sector,
            idUsuario: this.infoSesion.pem_Id_Ministro,
            puesto: this.state.puesto
        }
        if (this.state.pem_Id_Ministro === "0" || this.state.puesto === "0") {
            this.setState({
                pem_Id_MinistroInvalido: true,
                puestoInvalido: true
            })
            return false
        }
        await helpers.validaToken().then(helpers.authAxios.post(`${helpers.url_api}/PersonalMinisterial/SetPersonalAdministrativoBySector`, info)
            .then(res => {
                if (res.data.status === "success") {
                    this.getPersonalAdministrativoBySector()
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
        await helpers.validaToken().then(helpers.authAxios.post(`${helpers.url_api}/PersonalMinisterial/removerAsignacionDeAdministracion/${localStorage.getItem("sector")}/${info.puesto}`)
            .then(res => {
                if (res.data.status === "success") {
                    this.getPersonalAdministrativoBySector()
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
                {this.state.mostrarBtnAsignarPuesto &&
                    <FormGroup>
                        <Button
                            color="primary"
                            onClick={this.handle_BtnAsignarMostrarFormulario}
                        >
                            Nueva asignacion
                        </Button>
                    </FormGroup>
                }

                {this.state.mostrarFormulario &&
                    <FormGroup>
                        <Form onSubmit={this.enviarInfo} >
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
                                                PUESTO *
                                            </Col>
                                            <Col xs="10">
                                                <Input
                                                    type="select"
                                                    name="puesto"
                                                    value={this.state.puesto}
                                                    onChange={this.onChange}
                                                    invalid={this.state.puestoInvalido}
                                                >
                                                    <option value="0">Selecciona un puesto</option>
                                                    <option value="secretario">Secretario</option>
                                                    <option value="subSecretario">SubSecretario</option>
                                                    <option value="tesorero">Tesorero</option>
                                                    <option value="subTesorero">SubTesorero</option>
                                                </Input>
                                                <FormFeedback>Este campo es requerido</FormFeedback>
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                    <FormGroup>
                                        <Row>
                                            <Col xs="2">
                                                PERSONAL MINISTERIAL *
                                            </Col>
                                            <Col xs="10">
                                                <Input
                                                    type="select"
                                                    name="pem_Id_Ministro"
                                                    value={this.state.pem_Id_Ministro}
                                                    onChange={this.onChange}
                                                    invalid={this.state.pem_Id_MinistroInvalido}
                                                >
                                                    <option value="0">Selecciona una persona</option>
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
                                <CardFooter>
                                    <Button
                                        onClick={this.handle_BtnAsignarMostrarFormulario}
                                        className="espacioEntreBotones"
                                    >
                                        <span className="fa fa-times faIconMarginRight"></span>
                                        Cancelar
                                    </Button>
                                    <Button
                                        color="success"
                                    >
                                        <span className="fa fa-save faIconMarginRight"></span>
                                        Guardar
                                    </Button>
                                </CardFooter>
                            </Card>
                        </Form>
                    </FormGroup>
                }

                <FormGroup>
                    <Card className="border-info">
                        <CardTitle>
                            <h4>Personal administrativo del sector.</h4>
                        </CardTitle>
                        <CardBody>
                            <Table className="table table-striped border bt-0">
                                <thead>
                                    <th>PUESTO</th>
                                    <th>NOMBRE</th>
                                    <th>GRADO</th>
                                    <th></th>
                                </thead>
                                <tbody>
                                    {this.state.personalAdministrativo.map((obj) => {
                                        return (
                                            <tr key={obj.id}>
                                                <td><i>{obj.puesto}</i></td>
                                                <td>{obj.personalMinisterial.length > 0 ? obj.personalMinisterial[0].pem_Nombre : ""}</td>
                                                <td>{obj.personalMinisterial.length > 0 ? obj.personalMinisterial[0].pem_Grado_Ministerial : ""}</td>
                                                <td>
                                                {obj.personalMinisterial.length > 0 ? <a href="#" onClick={() => this.removerAsignacion(obj)}>Remover asignación</a> : ""}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                </FormGroup>
            </Container>
        )
    }
}