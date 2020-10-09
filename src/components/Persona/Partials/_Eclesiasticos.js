import React, { Component } from 'react';
import _Bautismo from './_Bautismo';

class _Eclesiasticos extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="tab-pane fade" id="eclesiasticos" role="tabpanel" aria-labelledby="eclesiasticos-tab">
                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-3">
                                <label for="Personal.per_Bautizado">Bautizado</label>
                            </div>
                            <div className="col-sm-2">
                                <input type="checkbox" for="Personal.per_Bautizado" className="form-control" />
                            </div>
                        </div>
                    </div>

                    <_Bautismo />

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-3">
                                <label for="Personal.per_Fecha_Recibio_Espiritu_Santo">Fecha recibio Espiritu Santo</label>
                            </div>
                            <div className="col-sm-4">
                                <input for="Personal.per_Fecha_Recibio_Espiritu_Santo" className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-3">
                                <label for="Personal.per_Bajo_Imposicion_De_Manos">Bajo imposicion de manos</label>
                            </div>
                            <div className="col-sm-4">
                                <input for="Personal.per_Bajo_Imposicion_De_Manos" className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-3">
                                <label for="Personal.per_Cambios_De_Domicilio">Cambios de domicilio</label>
                            </div>
                            <div className="col-sm-4">
                                <input for="Personal.per_Cambios_De_Domicilio" className="form-control" />
                            </div>
                        </div>
                    </div>

                </div>
            </React.Fragment>
        );
    }
}

export default _Eclesiasticos;