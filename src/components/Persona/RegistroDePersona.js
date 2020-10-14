import React, { Component } from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

class RegistroDePersonal extends Component {

    per_NombreRef = React.createRef();
    per_CategoriaRef = React.createRef();
    per_Apellido_PaternoRef = React.createRef();
    per_Apellido_MaternoRef = React.createRef();
    per_Fecha_NacimientoRef = React.createRef();

    pro_Id_Profesion_Oficio1Ref = React.createRef();
    pro_Id_Profesion_Oficio2Ref = React.createRef();
    per_Telefono_FijoRef = React.createRef();
    per_Email_PersonalRef = React.createRef();
    per_ObservacionesRef = React.createRef();

    per_Nombre_PadreRef = React.createRef();
    per_Nombre_MadreRef = React.createRef();
    per_Nombre_Abuelo_PaternoRef = React.createRef();
    per_Nombre_Abuela_PaternaRef = React.createRef();
    per_Nombre_Abuelo_MaternoRef = React.createRef();
    per_Nombre_Abuela_MaternaRef = React.createRef();

    per_Estado_CivilRef = React.createRef();

    eci_Fecha_Boda_CivilRef = React.createRef();
    eci_Num_Acta_Boda_CivilRef = React.createRef();
    eci_Libro_Acta_Boda_CivilRef = React.createRef();
    eci_Oficialia_Boda_CivilRef = React.createRef();
    //eci_Fecha_Boda_EclesiasticaRef = React.createRef();
    eci_Lugar_Boda_EclesiasticaRef = React.createRef();
    eci_Nombre_ConyugeRef = React.createRef();
    eci_Cantidad_HijosRef = React.createRef();
    eci_Nombre_HijosRef = React.createRef();

    per_BautizadoRef = React.createRef();
    bau_Lugar_BautismoRef = React.createRef();
    bau_Fecha_BautismoRef = React.createRef();
    bau_Ministro_Que_BautizoRef = React.createRef();

    hog_JerarquiaRef = React.createRef();

    hog_Id_HogarRef = React.createRef();
    dom_CalleRef = React.createRef();
    dom_Numero_ExteriorRef = React.createRef();
    dom_Numero_InteriorRef = React.createRef();
    dom_Tipo_SubdivisionRef = React.createRef();
    dom_SubdivisionRef = React.createRef();
    dom_LocalidadRef = React.createRef();
    dom_Municipio_CuidadRef = React.createRef();
    pais_Id_PaisRef = React.createRef();
    est_Id_EstadoRef = React.createRef();
    dom_TelefonoRef = React.createRef();

