import React, { Component } from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

class Estado_Civil extends Component {

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
                                <select name="per_Categoria" className="form-control">
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
                                <input type="tet" name="per_Nombre" className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label>Apellido paterno</label>
                            </div>
                            <div className="col-sm-4">
                                <input type="text" name="per_Apellido_Paterno" className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label>Apellido materno</label>
                            </div>
                            <div className="col-sm-4">
                                <input type="text" name="per_Apellido_Materno" className="form-control" />
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
                </div>
            </React.Fragment>
        );
    }
}

export default Estado_Civil;