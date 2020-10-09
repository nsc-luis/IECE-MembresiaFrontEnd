import React, { Component } from 'react';

class PaginaNoEncontrada extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="content text-center">
                    <div className="row">
                        <div className="col-md-12 auto-mx">
                            <h1>Error 404</h1>
                            <h3>La pagina a la que intentas acceder no existe.</h3>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default PaginaNoEncontrada;