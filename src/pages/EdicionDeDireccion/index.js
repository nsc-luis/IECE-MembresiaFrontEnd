import React, { Component } from 'react';
import {
    Container, Row, Col, Card, CardHeader,
    CardBody, CardFooter, Form, Input, Label,
    Button, FormFeedback, Table, CardTitle, FormGroup,
    Modal, ModalFooter, ModalBody, ModalHeader
} from 'reactstrap';
import helpers from '../../components/Helpers';
import './style.css';
import PaisEstado from '../../components/PaisEstado';

class EdicionDeDireccion extends Component {

    infoSesion = JSON.parse(localStorage.getItem("infoSesion"))
    constructor(props) {
        super(props);
        this.state = {
            domicilio: {},
            listaDomicilios: [],
            hogarSeleccionado: "0",
            boolHabilitaEdicion: false,
            modalShow: false,
            mensajeDelProceso: "",
        }
    }

    componentDidMount() {
        this.setState({
            ...this.state.domicilio,
            domicilio: {
                hd_Id_Hogar: 0,
                hd_Tipo_Subdivision: "COL.",
                pais_Id_Pais: "0",
                hd_Calle: "",
                hd_Numero_Exterior: "",
                hd_Numero_Interior: "",
                hd_Subdivision: "",
                hd_Localidad: "",
                hd_Municipio_Ciudad: "",
                est_Id_Estado: "0",
                hd_Telefono: "",
                nvoEstado: ""
            }
        })
        this.getListaHogares()
    }

    getListaHogares = async () => {
        await helpers.authAxios.get(helpers.url_api + "/HogarDomicilio/GetBySector/" + localStorage.getItem("sector"))
            .then(res => {
                this.setState({
                    listaDomicilios: res.data.domicilios.sort((a, b) => {
                        const nameA = a.per_Nombre; // ignore upper and lowercase
                        const nameB = b.per_Nombre; // ignore upper and lowercase
                        if (nameA < nameB) {
                            return -1;
                        }
                        if (nameA > nameB) {
                            return 1;
                        }

                        // names must be equal
                        return 0;
                    })
                })

            })

    }

