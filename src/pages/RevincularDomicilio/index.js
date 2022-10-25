import React, { Component } from 'react';
import helpers from '../../components/Helpers';
import Layout from '../Layout';
import {
    Container, Row, Col, Form, FormGroup, Input, Button, ModalBody, Modal,
    FormFeedback, /* CardTitle, */ Card, CardBody, CardHeader, CardFooter
} from 'reactstrap';
import HogarPersonaDomicilio from '../Persona/HogarPersonaDomicilio';
import './style.css';

class RevinculaDomicilio extends Component {

    infoSesion = JSON.parse(localStorage.getItem('infoSesion'));
    constructor(props) {
        super(props)
        this.state = {
            domicilio: {},
            hogar: {},
            DatosHogarDomicilio: [],
            MiembrosDelHogar: [],
            JerarquiasDisponibles: [],
            listaPersonas: [],
            personaSeleccionada: "",
            modalShow: false,
            mensajeDelProceso: "",
        }
    }

    componentDidMount() {
        this.setState({
            hogar: {
                ...this.state.hogar,
                hd_Id_Hogar: "0",
                hp_Jerarquia: "1"
            },
            domicilio: {
                ...this.state.domicilio,
                est_Id_Estado: "0",
                hd_Calle: "",
                hd_Localidad: "",
                hd_Municipio_Ciudad: "",
                hd_Numero_Exterior: "",
                hd_Numero_Interior: "",
                hd_Subdivision: "",
                hd_Tipo_Subdivision: "COL",
                hd_Telefono: "",
                pais_Id_Pais: "0",
                nvoEstado: ""
            }
        })
        this.getPersonasParaCambioDomicilio();
    }

    getPersonasParaCambioDomicilio = async () => {
        await helpers.authAxios.get(`${helpers.url_api}/Persona/GetBautizadosBySector/${localStorage.getItem("sector")}`)
            .then(res => {
                this.setState({ listaPersonas: res.data.personas })
            })
    }

