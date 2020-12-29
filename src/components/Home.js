import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/Home.css';

class Home extends Component {
    render() {
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
                                <Link to="/RegistroDePersonal" className="btn btn-sm btn-primary">Ingresar</Link>
                            </div>
                        </div>
                    </div>
                    {/*<div className="col-sm-3">
                        <div className="card border-info text-center acceso-directo">
                            <div className="card-header">
                                <h5><strong>Alta de personal</strong></h5>
                            </div>
                            <div className="card-body p-3">
                                <img src="../assets/images/addPerson.png" alt="Agrega personal a la membresia" className="mx-auto card-img-top imgHome" />
                Acceso rapido al alta de personal. <br />
                                <a href="#" className="btn btn-sm btn-primary">Ingresar</a>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-3">
                        <div className="card border-info text-center acceso-directo">
                            <div className="card-header">
                                <h5><strong>Hogares</strong></h5>
                            </div>
                            <div className="card-body p-3">
                                <img src="../assets/images/hogares.png" alt="Operaciones con hogares" className="mx-auto card-img-top imgHome" />
                Acceso rapido a operaciones con los hogares. <br />
                                <a href="#" className="btn btn-sm btn-primary">Ingresar</a>
                            </div>
                        </div>
                    </div> */}
                </div>
            </React.Fragment>
        );
    }
}

export default Home;