import React, { Component } from 'react';

class _Domicilio extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-2">
                            <label for="Domicilio.dom_Calle">Calle</label>
                        </div>
                        <div className="col-sm-4">
                            <input for="Domicilio.per_Nombre" className="form-control" />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-2">
                            <label for="Domicilio.bau_Fecha_Bautismo">Numero exterior</label>
                        </div>
                        <div className="col-sm-4">
                            <input for="Domicilio.per_Nombre" className="form-control" />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-2">
                            <label for="Domicilio.bau_Ministro_Que_Bautizo">Numero interior</label>
                        </div>
                        <div className="col-sm-4">
                            <input for="Domicilio.per_Nombre" className="form-control" />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-2">
                            <label for="Domicilio.bau_Ministro_Que_Bautizo">Tipo subdivision</label>
                        </div>
                        <div className="col-sm-4">
                            <input for="Domicilio.per_Nombre" className="form-control" />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-2">
                            <label for="Domicilio.bau_Ministro_Que_Bautizo">Subdivision</label>
                        </div>
                        <div className="col-sm-4">
                            <input for="Domicilio.per_Nombre" className="form-control" />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-2">
                            <label for="Domicilio.bau_Ministro_Que_Bautizo">Localidad</label>
                        </div>
                        <div className="col-sm-4">
                            <input for="Domicilio.per_Nombre" className="form-control" />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-2">
                            <label for="Domicilio.bau_Ministro_Que_Bautizo">Municipio/Cuidad</label>
                        </div>
                        <div className="col-sm-4">
                            <input for="Domicilio.per_Nombre" className="form-control" />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-2">
                            <label for="pais_Id_Pais">Pais</label>
                        </div>
                        <div className="col-sm-4">
                            <select for="pais_Id_Pais" className="form-control">
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
                            <select for="est_Id_Estado" className="form-control">
                                <option value="0">Selecciona un estado</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-2">
                            <label for="dom_Telefono">Telefono</label>
                        </div>
                        <div className="col-sm-4">
                            <input for="dom_Telefono" className="form-control" />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default _Domicilio;