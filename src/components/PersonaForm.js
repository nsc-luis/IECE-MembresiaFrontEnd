import React, { Component } from 'react';
import '../assets/css/PersonaForm.css'
// import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import axios from 'axios';
// import SimpleReactValidator from 'simple-react-validator';
import Global from '../Global';
// import MomentLocalUtils from 'react-day-picker/moment';
import { Link } from 'react-router-dom';
import PersonaEncontrada from '../components/PersonaEncontrada'
import HogarPersonaDomicilio from './HogarPersonaDomicilio';
import Distritos from './Distritos';
import Sectores from './Sectores';

class PersonaForm extends Component {

    url = Global.url_api;
    fechaNoIngresada = "1890-01-01";

    constructor(props) {
        super(props)
        this.state = {
            profesiones_oficios: [],
            PersonaEncontrada: true,
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
            sectorSeleccionado: "0"
        }
    }

    handle_dis_Id_Distrito = (e) => {
        this.setState({
            distritoSeleccionado: e.target.value
        })
        if (e.target.value !== "0") {
            this.getSectores(e.target.value)
            this.setState({
                sectorSeleccionado: "0"
            })
        }
        if (e.target.value === "0") {
            this.setState({
                sectorSeleccionado: "0"
            })
        }
    }

    handle_sec_Id_Sector = (e) => {
        this.setState({
            sectorSeleccionado: e.target.value
        })
    }

    getSectores = async (distritoSeleccionado) => {
        await axios.get(this.url + "/Sector/GetSectoresByDistrito/" + distritoSeleccionado)
            .then(res => {
                this.setState({
                    sectores: res.data.sectores
                })
            })
    }

