import React, { Component } from 'react';

class _Bautismo extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-2">
                            <label for="Bautismo.bau_Lugar_Bautismo">Lugar bautismo</label>
                        </div>
                        <div className="col-sm-4">
                            <input for="Bautismo.per_Nombre" className="form-control" />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-2">
                            <label for="Bautismo.bau_Fecha_Bautismo">Fecha bautismo</label>
                        </div>
                        <div className="col-sm-4">
                            <input for="Bautismo.per_Nombre" className="form-control" />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-2">
                            <label for="Bautismo.bau_Ministro_Que_Bautizo">Ministro que bautizo</label>
                        </div>
                        <div className="col-sm-4">
                            <input for="Bautismo.per_Nombre" className="form-control" />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default _Bautismo;