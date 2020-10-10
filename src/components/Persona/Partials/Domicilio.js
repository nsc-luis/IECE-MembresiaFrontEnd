import React, { Component } from 'react';

class Domicilio extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-2">
                            <label>Calle</label>
                        </div>
                        <div className="col-sm-4">
                            <input type="text" name="dom_Calle" className="form-control" />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-2">
                            <label>Numero exterior</label>
                        </div>
                        <div className="col-sm-4">
                            <input type="text" name="dom_Numero_Exterior" className="form-control" />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-2">
                            <label>Numero interior</label>
                        </div>
                        <div className="col-sm-4">
                            <input type="text" name="dom_Numero_Interior" className="form-control" />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-2">
                            <label>Tipo subdivision</label>
                        </div>
                        <div className="col-sm-4">
                            <input name="dom_Tipo_Subdivision" className="form-control" />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-2">
                            <label>Subdivision</label>
                        </div>
                        <div className="col-sm-4">
                            <input type="text" name="dom_Subdivision" className="form-control" />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-2">
                            <label>Localidad</label>
                        </div>
                        <div className="col-sm-4">
                            <input type="text" name="dom_Localidad" className="form-control" />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-2">
                            <label>Municipio/Cuidad</label>
                        </div>
                        <div className="col-sm-4">
                            <input type="text" name="dom_Municipio_Cuidad" className="form-control" />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-2">
                            <label for="pais_Id_Pais">Pais</label>
                        </div>
                        <div className="col-sm-4">
                            <select name="pais_Id_Pais" className="form-control">
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
                            <select name="est_Id_Estado" className="form-control">
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
                            <input type="text" name="dom_Telefono" className="form-control" />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Domicilio;