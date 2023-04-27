import React, { Component } from 'react';
import helpers from '../../components/Helpers';
import {
    Button, Input, Alert, Container, Row, Col, Card, FormFeedback,
    Form, FormGroup, CardBody, CardFooter
} from 'reactstrap';
import { Link } from 'react-router-dom';
import HogarPersonaDomicilio from './HogarPersonaDomicilio';
import './style.css'

class AltaCambioDomicilioNB extends Component {
    infoSesion = JSON.parse(localStorage.getItem('infoSesion'));
    constructor(props) {
        super(props);
        this.state = {
            domicilio: {},
            hogar: {},
            DatosHogarDomicilio: [],
            JerarquiasDisponibles: [],
            MiembrosDelHogar: [],
            direccion: "",
            boolNvoEstado: false,
            habilitaPerBautizado: false,
            comentario: "",
            fechaTransaccion: "",
            fechaTransaccionInvalida: false,
            perIdPersonaInvalida: false,
            perCategoriaInvalida: false,
            personas: [],
            procedencia: "",
            per_Id_Persona: 0
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
                est_Id_Estado: "0",
                hd_CP: "",
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
        });
        this.GetPersonaCambioDomicilioReactivacionRestitucion();
    }
    GetPersonaCambioDomicilioReactivacionRestitucion = async () => {
        await helpers.authAxios.get("Persona/GetPersonasVisibilidadAbierta/false")
            .then(res => {
                this.setState({
                    personas: res.data.personas
                        .filter(per => (per.sec_Id_Sector !== parseInt(localStorage.getItem("sector"))) && per.per_Activo === false) //Que traiga solo a personas de Diferente Sector al de Sesión Activa
                        .sort((a, b) => {
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
            });
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

    onChange = (e) => {
        //Al cambiar cualquier Input del Formulario se modifica el Estado de las Variables correspondientes a cada Input.
        this.setState({
            [e.target.name]: e.target.value
        })

        //Si el input que sufre cambio es 'per_Id_Persona' se trae su procedencia y la plazma en el input de Procedencia
        if (e.target.name === "per_Id_Persona") {
            if (e.target.value !== "0") {
                // Crea el Comentario con los datos de Procedencia de la persona.
                var proced = this.state.personas.filter(obj => obj.per_Id_Persona === parseInt(e.target.value))
                this.setState({ procedencia: `PROCEDENCIA: ${proced[0].dis_Tipo_Distrito} ${proced[0].dis_Numero} - ${proced[0].sec_Tipo_Sector} ${proced[0].sec_Numero}, ${proced[0].sec_Alias}` })

                //Si el Distrito de Procedencia es igual  al de la Sesión Activa, se trata de un Cambio de Domicilio INTERNO, si no, es EXTERNO
                if (proced[0].dis_Id_Distrito === parseInt(localStorage.getItem("dto"))) {
                    //Código de Cambio de Domicilio INTERNO
                    this.setState({ ct_Codigo_Transaccion: 12002 })
                } else {
                    //Código de Cambio de Domicilio EXTERNO
                    this.setState({ ct_Codigo_Transaccion: 12003 })
                }
            }
            else {
                this.setState({ procedencia: "" })
            }
        }
    }
    guardarCambios = async (e) => {
        e.preventDefault();
        //Verifica que los inputs Obligatorios tenga contenido, si no, activa estados de CAMPOS INVALIDOS
        this.setState({
            perIdPersonaInvalida: this.state.per_Id_Persona === "0" ? true : false,
            fechaTransaccionInvalida: this.state.fechaTransaccion === "" ? true : false,
        })
        //Pone en variables a nivel Bloque los valores de los CamposInvalidos y si alguno está en True, no procede con la Transacción
        let perIdPersonaInvalida = this.state.per_Id_Persona === "0" ? true : false;
        let fechaTransaccionInvalida = this.state.fechaTransaccion === "" ? true : false;
        if (fechaTransaccionInvalida || perIdPersonaInvalida) {
            return false;
        }

        //Si la Persona se le vinculará a un NUEVO DOMICILIO.
        if (this.state.hogar.hd_Id_Hogar === "0") {
            if (this.state.domicilio.hd_Calle === "" ||
                this.state.domicilio.hd_Municipio_Ciudad === "" ||
                this.state.domicilio.pais_Id_Pais === "0" ||
                this.state.domicilio.est_Id_Estado === "0") {
                alert("Error:\nLos campos del hogar/domicilio marcados con * son requeridos.")
                return false;
            }
            else {
                let info = {
                    per_Id_Persona: this.state.per_Id_Persona,
                    sec_Id_Sector: localStorage.getItem("sector"),
                    ct_Codigo_Transaccion: this.state.ct_Codigo_Transaccion,
                    Usu_Usuario_Id: this.infoSesion.pem_Id_Ministro,
                    hte_Fecha_Transaccion: this.state.fechaTransaccion,
                    hte_Comentario: this.state.procedencia,
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
        }
        else {
            // Si la Persona se le dará de alta en Un HOGAR EXISTENTE
            var info = {
                idPersona: this.state.per_Id_Persona,
                sec_Id_Sector: localStorage.getItem("sector"),
                ct_Codigo_Transaccion: this.state.ct_Codigo_Transaccion,
                comentario: this.state.procedencia,
                fecha: this.state.fechaTransaccion,
                idMinistro: this.infoSesion.pem_Id_Ministro,
                idDomicilio: this.state.hogar.hd_Id_Hogar,
                jerarquia: this.state.hogar.hp_Jerarquia
            }
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

    render() {
        return (
            <Container>
                <Card>
                    <Form onSubmit={this.guardarCambios}>
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
                                            {this.state.personas.map(persona => {
                                                return (
                                                    <React.Fragment key={persona.per_Id_Persona}>
                                                        <option value={persona.per_Id_Persona}>{persona.per_Nombre} {persona.per_Apellido_Paterno} {persona.per_Apellido_Materno}</option>
                                                    </React.Fragment>
                                                )
                                            })}
                                        </Input>
                                        <FormFeedback>Este campo es requerido</FormFeedback>
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                    <Col xs="3">
                                        Procedencia:
                                    </Col>
                                    <Col xs="9">
                                        <Input
                                            type="text"
                                            name="procedencia"
                                            readOnly
                                            value={this.state.procedencia}
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
                            <hr />
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
export default AltaCambioDomicilioNB;