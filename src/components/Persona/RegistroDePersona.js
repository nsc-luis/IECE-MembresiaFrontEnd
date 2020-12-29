import React, { Component } from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import axios from 'axios';
import SimpleReactValidator from 'simple-react-validator';
import Global from '../../Global';
import MomentLocalUtils from 'react-day-picker/moment';
import { Link } from 'react-router-dom';

class RegistroDePersonal extends Component {

    url = Global.url_api;
    fechaNoIngresada = "1890-01-01";

    state = {
        estados: [],
        paises: [],
        profesiones_oficios: [],
        ListaHogares: [],
        DatosHogarDomicilio: {},
        SelectHogarId: '0'
    };

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value 
        })
    }

    componentWillMount() {
        this.getEstados();
        this.getPaises();
        this.getProfesionesOficios();
        this.getListaHogares();
        this.validator = new SimpleReactValidator({
            messages: {
                alpha_space: 'Campo requerido, solo acepta letras y espacios.',
                required: "Este campo es requerido.",
                regex: "Selecciona una opciona valida.",
                phone: "Ingrese un numero valido de 10 digitos, solo numeros.",
                email: "Email invalido.",
                date: "Debe ingresar una fecha valida.",
                between: "La jerarquia debe estar dentro del rango de la jerarquia de los miembros +1."
            }
        });
    };

    getEstados = () => {
        axios.get(this.url + "/estado")
            .then(res => {
                this.setState({
                    estados: res.data,
                    status: 'success'
                });
            });
    };

    getPaises = () => {
        axios.get(this.url + "/pais")
            .then(res => {
                this.setState({
                    paises: res.data,
                    status: 'success'
                });
            });
    };

    // getPersonaByRFCSinHomo = (str) => {
    //     axios.get(this.url + "/persona/GetByRFCSinHomo/" + str)
    //         .then(res => {
    //             if (res.data[0].status === true) {
    //                 this.setState({
    //                     PersonaEncontrada: true,
    //                     datosPersonaEncontrada: res.data[0].persona[0],
    //                     RFCSinHomoclave: str
    //                 });
    //                 // console.log(this.state.datosPersonaEncontrada);
    //             }
    //             if (res.data[0].status === false) {
    //                 this.setState({
    //                     PersonaEncontrada: false,
    //                     datosPersonaEncontrada: {},
    //                     RFCSinHomoclave: str
    //                 });
    //             }
    //         });
    // };

    getProfesionesOficios = () => {
        axios.get(this.url + "/profesion_oficio")
            .then(res => {
                this.setState({
                    profesiones_oficios: res.data,
                    status: 'success'
                });
            });
    };

    getListaHogares = () => {
        axios.get(this.url + "/Hogar_Persona/GetListaHogares")
            .then(res => {
                this.setState({
                    ListaHogares: res.data,
                    status: 'success'
                });
            });
    }

    // HogarSeleccionado = async () => {
    //     //console.log(this.hp_Id_HogarRef.current.value);
    //     await axios.get(this.url + "/Hogar_Persona/GetMiembros/" + this.hp_Id_HogarRef.current.value)
    //         .then(res => {
    //             this.setState({
    //                 MiembrosDelHogar: res.data,
    //                 status: 'success',
    //                 SelectHogarId: this.hp_Id_HogarRef.current.value
    //             });
    //         });
    //     await axios.get(this.url + "/Hogar_Persona/GetDatosHogarDomicilio/" + this.hp_Id_HogarRef.current.value)
    //         .then(res => {
    //             this.setState({
    //                 DatosHogarDomicilio: res.data
    //             });
    //         });

    //     let jerarquias = [];
    //     for (let i = 1; i <= this.state.MiembrosDelHogar.length + 1; i++) {
    //         jerarquias.push(<option value={i}>{i}</option>)
    //     }

    //     await this.setState({
    //         JerarquiasDisponibles: jerarquias
    //     });
    //     /* if (this.hp_Id_HogarRef.current.value === '0') {
    //         this.validator.hideMessages();
    //         this.forceUpdate();
    //         this.validator.hideMessageFor(this.state.hd_Localidad);
    //         this.validator.hideMessageFor('hd_Municipio_Cuidad');
    //         this.validator.hideMessageFor('est_Id_Estado');
    //         this.validator.hideMessageFor('pais_Id_Pais');
    //     } */

    //     // console.log(this.state.JerarquiasDisponibles);
    //     // console.log(this.state.SelectHogarId);
    // }

    // EsMiembroBautizado = () => {
    //     // console.log(this.per_BautizadoRef.current.checked);
    //     if (this.per_BautizadoRef.current.checked) {
    //         this.setState({ ElMiembroEsBautizado: true });
    //     } else {
    //         this.setState({ ElMiembroEsBautizado: false });
    //     }
    // }

    // fnPromesaDelEspirituSanto = () => {
    //     if (this.PromesaDelEspirituSantoRef.current.checked) {
    //         this.setState({ TienePromesaDelEspitiruSanto: true });
    //     } else {
    //         this.setState({ TienePromesaDelEspitiruSanto: false });
    //     }
    // }

    // fnDatosEclesiasticos = () => {
    //     if (this.per_BautizadoRef.current.checked && this.PromesaDelEspirituSantoRef.current.checked) {
    //         let eclesiasticos = {
    //             per_Bautizado: true,
    //             per_Lugar_Bautismo: this.per_Lugar_BautismoRef.current.value,
    //             per_Fecha_Bautismo: this.state.fechaBautismo,
    //             per_Ministro_Que_Bautizo: this.per_Ministro_Que_BautizoRef.current.value,
    //             per_Fecha_Recibio_Espiritu: this.state.fechaPromesaDelEspitiru,
    //             per_Bajo_Imposicion_De_Manos: this.per_Bajo_Imposicion_De_ManosRef.current.value,
    //             per_Cambios_De_Domicilio: this.per_Cambios_De_DomicilioRef.current.value
    //         }
    //         return eclesiasticos;
    //     }
    //     else if (this.per_BautizadoRef.current.checked && !this.PromesaDelEspirituSantoRef.current.checked) {
    //         let eclesiasticos = {
    //             per_Bautizado: true,
    //             per_Lugar_Bautismo: this.per_Lugar_BautismoRef.current.value,
    //             per_Fecha_Bautismo: this.state.fechaBautismo,
    //             per_Ministro_Que_Bautizo: this.per_Ministro_Que_BautizoRef.current.value,
    //             per_Cambios_De_Domicilio: this.per_Cambios_De_DomicilioRef.current.value
    //         };
    //         return eclesiasticos;
    //     }
    //     else if (!this.per_BautizadoRef.current.checked && this.PromesaDelEspirituSantoRef.current.checked) {
    //         let eclesiasticos = {
    //             per_Fecha_Recibio_Espiritu: this.state.fechaPromesaDelEspitiru,
    //             per_Bajo_Imposicion_De_Manos: this.per_Bajo_Imposicion_De_ManosRef.current.value,
    //             per_Cambios_De_Domicilio: this.per_Cambios_De_DomicilioRef.current.value
    //         }
    //         /* this.setState({
    //             per_Fecha_Recibio_Espiritu: this.state.fechaPromesaDelEspitiru
    //         }); */
    //         return eclesiasticos;
    //     } else {
    //         let eclesiasticos = {
    //             per_Cambios_De_Domicilio: this.per_Cambios_De_DomicilioRef.current.value
    //         }
    //         return eclesiasticos;
    //     }
    // }

    // fBodaCivil = (day) => {
    //     this.setState({
    //         fechaBodaCivil: MomentLocalUtils.formatDate(day, 'YYYY-MM-DD')
    //     })
    // }

    // fBodaEclesiastica = (day) => {
    //     this.setState({
    //         fechaBodaEclesiastica: MomentLocalUtils.formatDate(day, 'YYYY-MM-DD')
    //     })
    // }

    // fBautismo = (day) => {
    //     this.setState({
    //         fechaBautismo: MomentLocalUtils.formatDate(day, 'YYYY-MM-DD')
    //     })
    // }

    // fRecibioEspirituSanto = (day) => {
    //     this.setState({
    //         fechaPromesaDelEspitiru: MomentLocalUtils.formatDate(day, 'YYYY-MM-DD')
    //     })
    // }

    // fnDatosEstadoCivil = () => {
    //     if (this.state.CasadoDivorciadoViudo && this.state.ElMiembroEsBautizado) {
    //         let estadoCivil = {
    //             per_Estado_Civil: this.per_Estado_CivilRef.current.value,
    //             per_Fecha_Boda_Civil: this.state.fechaBodaCivil,
    //             per_Num_Acta_Boda_Civil: this.per_Num_Acta_Boda_CivilRef.current.value,
    //             per_Libro_Acta_Boda_Civil: this.per_Libro_Acta_Boda_CivilRef.current.value,
    //             per_Oficialia_Boda_Civil: this.per_Oficialia_Boda_CivilRef.current.value,
    //             per_Fecha_Boda_Eclesiastica: this.state.fechaBodaEclesiastica,
    //             per_Lugar_Boda_Eclesiastica: this.per_Lugar_Boda_EclesiasticaRef.current.value,
    //             per_Nombre_Conyuge: this.per_Nombre_ConyugeRef.current.value,
    //             per_Cantidad_Hijos: this.per_Cantidad_HijosRef.current.value,
    //             per_Nombre_Hijos: this.per_Nombre_HijosRef.current.value
    //         }
    //         return estadoCivil;
    //     } else if (this.state.CasadoDivorciadoViudo && !this.state.ElMiembroEsBautizado) {
    //         let estadoCivil = {
    //             per_Estado_Civil: this.per_Estado_CivilRef.current.value,
    //             per_Fecha_Boda_Civil: this.state.fechaBodaCivil,
    //             per_Num_Acta_Boda_Civil: this.per_Num_Acta_Boda_CivilRef.current.value,
    //             per_Libro_Acta_Boda_Civil: this.per_Libro_Acta_Boda_CivilRef.current.value,
    //             per_Oficialia_Boda_Civil: this.per_Oficialia_Boda_CivilRef.current.value,
    //             per_Cantidad_Hijos: this.per_Cantidad_HijosRef.current.value,
    //             per_Nombre_Hijos: this.per_Nombre_HijosRef.current.value
    //         }
    //         return estadoCivil;
    //     } else if (this.state.ConcubinatoSolteroConHijos) {
    //         let estadoCivil = {
    //             per_Estado_Civil: this.per_Estado_CivilRef.current.value,
    //             per_Cantidad_Hijos: this.per_Cantidad_HijosRef.current.value,
    //             per_Nombre_Hijos: this.per_Nombre_HijosRef.current.value
    //         }
    //         return estadoCivil;
    //     } else {
    //         let estadoCivil = {
    //             per_Estado_Civil: this.per_Estado_CivilRef.current.value
    //         }
    //         return estadoCivil;
    //     }
    // }

    // fnDatosHogar = () => {
    //     if (this.hp_Id_HogarRef.current.value === "0") {
    //         let hd = {
    //             hd_Calle: this.hd_CalleRef.current.value,
    //             hd_Numero_Exterior: this.hd_Numero_ExteriorRef.current.value,
    //             hd_Numero_Interior: this.hd_Numero_InteriorRef.current.value,
    //             hd_Tipo_Subdivision: this.hd_Tipo_SubdivisionRef.current.value,
    //             hd_Subdivision: this.hd_SubdivisionRef.current.value,
    //             hd_Localidad: this.hd_LocalidadRef.current.value,
    //             hd_Municipio_Cuidad: this.hd_Municipio_CuidadRef.current.value,
    //             pais_Id_Pais: this.pais_Id_PaisRef.current.value,
    //             est_Id_Estado: this.est_Id_EstadoRef.current.value,
    //             hd_Telefono: this.hd_TelefonoRef.current.value
    //         }
    //         return hd;
    //     } else {
    //         let hogar = {
    //             hp_Jerarquia: this.hp_JerarquiaRef.current.value,
    //             hp_Id_Hogar: this.hp_Id_HogarRef.current.value
    //         }
    //         return hogar;
    //     }
    // }

    fnGuardaPersona = async (datos) => {
        return await axios.post(this.url + "/persona", datos)
            .then(res => res.data)
            .catch(error => error);
    }

    fnGuardaHogarDomicilio = async (datos) => {
        return await axios.post(this.url + "/HogarDomicilio", datos)
            .then(res => res.data)
            .catch(error => error);
    }

    fnGuardaHogar_Persona = async (p, d) => {
        let foo = await this.fnGuardaPersona(p);
        let data = {
            per_Id_Persona: foo.nvaPersona
        }

        if (this.hp_Id_HogarRef.current.value === "0") {
            let bar = await this.fnGuardaHogarDomicilio(d);
            data.hd_Id_Hogar = bar.nvoHogarDomicilio;
            data.hp_Jerarquia = 1;
            console.log(data);
        } else {
            data.hd_Id_Hogar = d.hp_Id_Hogar;
            data.hp_Jerarquia = d.hp_Jerarquia;
            console.log(data);
        }
        console.log(p);
        await axios.post(this.url + "/Hogar_Persona", data);
        console.log(data);
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

        return (
            <React.Fragment>
                <h2 className="text-info">Agregar nuevo miembro</h2>

                <div className="border">
                    <form onSubmit={this.FrmRegistroPersona} id="FrmRegistroPersona" className="p-3" /* onChange={this.FrmRegistroPersona} */ >
                        <div className="container">

                            <ul className="nav nav-tabs bg-secondary mb-3 rounded" id="nav-registro-persona" role="tablist">
                                <li className="nav-item">
                                    <a className="nav-link active" id="verificarNuevoRegistro-tab" data-toggle="tab" href="#verificarNuevoRegistro" role="tab" aria-controls="verificarNuevoRegistro" aria-selected="true">1. Nuevo registro</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="generales-tab" data-toggle="tab" href="#generales" role="tab" aria-controls="generales" aria-selected="true">2. Generales</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="familiaAsendente-tab" data-toggle="tab" href="#familiaAsendente" role="tab" aria-controls="familiaAsendente" aria-selected="true">3. Familia asendente</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="eclesiasticos-tab" data-toggle="tab" href="#eclesiasticos" role="tab" aria-controls="eclesiasticos" aria-selected="true">4. Eclesiasticos</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="estado-civil-tab" data-toggle="tab" href="#estado-civil" role="tab" aria-controls="estado-civil" aria-selected="true">5. Estado civil</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="hogar-tab" data-toggle="tab" href="#hogar" role="tab" aria-controls="hogar" aria-selected="true">6. Hogar</a>
                                </li>
                            </ul>

                            <div className="tab-content" id="myTabContent">

                                {/* {<VerificarNuevoRegistro
                                    VerificarNuevoRegistroDatos = {this.VerificarNuevoRegistroDatos}
                                />} */}
                                <div className="tab-pane fade show active" id="verificarNuevoRegistro" role="tabpanel" aria-labelledby="verificarNuevoRegistro-tab">
                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Categoria</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <select
                                                    name="per_Categoria"
                                                    onChange={this.handleChange}
                                                    className="form-control"
                                                >
                                                    <option value="0">Selecionar categoria</option>
                                                    <option value="Adulto_Hombre">Adulto Hombre</option>
                                                    <option value="Adulto_Mujer">Adulto Mujer</option>
                                                    <option value="Joven_Hombre">Joven hombre</option>
                                                    <option value="Joven_Mujer">Joven mujer</option>
                                                </select>
                                            </div>
                                            <span style={{ color: 'red' }}>
                                                {this.validator.message('per_Categoria', this.state.per_Categoria, 'regex:^[a-zA-Z]*(_)[a-zA-Z]*$')}
                                            </span>
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
                                                    onChange={this.handleChange}
                                                    onBlur={this.CheckNvaPersona}
                                                    ref={this.per_NombreRef}
                                                    className="form-control uppercase"
                                                />
                                            </div>
                                            <span style={{ color: 'red' }}>
                                                {this.validator.message('per_Nombre', this.state.per_Nombre, 'required|alpha_space')}
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
                                                    onChange={this.handleChange}
                                                    className="form-control"
                                                />
                                            </div>
                                            <span style={{ color: 'red' }}>
                                                {this.validator.message('per_Apellido_Paterno', this.state.per_Apellido_Paterno, 'required|alpha_space')}
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
                                                    onChange={this.handleChange}
                                                    className="form-control"
                                                />
                                            </div>
                                            <span style={{ color: 'red' }}>
                                                {this.validator.message('per_Apellido_Materno', this.state.per_Apellido_Materno, 'required|alpha_space')}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Fecha nacimiento</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <DayPickerInput
                                                    dayPickerProps={{
                                                        showWeekNumbers: true,
                                                        todayButton: 'Today'
                                                    }}
                                                    onDayChange={this.CheckNvaPersona}
                                                />
                                            </div>
                                            {/* <span style={{ color: 'red' }}>
                                                {this.validator.message('fechanNacimiento', this.state.fechanNacimiento, 'required|date')}
                                            </span> */}
                                        </div>
                                    </div>

                                    {this.state.PersonaEncontrada === true &&
                                        <React.Fragment>
                                            <div className="alert alert-warning mt-3" role="alert">
                                                <h5><strong>AVISO: </strong>Se ha encontrado una persona con el mismo RFC: {this.state.RFCSinHomoclave} (SIN homoclave), asegurese de no duplicar a la persona.</h5>
                                            </div>
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Nombre</th>
                                                        <th scope="col">Nacimiento</th>
                                                        {/* <th scope="col">Distrito / Localidad</th>
                                                        <th scope="col">Sector / Localidad</th> */}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>{this.state.datosPersonaEncontrada.per_Nombre} {this.state.datosPersonaEncontrada.per_Apellido_Paterno} {this.state.datosPersonaEncontrada.per_Apellido_Materno} </td>
                                                        <td>{this.state.datosPersonaEncontrada.per_Fecha_Nacimiento} </td>
                                                        {/* <td>{this.state.datosPersonaEncontrada.dis_Numero} / {this.state.datosPersonaEncontrada.dis_Localidad}</td>
                                                        <td>{this.state.datosPersonaEncontrada.sec_Numero} / {this.state.datosPersonaEncontrada.sec_Localidad}</td> */}
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </React.Fragment>
                                    }

                                </div>

                                {/* <Generales
                                    GeneralesDatos={this.GeneralesDatos}
                                /> */}
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
                                                    onChange={this.handleChange}
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
                                                    onChange={this.handleChange}
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
                                                    onChange={this.handleChange}
                                                    className="form-control"
                                                />
                                            </div>
                                            <span style={{ color: 'red' }}>
                                                {this.validator.message('per_Telefono_Fijo', this.state.per_Telefono_Fijo, 'phone|regex:^[0-9]{10}$')}
                                            </span>
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
                                                    onChange={this.handleChange}
                                                    className="form-control"
                                                />
                                            </div>
                                            <span style={{ color: 'red' }}>
                                                {this.validator.message('per_Telefono_Movil', this.state.per_Telefono_Movil, 'phone|regex:^[0-9]{10}$')}
                                            </span>
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
                                                    onChange={this.handleChange}
                                                    className="form-control inputEmail"
                                                />
                                            </div>
                                            <span style={{ color: 'red' }}>
                                                {this.validator.message('per_Email_Personal', this.state.per_Email_Personal, 'email')}
                                            </span>
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
                                                    onChange={this.handleChange}
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
                                                    onChange={this.handleChange}
                                                    className="form-control"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* <FamiliaAsendente
                                    FamiliaAsendenteDatos={this.FamiliaAsendenteDatos}
                                /> */}
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
                                                    onChange={this.handleChange}
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
                                                    onChange={this.handleChange}
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
                                                    onChange={this.handleChange}
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
                                                    onChange={this.handleChange}
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
                                                    onChange={this.handleChange}
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
                                                    onChange={this.handleChange}
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                {/* <EstadoCivil
                                    EstadoCivilDatos={this.EstadoCivilDatos}
                                    MatrimonioDatos={this.MatrimonioDatos}
                                /> */}
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
                                                    onChange={this.handleChange}
                                                    className="form-control"
                                                >
                                                    <option value="casado">Casado/a</option>
                                                    <option value="divorciado">Divorciado/a</option>
                                                    <option value="viudo">Viudo/a</option>
                                                    <option value="concubinato">Union libre/concubinato</option>
                                                    <option value="soltero">Soltero SIN hijos</option>
                                                    <option value="solteroconhijos">Soltero CON hijos</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* <Matrimonio
                                        MatrimonioDatos = {this.MatrimonioDatos}
                                    /> */}
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
                                                            onChange={this.handleChange}
                                                            className="form-control"
                                                        />
                                                    </div>
                                                    <span style={{ color: 'red' }}>
                                                        {this.validator.message('per_Nombre_Conyuge', this.state.per_Nombre_Conyuge, 'required')}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <div className="row">
                                                    <div className="col-sm-2">
                                                        <label>Fecha boda civil</label>
                                                    </div>
                                                    <div className="col-sm-4">
                                                        <DayPickerInput
                                                            dayPickerProps={{
                                                                showWeekNumbers: true,
                                                                todayButton: 'Today',
                                                            }}
                                                            onDayChange={this.fBodaCivil}
                                                        />
                                                    </div>
                                                    {/* <span style={{ color: 'red' }}>
                                                        {this.validator.message('per_Nombre_Conyuge', this.state.per_Nombre_Conyuge, 'required')}
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
                                                            onChange={this.handleChange}
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
                                                            onChange={this.handleChange}
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
                                                            onChange={this.handleChange}
                                                            className="form-control"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {this.state.ElMiembroEsBautizado &&
                                                <React.Fragment>
                                                    <div className="form-group">
                                                        <div className="row">
                                                            <div className="col-sm-2">
                                                                <label htmlFor="per_Fecha_Boda_Eclesiastica">Fecha boda eclesiastica</label>
                                                            </div>
                                                            <div className="col-sm-4">
                                                                <DayPickerInput
                                                                    dayPickerProps={{
                                                                        showWeekNumbers: true,
                                                                        todayButton: 'Today',
                                                                    }}
                                                                    onDayChange={this.fBodaEclesiastica}
                                                                />
                                                            </div>
                                                            {/* <span style={{ color: 'red' }}>
                                                                {this.validator.message('per_Nombre_Conyuge', this.state.per_Nombre_Conyuge, 'required')}
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
                                                                    onChange={this.handleChange}
                                                                    className="form-control"
                                                                />
                                                            </div>
                                                            <span style={{ color: 'red' }}>
                                                                {this.validator.message('per_Lugar_Boda_Eclesiastica', this.state.per_Lugar_Boda_Eclesiastica, 'required')}
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
                                                                onChange={this.handleChange}
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
                                                                onChange={this.handleChange}
                                                                className="form-control" ></textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    }
                                </div>

                                {/* <Eclesiasticos
                                    EclesiasticosDatos={this.EclesiasticosDatos}
                                /> */}
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
                                                    onChange={this.handleChange}
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
                                                    onChange={this.handleChange}
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* <Bautismo /> */}
                                    {this.state.ElMiembroEsBautizado &&
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
                                                            onChange={this.handleChange}
                                                            className="form-control"
                                                        />
                                                    </div>
                                                    <span style={{ color: 'red' }}>
                                                        {this.validator.message('per_Lugar_Bautismo', this.state.per_Lugar_Bautismo, 'required')}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <div className="row">
                                                    <div className="col-sm-2">
                                                        <label>Fecha bautismo</label>
                                                    </div>
                                                    <div className="col-sm-4">
                                                        <DayPickerInput
                                                            dayPickerProps={{
                                                                showWeekNumbers: true,
                                                                todayButton: 'Today',
                                                            }}
                                                            onDayChange={this.fBautismo}
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
                                                            onChange={this.handleChange}
                                                            className="form-control"
                                                        />
                                                    </div>
                                                    <span style={{ color: 'red' }}>
                                                        {this.validator.message('per_Ministro_Que_Bautizo', this.state.per_Ministro_Que_Bautizo, 'required')}
                                                    </span>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    }

                                    {this.state.TienePromesaDelEspitiruSanto &&
                                        <React.Fragment>
                                            <div className="form-group">
                                                <div className="row">
                                                    <div className="col-sm-2">
                                                        <label>Fecha recibio Espiritu Santo</label>
                                                    </div>
                                                    <div className="col-sm-4">
                                                        <DayPickerInput
                                                            dayPickerProps={{
                                                                showWeekNumbers: true,
                                                                todayButton: 'Today',
                                                            }}
                                                            onDayChange={this.fRecibioEspirituSanto}
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
                                                            onChange={this.handleChange}
                                                            className="form-control"
                                                        />
                                                    </div>
                                                    <span style={{ color: 'red' }}>
                                                        {this.validator.message('per_Bajo_Imposicion_De_Manos', this.state.per_Bajo_Imposicion_De_Manos, 'required')}
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
                                                    onChange={this.handleChange}
                                                    className="form-control"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* <Hogar
                                    HogarDatos={this.HogarDatos}
                                /> */}
                                <div className="tab-pane fade" id="hogar" role="tabpanel" aria-labelledby="hogar-tab">
                                    <div className="form-group">
                                        <div className="alert alert-info mt-3" role="alert">
                                            <h5><strong>AVISO: </strong>Al seleccionar la opcion "Nuevo hogar / domicilio" debera completar los campos necesarios.</h5>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Asignar a hogar</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <select
                                                    name="hp_Id_Hogar"
                                                    onChange={this.handleChange}
                                                    className="form-control"
                                                >
                                                    <option value="0">Nuevo hogar / domicilio</option>
                                                    {
                                                        this.state.ListaHogares.map((hogar) => {
                                                            return (
                                                                <option key={hogar.hd_Id_Hogar} value={hogar.hd_Id_Hogar}>{hogar.per_Nombre} {hogar.per_Apellido_Paterno} {hogar.per_Apellido_Materno} | {hogar.hd_Calle} {hogar.hd_Numero_Exterior}, {hogar.hd_Localidad}, {hogar.est_Nombre}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {this.state.SelectHogarId !== '0' &&
                                        <React.Fragment>
                                            <div className="alert alert-warning mt-3" role="alert">
                                                <h5>ATENCION: </h5>
                                                <ul>
                                                    <li>Debe establecer una jerarquia para la persona que esta registrando, siendo la jerarquia 1 el representante del hogar.</li>
                                                    <li>Solo puede seleccionar una jerarquia entre 1 y la jerarquia mas baja registrada.</li>
                                                    <li>Al establecer una jerarquia intermedia entre los miembros del hogar, se sumara 1 a los miembros con jerarquia mas baja a la establecida.</li>
                                                </ul>
                                            </div>
                                            <strong>HOGAR: </strong>

                                            {
                                                this.state.DatosHogarDomicilio.map((HogarDomicilio) => {
                                                    return (
                                                        <p key={HogarDomicilio.hd_Id_Hogar}>
                                                            {HogarDomicilio.hd_Calle} {HogarDomicilio.hd_Numero_Exterior}, {HogarDomicilio.hd_Numero_Interior} <br />
                                                            Tipo subdivision: {HogarDomicilio.hd_Tipo_Subdivision}, Subdivision: {HogarDomicilio.hd_Subdivision} <br />
                                                            {HogarDomicilio.hd_Localidad}, {HogarDomicilio.hd_Municipio_Cuidad} <br />
                                                            {HogarDomicilio.est_Nombre}, {HogarDomicilio.pais_Nombre_Corto} <br />
                                                            Telefono: {HogarDomicilio.hd_Telefono}
                                                        </p>
                                                    )
                                                })
                                            }
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Miembros del hogar</th>
                                                        <th scope="col">Jerarquia</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        this.state.MiembrosDelHogar.map((miembro, i) => {
                                                            return (
                                                                <tr key={i}>
                                                                    <td>{miembro.per_Nombre} {miembro.per_Apellido_Paterno} {miembro.per_Apellido_Materno}</td>
                                                                    <td>{miembro.hp_Jerarquia}</td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>

                                            <div className="form-group">
                                                <div className="row">
                                                    <div className="col-sm-2">
                                                        <label>Jerarquia por asignar</label>
                                                    </div>
                                                    <div className="col-sm-4">
                                                        <select
                                                            name="hp_Jerarquia"
                                                            onChange={this.handleChange}
                                                            className="form-control"
                                                        >
                                                            {this.state.JerarquiasDisponibles}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    }

                                    {/* <Domicilio /> */}
                                    {this.state.SelectHogarId === '0' &&
                                        <React.Fragment>
                                            <div className="form-group">
                                                <div className="row">
                                                    <div className="col-sm-2">
                                                        <label>Calle</label>
                                                    </div>
                                                    <div className="col-sm-4">
                                                        <input
                                                            type="text"
                                                            name="hd_Calle"
                                                            onChange={this.handleChange}
                                                            className="form-control"
                                                        />
                                                    </div>
                                                    <span style={{ color: 'red' }}>
                                                        {this.validator.message('hd_Calle', this.state.hd_Calle, 'required')}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="row">
                                                    <div className="col-sm-2">
                                                        <label>Numero exterior</label>
                                                    </div>
                                                    <div className="col-sm-4">
                                                        <input
                                                            type="text"
                                                            name="hd_Numero_Exterior"
                                                            onChange={this.handleChange}
                                                            className="form-control"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="row">
                                                    <div className="col-sm-2">
                                                        <label>Numero interior</label>
                                                    </div>
                                                    <div className="col-sm-4">
                                                        <input
                                                            type="text"
                                                            name="hd_Numero_Interior"
                                                            onChange={this.handleChange}
                                                            className="form-control"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="row">
                                                    <div className="col-sm-2">
                                                        <label>Tipo subdivision</label>
                                                    </div>
                                                    <div className="col-sm-4">
                                                        <select
                                                            name="hd_Tipo_Subdivision"
                                                            onChange={this.handleChange}
                                                            className="form-control"
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
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="row">
                                                    <div className="col-sm-2">
                                                        <label>Subdivision</label>
                                                    </div>
                                                    <div className="col-sm-4">
                                                        <input
                                                            type="text"
                                                            name="hd_Subdivision"
                                                            onChange={this.handleChange}
                                                            className="form-control"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="row">
                                                    <div className="col-sm-2">
                                                        <label>Localidad</label>
                                                    </div>
                                                    <div className="col-sm-4">
                                                        <input
                                                            type="text"
                                                            name="hd_Localidad"
                                                            onChange={this.handleChange}
                                                            className="form-control"
                                                        />
                                                    </div>
                                                    <span style={{ color: 'red' }}>
                                                        {this.validator.message('hd_Localidad', this.state.hd_Localidad, 'required')}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="row">
                                                    <div className="col-sm-2">
                                                        <label>Municipio/Cuidad</label>
                                                    </div>
                                                    <div className="col-sm-4">
                                                        <input
                                                            type="text"
                                                            name="hd_Municipio_Cuidad"
                                                            onChange={this.handleChange}
                                                            className="form-control"
                                                        />
                                                    </div>
                                                    <span style={{ color: 'red' }}>
                                                        {this.validator.message('hd_Municipio_Cuidad', this.state.hd_Municipio_Cuidad, 'required')}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="row">
                                                    <div className="col-sm-2">
                                                        <label htmlFor="pais_Id_Pais">Pais</label>
                                                    </div>
                                                    <div className="col-sm-4">
                                                        <select
                                                            name="pais_Id_Pais"
                                                            onChange={this.handleChange}
                                                            className="form-control"
                                                        >
                                                            <option value="0">Selecciona un pais</option>
                                                            {
                                                                this.state.paises.map((pais, i) => {
                                                                    return (
                                                                        <option key={i} value={pais.pais_Id_Pais}> {pais.pais_Nombre} </option>
                                                                    )
                                                                })
                                                            }
                                                        </select>
                                                    </div>
                                                    <span style={{ color: 'red' }}>
                                                        {this.validator.message('pais_Id_Pais', this.state.pais_Id_Pais, 'required')}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="row">
                                                    <div className="col-sm-2">
                                                        <label htmlFor="est_Id_Estado">Estado</label>
                                                    </div>
                                                    <div className="col-sm-4">
                                                        <select
                                                            name="est_Id_Estado"
                                                            onChange={this.handleChange}
                                                            className="form-control"
                                                        >
                                                            <option value="0">Selecciona un estado</option>
                                                            {
                                                                this.state.estados.map((estado, i) => {
                                                                    return (
                                                                        <option key={i} value={estado.est_Id_Estado}> {estado.est_Nombre} </option>
                                                                    )
                                                                })
                                                            }
                                                        </select>
                                                    </div>
                                                    <span style={{ color: 'red' }}>
                                                        {this.validator.message('est_Id_Estado', this.state.est_Id_Estado, 'required')}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="row">
                                                    <div className="col-sm-2">
                                                        <label>Telefono</label>
                                                    </div>
                                                    <div className="col-sm-4">
                                                        <input
                                                            type="text"
                                                            name="hd_Telefono"
                                                            onChange={this.handleChange}
                                                            className="form-control"
                                                        />
                                                    </div>
                                                    <span style={{ color: 'red' }}>
                                                        {this.validator.message('hd_Telefono', this.state.hd_Telefono, 'phone|regex:^[0-9]{10}$')}
                                                    </span>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    }

                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2 offset-sm-2">
                                                <Link to="/ListaDePersonal" className="btn btn-success form-control">Volver</Link>
                                            </div>
                                            <div className="col-sm-2 offset-sm-2">
                                                <input type="submit" value="Guardar" className="btn btn-primary form-control" />
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

export default RegistroDePersonal;