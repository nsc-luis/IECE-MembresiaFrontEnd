import React, { Component } from 'react';

class Generales extends Component {

    pro_Id_Profesion_Oficio1Ref = React.createRef();
    pro_Id_Profesion_Oficio2Ref = React.createRef();
    per_Telefono_FijoRef = React.createRef();
    per_Email_PersonalRef = React.createRef();
    per_ObservacionesRef = React.createRef();

    GeneralesDatos = () => {
        this.props.GeneralesDatos({
            pro_Id_Profesion_Oficio1 : this.pro_Id_Profesion_Oficio1Ref.current.value,
            pro_Id_Profesion_Oficio2 : this.pro_Id_Profesion_Oficio2Ref.current.value,
            per_Telefono_Fijo : this.per_Telefono_FijoRef.current.value,
            per_Email_Personal : this.per_Email_PersonalRef.current.value,
            per_Observaciones : this.per_ObservacionesRef.current.value
        });
    }

    render() {
        return (
            <React.Fragment>
                <div className="tab-pane fade" id="generales" role="tabpanel" aria-labelledby="generales-tab">
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

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <a href="#familiaAsendente" className="btn btn-primary" onClick={this.GeneralesDatos}>Siguiente</a>
                            </div>
                        </div>
                    </div>

                </div>
            </React.Fragment>
        );
    }
}

export default Generales;