    handle_HogarSeleccionado = async (e) => { //Al seleccionar el Hogar que se desea Editar
        this.setState({
            [e.target.name]: e.target.value
        })
        if (e.target.value !== "0") { //Si el Hogar_Id es diferente de Cero, filtra la Lista y graba en "selección" la lista con el Hogar seleccionado.
            let seleccion = this.state.listaDomicilios.filter((obj) => {
                return obj.hd_Id_Hogar === parseInt(e.target.value)
            })
            seleccion[0].usu_Id_Usuario = this.infoSesion.pem_Id_Ministro
            this.setState({ domicilio: seleccion[0] }) //Coloca en la Variable de Estado 'domicilio' el Hogar Seleccionado.

        }
        else { //Si el Hogar= Cero, resetea todas los campos del objeto 'domicilio', significa que deseleccionó el Select "hogarSeleccionado"
            this.setState({
                ...this.state.domicilio,
                domicilio: {
                    hd_Id_Hogar: 0,
                    hd_Calle: "",
                    hd_Numero_Exterior: "",
                    hd_Numero_Interior: "",
                    hd_Tipo_Subdivision: "COL.",
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

    onChangeDomicilio = async (e) => {
        this.setState({
            domicilio: {
                ...this.state.domicilio,
                [e.target.name]: e.target.value.toUpperCase()
            }
        })
        if (e.target.name === "pais_Id_Pais") { //Si el campo que edita es País, manda traer los Estados de ese País.
            await helpers.authAxios.get(`${helpers.url_api}/Estado/GetEstadoByIdPais/${this.state.domicilio.pais_Id_Pais}`)
                .then(res => {
                    let contador = 0;
                    res.data.estados.forEach(estado => {
                        contador = contador + 1;
                    });

                    if (contador > 0) { //Si detecta que hay Estados para ese País, resetea el campo Estado para que elija un Estado nuevo.
                        this.setState({
                            domicilio: {
                                ...this.state.domicilio,
                                est_Id_Estado: "0"
                            }
                        })
                    }
                })
        }
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
                hd_Tipo_Subdivision: "COL.",
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
        e.preventDefault();
        if (this.state.domicilio.est_Id_Estado === "0") {//Si el Estado_Id = Ceroosea que seleccionó un Nuevo País. 
            if (this.state.domicilio.nvoEstado === "" || this.state.domicilio.nvoEstado === undefined) { //Si el País no tiene registrado algun Estado.
                alert("Error:\nEl País seleccionado no tiene Estados relacionados, por lo tanto, debe ingresar un nombre de Estado.")
            }
            else { //Si nvoEstado trae algun Estado nuevo para Registrar, lo manda grabar
                try {
                    await helpers.authAxios.post(`${helpers.url_api}/Estado/SolicitudNvoEstado/${this.state.domicilio.nvoEstado}/${this.state.domicilio.pais_Id_Pais}/${this.infoSesion.pem_Id_Ministro}`)
                        .then(res => {
                            this.setState({
                                domicilio: {
                                    ...this.state.domicilio,
                                    est_Id_Estado: res.data.estado.est_Id_Estado
                                }
                            })
                            helpers.authAxios.put(`${helpers.url_api}/HogarDomicilio/${this.state.domicilio.hd_Id_Hogar}`, this.state.domicilio)
                                .then(res => {
                                    if (res.data.status === "success") {
                                        // alert(res.data.mensaje);
                                        setTimeout(() => { document.location.href = '/ListaDePersonal'; }, 1000);
                                        this.setState({
                                            mensajeDelProceso: "Procesando...",
                                            modalShow: true
                                        });
                                        setTimeout(() => {
                                            this.setState({
                                                mensajeDelProceso: "Los datos fueron grabados satisfactoriamente."
                                            });
                                        }, 1000);
                                        setTimeout(() => {
                                            document.location.href = '/ListaDePersonal'
                                        }, 1000);
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
                                        }, 1000);
                                    }
                                })
                        })
                }
                catch {
                    alert("Error: Hubo un problema en la comunicación con el Servidor. Intente mas tarde.");
                }
            }
        }
        else { //Si seleccionó un Domicilio a Editar, lo manda editar con el verbo PUT
            try {
                await helpers.authAxios.put(`${helpers.url_api}/HogarDomicilio/${this.state.domicilio.hd_Id_Hogar}`, this.state.domicilio)
                    .then(res => {
                        if (res.data.status === "success") {
                            // alert(res.data.mensaje);
                            setTimeout(() => { document.location.href = '/ListaDePersonal'; }, 1000);
                            this.setState({
                                mensajeDelProceso: "Procesando...",
                                modalShow: true
                            });
                            setTimeout(() => {
                                this.setState({
                                    mensajeDelProceso: "Los datos fueron grabados satisfactoriamente."
                                });
                            }, 1000);
                            setTimeout(() => {
                                document.location.href = '/ListaDePersonal'
                            }, 1000);
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
                            }, 1000);
                        }
                    })
            }
            catch {
                alert("Error: Hubo un problema en la comunicacion con el servidor. Intente mas tarde.");
            }
        }
    }

    render() {
        return (
            <>
                <Container>
                    <Row>
                        <Col xs="12">
                            <Form onSubmit={this.guardarEdicion}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            <h3>Seleccione el Titular del Hogar/Domicilio a editar</h3>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        <FormGroup>
                                            <Row>
                                                <Col xs="2">
                                                    <Label><h3>Titular:</h3></Label>
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
                                                                    {`${domicilio.per_Nombre} ${domicilio.per_Apellido_Paterno} ${domicilio.per_Apellido_Materno ? domicilio.per_Apellido_Materno : ""}`}
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
                                                            <Label>Calle *</Label>
                                                        </Col>
                                                        <Col xs="4">
                                                            <Input
                                                                type="text"
                                                                name="hd_Numero_Exterior"
                                                                value={this.state.domicilio.hd_Numero_Exterior}
                                                                onChange={this.onChangeDomicilio}
                                                                readOnly={this.state.boolHabilitaEdicion}
                                                            />
                                                            <Label>Número Exterior</Label>
                                                        </Col>
                                                        <Col xs="4">
                                                            <Input
                                                                type="text"
                                                                name="hd_Numero_Interior"
                                                                value={this.state.domicilio.hd_Numero_Interior}
                                                                onChange={this.onChangeDomicilio}
                                                                readOnly={this.state.boolHabilitaEdicion}
                                                            />
                                                            <Label>Número Interior</Label>
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
                                                                <option value="COL.">COLONIA</option>
                                                                <option value="FRACC.">FRACC</option>
                                                                <option value="EJ.">EJIDO</option>
                                                                <option value="SUBDIV.">SUBDIV</option>
                                                                <option value="BRGY.">BRGY</option>
                                                                <option value="RANCHO">RANCHO</option>
                                                                <option value="MANZANA">MANZANA</option>
                                                                <option value="RESIDENCIAL">RESIDENCIAL</option>
                                                                <option value="SECTOR">SECTOR</option>
                                                                <option value="SECC.">SECCIÓN</option>
                                                                <option value="UNIDAD">UNIDAD</option>
                                                                <option value="BARRIO">BARRIO</option>
                                                                <option value="ZONA">ZONA</option>
                                                            </Input>
                                                            <Label>Tipo de Asentamiento</Label>
                                                        </Col>
                                                        <Col xs="4">
                                                            <Input
                                                                type="text"
                                                                name="hd_Subdivision"
                                                                value={this.state.domicilio.hd_Subdivision}
                                                                onChange={this.onChangeDomicilio}
                                                                readOnly={this.state.boolHabilitaEdicion}
                                                            />
                                                            <Label>Nombre de Asentamiento</Label>
                                                        </Col>
                                                        <Col xs="4">
                                                            <Input
                                                                type="text"
                                                                name="hd_Localidad"
                                                                value={this.state.domicilio.hd_Localidad}
                                                                onChange={this.onChangeDomicilio}
                                                                readOnly={this.state.boolHabilitaEdicion}
                                                            />
                                                            <Label>Localidad/Poblado</Label>
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
                                                            <Label>Municipio/Ciudad *</Label>
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
                                                            <Label>Teléfono de Casa</Label>
                                                        </Col>
                                                        {/* <Col xs="4">
                                                            <Input
                                                                type="text"
                                                                name="hd_Activo"
                                                                value={this.state.domicilio.hd_Activo ? "SI" : "NO"}
                                                                readOnly={true}
                                                            />
                                                            <Label>Activo</Label>
                                                        </Col> */}
                                                    </Row>
                                                </FormGroup>
                                            </React.Fragment>
                                        }
                                    </CardBody>
                                    {this.state.hogarSeleccionado !== "0" &&
                                        <React.Fragment>
                                            {/* {this.state.boolHabilitaEdicion &&
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
                                            } */}
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
            </>
        )
    }
}

export default EdicionDeDireccion;