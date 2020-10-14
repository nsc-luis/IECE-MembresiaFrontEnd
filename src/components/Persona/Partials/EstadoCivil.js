import React, { Component } from 'react';
import Matrimonio from './Matrimonio';

class EstadoCivil extends Component {

    per_Estado_CivilRef = React.createRef();

    EstadoCivilDatos = () => {
        this.props.EstadoCivilDatos({
            per_Estado_Civil: this.per_Estado_CivilRef.current.value
        });
    }

    render() {
        return (
            <React.Fragment>
                <div className="tab-pane fade" id="estado-civil" role="tabpanel" aria-labelledby="estado-civil-tab">
                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label>Estado civil</label>
                            </div>
                            <div className="col-sm-4">
                                <select name="per_Estado_Civil" ref={this.per_Estado_CivilRef} className="form-control">
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

                    <Matrimonio
                        MatrimonioDatos = {this.MatrimonioDatos}
                    />

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <a href="#eclesiasaticos" className="btn btn-primary" onClick={this.EstadoCivilDatos}>Siguiente</a>
                            </div>
                        </div>
                    </div>

                </div>
            </React.Fragment>
        );
    }
}

export default EstadoCivil;