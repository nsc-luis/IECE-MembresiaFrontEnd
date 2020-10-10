import React, { Component } from 'react';
import Domicilio from './Domicilio';

class Hogar extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="tab-pane fade" id="hogar" role="tabpanel" aria-labelledby="hogar-tab">
                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label>Asignar a hogar</label>
                            </div>
                            <div className="col-sm-4">
                                <select name="hog_Id_Hogar" className="form-control">
                                    <option value="0">Selecciona un hogar</option>
                                </select>
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



                    <Domicilio />

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

export default Hogar;