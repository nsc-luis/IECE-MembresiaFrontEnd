import React, { Component } from 'react';
import {
    Container, Row, Col, Form, Input, Label,
    Button, FormFeedback, Table, FormGroup,
    Modal, ModalFooter, ModalBody, ModalHeader
} from 'reactstrap';
import helpers from '../../components/Helpers';
import Layout from '../Layout';
import '../../assets/css/index.css';

class PresentacionDeNino extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listaDePresentaciones: [],
            listaDeNinos: [],
            status: false,
            modalEliminaPresentacion: false,
            modalFrmPresentacion: false,
            bolAgregarPresentacion: true,
            currentPresentacion: {},
            tituloModalFrmPresentacion: "",
            nombreNino: "",
            ninoSelectInvalido: false,
            fechaPresentacionInvalida: false,
            ministroOficianteInvalido: false,
            modalShow: false,
            mensajeDelProceso: "",
            ministros: []
        }
        this.infoSesion = JSON.parse(localStorage.getItem('infoSesion'));
        this.msjNinoSelectInvalido = "Debe seleccionar niño(a) para continuar.";
    }

    componentDidMount() {
        this.setState({
            currentPresentacion: {
                ...this.state.currentPresentacion,
                per_Id_Persona: "0",
                pdn_Ministro_Oficiante: "",
                pdn_Fecha_Presentacion: "01/01/1900",
                sec_Id_Sector: this.infoSesion.sec_Id_Sector,
                usu_Id_Usuario: "1"
            }
        });
        this.getListaDePresentaciones();
        this.getListaDeNinos();
        this.getMinistrosAncianoActivo();
    }

    getListaDePresentaciones = async () => {
        await helpers.authAxios.get(helpers.url_api + "/Presentacion_Nino/GetBySector/" + this.infoSesion.sec_Id_Sector)
            .then(res => {
                this.setState({
                    listaDePresentaciones: res.data.presentaciones,
                    status: res.data.status
                })
            })
    }

    getListaDeNinos = async () => {
        await helpers.authAxios.get(helpers.url_api + "/Persona/GetListaNinosBySector/" + this.infoSesion.sec_Id_Sector)
            .then(res => {
                this.setState({
                    listaDeNinos: res.data.listaDeNinos,
                    status: res.data.status
                })
            })
    }

    getMinistrosAncianoActivo = async () => {
        await helpers.authAxios.get(helpers.url_api + "/PersonalMinisterial/GetMinistrosAncianoActivoByDistrito/" + localStorage.getItem("dto"))
            .then(res => {
                this.setState({ ministros: res.data.ministros })
            });
    }

    handle_modalEliminaPresentacion = (info) => {
        this.setState({
            currentPresentacion: info,
            modalEliminaPresentacion: true
        })
    }
    handle_modalEliminaPresentacionClose = () => {
        this.setState({
            modalEliminaPresentacion: false,
            currentPresentacion: {}
        })
    }

    handle_modalAgregarPresentacion = () => {
        this.setState({
            currentPresentacion: {
                ...this.state.currentPresentacion,
                per_Id_Persona: "0",
                pdn_Ministro_Oficiante: "",
                pdn_Fecha_Presentacion: "1900-01-01",
                sec_Id_Sector: this.infoSesion.sec_Id_Sector,
                usu_Id_Usuario: "1"
            },
            modalFrmPresentacion: true,
            tituloModalFrmPresentacion: "Registrar nueva presentacion de niño(a)",
            bolAgregarPresentacion: true
        })
    }

    handle_modalEditaPresentacion = (info) => {
        this.setState({
            currentPresentacion: {
                ...this.state.currentPresentacion,
                pdn_Id_Presentacion: info.pdn_Id_Presentacion,
                per_Id_Persona: info.per_Id_Persona,
                pdn_Ministro_Oficiante: info.pdn_Ministro_Oficiante.toUpperCase(),
                pdn_Fecha_Presentacion: helpers.reFormatoFecha(info.pdn_Fecha_Presentacion),
                sec_Id_Sector: this.infoSesion.sec_Id_Sector,
                usu_Id_Usuario: "1"
            },
            modalFrmPresentacion: true,
            tituloModalFrmPresentacion: "Editar registro de presentacion de niño(a)",
            bolAgregarPresentacion: false,
            nombreNino: info.per_Nombre + " " + info.per_Apellido_Paterno + " " + info.per_Apellido_Materno
        })
    }
    handle_modalFrmPresentacionClose = () => {
        this.setState({
            modalFrmPresentacion: false,
            currentPresentacion: {},
            ninoSelectInvalido: false,
            ministroOficianteInvalido: false,
            fechaPresentacionInvalida: false
        })
    }

    handle_onChange = (e) => {
        this.setState({
            currentPresentacion: {
                ...this.state.currentPresentacion,
                [e.target.name]: e.target.value
            }
        });
    }

    validaFormatos = (formato, campo, estado) => {
        if (!helpers.regex[formato].test(campo)) {
            this.setState({
                [estado]: true
            })
        } else {
            this.setState({
                [estado]: false
            })
        }
    }

    eliminaPresentacion = async () => {
        try {
            await helpers.authAxios.delete(helpers.url_api + "/Presentacion_Nino/" + this.state.currentPresentacion.pdn_Id_Presentacion)
                .then(res => {
                    if (res.data.status === "success") {
                        // alert(res.data.mensaje);
                        setTimeout(() => { document.location.href = '/PresentacionDeNino'; }, 3000);
                        this.setState({
                            mensajeDelProceso: "Procesando...",
                            modalShow: true
                        });
                        setTimeout(() => {
                            this.setState({
                                mensajeDelProceso: "Los datos fueron grabados satisfactoriamente."
                            });
                        }, 1500);
                        setTimeout(() => {
                            document.location.href = '/PresentacionDeNino'
                        }, 3500);
                    } else {
                        // alert(res.data.mensaje);
                        this.setState({
                            mensajeDelProceso: "Procesando...",
                            modalShow: true
                        });
                        setTimeout(() => {
                            this.setState({
                                mensajeDelProceso: res.data.mensaje,
                                modalShow: false
                            });
                        }, 1500);
                    }
                });
        } catch (error) {
            alert("Error: Hubo un problema en la comunicacion con el servidor. Intente mas tarde.");
            // setTimeout(() => { document.location.href = '/ListaDePersonal'; }, 3000);
        }
    }

    guardarPresentacion = (e) => {
        e.preventDefault();
        let camposAValidados = [
            /* { formato: "formatoFecha", campo: "pdn_Fecha_Presentacion", estado: "fechaPresentacionInvalida" }, */
            { formato: "alphaSpaceRequired", campo: "pdn_Ministro_Oficiante", estado: "ministroOficianteInvalido" }
        ];
        camposAValidados.forEach(element => {
            this.validaFormatos(
                element.formato,
                this.state.currentPresentacion[element.campo],
                element.estado);
        });
        if (this.state.currentPresentacion.per_Id_Persona === "0") {
            this.setState({ ninoSelectInvalido: true })
        } else {
            this.setState({
                ninoSelectInvalido: false,
                currentPresentacion: {
                    ...this.state.currentPresentacion,
                    per_Id_Persona: e.target.value
                }
            })
        }

        if (this.state.bolAgregarPresentacion &&
            !this.state.ministroOficianteInvalido &&
            !this.state.fechaPresentacionInvalida) {
            var info = this.state.currentPresentacion;
            /* info.pdn_Fecha_Presentacion = helpers.fnFormatoFecha(this.state.currentPresentacion.pdn_Fecha_Presentacion); */
            info.pdn_Fecha_Presentacion = this.state.currentPresentacion.pdn_Fecha_Presentacion;
            info.pdn_Ministro_Oficiante = this.state.currentPresentacion.pdn_Ministro_Oficiante.toUpperCase();
            try {
                helpers.authAxios.post(helpers.url_api + "/Presentacion_Nino/", info)
                    .then(res => {
                        if (res.data.status === "success") {
                            // alert(res.data.mensaje);
                            setTimeout(() => { document.location.href = '/PresentacionDeNino'; }, 3000);
                            this.setState({
                                mensajeDelProceso: "Procesando...",
                                modalShow: true
                            });
                            setTimeout(() => {
                                this.setState({
                                    mensajeDelProceso: "Los datos fueron grabados satisfactoriamente."
                                });
                            }, 1500);
                            setTimeout(() => {
                                document.location.href = '/PresentacionDeNino'
                            }, 3500);
                        } else {
                            // alert(res.data.mensaje);
                            this.setState({
                                mensajeDelProceso: "Procesando...",
                                modalShow: true
                            });
                            setTimeout(() => {
                                this.setState({
                                    mensajeDelProceso: res.data.mensaje,
                                    modalShow: false
                                });
                            }, 1500);
                        }
                    });
            } catch (error) {
                alert("Error: Hubo un problema en la comunicacion con el servidor. Intente mas tarde.");
                // setTimeout(() => { document.location.href = '/ListaDePersonal'; }, 3000);
            }
        } else if (!this.state.ministroOficianteInvalido && !this.state.fechaPresentacionInvalida) {
            var info = this.state.currentPresentacion;
            info.pdn_Fecha_Presentacion = helpers.fnFormatoFecha(this.state.currentPresentacion.pdn_Fecha_Presentacion);
            info.pdn_Ministro_Oficiante = this.state.currentPresentacion.pdn_Ministro_Oficiante.toUpperCase();
            try {
                helpers.authAxios.put(helpers.url_api + "/Presentacion_Nino/" + info.pdn_Id_Presentacion, info)
                    .then(res => {
                        if (res.data.status === "success") {
                            // alert(res.data.mensaje);
                            setTimeout(() => { document.location.href = '/PresentacionDeNino'; }, 3000);
                            this.setState({
                                mensajeDelProceso: "Procesando...",
                                modalShow: true
                            });
                            setTimeout(() => {
                                this.setState({
                                    mensajeDelProceso: "Los datos fueron grabados satisfactoriamente."
                                });
                            }, 1500);
                            setTimeout(() => {
                                document.location.href = '/PresentacionDeNino'
                            }, 3500);
                        } else {
                            // alert(res.data.mensaje);
                            this.setState({
                                mensajeDelProceso: "Procesando...",
                                modalShow: true
                            });
                            setTimeout(() => {
                                this.setState({
                                    mensajeDelProceso: res.data.mensaje,
                                    modalShow: false
                                });
                            }, 1500);
                        }
                    });
            } catch (error) {
                alert("Error: Hubo un problema en la comunicacion con el servidor. Intente mas tarde.");
                // setTimeout(() => { document.location.href = '/ListaDePersonal'; }, 3000);
            }
        }
    }

    render() {
        if (this.state.listaDePresentaciones.length >= 1) {
            return (
                <Layout>
                    <Container>
                        {/* <Row>
                            <h1 className="text-info">Presentaciones de niños</h1>
                        </Row> */}
                        <Row>
                            <Col sm="8"></Col>
                            <Col sm="4">
                                <Button
                                    onClick={this.handle_modalAgregarPresentacion}
                                    color="primary"
                                    size="sm"
                                    className="btnNuevoRegistro">
                                    Registrar nueva presentacion de niño(a)
                                </Button>
                            </Col>
                        </Row>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Nombre del niño(a)</th>
                                    <th>Ministro que oficio</th>
                                    <th>Fecha</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.listaDePresentaciones.map((presentacion) => {
                                        return (
                                            <React.Fragment key={presentacion.pdn_Id_Presentacion}>
                                                <tr>
                                                    <td> {presentacion.per_Nombre} {presentacion.per_Apellido_Paterno} {presentacion.per_Apellido_Materno} </td>
                                                    <td> {presentacion.pdn_Ministro_Oficiante} </td>
                                                    <td> {helpers.reFormatoFecha(presentacion.pdn_Fecha_Presentacion)} </td>
                                                    <td>
                                                        <Button
                                                            color="success"
                                                            size="sm"
                                                            onClick={() => this.handle_modalEditaPresentacion(presentacion)}>
                                                            <span className="fas fa-pencil-alt icon-btn-p"></span>Editar
                                                        </Button>
                                                        <Button
                                                            color="danger"
                                                            size="sm"
                                                            onClick={() => this.handle_modalEliminaPresentacion(presentacion)}>
                                                            <span className="fas fa-trash-alt icon-btn-p"></span>Eliminar
                                                        </Button>
                                                    </td>
                                                </tr>
                                            </React.Fragment>
                                        )
                                    })
                                }
                            </tbody>
                        </Table>
                        <Modal isOpen={this.state.modalEliminaPresentacion}>
                            <ModalHeader>
                                <Row>
                                    Eliminar registro de presentacion.
                                </Row>
                            </ModalHeader>
                            <ModalBody>
                                ¿Esta seguro que desea eliminar el registro de la presentación del niño(a): <br />
                                <strong> {this.state.currentPresentacion.per_Nombre} {this.state.currentPresentacion.per_Apellido_Paterno} {this.state.currentPresentacion.per_Apellido_Materno}</strong>?
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="secondary"
                                    onClick={this.handle_modalEliminaPresentacionClose}
                                    size="sm">Cancelar</Button>
                                <Button
                                    color="danger"
                                    size="sm"
                                    onClick={this.eliminaPresentacion}>
                                    Eliminar
                                </Button>
                            </ModalFooter>
                        </Modal>

                        <Modal isOpen={this.state.modalFrmPresentacion}>
                            <Form onSubmit={this.guardarPresentacion}>
                                <ModalHeader>
                                    {this.state.tituloModalFrmPresentacion}
                                </ModalHeader>
                                <ModalBody>
                                    {this.state.bolAgregarPresentacion === false &&
                                        <FormGroup>
                                            <Row>
                                                <Col sm="4">
                                                    <Label>Niño(a):</Label>
                                                </Col>
                                                <Col sm="8">
                                                    <Input
                                                        type="text"
                                                        readOnly
                                                        value={this.state.nombreNino}
                                                    />
                                                </Col>
                                            </Row>
                                        </FormGroup>
                                    }
                                    {this.state.bolAgregarPresentacion === true &&
                                        <FormGroup>
                                            <Row>
                                                <Col sm="4">
                                                    <Label>Niño(a):</Label>
                                                </Col>
                                                <Col sm="8">
                                                    <Input
                                                        name="per_Id_Persona"
                                                        type="select"
                                                        readOnly
                                                        value={this.state.currentPresentacion.per_Id_Persona}
                                                        onChange={this.handle_onChange}
                                                        invalid={this.state.ninoSelectInvalido}
                                                    >
                                                        <option value="0">Selecciona un registro</option>
                                                        {
                                                            this.state.listaDeNinos.map(nino => {
                                                                return (
                                                                    <React.Fragment key={nino.per_Id_Persona}>
                                                                        <option value={nino.per_Id_Persona}> {nino.per_Nombre} {nino.per_Apellido_Paterno} {nino.per_Apellido_Materno} </option>
                                                                    </React.Fragment>
                                                                )
                                                            })
                                                        }
                                                    </Input>
                                                    <FormFeedback>{this.state.msjNinoSelectInvalido}</FormFeedback>
                                                </Col>
                                            </Row>
                                        </FormGroup>
                                    }
                                    <FormGroup>
                                        <Row>
                                            <Col sm="4">
                                                <Label>Ministro oficiante:</Label>
                                            </Col>
                                            <Col sm="8">
                                                <Input
                                                    name="pdn_Ministro_Oficiante"
                                                    type="select"
                                                    value={this.state.currentPresentacion.pdn_Ministro_Oficiante}
                                                    onChange={this.handle_onChange}
                                                    invalid={this.state.ministroOficianteInvalido}
                                                >
                                                    <option value='0'>Selecciona una ministro</option>
                                                    {
                                                        this.state.ministros.map(ministro => {
                                                            return (
                                                                <React.Fragment key={ministro.pem_Id_Ministro}>
                                                                    <option value={ministro.pem_Id_Ministro}>{ministro.pem_Nombre}</option>
                                                                </React.Fragment>
                                                            )
                                                        })
                                                    }
                                                </Input>
                                                <FormFeedback>{helpers.msjRegexInvalido.alphaSpaceRequired}</FormFeedback>
                                            </Col>
                                        </Row>
                                    </FormGroup>

                                    <FormGroup>
                                        <Row>
                                            <Col sm="4">
                                                <Label>Fecha de presentacion:</Label>
                                            </Col>
                                            <Col sm="8">
                                                <Input
                                                    name="pdn_Fecha_Presentacion"
                                                    type="date"
                                                    value={this.state.currentPresentacion.pdn_Fecha_Presentacion}
                                                    onChange={this.handle_onChange}
                                                    invalid={this.state.fechaPresentacionInvalida}
                                                />
                                                <FormFeedback>{helpers.msjRegexInvalido.formatoFecha}</FormFeedback>
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="secondary"
                                        onClick={this.handle_modalFrmPresentacionClose}
                                        size="sm">Cancelar</Button>
                                    <Button
                                        color="primary"
                                        type="submit"
                                        size="sm">
                                        <span className="fas fa-save icon-btn-p"></span>Guardar
                                    </Button>
                                </ModalFooter>
                            </Form>
                        </Modal>
                    </Container>
                    <Modal isOpen={this.state.modalShow}>
                        <ModalBody>
                            {this.state.mensajeDelProceso}
                        </ModalBody>
                    </Modal>
                </Layout>
            )
        }
        else if (this.state.listaDePresentaciones.length === 0 && this.state.status === 'success') {
            return (
                <Layout>
                    <Container>
                        {/* <Row>
                            <h1 className="text-info">Presentaciones de niños</h1>
                        </Row> */}
                        <Row>
                            <Button
                                onClick={this.handle_modalAgregarPresentacion}
                                color="primary"
                                size="sm"
                                className="btnNuevoRegistro">
                                Registrar nueva presentacion de niño(a)
                            </Button>
                        </Row>
                        <h3>Aun no hay presentacion de niños registrados!</h3>
                        <p>Haga clic en el boton Registrar para registrar una nueva presentacion de niño.</p>
                        <Modal isOpen={this.state.modalFrmPresentacion}>
                            <Form onSubmit={this.guardarPresentacion}>
                                <ModalHeader>
                                    {this.state.tituloModalFrmPresentacion}
                                </ModalHeader>
                                <ModalBody>
                                    {/* {this.state.bolAgregarPresentacion === false &&
                                        <FormGroup>
                                            <Row>
                                                <Col sm="4">
                                                    <Label>Niño(a):</Label>
                                                </Col>
                                                <Col sm="8">
                                                    <Input
                                                        type="text"
                                                        readOnly
                                                        value={this.state.nombreNino}
                                                    />
                                                </Col>
                                            </Row>
                                        </FormGroup>
                                    }
                                    {this.state.bolAgregarPresentacion === true && */}
                                    <FormGroup>
                                        <Row>
                                            <Col sm="4">
                                                <Label>Niño(a):</Label>
                                            </Col>
                                            <Col sm="8">
                                                <Input
                                                    name="per_Id_Persona"
                                                    type="select"
                                                    value={this.state.currentPresentacion.per_Id_Persona}
                                                    onChange={this.handle_onChange}
                                                    invalid={this.state.ninoSelectInvalido}
                                                >
                                                    <option value="0">Selecciona un registro</option>
                                                    {
                                                        this.state.listaDeNinos.map(nino => {
                                                            return (
                                                                <React.Fragment key={nino.per_Id_Persona}>
                                                                    <option value={nino.per_Id_Persona}> {nino.per_Nombre} {nino.per_Apellido_Paterno} {nino.per_Apellido_Materno} </option>
                                                                </React.Fragment>
                                                            )
                                                        })
                                                    }
                                                </Input>
                                                <FormFeedback>{this.state.msjNinoSelectInvalido}</FormFeedback>
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                    {/* } */}
                                    <FormGroup>
                                        <Row>
                                            <Col sm="4">
                                                <Label>Ministro oficiante:</Label>
                                            </Col>
                                            <Col sm="8">
                                                <Input
                                                    name="pdn_Ministro_Oficiante"
                                                    type="select"
                                                    value={this.state.currentPresentacion.pdn_Ministro_Oficiante}
                                                    onChange={this.handle_onChange}
                                                    invalid={this.state.ministroOficianteInvalido}
                                                >
                                                    <option value='0'>Selecciona una ministro</option>
                                                    {
                                                        this.state.ministros.map(ministro => {
                                                            return (
                                                                <React.Fragment key={ministro.pem_Id_Ministro}>
                                                                    <option value={ministro.pem_Id_Ministro}>{ministro.pem_Nombre}</option>
                                                                </React.Fragment>
                                                            )
                                                        })
                                                    }
                                                </Input>
                                                <FormFeedback>{helpers.msjRegexInvalido.alphaSpaceRequired}</FormFeedback>
                                            </Col>
                                        </Row>
                                    </FormGroup>

                                    <FormGroup>
                                        <Row>
                                            <Col sm="4">
                                                <Label>Fecha de presentacion:</Label>
                                            </Col>
                                            <Col sm="8">
                                                <Input
                                                    name="pdn_Fecha_Presentacion"
                                                    type="date"
                                                    value={this.state.currentPresentacion.pdn_Fecha_Presentacion}
                                                    onChange={this.handle_onChange}
                                                    invalid={this.state.fechaPresentacionInvalida}
                                                />
                                                <FormFeedback>{helpers.msjRegexInvalido.formatoFecha}</FormFeedback>
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="secondary"
                                        onClick={this.handle_modalFrmPresentacionClose}
                                        size="sm">Cancelar</Button>
                                    <Button
                                        color="primary"
                                        type="submit"
                                        size="sm">
                                        <span className="fas fa-save icon-btn-p"></span>Guardar
                                    </Button>
                                </ModalFooter>
                            </Form>
                        </Modal>
                    </Container>
                </Layout >
            )
        }
        else {
            return (
                <Layout>
                    <React.Fragment>
                        <h3>Cargando información...</h3>
                        <p>Por favor espere.</p>
                    </React.Fragment>
                </Layout>
            )
        }
    }
}

export default PresentacionDeNino;