    FrmRegistroPersona = (e) => {
        e.preventDefault();
        let datos = {
            generales : [{
                per_Nombre : this.per_NombreRef.current.value,
                per_Categoria : this.per_CategoriaRef.current.value,
                per_Apellido_Paterno : this.per_Apellido_PaternoRef.current.value,
                per_Apellido_Materno : this.per_Apellido_MaternoRef.current.value,
                per_Fecha_Nacimiento : this.per_Fecha_NacimientoRef.current.value,

                pro_Id_Profesion_Oficio1 : this.pro_Id_Profesion_Oficio1Ref.current.value,
                pro_Id_Profesion_Oficio2 : this.pro_Id_Profesion_Oficio2Ref.current.value,
                per_Telefono_Fijo : this.per_Telefono_FijoRef.current.value,
                per_Email_Personal : this.per_Email_PersonalRef.current.value,
                per_Observaciones : this.per_ObservacionesRef.current.value
            }],
            familiaAsendente : [{
                per_Nombre_Padre : this.per_Nombre_PadreRef.current.value,
                per_Nombre_Madre : this.per_Nombre_MadreRef.current.value,
                per_Nombre_Abuelo_Paterno : this.per_Nombre_Abuelo_PaternoRef.current.value,
                per_Nombre_Abuela_Paterna : this.per_Nombre_Abuela_PaternaRef.current.value,
                per_Nombre_Abuelo_Materno : this.per_Nombre_Abuelo_MaternoRef.current.value,
                per_Nombre_Abuela_Materna : this.per_Nombre_Abuela_MaternaRef.current.value
            }],
            estado_civil : [{
                per_Estado_Civil : this.per_Estado_CivilRef.current.value,

                // eci_Fecha_Boda_Civil : this.eci_Fecha_Boda_CivilRef.current.value,
                eci_Num_Acta_Boda_Civil : this.eci_Num_Acta_Boda_CivilRef.current.value,
                eci_Libro_Acta_Boda_Civil : this.eci_Libro_Acta_Boda_CivilRef.current.value,
                eci_Oficialia_Boda_Civil : this.eci_Oficialia_Boda_CivilRef.current.value,
                // eci_Fecha_Boda_Eclesiastica : this.eci_Fecha_Boda_EclesiasticaRef.current.value,
                eci_Lugar_Boda_Eclesiastica : this.eci_Lugar_Boda_EclesiasticaRef.current.value,
                eci_Nombre_Conyuge : this.eci_Nombre_ConyugeRef.current.value,
                eci_Cantidad_Hijos : this.eci_Cantidad_HijosRef.current.value,
                eci_Nombre_Hijos : this.eci_Nombre_HijosRef.current.value
            }],
            eclesiasticos : [{
                per_Bautizado : this.per_BautizadoRef.current.value,
                bau_Lugar_Bautismo : this.bau_Lugar_BautismoRef.current.value,
                // bau_Fecha_Bautismo : this.bau_Fecha_BautismoRef.current.value,
                bau_Ministro_Que_Bautizo : this.bau_Ministro_Que_BautizoRef.current.value
            }],
            hogar : [{
                hog_Jerarquia : this.hog_JerarquiaRef.current.value,

                hog_Id_Hogar : this.hog_Id_HogarRef.current.value,
                dom_Calle : this.dom_CalleRef.current.value,
                dom_Numero_Exterior : this.dom_Numero_ExteriorRef.current.value,
                dom_Numero_Interior : this.dom_Numero_InteriorRef.current.value,
                dom_Tipo_Subdivision : this.dom_Tipo_SubdivisionRef.current.value,
                dom_Subdivision : this.dom_SubdivisionRef.current.value,
                dom_Localidad : this.dom_LocalidadRef.current.value,
                dom_Municipio_Cuidad : this.dom_Municipio_CuidadRef.current.value,
                pais_Id_Pais : this.pais_Id_PaisRef.current.value,
                est_Id_Estado : this.est_Id_EstadoRef.current.value,
                dom_Telefono : this.dom_TelefonoRef.current.value
            }]
        };
        console.log(datos);
    };

