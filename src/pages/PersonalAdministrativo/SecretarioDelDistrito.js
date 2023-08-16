import React, { Component } from 'react';
import helpers from "../../components/Helpers";
import {
    Container, Button, Input, Modal, ModalBody, Label, Alert, CardFooter,
    CardTitle, Card, CardBody, Table, Row, Col, FormFeedback, Form, FormGroup, CardHeader
} from 'reactstrap';
import { Link } from 'react-router-dom';
import './style.css';

export default class SecretarioDelDistrito extends Component {

    infoSesion = JSON.parse(localStorage.getItem('infoSesion'));
    constructor(props) {
        super(props);
        this.state = {
            infoNvoSecretarioDto: {
                pem_Id_Ministro: "0",
                dis_Id_Distrito: localStorage.getItem("dto"),
                idUsuario: this.infoSesion.pem_Id_Ministro,
                comentario: "",
                fecha: null
            },
            personas: [],
            secretario: [],
            pemIdMinistroInvalido: false,
            modal: false
        }
    }

    componentDidMount() {
        this.getSecretarioByDistrito();
        this.getPersonalMinisterialByDistrito();
        //Sube el cursor hasta la parte superior
        window.scrollTo(0, 0);
    }

    onChange = (e) => {
        this.setState({
            infoNvoSecretarioDto: {
                ...this.state.infoNvoSecretarioDto,
                [e.target.name]: e.target.value
            }
        })
    }

    getSecretarioByDistrito = async () => {
        await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/PersonalMinisterial/GetSecretarioByDistrito/${localStorage.getItem('dto')}`)
            .then(res => {
                if (res.data.status === "success" && res.data.infoSecretario.length > 0)
                    this.setState({ secretario: res.data.infoSecretario[0] })
                else {
                    this.setState({ secretario: [] })
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

    setSecretarioDelDistrito = async (e) => {
        e.preventDefault();
        if (this.state.infoNvoSecretarioDto.pem_Id_Ministro === "0") {
            this.setState({ pemIdMinistroInvalido: true })
            return false
        }

        if (this.state.infoNvoSecretarioDto.fecha == null) {
            alert("Favor de indicar la fecha de la designación de este cargo")
            return false
        }
        this.handleModal();
        await helpers.validaToken().then(helpers.authAxios.post(`${helpers.url_api}/PersonalMinisterial/SetSecretarioDelDistrito`, this.state.infoNvoSecretarioDto)
            .then(res => {
                if (res.data.status === "success") {
                    window.location.reload()
                }
                else {
                    this.handleModal();
                    alert("Error:\nNo se pudo actualizar el registro del secretario del sector, favor de reportar o intentar mas tarde.")
                }
            })
        )
    }

    render() {
        return (
            <Container>
                <Card>
                    <Form onSubmit={this.setSecretarioDelDistrito}>
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
                                            value={this.state.infoNvoSecretarioDto.pem_Id_Ministro}
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
                                        SECRETARIO ACTUAL DEL DISTRITO:
                                    </Col>
                                    <Col xs="9">
                                        <Input
                                            type="text"
                                            value={this.state.secretario.pem_Nombre}
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
                                            value={this.state.infoNvoSecretarioDto.comentario}
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
                                            value={this.state.infoNvoSecretarioDto.fecha}
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
                            >
                                <span className="fa fa-edit faIconMarginRight"></span>Establecer como Secretario
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