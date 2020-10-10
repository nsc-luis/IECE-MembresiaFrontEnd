import React, {Component} from 'react';

class Sidebar extends Component { 
    render() {
        return(
            <React.Fragment>
                {/* Sidebar */}
                <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

                    {/* Sidebar - Brand */}
                    <a className="sidebar-brand d-flex align-items-center justify-content-center" href="/">
                        <div className="sidebar-brand-icon">
                            <i className="fas fa-building"></i>
                        </div>
                        <div className="sidebar-brand-text mx-3">IECE</div>
                    </a>

                    {/* Divider */}
                    <hr className="sidebar-divider" />

                    {/* Heading */}
                    <div className="sidebar-heading">
                        Sector
                    </div>

                    {/* Nav Item - Sector
                    <li className="nav-item">
                        <a className="nav-link" href="/Sector">
                            <i className="fas fa-fw fa-place-of-worship"></i>
                            <span>Datos generales</span>
                        </a>
                    </li> */}

                    {/* Nav Item - Personal General */}
                    <li className="nav-item">
                        <a className="nav-link collapsed" href="/ListaDePersonal">
                            <i className="fas fa-fw fa-address-book"></i>
                            <span>Lista de personal</span>
                        </a>
                    </li>

                    {/* Nav Item - Personal bautizado
                    <li className="nav-item">
                        <a className="nav-link collapsed" href="/PersonalBautizado/Index">
                            <i className="fas fa-fw fa-id-card"></i>
                            <span>Personal bautizado</span>
                        </a>
                    </li> */}
                    {/* Nav Item - Personal no bautizado
                    <li className="nav-item">
                        <a className="nav-link collapsed" href="/PersonalNoBautizado/Index">
                            <i className="fas fa-fw fa-users"></i>
                            <span>Personal no bautizado</span>
                        </a>
                    </li> */}

                    {/* Divider
                    <hr className="sidebar-divider" /> */}

                    {/* Heading
                    <div className="sidebar-heading">
                        Movimientos de personal
                    </div> */}

                    {/* Nav Item - Altas Collapse Menu
                    <li className="nav-item">
                        <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseMPAltas" aria-expanded="true" aria-controls="collapsePages">
                            <i className="fas fa-fw fa-user-check"></i>
                            <span>Alta de personal</span>
                        </a>
                        <div id="collapseMPAltas" className="collapse" aria-labelledby="headingMPAltas" data-parent="#accordionSidebar">
                            <div className="bg-white py-2 collapse-inner rounded">
                                <h6 className="collapse-header">Personal bautizado:</h6>
                                <a className="collapse-item" href="#">Bautismo</a>
                                <a className="collapse-item" href="#">Cambio de domicilio</a>
                                <a className="collapse-item" href="#">Restitucion</a>
                                <h6 className="collapse-header">Personal no bautizado:</h6>
                                <a className="collapse-item" href="#">Nuevo ingreso</a>
                                <a className="collapse-item" href="#">Cambio de domicilio</a>
                                <a className="collapse-item" href="#">Reactivacion</a>
                            </div>
                        </div>
                    </li> */}

                    {/* Nav Item - Bajas Collapse Menu
                    <li className="nav-item">
                        <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapsempbajas" aria-expanded="true" aria-controls="collapsepages">
                            <i className="fas fa-fw fa-user-times"></i>
                            <span>Baja de personal</span>
                        </a>
                        <div id="collapseMPBajas" className="collapse" aria-labelledby="headingMPBajas" data-parent="#accordionSidebar">
                            <div className="bg-white py-2 collapse-inner rounded">
                                <h6 className="collapse-header">Personal bautizado:</h6>
                                <a className="collapse-item" href="#">Cambio de domicilio</a>
                                <a className="collapse-item" href="#">Defuncion</a>
                                <a className="collapse-item" href="#">Excomunion</a>
                                <h6 className="collapse-header">Personal no bautizado:</h6>
                                <a className="collapse-item" href="#">Cambio de domicilio</a>
                                <a className="collapse-item" href="#">Alejamiento</a>
                                <a className="collapse-item" href="#">Defuncion</a>
                            </div>
                        </div>
                    </li> */}

                    {/* Nav Item - Hogares
                    <li className="nav-item">
                        <a className="nav-link" href="#">
                            <i className="fas fa-fw fa-home"></i>
                            <span>Hogares</span>
                        </a>
                    </li> */}

                    {/* Divider
                    <hr className="sidebar-divider" /> */}

                    {/* Heading 
                    <div className="sidebar-heading">
                        Movimientos estadisticos
                    </div>*/}

                    {/* Nav Item - Matrimonios
                    <li className="nav-item">
                        <a className="nav-link" href="#">
                            <i className="fas fa-fw fa-user-friends"></i>
                            <span>Matrimonios</span>
                        </a>
                    </li> */}

                    {/* Nav Item - Presentaciones 
                    <li className="nav-item">
                        <a className="nav-link" href="#">
                            <i className="fas fa-fw fa-baby"></i>
                            <span>Presentaciones</span>
                        </a>
                    </li> */}

                    {/* Divider
                    <hr className="sidebar-divider" /> */}

                    {/* Heading
                    <div className="sidebar-heading">
                        Seccion de reportes
                    </div> */}

                    {/* Nav Item - Reportes Collapse Menu
                    <li className="nav-item">
                        <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseReportes" aria-expanded="true" aria-controls="collapsePages">
                            <i className="fas fa-fw fa-clipboard-list"></i>
                            <span>Reportes</span>
                        </a>
                        <div id="collapseReportes" className="collapse" aria-labelledby="headingReportes" data-parent="#accordionSidebar">
                            <div className="bg-white py-2 collapse-inner rounded">
                                <h6 className="collapse-header">Seleccione un reporte:</h6>
                                <a className="collapse-item" href="#">Membresia general</a>
                                <a className="collapse-item" href="#">Membresia bautizada</a>
                                <a className="collapse-item" href="#">Lista de hogares</a>
                                <a className="collapse-item" href="#">Informe pastoral</a>
                            </div>
                        </div>
                    </li> */}

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