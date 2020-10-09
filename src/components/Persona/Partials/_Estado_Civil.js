import React, { Component } from 'react';
import _Matrimonio from './_Matrimonio';

class _Estado_Civil extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="tab-pane fade" id="estado-civil" role="tabpanel" aria-labelledby="estado-civil-tab">
                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label for="Personal.per_Estado_Civil">Estado civil</label>
                            </div>
                            <div className="col-sm-4">
                                <select for="Personal.per_Estado_Civil" className="form-control">
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

                    <_Matrimonio />

                </div>
            </React.Fragment>
        );
    }
}

export default _Estado_Civil;