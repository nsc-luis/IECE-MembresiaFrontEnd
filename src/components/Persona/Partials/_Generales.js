import React, { Component } from 'react';

class _Generales extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="tab-pane fade show active" id="generales" role="tabpanel" aria-labelledby="generales-tab">
                    {/* <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label for="Personal.sec_Id_Sector"></label>
                            </div>
                            <div className="col-sm-4">
                                <select for="Personal.sec_Id_Sector" className="form-control">
                                    <option value="0">Selecciona un sector</option>
                                </select>
                            </div>
                            <span asp-validation-for="Personal.sec_Id_Sector" className="text-danger"></span>
                        </div>
                    </div> */}

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label for="Personal.per_Categoria">Categoria</label>
                            </div>
                            <div className="col-sm-4">
                                <select for="Personal.per_Categoria" className="form-control">
                                    <option value="hombre_bautizado">Hombre bautizado</option>
                                    <option value="mujer_bautizada">Mujer bautizado</option>
                                    <option value="joven_hombre_bautizado">Joven hombre bautizado</option>
                                    <option value="joven_mujer_bautizado">Joven mujer bautizado</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label for="Personal.per_Nombre">Nombre</label>
                            </div>
                            <div className="col-sm-4">
                                <input for="Personal.per_Nombre" className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label for="Personal.per_Apellido_Paterno">Apellido paterno</label>
                            </div>
                            <div className="col-sm-4">
                                <input for="Personal.per_Apellido_Paterno" className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label for="Personal.per_Apellido_Materno">Apellido materno</label>
                            </div>
                            <div className="col-sm-4">
                                <input for="Personal.per_Apellido_Materno" className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label for="Personal.per_Fecha_Nacimiento">Fecha nacimiento</label>
                            </div>
                            <div className="col-sm-4">
                                <input for="Personal.per_Fecha_Nacimiento" className="form-control" />
                            </div>
                        </div>
                    </div>

                    {/* <div className="form-group">
                        <div className="row">

                            <div className="col-sm-2">
                                <label for="Personal.per_Vivo"></label>
                            </div>
                            <div className="col-sm-2">
                                <input type="checkbox" for="Personal.per_Vivo" className="form-control" />
                            </div>
                            <span asp-validation-for="Personal.per_Vivo" className="text-danger"></span>

                            <div className="col-sm-2">
                                <label for="Personal.per_Activo"></label>
                            </div>
                            <div className="col-sm-2">
                                <input type="checkbox" for="Personal.per_Activo" className="form-control" />
                            </div>
                            <span asp-validation-for="Personal.per_Activo" className="text-danger"></span>

                            <div className="col-sm-2">
                                <label for="Personal.per_En_Comunion"></label>
                            </div>
                            <div className="col-sm-2">
                                <input type="checkbox" for="Personal.per_En_Comunion" className="form-control" />
                            </div>
                        </div>
                    </div> */}

                    

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label for="Personal.pro_Id_Profesion_Oficio1">Profesion oficio1</label>
                            </div>
                            <div className="col-sm-4">
                                <select for="Personal.pro_Id_Profesion_Oficio1" className="form-control">
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
                                <select for="Personal.pro_Id_Profesion_Oficio2" className="form-control">
                                    <option value="0">Selecciona un sector</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label for="Personal.per_Telefono_Fijo">Telefono fijo</label>
                            </div>
                            <div className="col-sm-4">
                                <input for="Personal.per_Telefono_Fijo" className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label for="Personal.per_Telefono_Movil">Telefono movil</label>
                            </div>
                            <div className="col-sm-4">
                                <input for="Personal.per_Telefono_Movil" className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label for="Personal.per_Email_Personal">Email</label>
                            </div>
                            <div className="col-sm-4">
                                <input for="Personal.per_Email_Personal" className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label for="Personal.per_foto">Foto</label>
                            </div>
                            <div className="col-sm-4">
                                <input type="file" for="Personal.per_foto" className="form-control" />
                            </div>
                        </div>
                    </div>

                    {/* <div className="form-group">
                        <div className="row">

                            <div className="col-sm-2">
                                <label for="Personal.per_Visibilidad_Abierta"></label>
                            </div>
                            <div className="col-sm-2">
                                <input type="checkbox" for="Personal.per_Visibilidad_Abierta" className="form-control" />
                            </div>
                            <span asp-validation-for="Personal.per_Visibilidad_Abierta" className="text-danger"></span>

                            <div className="col-sm-2">
                                <label for="Personal.per_Solicitud_De_Traslado"></label>
                            </div>
                            <div className="col-sm-2">
                                <input type="checkbox" for="Personal.per_Solicitud_De_Traslado" className="form-control" />
                            </div>
                            <span asp-validation-for="Personal.per_Solicitud_De_Traslado" className="text-danger"></span>
                        </div>
                    </div> */}
                </div>
            </React.Fragment>
        );
    }
}

export default _Generales;