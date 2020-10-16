import React, { Component } from 'react';

class Generales2 extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="card border-info text-center">
                    <div className="card-header">
                        <h5><strong>Datos generales</strong></h5>
                    </div>
                    <div className="card-body p-3">
                        Estos son los datos generales de la persona. <br />
                    </div>
                    <button className="btn btn-sm btn-secondary" onClick={this.abrirModal}>Cerrar</button>
                </div>
            </React.Fragment>
        );
    }
}

export default Generales2;