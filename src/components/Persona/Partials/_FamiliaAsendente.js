import React, { Component } from 'react';

class _FamiliaAsendente extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="tab-pane fade" id="familiaAsendente" role="tabpanel" aria-labelledby="familiaAsendente-tab">
                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label for="Personal.per_Nombre_Padre">Padre</label>
                            </div>
                            <div className="col-sm-4">
                                <input for="Personal.per_Nombre_Padre" className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label for="Personal.per_Nombre_Madre">Madre</label>
                            </div>
                            <div className="col-sm-4">
                                <input for="Personal.per_Nombre_Madre" className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label for="Personal.per_Nombre_Abuelo_Paterno">Abuelo paterno</label>
                            </div>
                            <div className="col-sm-4">
                                <input for="Personal.per_Nombre_Abuelo_Paterno" className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label for="Personal.per_Nombre_Abuela_Paterna">Abuela paterna</label>
                            </div>
                            <div className="col-sm-4">
                                <input for="Personal.per_Nombre_Abuela_Paterna" className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label for="Personal.per_Nombre_Abuelo_Materno">Abuelo materno</label>
                            </div>
                            <div className="col-sm-4">
                                <input for="Personal.per_Nombre_Abuelo_Materno" className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label for="Personal.per_Nombre_Abuela_Materna">Abuela materna</label>
                            </div>
                            <div className="col-sm-4">
                                <input for="Personal.per_Nombre_Abuela_Materna" className="form-control" />
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default _FamiliaAsendente;