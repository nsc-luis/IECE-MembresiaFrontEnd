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
            organismoInterno: {
                oi: {},
                oid: {}
            },
            organismosInternos: [],
            mensajeDelProceso: "Procesando...",
            modalShow: false,
            showForm: false,
            showDeptoInfantil: false,
            org_CategoriaInvalid: false,
            org_Tipo_OrganismoInvalid: false,
            org_Fecha_OrganizacionInvalid: false,
            org_NombreInvalid: false,
            oid_PresidenteInvalid: false,
            oid_SecretarioInvalid: false,
            oid_TesoreroInvalid: false,
            mujeres: [],
            jovenes: [],
            ninos: []
        }
    }

    componentDidMount() {
        this.getOrganismosInternosBySector();
        window.scrollTo(0, 0);
        this.setState({
            organismoInterno: {
                ...this.state.organismoInterno,
                oi: {
                    ...this.state.organismoInterno.oi,
                    org_Activo: true,
                    org_Usuario: this.infoSesion.pem_Id_Ministro,
                    org_Categoria: "0",
                    org_Fecha_Organizacion: "",
                    org_Nombre: "",
                    org_Tipo_Organismo: "0",
                    org_Id_Sector: localStorage.getItem("sector")
                },
                oid: {
                    ...this.state.organismoInterno.oid,
                    oid_Director: 0,
                    oid_Presidente: "0",
                    oid_Secretario: "0",
                    oid_Tesorero: "0",
                    oid_Vice_Presidente: "0",
                    oid_Sub_Secretario: "0",
                    oid_Sub_Tesorero: "0"
                }
            }
        })
    }

    activaModal = () => {
        this.setState({ modalShow: !this.state.modalShow })
    }

    mostrarFormulario = () => {
        this.setState({ showForm: !this.state.showForm })
    }

    onChangeOI = (e) => {
        this.setState({
            organismoInterno: {
                ...this.state.organismoInterno,
                oi: {
                    ...this.state.organismoInterno.oi,
                    [e.target.name]: e.target.value.toUpperCase()
                }
            }
        })

        if (e.target.name === "org_Categoria" && e.target.value === "FEMENIL") {
            helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/Organismo_Interno/GetMujeresBySector/${localStorage.getItem('sector')}`)
                .then(res => {
                    this.setState({ mujeres: res.data.mujeres })
                }))
        }

        if (e.target.name === "org_Categoria" && e.target.value === "JUVENIL") {
            helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/Organismo_Interno/GetJovenesBySector/${localStorage.getItem('sector')}`)
                .then(res => {
                    this.setState({ jovenes: res.data.jovenes })
                }))
        }

        if (e.target.name === "org_Categoria" && e.target.value === "INFANTIL") {
            helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/Organismo_Interno/GetNinosBySector/${localStorage.getItem('sector')}`)
                .then(res => {
                    this.setState({ ninos: res.data.ninos })
                }))
        }

        if (e.target.name === "org_Tipo_Organismo" && e.target.value === "DEPARTAMENTO") {
            this.setState({ showDeptoInfantil: true })
        }

        if (e.target.name === "org_Tipo_Organismo" && e.target.value !== "DEPARTAMENTO") {
            this.setState({ showDeptoInfantil: false })
        }
    }

    onChangeOID = (e) => {
        this.setState({
            organismoInterno: {
                ...this.state.organismoInterno,
                oid: {
                    ...this.state.organismoInterno.oid,
                    [e.target.name]: e.target.value.toUpperCase()
                }
            }
        })
    }

    getOrganismosInternosBySector = async () => {
        try {
            await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/Organismo_Interno/GetBySector/${localStorage.getItem('sector')}`)
                .then(res => {
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
            org_Tipo_OrganismoInvalid: this.state.organismoInterno.oi.org_Tipo_Organismo === "0" ? true : false,
            org_CategoriaInvalid: this.state.organismoInterno.oi.org_Categoria === "0" ? true : false,
            org_NombreInvalid: this.state.organismoInterno.oi.org_Nombre === "" ? true : false,
            org_Fecha_OrganizacionInvalid: this.state.organismoInterno.oi.org_Fecha_Organizacion === "" ? true : false,
            oid_PresidenteInvalid: this.state.organismoInterno.oid.oid_Presidente === "0" ? true : false,
            oid_SecretarioInvalid: this.state.organismoInterno.oid.oid_Secretario === "0" ? true : false,
            oid_TesoreroInvalid: this.state.organismoInterno.oid.oid_Tesorero === "0" ? true : false
        })

        if (this.state.organismoInterno.oi.org_Tipo_Organismo === "0"
            || this.state.organismoInterno.oi.org_Categoria === "0"
            || this.state.organismoInterno.oi.org_Nombre === ""
            || this.state.organismoInterno.oi.org_Fecha_Organizacion === ""
            || this.state.organismoInterno.oi.oid_Presidente === "0"
            || this.state.organismoInterno.oi.oid_Secretario === "0"
            || this.state.organismoInterno.oi.oid_Tesorero === "0") {
            return false
        }

        await helpers.validaToken().then(helpers.authAxios.post(`${helpers.url_api}/Organismo_Interno`, this.state.organismoInterno)
            .then(res => {
                if (res.data.status === "success") {
                    this.mostrarFormulario()
                    this.getOrganismosInternosBySector()
                }
                else {
                    alert(res.data.mensaje)
                }
            })
        )
    }

    borrarOrganismo = async (id) => {
        await helpers.validaToken().then(helpers.authAxios.delete(`${helpers.url_api}/Organismo_Interno/${id}`)
            .then(res => {
                if (res.data.status === "success") {
                    this.mostrarFormulario()
                    this.getOrganismosInternosBySector()
                }
                else {
                    alert(res.data.mensaje)
                }
            }))
    }

    editarOrganismo = (id) => {
        console.log(id)
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
                                Agregar organismo interno
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
                                                * TIPO DE ORGANISMO:
                                            </Col>
                                            <Col xs="9">
                                                <Input
                                                    type="select"
                                                    name="org_Tipo_Organismo"
                                                    onChange={this.onChangeOI}
                                                    value={this.state.organismoInterno.oi.org_Tipo_Organismo}
                                                    invalid={this.state.org_Tipo_OrganismoInvalid}
                                                >
                                                    <option value="0">Seleccione el tipo de organismo</option>
                                                    <option value="SOCIEDAD">Sociedad</option>
                                                    <option value="DEPARTAMENTO">Departamento</option>
                                                </Input>
                                                <FormFeedback>Este campo es requerido</FormFeedback>
                                            </Col>
                                        </Row>
                                    </FormGroup>

                                    <FormGroup>
                                        <Row>
                                            <Col xs="3">
                                                * CATEGORIA:
                                            </Col>
                                            <Col xs="9">
                                                <Input
                                                    type="select"
                                                    name="org_Categoria"
                                                    onChange={this.onChangeOI}
                                                    value={this.state.organismoInterno.oi.org_Categoria}
                                                    invalid={this.state.org_CategoriaInvalid}
                                                >
                                                    <option value="0">Seleccione una categoria</option>
                                                    <option value="FEMENIL">Femenil</option>
                                                    <option value="JUVENIL">Juvenil</option>

                                                    {this.state.showDeptoInfantil &&
                                                        <option value="INFANTIL">Infantil</option>
                                                    }

                                                </Input>
                                                <FormFeedback>Este campo es requerido</FormFeedback>
                                            </Col>
                                        </Row>
                                    </FormGroup>

                                    <FormGroup>
                                        <Row>
                                            <Col xs="3">
                                                * NOMBRE:
                                            </Col>
                                            <Col xs="9">
                                                <Input
                                                    type="text"
                                                    name="org_Nombre"
                                                    onChange={this.onChangeOI}
                                                    value={this.state.organismoInterno.oi.org_Nombre}
                                                    invalid={this.state.org_NombreInvalid}
                                                />
                                                <FormFeedback>Este campo es requerido</FormFeedback>
                                            </Col>
                                        </Row>
                                    </FormGroup>

                                    <FormGroup>
                                        <Row>
                                            <Col xs="3">
                                                * FECHA DE ORGANIZACIÓN:
                                            </Col>
                                            <Col xs="3">
                                                <Input
                                                    type="date"
                                                    name="org_Fecha_Organizacion"
                                                    onChange={this.onChangeOI}
                                                    value={this.state.organismoInterno.oi.org_Fecha_Organizacion}
                                                    invalid={this.state.org_Fecha_OrganizacionInvalid}
                                                />
                                                <FormFeedback>Este campo es requerido</FormFeedback>
                                            </Col>
                                        </Row>
                                    </FormGroup>

                                    <FormGroup>
                                        <Row>
                                            <Col xs="4">
                                                <Input
                                                    type="select"
                                                    name="oid_Presidente"
                                                    onChange={this.onChangeOID}
                                                    value={this.state.organismoInterno.oid.oid_Presidente}
                                                    invalid={this.state.oid_PresidenteInvalid}
                                                >
                                                    <option value="0">Seleccione una persona</option>
                                                    {this.state.organismoInterno.oi.org_Categoria === "FEMENIL" &&
                                                        <>
                                                            {
                                                                this.state.mujeres.map((mujer) => {
                                                                    return (
                                                                        <React.Fragment key={mujer.per_Id_Persona}>
                                                                            <option value={mujer.per_Id_Persona}>
                                                                                {mujer.per_Nombre} {mujer.per_Apellido_Paterno} {mujer.per_Apellido_Materno}
                                                                            </option>
                                                                        </React.Fragment>
                                                                    )
                                                                })
                                                            }
                                                        </>
                                                    }

                                                    {this.state.organismoInterno.oi.org_Categoria === "JUVENIL" &&
                                                        <>
                                                            {
                                                                this.state.jovenes.map((joven) => {
                                                                    return (
                                                                        <React.Fragment key={joven.per_Id_Persona}>
                                                                            <option value={joven.per_Id_Persona}>
                                                                                {joven.per_Nombre} {joven.per_Apellido_Paterno} {joven.per_Apellido_Materno}
                                                                            </option>
                                                                        </React.Fragment>
                                                                    )
                                                                })
                                                            }
                                                        </>
                                                    }

                                                    {this.state.organismoInterno.oi.org_Categoria === "INFANTIL" &&
                                                        <>
                                                            {
                                                                this.state.ninos.map((nino) => {
                                                                    return (
                                                                        <React.Fragment key={nino.per_Id_Persona}>
                                                                            <option value={nino.per_Id_Persona}>
                                                                                {nino.per_Nombre} {nino.per_Apellido_Paterno} {nino.per_Apellido_Materno}
                                                                            </option>
                                                                        </React.Fragment>
                                                                    )
                                                                })
                                                            }
                                                        </>
                                                    }

                                                </Input>
                                                <Label>
                                                    * Presidente
                                                </Label>
                                                <FormFeedback>Este campo es requerido</FormFeedback>
                                            </Col>
                                            <Col xs="4">
                                                <Input
                                                    type="select"
                                                    name="oid_Secretario"
                                                    onChange={this.onChangeOID}
                                                    value={this.state.organismoInterno.oid.oid_Secretario}
                                                    invalid={this.state.oid_SecretarioInvalid}
                                                >
                                                    <option value="0">Seleccione una persona</option>
                                                    {this.state.organismoInterno.oi.org_Categoria === "FEMENIL" &&
                                                        <>
                                                            {
                                                                this.state.mujeres.map((mujer) => {
                                                                    return (
                                                                        <React.Fragment key={mujer.per_Id_Persona}>
                                                                            <option value={mujer.per_Id_Persona}>
                                                                                {mujer.per_Nombre} {mujer.per_Apellido_Paterno} {mujer.per_Apellido_Materno}
                                                                            </option>
                                                                        </React.Fragment>
                                                                    )
                                                                })
                                                            }
                                                        </>
                                                    }

                                                    {this.state.organismoInterno.oi.org_Categoria === "JUVENIL" &&
                                                        <>
                                                            {
                                                                this.state.jovenes.map((joven) => {
                                                                    return (
                                                                        <React.Fragment key={joven.per_Id_Persona}>
                                                                            <option value={joven.per_Id_Persona}>
                                                                                {joven.per_Nombre} {joven.per_Apellido_Paterno} {joven.per_Apellido_Materno}
                                                                            </option>
                                                                        </React.Fragment>
                                                                    )
                                                                })
                                                            }
                                                        </>
                                                    }

                                                    {this.state.organismoInterno.oi.org_Categoria === "INFANTIL" &&
                                                        <>
                                                            {
                                                                this.state.ninos.map((nino) => {
                                                                    return (
                                                                        <React.Fragment key={nino.per_Id_Persona}>
                                                                            <option value={nino.per_Id_Persona}>
                                                                                {nino.per_Nombre} {nino.per_Apellido_Paterno} {nino.per_Apellido_Materno}
                                                                            </option>
                                                                        </React.Fragment>
                                                                    )
                                                                })
                                                            }
                                                        </>
                                                    }
                                                </Input>
                                                <Label>
                                                    * Secretario
                                                </Label>
                                                <FormFeedback>Este campo es requerido</FormFeedback>
                                            </Col>
                                            <Col xs="4">
                                                <Input
                                                    type="select"
                                                    name="oid_Tesorero"
                                                    onChange={this.onChangeOID}
                                                    value={this.state.organismoInterno.oid.oid_Tesorero}
                                                    invalid={this.state.oid_SecretarioInvalid}
                                                >
                                                    <option value="0">Seleccione una persona</option>
                                                    {this.state.organismoInterno.oi.org_Categoria === "FEMENIL" &&
                                                        <>
                                                            {
                                                                this.state.mujeres.map((mujer) => {
                                                                    return (
                                                                        <React.Fragment key={mujer.per_Id_Persona}>
                                                                            <option value={mujer.per_Id_Persona}>
                                                                                {mujer.per_Nombre} {mujer.per_Apellido_Paterno} {mujer.per_Apellido_Materno}
                                                                            </option>
                                                                        </React.Fragment>
                                                                    )
                                                                })
                                                            }
                                                        </>
                                                    }

                                                    {this.state.organismoInterno.oi.org_Categoria === "JUVENIL" &&
                                                        <>
                                                            {
                                                                this.state.jovenes.map((joven) => {
                                                                    return (
                                                                        <React.Fragment key={joven.per_Id_Persona}>
                                                                            <option value={joven.per_Id_Persona}>
                                                                                {joven.per_Nombre} {joven.per_Apellido_Paterno} {joven.per_Apellido_Materno}
                                                                            </option>
                                                                        </React.Fragment>
                                                                    )
                                                                })
                                                            }
                                                        </>
                                                    }

                                                    {this.state.organismoInterno.oi.org_Categoria === "INFANTIL" &&
                                                        <>
                                                            {
                                                                this.state.ninos.map((nino) => {
                                                                    return (
                                                                        <React.Fragment key={nino.per_Id_Persona}>
                                                                            <option value={nino.per_Id_Persona}>
                                                                                {nino.per_Nombre} {nino.per_Apellido_Paterno} {nino.per_Apellido_Materno}
                                                                            </option>
                                                                        </React.Fragment>
                                                                    )
                                                                })
                                                            }
                                                        </>
                                                    }
                                                </Input>
                                                <Label>
                                                    * Tesorero
                                                </Label>
                                                <FormFeedback>Este campo es requerido</FormFeedback>
                                            </Col>
                                        </Row>
                                    </FormGroup>

                                    {this.state.organismoInterno.oi.org_Tipo_Organismo === "DEPARTAMENTO" &&
                                        <FormGroup>
                                            <Row>
                                                <Col xs="4">
                                                    <Input
                                                        type="select"
                                                        name="oid_Vice_Presidente"
                                                        onChange={this.onChangeOID}
                                                        value={this.state.organismoInterno.oid.oid_Vice_Presidente}
                                                    >
                                                        <option value="0">Seleccione una persona</option>
                                                        {this.state.organismoInterno.oi.org_Categoria === "FEMENIL" &&
                                                            <>
                                                                {
                                                                    this.state.mujeres.map((mujer) => {
                                                                        return (
                                                                            <React.Fragment key={mujer.per_Id_Persona}>
                                                                                <option value={mujer.per_Id_Persona}>
                                                                                    {mujer.per_Nombre} {mujer.per_Apellido_Paterno} {mujer.per_Apellido_Materno}
                                                                                </option>
                                                                            </React.Fragment>
                                                                        )
                                                                    })
                                                                }
                                                            </>
                                                        }

                                                        {this.state.organismoInterno.oi.org_Categoria === "JUVENIL" &&
                                                            <>
                                                                {
                                                                    this.state.jovenes.map((joven) => {
                                                                        return (
                                                                            <React.Fragment key={joven.per_Id_Persona}>
                                                                                <option value={joven.per_Id_Persona}>
                                                                                    {joven.per_Nombre} {joven.per_Apellido_Paterno} {joven.per_Apellido_Materno}
                                                                                </option>
                                                                            </React.Fragment>
                                                                        )
                                                                    })
                                                                }
                                                            </>
                                                        }

                                                        {this.state.organismoInterno.oi.org_Categoria === "INFANTIL" &&
                                                            <>
                                                                {
                                                                    this.state.ninos.map((nino) => {
                                                                        return (
                                                                            <React.Fragment key={nino.per_Id_Persona}>
                                                                                <option value={nino.per_Id_Persona}>
                                                                                    {nino.per_Nombre} {nino.per_Apellido_Paterno} {nino.per_Apellido_Materno}
                                                                                </option>
                                                                            </React.Fragment>
                                                                        )
                                                                    })
                                                                }
                                                            </>
                                                        }
                                                    </Input>
                                                    <Label>
                                                        * Vice-Presidente
                                                    </Label>
                                                </Col>
                                                <Col xs="4">
                                                    <Input
                                                        type="select"
                                                        name="oid_Sub_Secretario"
                                                        onChange={this.onChangeOID}
                                                        value={this.state.organismoInterno.oid.oid_Sub_Secretario}
                                                    >
                                                        <option value="0">Seleccione una persona</option>
                                                        {this.state.organismoInterno.oi.org_Categoria === "FEMENIL" &&
                                                            <>
                                                                {
                                                                    this.state.mujeres.map((mujer) => {
                                                                        return (
                                                                            <React.Fragment key={mujer.per_Id_Persona}>
                                                                                <option value={mujer.per_Id_Persona}>
                                                                                    {mujer.per_Nombre} {mujer.per_Apellido_Paterno} {mujer.per_Apellido_Materno}
                                                                                </option>
                                                                            </React.Fragment>
                                                                        )
                                                                    })
                                                                }
                                                            </>
                                                        }

                                                        {this.state.organismoInterno.oi.org_Categoria === "JUVENIL" &&
                                                            <>
                                                                {
                                                                    this.state.jovenes.map((joven) => {
                                                                        return (
                                                                            <React.Fragment key={joven.per_Id_Persona}>
                                                                                <option value={joven.per_Id_Persona}>
                                                                                    {joven.per_Nombre} {joven.per_Apellido_Paterno} {joven.per_Apellido_Materno}
                                                                                </option>
                                                                            </React.Fragment>
                                                                        )
                                                                    })
                                                                }
                                                            </>
                                                        }

                                                        {this.state.organismoInterno.oi.org_Categoria === "INFANTIL" &&
                                                            <>
                                                                {
                                                                    this.state.ninos.map((nino) => {
                                                                        return (
                                                                            <React.Fragment key={nino.per_Id_Persona}>
                                                                                <option value={nino.per_Id_Persona}>
                                                                                    {nino.per_Nombre} {nino.per_Apellido_Paterno} {nino.per_Apellido_Materno}
                                                                                </option>
                                                                            </React.Fragment>
                                                                        )
                                                                    })
                                                                }
                                                            </>
                                                        }
                                                    </Input>
                                                    <Label>
                                                        * Sub-Secretario
                                                    </Label>
                                                </Col>
                                                <Col xs="4">
                                                    <Input
                                                        type="select"
                                                        name="oid_Sub_Tesorero"
                                                        onChange={this.onChangeOID}
                                                        value={this.state.organismoInterno.oid.oid_Sub_Tesorero}
                                                    >
                                                        <option value="0">Seleccione una persona</option>
                                                        {this.state.organismoInterno.oi.org_Categoria === "FEMENIL" &&
                                                            <>
                                                                {
                                                                    this.state.mujeres.map((mujer) => {
                                                                        return (
                                                                            <React.Fragment key={mujer.per_Id_Persona}>
                                                                                <option value={mujer.per_Id_Persona}>
                                                                                    {mujer.per_Nombre} {mujer.per_Apellido_Paterno} {mujer.per_Apellido_Materno}
                                                                                </option>
                                                                            </React.Fragment>
                                                                        )
                                                                    })
                                                                }
                                                            </>
                                                        }

                                                        {this.state.organismoInterno.oi.org_Categoria === "JUVENIL" &&
                                                            <>
                                                                {
                                                                    this.state.jovenes.map((joven) => {
                                                                        return (
                                                                            <React.Fragment key={joven.per_Id_Persona}>
                                                                                <option value={joven.per_Id_Persona}>
                                                                                    {joven.per_Nombre} {joven.per_Apellido_Paterno} {joven.per_Apellido_Materno}
                                                                                </option>
                                                                            </React.Fragment>
                                                                        )
                                                                    })
                                                                }
                                                            </>
                                                        }

                                                        {this.state.organismoInterno.oi.org_Categoria === "INFANTIL" &&
                                                            <>
                                                                {
                                                                    this.state.ninos.map((nino) => {
                                                                        return (
                                                                            <React.Fragment key={nino.per_Id_Persona}>
                                                                                <option value={nino.per_Id_Persona}>
                                                                                    {nino.per_Nombre} {nino.per_Apellido_Paterno} {nino.per_Apellido_Materno}
                                                                                </option>
                                                                            </React.Fragment>
                                                                        )
                                                                    })
                                                                }
                                                            </>
                                                        }
                                                    </Input>
                                                    <Label>
                                                        * Sub-Tesorero
                                                    </Label>
                                                </Col>
                                            </Row>
                                        </FormGroup>
                                    }

                                </CardBody>
                                <CardFooter>
                                    <Row>
                                        <Col xs="12" style={{ textAlign: 'right' }}>
                                            <Button
                                                type="button"
                                                color="secondary"
                                                className="entreBotones"
                                                onClick={this.mostrarFormulario}
                                            >
                                                Cancelar
                                            </Button>
                                            <Button
                                                type="submit"
                                                color="success"
                                            >
                                                <span className="fa fa-users faIconMarginRight"></span>Agregar organismo
                                            </Button>
                                        </Col>
                                    </Row>
                                </CardFooter>
                            </Form>
                        </Card>
                    </FormGroup>
                }

                {this.state.organismosInternos.length > 0 &&
                    <FormGroup>
                        <table className="table table-striped table-bordered table-sm">
                            <thead className="text-center bg-gradient-info">
                                <tr>
                                    <th width="20%">NOMBRE</th>
                                    <th width="10%">TIPO</th>
                                    <th width="10%">CATEGORIA</th>
                                    <th width="30%">DETALLE</th>
                                    <th width="10%">ORGANIZACION</th>
                                    <th width="10%">STATUS</th>
                                    <th width="10%"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.organismosInternos.map((oic) => (
                                    <tr key={oic.oi.org_Id}>
                                        <td><b>{oic.oi.org_Nombre}</b></td>
                                        <td className="text-center">{oic.oi.org_Tipo_Organismo}</td>
                                        <td className="text-center">{oic.oi.org_Categoria}</td>
                                        <td>
                                            {oic.oid === null &&
                                                <>SIN DATOS PARA MOSTRAR.</>
                                            }
                                            {oic.oid !== null &&
                                                oic.oi.org_Tipo_Organismo === "DEPARTAMENTO" &&
                                                <>
                                                    <strong>Presidente:</strong> {oic.presidente !== null ? `${oic.presidente.per_Nombre} ${oic.presidente.per_Apellido_Paterno} ${oic.presidente.per_Apellido_Materno}` : "No asignado"}  <br />
                                                    <strong>Secretario:</strong> {oic.secretario !== null ? `${oic.secretario.per_Nombre} ${oic.secretario.per_Apellido_Paterno} ${oic.secretario.per_Apellido_Materno}` : "No asignado"} <br />
                                                    <strong>Tesorero: </strong> {oic.tesorero !== null ? `${oic.tesorero.per_Nombre} ${oic.tesorero.per_Apellido_Paterno} ${oic.tesorero.per_Apellido_Materno}` : "No asignado"}
                                                </>
                                            }
                                            {oic.oid !== null &&
                                                oic.oi.org_Tipo_Organismo === "SOCIEDAD" &&
                                                <>
                                                    <strong>Presidente:</strong> {oic.presidente !== null ? `${oic.presidente.per_Nombre} ${oic.presidente.per_Apellido_Paterno} ${oic.presidente.per_Apellido_Materno}` : "No asignado"}  <br />
                                                    <strong>Vice-presidente:</strong> {oic.vicePresidente !== null ? `${oic.vicePresidente.per_Nombre} ${oic.vicePresidente.per_Apellido_Paterno} ${oic.vicePresidente.per_Apellido_Materno}` : "No asignado"}<br />
                                                    <strong>Secretario:</strong> {oic.presidente !== null ? `${oic.presidente.per_Nombre} ${oic.presidente.per_Apellido_Paterno} ${oic.presidente.per_Apellido_Materno}` : "No asignado"}  <br />
                                                    <strong>Sub-secretario:</strong> {oic.subSecretario !== null ? `${oic.subSecretario.per_Nombre} ${oic.subSecretario.per_Apellido_Paterno} ${oic.subSecretario.per_Apellido_Materno}` : "No asignado"} <br />
                                                    <strong>Tesorero: </strong> {oic.tesorero !== null ? `${oic.tesorero.per_Nombre} ${oic.tesorero.per_Apellido_Paterno} ${oic.tesorero.per_Apellido_Materno}` : "No asignado"} <br />
                                                    <strong>Sub-tesorero:</strong> {oic.subTesorero !== null ? `${oic.subTesorero.per_Nombre} ${oic.subTesorero.per_Apellido_Paterno} ${oic.subTesorero.per_Apellido_Materno}` : "No asginado"}
                                                </>
                                            }
                                            {oic.oid !== null &&
                                                oic.oi.org_Tipo_Organismo === "AGRUPACION" &&
                                                <>
                                                    <strong>Director: </strong> {oic.director.per_Nombre} {oic.director.per_Apellido_Paterno} {oic.director.per_Apellido_Materno}
                                                </>
                                            }
                                        </td>
                                        <td className="text-center">{oic.oi.org_Fecha_Organizacion}</td>
                                        <td className="text-center">{oic.oi.org_Activo === true ? "ACTIVO" : "INACTIVO"}</td>
                                        <td>
                                            <Button
                                                type="button"
                                                color="secondary"
                                                style={{ marginRight: '3px' }}
                                                onClick={() => this.editarOrganismo(oic.oi.org_Id)}
                                            >
                                                <span className="fa fa-edit"></span>
                                            </Button>

                                            <Button
                                                type="button"
                                                color="danger"
                                                onClick={() => this.borrarOrganismo(oic.oi.org_Id)}
                                            >
                                                <span className="fa fa-times"></span>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </FormGroup>
                }

                {this.state.organismosInternos.length < 1 &&
                    <h4>
                        Aún no hay organismos internos para mostrar.
                    </h4>
                }

                {/*Modal success*/}
                <Modal isOpen={this.state.modalShow}>
                    <ModalBody>
                        {this.state.mensajeDelProceso}
                    </ModalBody>
                </Modal>
            </Container>
        )
    }
}