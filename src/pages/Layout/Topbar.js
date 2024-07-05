import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import helpers from '../../components/Helpers'
import './style.css'
import { Button } from 'reactstrap';
import axios from 'axios';




class Topbar extends Component {

    urlapi = helpers.url_api;

    constructor(props) {
        super(props);
        this.state = {
            fotoMinistro: "",
            manual: ""
        };
    }

    componentDidMount() {
        this.getfotoMinistro();
    }

    infoSesion = JSON.parse(localStorage.getItem('infoSesion'));

    handleLogoff = () => {
        localStorage.clear();
        document.location.href = '/';
    }

    getfotoMinistro = async () => {

        await helpers.validaToken().then(helpers.authAxios.get(helpers.url_api + '/Foto/FotoMinistro/' + this.infoSesion.pem_Id_Ministro)
            .then(res => {
                if (res.data.status !== "error") {
                    this.setState({ fotoMinistro: helpers.url_api + "/Foto/FotoMinistro/" + this.infoSesion.pem_Id_Ministro });

                } else {
                    this.setState({ fotoMinistro: "https://source.unsplash.com/QAB-WJcbgJk/60x60" })
                }
            })
        );
    }

    handleDownloadManualUsuario = async () => {

        axios({
            url: helpers.url_api + "/Archivos/ManualDeUsuario",
            method: 'GET',
            responseType: 'blob'
        })
            .then(res => {
                // Crear una URL temporal con el objeto Blob
                const url = window.URL.createObjectURL(new Blob([res.data]));

                // Crear un elemento <a> para descargar el archivo
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Manual_De_Usuario_Aplicacion_IECE_Membresia.pdf');
                document.body.appendChild(link);

                // Simular un clic en el enlace para iniciar la descarga
                link.click();

                // Eliminar el elemento <a> después de la descarga
                link.parentNode.removeChild(link);

                // Liberar la URL temporal
                window.URL.revokeObjectURL(url);
            });
    }


    render() {
        return (
            <React.Fragment>
                {/* Topbar */}
                <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                    <h5><span className="text-TopBar">
                        {localStorage.getItem('seccion')} <br />
                        <strong>{localStorage.getItem('componente')}</strong>
                    </span></h5>

                    {/* Sidebar Toggle (Topbar) */}
                    <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
                        <i className="fa fa-bars"></i>
                    </button>


                    <button onClick={this.handleDownloadManualUsuario} className="ml-auto text-TopBar text-center border-0 bg-transparent">
                        <div className='lead'><i className="fas fa-fw fa-file-download pb-0"></i></div>
                        <div className="p-0">Manual de Usuario</div>
                    </button>

                    {/* Topbar Navbar */}
                    <ul className="navbar-nav ml-w-auto">
                        <div className="topbar-divider d-none d-sm-block"></div>

                        {/* Nav Item - User Information */}
                        <li className="nav-item dropdown no-arrow">
                            <button className="nav-link dropdown-toggle border-0 bg-transparent text-left" href="#" id="userDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span className="mr-2 d-none d-lg-inline text-TopBar ">
                                    {this.infoSesion.pem_Nombre} <br />
                                    {localStorage.getItem('sector') === null && localStorage.getItem('dto') !== null && 'OBISPO'}
                                    {localStorage.getItem('sector') !== null && 'PASTOR'}
                                    {this.infoSesion.dg === true && 'DIRECTIVO'}
                                </span>
                                <img className="img-profile rounded-circle" alt="foto usuario" src={this.state.fotoMinistro} />
                            </button>
                            {/* Dropdown - User Information */}
                            <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
                                <Link to="/Main" className="dropdown-item" data-toggle="modal" data-target="#perfilModal">
                                    <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                                    Perfil
                                </Link>
                                <div className="dropdown-divider"></div>
                                <Link to="" className="dropdown-item" data-toggle="modal" data-target="#logoutModal">
                                    <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                    Cerrar Sesión
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
                                <strong>Tel.  1: </strong>{this.infoSesion.pem_Cel1} <br />
                                <strong>Tel. 2: </strong>{this.infoSesion.pem_Cel2}
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" type="button" data-dismiss="modal">OK</button>
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
                            <div className="modal-body">Seleccione "Cerrar Sesión" si quiere finalizar la Sesión actual.</div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" type="button" data-dismiss="modal">Cancelar</button>
                                <button className="btn btn-primary" onClick={this.handleLogoff}>Cerrar Sesión</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* End Logout Modal*/}
                {/* Begin Page Content */}
                <div className="container-fluid"></div>
            </React.Fragment >
        );
    }

}

export default Topbar;