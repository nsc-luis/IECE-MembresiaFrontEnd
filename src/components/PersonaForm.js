import React, { Component } from 'react';
import '../assets/css/PersonaForm.css'
import 'react-day-picker/lib/style.css';
import axios from 'axios';
import Global from '../Global';
import { Link } from 'react-router-dom';
import PersonaEncontrada from '../components/PersonaEncontrada'
import HogarPersonaDomicilio from './HogarPersonaDomicilio';
import Distritos from './Distritos';
import Sectores from './Sectores';

class PersonaForm extends Component {

    url = Global.url_api;
    fechaNoIngresada = "1900-01-01";

    constructor(props) {
        super(props)
        this.state = {
            profesiones_oficios: [],
            PersonaEncontrada: false,
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
            hd_Id_Hogar: "0",
            hp_Jerarquia: "1",
            redirect: false
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

    fnPromesaDelEspirituSanto = (e) => {
        if (e.target.checked) {
            this.setState({ PromesaDelEspitiruSanto: true });
        } else {
            this.setState({ PromesaDelEspitiruSanto: false });
        }
    }

    handle_hd_Id_Hogar = (str) => {
        this.setState({
            hd_Id_Hogar: str
        })
        if (str === "0") {
            this.setState({ hp_Jerarquia: "1" })
        }
    }

    handle_hp_Jerarquia = (e) => {
        this.setState({
            hp_Jerarquia: e.target.value
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
            per_Fecha_Boda_Civil_NoValido,
            per_Fecha_Boda_Eclesiastica_NoValido,
            per_Fecha_Bautismo_NoValido,
            per_Fecha_Recibio_Espiritu_Santo_NoValido,
            changeRFCSinHomo,
            changeEstadoCivil,
            fnGuardaPersona,
            fnGuardaPersonaEnHogar
        } = this.props

        const per_Apellido_Materno = document.getElementById('per_Apellido_Materno')
        const alphaSpaceRequired = /^[a-zA-Z]{3}[a-zA-Z\d\s]{0,37}$/

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

        const getPersonaByRFCSinHomo = async (str) => {
            await axios.get(this.url + "/persona/GetByRFCSinHomo/" + str)
                .then(res => {
                    if (res.data.status) {
                        this.setState({
                            PersonaEncontrada: true,
                            datosPersonaEncontrada: res.data.persona[0]
                        })
                        DeshabilitaPestanas()
                    } else {
                        this.setState({
                            PersonaEncontrada: false,
                            datosPersonaEncontrada: []
                        })
                        HabilitarPestanas(form.per_Categoria)
                    }
                })
        }

        const HabilitarPestanas = (per_Categoria) => {
            if (per_Categoria === "ADULTO_HOMBRE" || per_Categoria === "ADULTO_MUJER") {
                document.getElementById("generales-tab").classList.remove("disabled", "pertanaDeshabilitada")
                document.getElementById("familiaAsendente-tab").classList.remove("disabled", "pertanaDeshabilitada")
                document.getElementById("eclesiasticos-tab").classList.remove("disabled", "pertanaDeshabilitada")
                document.getElementById("estado-civil-tab").classList.remove("disabled", "pertanaDeshabilitada")
                document.getElementById("hogar-tab").classList.remove("disabled", "pertanaDeshabilitada")
            }
            if (per_Categoria === "JOVEN_HOMBRE" || per_Categoria === "JOVEN_MUJER") {
                document.getElementById("generales-tab").classList.remove("disabled", "pertanaDeshabilitada")
                document.getElementById("familiaAsendente-tab").classList.add("disabled", "pertanaDeshabilitada")
                document.getElementById("eclesiasticos-tab").classList.remove("disabled", "pertanaDeshabilitada")
                document.getElementById("estado-civil-tab").classList.add("disabled", "pertanaDeshabilitada")
                document.getElementById("hogar-tab").classList.remove("disabled", "pertanaDeshabilitada")
            }
            if (per_Categoria === "NIÑO" || per_Categoria === "NIÑA") {
                document.getElementById("generales-tab").classList.add("disabled", "pertanaDeshabilitada")
                document.getElementById("familiaAsendente-tab").classList.add("disabled", "pertanaDeshabilitada")
                document.getElementById("eclesiasticos-tab").classList.add("disabled", "pertanaDeshabilitada")
                document.getElementById("estado-civil-tab").classList.add("disabled", "pertanaDeshabilitada")
                document.getElementById("hogar-tab").classList.remove("disabled", "pertanaDeshabilitada")
            }
        }

        const IgnorarDuplicados = () => {
            HabilitarPestanas(form.per_Categoria)
        }

        const DeshabilitaPestanas = () => {
            document.getElementById("generales-tab").classList.add("disabled", "pertanaDeshabilitada")
            document.getElementById("familiaAsendente-tab").classList.add("disabled", "pertanaDeshabilitada")
            document.getElementById("eclesiasticos-tab").classList.add("disabled", "pertanaDeshabilitada")
            document.getElementById("estado-civil-tab").classList.add("disabled", "pertanaDeshabilitada")
            document.getElementById("hogar-tab").classList.add("disabled", "pertanaDeshabilitada")
        }

        const handle_verificarDuplicados = (e) => {
            if (categoriaSeleccionada
                && !per_Nombre_NoValido
                && !per_Apellido_Paterno_NoValido
                && !per_Fecha_Nacimiento_NoValido) {

                if (alphaSpaceRequired.test(per_Apellido_Materno.value)
                    || per_Apellido_Materno.value === "") {

                    this.setState({ per_Apellido_Materno_OK: true })
                    let am = per_Apellido_Materno.value === "" ? "1" : per_Apellido_Materno.value

                    CheckNvaPersona(form.per_Nombre, form.per_Apellido_Paterno, am, form.per_Fecha_Nacimiento)

                    if (this.state.PersonaEncontrada) {
                        DeshabilitaPestanas()
                    } else {
                        HabilitarPestanas(form.per_Categoria)
                    }

                } else {
                    this.setState({ per_Apellido_Materno_OK: false })
                    alert("Debes capturar correctamente los campos requeridos.")
                }
            } else {
                this.setState({ per_Apellido_Materno_OK: false })
                alert("Debes capturar correctamente los campos requeridos.")
            }
        }

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

        const fnFormatoFecha = (fecha) => {
            let sub = fecha.split("/")
            let fechaFormateada = sub[1] + "/" + sub[0] + "/" + sub[2]
            return fechaFormateada
        }

        const fechas = [
            "per_Fecha_Bautismo",
            "per_Fecha_Boda_Civil",
            "per_Fecha_Ecelsiastica",
            "per_Fecha_Nacimiento",
            "per_Fecha_Recibio_Espiritu_Santo"
        ]

        const enviarInfo = (e) => {
            e.preventDefault();

            let objPersona = this.props.form
            let objDomicilio = this.props.domicilio

            fechas.forEach(fecha => {
                objPersona[fecha] = fnFormatoFecha(objPersona[fecha])
            });

            if (this.state.hd_Id_Hogar === "0") {
                let PersonaDomicilioHogar = {
                    id: 1,
                    PersonaEntity: objPersona,
                    HogarDomicilioEntity: objDomicilio
                }
                fnGuardaPersona(PersonaDomicilioHogar)
                this.setState({ redirect: true })
            } else {
                fnGuardaPersonaEnHogar(objPersona, this.state.hp_Jerarquia, this.state.hd_Id_Hogar)
                this.setState({ redirect: true })
            }
        }

        return (
            <React.Fragment>
                <h2 className="text-info">Agregar nuevo miembro</h2>

                <div className="border">
                    <form onSubmit={enviarInfo} id="FrmRegistroPersona" className="p-3" /* onChange={this.FrmRegistroPersona} */ >
                        <div className="container">

                            {/* Tabs de navegacion del formulario */}
                            <ul className="nav nav-tabs bg-primary mb-3 rounded" id="nav-registro-persona" role="tablist">
                                <li className="nav-item">
                                    <a onClick={DeshabilitaPestanas} className="nav-link active" id="verificarNuevoRegistro-tab" data-toggle="tab" href="#verificarNuevoRegistro" role="tab" aria-controls="verificarNuevoRegistro" aria-selected="true">Generales</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link disabled pertanaDeshabilitada" id="generales-tab" data-toggle="tab" href="#generales" role="tab" aria-controls="generales" aria-selected="true">Personales</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link disabled pertanaDeshabilitada" id="familiaAsendente-tab" data-toggle="tab" href="#familiaAsendente" role="tab" aria-controls="familiaAsendente" aria-selected="true">Familia Ascendente</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link disabled pertanaDeshabilitada" id="eclesiasticos-tab" data-toggle="tab" href="#eclesiasticos" role="tab" aria-controls="eclesiasticos" aria-selected="true">Eclesíasticos</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link disabled pertanaDeshabilitada" id="estado-civil-tab" data-toggle="tab" href="#estado-civil" role="tab" aria-controls="estado-civil" aria-selected="true">Estado Civil</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link disabled pertanaDeshabilitada" id="hogar-tab" data-toggle="tab" href="#hogar" role="tab" aria-controls="hogar" aria-selected="true">Hogar</a>
                                </li>
                            </ul>

                            <div className="tab-content" id="myTabContent">

                                {/* Verificar Nuevo Registro */}
                                <div className="tab-pane fade show active" id="verificarNuevoRegistro" role="tabpanel" aria-labelledby="verificarNuevoRegistro-tab">
                                    <div className="alert alert-warning mt-3" role="alert">
                                        <h5><strong>AVISO: </strong>Los campos marcados con <strong>*</strong> son requeridos.</h5>
                                    </div>
                                    <div className="form-group">
                                        <Distritos
                                            handle_dis_Id_Distrito={this.handle_dis_Id_Distrito}
                                        />
                                        {this.state.distritoSeleccionado !== "0" &&
                                            <Sectores
                                                sectores={this.state.sectores}
                                                form={form}
                                                onChange={onChange}
                                            />
                                        }
                                    </div>
                                    <hr />

                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label><strong>*</strong> Categoria</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <select
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
                                                </select>
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
                                    </div>
                                    {habilitaPerBautizado &&
                                        <div className="form-group">
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <label>Bautizado</label>
                                                </div>
                                                <div className="col-sm-2">
                                                    <input
                                                        type="checkbox"
                                                        name="per_Bautizado"
                                                        onChange={onChange}
                                                        className="form-control"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    }

                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label><strong>*</strong> Nombre</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input
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
                                    </div>

                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label><strong>*</strong> Apellido paterno</label>
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
                                            {per_Apellido_Paterno_NoValido &&
                                                <span className="text-danger">
                                                    Campo requerido, solo acepta letras, numeros y espacios.
                                                </span>
                                            }
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
                                                    id="per_Apellido_Materno"
                                                    className="form-control"
                                                />
                                            </div>
                                            {!this.state.per_Apellido_Materno_OK &&
                                                <span className="text-primary font-italic">
                                                    NO requerido pero solo acepta letras, numeros y espacios.
                                                </span>
                                            }
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label><strong>*</strong> Fecha nacimiento</label>
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
                                            {per_Fecha_Nacimiento_NoValido &&
                                                <span className="text-danger">
                                                    Campo requerido, el formato de fecha debe ser DD/MM/AAAA.
                                                </span>
                                            }
                                        </div>
                                    </div>

                                    {/* Boton para verificar duplicados */}
                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <button type="button" onClick={handle_verificarDuplicados} className="btn btn-primary form-control">
                                                    <i>Continuar</i>
                                                </button>
                                            </div>
                                            {this.state.PersonaEncontrada &&
                                                <div className="col-sm-">
                                                    <button type="button" onClick={IgnorarDuplicados} className="btn btn-success form-control">
                                                        <span className="fas fa-check fa-sm" style={{ paddingRight: "20px" }}></span>
                                                        <i>Ignorar duplicados y continuar</i>
                                                    </button>
                                                </div>
                                            }
                                            <div className="col-sm-4"></div>
                                        </div>
                                    </div>

                                    {this.state.PersonaEncontrada &&
                                        <PersonaEncontrada
                                            datosPersonaEncontrada={this.state.datosPersonaEncontrada}
                                        />
                                    }

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
                                                                <option
                                                                    key={profesion_oficio.pro_Id_Profesion_Oficio}
                                                                    value={profesion_oficio.pro_Id_Profesion_Oficio}>
                                                                    {profesion_oficio.pro_Categoria} | {profesion_oficio.pro_Sub_Categoria}
                                                                </option>
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
                                                                <option
                                                                    key={profesion_oficio.pro_Id_Profesion_Oficio}
                                                                    value={profesion_oficio.pro_Id_Profesion_Oficio}>
                                                                    {profesion_oficio.pro_Categoria} | {profesion_oficio.pro_Sub_Categoria}
                                                                </option>
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
                                                <label>Nacionalidad</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input
                                                    type="text"
                                                    name="per_Nacionalidad"
                                                    onChange={onChange}
                                                    className="form-control"
                                                    value={form.per_Nacionalidad}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Lugar de nacimiento</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input
                                                    type="text"
                                                    name="per_Lugar_De_Nacimiento"
                                                    onChange={onChange}
                                                    className="form-control"
                                                    value={form.per_Lugar_De_Nacimiento}
                                                />
                                            </div>
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
                                                <label>Cargos desempeñados</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <textarea
                                                    name="per_Cargos_Desempenados"
                                                    onChange={onChange}
                                                    className="form-control"
                                                    value={form.per_Cargos_Desempenados}
                                                ></textarea>
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
                                                    <div className="col-sm-6">
                                                        {per_Fecha_Boda_Civil_NoValido &&
                                                            <span className="text-danger">
                                                                Campo requerido, el formato de fecha debe ser DD/MM/AAAA.
                                                            </span>
                                                        }
                                                    </div>
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
                                                            value={form.per_Num_Acta_Boda_Civil}
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
                                                            value={form.per_Libro_Acta_Boda_Civil}
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
                                                            value={form.per_Oficialia_Boda_Civil}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {form.per_Bautizado &&
                                                <React.Fragment>
                                                    <div className="form-group">
                                                        <div className="row">
                                                            <div className="col-sm-2">
                                                                <label htmlFor="per_Fecha_Boda_Eclesiastica">Fecha boda eclesiastica</label>
                                                            </div>
                                                            <div className="col-sm-4">
                                                                <input
                                                                    type="text"
                                                                    name="per_Fecha_Boda_Eclesiastica"
                                                                    onChange={onChange}
                                                                    value={form.per_Fecha_Boda_Eclesiastica}
                                                                    placeholder="DD/MM/AAAA"
                                                                    className="form-control"
                                                                />
                                                            </div>
                                                            <div className="col-sm-6">
                                                                {per_Fecha_Boda_Eclesiastica_NoValido &&
                                                                    <span className="text-danger">
                                                                        Campo requerido, el formato de fecha debe ser DD/MM/AAAA.
                                                                    </span>
                                                                }
                                                            </div>
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
                                                                    value={form.per_Lugar_Boda_Eclesiastica}
                                                                />
                                                            </div>
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
                                                                value={form.per_Cantidad_Hijos}
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
                                                                value={form.per_Nombre_Hijos}
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
                                    {form.per_Bautizado &&
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
                                                            value={form.per_Lugar_Bautismo}
                                                            className="form-control"
                                                        />
                                                    </div>
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
                                                            name="per_Fecha_Bautismo"
                                                            onChange={onChange}
                                                            value={form.per_Fecha_Bautismo}
                                                            placeholder="DD/MM/AAAA"
                                                            className="form-control"
                                                        />
                                                    </div>
                                                    <div className="col-sm-6">
                                                        {per_Fecha_Bautismo_NoValido &&
                                                            <span className="text-danger">
                                                                Campo requerido, el formato de fecha debe ser DD/MM/AAAA.
                                                            </span>
                                                        }
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
                                                            value={form.per_Ministro_Que_Bautizo}
                                                            className="form-control"
                                                        />
                                                    </div>
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
                                                            name="per_Fecha_Recibio_Espiritu_Santo"
                                                            onChange={onChange}
                                                            value={form.per_Fecha_Recibio_Espiritu_Santo}
                                                            placeholder="DD/MM/AAAA"
                                                            className="form-control"
                                                        />
                                                    </div>
                                                    <div className="col-sm-6">
                                                        {per_Fecha_Recibio_Espiritu_Santo_NoValido &&
                                                            <span className="text-danger">
                                                                Campo requerido, el formato de fecha debe ser DD/MM/AAAA.
                                                            </span>
                                                        }
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
                                                            value={form.per_Bajo_Imposicion_De_Manos}
                                                            className="form-control"
                                                        />
                                                    </div>
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
                                                    value={form.per_Cambios_De_DomicilioRef}
                                                    className="form-control"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Hogar */}
                                <div className="tab-pane fade" id="hogar" role="tabpanel" aria-labelledby="hogar-tab">
                                    <HogarPersonaDomicilio
                                        domicilio={domicilio}
                                        onChangeDomicilio={onChangeDomicilio}
                                        handle_hd_Id_Hogar={this.handle_hd_Id_Hogar}
                                        handle_hp_Jerarquia={this.handle_hp_Jerarquia}
                                    />

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
                            </div>
                        </div>

                    </form>
                </div>
            </React.Fragment>
        );
    }
}

export default PersonaForm;