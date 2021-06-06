import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

class Topbar extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }
    infoSesion = JSON.parse(localStorage.getItem('infoSesion'));

    handleLogoff = () => {
        localStorage.clear();
        document.location.href = '/';
    }

    render() {
        return (
            <React.Fragment>
                {/* Topbar */}
                <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

                    {/* Sidebar Toggle (Topbar) */}
                    <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
                        <i className="fa fa-bars"></i>
                    </button>

                    {/* Topbar Navbar */}
                    <ul className="navbar-nav ml-auto">

                        <div className="topbar-divider d-none d-sm-block"></div>

                        {/* Nav Item - User Information */}
                        <li className="nav-item dropdown no-arrow">
                            <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span className="mr-2 d-none d-lg-inline text-gray-600 small">{this.infoSesion.pem_Nombre}</span>
                                <img className="img-profile rounded-circle" alt="User info" src="https://source.unsplash.com/QAB-WJcbgJk/60x60" />
                            </a>
                            {/* Dropdown - User Information */}
                            <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
                                <Link to="/Main" className="dropdown-item" data-toggle="modal" data-target="#perfilModal">
                                    <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                                    Perfil
                                </Link>
                                <div className="dropdown-divider"></div>
                                <Link to="" className="dropdown-item" data-toggle="modal" data-target="#logoutModal">
                                    <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                    Cerrar sesion
                                </Link>
                            </div>
                        </li>

                    </ul>

                </nav>
                {/* End of Topbar */}

                {/* Perfil Modal*/}
                <div className="modal fade" id="perfilModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Información del usuario</h5>
                                <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <strong>Usuario: </strong>{this.infoSesion.email} <br />
                                <strong>Nombre: </strong>{this.infoSesion.pem_Nombre} <br />
                                <strong>Grado: </strong>{this.infoSesion.pem_Grado_Ministerial} <br />
                                <strong>Correo personal:</strong> {this.infoSesion.pem_email_Personal} <br />
                                <strong>Telefono1: </strong>{this.infoSesion.pem_Cel1} <br />
                                <strong>Telefono2: </strong>{this.infoSesion.pem_Cel2}
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" type="button" data-dismiss="modal">Cancelar</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* End Logout Modal*/}

                {/* Logout Modal*/}
                <div className="modal fade" id="logoutModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">¿Listo para salir?</h5>
                                <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div className="modal-body">Selecciona "Cerrar sesión" si quieres finalizar la sesión actual.</div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" type="button" data-dismiss="modal">Cancelar</button>
                                <button className="btn btn-primary" onClick={this.handleLogoff}>Cerrar sesión</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* End Logout Modal*/}
                {/* Begin Page Content */}
                <div className="container-fluid"></div>
            </React.Fragment>
        );
    }

}

export default Topbar;