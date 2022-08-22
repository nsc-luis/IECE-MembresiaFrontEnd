import React, { Component } from 'react';
import {
    Container, Row, Col, Card, CardHeader,
    CardBody, CardFooter, Form, Input, Label,
    Button, FormFeedback, Table, CardTitle, FormGroup,
    Modal, ModalFooter, ModalBody, ModalHeader
} from 'reactstrap';
import helpers from '../../components/Helpers';
import Layout from '../Layout';
import './style.css';
import PaisEstado from '../../components/PaisEstado';
import { ThemeConsumer } from 'styled-components';

class EdicionDeDireccion extends Component {

    infoSesion = JSON.parse(localStorage.getItem("infoSesion"))
    constructor(props) {
        super(props);
        this.state = {
            domicilio: {},
            listaDomicilios: [],
            hogarSeleccionado: "0",
            boolHabilitaEdicion: true,
            modalShow: false,
            mensajeDelProceso: "",
        }
    }

    componentDidMount() {
        this.setState({
            ...this.state.domicilio,
            domicilio: {
                hd_Id_Hogar: 0,
                hd_Calle: "",
                hd_Numero_Exterior: "",
                hd_Numero_Interior: "",
                hd_Tipo_Subdivision: "COL",
                hd_Subdivision: "",
                hd_Localidad: "",
                hd_Municipio_Ciudad: "",
                est_Id_Estado: "0",
                pais_Id_Pais: "0",
                hd_Telefono: ""
            }
        })
        this.getListaHogares()
    }

    getListaHogares = async () => {
        await helpers.authAxios.get(helpers.url_api + "/HogarDomicilio/GetBySector/" + localStorage.getItem("sector"))
            .then(res => {
                this.setState({ listaDomicilios: res.data.domicilios })
            })
    }

