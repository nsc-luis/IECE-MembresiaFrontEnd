import React, { Component } from 'react';

class _Estado_Civil extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="tab-pane fade show active" id="verificarNuevoRegistro" role="tabpanel" aria-labelledby="verificarNuevoRegistro-tab">
                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label for="Personal.per_Categoria">Categoria</label>
                            </div>
                            <div className="col-sm-4">
                                <select for="Personal.per_Categoria" className="form-control">
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
                </div>
            </React.Fragment>
        );
    }
}

export default _Estado_Civil;