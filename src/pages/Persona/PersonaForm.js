import React, { Component } from 'react';
import '../../assets/css/index.css'
import 'react-day-picker/lib/style.css';
import axios from 'axios';
import helpers from '../../components/Helpers'
import { Link, Redirect } from 'react-router-dom';
import PersonaEncontrada from './PersonaEncontrada'
import HogarPersonaDomicilio from './HogarPersonaDomicilio';
import Modal from 'react-modal';
import {
    Container, Row, Col, Form, FormGroup, Input, Button,
    FormFeedback, /* CardTitle, */ Card, CardBody, CardHeader
} from 'reactstrap';

class PersonaForm extends Component {

    url = helpers.url_api;
    fechaNoIngresada = "";


    // EXPRESIONES REGULARES PARA VALIDAR CAMPOS
    const_regex = {
        alphaSpaceRequired: /^[a-zA-Z]{2}[a-zA-ZÑ\d\s]{0,37}$/,
        alfaSpace: /^[a-zA-ZÑ\s]{0,37}$/,
        formatoFecha: /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\4(?:(?:1[6-9]|[2-9]\d)?\d{4})$/,
        formatoEmail: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        formatoTelefono: /^(\+\d{1,3})*(\(\d{2,3}\))*\d{7,25}$/
    }

    constructor(props) {
        super(props)
        this.state = {
            profesiones_oficios: [],
            infante: JSON.parse(localStorage.getItem("nvaAltaBautizado")) ? false : true,
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
            hogar: {},
            redirect: false,
            showModalAltaPersona: false,
            emailInvalido: false,
            //fechaBautismoInvalida: false,
            fechaBodaCivilInvalida: false,
            fechaEspitiruSantoInvalida: false,
            fechaBodaEclesiasticaInvalida: false,
            telMovilInvalido: false,
            mensajes: {},
            DatosHogarDomicilio: [],
            MiembrosDelHogar: [],
            JerarquiasDisponibles: [],
            foto: null,
            direccion: ""
        };
        if (!localStorage.getItem("token")) {
            document.location.href = '/';
        }
    }

    componentDidMount() {
        this.setState({
            hogar: { //Inicializa las variables del Objeto 'Hogar'
                ...this.state.hogar,
                hd_Id_Hogar: "0",
                hp_Jerarquia: "1"
            },
            mensajes: { //Inicializa las variables del Objeto 'mensajes'
                ...this.state.mensajes,
                emailInvalido: 'Formato incorrecto. Ej: buzon@dominio.com.',
                fechaBautismoInvalida: 'Debe ingresar la fecha de Bautismo, formato admitido: dd/mm/aaaa.',
                fechaBodaCivilInvalida: 'Formato admitido: dd/mm/aaaa.',
                fechaEspitiruSantoInvalida: 'Formato admitido: dd/mm/aaaa.',
                fechaBodaEclesiasticaInvalida: 'Formato admitido: dd/mm/aaaa.',
                telMovilInvalido: 'Formatos admitidos: +521234567890, +52(123)4567890, (123)4567890, 1234567890. Hasta 25 números sin espacios.',
            }
        })

        this.getProfesionesOficios();//Trae por medio de API las profeciones y oficios

        //Para Transacciones de Edición/Actualización, inicializa .
        if (localStorage.getItem("idPersona") !== "0") {//Manda llamar por API las personas en Comunión para mostrarlas en Imput/Select.
            helpers.authAxios.get(this.url + "/Hogar_Persona/GetHogarByPersona/" + localStorage.getItem("idPersona"))
                .then(res => {
                    this.setState({
                        hogar: {
                            ...this.state.hogar,
                            hd_Id_Hogar: String(res.data.datosDelHogarPorPersona.hogarPersona.hd_Id_Hogar),
                            hp_Jerarquia: String(res.data.datosDelHogarPorPersona.hp_Jerarquia)
                        }
                    })
                    //Manda traer los datos del Hogar de la personas Seleccionada
                    this.fnGetDatosDelHogar(res.data.datosDelHogarPorPersona.hogarPersona.hd_Id_Hogar)
                })
            setInterval(() => {
                //Con cierta lógica inicializa 3 variables de Estado relacionadas al Estado Civil.
                this.actualizaEstadoCivil();
            }, 500);
        }
    };


    openModalAltaPersona = () => {
        this.setState({
            showModalAltaPersona: true
        });
    }
    closeModalAltaPersona = () => {
        this.setState({ showModalAltaPersona: false });
        return <Redirect to='/ListaDePersonal' />;
    }

