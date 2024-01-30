import React, { Component } from 'react';
import helpers from "../../components/Helpers";
import {
    Container, Button, Input, Modal, ModalBody, Label, Alert, CardFooter, ModalHeader, ModalFooter,
    CardTitle, Card, CardBody, Table, Row, Col, FormFeedback, Form, FormGroup, CardHeader
} from 'reactstrap';
import DetalleVisitante from './DetalleVisitante';
import './style.css'

export default class RegistroVisitantes extends Component {
    infoSesion = JSON.parse(localStorage.getItem('infoSesion'));
    constructor(props) {
        super(props)
        this.state = {
            visitantes: [],
            showForm: false,
            currentVisitante: {
                vp_Activo: 1,
                vp_Numero_Lista: "0",
                vp_Nombre: "",
                vp_Telefono_Contacto: "",
                vp_Direccion: "",
                vp_Tipo_Visitante: "0",
                sec_Id_Sector: localStorage.getItem('sector'),
                usu_Id_Usuario: this.infoSesion.pem_Id_Ministro,
            },
            prioridades: 0,
            n_Nota: "",
            Fecha_Registro: null,
            vp_Numero_ListaInvalid: false,
            vp_NombreInvalid: false,
            /* vp_Telefono_ContactoInvalid: false,
            vp_DireccionInvalid: false, */
            vp_Tipo_VisitanteInvalid: false,
            Fecha_RegistroInvalid: false,
            editarRegistro: false,
            showDetalle: false,
            idVisitante: 0,
            dlgBajaVisitante: false,
            bajaVisitante: {
                vp_Id_Visitante: 0,
                vp_Nombre: "",
                n_Fecha_Nota: null,
                n_Nota: ""
            },
            bajaVisitante_n_Fecha_NotaInvalid: false,
            bajaVisitante_n_NotaInvalid: false
        }
    }
    componentDidMount() {
        this.getVisitantes();
        window.scrollTo(0, 0);
    }

    mostrarFormulario = () => {
        this.setState({ showForm: !this.state.showForm })
    }

    onChange = (e) => {
        if (e.target.name !== "n_Nota" && e.target.name !== "Fecha_Registro") {
            this.setState({
                currentVisitante: {
                    ...this.state.currentVisitante,
                    [e.target.name]: e.target.value.toUpperCase()
                }
            })
        }
        else {
            this.setState({ [e.target.name]: e.target.value.toUpperCase() })
        }

    }

    onChangeBaja = (e) => {
        this.setState({
            bajaVisitante: {
                ...this.state.bajaVisitante,
                [e.target.name]: e.target.value.toUpperCase()
            }
        })
    }

    dlgBajaVisitante = async (info) => {
        this.setState({
            bajaVisitante: {
                ...this.state.bajaVisitante,
                vp_Id_Visitante: info.vp_Id_Visitante,
                vp_Nombre: info.vp_Nombre
            },
            dlgBajaVisitante: true
        })
    }

    hideDlgBorrarVisitante = () => {
        this.setState({
            dlgBajaVisitante: false,
            bajaVisitante: {
                vp_Id_Visitante: 0,
                vp_Nombre: "",
                n_Fecha_Nota: null,
                n_Nota: ""
            },
            bajaVisitante_n_Fecha_NotaInvalid: false,
            bajaVisitante_n_NotaInvalid: false
        })
    }

    handleCancelar = () => {
        window.scrollTo(0, 0);
        this.setState({
            currentVisitante: {
                ...this.state.currentVisitante,
                vp_Id_Visitante: 0,
                vp_Activo: 1,
                vp_Numero_Lista: "0",
                vp_Nombre: "",
                vp_Telefono_Contacto: "",
                vp_Direccion: "",
                vp_Tipo_Visitante: "0",
                sec_Id_Sector: localStorage.getItem('sector'),
                usu_Id_Usuario: this.infoSesion.pem_Id_Ministro,
            },
            n_Nota: "",
            Fecha_Registro: null,
            vp_Numero_ListaInvalid: false,
            vp_NombreInvalid: false,
            /* vp_Telefono_ContactoInvalid: false,
            vp_DireccionInvalid: false, */
            vp_Tipo_VisitanteInvalid: false,
            showForm: !this.state.showForm,
            editarRegistro: false,
            Fecha_RegistroInvalid: false
        })
    }