    componentWillMount() {
        this.getProfesionesOficios();
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

    fnMiembroBautizado = (e) => {
        if (e.target.checked) {
            this.setState({ MiembroEsBautizado: true });
        } else {
            this.setState({ MiembroEsBautizado: false });
        }
    }

    fnPromesaDelEspirituSanto = (e) => {
        if (e.target.checked) {
            this.setState({ PromesaDelEspitiruSanto: true });
        } else {
            this.setState({ PromesaDelEspitiruSanto: false });
        }
    }
    handle_per_Estado_Civil = (e) => {
        if (e.target.value === 'casado'
            || e.target.value === 'divorciado'
            || e.target.value === 'viudo') {
            this.setState({
                CasadoDivorciadoViudo: true,
                ConcubinatoSolteroConHijos: true,
                soltero: false
            });
        }
        else if (e.target.value === 'solteroconhijos'
            || e.target.value === 'concubinato') {
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
            });
        }
    }

    fnGuardaPersona = async (datos) => {
        return await axios.post(this.url + "/persona", datos)
            .then(res => res.data)
            .catch(error => error);
    }

    FrmRegistroPersona = async (e) => {
        e.preventDefault();

        console.log(this.state);

        // console.log(this.hp_Id_HogarRef.current.value);
        // if (this.validator.allValid()) {
        //     console.log("Codicion todos los datos son validos.");

        //     datos.eclesiasticos = this.fnDatosEclesiasticos();
        //     datos.estadoCivil = this.fnDatosEstadoCivil();
        //     let datosCombinados = Object.assign({}, datos.persona, datos.eclesiasticos, datos.estadoCivil);

        //     if (this.hp_Id_HogarRef.current.value === "0") {
        //         console.log("Condicion NO se selecciono hogar.");

        //         await this.fnGuardaHogar_Persona(datosCombinados, this.fnDatosHogar());
        //         window.location.assign("/ListaDePersonal");
        //     } else {
        //         console.log("Se selecciono un hogar EXISTENTE.");

        //         await this.fnGuardaHogar_Persona(datosCombinados, this.fnDatosHogar());
        //         window.location.assign("/ListaDePersonal");
        //     }
        // } else {
        //     console.log("Faltan datos requeridos o captura incorrecta.");

        //     this.validator.showMessages();
        //     // this.forceUpdate();
        // }
    }

    render() {
        const { onChange, form } = this.props

        const inputs = document.querySelectorAll('#FrmRegistroPersona input')

        const expresiones = {
            alphaSpaceRequired: /^[a-zA-ZÀ-ÿ]{2}[a-zA-ZÀ-ÿ\s]{1,38}$/, // Letras y espacios, pueden llevar acentos.
            formatoFecha: /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/
        }

        const aVerificar = [
            { input: 'per_Nombre', expresion: expresiones.alphaSpaceRequired },
            , { input: 'per_Apellido_Paterno', expresion: expresiones.alphaSpaceRequired }
            , { input: 'per_Apellido_Materno', expresion: expresiones.alphaSpaceRequired }
            , { input: 'per_Fecha_Nacimiento', expresion: expresiones.formatoFecha }
        ]

        const tabs = [
            'generales-tab'
            , 'familiaAsendente-tab'
            , 'eclesiasticos-tab'
            , 'estado-civil-tab'
            , 'hogar-tab'
        ]
        const verificarDuplicados = () => {
            let errorCount = 0

            aVerificar.forEach(element => {
                if (validaCamposVerficacionDuplicados(element.expresion, element.input)) {
                    errorCount = errorCount + 1
                }
            })

            if (errorCount === 0) {
                tabs.forEach(element => {
                    document.getElementById(element).classList.remove('disabled')
                });
            } else {
                tabs.forEach(element => {
                    document.getElementById(element).classList.add('disabled')
                });
            }
        }

        const validaCamposVerficacionDuplicados = (expresion, input) => {
            let errorDeValidacion = false
            if (expresion.test(form[input])) {
                document.getElementById(input).classList.add('formularioInputError')
                document.getElementById(input).classList.remove('formularioInputErrorActivo')
            }
            else {
                errorDeValidacion = true
                document.getElementById(input).classList.add('formularioInputErrorActivo')
                document.getElementById(input).classList.remove('formularioInputError')
            }
            return errorDeValidacion
        }

        return (
            <React.Fragment>
                <h2 className="text-info">Agregar nuevo miembro</h2>

                <div className="border">
                    <form onSubmit={this.FrmRegistroPersona} id="FrmRegistroPersona" className="p-3" /* onChange={this.FrmRegistroPersona} */ >
                        <div className="container">

                            {/* Tabs de navegacion del formulario */}
                            <ul className="nav nav-tabs bg-primary mb-3 rounded" id="nav-registro-persona" role="tablist">
                                <li className="nav-item">
                                    <a className="nav-link active" id="verificarNuevoRegistro-tab" data-toggle="tab" href="#verificarNuevoRegistro" role="tab" aria-controls="verificarNuevoRegistro" aria-selected="true">Nuevo registro</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link disabled" id="generales-tab" data-toggle="tab" href="#generales" role="tab" aria-controls="generales" aria-selected="true">Generales</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link disabled" id="familiaAsendente-tab" data-toggle="tab" href="#familiaAsendente" role="tab" aria-controls="familiaAsendente" aria-selected="true">Familia asendente</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link disabled" id="eclesiasticos-tab" data-toggle="tab" href="#eclesiasticos" role="tab" aria-controls="eclesiasticos" aria-selected="true">Eclesiasticos</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link disabled" id="estado-civil-tab" data-toggle="tab" href="#estado-civil" role="tab" aria-controls="estado-civil" aria-selected="true">Estado civil</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link disabled" id="hogar-tab" data-toggle="tab" href="#hogar" role="tab" aria-controls="hogar" aria-selected="true">Hogar</a>
                                </li>
                            </ul>

                            <div className="tab-content" id="myTabContent">

                                {/* Verificar Nuevo Registro */}
                                <div className="tab-pane fade show active" id="verificarNuevoRegistro" role="tabpanel" aria-labelledby="verificarNuevoRegistro-tab">
                                    <div className="form-group">
                                        <Distritos
                                            handle_dis_Id_Distrito={this.handle_dis_Id_Distrito}
                                        />
                                        {this.state.distritoSeleccionado !== "0" &&
                                            <Sectores
                                                sectores={this.state.sectores}
                                                handle_sec_Id_Sector={this.handle_sec_Id_Sector}
                                            />
                                        }
                                        <hr />
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Categoria</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <select
                                                    name="per_Categoria"
                                                    onChange={onChange}
                                                    className="form-control"
                                                >
                                                    <option value="0">Selecionar categoria</option>
                                                    <option value="Adulto_Hombre">Adulto Hombre</option>
                                                    <option value="Adulto_Mujer">Adulto Mujer</option>
                                                    <option value="Joven_Hombre">Joven hombre</option>
                                                    <option value="Joven_Mujer">Joven mujer</option>
                                                </select>
                                            </div>
                                            {/* <span style={{ color: 'red' }}>
                                                {this.validator.message('per_Categoria', this.state.per_Categoria, 'regex:^[a-zA-Z]*(_)[a-zA-Z]*$')}
                                            </span> */}
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Nombre</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input
                                                    type="text"
                                                    name="per_Nombre"
                                                    onChange={onChange}
                                                    value={form.per_Nombre}
                                                    className="form-control uppercase"
                                                />
                                            </div>
                                            <span className="formularioInputError" id="per_Nombre">
                                                Campo requerido, solo acepta letras y espacios.
                                            </span>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Apellido paterno</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input
                                                    type="text"
                                                    name="per_Apellido_Paterno"
                                                    onChange={onChange}
                                                    value={form.per_Apellido_Paterno}
                                                    className="form-control"
                                                />
                                            </div>
                                            <span className="formularioInputError" id="per_Apellido_Paterno">
                                                Campo requerido, solo acepta letras y espacios.
                                            </span>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Apellido materno</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input
                                                    type="text"
                                                    name="per_Apellido_Materno"
                                                    onChange={onChange}
                                                    value={form.per_Apellido_Materno}
                                                    className="form-control"
                                                />
                                            </div>
                                            <span className="formularioInputError" id="per_Apellido_Materno">
                                                Campo requerido, solo acepta letras y espacios.
                                            </span>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Fecha nacimiento</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input
                                                    type="text"
                                                    name="per_Fecha_Nacimiento"
                                                    onChange={onChange}
                                                    value={form.per_Fecha_Nacimiento}
                                                    className="form-control"
                                                    placeholder="DD/MM/AAAA"
                                                />
                                            </div>
                                            <span className="formularioInputError" id="per_Fecha_Nacimiento">
                                                Fecha no valida, el formato requerido es: DD/MM//AAAA.
                                            </span>
                                        </div>
                                    </div>

                                    {/* Boton para verificar duplicados */}
                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-4"></div>
                                            <div className="col-sm-4">
                                                <button onClick={verificarDuplicados} className="btn btn-success form-control">
                                                    <span className="fas fa-check" style={{ paddingRight: "20px" }}></span>
                                                    <i>Verifica duplicado</i>
                                                </button>
                                            </div>
                                            <div className="col-sm-4"></div>
                                        </div>
                                    </div>

                                    {/* {this.state.PersonaEncontrada === true &&
                                        <PersonaEncontrada />
                                    } */}

                                </div>

                                {/* Generales */}
                                <div className="tab-pane fade" id="generales" role="tabpanel" aria-labelledby="generales-tab">

                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Profesion oficio1</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <select
                                                    name="pro_Id_Profesion_Oficio1"
                                                    className="form-control"
                                                    onChange={onChange}
                                                >
                                                    {
                                                        this.state.profesiones_oficios.map((profesion_oficio) => {
                                                            return (
                                                                <option key={profesion_oficio.pro_Id_Profesion_Oficio} value={profesion_oficio.pro_Id_Profesion_Oficio}>{profesion_oficio.pro_Definicion_Profesion_Oficio} | {profesion_oficio.pro_Desc_Profesion_Oficio}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label htmlFor="Personal.pro_Id_Profesion_Oficio2">Profesion oficio2</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <select
                                                    name="pro_Id_Profesion_Oficio2"
                                                    className="form-control"
                                                    onChange={onChange}
                                                >
                                                    {
                                                        this.state.profesiones_oficios.map((profesion_oficio, i) => {
                                                            return (
                                                                <option key={i} value={profesion_oficio.pro_Id_Profesion_Oficio}>{profesion_oficio.pro_Definicion_Profesion_Oficio} | {profesion_oficio.pro_Desc_Profesion_Oficio}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Telefono fijo</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input
                                                    type="text"
                                                    name="per_Telefono_Fijo"
                                                    onChange={onChange}
                                                    className="form-control"
                                                />
                                            </div>
                                            {/* <span style={{ color: 'red' }}>
                                                {this.validator.message('per_Telefono_Fijo', form.per_Telefono_Fijo, 'phone|regex:^[0-9]{10}$')}
                                            </span> */}
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Telefono movil</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input
                                                    type="text"
                                                    name="per_Telefono_Movil"
                                                    onChange={onChange}
                                                    className="form-control"
                                                />
                                            </div>
                                            {/* <span style={{ color: 'red' }}>
                                                {this.validator.message('per_Telefono_Movil', form.per_Telefono_Movil, 'phone|regex:^[0-9]{10}$')}
                                            </span> */}
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Email</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input
                                                    type="text"
                                                    name="per_Email_Personal"
                                                    onChange={onChange}
                                                    className="form-control inputEmail"
                                                />
                                            </div>
                                            {/* <span style={{ color: 'red' }}>
                                                {this.validator.message('per_Email_Personal', form.per_Email_Personal, 'email')}
                                            </span> */}
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Foto</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input
                                                    type="file"
                                                    name="per_foto"
                                                    onChange={onChange}
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Observaciones</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <textarea
                                                    name="per_Observaciones"
                                                    onChange={onChange}
                                                    className="form-control"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Familia Asendente */}
                                <div className="tab-pane fade" id="familiaAsendente" role="tabpanel" aria-labelledby="familiaAsendente-tab">
                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Padre</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input
                                                    type="text"
                                                    name="per_Nombre_Padre"
                                                    onChange={onChange}
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Madre</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input
                                                    type="text"
                                                    name="per_Nombre_Madre"
                                                    onChange={onChange}
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Abuelo paterno</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input
                                                    type="text"
                                                    name="per_Nombre_Abuelo_Paterno"
                                                    onChange={onChange}
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Abuela paterna</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input
                                                    type="text"
                                                    name="per_Nombre_Abuela_Paterna"
                                                    onChange={onChange}
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Abuelo materno</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input
                                                    type="text"
                                                    name="per_Nombre_Abuelo_Materno"
                                                    onChange={onChange}
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Abuela materna</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input
                                                    type="text"
                                                    name="per_Nombre_Abuela_Materna"
                                                    onChange={onChange}
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                {/* Estado Civil */}
                                <div className="tab-pane fade" id="estado-civil" role="tabpanel" aria-labelledby="estado-civil-tab">
                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Estado civil</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <select
                                                    defaultValue="soltero"
                                                    name="per_Estado_Civil"
                                                    onChange={this.handle_per_Estado_Civil}
                                                    className="form-control"
                                                >
                                                    <option value="CASADO(A)">Casado/a</option>
                                                    <option value="DIVORCIADO(A)">Divorciado/a</option>
                                                    <option value="VIUDO(A)">Viudo/a</option>
                                                    <option value="CONCUBINATO">Unión libre/concubinato</option>
                                                    <option value="SOLTERO(A)">Soltero/a SIN hijos</option>
                                                    <option value="SOLTERO(A)CONHIJOS">Soltero/a CON hijos</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Matrimonio */}
                                    {this.state.CasadoDivorciadoViudo &&
                                        <React.Fragment>
                                            <div className="form-group">
                                                <div className="row">
                                                    <div className="col-sm-2">
                                                        <label>Nombre conyuge</label>
                                                    </div>
                                                    <div className="col-sm-4">
                                                        <input
                                                            type="text"
                                                            name="per_Nombre_Conyuge"
                                                            onChange={onChange}
                                                            className="form-control"
                                                        />
                                                    </div>
                                                    <span style={{ color: 'red' }}>
                                                        {this.validator.message('per_Nombre_Conyuge', form.per_Nombre_Conyuge, 'required')}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <div className="row">
                                                    <div className="col-sm-2">
                                                        <label>Fecha boda civil</label>
                                                    </div>
                                                    <div className="col-sm-4">
                                                        <input
                                                            type="text"
                                                            name="per_Fecha_Boda_Civil"
                                                            onChange={onChange}
                                                            value={form.per_Fecha_Boda_Civil}
                                                            placeholder="DD/MM/AAAA"
                                                            className="form-control"
                                                        />
                                                    </div>
                                                    {/* <span style={{ color: 'red' }}>
                                                        {this.validator.message('per_Nombre_Conyuge', form.per_Nombre_Conyuge, 'required')}
                                                    </span> */}
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <div className="row">
                                                    <div className="col-sm-2">
                                                        <label>Num acta boda civil</label>
                                                    </div>
                                                    <div className="col-sm-4">
                                                        <input
                                                            type="text"
                                                            name="per_Num_Acta_Boda_Civil"
                                                            onChange={onChange}
                                                            className="form-control"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <div className="row">
                                                    <div className="col-sm-2">
                                                        <label>Libro acta boda civil</label>
                                                    </div>
                                                    <div className="col-sm-4">
                                                        <input
                                                            type="text"
                                                            name="per_Libro_Acta_Boda_Civil"
                                                            onChange={onChange}
                                                            className="form-control"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <div className="row">
                                                    <div className="col-sm-2">
                                                        <label>Oficialia boda civil</label>
                                                    </div>
                                                    <div className="col-sm-4">
                                                        <input
                                                            type="text"
                                                            name="per_Oficialia_Boda_Civil"
                                                            onChange={onChange}
                                                            className="form-control"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {this.state.MiembroEsBautizado &&
                                                <React.Fragment>
                                                    <div className="form-group">
                                                        <div className="row">
                                                            <div className="col-sm-2">
                                                                <label htmlFor="per_Fecha_Boda_Eclesiastica">Fecha boda eclesiastica</label>
                                                            </div>
                                                            <div className="col-sm-4">
                                                                <input
                                                                    type="text"
                                                                    name="per_Fecha_Boda_Civil"
                                                                    onChange={onChange}
                                                                    value={form.per_Fecha_Boda_Eclesiastica}
                                                                    placeholder="DD/MM/AAAA"
                                                                    className="form-control"
                                                                />
                                                            </div>
                                                            {/* <span style={{ color: 'red' }}>
                                                                {this.validator.message('per_Nombre_Conyuge', form.per_Nombre_Conyuge, 'required')}
                                                            </span> */}
                                                        </div>
                                                    </div>

                                                    <div className="form-group">
                                                        <div className="row">
                                                            <div className="col-sm-2">
                                                                <label>Lugar boda eclesiastica</label>
                                                            </div>
                                                            <div className="col-sm-4">
                                                                <input
                                                                    type="text"
                                                                    name="per_Lugar_Boda_Eclesiastica"
                                                                    onChange={onChange}
                                                                    className="form-control"
                                                                />
                                                            </div>
                                                            <span style={{ color: 'red' }}>
                                                                {this.validator.message('per_Lugar_Boda_Eclesiastica', form.per_Lugar_Boda_Eclesiastica, 'required')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </React.Fragment>
                                            }
                                        </React.Fragment>
                                    }

                                    {this.state.ConcubinatoSolteroConHijos &&
                                        <React.Fragment>
                                            <div id="hijos">
                                                <div className="form-group">
                                                    <div className="row">
                                                        <div className="col-sm-2">
                                                            <label>Cantidad hijos</label>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <input
                                                                type="number"
                                                                name="per_Cantidad_Hijos"
                                                                onChange={onChange}
                                                                className="form-control"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="form-group">
                                                    <div className="row">
                                                        <div className="col-sm-2">
                                                            <label>Nombre de los hijos</label>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <textarea
                                                                name="per_Nombre_Hijos"
                                                                onChange={onChange}
                                                                className="form-control" ></textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    }
                                </div>

                                {/* Eclesiasticos */}
                                <div className="tab-pane fade" id="eclesiasticos" role="tabpanel" aria-labelledby="eclesiasticos-tab">
                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-3">
                                                <label>Bautizado</label>
                                            </div>
                                            <div className="col-sm-2">
                                                <input
                                                    type="checkbox"
                                                    name="per_Bautizado"
                                                    onChange={this.fnMiembroBautizado}
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-3">
                                                <label>Promesa del Espiritu Santo</label>
                                            </div>
                                            <div className="col-sm-2">
                                                <input
                                                    type="checkbox"
                                                    name="PromesaDelEspirituSanto"
                                                    onChange={this.fnPromesaDelEspirituSanto}
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bautismo */}
                                    {this.state.MiembroEsBautizado &&
                                        <React.Fragment>
                                            <div className="form-group">
                                                <div className="row">
                                                    <div className="col-sm-2">
                                                        <label>Lugar bautismo</label>
                                                    </div>
                                                    <div className="col-sm-4">
                                                        <input
                                                            type="text"
                                                            name="per_Lugar_Bautismo"
                                                            onChange={onChange}
                                                            value={form.per_Nombre}
                                                            className="form-control"
                                                        />
                                                    </div>
                                                    <span style={{ color: 'red' }}>
                                                        {this.validator.message('per_Lugar_Bautismo', form.per_Lugar_Bautismo, 'required')}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <div className="row">
                                                    <div className="col-sm-2">
                                                        <label>Fecha bautismo</label>
                                                    </div>
                                                    <div className="col-sm-4">
                                                        <input
                                                            type="text"
                                                            name="per_Fecha_Boda_Civil"
                                                            onChange={onChange}
                                                            value={form.per_Fecha_Bautismo}
                                                            placeholder="DD/MM/AAAA"
                                                            className="form-control"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="row">
                                                    <div className="col-sm-2">
                                                        <label>Ministro que bautizo</label>
                                                    </div>
                                                    <div className="col-sm-4">
                                                        <input
                                                            type="text"
                                                            name="per_Ministro_Que_Bautizo"
                                                            onChange={onChange}
                                                            value={form.per_Nombre}
                                                            className="form-control"
                                                        />
                                                    </div>
                                                    <span style={{ color: 'red' }}>
                                                        {this.validator.message('per_Ministro_Que_Bautizo', form.per_Ministro_Que_Bautizo, 'required')}
                                                    </span>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    }

                                    {this.state.PromesaDelEspitiruSanto &&
                                        <React.Fragment>
                                            <div className="form-group">
                                                <div className="row">
                                                    <div className="col-sm-2">
                                                        <label>Fecha recibio Espiritu Santo</label>
                                                    </div>
                                                    <div className="col-sm-4">
                                                        <input
                                                            type="text"
                                                            name="per_Fecha_Boda_Civil"
                                                            onChange={onChange}
                                                            value={form.per_Fecha_Recibio_Espiritu_Santo}
                                                            placeholder="DD/MM/AAAA"
                                                            className="form-control"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <div className="row">
                                                    <div className="col-sm-2">
                                                        <label>Bajo imposicion de manos</label>
                                                    </div>
                                                    <div className="col-sm-4">
                                                        <input
                                                            type="text"
                                                            name="per_Bajo_Imposicion_De_Manos"
                                                            onChange={onChange}
                                                            value={form.per_Nombre}
                                                            className="form-control"
                                                        />
                                                    </div>
                                                    <span style={{ color: 'red' }}>
                                                        {this.validator.message('per_Bajo_Imposicion_De_Manos', form.per_Bajo_Imposicion_De_Manos, 'required')}
                                                    </span>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    }
                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Cambios de domicilio</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <textarea
                                                    name="per_Cambios_De_DomicilioRef"
                                                    onChange={onChange}
                                                    value={form.per_Nombre}
                                                    className="form-control"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Hogar */}
                                <div className="tab-pane fade" id="hogar" role="tabpanel" aria-labelledby="hogar-tab">
                                    <HogarPersonaDomicilio
                                        DatosHogar={this.state.DatosHogar}
                                    />
                                </div>
                            </div>

                            {/* Botones al final de formulario */}
                            <div className="form-group">
                                <div className="row">
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
                                        <button
                                            type="submit"
                                            className="btn btn-primary form-control"
                                        >
                                            <span className="far fa-save" style={{ paddingRight: "10px" }}></span>
                                            Guardar
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </form>
                </div>
            </React.Fragment>
        );
    }
}

export default PersonaForm;