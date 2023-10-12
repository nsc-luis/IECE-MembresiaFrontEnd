import React, { Component } from 'react';
import helpers from "../../components/Helpers";
import {
    Container, Button, Input, Modal, ModalBody, Label, Alert, CardFooter,
    CardTitle, Card, CardBody, Table, Row, Col, FormFeedback, Form, FormGroup, CardHeader
} from 'reactstrap';
import { Link } from 'react-router-dom';

export default class OrganismoInterno extends Component {

    infoSesion = JSON.parse(localStorage.getItem('infoSesion'));
    constructor(props) {
        super(props);
        this.state = {
            organismosInternos: [],
            mensajeDelProceso: "Procesando...",
            modalShow: false,
            showForm: false,
            showDeptoInfantil: false,
            organismoInterno: {},
            org_Id: "0",
            cargo: "0",
            per_Id_Persona: "0",
            org_IdInvalid: false,
            cargoInvalid: false,
            per_Id_PersonaInvalid: false,
            personas: [],
            mostrarCargosSuplentes: false
        }
    }

    componentDidMount() {
        this.getOrganismosInternosBySector();
        window.scrollTo(0, 0);
        this.setState({
            org_Id: "0",
            cargo: "0",
            per_Id_Persona: "0"
        })
    }

    activaModal = () => {
        this.setState({ modalShow: !this.state.modalShow })
    }

    handleCancelar = () => {
        window.scrollTo(0, 0);
        this.setState({
            org_Id: "0",
            cargo: "0",
            per_Id_Persona: "0",
            showForm: !this.state.showForm
        })
    }

    mostrarFormulario = () => {
        this.setState({ showForm: !this.state.showForm })
    }

