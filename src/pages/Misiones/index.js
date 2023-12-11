import React, { Component } from 'react';
import helpers from "../../components/Helpers";
import {
    Container, Button, Input, Modal, ModalBody, Label, Alert, CardFooter,
    CardTitle, Card, CardBody, Table, Row, Col, FormFeedback, Form, FormGroup, CardHeader
} from 'reactstrap';

export default class Misiones extends Component {
    infoSesion = JSON.parse(localStorage.getItem('infoSesion'));
    constructor(props) {
        super(props)
        this.state = {
            misiones: [],
            showForm: false,
            ms_Alias: "",
            ms_AliasInvalid: false,
            editandoMision: false,
            currentMision: {}
        }
    }
    componentDidMount() {
        this.getMisiones()
        window.scrollTo(0, 0);
        this.setState({

        })
    }
    mostrarFormulario = () => {
        this.setState({ showForm: !this.state.showForm })
    }
    handleCancelar = () => {
        window.scrollTo(0, 0);
        this.setState({
            ms_Alias: "",
            showForm: !this.state.showForm,
            ms_AliasInvalid: false,
            editandoMision: false
        })
    }
    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    getMisiones = async () => {
        try {
            await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/Mision_Sector/${localStorage.getItem("sector")}`)
                .then(res => {
                    this.setState({ misiones: res.data.misiones })
                }))
        }
        catch (err) {
            alert("Error:\nNo se ha sido posible conectarse a la base de datos del sistema. Intente mas tarde.")
        }
    }
    enviarInfo = async (e) => {
        e.preventDefault()
        this.setState({
            ms_AliasInvalid: this.state.ms_Alias === "" ? true : false
        })
        if (this.state.ms_Alias === "") {
            return false
        }
        let info = {
            ms_Alias: this.state.ms_Alias,
            sec_Id_Sector: localStorage.getItem("sector"),
            Usu_Usuario: this.infoSesion.pem_Id_Ministro
        }
        if (!this.state.editandoMision) {
            try {
                await helpers.validaToken().then(helpers.authAxios.post(`${helpers.url_api}/Mision_Sector`, info)
                    .then(res => {
                        this.setState({ mision: res.data.mision })
                        this.handleCancelar()
                        this.getMisiones()
                    }))
            }
            catch (err) {
                alert("Error:\nNo se ha sido posible conectarse a la base de datos del sistema. Intente mas tarde.")
            }
        }
        else {
            try {
                await helpers.validaToken().then(helpers.authAxios.put(`${helpers.url_api}/Mision_Sector/${this.state.currentMision.ms_Id}`, info)
                    .then(res => {
                        this.setState({ mision: res.data.mision })
                        this.handleCancelar()
                        this.getMisiones()
                    }))
            }
            catch (err) {
                alert("Error:\nNo se ha sido posible conectarse a la base de datos del sistema. Intente mas tarde.")
            }
        }
        
    }
    formParaEditar = (info) => {
        this.setState({ 
            ms_Alias: info.ms_Alias,
            editandoMision: true,
            currentMision: info
        })
        this.mostrarFormulario()
    }
    baja = async(info) => {
        try {
            await helpers.validaToken().then(helpers.authAxios.post(`${helpers.url_api}/Mision_Sector/BajaDeMision/${info.ms_Id}`)
                .then(res => {
                    this.getMisiones()
                }))
        }
        catch (err) {
            alert("Error:\nNo se ha sido posible conectarse a la base de datos del sistema. Intente mas tarde.")
        }
    }

    render() {
        return (
            <Container>
                <FormGroup>
                    <Row>
                        <Col xs="12" style={{ textAlign: 'right' }}>
                            <Button
                                type="button"
                                color="primary"
                                onClick={this.mostrarFormulario}
                                hidden={this.state.showForm}
                            >
                                Registrar nueva mision
                            </Button>
                        </Col>
                    </Row>
                </FormGroup>

                {this.state.showForm &&
                    <FormGroup>
                        <Card>
                            <Form onSubmit={this.enviarInfo}>
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
                                                * Nombre de mision:
                                            </Col>
                                            <Col xs="9">
                                                <Input
                                                    type="text"
                                                    name="ms_Alias"
                                                    onChange={this.onChange}
                                                    value={this.state.ms_Alias}
                                                    invalid={this.state.ms_AliasInvalid}
                                                />
                                                <FormFeedback>Este campo es requerido</FormFeedback>
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                </CardBody>
                                <CardFooter>
                                    <Row>
                                        <Col xs="12" style={{ textAlign: 'right' }}>
                                            <Button
                                                type="button"
                                                color="secondary"
                                                className="entreBotones"
                                                onClick={this.handleCancelar}
                                            >
                                                Cancelar
                                            </Button>
                                            <Button
                                                type="submit"
                                                color="success"
                                            >
                                                <span className="fa fa-save"></span>Guardar
                                            </Button>
                                        </Col>
                                    </Row>
                                </CardFooter>
                            </Form>
                        </Card>
                    </FormGroup>
                }

                {this.state.misiones.length > 0 &&
                    <Card>
                        <CardHeader>
                            <h4>Misiones del sector</h4>
                        </CardHeader>
                        <CardBody>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Numero de mision</th>
                                        <th>Alias de mision</th>
                                        <th>Estado</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.misiones.map((mision) => {
                                        return (
                                            <tr key={mision.ms_Id}>
                                                <td>{mision.ms_Numero}</td>
                                                <td>{mision.ms_Alias}</td>
                                                <td>{mision.ms_Activo === true ? "Activo" : "Inactivo"}</td>
                                                <td>
                                                    <Button
                                                        color="success"
                                                        type="button"
                                                        onClick={() => this.formParaEditar(mision)}
                                                    >
                                                        <span className="fa fa-edit"></span>
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        color="danger"
                                                        type="button"
                                                        onClick={() => this.baja(mision)}
                                                    >
                                                        <span className="fa fa-times"></span>
                                                        Baja
                                                    </Button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                }
                {this.state.misiones.length < 1 &&
                    <h4>No Hay misiones registradas de este Sector</h4>
                }
            </Container>
        )
    }
}