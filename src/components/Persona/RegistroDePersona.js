import React, { Component } from 'react';
import _Generales from './Partials/_Generales';
import _FamiliaAsendente from './Partials/_FamiliaAsendente';
import _Estado_Civil from './Partials/_Estado_Civil';
import _Eclesiasticos from './Partials/_Eclesiasticos';
import _Hogar from './Partials/_Hogar';

class RegistroDePersonal extends Component {
    render() {
        return (
            <React.Fragment>
                <h2 className="text-info">Agregar nuevo miembro</h2>

                <div className="border">
                    <form method="post">
                        <div className="container">

                            <ul className="nav nav-tabs" id="myTab" role="tablist">
                                <li className="nav-item">
                                    <a className="nav-link" id="generales-tab" data-toggle="tab" href="#generales" role="tab" aria-controls="generales" aria-selected="true">1. Generales</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="familiaAsendente-tab" data-toggle="tab" href="#familiaAsendente" role="tab" aria-controls="familiaAsendente" aria-selected="true">2. Familia asendente</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="estado-civil-tab" data-toggle="tab" href="#estado-civil" role="tab" aria-controls="estado-civil" aria-selected="true">3. Estado civil</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="eclesiasticos-tab" data-toggle="tab" href="#eclesiasticos" role="tab" aria-controls="eclesiasticos" aria-selected="true">4. Eclesiasticos</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="hogar-tab" data-toggle="tab" href="#hogar" role="tab" aria-controls="hogar" aria-selected="true">5. Hogar</a>
                                </li>
                            </ul>

                            <div className="tab-content" id="myTabContent">
                                
                                <_Generales />

                                <_FamiliaAsendente />

                                <_Estado_Civil />

                                <_Eclesiasticos />

                                <_Hogar />

                            </div>
                        </div>
                    </form>
                </div>
            </React.Fragment>
        );
    }
}

export default RegistroDePersonal;