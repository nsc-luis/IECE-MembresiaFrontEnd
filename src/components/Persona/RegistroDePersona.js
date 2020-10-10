import React, { Component } from 'react';
import Generales from './Partials/Generales';
import FamiliaAsendente from './Partials/FamiliaAsendente';
import EstadoCivil from './Partials/EstadoCivil';
import Eclesiasticos from './Partials/Eclesiasticos';
import Hogar from './Partials/Hogar';
import VerificarNuevoRegistro from './Partials/VerificaNuevoRegistro';

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
                                    <a className="nav-link" id="verificarNuevoRegistro-tab" data-toggle="tab" href="#verificarNuevoRegistro" role="tab" aria-controls="verificarNuevoRegistro" aria-selected="true">1. Nuevo registro</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="generales-tab" data-toggle="tab" href="#generales" role="tab" aria-controls="generales" aria-selected="true">2. Generales</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="familiaAsendente-tab" data-toggle="tab" href="#familiaAsendente" role="tab" aria-controls="familiaAsendente" aria-selected="true">3. Familia asendente</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="estado-civil-tab" data-toggle="tab" href="#estado-civil" role="tab" aria-controls="estado-civil" aria-selected="true">4. Estado civil</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="eclesiasticos-tab" data-toggle="tab" href="#eclesiasticos" role="tab" aria-controls="eclesiasticos" aria-selected="true">5. Eclesiasticos</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="hogar-tab" data-toggle="tab" href="#hogar" role="tab" aria-controls="hogar" aria-selected="true">6. Hogar</a>
                                </li>
                            </ul>

                            <div className="tab-content" id="myTabContent">
                                
                                <VerificarNuevoRegistro />

                                <Generales />

                                <FamiliaAsendente />

                                <EstadoCivil />

                                <Eclesiasticos />

                                <Hogar />

                            </div>
                        </div>
                    </form>
                </div>
            </React.Fragment>
        );
    }
}

export default RegistroDePersonal;