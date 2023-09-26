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
            modalShow: false
        }
    }

    componentDidMount() {
        this.getOrganismosInternosBySector();
        window.scrollTo(0, 0);
    }

    activaModal = () => {
        this.setState({ modalShow: !this.state.modalShow })
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

    render() {
        return (
            <Container>
                <FormGroup>
                    <Button
                        type="button"
                        color="primary"
                    >
                        Agregar organismo interno
                    </Button>
                </FormGroup>
                <FormGroup>
                    <Card>
                        <Form onSubmit="">
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
                                                name=""
                                            >
                                                <option value="0">Seleccione el tipo de organismo</option>
                                                <option value="sociedad">Sociedad</option>
                                                <option value="departamento">Departamento</option>
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
                                                name=""
                                            >
                                                <option value="0">Seleccione una categoria</option>
                                                <option value="femenil">Femenil</option>
                                                <option value="juvenil">Juvenil</option>
                                                <option value="infantil">Infantil</option>

                                            </Input>
                                            <FormFeedback>Este campo es requerido</FormFeedback>
                                        </Col>
                                    </Row>
                                </FormGroup>

                                <FormGroup>
                                    <Row>
                                        <Col xs="4">
                                            <Input
                                                type="select"
                                                name=""
                                            >
                                                <option value="0">Seleccione una persona</option>

                                            </Input>
                                            <Label>
                                                * Presidente
                                            </Label>
                                            <FormFeedback>Este campo es requerido</FormFeedback>
                                        </Col>
                                        <Col xs="4">
                                            <Input
                                                type="select"
                                                name=""
                                            >
                                                <option value="0">Seleccione una persona</option>

                                            </Input>
                                            <Label>
                                                * Secretario
                                            </Label>
                                            <FormFeedback>Este campo es requerido</FormFeedback>
                                        </Col>
                                        <Col xs="4">
                                            <Input
                                                type="select"
                                                name=""
                                            >
                                                <option value="0">Seleccione una persona</option>

                                            </Input>
                                            <Label>
                                                * Tesorero
                                            </Label>
                                            <FormFeedback>Este campo es requerido</FormFeedback>
                                        </Col>
                                    </Row>
                                </FormGroup>

                                <FormGroup>
                                    <Row>
                                        <Col xs="4">
                                            <Input
                                                type="select"
                                                name=""
                                            >
                                                <option value="0">Seleccione una persona</option>

                                            </Input>
                                            <Label>
                                                * Vice-Presidente
                                            </Label>
                                            <FormFeedback>Este campo es requerido</FormFeedback>
                                        </Col>
                                        <Col xs="4">
                                            <Input
                                                type="select"
                                                name=""
                                            >
                                                <option value="0">Seleccione una persona</option>

                                            </Input>
                                            <Label>
                                                * Sub-Secretario
                                            </Label>
                                            <FormFeedback>Este campo es requerido</FormFeedback>
                                        </Col>
                                        <Col xs="4">
                                            <Input
                                                type="select"
                                                name=""
                                            >
                                                <option value="0">Seleccione una persona</option>

                                            </Input>
                                            <Label>
                                                * Sub-Tesorero
                                            </Label>
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
                                    <span className="fa fa-users faIconMarginRight"></span>Agregar organismo
                                </Button>
                            </CardFooter>
                        </Form>
                    </Card>
                </FormGroup>

                <FormGroup>
                    <table className="table table-striped table-bordered table-sm">
                        <thead className="text-center bg-gradient-info">
                            <tr>
                                <th width="25%">NOMBRE</th>
                                <th width="10%">TIPO</th>
                                <th width="10%">CATEGORIA</th>
                                <th width="35%">DETALLE</th>
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
                                                <strong>Presidente:</strong> {oic.presidente.per_Nombre} {oic.presidente.per_Apellido_Paterno} {oic.presidente.per_Apellido_Materno} <br />
                                                <strong>Secretario:</strong> {oic.secretario.per_Nombre} {oic.secretario.per_Apellido_Paterno} {oic.secretario.per_Apellido_Materno} <br />
                                                <strong>Tesorero: </strong> {oic.tesorero.per_Nombre} {oic.tesorero.per_Apellido_Paterno} {oic.tesorero.per_Apellido_Materno}
                                            </>
                                        }
                                        {oic.oid !== null &&
                                            oic.oi.org_Tipo_Organismo === "SOCIEDAD" &&
                                            <>
                                                <strong>Presidente:</strong> {oic.presidente.per_Nombre} {oic.presidente.per_Apellido_Paterno} {oic.presidente.per_Apellido_Materno} <br />
                                                <strong>Vice-presidente:</strong> {oic.vicePresidente.per_Nombre} {oic.vicePresidente.per_Apellido_Paterno} {oic.vicePresidente.per_Apellido_Materno} <br />
                                                <strong>Secretario:</strong> {oic.secretario.per_Nombre} {oic.secretario.per_Apellido_Paterno} {oic.secretario.per_Apellido_Materno} <br />
                                                <strong>Sub-secretario:</strong> {oic.subSecretario.per_Nombre} {oic.subSecretario.per_Apellido_Paterno} {oic.subSecretario.per_Apellido_Materno} <br />
                                                <strong>Tesorero: </strong> {oic.tesorero.per_Nombre} {oic.tesorero.per_Apellido_Paterno} {oic.tesorero.per_Apellido_Materno} <br />
                                                <strong>Sub-tesorero:</strong> {oic.subTesorero.per_Nombre} {oic.subTesorero.per_Apellido_Paterno} {oic.subTesorero.per_Apellido_Materno}
                                            </>
                                        }
                                        {oic.oid !== null &&
                                            oic.oi.org_Tipo_Organismo === "AGRUPACION" &&
                                            <>
                                                <strong>Director: </strong> {oic.director.per_Nombre} {oic.director.per_Apellido_Paterno} {oic.director.per_Apellido_Materno}
                                            </>
                                        }
                                    </td>
                                    <td className="text-center">{oic.oi.org_Activo === true ? "ACTIVO" : "INACTIVO"}</td>
                                    <td>
                                        <Button
                                            type="button"
                                            color="secondary"
                                        >
                                            <span className="fa fa-edit"></span>
                                            EDITAR
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </FormGroup>

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