import React, { Component } from 'react';

class FamiliaAsendente extends Component {

    per_Nombre_PadreRef = React.createRef();
    per_Nombre_MadreRef = React.createRef();
    per_Nombre_Abuelo_PaternoRef = React.createRef();
    per_Nombre_Abuela_PaternaRef = React.createRef();
    per_Nombre_Abuelo_MaternoRef = React.createRef();
    per_Nombre_Abuela_MaternaRef = React.createRef();

    FamiliaAsendenteDatos = () => {
        this.props.FamiliaAsendenteDatos({
            per_Nombre_Padre : this.per_Nombre_PadreRef.current.value,
            per_Nombre_Madre : this.per_Nombre_MadreRef.current.value,
            per_Nombre_Abuelo_Paterno : this.per_Nombre_Abuelo_PaternoRef.current.value,
            per_Nombre_Abuela_Paterna : this.per_Nombre_Abuela_PaternaRef.current.value,
            per_Nombre_Abuelo_Materno : this.per_Nombre_Abuelo_MaternoRef.current.value,
            per_Nombre_Abuela_Materna : this.per_Nombre_Abuela_MaternaRef.current.value
        });
    }

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
                                <input type="text" name="per_Nombre_Padre" ref={this.per_Nombre_PadreRef} className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label>Madre</label>
                            </div>
                            <div className="col-sm-4">
                                <input type="text" name="per_Nombre_Madre" ref={this.per_Nombre_MadreRef} className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label>Abuelo paterno</label>
                            </div>
                            <div className="col-sm-4">
                                <input type="text" name="per_Nombre_Abuelo_Paterno" ref={this.per_Nombre_Abuelo_PaternoRef} className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label>Abuela paterna</label>
                            </div>
                            <div className="col-sm-4">
                                <input type="text" name="per_Nombre_Abuela_Paterna" ref={this.per_Nombre_Abuela_PaternaRef} className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label>Abuelo materno</label>
                            </div>
                            <div className="col-sm-4">
                                <input type="text" name="per_Nombre_Abuelo_Materno" ref={this.per_Nombre_Abuelo_MaternoRef} className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label>Abuela materna</label>
                            </div>
                            <div className="col-sm-4">
                                <input type="text" name="per_Nombre_Abuela_Materna" ref={this.per_Nombre_Abuela_MaternaRef} className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <a href="#estado-civil" className="btn btn-primary" onClick={this.FamiliaAsendenteDatos}>Siguiente</a>
                            </div>
                        </div>
                    </div>

                </div>
            </React.Fragment>
        );
    }
}

export default FamiliaAsendente;