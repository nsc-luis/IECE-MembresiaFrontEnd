import React, { Component } from 'react';
import helpers from "../../components/Helpers";
import {
    Container, Button, Input, Modal, ModalBody, Label, Alert,
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
            comentarioTransaccion: "",
            historial: null
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
    onChange = async (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
        if (e.target.name === "per_Id_Persona" && e.target.value !== "0") {
            await helpers.authAxios.get(`${helpers.url_api}/Historial_Transacciones_Estadisticas/` + e.target.value)
                .then(res => {
                    this.setState({ historial: res.data.info });
                })
        }
        else if (e.target.name === "per_Id_Persona" && e.target.value === "0") {
            this.setState({ historial: null })
        }
    }
    guardarRegistroHistorico = async (e) => {
        e.preventDefault();
        if (this.state.per_Id_Persona === "0"
            && this.state.ct_Id_Codigo === "0"
            && (this.state.fechaTransaccion === null || this.state.fechaTransaccion === "")) {
            alert("Error:\nLos campos marcados con * son requeridos.");
            return false;
        }
        alert("Aun no se pueden guardar registros historicos extemporaneos.");
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col xs="12">
                        <Card>
                            <CardBody>
                                <Form onSubmit={this.guardarRegistroHistorico}>
                                    <FormGroup>
                                        <Row>
                                            <Col xs="12">
                                                <Alert color="warning">
                                                    <strong>AVISO: </strong>LOS CAMPOS MARCADOS CON * SON REQUERIDOS.
                                                </Alert>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="3">
                                                <Label>* Persona:</Label>
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
                                                <Label>* Transacción:</Label>
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
                                                <Label>* Fecha:</Label>
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
                                                <Label>Comentario:</Label>
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
                                                type="button"
                                                style={{ marginRight: "1em" }}
                                            >
                                                Cancelar
                                            </Button>
                                            <Button
                                                color="success"
                                                type="submit"
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
                {this.state.historial !== null &&
                    <Row>
                        <Col xs="12">
                            <table className="table table-striped border bt-0">
                                <thead className="bg-info">
                                    <tr>
                                        <th style={{ width: "10%" }}>Fecha</th>
                                        <th style={{ width: "12%" }}>Tipo_Mov</th>
                                        <th style={{ width: "15%" }}>SubTipo_Mov</th>
                                        <th style={{ width: "12%" }}>Comentarios</th>
                                        <th style={{ width: "25%" }}>Sector</th>
                                        <th style={{ width: "25%" }}>Distrito</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.historial.map((registro) => {
                                            return (
                                                <React.Fragment>
                                                    <tr key={registro.hte_Id_Transaccion}>
                                                        <td>{helpers.reFormatoFecha(registro.hte_Fecha_Transaccion)}</td>
                                                        <td>{registro.ct_Tipo}</td>
                                                        <td>{registro.ct_Subtipo}</td>
                                                        <td>{registro.hte_Comentario}</td>
                                                        <td>{registro.sec_Alias}</td>
                                                        <td>{registro.dis_Tipo_Distrito} {registro.dis_Numero}, {registro.dis_Alias}</td>
                                                    </tr>
                                                </React.Fragment>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </Col>
                    </Row>
                }
            </Container>
        )
    }
}

export default RegistrarTransaccionesHistoricas;