import React, { Component } from 'react';
import helpers from '../../components/Helpers';
import {
    Button, Input, Alert, Container, Row, Col, Card, ButtonGroup, FormFeedback,
    Form, FormGroup, Label, CardHeader, CardTitle, CardBody, CardFooter
} from 'reactstrap';
import { Link } from 'react-router-dom';
import HogarPersonaDomicilio from './HogarPersonaDomicilio';
import MostrarJerarquias from './MostrarJerarquias';
import './style.css'

class AltaRestitucion extends Component {
    infoSesion = JSON.parse(localStorage.getItem('infoSesion'));
    constructor(props) {
        super(props);
        this.state = {
            mismoHogar: true,
            domicilio: {},
            hogar: {},
            DatosHogarDomicilio: [],
            JerarquiasDisponibles: [],
            MiembrosDelHogar: [],
            direccion: "",
            boolNvoEstado: false,
            personaParaRestitucion: [],
            per_Id_Persona: "0",
            per_Categoria: "0",
            habilitaPerBautizado: true,
            comentario: "",
            fechaTransaccion: "",
            fechaTransaccionInvalida: false,
            perIdPersonaInvalida: false,
            perCategoriaInvalida: false,
            mostrarJerarquias: false
        }
    }
    componentDidMount() {
        this.setState({
            domicilio: {
                ...this.state.domicilio,
                hd_Tipo_Subdivision: "COL",
                sec_Id_Sector: localStorage.getItem("sector"),
                dis_Id_Distrito: localStorage.getItem("dto"),
                pais_Id_Pais: "0",
                hd_Calle: "",
                hd_Localidad: "",
                hd_Numero_Exterior: "",
                usu_Id_Usuario: JSON.parse(localStorage.getItem('infoSesion')).pem_Id_Ministro,
                hd_Activo: true,
                nvoEstado: ""
            },
            hogar: {
                ...this.state.hogar,
                hd_Id_Hogar: "0",
                hp_Jerarquia: "1"
            }
        })
        this.personaParaRestitucion();
    }
    fnGetDatosDelHogar = async (id) => {
        if (id !== "0") {
            await helpers.authAxios.get("/Hogar_Persona/GetMiembros/" + id)
                .then(res => {
                    this.setState({ MiembrosDelHogar: res.data })
                })
            await helpers.authAxios.get("/Hogar_Persona/GetDatosHogarDomicilio/" + id)
                .then(res => {
                    this.setState({ DatosHogarDomicilio: res.data.miembros })
                })

            let jerarquias = [];
            for (let i = 1; i < this.state.MiembrosDelHogar.length + 2; i++) {
                jerarquias.push(<option value={i}>{i}</option>)
            }

            this.setState({
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
        this.fnGetDatosDelHogar(idHogar);
        if (idHogar !== "0") {
            await helpers.authAxios.get('/Hogar_Persona/GetMiembros/' + idHogar)
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
                await helpers.authAxios.get("/HogarDomicilio/" + id)
                    .then(res => {
                        this.setState({ direccion: res.data.direccion });
                        console.log("direccion" + this.state.direccion)
                    });
            }

            getDireccion(idHogar);
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
    }
    handle_hp_Jerarquia = (e) => {
        this.setState({
            hogar: {
                ...this.state.hogar,
                hp_Jerarquia: e.target.value
            }
        })
    }
    handleChangeEstado = (e) => {
        if (e.target.value === "999") {
            this.setState({
                boolNvoEstado: true,
                domicilio: {
                    ...this.state.domicilio,
                    est_Id_Estado: e.target.value
                }
            })
        }
        else {
            this.setState({
                boolNvoEstado: false,
                domicilio: {
                    ...this.state.domicilio,
                    nvoEstado: "",
                    est_Id_Estado: e.target.value
                }
            })
        }
    }
    onRadioBtnClick = (bool) => {
        if (bool === false) {
            this.setState({
                mostrarJerarquias: false,
                hogar: {
                    ...this.state.hogar,
                    hd_Id_Hogar: "0",
                    hp_Jerarquia: "1"
                },
                MiembrosDelHogar: [],
                DatosHogarDomicilio: [],
                JerarquiasDisponibles: []
            })
        }
        else {
            if (this.state.per_Id_Persona !== "0") {
                helpers.authAxios.get(`Hogar_Persona/GetHogarByPersona/${this.state.per_Id_Persona}`)
                    .then(res => {
                        this.fnGetDatosDelHogar(res.data.datosDelHogarPorPersona.hogarPersona.hd_Id_Hogar);
                        this.setState({
                            //per_Categoria: persona[0].per_Categoria,
                            hogar: {
                                ...this.state.hogar,
                                hd_Id_Hogar: res.data.datosDelHogarPorPersona.hd_Id_Hogar
                            },
                            mostrarJerarquias: true
                        });
                    })
            }
        }
        this.setState({ mismoHogar: bool })
    }
    personaParaRestitucion = async () => {
        await helpers.authAxios.get(`/Persona/GetPersonaRestitucion/${localStorage.getItem('sector')}/true`)
            .then(res => {
                this.setState({ personaParaRestitucion: res.data.personas })
            });
    }
    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
        if (e.target.name === "per_Id_Persona" && e.target.value !== "0") {
            if (e.target.value !== "0") {
                if (this.state.mismoHogar) {
                    var persona = this.state.personaParaRestitucion.filter(obj => {
                        return obj.per_Id_Persona === parseInt(e.target.value)
                    });
                    this.fnGetDatosDelHogar(persona[0].hd_Id_Hogar);
                    this.setState({
                        per_Categoria: persona[0].per_Categoria,
                        hogar: {
                            ...this.state.hogar,
                            hd_Id_Hogar: persona[0].hd_Id_Hogar
                        },
                        mostrarJerarquias: true
                    });
                }
                else {
                    this.setState({
                        mostrarJerarquias: false,
                        hogar: {
                            ...this.state.hogar,
                            hd_Id_Hogar: "0",
                            hp_Jerarquia: "1"
                        },
                        MiembrosDelHogar: [],
                        DatosHogarDomicilio: [],
                        JerarquiasDisponibles: []
                    })
                }
            }
        }
        if (e.target.name === "per_Id_Persona" && e.target.value === "0") {
            this.setState({
                per_Categoria: "0",
                mostrarJerarquias: false,
                MiembrosDelHogar: [],
                DatosHogarDomicilio: [],
                JerarquiasDisponibles: [],
                hogar: {
                    ...this.state.hogar,
                    hd_Id_Hogar: "0",
                    hp_Jerarquia: "1"
                }
            })
        }
    }
    guardarRestitucion = async (e) => {
        e.preventDefault();
        this.setState({
            perIdPersonaInvalida: this.state.per_Id_Persona === "0" ? true : false,
            perCategoriaInvalida: this.state.per_Categoria === "0" ? true : false,
            fechaTransaccionInvalida: this.state.fechaTransaccion === "" ? true : false,
        })
        let perIdPersonaInvalida = this.state.per_Id_Persona === "0" ? true : false;
        let perCategoriaInvalida = this.state.per_Categoria === "0" ? true : false;
        let fechaTransaccionInvalida = this.state.fechaTransaccion === "" ? true : false;
        if (perIdPersonaInvalida ||
            perCategoriaInvalida ||
            fechaTransaccionInvalida) {
            return false;
        }
        else {
            var info = {
                idPersona: this.state.per_Id_Persona,
                comentario: this.state.comentario,
                fecha: this.state.fechaTransaccion,
                idMinistro: this.infoSesion.pem_Id_Ministro,
                jerarquia: this.state.hogar.hp_Jerarquia
            }
            if (this.state.mismoHogar) {
                await helpers.authAxios.post(`/Historial_Transacciones_Estadisticas/AltaReactivacionRestitucion_HogarActual`, info)
                    .then(res => {
                        if (res.data.status === 'error') {
                            console.log(res.data.mensaje)
                        }
                        else {
                            document.location.href = '/Main';
                        }
                    });
            }
            else if (this.state.hogar.hd_Id_Hogar === "0") {
                let info = {
                    per_Id_Persona: this.state.per_Id_Persona,
                    sec_Id_Sector: localStorage.getItem("sector"),
                    ct_Codigo_Transaccion: 11002,
                    Usu_Usuario_Id: this.infoSesion.pem_Id_Ministro,
                    hte_Fecha_Transaccion: this.state.fechaTransaccion,
                    hte_Comentario: this.state.comentario,
                    HD: this.state.domicilio
                }
                await helpers.authAxios.post(`/Historial_Transacciones_Estadisticas/AltaCambioDomicilioReactivacionRestitucion_NuevoDomicilio`, info)
                    .then(res => {
                        if (res.data.status === 'error') {
                            console.log(res.data.mensaje)
                        }
                        else {
                            document.location.href = '/Main';
                        }
                    });
            }
            else {
                info.jerarquia = this.state.hogar.hp_Jerarquia;
                info.idDomicilio = this.state.hogar.hd_Id_Hogar;
                await helpers.authAxios.post(`/Historial_Transacciones_Estadisticas/AltaCambioDomicilioReactivacionRestitucion_HogarExistente`, info)
                    .then(res => {
                        if (res.data.status === 'error') {
                            console.log(res.data.mensaje)
                        }
                        else {
                            document.location.href = '/Main';
                        }
                    });
            }
        }
    }

    render() {
        return (
            <Container>
                <Card>
                    <Form onSubmit={this.guardarRestitucion}>
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
                                        * PERSONA:
                                    </Col>
                                    <Col xs="9">
                                        <Input
                                            type="select"
                                            onChange={this.onChange}
                                            name="per_Id_Persona"
                                            value={this.state.per_Id_Persona}
                                            invalid={this.state.perIdPersonaInvalida}
                                        >
                                            <option value="0">Seleccione una persona</option>
                                            {this.state.personaParaRestitucion.map(persona => {
                                                return (
                                                    <React.Fragment key={persona.per_Id_Persona}>
                                                        <option value={persona.per_Id_Persona}>{persona.per_Nombre} {persona.per_Apellido_Paterno} {persona.per_Apellido_Materno}</option>
                                                    </React.Fragment>
                                                )
                                            })
                                            }
                                        </Input>
                                        <FormFeedback>Este campo es requerido</FormFeedback>
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                    <Col xs="3">
                                        Categoria:
                                    </Col>
                                    <Col xs="9">
                                        <Input
                                            type="select"
                                            name="per_Categoria"
                                            onChange={this.onChange}
                                            value={this.state.per_Categoria}
                                            invalid={this.state.perCategoriaInvalida}
                                        >
                                            <option value="0">Seleccione una categoría</option>
                                            <option value="ADULTO_HOMBRE">Adulto Hombre</option>
                                            <option value="ADULTO_MUJER">Adulto Mujer</option>
                                            <option value="JOVEN_HOMBRE">Joven Hombre</option>
                                            <option value="JOVEN_MUJER">Joven Mujer</option>
                                        </Input>
                                        <FormFeedback>Este campo es requerido</FormFeedback>
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                    <Col xs="3">
                                        Comentario (opcional):
                                    </Col>
                                    <Col xs="9">
                                        <Input
                                            type="text"
                                            onChange={this.onChange}
                                            name="comentario"
                                            value={this.state.comentario}
                                        />
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                    <Col xs="3">
                                        * Fecha de transacción:
                                    </Col>
                                    <Col xs="3">
                                        <Input
                                            type="date"
                                            name="fechaTransaccion"
                                            placeholder='DD/MM/AAAA'
                                            onChange={this.onChange}
                                            value={this.state.fechaTransaccion}
                                            invalid={this.state.fechaTransaccionInvalida}
                                        />
                                        <FormFeedback>Este campo es requerido</FormFeedback>
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                    <Col xs="3">
                                        * Hogar:
                                    </Col>
                                    <Col xs="9">
                                        <ButtonGroup>
                                            <Button
                                                color="info"
                                                onClick={() => this.onRadioBtnClick(true)}
                                                active={this.state.mismoHogar === true}
                                            >
                                                {this.state.mismoHogar ? <span className="fa fa-icon fa-check"></span> : ""} En el mismo hogar
                                            </Button>
                                            <Button
                                                color="info"
                                                onClick={() => this.onRadioBtnClick(false)}
                                                active={this.state.mismoHogar === false}>
                                                {this.state.mismoHogar ? "" : <span className="fa fa-icon fa-check"></span>} En un hogar diferente
                                            </Button>
                                        </ButtonGroup>
                                    </Col>
                                </Row>
                            </FormGroup>
                            <hr />
                            {!this.state.mismoHogar &&
                                <HogarPersonaDomicilio
                                    domicilio={this.state.domicilio}
                                    onChangeDomicilio={this.onChangeDomicilio}
                                    handle_hd_Id_Hogar={this.handle_hd_Id_Hogar}
                                    handle_hp_Jerarquia={this.handle_hp_Jerarquia}
                                    hogar={this.state.hogar}
                                    DatosHogarDomicilio={this.state.DatosHogarDomicilio}
                                    MiembrosDelHogar={this.state.MiembrosDelHogar}
                                    JerarquiasDisponibles={this.state.JerarquiasDisponibles}
                                    boolNvoEstado={this.state.boolNvoEstado}
                                    handleChangeEstado={this.handleChangeEstado}
                                    direccion={this.state.direccion}
                                    habilitaPerBautizado={this.state.habilitaPerBautizado}
                                />
                            }
                            {this.state.mostrarJerarquias &&
                                <MostrarJerarquias
                                    handle_hp_Jerarquia={this.handle_hp_Jerarquia}
                                    hogar={this.state.hogar}
                                    DatosHogarDomicilio={this.state.DatosHogarDomicilio}
                                    MiembrosDelHogar={this.state.MiembrosDelHogar}
                                    JerarquiasDisponibles={this.state.JerarquiasDisponibles}
                                    direccion={this.state.direccion}
                                />
                            }
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
                                <span className="fa fa-pencil"></span>Proceder
                            </Button>
                        </CardFooter>
                    </Form>
                </Card>
            </Container>
        )
    }
}
export default AltaRestitucion;