    actualizaEstadoCivil = () => { //
        let cdv = false //Para Cadao-Divorciado-Viudo
        let csh = false //Para SolteroCOnHijos o Concubinato
        let s = false //Soltero

        //Inicia la variable de EstadoCivil Para Cadao-Divorciado-Viudo
        if (localStorage.getItem('estadoCivil') === 'CASADO(A)'
            || localStorage.getItem('estadoCivil') === 'DIVORCIADO(A)'
            || localStorage.getItem('estadoCivil') === 'VIUDO(A)') {
            cdv = true
            csh = false
            s = false
        }

        //Inicia la variable de EstadoCivil Para SolteroCOnHijos o Concubinato
        if (localStorage.getItem('estadoCivil') === 'SOLTERO(A) CON HIJOS'
            || localStorage.getItem('estadoCivil') === 'CONCUBINATO') {
            cdv = false
            csh = true
            s = false
        }

        //Inicia la variable de EstadoCivil Para Soltero
        if (localStorage.getItem('estadoCivil') === 'SOLTERO(A)') {
            cdv = false
            csh = false
            s = true
        }

        //Pone en Varibles de Estado las variables recien instanciadas.
        this.setState({
            CasadoDivorciadoViudo: cdv,
            ConcubinatoSolteroConHijos: csh,
            soltero: s
        })
    }

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
            await helpers.authAxios.get(this.url + "/Hogar_Persona/GetMiembros/" + id)
                .then(res => {
                    this.setState({ MiembrosDelHogar: res.data })
                })
            await helpers.authAxios.get(this.url + "/Hogar_Persona/GetDatosHogarDomicilio/" + id)
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

