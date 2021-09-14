import React, { Component } from 'react';
import '../assets/css/index.css'
import 'react-day-picker/lib/style.css';
import axios from 'axios';
import helpers from './Helpers'
import { Link, Redirect } from 'react-router-dom';
import PersonaEncontrada from './PersonaEncontrada'
import HogarPersonaDomicilio from '../components/HogarPersonaDomicilio';
import Modal from 'react-modal';
import {
    Container, Row, Col, Form, FormGroup, Input, Button,
    FormFeedback, CardTitle, Card, CardBody, CardHeader
} from 'reactstrap';

class PersonaForm extends Component {

    url = helpers.url_api;
    fechaNoIngresada = "01/01/1900";

    // EXPRESIONES REGULARES PARA VALIDAR CAMPOS
    const_regex = {
        alphaSpaceRequired: /^[a-zA-Z]{3}[a-zA-Z\d\s]{0,37}$/,
        formatoFecha: /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\4(?:(?:1[6-9]|[2-9]\d)?\d{4})$/,
        formatoEmail: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        formatoTelefono: /^(\+\d{1,3})*(\(\d{2,3}\))*\d{7,25}$/
    }

    constructor(props) {
        super(props)
        this.state = {
            profesiones_oficios: [],
            FrmValidaPersona: true,
            PersonaEncontrada: false,
            infante: false,
            DatosHogar: {},
            MiembroEsBautizado: false,
            PromesaDelEspitiruSanto: false,
            CasadoDivorciadoViudo: false,
            ConcubinatoSolteroConHijos: false,
            soltero: false,
            datosPersonaEncontrada: {},
            RFCSinHomoclave: "",
            distritoSeleccionado: "0",
            sectores: [],
            per_Apellido_Materno_OK: false,
            hogar: {},
            redirect: false,
            showModalAltaPersona: false,
            emailInvalido: false,
            fechaBautismoInvalida: false,
            fechaBodaCivilInvalida: false,
            fechaEspitiruSantoInvalida: false,
            fechaBodaEclesiasticaInvalida: false,
            telMovilInvalido: false,
            mensajes: {},
            DatosHogarDomicilio: [],
            MiembrosDelHogar: [],
            JerarquiasDisponibles: []
        };
        if (!localStorage.getItem("token")) {
            document.location.href = '/';
        }
    }

    openModalAltaPersona = () => {
        this.setState({
            showModalAltaPersona: true
        });
    }
    closeModalAltaPersona = () => {
        this.setState({ showModalAltaPersona: false });
        return <Redirect to='/ListaDePersonal' />;
    }

    componentDidMount() {
        this.setState({
            hogar: {
                ...this.state.hogar,
                hd_Id_Hogar: "0",
                hp_Jerarquia: "1"
            }
        })
        this.getProfesionesOficios();
        this.setState({
            mensajes: {
                ...this.state.mensajes,
                emailInvalido: 'Formato incorrecto. Ej: buzon@dominio.com.',
                fechaBautismoInvalida: 'Formato admintido: dd/mm/aaaa.',
                fechaBodaCivilInvalida: 'Formato admintido: dd/mm/aaaa.',
                fechaEspitiruSantoInvalida: 'Formato admintido: dd/mm/aaaa.',
                fechaBodaEclesiasticaInvalida: 'Formato admintido: dd/mm/aaaa.',
                telMovilInvalido: 'Formatos admintidos: +521234567890, +52(123)4567890, (123)4567890, 1234567890. Hasta 25 numeros sin espacios.',
            }
        });
        if (localStorage.getItem("idPersona") !== "0") {
            axios.get(this.url + "/Hogar_Persona/" + localStorage.getItem("idPersona"))
                .then(res => {
                    this.setState({
                        hogar: {
                            ...this.state.hogar,
                            hd_Id_Hogar: String(res.data.hd_Id_Hogar),
                            hp_Jerarquia: String(res.data.hp_Jerarquia)
                        }
                    })
                    this.fnGetDatosDelHogar(res.data.hd_Id_Hogar)
                })
        }
    };

    getProfesionesOficios = () => {
        axios.get(this.url + "/profesion_oficio")
            .then(res => {
                this.setState({
                    profesiones_oficios: res.data,
                    status: 'success'
                });
            });
    };


    fnPromesaDelEspirituSanto = (e) => {
        if (e.target.checked) {
            this.setState({ PromesaDelEspitiruSanto: true });
        } else {
            this.setState({ PromesaDelEspitiruSanto: false });
        }
    }

    /// METODOS PARA HOGAR - DOMICILIO ///
    fnGetDatosDelHogar = async (id) => {
        if (id !== "0") {
            await axios.get(this.url + "/Hogar_Persona/GetMiembros/" + id)
                .then(res => {
                    this.setState({ MiembrosDelHogar: res.data })
                })
            await axios.get(this.url + "/Hogar_Persona/GetDatosHogarDomicilio/" + id)
                .then(res => {
                    this.setState({ DatosHogarDomicilio: res.data })
                })

            let jerarquias = [];
            for (let i = 1; i <= this.state.MiembrosDelHogar.length + 1; i++) {
                jerarquias.push(<option value={i}>{i}</option>)
            }

            await this.setState({ JerarquiasDisponibles: jerarquias })
        } else {
            this.setState({
                MiembrosDelHogar: [],
                DatosHogarDomicilio: [],
                JerarquiasDisponibles: []
            })
        }
    }