    render() {
        return (
            <React.Fragment>
                <h2 className="text-info">Agregar nuevo miembro</h2>

                <div className="border">
                    <form onSubmit={this.FrmRegistroPersona}>
                        <div className="container">

                            <ul className="nav nav-tabs" id="myTab" role="tablist">
                                <li className="nav-item">
                                    <a className="nav-link" id="verificarNuevoRegistro-tab" data-toggle="tab" href="#verificarNuevoRegistro" role="tab" aria-controls="verificarNuevoRegistro" aria-selected="true">1. Nuevo registro</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="generales-tab" data-toggle="tab" href="#generales" role="tab" aria-controls="generales" aria-selected="true">2. Generales</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="familiaAsendente-tab" data-toggle="tab" href="#familiaAsendente" role="tab" aria-controls="familiaAsendente" aria-selected="true">3. Familia asendente</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="estado-civil-tab" data-toggle="tab" href="#estado-civil" role="tab" aria-controls="estado-civil" aria-selected="true">4. Estado civil</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="eclesiasticos-tab" data-toggle="tab" href="#eclesiasticos" role="tab" aria-controls="eclesiasticos" aria-selected="true">5. Eclesiasticos</a>
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
                                                <select name="per_Categoria" ref={this.per_CategoriaRef} className="form-control">
                                                    <option value="0">Selecionar categoria</option>
                                                    <option value="Adulto_Hombre">Adulto Hombre</option>
                                                    <option value="Adulto_Mujer">Adulto Mujer</option>
                                                    <option value="Joven_Hombre">Joven hombre</option>
                                                    <option value="Joven_Mujer">Joven mujer</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Nombre</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input type="tet" name="per_Nombre" ref={this.per_NombreRef} className="form-control" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Apellido paterno</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input type="text" name="per_Apellido_Paterno" ref={this.per_Apellido_PaternoRef} className="form-control" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Apellido materno</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input type="text" name="per_Apellido_Materno" ref={this.per_Apellido_MaternoRef} className="form-control" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Fecha nacimiento</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <DayPickerInput
                                                    ref={this.per_Fecha_NacimientoRef}
                                                    dayPickerProps={{
                                                        showWeekNumbers: true,
                                                        todayButton: 'Today',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <a href="#generales" className="btn btn-primary" onClick={this.VerificarNuevoRegistroDatos}>Siguiente</a>
                                            </div>
                                        </div>
                                    </div>
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
                                                <select name="pro_Id_Profesion_Oficio1" ref={this.pro_Id_Profesion_Oficio1Ref} className="form-control">
                                                    <option value="0">Selecciona un sector</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label for="Personal.pro_Id_Profesion_Oficio2">Profesion oficio2</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <select name="pro_Id_Profesion_Oficio2" ref={this.pro_Id_Profesion_Oficio2Ref} className="form-control">
                                                    <option value="0">Selecciona un sector</option>
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
                                                <input type="text" name="per_Telefono_Fijo" ref={this.per_Telefono_FijoRef} className="form-control" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Telefono movil</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input type="text" name="per_Telefono_Movil" ref={this.per_Telefono_MovilRef} className="form-control" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Email</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input type="text" name="per_Email_Personal" ref={this.per_Email_PersonalRef} className="form-control" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Foto</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input type="file" name="per_foto" ref={this.per_fotoRef} className="form-control" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Observaciones</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <textarea name="per_Observaciones" ref={this.per_ObservacionesRef} className="form-control"></textarea>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <a href="#familiaAsendente" className="btn btn-primary" onClick={this.GeneralesDatos}>Siguiente</a>
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
                                                <input type="text" name="per_Nombre_Padre" ref={this.per_Nombre_PadreRef} className="form-control" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Madre</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input type="text" name="per_Nombre_Madre" ref={this.per_Nombre_MadreRef} className="form-control" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Abuelo paterno</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input type="text" name="per_Nombre_Abuelo_Paterno" ref={this.per_Nombre_Abuelo_PaternoRef} className="form-control" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Abuela paterna</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input type="text" name="per_Nombre_Abuela_Paterna" ref={this.per_Nombre_Abuela_PaternaRef} className="form-control" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Abuelo materno</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input type="text" name="per_Nombre_Abuelo_Materno" ref={this.per_Nombre_Abuelo_MaternoRef} className="form-control" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Abuela materna</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input type="text" name="per_Nombre_Abuela_Materna" ref={this.per_Nombre_Abuela_MaternaRef} className="form-control" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <a href="#estado-civil" className="btn btn-primary" onClick={this.FamiliaAsendenteDatos}>Siguiente</a>
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
                                                <select name="per_Estado_Civil" ref={this.per_Estado_CivilRef} className="form-control">
                                                    <option vale="0">Selecciona un estado civil</option>
                                                    <option vale="casado">Casado/a</option>
                                                    <option vale="divorciado">Divorciado/a</option>
                                                    <option vale="viudo">Viudo/a</option>
                                                    <option vale="concubinato">Union libre/concubinato</option>
                                                    <option vale="soltero">Soltero SIN hijos</option>
                                                    <option vale="solteroconhijos">Soltero CON hijos</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* <Matrimonio
                                        MatrimonioDatos = {this.MatrimonioDatos}
                                    /> */}
                                    <div id="PersonalConMatrimonio">

                                        <div className="form-group">
                                            <div className="row">
                                                <div className="col-sm-2">
                                                    <label>Fecha boda civil</label>
                                                </div>
                                                <div className="col-sm-4">
                                                    <DayPickerInput
                                                        ref={this.eci_Fecha_Boda_CivilRef}
                                                        dayPickerProps={{
                                                            showWeekNumbers: true,
                                                            todayButton: 'Today',
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <div className="row">
                                                <div className="col-sm-2">
                                                    <label>Num acta boda civil</label>
                                                </div>
                                                <div className="col-sm-4">
                                                    <input type="text" name="eci_Num_Acta_Boda_Civil" ref={this.eci_Num_Acta_Boda_CivilRef} className="form-control" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <div className="row">
                                                <div className="col-sm-2">
                                                    <label>Libro acta boda civil</label>
                                                </div>
                                                <div className="col-sm-4">
                                                    <input type="text" name="eci_Libro_Acta_Boda_Civil" ref={this.eci_Libro_Acta_Boda_CivilRef} className="form-control" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <div className="row">
                                                <div className="col-sm-2">
                                                    <label>Oficialia boda civil</label>
                                                </div>
                                                <div className="col-sm-4">
                                                    <input type="text" name="eci_Oficialia_Boda_Civil" ref={this.eci_Oficialia_Boda_CivilRef} className="form-control" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <div className="row">
                                                <div className="col-sm-2">
                                                    <label for="eci_Fecha_Boda_Eclesiastica">Fecha boda eclesiastica</label>
                                                </div>
                                                <div className="col-sm-4">
                                                    <DayPickerInput
                                                        dayPickerProps={{
                                                            showWeekNumbers: true,
                                                            todayButton: 'Today',
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <div className="row">
                                                <div className="col-sm-2">
                                                    <label>Lugar boda eclesiastica</label>
                                                </div>
                                                <div className="col-sm-4">
                                                    <input type="text" name="eci_Lugar_Boda_Eclesiastica" ref={this.eci_Lugar_Boda_EclesiasticaRef} className="form-control" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <div className="row">
                                                <div className="col-sm-2">
                                                    <label>Nombre conyuge</label>
                                                </div>
                                                <div className="col-sm-4">
                                                    <input type="text" name="eci_Nombre_Conyuge" ref={this.eci_Nombre_ConyugeRef} className="form-control" />
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                    <div id="hijos">
                                        <div className="form-group">
                                            <div className="row">
                                                <div className="col-sm-2">
                                                    <label>Cantidad hijos</label>
                                                </div>
                                                <div className="col-sm-4">
                                                    <input type="number" for="eci_Cantidad_Hijos" ref={this.eci_Cantidad_HijosRef} className="form-control" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <div className="row">
                                                <div className="col-sm-2">
                                                    <label>Nombre de los hijos</label>
                                                </div>
                                                <div className="col-sm-4">
                                                    <textarea name="eci_Nombre_Hijos" ref={this.eci_Nombre_HijosRef} className="form-control" ></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <a href="#eclesiasaticos" className="btn btn-primary" onClick={this.EstadoCivilDatos}>Siguiente</a>
                                            </div>
                                        </div>
                                    </div>

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
                                                <input type="checkbox" name="per_Bautizado" ref={this.per_BautizadoRef} className="form-control" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* <Bautismo /> */}
                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Lugar bautismo</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input type="text" name="bau_Lugar_Bautismo" ref={this.bau_Lugar_BautismoRef} className="form-control" />
                                            </div>
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
                                                <input type="text" name="bau_Ministro_Que_Bautizo" ref={this.bau_Ministro_Que_BautizoRef} className="form-control" />
                                            </div>
                                        </div>
                                    </div>

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
                                                <input type="text" name="per_Bajo_Imposicion_De_Manos" ref={this.per_Bajo_Imposicion_De_ManosRef} className="form-control" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Cambios de domicilio</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input type="text" name="per_Cambios_De_Domicilio" ref={this.per_Cambios_De_DomicilioRef} className="form-control" />
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                {/* <Hogar
                                    HogarDatos={this.HogarDatos}
                                /> */}
                                <div className="tab-pane fade" id="hogar" role="tabpanel" aria-labelledby="hogar-tab">
                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Asignar a hogar</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <select name="hog_Id_Hogar" ref={this.hog_Id_HogarRef} className="form-control">
                                                    <option value="0">Selecciona un hogar</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Jerarquia</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input type="number" name="hog_Jerarquia" ref={this.hog_JerarquiaRef} className="form-control" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Nuevo hogar</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input type="checkbox" name="nvoHogar" className="form-control" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* <Domicilio /> */}
                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Calle</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input type="text" name="dom_Calle" ref={this.dom_CalleRef} className="form-control" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Numero exterior</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input type="text" name="dom_Numero_Exterior" ref={this.dom_Numero_ExteriorRef} className="form-control" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Numero interior</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input type="text" name="dom_Numero_Interior" ref={this.dom_Numero_InteriorRef} className="form-control" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Tipo subdivision</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input name="dom_Tipo_Subdivision" ref={this.dom_Tipo_SubdivisionRef} className="form-control" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Subdivision</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input type="text" name="dom_Subdivision" ref={this.dom_SubdivisionRef} className="form-control" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Localidad</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input type="text" name="dom_Localidad" ref={this.dom_LocalidadRef} className="form-control" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Municipio/Cuidad</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input type="text" name="dom_Municipio_Cuidad" ref={this.dom_Municipio_CuidadRef} className="form-control" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label for="pais_Id_Pais">Pais</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <select name="pais_Id_Pais" ref={this.pais_Id_PaisRef} className="form-control">
                                                    <option value="0">Selecciona un pais</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label for="est_Id_Estado">Estado</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <select name="est_Id_Estado" ref={this.est_Id_EstadoRef} className="form-control">
                                                    <option value="0">Selecciona un estado</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2">
                                                <label>Telefono</label>
                                            </div>
                                            <div className="col-sm-4">
                                                <input type="text" name="dom_Telefono" ref={this.dom_TelefonoRef} className="form-control" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="row">
                                            <div className="col-sm-2 offset-sm-2">
                                                <a href="/ListaDePersonal" className="btn btn-success form-control">Volver</a>
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