    handle_hd_Id_Hogar = async (e) => {
        let idHogar = e.target.value;

        if (idHogar !== "0") { //Si se selecciona un Hogar Existente
            await helpers.authAxios.get(this.url + '/Hogar_Persona/GetMiembros/' + idHogar)
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
                await helpers.authAxios.get(this.url + "/HogarDomicilio/" + id)
                    .then(res => {
                        this.setState({ direccion: res.data.direccion });
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

        this.fnGetDatosDelHogar(idHogar);//Pone en variables de Estado los datos de los Mimebros del hogar seleccionado y del Domicilio
    }

    handle_hp_Jerarquia = (e) => {
        this.setState({
            hogar: {
                ...this.state.hogar,
                hp_Jerarquia: e.target.value
            }
        })
    }

    handleKeyPress = (e) => { //No permite que presione la tecla enter en los campos de TextArea como Nombre de Hijos, Cambios de Domicilio, etc.
        if (e.key === 'Enter') {
            alert("No se permiten saltos de línea en este campo. Escriba a Renglón seguido.");
            e.preventDefault();
        }
    }

    render() {
        const {
            onChange,
            form,
            domicilio,
            FrmValidaPersona,
            bolPersonaEncontrada,
            setFrmValidaPersona,
            setBolPersonaEncontrada,
            onChangeDomicilio,
            categoriaSeleccionada,
            msjCategoriaSeleccionada,
            per_Nombre_NoValido,
            per_Apellido_Paterno_NoValido,
            per_Fecha_Nacimiento_NoValido,
            per_Apellido_Materno_OK,
            changeRFCSinHomo,
            changeEstadoCivil,
            fnGuardaPersona,
            fnGuardaPersonaEnHogar,
            boolAgregarNvaPersona,
            boolComentarioEdicion,
            handle_ComentarioHistorialTransacciones,
            ComentarioHistorialTransacciones,
            fnEditaPersona,
            descNvaProfesion,
            handle_descNvaProfesion,
            foto,
            boolNvoEstado,
            handleChangeEstado,
            handleCampoInvalido,
            habilitaPerBautizado,
            onChangeFechaBautismo,
            fechaBautismoInvalida,
            ChangeFechaBautismoInvalida,
            FechaTransaccionHistorica,
            handleFechaDeTransaccion
        } = this.props
        /* const per_Apellido_Materno = document.getElementById('per_Apellido_Materno') */
        const alphaSpaceRequired = /^[a-zA-Z]{1}[a-zA-ZÑ\s]{0,37}$/;
        const alphaSpace = /^[a-zA-ZÑ\s]{0,37}$/;

        // ESTRUCTURA EL RFC Y COMPRUEBA DUPLICADOS
        const CheckNvaPersona = (per_Nombre, per_Apellido_Paterno, per_Apellido_Materno, per_Fecha_Nacimiento) => {
            // Obtener primera letra del apellido paterno
            var ap = per_Apellido_Paterno.split("");

            // Obtener primera vocal del apellido paterno
            var regex = /[^aeiou]/gi;
            var vowels = per_Apellido_Paterno.replace(regex, "");
            var pv = vowels[0] === ap[0] ? vowels[1] : vowels[0];

            // Obtener primera letra del apellido materno
            // var am = per_Apellido_Materno.split("");
            var am;
            switch (form.per_Categoria) {
                default:
                    am = "M";
                    break;
                case "ADULTO_MUJER":
                    am = "F";
                    break;
                case "JOVEN_MUJER":
                    am = "F";
                    break;
                case "NIÑA":
                    am = "F";
                    break;
            }

            // Obtener primera letra del primer nombre
            var n = per_Nombre.split("");

            // Reformateando fecha
            var f = per_Fecha_Nacimiento.split("-");
            var y = f[0].substr(2, 2);

            // Creando cadena de validacion de duplicados
            //var RFCSinHomo = ap[0] + pv + am[0] + n[0] + y + f[1] + f[2]
            var RFCSinHomo = ap[0] + pv + am + n[0] + y + f[1] + f[2];

            changeRFCSinHomo(RFCSinHomo);
            getPersonaByRFCSinHomo(RFCSinHomo);
        }

        // RECUPERA INFO DE PERSONA DUPLICADA DE ACUERDO AL RFC (SIN HOMOCLAVE)
        const getPersonaByRFCSinHomo = async (str) => {
            //Verifica que la Clave-Persona que se le pasa por parámetro no se encuentre en la BBDD
            await helpers.authAxios.get(this.url + "/persona/GetByRFCSinHomo/" + str)
                .then(res => {

                    if (res.data.status) {//Si encuentra por lo menos una coincidencia.
                        if (res.data.persona[0].per_Id_Persona != localStorage.getItem("idPersona")) { //Si es una persona diferente a la que se está editando.
                            setFrmValidaPersona(true)
                            setBolPersonaEncontrada(true)
                            this.setState({ datosPersonaEncontrada: res.data.persona[0] })
                        } else {
                            setFrmValidaPersona(false)
                            setBolPersonaEncontrada(false)
                            this.setState({ datosPersonaEncontrada: [] })
                        }

                    } else {
                        setFrmValidaPersona(false)
                        setBolPersonaEncontrada(false)
                        this.setState({ datosPersonaEncontrada: [] })
                    }
                })
        }

        const handleIgnorarDuplicados = () => {
            setFrmValidaPersona(false)
            setBolPersonaEncontrada(false)
            this.setState({ datosPersonaEncontrada: [] })
        }

        // FUNCION QUE REVISA DUPLICADOS DEACUERDO A RFC (SIN HOMOCLAVE)
        const handle_verificarDuplicados = (e) => {

            if (form.per_Categoria == 0) {
                handleCampoInvalido("categoriaSeleccionada", false);
                return false
            }
            if (!alphaSpaceRequired.test(form.per_Nombre) || form.per_Nombre === undefined) {
                handleCampoInvalido("per_Nombre_NoValido", true)
                return false
            }
            if (!alphaSpaceRequired.test(form.per_Apellido_Paterno) || form.per_Apellido_Paterno === undefined) {
                handleCampoInvalido("per_Apellido_Paterno_NoValido", true)
                return false
            }
            if (!alphaSpace.test(form.per_Apellido_Materno)) {
                handleCampoInvalido("per_Apellido_Materno_OK", false)
                return false
            }

            if (form.per_Fecha_Nacimiento === undefined || form.per_Fecha_Nacimiento === "") {
                handleCampoInvalido("per_Fecha_Nacimiento_NoValido", true)
                return false
            }
            else if (!helpers.regex.formatoFecha.test(helpers.fnFormatoFecha3(form.per_Fecha_Nacimiento))) {
                handleCampoInvalido("per_Fecha_Nacimiento_NoValido", true)
                return false
            }
            //Si todos los campos obligatorios están llenos.
            if (categoriaSeleccionada
                && !per_Nombre_NoValido
                && !per_Apellido_Paterno_NoValido
                && !per_Fecha_Nacimiento_NoValido
                && per_Apellido_Materno_OK) {

                if (form.per_Categoria === "NIÑO" || form.per_Categoria === "NIÑA") {
                    this.setState({ infante: true })
                } else {
                    this.setState({ infante: false })
                }

                if (JSON.parse(localStorage.getItem("nvaAltaBautizado")) === false) {
                    this.setState({ infante: true })
                }

                var per_Apellido_Materno = document.getElementById('per_Apellido_Materno')

                if (alphaSpace.test(per_Apellido_Materno.value)
                    || per_Apellido_Materno.value === "") {

                    this.setState({ per_Apellido_Materno_OK: true })
                    let am = per_Apellido_Materno.value === "" ? "1" : per_Apellido_Materno.value

                    CheckNvaPersona(form.per_Nombre, form.per_Apellido_Paterno, am, form.per_Fecha_Nacimiento)

                } else if (!per_Apellido_Materno.value === "" && !alphaSpace.test(per_Apellido_Materno.value)) {
                    this.setState({ per_Apellido_Materno_OK: false })
                    //alert("Sólo acepta letras (Sin acentos) y espacios.")
                }
            } else {
                this.setState({ per_Apellido_Materno_OK: false })
                alert("Debes capturar correctamente los campos requeridos de acuerdo a las reglas indicadas.")
            }
        }

        // FUNCION PARA MOSTRAR FORMULARIO DE EDICION DE CAMPOS GENERALES
        const handleEditaNombre = () => {
            setFrmValidaPersona(true)
            setBolPersonaEncontrada(false)
        }

        // FUNCION PARA MOSTRAR CAMPOS DE ACUERDO AL ESTADO CIVIL
        const handle_per_Estado_Civil = (e) => {
            if (e.target.value === 'CASADO(A)'
                || e.target.value === 'DIVORCIADO(A)'
                || e.target.value === 'VIUDO(A)') {
                this.setState({
                    CasadoDivorciadoViudo: true,
                    ConcubinatoSolteroConHijos: false,
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

        const enviarInfo = async (e) => {
            e.preventDefault();
            var objPersona = this.props.form
            var objDomicilio = this.props.domicilio

            if (objPersona.per_Bautizado === true
                && objPersona.per_Fecha_Bautismo === "") {
                alert("Error: \nSe requiere la Fecha de Bautismo.");
                ChangeFechaBautismoInvalida(true)
                return false;
            }
            else {
                ChangeFechaBautismoInvalida(false)
            }

            // VALIDA CAMPOS DE PERSONA
            var camposPersonaAValidar = [
                /* { formato: "formatoFecha", campo: "per_Fecha_Bautismo", estado: "fechaBautismoInvalida" },
                { formato: "formatoFecha", campo: "per_Fecha_Boda_Civil", estado: "fechaBodaCivilInvalida" },
                { formato: "formatoFecha", campo: "per_Fecha_Boda_Eclesiastica", estado: "fechaBodaEclesiasticaInvalida" },
                { formato: "formatoFecha", campo: "per_Fecha_Recibio_Espiritu_Santo", estado: "fechaEspitiruSantoInvalida" },
                { formato: "formatoEmail", campo: "per_Email_Personal", estado: "emailInvalido" },
                { formato: "formatoTelefono", campo: "per_Telefono_Movil", estado: "telMovilInvalido" } */
            ]
            camposPersonaAValidar.forEach(element => {
                validaFormatos(element.formato, objPersona[element.campo], element.estado)
            });

            /* console.log("Success: Campos validados") */
            if (boolAgregarNvaPersona) {
                /* SI LA PERSONA NO ES BAUTIZADA ENTONCES NO PODRA CREAR UN NUEVO HOGAR */
                if (!form.per_Bautizado && this.state.hogar.hd_Id_Hogar === "0") {
                    alert("LO SENTIMOS! \nUna persona NO BAUTAZADA no puede dar de alta un Nuevo Hogar/Domicilio. Favor de asignarla a un Hogar Existente.");
                    return false;
                }

                if (this.state.hogar.hd_Id_Hogar === "0") {// Si el Registro es de Persona y de Hogar
                    let PersonaDomicilioHogar = {
                        id: 1,
                        PersonaEntity: objPersona,
                        HogarDomicilioEntity: objDomicilio
                    }
                    if (domicilio.pais_Id_Pais === "0"
                        || domicilio.hd_Calle === ""
                        || domicilio.hd_Municipio_Ciudad === "") {
                        alert("Error!. Debe ingresar al menos Calle, Ciudad y País y Estado para un Nuevo Domicilio.")
                        return false;
                    }
                    await fnGuardaPersona(PersonaDomicilioHogar)
                } else {//Si el Registro es de una Persona que se asignará a un Hogar Existente
                    await fnGuardaPersonaEnHogar(objPersona, this.state.hogar.hp_Jerarquia, this.state.hogar.hd_Id_Hogar)
                }
            }
            else {
                await fnEditaPersona(objPersona)
            }
        }

        return (
            <React.Fragment>
                {/* <h2 className="text-info">{tituloAgregarEditar}</h2> */}

                <div className="border">
                    <Form onSubmit={enviarInfo} id="FrmRegistroPersona" className="p-3" /* onChange={this.FrmRegistroPersona} */ >
                        <Container>

                            {/* Verificar Nuevo Registro / Datos personales */}
                            {FrmValidaPersona &&
                                <Row>
                                    <Col xs="12">
                                        <Card className="border-info acceso-directo">
                                            <CardHeader>
                                                <h5><strong>Datos Personales</strong></h5>
                                            </CardHeader>
                                            <CardBody>
                                                <div className="alert alert-warning mt-3" role="alert">
                                                    <h5><strong>Nota: </strong>Los campos marcados con <strong>*</strong> son requeridos.</h5>
                                                </div>

                                                <FormGroup>
                                                    <div className="row">
                                                        <div className="col-sm-2">
                                                            <label><strong>*</strong>Categoría</label>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <Input type="select"
                                                                name="per_Categoria"
                                                                onChange={onChange}
                                                                className="form-control"
                                                                value={form.per_Categoria}
                                                            >
                                                                <option value="0">Selecionar categoría</option>
                                                                {JSON.parse(localStorage.getItem("nvaAltaBautizado")) === true &&
                                                                    <React.Fragment>
                                                                        <option value="ADULTO_HOMBRE">Adulto Hombre</option>
                                                                        <option value="ADULTO_MUJER">Adulto Mujer</option>
                                                                    </React.Fragment>
                                                                }
                                                                <option value="JOVEN_HOMBRE">Joven Hombre</option>
                                                                <option value="JOVEN_MUJER">Joven Mujer</option>
                                                                {JSON.parse(localStorage.getItem("nvaAltaBautizado")) === false &&
                                                                    <React.Fragment>
                                                                        <option value="NIÑO">Niño</option>
                                                                        <option value="NIÑA">Niña</option>
                                                                    </React.Fragment>
                                                                }

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
                                                {/* {habilitaPerBautizado &&
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
                                                } */}

                                                <FormGroup>
                                                    <div className="row">
                                                        <div className="col-sm-2">
                                                            <label><strong>*</strong> Nombre(s)</label>
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
                                                                Campo Requerido, sólo acepta letras (Sin acentos) y espacios.
                                                            </span>
                                                        }
                                                    </div>
                                                </FormGroup>

                                                <FormGroup>
                                                    <div className="row">
                                                        <div className="col-sm-2">
                                                            <label><strong>*</strong> Apellido Paterno</label>
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
                                                                Campo Requerido, sólo acepta letras (Sin acentos) y espacios.
                                                            </span>
                                                        }
                                                    </div>
                                                </FormGroup>

                                                <FormGroup>
                                                    <div className="row">
                                                        <div className="col-sm-2">
                                                            <label>Apellido Materno</label>
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
                                                        {!per_Apellido_Materno_OK &&
                                                            <span className="text-danger">
                                                                Sólo acepta letras (Sin acentos) y espacios.
                                                            </span>
                                                        }
                                                    </div>
                                                </FormGroup>

                                                <FormGroup>
                                                    <div className="row">
                                                        <div className="col-sm-2">
                                                            <label><strong>*</strong> Fecha Nacimiento</label>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <Input
                                                                type="date"
                                                                name="per_Fecha_Nacimiento"
                                                                onChange={onChange}
                                                                value={form.per_Fecha_Nacimiento}
                                                                className="form-control"
                                                                placeholder="DD/MM/AAAA"
                                                            />
                                                        </div>
                                                        {per_Fecha_Nacimiento_NoValido &&
                                                            <span className="text-danger">
                                                                Campo requerido, el formato de fecha es invalido.
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
                                                                <i>Verificar duplicados</i>
                                                            </Button>
                                                        </div>
                                                        {/* {bolPersonaEncontrada === true &&
                                                            <>
                                                                <div className="col-sm-4">
                                                                    <Button
                                                                        type="button"
                                                                        onClick={handleIgnorarDuplicados}
                                                                        color="success"
                                                                    >
                                                                        <span
                                                                            className="fa fa-check fa-sm"
                                                                            style={{ paddingRight: "5px" }}>
                                                                        </span>
                                                                        <i>Continuar Captura</i>
                                                                    </Button>
                                                                </div>

                                                                <div className="col-sm-4">
                                                                    <Button
                                                                        type="button"
                                                                        onClick={() => window.location = "/ListaDePersonal"}
                                                                        color="danger"
                                                                    >
                                                                        <span
                                                                            className="fa fa-times fa-sm"
                                                                            style={{ paddingRight: "5px" }}>
                                                                        </span>
                                                                        <i>Cancelar</i>
                                                                    </Button>
                                                                </div>
                                                            </>
                                                        } */}

                                                    </div>
                                                </FormGroup>

                                                {/* PORCION DE PANTALLA QUE SE DESPLEGA AVISANDO QUE ENCONTRO UNA PERSONA CON SIMILAR RFC */}
                                                {bolPersonaEncontrada === true &&
                                                    <>
                                                        <PersonaEncontrada
                                                            datosPersonaEncontrada={this.state.datosPersonaEncontrada}
                                                        />

                                                        <div className="row">
                                                            <div className="col-sm-6"></div>
                                                            <div className="col-sm-3 ">
                                                                <Button
                                                                    type="button"
                                                                    onClick={handleIgnorarDuplicados}
                                                                    color="success"
                                                                    className="btn-block"
                                                                >
                                                                    <span
                                                                        className="fa fa-check fa-sm "
                                                                        style={{ paddingRight: "5px" }}>
                                                                    </span>
                                                                    <i>Continuar Captura</i>
                                                                </Button>
                                                            </div>

                                                            <div className="col-sm-3 ">
                                                                <Button
                                                                    type="button"
                                                                    onClick={() => window.location = "/ListaDePersonal"}
                                                                    color="danger"
                                                                    className="btn-block"
                                                                >
                                                                    <span
                                                                        className="fa fa-times fa-sm "
                                                                        style={{ paddingRight: "5px" }}>
                                                                    </span>
                                                                    <i>Cancelar</i>
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </>
                                                }

                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                            }
                            {FrmValidaPersona === false &&
                                <React.Fragment>
                                    {bolPersonaEncontrada === false &&
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
                                                                        <label>Nombre(s)</label>
                                                                    </div>
                                                                    <div className="col-sm-4">
                                                                        <Input
                                                                            type="text"
                                                                            className="form-control"
                                                                            value={form.per_Apellido_Paterno}
                                                                            disabled
                                                                        />
                                                                        <label>Apellido Paterno</label>
                                                                    </div>
                                                                    <div className="col-sm-4">
                                                                        <Input
                                                                            type="text"
                                                                            className="form-control"
                                                                            value={form.per_Apellido_Materno}
                                                                            disabled
                                                                        />
                                                                        <label>Apellido Materno</label>
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
                                                                        <label>Categoría</label>
                                                                    </div>
                                                                    <div className="col-sm-4">
                                                                        <Input
                                                                            type="date"
                                                                            className="form-control"
                                                                            value={form.per_Fecha_Nacimiento}
                                                                            placeholder="DD/MM/AAAA"
                                                                            disabled
                                                                        />
                                                                        <label>Fecha de Nacimiento</label>
                                                                    </div>
                                                                    <div className="col-sm-2">
                                                                        <Button
                                                                            type="Button"
                                                                            className="btn btn-success form-control"
                                                                            onClick={handleEditaNombre}
                                                                        >
                                                                            <span
                                                                                className="fa fa-pen fa-sm"
                                                                                style={{ paddingRight: "10px" }}>
                                                                            </span>
                                                                            Editar Nombre
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
                                                                        <label>Lugar de Nacimiento</label>
                                                                    </FormGroup>
                                                                </div>
                                                                <div className="col-sm-4">
                                                                    <FormGroup>
                                                                        <Input
                                                                            type="email"
                                                                            name="per_Email_Personal"
                                                                            className="email"
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
                                                                        <label>Profesión/Oficio No. 1</label>
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
                                                                        <label htmlFor="Personal.pro_Id_Profesion_Oficio2">Profesión/Oficio No. 2</label>
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
                                                                        <label>Telefono móvil</label>
                                                                        <FormFeedback>{this.state.mensajes.telMovilInvalido}</FormFeedback>
                                                                    </FormGroup>
                                                                </div>
                                                            </div>

                                                            <div className="row">
                                                                {form.pro_Id_Profesion_Oficio1 === "1" &&
                                                                    <div className="col-sm-4">
                                                                        <FormGroup>
                                                                            <Input type="text"
                                                                                name="nvaProf1"
                                                                                className="form-control"
                                                                                onChange={handle_descNvaProfesion}
                                                                                value={descNvaProfesion.nvaProf1}
                                                                            />
                                                                            <label>Registrar Nueva profesión u oficio No.1 &#40;Opcional&#41;</label>
                                                                        </FormGroup>
                                                                    </div>
                                                                }
                                                                {form.pro_Id_Profesion_Oficio2 === "1" &&
                                                                    <div className="col-sm-4">
                                                                        <FormGroup>
                                                                            <Input type="text"
                                                                                name="nvaProf2"
                                                                                className="form-control"
                                                                                onChange={handle_descNvaProfesion}
                                                                                value={descNvaProfesion.nvaProf2}
                                                                            />
                                                                            <label>Registrar Nueva profesión u oficio No. 2 &#40;Opcional&#41;</label>
                                                                        </FormGroup>
                                                                    </div>

                                                                }
                                                            </div>

                                                            <FormGroup>
                                                                <div className="row">
                                                                    <div className="col-sm-8">
                                                                        <Input
                                                                            type="file"
                                                                            name="idFoto"
                                                                            onChange={onChange}
                                                                            className="form-control"
                                                                        />
                                                                        <label>Foto. &nbsp;&nbsp;     &#40;La foto debe ser Tipo Credencial: De hombros hacia arriba y Mujeres sin velo&#41;</label>
                                                                    </div>
                                                                    <div className="col-sm-4 text-center">
                                                                        <img src={foto} alt="Foto Persona" className="fotoFormulario" />
                                                                    </div>
                                                                </div>
                                                            </FormGroup>

                                                            {/* <FormGroup>
                                                                <div className="row">
                                                                    <div className="col-sm-4">
                                                                        <img src={foto} className="fotoFormulario" />
                                                                    </div>
                                                                </div>
                                                            </FormGroup> */}
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
                                                                    <h5><strong>Datos de Familia Ascendente</strong></h5>
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
                                                                                <label>Abuelo Paterno</label>
                                                                            </div>
                                                                            <div className="col-sm-6">
                                                                                <Input
                                                                                    type="text"
                                                                                    name="per_Nombre_Abuela_Paterna"
                                                                                    onChange={onChange}
                                                                                    className="form-control"
                                                                                    value={form.per_Nombre_Abuela_Paterna}
                                                                                />
                                                                                <label>Abuela Paterna</label>
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
                                                                                <label>Abuelo Materno</label>
                                                                            </div>
                                                                            <div className="col-sm-6">
                                                                                <Input
                                                                                    type="text"
                                                                                    name="per_Nombre_Abuela_Materna"
                                                                                    onChange={onChange}
                                                                                    className="form-control"
                                                                                    value={form.per_Nombre_Abuela_Materna}
                                                                                />
                                                                                <label>Abuela Materna</label>
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
                                                                    <h5><strong> Datos del Estado Civil</strong></h5>
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
                                                                                            value={form.per_Nombre_Conyuge}
                                                                                        />
                                                                                        <label>Nombre Conyuge</label>
                                                                                    </div>
                                                                                    <div className="col-sm-4">
                                                                                        <Input
                                                                                            type="date"
                                                                                            name="per_Fecha_Boda_Civil"
                                                                                            onChange={onChange}
                                                                                            value={form.per_Fecha_Boda_Civil}
                                                                                            placeholder="DD/MM/AAAA"
                                                                                            className="form-control"
                                                                                        />
                                                                                        <label>Fecha Boda Civil</label>
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
                                                                                        <label>Num. de acta boda civil</label>
                                                                                    </div>
                                                                                    <div className="col-sm-4">
                                                                                        <Input
                                                                                            type="text"
                                                                                            name="per_Libro_Acta_Boda_Civil"
                                                                                            onChange={onChange}
                                                                                            className="form-control"
                                                                                            value={form.per_Libro_Acta_Boda_Civil}
                                                                                        />
                                                                                        <label>Libro de acta de boda civil</label>
                                                                                    </div>
                                                                                    <div className="col-sm-4">
                                                                                        <Input
                                                                                            type="text"
                                                                                            name="per_Oficialia_Boda_Civil"
                                                                                            onChange={onChange}
                                                                                            className="form-control"
                                                                                            value={form.per_Oficialia_Boda_Civil}
                                                                                        />
                                                                                        <label>Oficialia de boda civil</label>
                                                                                    </div>
                                                                                </div>
                                                                            </FormGroup>
                                                                            <div className="row">
                                                                                <div className="col-sm-4">
                                                                                    <FormGroup>
                                                                                        <Input
                                                                                            type="text"
                                                                                            name="per_Registro_Civil"
                                                                                            onChange={onChange}
                                                                                            value={form.per_Registro_Civil}
                                                                                        />
                                                                                        <label htmlFor="per_Registro_Civil">Registro Civil</label>
                                                                                    </FormGroup>
                                                                                </div>
                                                                                {form.per_Bautizado &&
                                                                                    <React.Fragment>
                                                                                        <div className="col-sm-4">
                                                                                            <FormGroup>
                                                                                                <Input
                                                                                                    type="date"
                                                                                                    name="per_Fecha_Boda_Eclesiastica"
                                                                                                    onChange={onChange}
                                                                                                    value={form.per_Fecha_Boda_Eclesiastica}
                                                                                                    placeholder="DD/MM/AAAA"
                                                                                                    className="form-control"
                                                                                                    invalid={this.state.fechaBodaEclesiasticaInvalida}
                                                                                                />
                                                                                                <label htmlFor="per_Fecha_Boda_Eclesiastica">Fecha boda eclesiástica</label>
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
                                                                                                <label>Lugar boda eclesiástica</label>
                                                                                            </FormGroup>
                                                                                        </div>
                                                                                        <div className="col-sm-2">
                                                                                            <Input
                                                                                                type="number"
                                                                                                name="per_Cantidad_Hijos"
                                                                                                onChange={onChange}
                                                                                                className="form-control"
                                                                                                value={form.per_Cantidad_Hijos}

                                                                                            />
                                                                                            <label>Número de hijos</label>
                                                                                        </div>
                                                                                    </React.Fragment>
                                                                                }
                                                                            </div>
                                                                            <FormGroup>
                                                                                <div className="row">
                                                                                    <div className="col-sm-12">
                                                                                        <textarea
                                                                                            name="per_Nombre_Hijos"
                                                                                            onChange={onChange}
                                                                                            value={form.per_Nombre_Hijos}
                                                                                            className="form-control"
                                                                                            onKeyPress={this.handleKeyPress} ></textarea>
                                                                                        <label>Nombre de los hijos</label>
                                                                                    </div>
                                                                                </div>
                                                                            </FormGroup>
                                                                        </React.Fragment>
                                                                    }

                                                                    {this.state.ConcubinatoSolteroConHijos &&
                                                                        <React.Fragment>
                                                                            <div id="hijos">
                                                                                <FormGroup>
                                                                                    <div className="row">
                                                                                        <div className="col-sm-4">
                                                                                            <Input
                                                                                                type="text"
                                                                                                name="per_Nombre_Conyuge"
                                                                                                onChange={onChange}
                                                                                                className="form-control"
                                                                                                value={form.per_Nombre_Conyuge}
                                                                                            />
                                                                                            <label>Nombre de la pareja</label>
                                                                                        </div>
                                                                                        <div className="col-sm-2">
                                                                                            <Input
                                                                                                type="number"
                                                                                                name="per_Cantidad_Hijos"
                                                                                                onChange={onChange}
                                                                                                className="form-control"
                                                                                                value={form.per_Cantidad_Hijos}
                                                                                            />
                                                                                            <label>Número de hijos</label>
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
                                                                                                className="form-control"
                                                                                                onKeyPress={this.handleKeyPress}></textarea>
                                                                                            <label>Nombre de Hijos</label>
                                                                                        </div>
                                                                                    </div>
                                                                                </FormGroup>
                                                                            </div>
                                                                        </React.Fragment>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Eclesiasticos */}
                                                    <div className="row mx-auto mt-3">
                                                        <div className="col-sm-12">
                                                            <div className="card border-info acceso-directo">
                                                                <div className="card-header">
                                                                    <h5><strong>Datos Eclesiásticos</strong></h5>
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
                                                                                        <label>Lugar de bautismo</label>
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
                                                                                        <label>Ministro que le bautizó</label>
                                                                                    </FormGroup>
                                                                                </div>
                                                                                <div className="col-sm-4">
                                                                                    <FormGroup>
                                                                                        <Input
                                                                                            type="date"
                                                                                            name="per_Fecha_Bautismo"
                                                                                            onChange={onChangeFechaBautismo}
                                                                                            value={form.per_Fecha_Bautismo}
                                                                                            placeholder="DD/MM/AAAA"

                                                                                            invalid={fechaBautismoInvalida}
                                                                                        />
                                                                                        <label>Fecha de bautismo</label>
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
                                                                                    type="date"
                                                                                    name="per_Fecha_Recibio_Espiritu_Santo"
                                                                                    onChange={onChange}
                                                                                    value={form.per_Fecha_Recibio_Espiritu_Santo}
                                                                                    placeholder="DD/MM/AAAA"
                                                                                    className="form-control"
                                                                                    invalid={this.state.fechaEspitiruSantoInvalida}
                                                                                />
                                                                                <label>Fecha en que recibió el Espíritu Santo</label>
                                                                                <FormFeedback>{this.state.mensajes.fechaEspitiruSantoInvalida}</FormFeedback>
                                                                            </FormGroup>
                                                                        </div>
                                                                        <div className="col-sm-8">
                                                                            <FormGroup>
                                                                                <Input
                                                                                    type="text"
                                                                                    name="per_Bajo_Imposicion_De_Manos"
                                                                                    onChange={onChange}
                                                                                    value={form.per_Bajo_Imposicion_De_Manos}
                                                                                    className="form-control"
                                                                                />
                                                                                <label>Bajo imposición de manos de:</label>
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
                                                                                    name="per_Cargos_Desempenados"
                                                                                    onChange={onChange}
                                                                                    className="form-control"
                                                                                    value={form.per_Cargos_Desempenados}
                                                                                    onKeyPress={this.handleKeyPress}
                                                                                ></textarea>
                                                                                <label>Puestos que ha desempeñado en la IECE</label>
                                                                            </div>
                                                                        </div>
                                                                    </FormGroup>
                                                                    <FormGroup>
                                                                        <div className="row">
                                                                            <div className="col-sm-12">
                                                                                <textarea
                                                                                    name="per_Cambios_De_Domicilio"
                                                                                    onChange={onChange}
                                                                                    value={form.per_Cambios_De_Domicilio}
                                                                                    className="form-control"
                                                                                    onKeyPress={this.handleKeyPress}></textarea>
                                                                                <label>Cambios de domicilio en la IECE</label>
                                                                            </div>
                                                                        </div>
                                                                    </FormGroup>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </React.Fragment>
                                            }
                                            {/* FECHA DE TRANSACCION */}
                                            {JSON.parse(localStorage.getItem("nvaAltaBautizado")) === false && boolComentarioEdicion === false &&
                                                <React.Fragment>
                                                    <FormGroup>
                                                        <div className="row mx-auto mt-4">
                                                            <div className="col-sm-12">
                                                                <div className="card border-info acceso-directo">
                                                                    <div className="card-header">
                                                                        <h5><strong>Fecha del Nuevo Ingreso</strong></h5>
                                                                    </div>
                                                                    <div className="card-body">
                                                                        <div className="row">
                                                                            <div className="col-sm-4">
                                                                                <Input
                                                                                    type="date"
                                                                                    name="FechaTransaccionHistorica"
                                                                                    onChange={handleFechaDeTransaccion}
                                                                                    value={FechaTransaccionHistorica}
                                                                                    placeholder="DD/MM/AAAA"
                                                                                    className="form-control"
                                                                                />
                                                                                <label>Si no se especifica una fecha, por defecto se registrará con la Fecha de Nacimiento.</label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </FormGroup>
                                                </React.Fragment>
                                            }

                                            {/* Comentarios para el historico de transacciones */}
                                            {boolComentarioEdicion &&
                                                <React.Fragment>
                                                    <FormGroup>
                                                        <div className="row mx-auto mt-3">
                                                            <div className="col-sm-12">
                                                                <div className="card border-info acceso-directo">
                                                                    <div className="card-header">
                                                                        <h5><strong>Comentario para el Historial de Transacciones</strong></h5>
                                                                    </div>
                                                                    <div className="card-body">
                                                                        <div className="row">
                                                                            <div className="col-sm-12">
                                                                                <Input
                                                                                    value={ComentarioHistorialTransacciones}
                                                                                    onChange={handle_ComentarioHistorialTransacciones}
                                                                                    type='text'
                                                                                    placeholder='Comentario opcional'
                                                                                    maxLength={200}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </FormGroup>
                                                </React.Fragment>
                                            }

                                            {/* Hogar */}
                                            {/* NO MUESTRA SECCION DEL HOGAR SI ES UNA EDICION */}
                                            {isNaN(form.per_Id_Persona) &&
                                                <div className="row mx-auto mt-3">
                                                    <div className="col-sm-12">
                                                        <div className="card border-info acceso-directo">
                                                            <div className="card-header">
                                                                <h5><strong>Datos del Hogar y su Domicilio</strong></h5>
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
                                                                    boolNvoEstado={boolNvoEstado}
                                                                    handleChangeEstado={handleChangeEstado}
                                                                    direccion={this.state.direccion}
                                                                    habilitaPerBautizado={habilitaPerBautizado}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            }

                                            {/* Botones al final de formulario */}
                                            <FormGroup>
                                                <div className="row mt-3">
                                                    <div className="col-sm-2 offset-sm-2">
                                                        <Link
                                                            to="/ListaDePersonal"
                                                            className="btn btn-secondary form-control"
                                                        >
                                                            <span className="fa fa-backspace" style={{ paddingRight: "10px" }}></span>
                                                            Volver
                                                        </Link>
                                                    </div>
                                                    <div className="col-sm-2 offset-sm-2">
                                                        <Button
                                                            type="submit"
                                                            className="btn btn-success form-control"
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
            </React.Fragment >
        );
    }
}

export default PersonaForm;