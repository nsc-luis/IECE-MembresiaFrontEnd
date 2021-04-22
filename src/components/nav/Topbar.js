import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

class Topbar extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    emailUser = localStorage.getItem('emailUser');

    handleLogoff = () => {
        localStorage.clear();
        document.location.href = '/Signin/';
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
                                <span className="mr-2 d-none d-lg-inline text-gray-600 small">{this.emailUser}</span>
                                <img className="img-profile rounded-circle" alt="User info" src="https://source.unsplash.com/QAB-WJcbgJk/60x60" />
                            </a>
                            {/* Dropdown - User Information */}
                            <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
                                <Link to="" className="dropdown-item">
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
                {/* Logout Modal*/}
                <div className="modal fade" id="logoutModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Ready to Leave?</h5>
                                <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div className="modal-body">Select "Logout" below if you are ready to end your current session.</div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                                <button className="btn btn-primary" onClick={this.handleLogoff}>Logout</button>
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