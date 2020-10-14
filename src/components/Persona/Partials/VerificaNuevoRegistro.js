import React, { Component } from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

class Estado_Civil extends Component {

    per_NombreRef = React.createRef();
    per_CategoriaRef = React.createRef();
    per_Apellido_PaternoRef = React.createRef();
    per_Apellido_MaternoRef = React.createRef();

    VerificarNuevoRegistroDatos = () => {
        this.props.VerificarNuevoRegistroDatos({
            per_Nombre : this.per_NombreRef.current.value,
            per_Categoria : this.per_CategoriaRef.current.value,
            per_Apellido_Paterno : this.per_Apellido_PaternoRef.current.value,
            per_Apellido_Materno : this.per_Apellido_MaternoRef.current.value
        });
    }

    render() {
        return (
            <React.Fragment>
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
            </React.Fragment>
        );
    }
}

export default Estado_Civil;