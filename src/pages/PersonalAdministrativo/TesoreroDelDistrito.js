import React, { Component } from 'react';
import helpers from "../../components/Helpers";
import {
    Container, Button, Input, Modal, ModalBody, Label, Alert, CardFooter,
    CardTitle, Card, CardBody, Table, Row, Col, FormFeedback, Form, FormGroup, CardHeader
} from 'reactstrap';
import { Link } from 'react-router-dom';
import './style.css';

export default class TesoreroDelDistrito extends Component {

    infoSesion = JSON.parse(localStorage.getItem('infoSesion'));
    constructor(props) {
        super(props);
        this.state = {
            infoNvoTesorero: {
                pem_Id_Ministro: "0",
                dis_Id_Distrito: localStorage.getItem("dto"),
                idUsuario: this.infoSesion.pem_Id_Ministro,
                comentario: "",
                fecha: null
            },
            personas: [],
            tesorero: [],
            pemIdMinistroInvalido: false,
            modal: false,
            submitting: false
        }
    }

    componentDidMount() {
        this.getTesoreroByDistrito();
        this.getPersonalMinisterialByDistrito();
        //Sube el cursor hasta la parte superior
        window.scrollTo(0, 0);
    }
    onChange = (e) => {
        this.setState({
            infoNvoTesorero: {
                ...this.state.infoNvoTesorero,
                [e.target.name]: e.target.value
            }
        })
    }
    getTesoreroByDistrito = async () => {
        await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/PersonalMinisterial/GetTesoreroByDistrito/${localStorage.getItem('dto')}`)
            .then(res => {
                if (res.data.status === "success" && res.data.infoTesorero.length > 0)
                    this.setState({ tesorero: res.data.infoTesorero[0] })
                else {
                    this.setState({ tesorero: [] })
                }
            })
        )
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
    handleModal = () => {
        this.setState({ modal: !this.state.modal })
    }

    setTesoreroDelSector = async (e) => {
        e.preventDefault();

        if (this.state.submitting) {
            return; // Evitar múltiples envíos si ya se está procesando
        }

        if (this.state.infoNvoTesorero.pem_Id_Ministro === "0") {
            this.setState({ pemIdMinistroInvalido: true })
            return false
        }

        if (this.state.infoNvoTesorero.fecha == null) {
            alert("Favor de indicar la fecha de la designación de este cargo")
            return false
        }

        this.handleModal();

        this.setState({ submitting: true }); //Controla la propiedad disabled del Botón de Submit para evitar multiples clicks

        await helpers.validaToken().then(helpers.authAxios.post(`${helpers.url_api}/PersonalMinisterial/SetTesoreroDelDistrito`, this.state.infoNvoTesorero)
            .then(res => {
                if (res.data.status === "success") {
                    window.location.reload()
                }
                else {
                    this.handleModal();
                    alert("Error:\nNo se pudo actualizar el registro del tesorero del sector, favor de reportar o intentar mas tarde.")
                }
            })
        )
    }

    render() {
        return (
            <Container>
                <Card>
                    <Form onSubmit={this.setTesoreroDelSector}>
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
                                            onChange={this.onChange}
                                            name="pem_Id_Ministro"
                                            value={this.state.infoNvoTesorero.pem_Id_Ministro}
                                            invalid={this.state.pemIdMinistroInvalido}
                                        >
                                            <option value="0">Seleccione una persona</option>
                                            {this.state.personas.map((persona) => {
                                                return (
                                                    <React.Fragment key={persona.pem_Id_Ministro}>
                                                        <option value={persona.pem_Id_Ministro}>{persona.pem_Nombre}</option>
                                                    </React.Fragment>
                                                )
                                            })
                                            }
                                        </Input>
                                        <FormFeedback>Este campo es requerido</FormFeedback>
                                    </Col>
                                </Row>
                            </FormGroup>

                            <FormGroup>
                                <Row>
                                    <Col xs="3">
                                        TESORERO ACTUAL DEL DISTRITO :
                                    </Col>
                                    <Col xs="9">
                                        <Input
                                            type="text"
                                            value={this.state.tesorero.pem_Nombre !== null ? this.state.tesorero.pem_Nombre : ""}
                                            disabled
                                        />
                                    </Col>
                                </Row>
                            </FormGroup>

                            {/* <FormGroup>
                                <Row>
                                    <Col xs="3">
                                        Comentario (opcional):
                                    </Col>
                                    <Col xs="9">
                                        <Input
                                            type="text"
                                            onChange={this.onChange}
                                            name="comentario"
                                            value={this.state.infoNvoTesorero.comentario}
                                        />
                                    </Col>
                                </Row>
                            </FormGroup> */}

                            <FormGroup>
                                <Row>
                                    <Col xs="3">
                                        * Fecha de designación:
                                    </Col>
                                    <Col xs="3">
                                        <Input
                                            type="date"
                                            name="fecha"
                                            placeholder='DD/MM/AAAA'
                                            onChange={this.onChange}
                                            value={this.state.infoNvoTesorero.fecha}
                                            invalid={this.state.fechaInvalida}
                                        />
                                        <FormFeedback>Este campo es requerido</FormFeedback>
                                    </Col>
                                </Row>
                            </FormGroup>
                        </CardBody>
                        <CardFooter>
                            <Link
                                to="/ListaDePersonal"
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
                                <span className="fa fa-hand-handing-usd faIconMarginRight"></span>Establecer como Tesorero
                            </Button>
                        </CardFooter>
                    </Form>
                </Card>
                <Modal isOpen={this.state.modal}>
                    <ModalBody>
                        Procesando...
                    </ModalBody>
                </Modal>
            </Container>
        )
    }
}