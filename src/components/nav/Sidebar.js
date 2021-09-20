import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import helpers from '.././/Helpers';

class Sidebar extends Component { 
    render() {
        return(
            <React.Fragment>
                {/* Sidebar */}
                <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

                    {/* Sidebar - Brand */}
                    <Link className="sidebar-brand d-flex align-items-center justify-content-center" to="/Main">
                        <div className="sidebar-brand-icon">
                            <i className="fas fa-building"></i>
                        </div>
                        <div className="sidebar-brand-text mx-3">IECE</div>
                    </Link>

                    {/* Divider */}
                    <hr className="sidebar-divider" />

                    {/* Heading */}
                    <div className="sidebar-heading">
                        Sector
                    </div>

                    {/* Nav Item - Sector
                    <li className="nav-item">
                        <Link className="nav-link" to="/Sector">
                            <i className="fas fa-fw fa-place-of-worship"></i>
                            <span>Datos generales</span>
                        </Link>
                    </li> */}

                    {/* Nav Item - Personal General */}
                    <li className="nav-item">
                        <Link className="nav-link collapsed" to="/ListaDePersonal">
                            <i className="fas fa-fw fa-address-book"></i>
                            <span>Lista de personal</span>
                        </Link>
                    </li>

                    <li className="nav-item">
                        {/* <Link className="nav-link collapsed" to="/RegistroDePersona"> */}
                        <Link className="nav-link collapsed" to="#" onClick={helpers.handle_RegistroNvaPersona}>
                            <i className="fas fa-fw fa-id-card"></i>
                            <span>Regitrar miembro</span>
                        </Link>
                    </li>

                    {/* Nav Item - Personal bautizado */}
                    <li className="nav-item">
                        <Link className="nav-link collapsed" to="/PersonalBautizado/Index">
                            <i className="fas fa-fw fa-id-card"></i>
                            <span>Personal bautizado</span>
                        </Link>
                    </li>
                    {/* Nav Item - Personal no bautizado */}
                    <li className="nav-item">
                        <Link className="nav-link collapsed" to="/PersonalNoBautizado/Index">
                            <i className="fas fa-fw fa-users"></i>
                            <span>Personal no bautizado</span>
                        </Link>
                    </li>

                    {/* Divider */}
                    <hr className="sidebar-divider" />

                    {/* Heading */}
                    <div className="sidebar-heading">
                        Movimientos de personal
                    </div>

                    {/* Nav Item - Altas Collapse Menu */}
                    <li className="nav-item">
                        <Link className="nav-link collapsed" to="#" data-toggle="collapse" data-target="#collapseMPAltas" aria-expanded="true" aria-controls="collapsePages">
                            <i className="fas fa-fw fa-user-check"></i>
                            <span>Alta de personal</span>
                        </Link>
                        <div id="collapseMPAltas" className="collapse" aria-labelledby="headingMPAltas" data-parent="#accordionSidebar">
                            <div className="bg-white py-2 collapse-inner rounded">
                                <h6 className="collapse-header">Personal bautizado:</h6>
                                <Link className="collapse-item" to="#">Bautismo</Link>
                                <Link className="collapse-item" to="#">Cambio de domicilio</Link>
                                <Link className="collapse-item" to="#">Restitución</Link>
                                <h6 className="collapse-header">Personal no bautizado:</h6>
                                <Link className="collapse-item" to="#">Nuevo ingreso</Link>
                                <Link className="collapse-item" to="#">Cambio de domicilio</Link>
                                <Link className="collapse-item" to="#">Reactivación</Link>
                            </div>
                        </div>
                    </li>

                    {/* Nav Item - Bajas Collapse Menu */}
                    <li className="nav-item">
                        <Link className="nav-link collapsed" to="#" data-toggle="collapse" data-target="#collapsempbajas" aria-expanded="true" aria-controls="collapsepages">
                            <i className="fas fa-fw fa-user-times"></i>
                            <span>Baja de personal</span>
                        </Link>
                        <div id="collapseMPBajas" className="collapse" aria-labelledby="headingMPBajas" data-parent="#accordionSidebar">
                            <div className="bg-white py-2 collapse-inner rounded">
                                <h6 className="collapse-header">Personal bautizado:</h6>
                                <Link className="collapse-item" to="#">Cambio de domicilio</Link>
                                <Link className="collapse-item" to="#">Defuncion</Link>
                                <Link className="collapse-item" to="#">Excomunion</Link>
                                <h6 className="collapse-header">Personal no bautizado:</h6>
                                <Link className="collapse-item" to="#">Cambio de domicilio</Link>
                                <Link className="collapse-item" to="#">Alejamiento</Link>
                                <Link className="collapse-item" to="#">Defuncion</Link>
                            </div>
                        </div>
                    </li>

                    {/* Nav Item - Hogares */}
                    <li className="nav-item">
                        <Link className="nav-link" to="/Hogar">
                            <i className="fas fa-fw fa-home"></i>
                            <span>Hogares</span>
                        </Link>
                    </li>

                    {/* Divider */}
                    <hr className="sidebar-divider" />

                    {/* Heading */}
                    <div className="sidebar-heading">
                        Movimientos estadisticos
                    </div>

                    {/* Nav Item - Matrimonios */}
                    <li className="nav-item">
                        <Link className="nav-link" to="#">
                            <i className="fas fa-fw fa-user-friends"></i>
                            <span>Matrimonios</span>
                        </Link>
                    </li>

                    {/* Nav Item - Presentaciones  */}
                    <li className="nav-item">
                        <Link className="nav-link" to="#">
                            <i className="fas fa-fw fa-baby"></i>
                            <span>Presentaciones</span>
                        </Link>
                    </li>

                    {/* Divider */}
                    <hr className="sidebar-divider" />

                    {/* Heading */}
                    <div className="sidebar-heading">
                        Seccion de reportes
                    </div>

                    {/* Nav Item - Reportes Collapse Menu */}
                    <li className="nav-item">
                        <Link className="nav-link collapsed" to="#" data-toggle="collapse" data-target="#collapseReportes" aria-expanded="true" aria-controls="collapsePages">
                            <i className="fas fa-fw fa-clipboard-list"></i>
                            <span>Reportes</span>
                        </Link>
                        <div id="collapseReportes" className="collapse" aria-labelledby="headingReportes" data-parent="#accordionSidebar">
                            <div className="bg-white py-2 collapse-inner rounded">
                                <h6 className="collapse-header">Seleccione un reporte:</h6>
                                <Link className="collapse-item" to="#">Membresía general</Link>
                                <Link className="collapse-item" to="#">Membresía bautizada</Link>
                                <Link className="collapse-item" to="#">Lista de hogares</Link>
                                <Link className="collapse-item" to="#">Informe pastoral</Link>
                            </div>
                        </div>
                    </li>

                    {/* Divider */
                    <hr className="sidebar-divider d-none d-md-block" />}

                    {/* Sidebar Toggler (Sidebar) */}
                    <div className="text-center d-none d-md-inline">
                        <button className="rounded-circle border-0" id="sidebarToggle"></button>
                    </div>

                </ul>
                {/* End of Sidebar */}
            </React.Fragment>
        );
    }
}
export default Sidebar;