import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import helpers from '../../components/Helpers';

class SidebarObispo extends Component {
    // infoSesion = JSON.parse(localStorage.getItem('infoSesion'));

    handle_LinkEncabezado = (seccion, componente) => {
        localStorage.setItem('seccion', seccion);
        localStorage.setItem('componente', componente);
    }

    render() {
        return (
            <React.Fragment>
                {/* Sidebar */}
                <ul className="navbar-nav bg-SideBar sidebar sidebar-dark accordion" id="accordionSidebar">

                    {/* Sidebar - Brand */}
                    <Link
                        className="sidebar-brand d-flex align-items-center justify-content-center"
                        to="/Main"
                        onClick={() => this.handle_LinkEncabezado("", "")}
                    >
                        <div className="sidebar-brand-icon">
                            <i className="fas fa-building"></i>
                        </div>
                        <div className="sidebar-brand-text mx-3">IECE</div>
                    </Link>
                    <div className="text-center" style={{ fontSize: '0.8rem', color: '#fff' }}>
                        Versión {helpers.version}
                    </div>

                    {/* Divider */}
                    <hr className="sidebar-divider" />

                    {/* Heading */}
                    <div className="sidebar-heading">
                        Monitoreo
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
                        <Link
                            className="nav-link collapsed"
                            to="/ResumenMembresia"
                            onClick={() => this.handle_LinkEncabezado("Sección: Monitoreo", "Resumen de membresía actual")}
                        >
                            <i className="fas fa-fw fa-address-book"></i>
                            <span>Resumen de Membresía Actual</span>
                        </Link>
                    </li>

                    {/* Nav Item - Hogares */}
                    <li className="nav-item">
                        <Link
                            className="nav-link"
                            to="/ListaDePersonal"
                            onClick={() => this.handle_LinkEncabezado("Sección: Monitoreo", "Análisis de membresía")}
                        >
                            <i className="fas fa-fw fa-home"></i>
                            <span>Análisis de Membresía</span>
                        </Link>
                    </li>

                    {/* Nav Item - Info. del sector */}
                    {/* <li className="nav-item">
                        <Link className="nav-link" to="/Sector">
                            <i className="fas fa-fw fa-place-of-worship"></i>
                            <span>Info. del sector</span>
                        </Link>
                    </li> */}

                    {/* <li className="nav-item"> */}
                    {/* <Link className="nav-link collapsed" to="/RegistroDePersona">
                        <Link className="nav-link collapsed" to="#" onClick={helpers.handle_RegistroNvaPersona}>
                            <i className="fas fa-fw fa-id-card"></i>
                            <span>Regitrar miembro</span>
                        </Link>
                    </li> */}

                    {/* Nav Item - Personal bautizado */}
                    {/* <li className="nav-item">
                        <Link className="nav-link collapsed" to="/PersonalBautizado/Index">
                            <i className="fas fa-fw fa-id-card"></i>
                            <span>Personal bautizado</span>
                        </Link>
                    </li> */}

                    {/* Nav Item - Personal no bautizado */}
                    {/* <li className="nav-item">
                        <Link className="nav-link collapsed" to="/PersonalNoBautizado/Index">
                            <i className="fas fa-fw fa-users"></i>
                            <span>Personal no bautizado</span>
                        </Link>
                    </li> */}

                    {/* Divider */}
                    <hr className="sidebar-divider" />

                    {/* Heading */}
                    <div className="sidebar-heading">
                        Transacciones Especiales
                    </div>

                    <li className="nav-item">
                        <Link className="nav-link collapsed" to="#" data-toggle="collapse" data-target="#collapseAdministrativo" aria-expanded="true" aria-controls="collapsePages">
                            <i className="fas fa-user-tie"></i>
                            <span>Personal Administrativo y Comisiones</span>
                        </Link>
                        <div id="collapseAdministrativo" className="collapse" aria-labelledby="headingAdministrativo" data-parent="#accordionSidebar">
                            <div className="bg-white py-2 collapse-inner rounded">
                                {/* <Link
                                    className="collapse-item"
                                    onClick={() => this.handle_LinkEncabezado('Transacciones especiales', 'Secretario del Distrito.')}
                                    to="/SecretarioDelDistrito"
                                >
                                    <span>Secretario del Distrito</span>
                                </Link>
                                <Link
                                    className="collapse-item"
                                    onClick={() => this.handle_LinkEncabezado('Transacciones especiales', 'Tesorero del Distrito.')}
                                    to="/TesoreroDelDistrito"
                                >                                    
                                    <span>Tesorero del Distrito</span>
                                </Link> */}

                                <Link
                                    className="collapse-item"
                                    onClick={() => this.handle_LinkEncabezado('Transacciones especiales', 'Administración del Distrito')}
                                    to="/AdministracionDistrital"
                                >
                                    <span>Administración del Distrito</span>
                                </Link>

                                <Link
                                    className="collapse-item"
                                    onClick={() => this.handle_LinkEncabezado('Transacciones especiales', 'Comisiones Distritales')}
                                    to="/ComisionesDistritales"
                                >
                                    {/* <i className="fas fa-hand-holding-usd"></i> */}
                                    <span>Comisiones Distritales</span>
                                </Link>
                            </div>
                        </div>


                    </li>

                    {/* Divider */}
                    <hr className="sidebar-divider" />

                    {/* Heading */}
                    <div className="sidebar-heading">
                        Reportes
                    </div>

                    {/* Nav Item - Reportes Collapse Menu */}
                    <li className="nav-item">
                        <Link className="nav-link" to="/ResumenMembresia"
                            onClick={() => this.handle_LinkEncabezado("Sección: Reportes", "Reporte de Membresía Actual")}>
                            <i className="fas fa-fw fa-clipboard-list"></i>
                            <span>Reporte de Membresía Actual</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/ReportePersonalBautizado"
                            onClick={() => this.handle_LinkEncabezado("Sección: Reportes", "Lista de Personal Bautizado")}>
                            <i className="fas fa-fw fa-clipboard-list"></i>
                            <span>Lista de Personal Bautizado</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/ReportePersonalNoBautizado"
                            onClick={() => this.handle_LinkEncabezado("Sección: Reportes", "Lista de Personal No Bautizado")}>
                            <i className="fas fa-fw fa-clipboard-list"></i>
                            <span>Lista de Personal No Bautizado</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/RptListaDeHogares"
                            onClick={() => this.handle_LinkEncabezado("Sección: Reportes", "Lista de hogares")}>
                            <i className="fas fa-fw fa-clipboard-list"></i>
                            <span>Lista de hogares</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/ReporteOficiosProfesiones"
                            onClick={() => this.handle_LinkEncabezado("Sección: Reportes", "Lista por Profesiones/Oficios")}>
                            <i className="fas fa-fw fa-clipboard-list"></i>
                            <span>Lista por Profesiones/Oficios</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link"
                            to="/ReporteCumpleaños"
                            onClick={() => this.handle_LinkEncabezado("Sección: Reportes", "Lista por Fecha de Cumpleaños")}>
                            <i className="fas fa-fw fa-clipboard-list"></i>
                            <span>Lista por Fecha de Cumpleaños</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link"
                            to="/ReportePersonalMinisterial"
                            onClick={() => this.handle_LinkEncabezado("Sección: Reportes", "Lista de Personal Ministerial")}>
                            <i className="fas fa-fw fa-clipboard-list"></i>
                            <span>Lista de Personal Ministerial</span>
                        </Link>
                    </li>


                    <li className="nav-item">
                        <Link className="nav-link"
                            to="/ReportePersonalAdministrativo"
                            onClick={() => this.handle_LinkEncabezado("Sección: Reportes", "Lista de Personal Administrativo y Comisiones")}>
                            <i className="fas fa-fw fa-clipboard-list"></i>
                            <span>Lista de Personal Administrativo y Comisiones</span>
                        </Link>
                    </li>


                    <li className="nav-item">
                        <Link className="nav-link"
                            to="/ReporteOrganismosInternos"
                            onClick={() => this.handle_LinkEncabezado("Sección: Reportes", "Lista de Organismos Internos")}>
                            <i className="fas fa-fw fa-clipboard-list"></i>
                            <span>Lista de Organismos Internos</span>
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link"
                            to="/ReporteSantuarioyCasaPastoral"
                            onClick={() => this.handle_LinkEncabezado("Sección: Reportes", "Reporte de Santuario y Casa Pastoral de la Iglesia")}>
                            <i className="fas fa-fw fa-clipboard-list"></i>
                            <span>Reporte de Santuario y Casa Pastoral</span>
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link"
                            to="/ReporteMisiones"
                            onClick={() => this.handle_LinkEncabezado("Sección: Reportes", "Lista de Misiones")}>
                            <i className="fas fa-fw fa-clipboard-list"></i>
                            <span>Lista de Misiones</span>
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link"
                            to="/ReporteVisitantes"
                            onClick={() => this.handle_LinkEncabezado("Sección: Reportes", "Lista de Visitantes")}>
                            <i className="fas fa-fw fa-clipboard-list"></i>
                            <span>Lista de Visitantes</span>
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" to="/ReporteMovimientoEstadistico"
                            onClick={() => this.handle_LinkEncabezado("Sección: Reportes", "Reporte de Movimientos Estadísticos")}>
                            <i className="fas fa-fw fa-clipboard-list"></i>

                            <span>Reporte de Movimientos Estadísticos</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/ResumenTransacciones"
                            onClick={() => this.handle_LinkEncabezado("Sección: Reportes", "Reporte de Transacciones")}>
                            <i className="fas fa-fw fa-clipboard-list"></i>
                            <span>Resumen de Transacciones</span>
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" to="/DirectorioObispos"
                            onClick={() => this.handle_LinkEncabezado("Sección: Reportes", "Directorio de Obispos")}>
                            <i className="fas fa-fw fa-clipboard-list"></i>
                            <span>Directorio de Obispos</span>
                        </Link>
                    </li>

                    {/* Divider */}

                    {/* <hr className="sidebar-divider" />
               
                    Heading
                    <div className="sidebar-heading">
                        Exportaciones
                    </div> */}

                    {/* Nav Item - Exportaciones  */}
                    {/* <li className="nav-item">
                        <Link className="nav-link" to="#">
                            <i className="fas fa-fw fa-baby"></i>
                            <span>Membresía a Excel</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link text-wrap" to="#">
                            <i className="fas fa-fw fa-baby"></i>
                            <span>Hogares a Excel</span>
                        </Link>
                    </li> */}

                    {/* Divider */}
                    <hr className="sidebar-divider d-none d-md-block" />


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
export default SidebarObispo;