import React, { Component } from 'react';
import helpers from "../../components/Helpers";
import {
    Container, Button, Input, Modal, ModalBody, Label, Alert,
    CardTitle, Card, CardBody, Table, Row, Col, FormFeedback, Form, FormGroup, CardHeader
} from 'reactstrap';
import axios from 'axios';
import Sectores from './Sectores';

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
            historial: null,
            distritos: [],
            dis_Id_Distrito: "0",
            sectores: [],
            sec_Id_Sector: "0",
            perIdPersonaInvalid: false,
            ctIdCodigoInvalid: false,
            fechaTransaccionInvalid: false,
            disIdDistritoInvalid: false,
            secIdSectorInvalid: false
        }
    }
    componentDidMount() {
        this.getPersonas();
        this.getTransacciones();
        this.getDistritos();
    }
    getDistritos = async () => {
        await axios.get(`${helpers.url_api}/Distrito`)
            .then(res => {
                this.setState({
                    distritos: res.data.distritos
                })
            })
    }
    getPersonas = async () => {
        await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/persona/GetBySector/${localStorage.getItem("sector")}`)
            .then(res => {
                this.setState({ personas: res.data });
            })
        )
    }
    getTransacciones = async () => {
        await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/Codigo_Transacciones_Estadisticas/`)
            .then(res => {
                this.setState({ transacciones: res.data.resultado });
            })
        )
    }
    onChange = async (e) => {
        this.setState({
            [e.target.name]: e.target.value.toUpperCase()
        })
        if (e.target.name === "per_Id_Persona" && e.target.value !== "0") {
            await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/Historial_Transacciones_Estadisticas/` + e.target.value)
                .then(res => {
                    this.setState({ historial: res.data.info });
                })
            )
        }
        else if (e.target.name === "per_Id_Persona" && e.target.value === "0") {
            this.setState({ historial: null })
        }
        else if (e.target.name === "dis_Id_Distrito" && e.target.value !== "0") {
            await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/Sector/GetSectoresByDistrito/` + e.target.value)
                .then(res => {
                    if (res.data.status === true) {
                        this.setState({ sectores: res.data.sectores });
                    }
                })
            )
        }
        else if (e.target.name === "dis_Id_Distrito" && e.target.value === "0") {
            this.setState({ sectores: [] })
        }
    }
    guardarRegistroHistorico = async (e) => {
        e.preventDefault();

        this.setState({//Si algun Input veiene vacío, se Activa las Variables de 'Invaliciones'
            ctIdCodigoInvalid: this.state.ct_Id_Codigo === "0" ? true : false,
            perIdPersonaInvalid: this.state.per_Id_Persona === "0" ? true : false,
            disIdDistritoInvalid: this.state.dis_Id_Distrito === "0" ? true : false,
            secIdSectorInvalid: this.state.sec_Id_Sector === "0" ? true : false,
            fechaTransaccionInvalid: this.state.fechaTransaccion === null || this.state.fechaTransaccion === "" ? true : false,
        })
        //Guarda en variables los datos de los Inputs.
        let ctIdCodigoInvalid = this.state.per_Id_Persona === "0" ? true : false;
        let perIdPersonaInvalid = this.state.per_Categoria === "0" ? true : false;
        let disIdDistritoInvalid = this.state.dis_Id_Distrito === "0" ? true : false;
        let secIdSectorInvalid = this.state.sec_Id_Sector === "0" ? true : false;
        let fechaTransaccionInvalid = this.state.fechaTransaccion === null || this.state.fechaTransaccion === "" ? true : false;

        if (ctIdCodigoInvalid || perIdPersonaInvalid || secIdSectorInvalid
            || disIdDistritoInvalid || fechaTransaccionInvalid) {
            return false;
        }
        else {
            let comentarioTransaccion = this.state.comentarioTransaccion == "" ? "-" : this.state.comentarioTransaccion;
            await helpers.validaToken().then(helpers.validaToken().then(helpers.authAxios.post(`${helpers.url_api}/Historial_Transacciones_Estadisticas/RegistroHistorico/${this.state.per_Id_Persona}/${this.state.sec_Id_Sector}/${this.state.ct_Id_Codigo}/${comentarioTransaccion}/${this.state.fechaTransaccion}/${this.infoSesion.pem_Id_Ministro}`)
                .then(res => {
                    if (res.data.status === "success") {
                        window.location = "/ListaDePersonal";
                    }
                    else {
                        alert(res.data.mensaje);
                    }
                })
            ));
        }

    }

    render() {
        return (
            <Container>
                <Row>
                    <Col xs="12">
                        <Card>
                            <CardHeader>
                                <h3 className="text-sm-center">TRANSACCIONES EXTEMPORANEAS</h3>
                            </CardHeader>
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
                                                    invalid={this.state.ctIdCodigoInvalid}
                                                >
                                                    <option value="0">Selecciona una transacción</option>
                                                    <option value="11002">ALTA POR RESTITUCIÓN</option>
                                                    <option value="11003">ALTA POR CAMBIO DE DOMICILIO INTERNO</option>
                                                    <option value="11004">ALTA POR CAMBIO DE DOMICILIO EXTERNO</option>
                                                    <option value="11101">BAJA POR DEFUNCIÓN</option>
                                                    <option value="11102">BAJA POR EXCOMUNIÓN TEMPORAL</option>
                                                    <option value="11103">BAJA POR EXCOMUNIÓN</option>
                                                    <option value="11104">BAJA POR CAMBIO DE DOMICILIO INTERNO</option>
                                                    <option value="11105">BAJA POR CAMBIO DE DOMICILIO EXTERNO</option>
                                                    <option value="21001">MATRIMONIO</option>
                                                    <option value="21102">LEGALIZACIÓN MATRIMONIAL</option>
                                                    <option value="23203">PRESENTACIÓN DE NIÑOS</option>
                                                    {/* {this.state.transacciones.map((obj) => {
                                                        return (
                                                            <React.Fragment key={obj.ct_Id_Codigo}>
                                                                <option value={obj.ct_Id_Codigo}>{obj.ct_Tipo} | {obj.ct_Subtipo}</option>
                                                            </React.Fragment>
                                                        )
                                                    })} */}
                                                </Input>
                                                <FormFeedback>Este campo es requerido</FormFeedback>
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                    <FormGroup>
                                        <Row>
                                            <Col xs="3">
                                                <label>* Distrito</label>
                                            </Col>
                                            <Col xs="9">
                                                <Input
                                                    type="select"
                                                    name="dis_Id_Distrito"
                                                    className="form-control"
                                                    onChange={this.onChange}
                                                    value={this.state.dis_Id_Distrito}
                                                    invalid={this.state.disIdDistritoInvalid}
                                                >
                                                    <option value="0">Seleccione un distrito</option>
                                                    {
                                                        this.state.distritos.map((distrito) => {
                                                            return (
                                                                <option key={distrito.dis_Id_Distrito} value={distrito.dis_Id_Distrito}>
                                                                    {distrito.dis_Tipo_Distrito}:&nbsp;
                                                                    {distrito.dis_Numero}, &nbsp;
                                                                    {distrito.dis_Alias}, &nbsp;
                                                                    {distrito.dis_Area}
                                                                </option>
                                                            )
                                                        })
                                                    }
                                                </Input>
                                                <FormFeedback>Este campo es requerido</FormFeedback>
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                    {this.state.dis_Id_Distrito !== "0" &&
                                        <Sectores
                                            onChange={this.onChange}
                                            sec_Id_Sector={this.state.sec_Id_Sector}
                                            sectores={this.state.sectores}
                                            secIdSectorInvalid={this.state.secIdSectorInvalid}
                                        />
                                    }
                                    <FormGroup>
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
                                                    invalid={this.state.perIdPersonaInvalid}
                                                >
                                                    <option value="0">Seleccionar una persona</option>
                                                    {this.state.personas.map((obj) => {
                                                        return (
                                                            <React.Fragment key={obj.persona.per_Id_Persona}>
                                                                <option value={obj.persona.per_Id_Persona}>{obj.persona.per_Nombre} {obj.persona.apellidoPrincipal} {obj.persona.per_Apellido_Materno}</option>
                                                            </React.Fragment>
                                                        )
                                                    })}
                                                </Input>
                                                <FormFeedback>Este campo es requerido</FormFeedback>
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
                                            <Col xs="3">
                                                <Label>* Fecha:</Label>
                                            </Col>
                                            <Col xs="3">
                                                <Input
                                                    type="date"
                                                    name="fechaTransaccion"
                                                    value={this.state.fechaTransaccion}
                                                    onChange={this.onChange}
                                                    invalid={this.state.fechaTransaccionInvalid}
                                                />
                                                <FormFeedback>Este campo es requerido</FormFeedback>
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                    <FormGroup>
                                        <Row>
                                            <Button
                                                color="secondary"
                                                type="button"
                                                style={{ marginRight: "1em" }}
                                                onClick={() => { window.location = "/ListaDePersonal" }}
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