import React, { Component } from 'react';
import helpers from "../../components/Helpers";
import {
    Container, Button, Input, Modal, ModalBody, Label,
    CardTitle, Card, CardBody, Table, Row, Col, FormFeedback, Form, FormGroup
} from 'reactstrap';

class RegistrarTransaccionesHistoricas extends Component {

    infoSesion = JSON.parse(localStorage.getItem('infoSesion'));
    constructor(props) {
        super(props);
        this.state = {
            personas: [],
            transacciones: [],
            per_Id_Persona: "0",
            ct_Id_Codigo: "0",
            fechaTransaccion: null,
            comentarioTransaccion: ""
        }
    }
    componentDidMount() {
        this.getPersonas();
        this.getTransacciones();
    }
    getPersonas = async () => {
        await helpers.authAxios.get(`${helpers.url_api}/persona/GetBySector/${localStorage.getItem("sector")}`)
            .then(res => {
                this.setState({ personas: res.data });
            })
    }
    getTransacciones = async () => {
        await helpers.authAxios.get(`${helpers.url_api}/Codigo_Transacciones_Estadisticas/`)
        .then(res => {
            this.setState({ transacciones: res.data.resultado });
        })
    }
    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col xs="12">
                        <Card>
                            <CardBody>
                                <Form>
                                    <FormGroup>
                                        <Row>
                                            <Col xs="3">
                                                <Label>Persona:</Label>
                                            </Col>
                                            <Col xs="9">
                                                <Input
                                                    type="select"
                                                    name="per_Id_Persona"
                                                    value={this.state.per_Id_Persona}
                                                    onChange={this.onChange}
                                                >
                                                    <option value="0">Seleccionar una persona</option>
                                                    {this.state.personas.map((obj) => {
                                                        return (
                                                            <React.Fragment key={obj.persona.per_Id_Persona}>
                                                                <option value={obj.persona.per_Id_Persona}>{obj.persona.per_Nombre} {obj.persona.per_Apellido_Paterno} {obj.persona.per_Apellido_Materno}</option>
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
                                                <Label>Transacción:</Label>
                                            </Col>
                                            <Col xs="9">
                                                <Input
                                                    type="select"
                                                    name="ct_Id_Codigo"
                                                    onChange={this.onChange}
                                                    value={this.state.ct_Id_Codigo}
                                                >
                                                    <option value="0">Selecciona una transacción</option>
                                                    {this.state.transacciones.map((obj) => {
                                                        return (
                                                            <React.Fragment key={obj.ct_Id_Codigo}>
                                                                <option value={obj.ct_Id_Codigo}>{obj.ct_Tipo} | {obj.ct_Subtipo}</option>
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
                                                <Label>Fecha:</Label>
                                            </Col>
                                            <Col xs="3">
                                                <Input
                                                    type="date"
                                                    name="fechaTransaccion"
                                                    value={this.state.fechaTransaccion}
                                                    onChange={this.onChange}
                                                />
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                    <FormGroup>
                                        <Row>
                                            <Col xs="3">
                                                <Label>Persona:</Label>
                                            </Col>
                                            <Col xs="9">
                                                <Input
                                                    type="text"
                                                    name="comentarioTransaccion"
                                                    value={this.state.comentarioTransaccion}
                                                    onChange={this.onChange}
                                                />
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                    <FormGroup>
                                        <Row>
                                            <Button
                                                color="secondary"
                                            >
                                                Cancelar
                                            </Button>
                                            <Button
                                                color="success"
                                            >
                                                Aceptar
                                            </Button>
                                        </Row>
                                    </FormGroup>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default RegistrarTransaccionesHistoricas;