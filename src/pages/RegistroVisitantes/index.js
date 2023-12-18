import React, { Component } from 'react';
import helpers from "../../components/Helpers";
import {
    Container, Button, Input, Modal, ModalBody, Label, Alert, CardFooter,
    CardTitle, Card, CardBody, Table, Row, Col, FormFeedback, Form, FormGroup, CardHeader
} from 'reactstrap';

export default class RegistroVisitantes extends Component {
    infoSesion = JSON.parse(localStorage.getItem('infoSesion'));
    constructor(props) {
        super(props)
        this.state = {
            visitantes: [],
            showForm: false,
            currentVisitante: {}
        }
    }
    componentDidMount() {
        this.getVisitantes();
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
            currentVisitante: {},
            showForm: !this.state.showForm
        })
    }

    getVisitantes = async () => {
        try {
            await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/Visitante/VisitanteBySector/${localStorage.getItem("sector")}`)
                .then(res => {
                    this.setState({
                        visitantes: res.data.visitantes
                    })
                })
            )
        }
        catch (err) {
            alert("Error:\n" + err)
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
                                Registrar nuevo visitante
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
                                            <Col xs="2">
                                                * Nombre:
                                            </Col>
                                            <Col xs="4">
                                                <Input
                                                    type="text"
                                                    name="Vp_Nombre"
                                                    onChange={this.onChange}
                                                    value={this.state.Vp_Nombre}
                                                    invalid={this.state.Vp_NombreInvalid}
                                                />
                                                <FormFeedback>Este campo es requerido</FormFeedback>
                                            </Col>
                                            <Col xs="2">
                                                * Teléfono de contacto:
                                            </Col>
                                            <Col xs="4">
                                                <Input
                                                    type="text"
                                                    name="Vp_Telefono_Contacto"
                                                    onChange={this.onChange}
                                                    value={this.state.Vp_Telefono_Contacto}
                                                    invalid={this.state.Vp_Telefono_ContactoInvalid}
                                                />
                                                <FormFeedback>Este campo es requerido</FormFeedback>
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                    <FormGroup>
                                        <Row>
                                            <Col xs="2">
                                                * Direccion:
                                            </Col>
                                            <Col xs="8">
                                                <Input
                                                    type="text"
                                                    name="Vp_Direccion"
                                                    onChange={this.onChange}
                                                    value={this.state.Vp_Direccion}
                                                    invalid={this.state.Vp_DireccionInvalid}
                                                />
                                                <FormFeedback>Este campo es requerido</FormFeedback>
                                            </Col>
                                        </Row>
                                    </FormGroup>

                                    <FormGroup>
                                        <Row>
                                            <Col xs="2">
                                                * Tipo de visitante:
                                            </Col>
                                            <Col xs="4">
                                                <Input
                                                    type="select"
                                                    name="Vp_Tipo_Visitante"
                                                    onChange={this.onChange}
                                                    value={this.state.Vp_Tipo_Visitante}
                                                    invalid={this.state.Vp_Tipo_VisitanteInvalid}
                                                >
                                                    <option value="0">Selecciona una opcion</option>
                                                    <option value="PERMANENTE">Permanente</option>
                                                    <option value="OCASIONAL">Ocasional</option>
                                                </Input>
                                                <FormFeedback>Este campo es requerido</FormFeedback>
                                            </Col>
                                            <Col xs="2">
                                                * Numero en la lista
                                            </Col>
                                            <Col xs="4">
                                                <Input
                                                    type="select"
                                                    name="Vp_Numero_Lista"
                                                    onChange={this.onChange}
                                                    value={this.state.Vp_Numero_Lista}
                                                    invalid={this.state.Vp_Numero_ListaInvalid}
                                                >
                                                    <option value="0">Selecciona una opcion</option>
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                </Input>
                                                <FormFeedback>Este campo es requerido</FormFeedback>
                                            </Col>
                                        </Row>
                                    </FormGroup>

                                    <FormGroup>
                                        <Row>
                                            <Col xs="2">
                                                * Fecha de registro:
                                            </Col>
                                            <Col xs="4">
                                                <Input
                                                    type="date"
                                                    name="Fecha_Registro"
                                                    onChange={this.onChange}
                                                    value={this.state.Fecha_Registro}
                                                    invalid={this.state.Fecha_RegistroInvalid}
                                                />
                                                <FormFeedback>Este campo es requerido</FormFeedback>
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                    <FormGroup>
                                        <Row>
                                            <Col xs="2">
                                                * Nota inicial:
                                            </Col>
                                            <Col xs="8">
                                                <Input
                                                    type="text"
                                                    name="N_Nota"
                                                    onChange={this.onChange}
                                                    value={this.state.N_Nota}
                                                    invalid={this.state.N_NotaInvalid}
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

                {this.state.visitantes.length > 0 &&
                    <Card>
                        <CardHeader>
                            <h4>Visitantes del sector</h4>
                        </CardHeader>
                        <CardBody>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Prioridad</th>
                                        <th>Nombre</th>
                                        <th>Estado</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.visitantes.map((visitante) => {
                                        return (
                                            <tr key={visitante.vp_Id_Visitante}>
                                                <td>{visitante.vp_Numero_Lista}</td>
                                                <td>{visitante.vp_Nombre}</td>
                                                <td>{visitante.vp_Activo === true ? "Activo" : "Inactivo"}</td>
                                                <td>
                                                    <Button
                                                        color="secondary"
                                                        type="button"
                                                    >
                                                        <span className="fa fa-person"></span>
                                                        Detalle
                                                    </Button>
                                                    <Button
                                                        color="success"
                                                        type="button"
                                                        onClick={() => this.formParaEditar(visitante)}
                                                    >
                                                        <span className="fa fa-edit"></span>
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        color="danger"
                                                        type="button"
                                                        onClick={() => this.baja(visitante)}
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
                {this.state.visitantes.length < 1 &&
                    <h4>No hay visitantes registrados de este Sector</h4>
                }
            </Container>
        )
    }
}