    /// METODOS PARA HOGAR - DOMICILIO ///
    fnGetDatosDelHogar = async (id) => {
        if (id !== "0") {
            await helpers.authAxios.get(helpers.url_api + "/Hogar_Persona/GetMiembros/" + id)
                .then(res => {
                    this.setState({ MiembrosDelHogar: res.data })
                })
            await helpers.authAxios.get(helpers.url_api + "/Hogar_Persona/GetDatosHogarDomicilio/" + id)
                .then(res => {
                    this.setState({ DatosHogarDomicilio: res.data })
                })

            let jerarquias = [];
            for (let i = 1; i < this.state.MiembrosDelHogar.length + 2; i++) {
                jerarquias.push(<option value={i}>{i}</option>)
            }

            await this.setState({
                JerarquiasDisponibles: jerarquias,
                hogar: {
                    ...this.state.hogar,
                    hp_Jerarquia: jerarquias.length
                }
            })
        } else {
            this.setState({
                MiembrosDelHogar: [],
                DatosHogarDomicilio: [],
                JerarquiasDisponibles: []
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

    handle_hd_Id_Hogar = async (e) => {
        let idHogar = e.target.value;
        if (idHogar !== "0") {
            await helpers.authAxios.get(helpers.url_api + '/Hogar_Persona/GetMiembros/' + idHogar)
                .then(res => {
                    this.setState({
                        hogar: {
                            ...this.state.hogar,
                            hp_Jerarquia: res.data.length
                        }
                    })
                });
            this.setState({
                hogar: {
                    ...this.state.hogar,
                    hd_Id_Hogar: idHogar
                }
            })
        }
        else {
            this.setState({
                hogar: {
                    ...this.state.hogar,
                    hd_Id_Hogar: idHogar,
                    hp_Jerarquia: "1"
                }
            })
        }

        this.fnGetDatosDelHogar(idHogar);
    }

    handle_hp_Jerarquia = (e) => {
        this.setState({
            hogar: {
                ...this.state.hogar,
                hp_Jerarquia: e.target.value
            }
        })
    }

    handle_personaSeleccionada = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    fnSolicitudNvoEstado = async (idPais) => {
        let contador = 0;
        await helpers.authAxios.get(`${helpers.url_api}/Estado/GetEstadoByIdPais/${idPais}`)
            .then(res => {
                res.data.estados.forEach(estado => {
                    contador = contador + 1;
                });
            })
        if (contador > 0) {
            this.setState({
                domicilio: {
                    ...this.state.domicilio,
                    nvoEstado: ""
                }
            })
        }
        else if (this.state.domicilio.nvoEstado !== "") {
            await helpers.authAxios.post(`${helpers.url_api}/Estado/SolicitudNvoEstado/${this.state.domicilio.nvoEstado}/${this.state.domicilio.pais_Id_Pais}/${this.infoSesion.pem_Id_Ministro}`)
        }
    }

    GuardaCambioDomicilio = async (e) => {
        e.preventDefault();
        if (this.state.hogar.hd_Id_Hogar === "0") {
            this.fnSolicitudNvoEstado(this.state.domicilio.pais_Id_Pais);
            try {
                await helpers.authAxios.post(`${helpers.url_api}/Persona/RevinculaPersonaNvoHogar/${this.state.personaSeleccionada}/${this.infoSesion.pem_Id_Ministro}/${this.state.domicilio.nvoEstado}`, this.state.domicilio)
                    .then(res => {
                        if (res.data.status === "success") {
                            setTimeout(() => { document.location.href = '/ListaDePersonal'; }, 3000);
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
                                document.location.href = '/ListaDePersonal'
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
        else {
            try {
                await helpers.authAxios.post(`${helpers.url_api}/Persona/RevinculaPersonaHogarExistente/${this.state.personaSeleccionada}/${this.state.hogar.hd_Id_Hogar}/${this.state.hogar.hp_Jerarquia}/${this.infoSesion.pem_Id_Ministro}`)
                    .then(res => {
                        if (res.data.status === "success") {
                            setTimeout(() => { document.location.href = '/ListaDePersonal'; }, 3000);
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
                                document.location.href = '/ListaDePersonal'
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
    }

    render() {
        return (
            <>
                <Container>
                    <Row>
                        <Form onSubmit={this.GuardaCambioDomicilio}>
                            <Card>
                                <CardHeader>
                                    <FormGroup>
                                        <Row>
                                            <Col xs="2">
                                                Persona *:
                                            </Col>
                                            <Col xs="10">
                                                <Input
                                                    type="select"
                                                    name="personaSeleccionada"
                                                    value={this.state.personaSeleccionada}
                                                    onChange={this.handle_personaSeleccionada}
                                                >
                                                    <option value="0">Selecciona una persona</option>
                                                    {
                                                        this.state.listaPersonas.map((persona) => {
                                                            return (
                                                                <option key={persona.per_Id_Persona} value={persona.per_Id_Persona}>{persona.per_Nombre} {persona.per_Apellido_Paterno} {persona.per_Apellido_Materno}</option>
                                                            )
                                                        })
                                                    }
                                                </Input>
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                </CardHeader>
                                <CardBody>

                                    <FormGroup>
                                        <Row>
                                            <Col xs="12">
                                                <HogarPersonaDomicilio
                                                    domicilio={this.state.domicilio}
                                                    onChangeDomicilio={this.onChangeDomicilio}
                                                    handle_hd_Id_Hogar={this.handle_hd_Id_Hogar}
                                                    handle_hp_Jerarquia={this.handle_hp_Jerarquia}
                                                    hogar={this.state.hogar}
                                                    DatosHogarDomicilio={this.state.DatosHogarDomicilio}
                                                    MiembrosDelHogar={this.state.MiembrosDelHogar}
                                                    JerarquiasDisponibles={this.state.JerarquiasDisponibles}
                                                    listaPersonas={this.state.listaPersonas}
                                                />
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                </CardBody>
                                <CardFooter>
                                    <Button
                                        type="button"
                                        color="danger"
                                        className="buttonMarginRight"
                                        onClick={() => window.location = "/ListaDePersonal"}
                                    >
                                        <span className='fa fa-sw fa-times buttonMarginRight'></span>
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        color="primary"
                                    >
                                        <span className='fa fa-sw fa-save buttonMarginRight'></span>
                                        Guardar
                                    </Button>
                                </CardFooter>
                            </Card>
                        </Form>
                    </Row>
                </Container>
                <Modal isOpen={this.state.modalShow}>
                    <ModalBody>
                        {this.state.mensajeDelProceso}
                    </ModalBody>
                </Modal>
            </>
        )
    }
}

export default RevinculaDomicilio;