import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import helpers from '../../components/Helpers';
import {
    Container, Row, Col, Form, FormGroup, Input, Button, ModalBody, Modal,
    FormFeedback, /* CardTitle, */ Card, CardBody, CardHeader, CardFooter
} from 'reactstrap';
import HogarPersonaDomicilio from '../Persona/HogarPersonaDomicilio';
import './style.css';
import axios from 'axios';

class RevinculaDomicilio extends Component {

    url = helpers.url_api;
    fechaNoIngresada = "";

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
            personaSeleccionada: "0",
            modalShow: false,
            mensajeDelProceso: "",
            habilitaPerBautizado: true,
            direccion: "",
            boolNvoEstado: false,
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
                hd_Tipo_Subdivision: "COL.",
                hd_Telefono: "",
                hd_CP: "",
                pais_Id_Pais: "0",
                nvoEstado: ""
            }
        })
        this.getPersonasParaCambioDomicilio();
    }

    getPersonasParaCambioDomicilio = async () => {
        await helpers.authAxios.get(`${helpers.url_api}/Persona/GetBySector/${localStorage.getItem("sector")}`)
            .then(res => {
                this.setState({
                    listaPersonas: res.data.filter((obj) => {
                        return obj.persona.per_Activo === true
                    }).sort((a, b) => {
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

    /// METODOS PARA HOGAR - DOMICILIO ///
    fnGetDatosDelHogar = async (id) => {
        if (id !== "0") {
            await helpers.authAxios.get(helpers.url_api + "/Hogar_Persona/GetMiembros/" + id)
                .then(res => {
                    this.setState({ MiembrosDelHogar: res.data })
                })
            await helpers.authAxios.get(helpers.url_api + "/Hogar_Persona/GetDatosHogarDomicilio/" + id)
                .then(res => {
                    this.setState({ DatosHogarDomicilio: res.data.miembros })
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
        if (e.target.name === "pais_Id_Pais") { //Si el campo que cambio es País, resetea el Id_Estado a '0 y el boolNvoEstado a 'false'.
            this.setState({
                domicilio: {
                    ...this.state.domicilio,
                    nvoEstado: "",
                    est_Id_Estado: "0",
                    pais_Id_Pais: e.target.value.toUpperCase(),
                },
                boolNvoEstado: false,
            })
        } else {

            this.setState({ //Carga el Objeto 'domicilio' con cada input que se va llenando desde lso componentes HogarPersonaDomicilio y PaisEstado.
                domicilio: {
                    ...this.state.domicilio,
                    [e.target.name]: e.target.value.toUpperCase(),
                }
            })
        }
    }

    handle_hd_Id_Hogar = async (e) => {
        let idHogar = e.target.value;

        //this.setState({ hd_Id_Hogar: e.target.value });
        if (idHogar !== "0") { //Si se selecciona un Hogar Existente
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

            //Fn que llama la API que trae la Dirección con multi-nomenclatura por países, ésta se ejecuta en el componentDidMount
            let getDireccion = async (id) => {
                console.log("busca direccion: ", this.url + "/HogarDomicilio/" + id);
                await helpers.authAxios.get(this.url + "/HogarDomicilio/" + id)
                    .then(res => {
                        this.setState({ direccion: res.data.direccion });
                        console.log("Domicilio: ", res.data.direccion);
                    });
            }
            getDireccion(idHogar);
        }
        else { //Si el id_Hogar es 0, 
            this.setState({
                hogar: {
                    ...this.state.hogar,
                    hd_Id_Hogar: idHogar,
                    hp_Jerarquia: "1"
                }
            })
        }

        this.fnGetDatosDelHogar(idHogar); //Pone en variables de Estado los datos de los Mimebros del hogar seleccionado y del Domicilio
    }

    handle_hp_Jerarquia = (e) => {
        this.setState({
            hogar: {
                ...this.state.hogar,
                hp_Jerarquia: e.target.value
            }
        })
    }

    handle_personaSeleccionada = (e) => { // Guarda en 'personaSeleccionada' el valor del Id_Persona.
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

    handleChangeEstado = (e) => { //Al cambiar el input est_Id_Estado

        if (e.target.value === "999") { //Si el valor del nuevo estado es 999 significa que elegió 'Otro Estado' porque quiere registrar uno Nuevo
            this.setState({
                boolNvoEstado: true,
                domicilio: {
                    ...this.state.domicilio,
                    est_Id_Estado: e.target.value
                }
            })
        }
        else { //Si no es 999, significa que eligió un Estadó Existente
            this.setState({
                boolNvoEstado: false, //Quita el input de registro de un Nuevo Estado
                domicilio: {
                    ...this.state.domicilio,
                    nvoEstado: "",
                    est_Id_Estado: e.target.value
                }
            })
        }
    }



    GuardaCambioDomicilio = async (e) => {
        e.preventDefault();
        if (this.state.personaSeleccionada === "0") {
            alert("Error: \nSe requiere que seleccione una Persona.");
            return false;
        }

        if (this.state.hogar.hd_Id_Hogar === "0"
            && (this.state.domicilio.pais_Id_Pais === "0"
                || this.state.domicilio.hd_Calle === ""
                || this.state.domicilio.hd_Municipio_Ciudad === "")) {
            alert("Error!. Debe ingresar al menos Calle, Ciudad y País y Estado para un Nuevo Domicilio.")
            return false;
        }

        if (this.state.hogar.hd_Id_Hogar === "0") { //Si es un Nuevo Domicilio
            this.fnSolicitudNvoEstado(this.state.domicilio.pais_Id_Pais);
            try {
                await helpers.authAxios.post(`${helpers.url_api}/Persona/RevinculaPersonaNvoHogar/${this.state.personaSeleccionada}/${this.infoSesion.pem_Id_Ministro}/${this.state.domicilio.nvoEstado}`, this.state.domicilio)
                    .then(res => {
                        if (res.data.status === "success") {
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
                alert("Error: Hubo un problema en la comunicación con el Servidor. Intente mas tarde.");

            }
        }
        else { //Si es un Hogar Existente
            try {
                await helpers.authAxios.post(`${helpers.url_api}/Persona/RevinculaPersonaHogarExistente/${this.state.personaSeleccionada}/${this.state.hogar.hd_Id_Hogar}/${this.state.hogar.hp_Jerarquia}/${this.infoSesion.pem_Id_Ministro}`)
                    .then(res => {
                        if (res.data.status === "success") {
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
                alert("Error: Hubo un problema en la comunicación con el Servidor. Intente mas tarde.");
                // setTimeout(() => { document.location.href = '/ListaDePersonal'; }, 3000);
            }
        }
    }

    render() {
        return (
            <>
                <Container>
                    <Row>

                        <Col xs="12">
                            <Form onSubmit={this.GuardaCambioDomicilio}>
                                <Card>
                                    <CardHeader>
                                        <FormGroup>
                                            <Row>
                                                <Col xs="2">
                                                    Seleccione la Persona que se asignará a Otro Hogar*:
                                                </Col>
                                                <Col xs="10">
                                                    <Input
                                                        type="select"
                                                        name="personaSeleccionada"
                                                        value={this.state.personaSeleccionada}
                                                        onChange={this.handle_personaSeleccionada}
                                                    >
                                                        <option value="0">Seleccione una Persona</option>
                                                        {
                                                            this.state.listaPersonas.map((obj) => {
                                                                return (
                                                                    <React.Fragment key={obj.persona.per_Id_Persona}>
                                                                        <option value={obj.persona.per_Id_Persona}>{obj.persona.per_Nombre} {obj.persona.per_Apellido_Paterno} {obj.persona.per_Apellido_Materno}</option>
                                                                    </React.Fragment>
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
                                                        domicilio={this.state.domicilio} //Trae los datos del Domicilio elegido
                                                        onChangeDomicilio={this.onChangeDomicilio}
                                                        handle_hd_Id_Hogar={this.handle_hd_Id_Hogar}
                                                        handle_hp_Jerarquia={this.handle_hp_Jerarquia}
                                                        hogar={this.state.hogar}
                                                        DatosHogarDomicilio={this.state.DatosHogarDomicilio}
                                                        MiembrosDelHogar={this.state.MiembrosDelHogar}
                                                        JerarquiasDisponibles={this.state.JerarquiasDisponibles}
                                                        listaPersonas={this.state.listaPersonas} //Manda la Lista de Personas que trae la API
                                                        habilitaPerBautizado={this.state.habilitaPerBautizado}
                                                        direccion={this.state.direccion}
                                                        handleChangeEstado={this.handleChangeEstado}
                                                        boolNvoEstado={this.state.boolNvoEstado}
                                                    />
                                                </Col>
                                            </Row>
                                        </FormGroup>
                                    </CardBody>
                                    <CardFooter>
                                        <Link
                                            to="/ListaDePersonal"
                                            onClick={() => helpers.handle_LinkEncabezado("Seccion: Monitoreo", "Información de membresía")}
                                        >
                                            <Button type="button" color="danger" className="entreBotones">
                                                Cancelar
                                            </Button>
                                        </Link>
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
                        </Col>

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