    onChangeOI = async (e) => {
        this.setState({ [e.target.name]: e.target.value })

        if (e.target.name === "org_Id" && e.target.value === "0") {
            this.setState({
                cargo: "0",
                per_Id_Persona: "0",
                personas: [],
                mostrarCargosSuplentes: false,

            })
        }

        if (e.target.name === "org_Id" && e.target.value !== "0")
            await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/Organismo_Interno/${e.target.value}`)
                .then(res => {
                    console.log("Data: ", res.data);
                    if (res.data.orgInt.org_Categoria === "FEMENIL") {
                        helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/Organismo_Interno/GetMujeresBySector/${localStorage.getItem('sector')}`)
                            .then(res => {
                                this.setState({ personas: res.data.mujeres })
                            }))
                    }
                    if (res.data.orgInt.org_Categoria === "JUVENIL") {
                        helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/Organismo_Interno/GetJovenesBySector/${localStorage.getItem('sector')}`)
                            .then(res => {
                                this.setState({ personas: res.data.jovenes })
                            }))
                    }
                    if (res.data.orgInt.org_Categoria === "INFANTIL") {
                        helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/Organismo_Interno/GetNinosBySector/${localStorage.getItem('sector')}`)
                            .then(res => {
                                this.setState({ personas: res.data.ninos })
                            }))
                    }
                    if (res.data.orgInt.org_Tipo_Organismo === "SOCIEDAD") {
                        this.setState({ mostrarCargosSuplentes: true })
                    }
                    else {
                        this.setState({ mostrarCargosSuplentes: false })
                    }
                }))
    }

    getOrganismosInternosBySector = async () => {
        try {
            await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/Organismo_Interno/GetBySector/${localStorage.getItem('sector')}`)
                .then(res => {
                    console.log("REspuesta: ", res.data.organismosInternos)
                    if (res.data.status === "success") {
                        this.setState({ organismosInternos: res.data.organismosInternos })
                    }
                    else {
                        alert(res.data.mensaje)
                    }
                }))
        }
        catch {
            alert("ERROR!\nOcurrio un problema al consultar la información, cierre la aplicación y vuelva a intentar.")
        }
    }

    enviarInfo = async (e) => {
        e.preventDefault()

        this.setState({
            org_IdInvalid: this.state.org_Id === "0" ? true : false,
            cargoInvalid: this.state.cargo === "0" ? true : false,
            per_Id_PersonaInvalid: this.state.per_Id_Persona === "0" ? true : false
        })

        if (this.state.org_Id === "0"
            || this.state.cargo === "0"
            || this.state.per_Id_Persona === "0") {
            return false
        }

        var asignacion = {
            cargo: this.state.cargo,
            per_Id_Persona: this.state.per_Id_Persona
        }

        await helpers.validaToken().then(helpers.authAxios.put(`${helpers.url_api}/Organismo_Interno/${this.state.org_Id}`, asignacion)
            .then(res => {
                if (res.data.status === "success") {
                    this.getOrganismosInternosBySector()
                    this.setState({
                        org_Id: "0",
                        cargo: "0",
                        per_Id_Persona: "0",
                        org_IdInvalid: false,
                        cargoInvalid: false,
                        per_Id_PersonaInvalid: false,
                        showForm: false
                    })
                }
                else {
                    alert(res.data.mensaje)
                }
            })
        )
    }

    borrarAsignacion = async (objeto, puesto) => {
        var asignacion = {
            cargo: puesto,
            per_Id_Persona: 0
        }

        await helpers.validaToken().then(helpers.authAxios.put(`${helpers.url_api}/Organismo_Interno/${objeto.oi.org_Id}`, asignacion)
            .then(res => {
                if (res.data.status === "success") {
                    this.getOrganismosInternosBySector()
                    this.setState({
                        org_Id: "0",
                        cargo: "0",
                        per_Id_Persona: "0",
                        org_IdInvalid: false,
                        cargoInvalid: false,
                        per_Id_PersonaInvalid: false,
                        showForm: false
                    })
                }
                else {
                    alert(res.data.mensaje)
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
                                    <li>Para regsitrar un Nuevo Cargo Administrativo de un Organismo Interno, presione el Botón <strong>"Registrar Cargo Nuevo"</strong>.</li>
                                    <li>Para dar de Baja un Cargo Administrativo ya existente, seleccione el Botón <strong>"Dar de Baja"</strong> en el cargo respectivo.</li>
                                    <li>Para dar de Alta a un Nuevo Organismo Interno bastará con enviar el Acta de Organización respectiva a las Dirección General.</li>
                                </ul>
                            </Alert>
                        </Col>
                    </Row>
                </FormGroup>
                <FormGroup>
                    <Row>
                        <Col xs="12" style={{ textAlign: 'right' }}>
                            <Button
                                type="button"
                                color="primary"
                                onClick={this.mostrarFormulario}
                                hidden={this.state.showForm}
                            >
                                Registrar Cargo Nuevo
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
                                                * ORGANISMO INTERNO:
                                            </Col>
                                            <Col xs="9">
                                                <Input
                                                    type="select"
                                                    name="org_Id"
                                                    onChange={this.onChangeOI}
                                                    value={this.state.org_Id}
                                                    invalid={this.state.org_IdInvalid}
                                                >
                                                    <option value="0">Seleccione el tipo de organismo</option>
                                                    {this.state.organismosInternos.map((orgInt) => {
                                                        return (
                                                            <React.Fragment key={orgInt.oi.org_Id}>
                                                                <option value={orgInt.oi.org_Id}>{orgInt.oi.org_Tipo_Organismo} {orgInt.oi.org_Categoria} {orgInt.oi.org_Nombre}</option>
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
                                                * CARGO:
                                            </Col>
                                            <Col xs="9">
                                                <Input
                                                    type="select"
                                                    name="cargo"
                                                    onChange={this.onChangeOI}
                                                    value={this.state.cargo}
                                                    invalid={this.state.cargoInvalid}
                                                >
                                                    <option value="0">Seleccione una categoria</option>
                                                    <option value="presidente">Presidente</option>
                                                    {this.state.mostrarCargosSuplentes &&
                                                        <option value="vicePresidente">Vice-Presidente</option>
                                                    }
                                                    <option value="secretario">Secretario(a)</option>
                                                    {this.state.mostrarCargosSuplentes &&
                                                        <option value="subSecretario">Sub-Secretario(a)</option>
                                                    }
                                                    <option value="tesorero">Tesorero(a)</option>
                                                    {this.state.mostrarCargosSuplentes &&
                                                        <option value="subTesorero">Sub-Tesorero(a)</option>
                                                    }
                                                </Input>
                                                <FormFeedback>Este campo es requerido</FormFeedback>
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
                                                    name="per_Id_Persona"
                                                    onChange={this.onChangeOI}
                                                    value={this.state.per_Id_Persona}
                                                    invalid={this.state.per_Id_PersonaInvalid}
                                                >
                                                    <option value="0">Selecciona una persona</option>
                                                    {this.state.personas.map((p) => {
                                                        return (
                                                            <React.Fragment key={p.per_Id_Persona}>
                                                                <option value={p.per_Id_Persona}> {p.per_Nombre} {p.per_Apellido_Paterno} {p.per_Apellido_Materno} </option>
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
                                                <span className="fa fa-users faIconMarginRight"></span>Registrar Cargo
                                            </Button>
                                        </Col>
                                    </Row>
                                </CardFooter>
                            </Form>
                        </Card>
                    </FormGroup>
                }

                {this.state.organismosInternos.length > 0 &&
                    this.state.organismosInternos.map((obj) => (
                        <FormGroup key={obj.oi.org_Id}>
                            <Card>
                                <CardHeader style={{ textAlign: "center" }}>
                                    <h4>{obj.oi.org_Tipo_Organismo} {obj.oi.org_Categoria} '<b>{obj.oi.org_Nombre}</b>'</h4>
                                </CardHeader>
                                <CardBody>
                                    <table className="table table-striped table-bordered table-sm">
                                        <thead className="text-center bg-gradient-info">
                                            <tr>
                                                <th width="20%">CARGO</th>
                                                <th width="60%">NOMBRE</th>
                                                <th width="20%">ACCIÓN</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {obj.oi.org_Tipo_Organismo === "DEPARTAMENTO" &&
                                                <>
                                                    <tr>
                                                        <td><strong>Presidente</strong></td>
                                                        <td>{obj.presidente !== null ? `${obj.presidente.per_Nombre_Completo}` : "--"}</td>
                                                        <td className='text-center'>
                                                            {obj.presidente !== null ?
                                                                <Button
                                                                    type="button"
                                                                    className="btn btn-danger btn-sm"
                                                                    onClick={() => this.borrarAsignacion(obj, "presidente")}
                                                                >
                                                                    Dar de Baja
                                                                </Button>
                                                                : ""
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Secretario(a)</strong></td>
                                                        <td>{obj.secretario !== null ? `${obj.secretario.per_Nombre_Completo}` : "--"}</td>
                                                        <td className='text-center'>
                                                            {obj.secretario !== null ?
                                                                <Button
                                                                    type="button"
                                                                    className="btn btn-danger btn-sm"
                                                                    onClick={() => this.borrarAsignacion(obj, "secretario")}
                                                                >
                                                                    Dar de Baja
                                                                </Button>
                                                                : ""
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Tesorero(a)</strong></td>
                                                        <td>{obj.tesorero !== null ? `${obj.tesorero.per_Nombre_Completo}` : "--"}</td>
                                                        <td className='text-center'>
                                                            {obj.tesorero !== null ?
                                                                <Button
                                                                    type="button"
                                                                    className="btn btn-danger btn-sm"
                                                                    onClick={() => this.borrarAsignacion(obj, "tesorero")}

                                                                >
                                                                    Dar de Baja
                                                                </Button>
                                                                : ""
                                                            }
                                                        </td>
                                                    </tr>
                                                </>
                                            }
                                            {obj.oi.org_Tipo_Organismo === "SOCIEDAD" &&
                                                <>
                                                    <tr>
                                                        <td><strong>Presidente</strong></td>
                                                        <td>{obj.presidente !== null ? `${obj.presidente.per_Nombre_Completo}` : "--"}</td>
                                                        <td className='text-center'>
                                                            {obj.presidente !== null ?
                                                                <Button
                                                                    type="button"
                                                                    className="btn btn-danger btn-sm"
                                                                    onClick={() => this.borrarAsignacion(obj, "presidente")}
                                                                >
                                                                    Dar de Baja
                                                                </Button>
                                                                : ""
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Vice-Presidente</strong></td>
                                                        <td>{obj.vicePresidente !== null ? `${obj.vicePresidente.per_Nombre_Completo}` : "--"}</td>
                                                        <td className='text-center'>
                                                            {obj.vicePresidente !== null ?
                                                                <Button
                                                                    type="button"
                                                                    className="btn btn-danger btn-sm"
                                                                    onClick={() => this.borrarAsignacion(obj, "vicePresidente")}
                                                                >
                                                                    Dar de Baja
                                                                </Button>
                                                                : ""
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Secretario(a)</strong></td>
                                                        <td>{obj.secretario !== null ? `${obj.secretario.per_Nombre_Completo}` : "--"}</td>
                                                        <td className='text-center'>
                                                            {obj.secretario !== null ?
                                                                <Button
                                                                    type="button"
                                                                    className="btn btn-danger btn-sm"
                                                                    onClick={() => this.borrarAsignacion(obj, "secretario")}
                                                                >
                                                                    Dar de Baja
                                                                </Button>
                                                                : ""
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Sub-Secretario(a)</strong></td>
                                                        <td>{obj.subSecretario !== null ? `${obj.subSecretario.per_Nombre_Completo}` : "--"}</td>
                                                        <td className='text-center'>
                                                            {obj.subSecretario !== null ?
                                                                <Button
                                                                    type="button"
                                                                    className="btn btn-danger btn-sm"
                                                                    onClick={() => this.borrarAsignacion(obj, "subSecretario")}
                                                                >
                                                                    Dar de Baja
                                                                </Button>
                                                                : ""
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Tesorero(a)</strong></td>
                                                        <td>{obj.tesorero !== null ? `${obj.tesorero.per_Nombre_Completo}` : "--"}</td>
                                                        <td className='text-center'>
                                                            {obj.tesorero !== null ?
                                                                <Button
                                                                    type="button"
                                                                    className="btn btn-danger btn-sm"
                                                                    onClick={() => this.borrarAsignacion(obj, "tesorero")}
                                                                >
                                                                    Dar de Baja
                                                                </Button>
                                                                : ""
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Sub-Tesorero(a)</strong></td>
                                                        <td>{obj.subTesorero !== null ? `${obj.subTesorero.per_Nombre_Completo}` : "--"}</td>
                                                        <td className='text-center'>
                                                            {obj.subTesorero !== null ?
                                                                <Button
                                                                    type="button"
                                                                    className="btn btn-danger btn-sm"
                                                                    onClick={() => this.borrarAsignacion(obj, "subTesorero")}
                                                                >
                                                                    Dar de Baja
                                                                </Button>
                                                                : ""
                                                            }
                                                        </td>
                                                    </tr>
                                                </>
                                            }
                                        </tbody>
                                    </table>
                                </CardBody>
                            </Card>
                        </FormGroup >
                    ))
                }

                {this.state.organismosInternos.length < 1 &&
                    <h4>
                        No hay Organismos Internos registrados en este Sector.
                    </h4>
                }

                {/*Modal success*/}
                <Modal isOpen={this.state.modalShow}>
                    <ModalBody>
                        {this.state.mensajeDelProceso}
                    </ModalBody>
                </Modal>
            </Container >
        )
    }
}