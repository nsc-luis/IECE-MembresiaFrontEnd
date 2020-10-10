import React, { Component } from 'react';

class FamiliaAsendente extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="tab-pane fade" id="familiaAsendente" role="tabpanel" aria-labelledby="familiaAsendente-tab">
                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label>Padre</label>
                            </div>
                            <div className="col-sm-4">
                                <input type="text" name="per_Nombre_Padre" className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label>Madre</label>
                            </div>
                            <div className="col-sm-4">
                                <input type="text" name="per_Nombre_Madre" className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label>Abuelo paterno</label>
                            </div>
                            <div className="col-sm-4">
                                <input type="text" name="per_Nombre_Abuelo_Paterno" className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label>Abuela paterna</label>
                            </div>
                            <div className="col-sm-4">
                                <input type="text" name="per_Nombre_Abuela_Paterna" className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label>Abuelo materno</label>
                            </div>
                            <div className="col-sm-4">
                                <input type="text" name="per_Nombre_Abuelo_Materno" className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label>Abuela materna</label>
                            </div>
                            <div className="col-sm-4">
                                <input type="text" name="per_Nombre_Abuela_Materna" className="form-control" />
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default FamiliaAsendente;