    showDetalle = (idVisitante) => {
        this.setState({
            idVisitante: idVisitante,
            showDetalle: true,
            showForm: false
        })
    }

    hideDetalle = () => {
        this.setState({
            idVisitante: 0,
            showDetalle: false
        })
    }

    getVisitantes = async () => {
        try {
            await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/Visitante/VisitanteBySector/${localStorage.getItem("sector")}`)
                .then(res => {
                    const prioridades = []
                    for (var i = 1; i <= res.data.visitantes.length; i++) {
                        prioridades.push({ llave: i, valor: i })
                    }
                    this.setState({
                        visitantes: res.data.visitantes,
                        prioridades: prioridades
                    })
                })
            )
        }
        catch (err) {
            alert("Error:\n" + err)
        }
    }

    editarVisitante = (info) => {
        this.setState({
            editarRegistro: true,
            currentVisitante: info,
            showForm: true
        })
    }

    bajaVisitante = async () => {
        this.setState({
            bajaVisitante_n_Fecha_NotaInvalid: this.state.bajaVisitante.n_Fecha_Nota === null ? true: false,
            bajaVisitante_n_NotaInvalid: this.state.bajaVisitante.n_Nota === "" ? true : false
        })
        if (this.state.bajaVisitante.n_Fecha_Nota === null
            || this.state.bajaVisitante.n_Nota === "") {
            return false
        }

        try {
            await helpers.validaToken().then(helpers.authAxios.post(`${helpers.url_api}/Visitante/BajaDeVisitante`, this.state.bajaVisitante)
                .then(res => {
                    this.getVisitantes()
                    this.hideDlgBorrarVisitante()
                })
            )
        }
        catch (err) {
            alert("Error:\n" + err)
        }
    }

    enviarInfo = async (e) => {
        e.preventDefault()
        
        if (!this.state.editarRegistro) {
            this.setState({
                //vp_Numero_ListaInvalid: this.state.currentVisitante.vp_Numero_Lista === "0", true: false,
                vp_NombreInvalid: this.state.currentVisitante.vp_Nombre === "" ? true : false,
                vp_Tipo_VisitanteInvalid: this.state.currentVisitante.vp_Tipo_Visitante === "0" ? true : false,
                Fecha_RegistroInvalid: this.state.Fecha_Registro === "" || this.state.Fecha_Registro === null ? true : false
            })
            if (/* this.state.currentVisitante.vp_Numero_Lista === "0"
                ||  */this.state.currentVisitante.vp_Nombre === ""
                || this.state.currentVisitante.vp_Tipo_Visitante === "0"
                || this.state.Fecha_Registro === null) {
                return false
            }
            
            let VisitanteNota = {
                visitante: this.state.currentVisitante,
                n_Nota: this.state.n_Nota,
                n_Fecha_Nota: this.state.Fecha_Registro
            }
            
            try {
                await helpers.validaToken().then(helpers.authAxios.post(`${helpers.url_api}/Visitante/NuevoVisitante`, VisitanteNota)
                    .then(res => {
                        this.handleCancelar()
                        this.getVisitantes()
                    })
                )
            }
            catch (err) {
                alert("Error:\n" + err)
            }
        }
        else {
            this.setState({
                //vp_Numero_ListaInvalid: this.state.currentVisitante.vp_Numero_Lista === "0", true: false,
                vp_NombreInvalid: this.state.currentVisitante.vp_Nombre === "" ? true : false,
                vp_Tipo_VisitanteInvalid: this.state.currentVisitante.vp_Tipo_Visitante === "0" ? true : false
            })
            if (/* this.state.currentVisitante.vp_Numero_Lista === "0"
                ||  */this.state.currentVisitante.vp_Nombre === ""
                || this.state.currentVisitante.vp_Tipo_Visitante === "0") {
                return false
            }

            try {
                await helpers.validaToken().then(helpers.authAxios.put(`${helpers.url_api}/Visitante/${this.state.currentVisitante.vp_Id_Visitante}`, this.state.currentVisitante)
                    .then(res => {
                        this.handleCancelar()
                        this.getVisitantes()
                    })
                )
            }
            catch (err) {
                alert("Error:\n" + err)
            }
        }
    }

    render() {
        return (
            <Container>
                {!this.state.showDetalle &&
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
                }

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
                                                    name="vp_Nombre"
                                                    onChange={this.onChange}
                                                    value={this.state.currentVisitante.vp_Nombre}
                                                    invalid={this.state.vp_NombreInvalid}
                                                />
                                                <FormFeedback>Este campo es requerido</FormFeedback>
                                            </Col>
                                            <Col xs="2">
                                                {/* *  */}Teléfono de contacto:
                                            </Col>
                                            <Col xs="4">
                                                <Input
                                                    type="text"
                                                    name="vp_Telefono_Contacto"
                                                    onChange={this.onChange}
                                                    value={this.state.currentVisitante.vp_Telefono_Contacto}
                                                /* invalid={this.state.vp_Telefono_ContactoInvalid} */
                                                />
                                                {/* <FormFeedback>Este campo es requerido</FormFeedback> */}
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                    <FormGroup>
                                        <Row>
                                            <Col xs="2">
                                                {/* *  */}Direccion:
                                            </Col>
                                            <Col xs="8">
                                                <Input
                                                    type="text"
                                                    name="vp_Direccion"
                                                    onChange={this.onChange}
                                                    value={this.state.currentVisitante.vp_Direccion}
                                                /* invalid={this.state.vp_DireccionInvalid} */
                                                />
                                                {/* <FormFeedback>Este campo es requerido</FormFeedback> */}
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
                                                    name="vp_Tipo_Visitante"
                                                    onChange={this.onChange}
                                                    value={this.state.currentVisitante.vp_Tipo_Visitante}
                                                    invalid={this.state.vp_Tipo_VisitanteInvalid}
                                                >
                                                    <option value="0">Selecciona una opcion</option>
                                                    <option value="PERMANENTE">Permanente</option>
                                                    <option value="OCASIONAL">Ocasional</option>
                                                </Input>
                                                <FormFeedback>Este campo es requerido</FormFeedback>
                                            </Col>
                                            <Col xs="2">
                                                Numero en la lista
                                            </Col>
                                            <Col xs="4">
                                                <Input
                                                    type="select"
                                                    name="vp_Numero_Lista"
                                                    onChange={this.onChange}
                                                    value={this.state.currentVisitante.vp_Numero_Lista}
                                                    invalid={this.state.vp_Numero_ListaInvalid}
                                                >
                                                    <option value="0">Selecciona una opcion</option>
                                                    {this.state.prioridades.map((p) => {
                                                        return (
                                                            <option key={p.llave} value={p.llave}>{p.valor}</option>
                                                        )
                                                    })
                                                    }
                                                </Input>
                                                <FormFeedback>Este campo es requerido</FormFeedback>
                                            </Col>
                                        </Row>
                                    </FormGroup>

                                    {this.state.editarRegistro === false &&
                                        <>
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
                                                        Nota inicial:
                                                    </Col>
                                                    <Col xs="10">
                                                        <Input
                                                            type="textarea"
                                                            name="n_Nota"
                                                            rows="3"
                                                            onChange={this.onChange}
                                                            value={this.state.n_Nota}
                                                        /* invalid={this.state.n_NotaInvalid} */
                                                        />
                                                        {/* <FormFeedback>Este campo es requerido</FormFeedback> */}
                                                    </Col>
                                                </Row>
                                            </FormGroup>
                                        </>
                                    }
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
                {!this.state.showDetalle &&
                    <>
                        {
                            this.state.visitantes.length > 0 &&
                            <Card>
                                <h4 style={{ textAlign: 'center' }}>Visitantes del sector</h4>
                                <CardBody>
                                    <Table className="table table-striped border bt-0">
                                        <thead className="bg-info">
                                            <tr>
                                                <th style={{ width: "10%" }}>Prioridad</th>
                                                <th style={{ width: "35%" }}>Nombre</th>
                                                <th style={{ width: "15%" }}>Tipo</th>
                                                <th style={{ width: "15%" }}>Estado</th>
                                                <th style={{ width: "25%" }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.visitantes.map((visitante) => {
                                                return (
                                                    <tr key={visitante.vp_Id_Visitante}>
                                                        <td>{visitante.vp_Numero_Lista}</td>
                                                        <td>{visitante.vp_Nombre}</td>
                                                        <td>{visitante.vp_Tipo_Visitante}</td>
                                                        <td>{visitante.vp_Activo === true ? "Activo" : "Inactivo"}</td>
                                                        <td>
                                                            <Button
                                                                color="secondary"
                                                                type="button"
                                                                onClick={() => this.showDetalle(visitante.vp_Id_Visitante)}
                                                            >
                                                                <span className="fa fa-person"></span>
                                                                Detalle
                                                            </Button>
                                                            <Button
                                                                color="success"
                                                                type="button"
                                                                onClick={() => this.editarVisitante(visitante)}
                                                            >
                                                                <span className="fa fa-edit"></span>
                                                                Editar
                                                            </Button>
                                                            <Button
                                                                color="danger"
                                                                type="button"
                                                                onClick={() => this.dlgBajaVisitante(visitante)}
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
                    </>
                }
                {this.state.visitantes.length < 1 &&
                    <h4>No hay visitantes registrados de este Sector</h4>
                }
                {this.state.showDetalle &&
                    <DetalleVisitante
                        idVisitante={this.state.idVisitante}
                        hideDetalle={this.hideDetalle}
                    />
                }

                <Modal isOpen={this.state.dlgBajaVisitante} size="lg">
                    <ModalHeader>
                        <h2>Baja de visitante</h2>
                    </ModalHeader>
                    <ModalBody>
                        <Alert color="warning">
                            <strong>AVISO: </strong>LOS CAMPOS MARCADOS CON * SON REQUERIDOS.
                        </Alert>
                        <FormGroup>
                            <Row>
                                <Col xs="2">
                                    <span className='negrita'>Nombre:</span>
                                </Col>
                                <Col xs="10">
                                    <Input
                                        type="text"
                                        name='vp_Nombre'
                                        value={this.state.bajaVisitante.vp_Nombre}
                                        readOnly
                                        disabled
                                    />
                                    <FormFeedback>Este campo es necesario.</FormFeedback>
                                </Col>
                            </Row>
                        </FormGroup>
                        <FormGroup>
                            <Row>
                                <Col xs="2">
                                    <span className='negrita'>* Fecha:</span>
                                </Col>
                                <Col xs="4">
                                    <Input
                                        type="date"
                                        name='n_Fecha_Nota'
                                        onChange={this.onChangeBaja}
                                        value={this.state.bajaVisitante.n_Fecha_Nota}
                                        invalid={this.state.bajaVisitante_n_Fecha_NotaInvalid}
                                    />
                                    <FormFeedback>Este campo es necesario.</FormFeedback>
                                </Col>
                            </Row>
                        </FormGroup>
                        <FormGroup>
                            <Row>
                                <Col xs="2">
                                    <span className='negrita'>* Nota:</span>
                                </Col>
                                <Col xs="10">
                                    <Input
                                        name="n_Nota"
                                        type="textarea"
                                        rows="3"
                                        onChange={this.onChangeBaja}
                                        value={this.state.bajaVisitante.n_Nota}
                                        invalid={this.state.bajaVisitante_n_NotaInvalid}
                                    />
                                    <FormFeedback>Este campo es necesario.</FormFeedback>
                                </Col>
                            </Row>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            type="button"
                            onClick={this.hideDlgBorrarVisitante}
                        >
                            Cancelar
                        </Button>
                        <Button
                            color="success"
                            type="button"
                            onClick={this.bajaVisitante}
                        >
                            Aceptar
                        </Button>
                    </ModalFooter>
                </Modal>
            </Container>
        )
    }
}