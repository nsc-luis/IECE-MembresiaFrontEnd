import React, { Component } from 'react';
import _Domicilio from './_Domicilio';

class _Hogar extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="tab-pane fade" id="hogar" role="tabpanel" aria-labelledby="hogar-tab">
                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label for="hog_Id_Hogar">Asignar a hogar</label>
                            </div>
                            <div className="col-sm-4">
                                <select for="hog_Id_Hogar" className="form-control">
                                    <option value="0">Selecciona un hogar</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label for="nvoHogar">Nuevo hogar</label>
                            </div>
                            <div className="col-sm-4">
                                <input type="checkbox" className="form-control" />
                            </div>
                        </div>
                    </div>



                    <_Domicilio />

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
            </React.Fragment>
        );
    }
}

export default _Hogar;