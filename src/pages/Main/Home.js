import React/* , { Component } */ from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/index.css';
import helpers from '../../components/Helpers';

const Home = () => {
    return (
        <React.Fragment>
            <div className="row p-4 mx-auto">
                <div className="col-3">
                    <div className="card border-info text-center acceso-directo">
                        <div className="card-header">
                            <h5><strong>Personal</strong></h5>
                        </div>
                        <div className="card-body p-3">
                            <img src="./images/personas.png" alt="Acceso a listado de personal" className="mx-auto card-img-top imgHome" />
                            <br />
                                Acceso rapido a operaciones con el personal en general. <br />
                            <Link to="/ListaDePersonal" className="btn btn-sm btn-primary">Ingresar</Link>
                        </div>
                    </div>
                </div>
                <div className="col-3">
                    <div className="card border-info text-center acceso-directo">
                        <div className="card-header">
                            <h5><strong>Registro</strong></h5>
                        </div>
                        <div className="card-body p-3 luis">
                            <img src="./images/AddPerson.png" alt="Acceso a registro de personal" className="mx-auto card-img-top imgHome" />
                            <br />
                                Acceso rapido a registro de pesonas en general. <br />
                            <Link to="#" onClick={helpers.handle_RegistroNvaPersona} className="btn btn-sm btn-primary">Ingresar</Link>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default Home;