    handle_hd_Id_Hogar = async (e) => {
        let idHogar = e.target.value;
        this.setState({
            hogar: {
                ...this.state.hogar,
                hd_Id_Hogar: idHogar,
                hp_Jerarquia: "1"
            }
        })
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

    render() {
        const {
            onChange,
            form,
            domicilio,
            onChangeDomicilio,
            categoriaSeleccionada,
            msjCategoriaSeleccionada,
            habilitaPerBautizado,
            per_Nombre_NoValido,
            per_Apellido_Paterno_NoValido,
            per_Fecha_Nacimiento_NoValido,
            changeRFCSinHomo,
            changeEstadoCivil,
            fnGuardaPersona,
            fnGuardaPersonaEnHogar
        } = this.props

        const per_Apellido_Materno = document.getElementById('per_Apellido_Materno')
        const alphaSpaceRequired = /^[a-zA-Z]{3}[a-zA-Z\d\s]{0,37}$/

        // ESTRUCTURA EL RFC Y COMPRUEBA DUPLICADOS
        const CheckNvaPersona = (per_Nombre, per_Apellido_Paterno, per_Apellido_Materno, per_Fecha_Nacimiento) => {
            // Obtener primera letra del apellido paterno
            var ap = per_Apellido_Paterno.split("")
            // Obtener primera vocal del apellido paterno
            var regex = /[^aeiou]/gi
            var vowels = per_Apellido_Paterno.replace(regex, "")
            var pv = vowels[0] === ap[0] ? vowels[1] : vowels[0]
            // Obtener primera letra del apellido materno
            var am = per_Apellido_Materno.split("");
            // Obtener primera letra del primer nombre
            var n = per_Nombre.split("")
            // Reformateando fecha
            var f = per_Fecha_Nacimiento.split("/")
            var y = f[2].substr(2, 2)
            var RFCSinHomo = ap[0] + pv + am[0] + n[0] + y + f[1] + f[0]

            changeRFCSinHomo(RFCSinHomo)
            getPersonaByRFCSinHomo(RFCSinHomo);
        }

        // RECUPERA INFO DE PERSONA DUPLICADA DE ACUERDO AL RFC (SIN HOMOCLAVE)
        const getPersonaByRFCSinHomo = async (str) => {
            await axios.get(this.url + "/persona/GetByRFCSinHomo/" + str)
                .then(res => {
                    if (res.data.status) {

                        this.setState({
                            datosPersonaEncontrada: res.data.persona[0],
                            FrmValidaPersona: true,
                            PersonaEncontrada: true
                        })
                    } else {

                        this.setState({
                            datosPersonaEncontrada: [],
                            FrmValidaPersona: false,
                            PersonaEncontrada: false
                        })
                    }
                })
        }

        const handleIgnorarDuplicados = () => {
            this.setState({
                datosPersonaEncontrada: [],
                FrmValidaPersona: false,
                PersonaEncontrada: false
            })
        }

        // FUNCION QUE REVISA DUPLICADOS DEACUERDO A RFC (SIN HOMOCLAVE)
        const handle_verificarDuplicados = (e) => {
            if (categoriaSeleccionada
                && !per_Nombre_NoValido
                && !per_Apellido_Paterno_NoValido
                && !per_Fecha_Nacimiento_NoValido) {

                if (form.per_Categoria === "NIÑO" || form.per_Categoria === "NIÑA") {
                    this.setState({ infante: true })
                } else {
                    this.setState({ infante: false })
                }

                var per_Apellido_Materno = document.getElementById('per_Apellido_Materno')
                if (alphaSpaceRequired.test(per_Apellido_Materno.value)
                    || per_Apellido_Materno.value === "") {

                    this.setState({ per_Apellido_Materno_OK: true })
                    let am = per_Apellido_Materno.value === "" ? "1" : per_Apellido_Materno.value

                    CheckNvaPersona(form.per_Nombre, form.per_Apellido_Paterno, am, form.per_Fecha_Nacimiento)

                } else {
                    this.setState({ per_Apellido_Materno_OK: false })
                    alert("Debes capturar correctamente los campos requeridos.")
                }
            } else {
                this.setState({ per_Apellido_Materno_OK: false })
                alert("Debes capturar correctamente los campos requeridos.")
            }
        }

        // FUNCION PARA MOSTRAR FORMULARIO DE EDICION DE CAMPOS GENERALES
        const handleEditaNombre = () => {
            this.setState({
                FrmValidaPersona: true,
                PersonaEncontrada: false
            });
        }

        // FUNCION PARA MOSTRAR CAMPOS DE ACUERDO AL ESTADO CIVIL
        const handle_per_Estado_Civil = (e) => {
            if (e.target.value === 'CASADO(A)'
                || e.target.value === 'DIVORCIADO(A)'
                || e.target.value === 'VIUDO(A)') {
                this.setState({
                    CasadoDivorciadoViudo: true,
                    ConcubinatoSolteroConHijos: true,
                    soltero: false
                })
            }
            else if (e.target.value === 'SOLTERO(A) CON HIJOS'
                || e.target.value === 'CONCUBINATO') {
                this.setState({
                    CasadoDivorciadoViudo: false,
                    ConcubinatoSolteroConHijos: true,
                    soltero: false
                });
            } else {
                this.setState({
                    CasadoDivorciadoViudo: false,
                    ConcubinatoSolteroConHijos: false,
                    soltero: true
                })
            }
            changeEstadoCivil(e.target.value)
        }

        // FUNCION PARA FORMATO DE FECHAS PARA BD
        const fnFormatoFecha = (fecha) => {
            let sub = fecha.split("/")
            let fechaFormateada = sub[1] + "/" + sub[0] + "/" + sub[2]
            return fechaFormateada
        }

        // FUNCION PARA VALIDAR CAMPOS
        const validaFormatos = (formato, campo, estado) => {
            if (!this.const_regex[formato].test(campo)) {
                this.setState({
                    [estado]: true
                })
            } else {
                this.setState({
                    [estado]: false
                })
            }
        }

        const enviarInfo = (e) => {
            e.preventDefault();

            let objPersona = this.props.form
            let objDomicilio = this.props.domicilio

            // RESTRUCTURA FECHAS
            var fechas = [
                "per_Fecha_Bautismo",
                "per_Fecha_Boda_Civil",
                "per_Fecha_Boda_Eclesiastica",
                "per_Fecha_Nacimiento",
                "per_Fecha_Recibio_Espiritu_Santo"
            ]
            fechas.forEach(fecha => {
                objPersona[fecha] = fnFormatoFecha(objPersona[fecha])
            });

            // VALIDA CAMPOS DE PERSONA
            var camposPersonaAValidar = [
                { formato: "formatoFecha", campo: "per_Fecha_Bautismo", estado: "fechaBautismoInvalida" },
                { formato: "formatoFecha", campo: "per_Fecha_Boda_Civil", estado: "fechaBodaCivilInvalida" },
                { formato: "formatoFecha", campo: "per_Fecha_Boda_Eclesiastica", estado: "fechaBodaEclesiasticaInvalida" },
                { formato: "formatoFecha", campo: "per_Fecha_Recibio_Espiritu_Santo", estado: "fechaEspitiruSantoInvalida" },
                { formato: "formatoEmail", campo: "per_Email_Personal", estado: "emailInvalido" },
                { formato: "formatoTelefono", campo: "per_Telefono_Movil", estado: "telMovilInvalido" }
            ]
            camposPersonaAValidar.forEach(element => {
                validaFormatos(element.formato, objPersona[element.campo], element.estado)
            });

            if (!this.state.emailInvalido && !this.state.fechaBautismoInvalida &&
                !this.state.fechaBodaCivilInvalida && !this.state.fechaEspitiruSantoInvalida &&
                !this.state.fechaBodaEclesiasticaInvalida) {

                if (this.state.hogar.hd_Id_Hogar === "0") {
                    let PersonaDomicilioHogar = {
                        id: 1,
                        PersonaEntity: objPersona,
                        HogarDomicilioEntity: objDomicilio
                    }
                    fnGuardaPersona(PersonaDomicilioHogar)
                } else {
                    fnGuardaPersonaEnHogar(objPersona, this.state.hogar.hp_Jerarquia, this.state.hogar.hd_Id_Hogar)
                }
                console.log("Success: Campos validados")
            } else {
                console.log("Error: Campos invalidos")
            }
        }

        return (
            <React.Fragment>
                <h2 className="text-info">Agregar nuevo miembro</h2>

                <div className="border">
                    <Form onSubmit={enviarInfo} id="FrmRegistroPersona" className="p-3" /* onChange={this.FrmRegistroPersona} */ >
                        <Container>

                            {/* Verificar Nuevo Registro / Datos personales */}
                            {this.state.FrmValidaPersona &&
                                <Row>
                                    <Col xs="12">
                                        <Card className="border-info acceso-directo">
                                            <CardHeader>
                                                <h5><strong>Datos Personales</strong></h5>
                                            </CardHeader>
                                            <CardBody>
                                                <div className="alert alert-warning mt-3" role="alert">
                                                    <h5><strong>AVISO: </strong>Los campos marcados con <strong>*</strong> son requeridos.</h5>
                                                </div>

                                                <FormGroup>
                                                    <div className="row">
                                                        <div className="col-sm-2">
                                                            <label><strong>*</strong>Categoria</label>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <Input type="select"
                                                                name="per_Categoria"
                                                                onChange={onChange}
                                                                className="form-control"
                                                                value={form.per_Categoria}
                                                            >
                                                                <option value="0">Selecionar categoria</option>
                                                                <option value="ADULTO_HOMBRE">Adulto Hombre</option>
                                                                <option value="ADULTO_MUJER">Adulto Mujer</option>
                                                                <option value="JOVEN_HOMBRE">Joven hombre</option>
                                                                <option value="JOVEN_MUJER">Joven mujer</option>
                                                                <option value="NIÑO">Niño</option>
                                                                <option value="NIÑA">Niña</option>
                                                            </Input>
                                                        </div>
                                                        {categoriaSeleccionada &&
                                                            <span className="text-primary font-weight-bold font-italic">
                                                                {msjCategoriaSeleccionada}
                                                            </span>
                                                        }
                                                        {!categoriaSeleccionada &&
                                                            <span className="text-danger">
                                                                {msjCategoriaSeleccionada}
                                                            </span>
                                                        }
                                                    </div>
                                                </FormGroup>
                                                {habilitaPerBautizado &&
                                                    <FormGroup>
                                                        <div className="row">
                                                            <div className="col-sm-3">
                                                                <label>Bautizado</label>
                                                            </div>
                                                            <div className="col-sm-2">
                                                                <Input
                                                                    type="checkbox"
                                                                    name="per_Bautizado"
                                                                    onChange={onChange}
                                                                    className="form-control"
                                                                />
                                                            </div>
                                                        </div>
                                                    </FormGroup>
                                                }

                                                <FormGroup>
                                                    <div className="row">
                                                        <div className="col-sm-2">
                                                            <label><strong>*</strong> Nombre</label>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <Input
                                                                type="text"
                                                                name="per_Nombre"
                                                                onChange={onChange}
                                                                value={form.per_Nombre}
                                                                className="form-control"
                                                            />
                                                        </div>
                                                        {per_Nombre_NoValido &&
                                                            <span className="text-danger">
                                                                Campo requerido, solo acepta letras, numeros y espacios.
                                                            </span>
                                                        }
                                                    </div>
                                                </FormGroup>

                                                <FormGroup>
                                                    <div className="row">
                                                        <div className="col-sm-2">
                                                            <label><strong>*</strong> Apellido paterno</label>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <Input
                                                                type="text"
                                                                name="per_Apellido_Paterno"
                                                                onChange={onChange}
                                                                value={form.per_Apellido_Paterno}
                                                                className="form-control"
                                                            />
                                                        </div>
                                                        {per_Apellido_Paterno_NoValido &&
                                                            <span className="text-danger">
                                                                Campo requerido, solo acepta letras, numeros y espacios.
                                                            </span>
                                                        }
                                                    </div>
                                                </FormGroup>

                                                <FormGroup>
                                                    <div className="row">
                                                        <div className="col-sm-2">
                                                            <label>Apellido materno</label>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <Input
                                                                type="text"
                                                                name="per_Apellido_Materno"
                                                                onChange={onChange}
                                                                value={form.per_Apellido_Materno}
                                                                id="per_Apellido_Materno"
                                                                className="form-control"
                                                            />
                                                        </div>
                                                        {!this.state.per_Apellido_Materno_OK &&
                                                            <span className="text-primary font-italic">
                                                                (En blanco si se desconoce)
                                                            </span>
                                                        }
                                                    </div>
                                                </FormGroup>

                                                <FormGroup>
                                                    <div className="row">
                                                        <div className="col-sm-2">
                                                            <label><strong>*</strong> Fecha nacimiento</label>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <Input
                                                                type="text"
                                                                name="per_Fecha_Nacimiento"
                                                                onChange={onChange}
                                                                value={form.per_Fecha_Nacimiento}
                                                                className="form-control"
                                                                placeholder="DD/MM/AAAA"
                                                            />
                                                        </div>
                                                        {per_Fecha_Nacimiento_NoValido &&
                                                            <span className="text-danger">
                                                                Campo requerido, el formato de fecha debe ser DD/MM/AAAA.
                                                            </span>
                                                        }
                                                    </div>
                                                </FormGroup>

                                                {/* Boton para verificar duplicados */}
                                                <FormGroup>
                                                    <div className="row">
                                                        <div className="col-sm-2">
                                                            <Button
                                                                type="button"
                                                                onClick={handle_verificarDuplicados}
                                                                color="primary"
                                                            >
                                                                <i>Continuar</i>
                                                            </Button>
                                                        </div>
                                                        {this.state.PersonaEncontrada === true &&
                                                            <div className="col-sm-">
                                                                <Button
                                                                    type="button"
                                                                    onClick={handleIgnorarDuplicados}
                                                                    color="success"
                                                                >
                                                                    <span
                                                                        className="fa fa-check fa-sm"
                                                                        style={{ paddingRight: "20px" }}>
                                                                    </span>
                                                                    <i>Ignorar duplicados y continuar</i>
                                                                </Button>
                                                            </div>
                                                        }
                                                        <div className="col-sm-4"></div>
                                                    </div>
                                                </FormGroup>

                                                {this.state.PersonaEncontrada === true &&
                                                    <PersonaEncontrada
                                                        datosPersonaEncontrada={this.state.datosPersonaEncontrada}
                                                    />
                                                }

                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                            }
                            {this.state.FrmValidaPersona === false &&
                                <React.Fragment>
                                    {this.state.PersonaEncontrada === false &&
                                        <React.Fragment>
                                            {/* Datos de validacion */}
                                            <div className="row mx-auto mt-3">
                                                <div className="col-sm-12">
                                                    <div className="card border-info acceso-directo">
                                                        <div className="card-body">
                                                            <FormGroup>
                                                                <div className="row">
                                                                    <div className="col-sm-4">
                                                                        <Input
                                                                            type="text"
                                                                            className="form-control"
                                                                            value={form.per_Nombre}
                                                                            disabled
                                                                        />
                                                                        <label>Nombre</label>
                                                                    </div>
                                                                    <div className="col-sm-4">
                                                                        <Input
                                                                            type="text"
                                                                            className="form-control"
                                                                            value={form.per_Apellido_Paterno}
                                                                            disabled
                                                                        />
                                                                        <label>Apellido paterno</label>
                                                                    </div>
                                                                    <div className="col-sm-4">
                                                                        <Input
                                                                            type="text"
                                                                            className="form-control"
                                                                            value={form.per_Apellido_Materno}
                                                                            disabled
                                                                        />
                                                                        <label>Apellido materno</label>
                                                                    </div>
                                                                </div>
                                                            </FormGroup>
                                                            <FormGroup>
                                                                <div className="row">
                                                                    <div className="col-sm-4">
                                                                        <Input
                                                                            type="text"
                                                                            className="form-control"
                                                                            value={form.per_Categoria}
                                                                            disabled
                                                                        />
                                                                        <label>Categoria</label>
                                                                    </div>
                                                                    <div className="col-sm-4">
                                                                        <Input
                                                                            type="text"
                                                                            className="form-control"
                                                                            value={form.per_Fecha_Nacimiento}
                                                                            disabled
                                                                        />
                                                                        <label>Fecha de nacimiento</label>
                                                                    </div>
                                                                    <div className="col-sm-2">
                                                                        <Button
                                                                            type="Button"
                                                                            className="btn btn-success form-control"
                                                                            onClick={handleEditaNombre}
                                                                        >
                                                                            <span
                                                                                className="fa fa-pencil fa-sm"
                                                                                style={{ paddingRight: "10px" }}>
                                                                            </span>
                                                                            Editar nombre
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </FormGroup>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Datos generales */}
                                            <div className="row mx-auto mt-3">
                                                <div className="col-sm-12">
                                                    <div className="card border-info acceso-directo">
                                                        <div className="card-header">
                                                            <h5><strong>Datos Generales</strong></h5>
                                                        </div>
                                                        <div className="card-body">
                                                            <div className="row">
                                                                <div className="col-sm-4">
                                                                    <FormGroup>
                                                                        <Input
                                                                            type="text"
                                                                            name="per_Nacionalidad"
                                                                            onChange={onChange}
                                                                            className="form-control"
                                                                            value={form.per_Nacionalidad}
                                                                        />
                                                                        <label>Nacionalidad</label>
                                                                    </FormGroup>
                                                                </div>
                                                                <div className="col-sm-4">
                                                                    <FormGroup>
                                                                        <Input
                                                                            type="text"
                                                                            name="per_Lugar_De_Nacimiento"
                                                                            onChange={onChange}
                                                                            className="form-control"
                                                                            value={form.per_Lugar_De_Nacimiento}
                                                                        />
                                                                        <label>Lugar de nacimiento</label>
                                                                    </FormGroup>
                                                                </div>
                                                                <div className="col-sm-4">
                                                                    <FormGroup>
                                                                        <Input
                                                                            type="email"
                                                                            name="per_Email_Personal"
                                                                            onChange={onChange}
                                                                            invalid={this.state.emailInvalido}
                                                                            value={form.per_Email_Personal}
                                                                        />
                                                                        <label>Email</label>
                                                                        <FormFeedback>{this.state.mensajes.emailInvalido}</FormFeedback>
                                                                    </FormGroup>
                                                                </div>
                                                            </div>


                                                            <div className="row">
                                                                <div className="col-sm-4">
                                                                    <FormGroup>
                                                                        <Input type="select"
                                                                            name="pro_Id_Profesion_Oficio1"
                                                                            className="form-control"
                                                                            onChange={onChange}
                                                                            value={form.pro_Id_Profesion_Oficio1}
                                                                        >
                                                                            {
                                                                                this.state.profesiones_oficios.map((profesion_oficio) => {
                                                                                    return (
                                                                                        <option
                                                                                            key={profesion_oficio.pro_Id_Profesion_Oficio}
                                                                                            value={profesion_oficio.pro_Id_Profesion_Oficio}>
                                                                                            {profesion_oficio.pro_Categoria} | {profesion_oficio.pro_Sub_Categoria}
                                                                                        </option>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </Input>
                                                                        <label>Profesion oficio1</label>
                                                                    </FormGroup>
                                                                </div>
                                                                <div className="col-sm-4">
                                                                    <FormGroup>
                                                                        <Input type="select"
                                                                            name="pro_Id_Profesion_Oficio2"
                                                                            className="form-control"
                                                                            onChange={onChange}
                                                                            value={form.pro_Id_Profesion_Oficio2}
                                                                        >
                                                                            {
                                                                                this.state.profesiones_oficios.map((profesion_oficio, i) => {
                                                                                    return (
                                                                                        <option
                                                                                            key={profesion_oficio.pro_Id_Profesion_Oficio}
                                                                                            value={profesion_oficio.pro_Id_Profesion_Oficio}>
                                                                                            {profesion_oficio.pro_Categoria} | {profesion_oficio.pro_Sub_Categoria}
                                                                                        </option>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </Input>
                                                                        <label htmlFor="Personal.pro_Id_Profesion_Oficio2">Profesion oficio2</label>
                                                                    </FormGroup>
                                                                </div>
                                                                <div className="col-sm-4">
                                                                    <FormGroup>
                                                                        <Input
                                                                            type="text"
                                                                            name="per_Telefono_Movil"
                                                                            onChange={onChange}
                                                                            invalid={this.state.telMovilInvalido}
                                                                            value={form.per_Telefono_Movil}
                                                                        />
                                                                        <label>Telefono movil</label>
                                                                        <FormFeedback>{this.state.mensajes.telMovilInvalido}</FormFeedback>
                                                                    </FormGroup>
                                                                </div>
                                                            </div>
                                                            <FormGroup>
                                                                <div className="row">
                                                                    <div className="col-sm-4">
                                                                        <Input
                                                                            type="file"
                                                                            name="per_foto"
                                                                            onChange={onChange}
                                                                            className="form-control"
                                                                        />
                                                                        <label>Foto</label>
                                                                    </div>
                                                                </div>
                                                            </FormGroup>

                                                            <FormGroup>
                                                                <div className="row">
                                                                    <div className="col-sm-12">
                                                                        <textarea
                                                                            name="per_Cargos_Desempenados"
                                                                            onChange={onChange}
                                                                            className="form-control"
                                                                            value={form.per_Cargos_Desempenados}
                                                                        ></textarea>
                                                                        <label>Cargos desempeñados</label>
                                                                    </div>
                                                                </div>
                                                            </FormGroup>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {this.state.infante === false &&
                                                <React.Fragment>
                                                    {/* Familia Asendente */}
                                                    <div className="row mx-auto mt-3">
                                                        <div className="col-sm-12">
                                                            <div className="card border-info acceso-directo">
                                                                <div className="card-header">
                                                                    <h5><strong>Familia Asendente</strong></h5>
                                                                </div>
                                                                <div className="card-body">
                                                                    <FormGroup>
                                                                        <div className="row">
                                                                            <div className="col-sm-6">
                                                                                <Input
                                                                                    type="text"
                                                                                    name="per_Nombre_Padre"
                                                                                    onChange={onChange}
                                                                                    className="form-control"
                                                                                    value={form.per_Nombre_Padre}
                                                                                />
                                                                                <label>Padre</label>
                                                                            </div>
                                                                            <div className="col-sm-6">
                                                                                <Input
                                                                                    type="text"
                                                                                    name="per_Nombre_Madre"
                                                                                    onChange={onChange}
                                                                                    className="form-control"
                                                                                    value={form.per_Nombre_Madre}
                                                                                />
                                                                                <label>Madre</label>
                                                                            </div>
                                                                        </div>
                                                                    </FormGroup>

                                                                    <FormGroup>
                                                                        <div className="row">
                                                                            <div className="col-sm-6">
                                                                                <Input
                                                                                    type="text"
                                                                                    name="per_Nombre_Abuelo_Paterno"
                                                                                    onChange={onChange}
                                                                                    className="form-control"
                                                                                    value={form.per_Nombre_Abuelo_Paterno}
                                                                                />
                                                                                <label>Abuelo paterno</label>
                                                                            </div>
                                                                            <div className="col-sm-6">
                                                                                <Input
                                                                                    type="text"
                                                                                    name="per_Nombre_Abuela_Paterna"
                                                                                    onChange={onChange}
                                                                                    className="form-control"
                                                                                    value={form.per_Nombre_Abuela_Paterna}
                                                                                />
                                                                                <label>Abuela paterna</label>
                                                                            </div>
                                                                        </div>
                                                                    </FormGroup>

                                                                    <FormGroup>
                                                                        <div className="row">
                                                                            <div className="col-sm-6">
                                                                                <Input
                                                                                    type="text"
                                                                                    name="per_Nombre_Abuelo_Materno"
                                                                                    onChange={onChange}
                                                                                    className="form-control"
                                                                                    value={form.per_Nombre_Abuelo_Materno}
                                                                                />
                                                                                <label>Abuelo materno</label>
                                                                            </div>
                                                                            <div className="col-sm-6">
                                                                                <Input
                                                                                    type="text"
                                                                                    name="per_Nombre_Abuela_Materna"
                                                                                    onChange={onChange}
                                                                                    className="form-control"
                                                                                    value={form.per_Nombre_Abuela_Materna}
                                                                                />
                                                                                <label>Abuela materna</label>
                                                                            </div>
                                                                        </div>
                                                                    </FormGroup>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Estado Civil */}
                                                    <div className="row mx-auto mt-3">
                                                        <div className="col-sm-12">
                                                            <div className="card border-info acceso-directo">
                                                                <div className="card-header">
                                                                    <h5><strong>Estado Civil</strong></h5>
                                                                </div>
                                                                <div className="card-body">
                                                                    <FormGroup>
                                                                        <div className="row">
                                                                            <div className="col-sm-4">
                                                                                <Input type="select"
                                                                                    value={form.per_Estado_Civil}
                                                                                    name="per_Estado_Civil"
                                                                                    onChange={handle_per_Estado_Civil}
                                                                                    className="form-control"
                                                                                >
                                                                                    <option value="SOLTERO(A)">Soltero/a SIN hijos</option>
                                                                                    <option value="CASADO(A)">Casado/a</option>
                                                                                    <option value="DIVORCIADO(A)">Divorciado/a</option>
                                                                                    <option value="VIUDO(A)">Viudo/a</option>
                                                                                    <option value="CONCUBINATO">Unión libre/concubinato</option>
                                                                                    <option value="SOLTERO(A) CON HIJOS">Soltero/a CON hijos</option>
                                                                                </Input>
                                                                                <label>Estado civil</label>
                                                                            </div>

                                                                            {/* Matrimonio */}
                                                                            {this.state.CasadoDivorciadoViudo &&
                                                                                <React.Fragment>
                                                                                    <div className="col-sm-4">
                                                                                        <Input
                                                                                            type="text"
                                                                                            name="per_Nombre_Conyuge"
                                                                                            onChange={onChange}
                                                                                            className="form-control"
                                                                                        />
                                                                                        <label>Nombre conyuge</label>
                                                                                    </div>
                                                                                    <div className="col-sm-4">
                                                                                        <Input
                                                                                            type="text"
                                                                                            name="per_Fecha_Boda_Civil"
                                                                                            onChange={onChange}
                                                                                            value={form.per_Fecha_Boda_Civil}
                                                                                            placeholder="DD/MM/AAAA"
                                                                                            className="form-control"
                                                                                        />
                                                                                        <label>Fecha boda civil</label>
                                                                                    </div>
                                                                                </React.Fragment>
                                                                            }
                                                                        </div>
                                                                    </FormGroup>
                                                                    {/* Matrimonio */}
                                                                    {this.state.CasadoDivorciadoViudo &&
                                                                        <React.Fragment>
                                                                            <FormGroup>
                                                                                <div className="row">
                                                                                    <div className="col-sm-4">
                                                                                        <Input
                                                                                            type="text"
                                                                                            name="per_Num_Acta_Boda_Civil"
                                                                                            onChange={onChange}
                                                                                            className="form-control"
                                                                                            value={form.per_Num_Acta_Boda_Civil}
                                                                                        />
                                                                                        <label>Num acta boda civil</label>
                                                                                    </div>
                                                                                    <div className="col-sm-4">
                                                                                        <Input
                                                                                            type="text"
                                                                                            name="per_Libro_Acta_Boda_Civil"
                                                                                            onChange={onChange}
                                                                                            className="form-control"
                                                                                            value={form.per_Libro_Acta_Boda_Civil}
                                                                                        />
                                                                                        <label>Libro acta boda civil</label>
                                                                                    </div>
                                                                                    <div className="col-sm-4">
                                                                                        <Input
                                                                                            type="text"
                                                                                            name="per_Oficialia_Boda_Civil"
                                                                                            onChange={onChange}
                                                                                            className="form-control"
                                                                                            value={form.per_Oficialia_Boda_Civil}
                                                                                        />
                                                                                        <label>Oficialia boda civil</label>
                                                                                    </div>
                                                                                </div>
                                                                            </FormGroup>
                                                                        </React.Fragment>
                                                                    }

                                                                    {form.per_Bautizado &&
                                                                        <React.Fragment>

                                                                            <div className="row">
                                                                                <div className="col-sm-4">
                                                                                    <FormGroup>
                                                                                        <Input
                                                                                            type="text"
                                                                                            name="per_Fecha_Boda_Eclesiastica"
                                                                                            onChange={onChange}
                                                                                            value={form.per_Fecha_Boda_Eclesiastica}
                                                                                            placeholder="DD/MM/AAAA"
                                                                                            invalid={this.state.fechaBodaEclesiasticaInvalida}
                                                                                        />
                                                                                        <label htmlFor="per_Fecha_Boda_Eclesiastica">Fecha boda eclesiastica</label>
                                                                                        <FormFeedback>{this.state.mensajes.fechaBodaEclesiasticaInvalida}</FormFeedback>
                                                                                    </FormGroup>
                                                                                </div>
                                                                                <div className="col-sm-4">
                                                                                    <FormGroup>
                                                                                        <Input
                                                                                            type="text"
                                                                                            name="per_Lugar_Boda_Eclesiastica"
                                                                                            onChange={onChange}
                                                                                            className="form-control"
                                                                                            value={form.per_Lugar_Boda_Eclesiastica}
                                                                                        />
                                                                                        <label>Lugar boda eclesiastica</label>
                                                                                    </FormGroup>
                                                                                </div>
                                                                            </div>

                                                                        </React.Fragment>
                                                                    }

                                                                    {this.state.ConcubinatoSolteroConHijos &&
                                                                        <React.Fragment>
                                                                            <div id="hijos">
                                                                                <FormGroup>
                                                                                    <div className="row">
                                                                                        <div className="col-sm-2">
                                                                                            <Input
                                                                                                type="number"
                                                                                                name="per_Cantidad_Hijos"
                                                                                                onChange={onChange}
                                                                                                className="form-control"
                                                                                                value={form.per_Cantidad_Hijos}
                                                                                            />
                                                                                            <label>Cantidad hijos</label>
                                                                                        </div>
                                                                                    </div>
                                                                                </FormGroup>

                                                                                <FormGroup>
                                                                                    <div className="row">
                                                                                        <div className="col-sm-12">
                                                                                            <textarea
                                                                                                name="per_Nombre_Hijos"
                                                                                                onChange={onChange}
                                                                                                value={form.per_Nombre_Hijos}
                                                                                                className="form-control" ></textarea>
                                                                                            <label>Nombre de los hijos</label>
                                                                                        </div>
                                                                                    </div>
                                                                                </FormGroup>
                                                                            </div>
                                                                        </React.Fragment>
                                                                    }
                                                                    {/* {per_Fecha_Boda_Civil_NoValido &&
                                                                        <span className="text-danger">
                                                                            Campo requerido, el formato de fecha debe ser DD/MM/AAAA.
                                            </span>
                                                                    }
                                                                    {per_Fecha_Boda_Eclesiastica_NoValido &&
                                                                        <span className="text-danger">
                                                                            Campo requerido, el formato de fecha debe ser DD/MM/AAAA.
                                                                    </span>
                                                                    } */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Eclesiasticos */}
                                                    <div className="row mx-auto mt-3">
                                                        <div className="col-sm-12">
                                                            <div className="card border-info acceso-directo">
                                                                <div className="card-header">
                                                                    <h5><strong>Eclesiasticos</strong></h5>
                                                                </div>
                                                                <div className="card-body">
                                                                    {/* Bautismo */}
                                                                    {form.per_Bautizado &&
                                                                        <React.Fragment>

                                                                            <div className="row">
                                                                                <div className="col-sm-4">
                                                                                    <FormGroup>
                                                                                        <Input
                                                                                            type="text"
                                                                                            name="per_Lugar_Bautismo"
                                                                                            onChange={onChange}
                                                                                            value={form.per_Lugar_Bautismo}
                                                                                            className="form-control"
                                                                                        />
                                                                                        <label>Lugar bautismo</label>
                                                                                    </FormGroup>
                                                                                </div>
                                                                                <div className="col-sm-4">
                                                                                    <FormGroup>
                                                                                        <Input
                                                                                            type="text"
                                                                                            name="per_Ministro_Que_Bautizo"
                                                                                            onChange={onChange}
                                                                                            value={form.per_Ministro_Que_Bautizo}
                                                                                            className="form-control"
                                                                                        />
                                                                                        <label>Ministro que bautizo</label>
                                                                                    </FormGroup>
                                                                                </div>
                                                                                <div className="col-sm-4">
                                                                                    <FormGroup>
                                                                                        <Input
                                                                                            type="text"
                                                                                            name="per_Fecha_Bautismo"
                                                                                            onChange={onChange}
                                                                                            value={form.per_Fecha_Bautismo}
                                                                                            placeholder="DD/MM/AAAA"
                                                                                            invalid={this.state.fechaBautismoInvalida}
                                                                                        />
                                                                                        <label>Fecha bautismo</label>
                                                                                        <FormFeedback>{this.state.mensajes.fechaBautismoInvalida}</FormFeedback>
                                                                                    </FormGroup>
                                                                                </div>
                                                                            </div>

                                                                        </React.Fragment>
                                                                    }


                                                                    <div className="row">
                                                                        <div className="col-sm-4">
                                                                            <FormGroup>
                                                                                <Input
                                                                                    type="text"
                                                                                    name="per_Fecha_Recibio_Espiritu_Santo"
                                                                                    onChange={onChange}
                                                                                    value={form.per_Fecha_Recibio_Espiritu_Santo}
                                                                                    placeholder="DD/MM/AAAA"
                                                                                    invalid={this.state.fechaEspitiruSantoInvalida}
                                                                                />
                                                                                <label>Fecha recibio Espiritu Santo</label>
                                                                                <FormFeedback>{this.state.mensajes.fechaEspitiruSantoInvalida}</FormFeedback>
                                                                            </FormGroup>
                                                                        </div>
                                                                        <div className="col-sm-4">
                                                                            <FormGroup>
                                                                                <Input
                                                                                    type="text"
                                                                                    name="per_Bajo_Imposicion_De_Manos"
                                                                                    onChange={onChange}
                                                                                    value={form.per_Bajo_Imposicion_De_Manos}
                                                                                    className="form-control"
                                                                                />
                                                                                <label>Bajo imposicion de manos</label>
                                                                            </FormGroup>
                                                                        </div>
                                                                        {/* <div className="col-sm-4">
                                            <Input
                                                type="checkbox"
                                                name="PromesaDelEspirituSanto"
                                                onChange={this.fnPromesaDelEspirituSanto}
                                                className="form-control"
                                            />
                                            <label>Promesa del Espiritu Santo</label>
                                        </div>
                                        {this.state.PromesaDelEspitiruSanto &&
                                            <React.Fragment>
                                                
                                                
                                            </React.Fragment>
                                        } */}
                                                                    </div>


                                                                    <FormGroup>
                                                                        <div className="row">
                                                                            <div className="col-sm-12">
                                                                                <textarea
                                                                                    name="per_Cambios_De_DomicilioRef"
                                                                                    onChange={onChange}
                                                                                    value={form.per_Cambios_De_DomicilioRef}
                                                                                    className="form-control"></textarea>
                                                                                <label>Cambios de domicilio</label>
                                                                            </div>
                                                                        </div>
                                                                    </FormGroup>
                                                                    {/* {per_Fecha_Recibio_Espiritu_Santo_NoValido &&
                                                                    <span className="text-danger">
                                                                        Campo requerido, el formato de fecha debe ser DD/MM/AAAA.
                                        </span>
                                                                }
                                                                {per_Fecha_Bautismo_NoValido &&
                                                                    <span className="text-danger">
                                                                        Campo requerido, el formato de fecha debe ser DD/MM/AAAA.
                                            </span>
                                                                } */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </React.Fragment>
                                            }


                                            {/* Hogar */}
                                            <div className="row mx-auto mt-3">
                                                <div className="col-sm-12">
                                                    <div className="card border-info acceso-directo">
                                                        <div className="card-header">
                                                            <h5><strong>Hogar / Domicilio</strong></h5>
                                                        </div>
                                                        <div className="card-body">
                                                            <HogarPersonaDomicilio
                                                                domicilio={domicilio}
                                                                onChangeDomicilio={onChangeDomicilio}
                                                                handle_hd_Id_Hogar={this.handle_hd_Id_Hogar}
                                                                handle_hp_Jerarquia={this.handle_hp_Jerarquia}
                                                                hogar={this.state.hogar}
                                                                DatosHogarDomicilio={this.state.DatosHogarDomicilio}
                                                                MiembrosDelHogar={this.state.MiembrosDelHogar}
                                                                JerarquiasDisponibles={this.state.JerarquiasDisponibles}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Botones al final de formulario */}
                                            <FormGroup>
                                                <div className="row mt-3">
                                                    <div className="col-sm-2 offset-sm-2">
                                                        <Link
                                                            to="/ListaDePersonal"
                                                            className="btn btn-success form-control"
                                                        >
                                                            <span className="fa fa-backspace" style={{ paddingRight: "10px" }}></span>
                                                            Volver
                                                        </Link>
                                                    </div>
                                                    <div className="col-sm-2 offset-sm-2">
                                                        <Button
                                                            type="submit"
                                                            className="btn btn-primary form-control"
                                                        >
                                                            <span className="fa fa-save" style={{ paddingRight: "10px" }}></span>
                                                            Guardar
                                                        </Button>
                                                    </div>
                                                </div>
                                            </FormGroup>
                                        </React.Fragment>
                                    }
                                </React.Fragment>
                            }

                        </Container>
                        {/* </div> */}
                    </Form>
                </div>
                <Modal // Datos generales
                    isOpen={this.state.showModalAltaPersona}
                    className="modalStyle"
                >
                    <div className="card border-info">
                        <div className="card-header text-center">
                            <h5><strong>AVISO!</strong></h5>
                        </div>
                        <div className="card-body">
                            La persona fue dada de alta correctamente.
                        </div>
                        <Button className="btn btn-sm btn-secondary" onClick={this.closeModalAltaPersona}>Cerrar</Button>
                    </div>
                </Modal>
            </React.Fragment>
        );
    }
}

export default PersonaForm;