    handle_HogarSeleccionado = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
        if (e.target.value !== "0") {
            let seleccion = this.state.listaDomicilios.filter((obj) => {
                return obj.hd_Id_Hogar === parseInt(e.target.value)
            })
            seleccion[0].usu_Id_Usuario = this.infoSesion.pem_Id_Ministro
            this.setState({ domicilio: seleccion[0] })

        }
        else {
            this.setState({
                ...this.state.domicilio,
                domicilio: {
                    hd_Id_Hogar: 0,
                    hd_Calle: "",
                    hd_Numero_Exterior: "",
                    hd_Numero_Interior: "",
                    hd_Tipo_Subdivision: "COL",
                    hd_Subdivision: "",
                    hd_Localidad: "",
                    hd_Municipio_Ciudad: "",
                    est_Id_Estado: "0",
                    pais_Id_Pais: "0",
                    hd_Telefono: ""
                },
                boolHabilitaEdicion: false
            })
        }
    }

    onChangeDomicilio = (e) => {
        this.setState({
            domicilio: {
                ...this.state.domicilio,
                [e.target.name]: e.target.value.toUpperCase()
            }
        })
    }

    habilitaEdicion = () => {
        this.setState({ boolHabilitaEdicion: !this.state.boolHabilitaEdicion })
    }

    cancelarEdicion = () => {
        this.setState({
            ...this.state.domicilio,
            domicilio: {
                hd_Id_Hogar: 0,
                hd_Calle: "",
                hd_Numero_Exterior: "",
                hd_Numero_Interior: "",
                hd_Tipo_Subdivision: "COL",
                hd_Subdivision: "",
                hd_Localidad: "",
                hd_Municipio_Ciudad: "",
                est_Id_Estado: "0",
                pais_Id_Pais: "0",
                hd_Telefono: ""
            },
            hogarSeleccionado: "0",
            boolHabilitaEdicion: true
        })
    }

    guardarEdicion = async (e) => {
        e.preventDefault()
        try {
            await helpers.authAxios.put(`${helpers.url_api}/HogarDomicilio/${this.state.domicilio.hd_Id_Hogar}`, this.state.domicilio)
            .then(res => {
                if (res.data.status === "success") {
                    // alert(res.data.mensaje);
                    setTimeout(() => { document.location.href = '/EdicionDeDireccion'; }, 3000);
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
                        document.location.href = '/EdicionDeDireccion'
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
            })
        }
        catch {
            alert("Error: Hubo un problema en la comunicacion con el servidor. Intente mas tarde.");
            // setTimeout(() => { document.location.href = '/ListaDePersonal'; }, 3000);
        }
    }

    render() {
        return (
            <Layout>
                <Container>
                    <Row>
                        <Col xs="12">
                            <Form onSubmit={this.guardarEdicion}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            <h3>Selecciona un hogar/domicilio para editar </h3>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        <FormGroup>
                                            <Row>
                                                <Col xs="2">
                                                    <Label>Titular</Label>
                                                </Col>
                                                <Col xs="10">
                                                    <Input
                                                        type="select"
                                                        name="hogarSeleccionado"
                                                        value={this.state.hogarSeleccionado}
                                                        onChange={this.handle_HogarSeleccionado}
                                                    >
                                                        <option value="0">Selecciona el titular del hogar/domicilio</option>
                                                        {this.state.listaDomicilios.map((domicilio) => {
                                                            return (
                                                                <option key={domicilio.hd_Id_Hogar} value={domicilio.hd_Id_Hogar}>
                                                                    {`${domicilio.per_Nombre} ${domicilio.per_Apellido_Paterno} ${domicilio.per_Apellido_Materno}`}
                                                                </option>
                                                            )
                                                        })
                                                        }
                                                    </Input>
                                                </Col>
                                            </Row>
                                        </FormGroup>
                                        {this.state.hogarSeleccionado !== "0" &&
                                            <React.Fragment>
                                                <FormGroup>
                                                    <Row>
                                                        <Col xs="4">
                                                            <Input
                                                                type="text"
                                                                name="hd_Calle"
                                                                value={this.state.domicilio.hd_Calle}
                                                                onChange={this.onChangeDomicilio}
                                                                readOnly={this.state.boolHabilitaEdicion}
                                                            />
                                                            <Label>Calle</Label>
                                                        </Col>
                                                        <Col xs="4">
                                                            <Input
                                                                type="text"
                                                                name="hd_Numero_Exterior"
                                                                value={this.state.domicilio.hd_Numero_Exterior}
                                                                onChange={this.onChangeDomicilio}
                                                                readOnly={this.state.boolHabilitaEdicion}
                                                            />
                                                            <Label>Numero exterior</Label>
                                                        </Col>
                                                        <Col xs="4">
                                                            <Input
                                                                type="text"
                                                                name="hd_Numero_Interior"
                                                                value={this.state.domicilio.hd_Numero_Interior}
                                                                onChange={this.onChangeDomicilio}
                                                                readOnly={this.state.boolHabilitaEdicion}
                                                            />
                                                            <Label>Numero interior</Label>
                                                        </Col>
                                                    </Row>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Row>
                                                        <Col xs="4">
                                                            <Input
                                                                type="select"
                                                                name="hd_Tipo_Subdivision"
                                                                value={this.state.domicilio.hd_Tipo_Subdivision}
                                                                onChange={this.onChangeDomicilio}
                                                                readOnly={this.state.boolHabilitaEdicion}
                                                            >
                                                                <option value="COL">COLONIA</option>
                                                                <option value="FRACC">FRACC</option>
                                                                <option value="EJ">EJIDO</option>
                                                                <option value="SUBDIV">SUBDIV</option>
                                                                <option value="BRGY">BRGY</option>
                                                                <option value="RANCHO">RANCHO</option>
                                                                <option value="MANZANA">MANZANA</option>
                                                                <option value="RESIDENCIAL">RESIDENCIAL</option>
                                                                <option value="SECTOR">SECTOR</option>
                                                                <option value="SECCIÓN">SECCIÓN</option>
                                                                <option value="UNIDAD">UNIDAD</option>
                                                                <option value="BARRIO">BARRIO</option>
                                                                <option value="ZONA">ZONA</option>
                                                            </Input>
                                                            <Label>Tipo subdivision</Label>
                                                        </Col>
                                                        <Col xs="4">
                                                            <Input
                                                                type="text"
                                                                name="hd_Subdivision"
                                                                value={this.state.domicilio.hd_Subdivision}
                                                                onChange={this.onChangeDomicilio}
                                                                readOnly={this.state.boolHabilitaEdicion}
                                                            />
                                                            <Label>Subdivision</Label>
                                                        </Col>
                                                        <Col xs="4">
                                                            <Input
                                                                type="text"
                                                                name="hd_Localidad"
                                                                value={this.state.domicilio.hd_Localidad}
                                                                onChange={this.onChangeDomicilio}
                                                                readOnly={this.state.boolHabilitaEdicion}
                                                            />
                                                            <Label>Localidad</Label>
                                                        </Col>
                                                    </Row>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Row>
                                                        <Col xs="4">
                                                            <Input
                                                                type="text"
                                                                name="hd_Municipio_Ciudad"
                                                                value={this.state.domicilio.hd_Municipio_Ciudad}
                                                                onChange={this.onChangeDomicilio}
                                                                readOnly={this.state.boolHabilitaEdicion}
                                                            />
                                                            <Label>Municipio/Cuidad</Label>
                                                        </Col>
                                                        <PaisEstado
                                                            domicilio={this.state.domicilio}
                                                            onChangeDomicilio={this.onChangeDomicilio}
                                                            readOnly={this.state.boolHabilitaEdicion}
                                                        />
                                                    </Row>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Row>
                                                        <Col xs="4">
                                                            <Input
                                                                type="text"
                                                                name="hd_Telefono"
                                                                value={this.state.domicilio.hd_Telefono}
                                                                onChange={this.onChangeDomicilio}
                                                                readOnly={this.state.boolHabilitaEdicion}
                                                            />
                                                            <Label>Telefono</Label>
                                                        </Col>
                                                        <Col xs="4">
                                                            <Input
                                                                type="text"
                                                                name="hd_Activo"
                                                                value={this.state.domicilio.hd_Activo ? "SI" : "NO"}
                                                                readOnly={true}
                                                            />
                                                            <Label>Activo</Label>
                                                        </Col>
                                                    </Row>
                                                </FormGroup>
                                            </React.Fragment>
                                        }
                                    </CardBody>
                                    {this.state.hogarSeleccionado !== "0" &&
                                        <React.Fragment>
                                            {this.state.boolHabilitaEdicion &&
                                                <CardFooter>
                                                    <Button
                                                        type="button"
                                                        color="primary"
                                                        onClick={this.habilitaEdicion}
                                                    >
                                                        <span className="fas fa-edit btnIconMarginRight"></span>
                                                        Editar
                                                    </Button>
                                                </CardFooter>
                                            }
                                            {!this.state.boolHabilitaEdicion &&
                                                <CardFooter>
                                                    <Button
                                                        type="button"
                                                        color="danger"
                                                        className='bntMarginRight'
                                                        onClick={this.cancelarEdicion}
                                                    >
                                                        <span className="fas fa-times btnIconMarginRight"></span>
                                                        Cancelar
                                                    </Button>
                                                    <Button
                                                        type="submit"
                                                        color="success"
                                                    >
                                                        <span className="fas fa-save btnIconMarginRight"></span>
                                                        Guardar
                                                    </Button>
                                                </CardFooter>
                                            }
                                        </React.Fragment>
                                    }
                                </Card>
                            </Form>
                        </Col>
                    </Row>
                    <Modal isOpen={this.state.modalShow}>
                    <ModalBody>
                        {this.state.mensajeDelProceso}
                    </ModalBody>
                </Modal>
                </Container>
            </Layout>
        )
    }
}

export default EdicionDeDireccion;