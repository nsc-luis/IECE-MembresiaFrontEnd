import React, { Component } from 'react';
import axios from 'axios';
import helpers from '../../components/Helpers';
import '../../assets/css/index.css';
import {
    Modal, ModalHeader, ModalBody, ModalFooter,
    Button, Input, Alert,
    Container, Row, Col,
    Form, FormGroup, Label
} from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';
import Layout from '../Layout';
import IECELogo from '../../assets/images/IECE_logo.png'

class ListaDePersonal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            personas: [],
            status: null,
            sector: {},
            distrito: {},
            modalOpen: false,
            showModalPersonaGenerales: false,
            showModalPersonaFamiliaAsendente: false,
            showModalPersonaEclesiasticos: false,
            showModalPersonaEstadoCivil: false,
            showModalPersonaHogar: false,
            currentPersona: {},
            currentProfesion1: {},
            currentProfesion2: {},
            MiembrosDelHogar: [],
            DatosHogarDomicilio: {},
            CasadoDivorciadoViudo: false,
            ConcubinadoSolteroConHijos: false,
            soltero: false,
            modalInfoPersona: false,
            showModalEliminaPersona: false
        };
        if (!localStorage.getItem("token")) {
            document.location.href = '/';
        }
    }

    url = helpers.url_api;
    infoSesion = JSON.parse(localStorage.getItem('infoSesion'));

    getProfesion1 = async (persona) => {
        return await axios.get(this.url + "/persona/GetProfesion1/" + persona)
            .then(res => res.data)
            .catch(error => error);
    }
    getProfesion2 = async (persona) => {
        return await axios.get(this.url + "/persona/GetProfesion2/" + persona)
            .then(res => res.data)
            .catch(error => error);
        /* .then(res => {
            this.setState({
                currentProfesion2: res.data
            });
        }); */
    }

    componentWillMount() {
        this.getPersonas();
        //  this.getDistrito();
        this.getSector();
    };

    getPersonas = () => {
        axios.get(this.url + "/persona/GetBySector/" + this.infoSesion.sec_Id_Sector)
            .then(res => {
                this.setState({
                    personas: res.data,
                    status: 'success'
                });
            });
    };

    InfoAdicional = () => {
        return (
            alert("Disponible proximamente.")
        );
    }

    fnEliminaPersona = async (persona) => {
        await axios.delete(this.url + "/persona/" + persona.per_Id_Persona)
            .then(res => res.data)
            .catch(error => error);
        window.location.reload();
    }

    InfoStatus = (persona) => {
        let bautizado = persona.per_Bautizado === true ? "Bautizado" : "No bautizado";
        let activo = persona.per_Activo === true ? "Activo" : "No activo";
        let vivo = persona.per_Vivo === true ? "Vivo" : "Finado";

        let infoStatus = {
            bautizado,
            activo,
            vivo
        }
        // console.log(infoStatus);
        return infoStatus;
    }

    getSector = () => {
        // axios.get(this.url + "/sector/" + infoSesion.sec_Id_Sector)
        axios.get(this.url + "/sector/" + this.infoSesion.sec_Id_Sector)
            .then(res => {
                this.setState({
                    sector: res.data[0],
                    status: 'success'
                });
            });
    }

    handle_modalEliminaPersona = (info) => {
        this.setState({
            showModalEliminaPersona: true,
            currentPersona: info
        });
    }

    handle_closeModalEliminaPersona = (info) => {
        this.setState({
            showModalEliminaPersona: false,
            currentPersona: {}
        });
    }

    handle_modalInfoPersona = async (persona) => {
        persona.per_Fecha_BautismoFormateada = helpers.reFormatoFecha(persona.per_Fecha_Bautismo);
        persona.per_Fecha_Boda_CivilFormateada = helpers.reFormatoFecha(persona.per_Fecha_Boda_Civil);
        persona.per_Fecha_Boda_EclesiasticaFormateada = helpers.reFormatoFecha(persona.per_Fecha_Boda_Eclesiastica);
        persona.per_Fecha_NacimientoFormateada = helpers.reFormatoFecha(persona.per_Fecha_Nacimiento);
        persona.per_Fecha_Recibio_Espiritu_SantoFormateada = helpers.reFormatoFecha(persona.per_Fecha_Recibio_Espiritu_Santo);
        this.setState({
            modalInfoPersona: true,
            currentPersona: persona
        });

        /* switch (persona.per_Estado_Civil) {
            case 'CASADO(A)':
                this.setState({
                    CasadoDivorciadoViudo: true,
                    ConcubinadoSolteroConHijos: false,
                    soltero: false
                });
                break;
            case 'DIVORCIADO(A)':
                this.setState({
                    CasadoDivorciadoViudo: true,
                    ConcubinadoSolteroConHijos: false,
                    soltero: false
                });
                break;
            case 'VIUDO(A)':
                this.setState({
                    CasadoDivorciadoViudo: true,
                    ConcubinadoSolteroConHijos: false,
                    soltero: false
                });
                break;
            case 'CONCUBINATO':
                this.setState({
                    CasadoDivorciadoViudo: false,
                    ConcubinadoSolteroConHijos: true,
                    soltero: false
                });
                break;
            case 'SOLTERO(A) CON HIJOS':
                this.setState({
                    CasadoDivorciadoViudo: false,
                    ConcubinadoSolteroConHijos: true,
                    soltero: false
                });
                break;
            default:
                this.setState({
                    CasadoDivorciadoViudo: false,
                    ConcubinadoSolteroConHijos: false,
                    soltero: true
                });
                break;
        } */

        let getHogar = await axios.get(this.url + "/Hogar_Persona/GetHogarByPersona/" + persona.per_Id_Persona)
            .then(res => res.data);

        /* await axios.get(this.url + "/Hogar_Persona/GetMiembros/" + getHogar.hd_Id_Hogar)
            .then(res => {
                this.setState({
                    MiembrosDelHogar: res.data
                });
            }); */
        await axios.get(this.url + "/Hogar_Persona/GetDatosHogarDomicilio/" + getHogar.hd_Id_Hogar)
            .then(res => {
                this.setState({
                    DatosHogarDomicilio: res.data[0]
                });
            });
    }

    handle_modalInfoPersonaClose = () => {
        this.setState({
            modalInfoPersona: false,
            currentPersona: {},
            MiembrosDelHogar: [],
            DatosHogarDomicilio: {},
            CasadoDivorciadoViudo: false,
            ConcubinadoSolteroConHijos: false,
            soltero: false,
        });
    }

    handle_editarPersona = (infoPersona) => {
        if (localStorage.getItem("idPersona")) {
            localStorage.removeItem("idPersona");
            localStorage.removeItem("currentPersona");
        }
        localStorage.setItem("idPersona", infoPersona.per_Id_Persona);
        localStorage.setItem("currentPersona", JSON.stringify(infoPersona));
        document.location.href = "/RegistroDePersona";
    }

    render() {
        if (this.state.personas.length >= 1) {
            return (
                <Layout>
                    <React.Fragment>
                        <h1 className="text-info">Listado de personal</h1>
                        <div className="row">
                            <div className="col-9">
                                <p>
                                    Personal del {this.state.sector.dis_Tipo_Distrito} {this.state.sector.dis_Numero} ({this.state.sector.dis_Alias}, {this.state.sector.dis_Area}) <br />
                                    {this.state.sector.sec_Tipo_Sector} {this.state.sector.sec_Numero}: {this.state.sector.sec_Alias}
                                </p>
                            </div>
                            <div className="col-2">
                                {/* <Link to="/RegistroDePersona" className="btn bnt-sm btn-primary">Registrar persona</Link> */}
                                <button onClick={helpers.handle_RegistroNvaPersona} className="btn bnt-sm btn-primary">Registrar persona</button>
                            </div>
                        </div>
                        <br />
                        <table className="table" id="tblPersonas">
                            <thead>
                                <tr>
                                    <th scope="col">Nombre</th>
                                    <th scope="col" className="text-center">Status</th>
                                    <th scope="col" className="text-center">Activo</th>
                                    <th scope="col" className="text-center">Vivo</th>
                                    <th scope="col" className="text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.personas.map((persona) => {
                                        return (
                                            <React.Fragment>
                                                <tr key={persona.per_Id_Persona}>
                                                    <td>{persona.per_Nombre} {persona.per_Apellido_Paterno} {persona.per_Apellido_Materno} </td>
                                                    {
                                                        <React.Fragment>
                                                            <td className="text-center">
                                                                {this.InfoStatus(persona).bautizado}
                                                            </td>
                                                            <td className="text-center">
                                                                {this.InfoStatus(persona).activo}
                                                            </td>
                                                            <td className="text-center">
                                                                {this.InfoStatus(persona).vivo}
                                                            </td>
                                                        </React.Fragment>
                                                    }
                                                    {/* <td className="text-center">
                                                <button onClick={() => this.openModalPersonaGenerales(persona)} className="bordeRedondo">
                                                    <span className="fas fa-info-circle fa-lg" title="Info general"></span>
                                                </button>
                                                <button onClick={() => this.openModalPersonaFamiliaAsendente(persona)} className="bordeRedondo">
                                                    <span className="fas fa-users fa-lg" title="Familia asendente"></span>
                                                </button>
                                                <button onClick={() => this.openModalPersonaEstadoCivil(persona)} className="bordeRedondo">
                                                    <span className="fas fa-baby-carriage fa-lg" title="Estado civil"></span>
                                                </button>
                                                <button onClick={() => this.openModalPersonaEclesiasticos(persona)} className="bordeRedondo">
                                                    <span className="fas fa-user-check fa-lg" title="Ecelsiasticos"></span>
                                                </button>
                                                <button onClick={() => this.openModalPersonaHogar(persona)} className="bordeRedondo">
                                                    <span className="fas fa-home fa-lg" title="Hogar"></span>
                                                </button>
                                            </td> */}
                                                    <td className="text-center">
                                                        <button
                                                            // onClick={this.handle_modalInfoPersona}
                                                            onClick={() => this.handle_modalInfoPersona(persona)}
                                                            className="btn btn-success btn-sm"
                                                            title="Ver hoja de datos">
                                                            <span className="fas fa-eye"></span>Ver Info
                                                        </button>
                                                        <button
                                                            /* onClick={() => this.fnEliminaPersona(persona)} */
                                                            onClick={() => this.handle_modalEliminaPersona(persona)}
                                                            className="btn btn-danger btn-sm"
                                                            title="Eliminar persona">
                                                            <span className="fas fa-trash-alt"></span>Eliminar
                                                        </button>
                                                    </td>
                                                </tr>
                                                <Modal isOpen={this.state.modalInfoPersona} contentClassName="modalVerInfoPersona" size="lg">
                                                    <Container>
                                                        <div id="infoDatosEstadisticos">
                                                        <ModalHeader>
                                                            <Row>
                                                                <Col sm="5">
                                                                    <img src={IECELogo} className="imgLogoModalDatosEstadisticos" alt="Logo" />
                                                                </Col>
                                                                <Col sm="7" className="tituloDatosEstadisticos">
                                                                    Hoja de Datos Estadísticos
                                                                </Col>
                                                            </Row>
                                                        </ModalHeader>
                                                        <ModalBody>
                                                            <Row className="modalBodyRowDatosEstadisticos">
                                                                <Col sm="12">
                                                                    <span className="tituloListaDatosEstadisticos" >1.- Nombre: </span>
                                                                    <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Nombre} {this.state.currentPersona.per_Apellido_Paterno} {this.state.currentPersona.per_Apellido_Materno} </span>
                                                                </Col>
                                                            </Row>
                                                            <Row className="modalBodyRowDatosEstadisticos">
                                                                <Col sm="4">
                                                                    <span className="tituloListaDatosEstadisticos" >2.- Edad: </span>
                                                                    <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Fecha_NacimientoFormateada} </span>
                                                                </Col>
                                                                <Col sm="4">
                                                                    <span className="tituloListaDatosEstadisticos" >Nacionalidad: </span>
                                                                    <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Nacionalidad} </span>
                                                                </Col>
                                                            </Row>
                                                            <Row className="modalBodyRowDatosEstadisticos">
                                                                <Col sm="12">
                                                                    <span className="tituloListaDatosEstadisticos" >3.- Lugar y fecha de nacimiento: </span>
                                                                </Col>
                                                            </Row>
                                                            <Row className="modalBodyRowDatosEstadisticos">
                                                                <Col sm="12">
                                                                    <span className="tituloListaDatosEstadisticos" >4.- Nombre de sus padres: </span>
                                                                    <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Nombre_Padre}, {this.state.currentPersona.per_Nombre_Madre} </span>
                                                                </Col>
                                                            </Row>
                                                            <Row className="modalBodyRowDatosEstadisticos">
                                                                <Col sm="12">
                                                                    <span className="tituloListaDatosEstadisticos" >5.- Abuelos paternos: </span>
                                                                    <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Nombre_Abuelo_Paterno}, {this.state.currentPersona.per_Nombre_Abuela_Paterna} </span>
                                                                </Col>
                                                            </Row>
                                                            <Row className="modalBodyRowDatosEstadisticos">
                                                                <Col sm="12">
                                                                    <span className="tituloListaDatosEstadisticos" >6.- Abuelos maternos: </span>
                                                                    <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Nombre_Abuelo_Materno}, {this.state.currentPersona.per_Nombre_Abuela_Materna} </span>
                                                                </Col>
                                                            </Row>
                                                            <Row className="modalBodyRowDatosEstadisticos">
                                                                <Col sm="4">
                                                                    <span className="tituloListaDatosEstadisticos" >7.- Estado civil: </span>
                                                                    <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Estado_Civil} </span>
                                                                </Col>
                                                                <Col sm="4">
                                                                    <span className="tituloListaDatosEstadisticos" >Fecha de la boda civil: </span>
                                                                    <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Fecha_Boda_CivilFormateada} </span>
                                                                </Col>
                                                            </Row>
                                                            <Row className="modalBodyRowDatosEstadisticos">
                                                                <Col sm="4">
                                                                    <span className="tituloListaDatosEstadisticos" >Según acta: </span>
                                                                    <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Num_Acta_Boda_Civil} </span>
                                                                </Col>
                                                                <Col sm="4">
                                                                    <span className="tituloListaDatosEstadisticos" >Del Libro No.: </span>
                                                                    <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Libro_Acta_Boda_Civil} </span>
                                                                </Col>
                                                                <Col sm="4">
                                                                    <span className="tituloListaDatosEstadisticos" >Que lleva la oficialía: </span>
                                                                    <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Oficialia_Boda_Civil} </span>
                                                                </Col>
                                                            </Row>
                                                            <Row className="modalBodyRowDatosEstadisticos">
                                                                <Col sm="12">
                                                                    <span className="tituloListaDatosEstadisticos" >Del Registro Civil en: </span>
                                                                    <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Registro_Civil} </span>
                                                                </Col>
                                                            </Row>
                                                            <Row className="modalBodyRowDatosEstadisticos">
                                                                <Col sm="12">
                                                                    <span className="tituloListaDatosEstadisticos" >8.- Contrajo Matrimonio Eclesiástico en la I.E.C.E el día: </span>
                                                                    <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Fecha_Boda_EclesiasticaFormateada} </span>
                                                                </Col>
                                                            </Row>
                                                            <Row className="modalBodyRowDatosEstadisticos">
                                                                <Col sm="12">
                                                                    <span className="tituloListaDatosEstadisticos" >Lugar de Matrimonio Eclesiástico en la I.E.C.E.: </span>
                                                                    <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Lugar_Boda_Eclesiastica} </span>
                                                                </Col>
                                                            </Row>
                                                            <Row className="modalBodyRowDatosEstadisticos">
                                                                <Col sm="4">
                                                                    <span className="tituloListaDatosEstadisticos" >10.- Cuantos hijos y sus nombres: </span>
                                                                    <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Cantidad_Hijos} </span>
                                                                </Col>
                                                                <Col sm="8">
                                                                    <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Nombre_Hijos} </span>
                                                                </Col>
                                                            </Row>
                                                            <Row className="modalBodyRowDatosEstadisticos">
                                                                <Col sm="12">
                                                                    <span className="tituloListaDatosEstadisticos" >13.- Fecha en la que recibio la promesa del Espiritu Santo: </span>
                                                                    <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Fecha_Recibio_Espiritu_SantoFormateada} </span>
                                                                </Col>
                                                            </Row>
                                                            <Row className="modalBodyRowDatosEstadisticos">
                                                                <Col sm="12">
                                                                    <span className="tituloListaDatosEstadisticos" >Bajo la imposición de manos del presbiterio: </span>
                                                                    <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Bajo_Imposicion_De_Manos} </span>
                                                                </Col>
                                                            </Row>
                                                            <Row className="modalBodyRowDatosEstadisticos">
                                                                <Col sm="12">
                                                                    <span className="tituloListaDatosEstadisticos" >14.- Puestos desempeñados en la IECE: </span>
                                                                    <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Cargos_Desempenados} </span>
                                                                </Col>
                                                            </Row>
                                                            <Row className="modalBodyRowDatosEstadisticos">
                                                                <Col sm="12">
                                                                    <span className="tituloListaDatosEstadisticos" >15.- Cambios de domicilio: </span>
                                                                    <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Cambios_De_Domicilio} </span>
                                                                </Col>
                                                            </Row>
                                                            <Row className="modalBodyRowDatosEstadisticos">
                                                                <Col sm="12">
                                                                    <span className="tituloListaDatosEstadisticos" >16.- Domicilio actual: </span>
                                                                    <span className="infoDatosEstadisticos" > 
                                                                    Calle: {this.state.DatosHogarDomicilio.hd_Calle}, No.: {this.state.DatosHogarDomicilio.hd_Numero_Exterior}, Interior: {this.state.DatosHogarDomicilio.hd_Numero_Interior},
                                                                    Tipo subdivision: {this.state.DatosHogarDomicilio.hd_Tipo_Subdivision}, Subdivision: {this.state.DatosHogarDomicilio.hd_Subdivision} <br />
                                                                    Localidad: {this.state.DatosHogarDomicilio.hd_Localidad}, Municipio/cuidad: {this.state.DatosHogarDomicilio.hd_Municipio_Ciudad},
                                                                    {this.state.DatosHogarDomicilio.est_Nombre}, Pais: {this.state.DatosHogarDomicilio.pais_Nombre_Corto} <br />
                                                                    Telefono: {this.state.DatosHogarDomicilio.hd_Telefono}
                                                                    </span>
                                                                </Col>
                                                            </Row>
                                                            <Row className="modalBodyRowDatosEstadisticos">
                                                                <Col sm="4">
                                                                    <span className="tituloListaDatosEstadisticos" >17.- Teléfono: </span>
                                                                    <span className="infoDatosEstadisticos" > {this.state.currentPersona.per_Telefono_Movil} </span>
                                                                </Col>
                                                                <Col sm="4">
                                                                    <span className="tituloListaDatosEstadisticos" >E-mail: </span>
                                                                    <span className="infoDatosEstadisticos" > {this.state.currentPersona.per_Email_Personal} </span>
                                                                </Col>
                                                            </Row>
                                                            <Row className="modalBodyRowDatosEstadisticos">
                                                                <Col sm="6">
                                                                    <span className="tituloListaDatosEstadisticos" >18.- Profesión / Oficio: </span>
                                                                    <span className="infoDatosEstadisticos" > {this.state.currentPersona.pro_Id_Profesion_Oficio1} </span>
                                                                </Col>
                                                                <Col sm="6">
                                                                    <span className="tituloListaDatosEstadisticos" >Profesión / Oficio: </span>
                                                                    <span className="infoDatosEstadisticos" > {this.state.currentPersona.pro_Id_Profesion_Oficio2} </span>
                                                                </Col>
                                                            </Row>
                                                        </ModalBody>
                                                        </div>
                                                    {/* <ModalHeader> Hoja de datos estadísticos </ModalHeader>
                                                    <ModalBody>
                                                        <Container>
                                                            <Form>
                                                                <p className="text-center"><strong>Generales</strong></p>
                                                                <Row>
                                                                    <Col xs="4">
                                                                        <FormGroup>
                                                                            <Input type="text" readonly value={this.state.currentPersona.per_Nombre} />
                                                                            <Label>Nombre</Label>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col xs="4">
                                                                        <FormGroup>
                                                                            <Input type="text" readonly value={this.state.currentPersona.per_Apellido_Paterno} />
                                                                            <Label>Apellido paterno</Label>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col xs="4">
                                                                        <FormGroup>
                                                                            <Input type="text" readonly value={this.state.currentPersona.per_Apellido_Materno} />
                                                                            <Label>Apellido materno</Label>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col xs="4">
                                                                        <FormGroup>
                                                                            <Input type="text" readonly value={this.state.currentPersona.per_Telefono_Fijo} />
                                                                            <Label>Telefono</Label>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col xs="4">
                                                                        <FormGroup>
                                                                            <Input type="text" readonly value={this.state.currentPersona.per_Telefono_Movil} />
                                                                            <Label>Celular</Label>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col xs="4">
                                                                        <FormGroup>
                                                                            <Input type="text" readonly value={this.state.currentPersona.per_Email_Personal} />
                                                                            <Label>Email</Label>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col xs="4">
                                                                        <FormGroup>
                                                                            <Input type="text" readonly value={this.state.currentPersona.per_Fecha_Nacimiento} />
                                                                            <Label>Fecha nacimiento</Label>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col xs="4">
                                                                        <FormGroup>
                                                                            <Input type="text" readonly value={this.state.currentProfesion1.pro_Sub_Categoria} />
                                                                            <Label>Descripcion oficio 1</Label>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col xs="4">
                                                                        <FormGroup>
                                                                            <Input type="text" readonly value={this.state.currentProfesion2.pro_Categoria} />
                                                                            <Label>Descripcion oficio 2</Label>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                                <p className="text-center"><strong>Familiares</strong></p>
                                                                <Row>
                                                                    <Col xs="4">
                                                                        <FormGroup>
                                                                            <Input type="text" readonly value={this.state.currentPersona.per_Nombre_Padre} />
                                                                            <Label>Padre</Label>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col xs="4">
                                                                        <FormGroup>
                                                                            <Input type="text" readonly value={this.state.currentPersona.per_Nombre_Abuelo_Paterno} />
                                                                            <Label>Abuelo paterno</Label>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col xs="4">
                                                                        <FormGroup>
                                                                            <Input type="text" readonly value={this.state.currentPersona.per_Nombre_Abuelo_Materno} />
                                                                            <Label>Abuelo materno</Label>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col xs="4">
                                                                        <FormGroup>
                                                                            <Input type="text" readonly value={this.state.currentPersona.per_Nombre_Madre} />
                                                                            <Label>Madre</Label>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col xs="4">
                                                                        <FormGroup>
                                                                            <Input type="text" readonly value={this.state.currentPersona.per_Nombre_Abuela_Materna} />
                                                                            <Label>Abuela paterna</Label>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col xs="4">
                                                                        <FormGroup>
                                                                            <Input type="text" readonly value={this.state.currentPersona.per_Nombre_Abuela_Materna} />
                                                                            <Label>Abuela materna</Label>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                                <p className="text-center"><strong>Estado civil</strong></p>
                                                                {this.state.CasadoDivorciadoViudo &&
                                                                    <React.Fragment>
                                                                        <Row>
                                                                            <Col xs="4">
                                                                                <FormGroup>
                                                                                    <Input type="text" readonly value={this.state.currentPersona.per_Estado_Civil} />
                                                                                    <Label>Estado civil</Label>
                                                                                </FormGroup>
                                                                            </Col>
                                                                            <Col xs="4">
                                                                                <FormGroup>
                                                                                    <Input type="text" readonly value={this.state.currentPersona.per_Nombre_Conyuge} />
                                                                                    <Label>Conyuge</Label>
                                                                                </FormGroup>
                                                                            </Col>
                                                                            <Col xs="4">
                                                                                <FormGroup>
                                                                                    <Input type="text" readonly value={this.state.currentPersona.per_Fecha_Boda_Civil} />
                                                                                    <Label>Fecha boda civil</Label>
                                                                                </FormGroup>
                                                                            </Col>
                                                                        </Row>
                                                                        <Row>
                                                                            <Col xs="4">
                                                                                <FormGroup>
                                                                                    <Input type="text" readonly value={this.state.currentPersona.per_Registro_Civil} />
                                                                                    <Label>Registro boda civil</Label>
                                                                                </FormGroup>
                                                                            </Col>
                                                                            <Col xs="4">
                                                                                <FormGroup>
                                                                                    <Input type="text" readonly value={this.state.currentPersona.per_Oficialia_Boda_Civil} />
                                                                                    <Label>Oficialia boda civil</Label>
                                                                                </FormGroup>
                                                                            </Col>
                                                                            <Col xs="4">
                                                                                <FormGroup>
                                                                                    <Input type="text" readonly value={this.state.currentPersona.per_Libro_Acta_Boda_Civil} />
                                                                                    <Label>Libro boda civil</Label>
                                                                                </FormGroup>
                                                                            </Col>
                                                                        </Row>
                                                                        <Row>
                                                                            <Col xs="4">
                                                                                <FormGroup>
                                                                                    <Input type="text" readonly value={this.state.currentPersona.per_Num_Acta_Boda_Civil} />
                                                                                    <Label>Acta boda civil</Label>
                                                                                </FormGroup>
                                                                            </Col>
                                                                            <Col xs="4">
                                                                                <FormGroup>
                                                                                    <Input type="text" readonly value={this.state.currentPersona.per_Cantidad_Hijos} />
                                                                                    <Label>Cantidad de hijos</Label>
                                                                                </FormGroup>
                                                                            </Col>
                                                                            <Col xs="4">
                                                                                <FormGroup>
                                                                                    <Input type="text" readonly value={this.state.currentPersona.per_Nombre_Hijos} />
                                                                                    <Label>Nombre de hijos</Label>
                                                                                </FormGroup>
                                                                            </Col>
                                                                        </Row>
                                                                        {this.state.currentPersona.per_Bautizado &&
                                                                            <React.Fragment>
                                                                                <Row>
                                                                                    <Col xs="4">
                                                                                        <FormGroup>
                                                                                            <Input type="text" readonly value={this.state.currentPersona.per_Fecha_Boda_Eclesiastica} />
                                                                                            <Label>Fecha boda eclesiastica</Label>
                                                                                        </FormGroup>
                                                                                    </Col>
                                                                                    <Col xs="4">
                                                                                        <FormGroup>
                                                                                            <Input type="text" readonly value={this.state.currentPersona.per_Lugar_Boda_Eclesiastica} />
                                                                                            <Label>Lugar boda eclesiastica</Label>
                                                                                        </FormGroup>
                                                                                    </Col>
                                                                                    <Col xs="4">
                                                                                    </Col>
                                                                                </Row>
                                                                            </React.Fragment>
                                                                        }
                                                                    </React.Fragment>
                                                                }
                                                                {this.state.ConcubinadoSolteroConHijos &&
                                                                    <React.Fragment>
                                                                        <Row>
                                                                            <Col xs="4">
                                                                                <FormGroup>
                                                                                    <Input type="text" readonly value={this.state.currentPersona.per_Estado_Civil} />
                                                                                    <Label>Estado civil</Label>
                                                                                </FormGroup>
                                                                            </Col>
                                                                            <Col xs="4">
                                                                                <FormGroup>
                                                                                    <Input type="text" readonly value={this.state.currentPersona.per_Cantidad_Hijos} />
                                                                                    <Label>Cantidad de hijos</Label>
                                                                                </FormGroup>
                                                                            </Col>
                                                                            <Col xs="4">
                                                                            </Col>
                                                                        </Row>
                                                                        <Row>
                                                                            <Col xs="12">
                                                                                <FormGroup>
                                                                                    <Input type="textarea" readonly value={this.state.currentPersona.per_Nombre_Hijos} />
                                                                                    <Label>Nombre de los hijos</Label>
                                                                                </FormGroup>
                                                                            </Col>
                                                                        </Row>
                                                                    </React.Fragment>
                                                                }
                                                                {this.state.soltero &&
                                                                    <React.Fragment>
                                                                        <Row>
                                                                            <Col xs="4">
                                                                                <FormGroup>
                                                                                    <Input type="text" readonly value={this.state.currentPersona.per_Estado_Civil} />
                                                                                    <Label>Estado civil</Label>
                                                                                </FormGroup>
                                                                            </Col>
                                                                        </Row>
                                                                    </React.Fragment>
                                                                }
                                                                <p className="text-center"><strong>Ecelsiasticos</strong></p>
                                                                {this.state.currentPersona.per_Bautizado &&
                                                                    <React.Fragment>
                                                                        <Row>
                                                                            <Col xs="12">
                                                                                <FormGroup>
                                                                                    <Input type="text" readonly value={this.state.currentPersona.per_Bautizado ? 'SI' : 'NO'} />
                                                                                    <Label>Bautizado</Label>
                                                                                </FormGroup>
                                                                            </Col>
                                                                        </Row>
                                                                        <Row>
                                                                            <Col xs="4">
                                                                                <FormGroup>
                                                                                    <Input type="text" readonly value={this.state.currentPersona.per_Lugar_Bautismo} />
                                                                                    <Label>Lugar bautismo</Label>
                                                                                </FormGroup>
                                                                            </Col>
                                                                            <Col xs="4">
                                                                                <FormGroup>
                                                                                    <Input type="text" readonly value={this.state.currentPersona.per_Ministro_Que_Bautizo} />
                                                                                    <Label>Ministro que bautizo</Label>
                                                                                </FormGroup>
                                                                            </Col>
                                                                            <Col xs="4">
                                                                                <FormGroup>
                                                                                    <Input type="text" readonly value={this.state.currentPersona.per_Fecha_Bautismo} />
                                                                                    <Label>Fecha bautismo</Label>
                                                                                </FormGroup>
                                                                            </Col>
                                                                        </Row>
                                                                        <Row>
                                                                            <Col xs="4">
                                                                                <FormGroup>
                                                                                    <Input type="text" readonly value={this.state.currentPersona.per_Bajo_Imposicion_De_Manos} />
                                                                                    <Label>Bajo imposicion de manos</Label>
                                                                                </FormGroup>
                                                                            </Col>
                                                                            <Col xs="4">
                                                                                <FormGroup>
                                                                                    <Input type="text" readonly value={this.state.currentPersona.per_Fecha_Recibio_Espiritu_Santo} />
                                                                                    <Label>Fecha recibe promesa</Label>
                                                                                </FormGroup>
                                                                            </Col>
                                                                            <Col xs="4">
                                                                                <FormGroup>
                                                                                    <Input type="text" readonly value={this.state.currentPersona.per_Cambios_De_Domicilio} />
                                                                                    <Label>Cambios de domicilio</Label>
                                                                                </FormGroup>
                                                                            </Col>
                                                                        </Row>
                                                                    </React.Fragment>
                                                                }
                                                                <p className="text-center"><strong>Hogar</strong></p> */}
                                                    {/* {this.state.DatosHogarDomicilio.map((HogarDomicilio, i) => {
                                                                    return (
                                                                        <React.Fragment>
                                                                            <Row>
                                                                                <Col xs="12">
                                                                                    <p key={i}>
                                                                                        {HogarDomicilio.hd_Calle} {HogarDomicilio.hd_Numero_Exterior}, {HogarDomicilio.hd_Numero_Interior} <br />
                                                            Tipo subdivision: {HogarDomicilio.hd_Tipo_Subdivision}, Subdivision: {HogarDomicilio.hd_Subdivision} <br />
                                                                                        {HogarDomicilio.hd_Localidad}, {HogarDomicilio.hd_Municipio_Cuidad} <br />
                                                                                        {HogarDomicilio.est_Nombre}, {HogarDomicilio.pais_Nombre_Corto} <br />
                                                            Telefono: {HogarDomicilio.hd_Telefono}
                                                                                    </p>
                                                                                </Col>
                                                                            </Row>
                                                                            <Row>
                                                                                <Col xs="12">
                                                                                    <FormGroup>
                                                                                        <table className="table">
                                                                                            <thead>
                                                                                                <tr>
                                                                                                    <th scope="col">Miembros del hogar</th>
                                                                                                    <th scope="col">Jerarquia</th>
                                                                                                </tr>
                                                                                            </thead>
                                                                                            <tbody>
                                                                                                {this.state.showModalPersonaHogar &&
                                                                                                    this.state.MiembrosDelHogar.map((miembro, i) => {
                                                                                                        return (
                                                                                                            <tr key={i}>
                                                                                                                <td>{miembro.per_Nombre} {miembro.per_Apellido_Paterno} {miembro.per_Apellido_Materno}</td>
                                                                                                                <td>{miembro.hp_Jerarquia}</td>
                                                                                                            </tr>
                                                                                                        )
                                                                                                    })
                                                                                                }
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </FormGroup>
                                                                                </Col>
                                                                            </Row>
                                                                        </React.Fragment>
                                                                    )
                                                                })} */}
                                                    {/* </Form>
                                                        </Container>
                                                    </ModalBody> */}
                                                    <ModalFooter>
                                                        <Button color="secondary" onClick={this.handle_modalInfoPersonaClose}>Cancel</Button>
                                                        <Button color="danger" onClick={() => helpers.ToPDF("infoDatosEstadisticos")} >Generar PDF</Button>
                                                        <Button color="success" onClick={() => this.handle_editarPersona(this.state.currentPersona)} >Editar</Button>
                                                    </ModalFooter>
                                                    </Container>
                                                </Modal>
                                            </React.Fragment>
                                        )
                                    })
                                }
                            </tbody>
                        </table>

                        <Modal 
                            isOpen={this.state.showModalEliminaPersona}
                            onRequestClose={this.handle_closeModalEliminaPersona}
                            size="lg"
                        >
                            <ModalHeader>
                                Eliminar persona.
                            </ModalHeader>
                            <ModalBody>
                                <Alert color="warning">
                                    <strong>Advertencia: </strong><br />
                                    Al eliminar una persona seran reorganizadas las jerarquias dentro del hogar y
                                    si la persona es la ultima del hogar, entonces, el hogar tambien sera eliminado.
                                </Alert>
                                ¿Esta seguro de querer eliminar a la persona: <strong>{this.state.currentPersona.per_Nombre} {this.state.currentPersona.per_Apellido_Paterno} {this.state.currentPersona.per_Apellido_Materno}</strong>?
                            </ModalBody>
                            <ModalFooter>
                                <Button color="secondary" onClick={this.handle_closeModalEliminaPersona}>Cancelar</Button>
                                <Button color="danger" onClick={() => this.fnEliminaPersona(this.state.currentPersona)}>Eliminar</Button>
                            </ModalFooter>
                        </Modal>

                        {/* <Modal // Datos generales
                            isOpen={this.state.showModalPersonaGenerales}
                            className="modalStyle"
                            onRequestClose={this.closeModalPersonaGenerales}
                        >
                            <div className="card border-info">
                                <div className="card-header text-center">
                                    <h5><strong>Datos generales</strong></h5>
                                </div>

                                <div className="card-body p-3">
                                    <div className="row">
                                        <div className="col-3">
                                            <img src="./images/logo_signin.png" alt="Acceso a listado de personal" className="mx-auto card-img-top imgHome" />
                                        </div>
                                        <div className="col">
                                            <strong>Nombre:</strong> {this.state.currentPersona.per_Nombre} {this.state.currentPersona.per_Apellido_Paterno} {this.state.currentPersona.per_ApellidoMaterno} <br />
                                            <strong>Telefono:</strong> {this.state.currentPersona.per_Telefono_Fijo} <br />
                                            <strong>Celular:</strong> {this.state.currentPersona.per_Telefono_Movil} <br />
                                            <strong>Email:</strong> {this.state.currentPersona.per_Email_Personal} <br />
                                            <strong>Fecha nacimiento:</strong> {this.state.currentPersona.per_Fecha_Nacimiento}
                                            <hr />
                                            <strong>Descripcion oficio 1:</strong> {this.state.currentProfesion1.pro_Sub_Categoria}
                                        ( {this.state.currentProfesion1.pro_Categoria} ) <br />
                                            <strong>Descripcion oficio 2:</strong> {this.state.currentProfesion2.pro_Sub_Categoria}
                                        ( {this.state.currentProfesion2.pro_Categoria} )
                                    </div>
                                    </div>
                                </div>
                                <button className="btn btn-sm btn-secondary" onClick={this.closeModalPersonaGenerales}>Cerrar</button>
                            </div>
                        </Modal>

                        <Modal // Familia asendente
                            isOpen={this.state.showModalPersonaFamiliaAsendente}
                            className="modalStyle"
                            onRequestClose={this.closeModalPersonaFamiliaAsendente}
                        >
                            <div className="card border-info">
                                <div className="card-header text-center">
                                    <h5><strong>Familia asendente</strong></h5>
                                </div>
                                <div className="card-body p-3">
                                    <strong>Padre:</strong> {this.state.currentPersona.per_Nombre_Padre} <br />
                                    <strong>Madre:</strong> {this.state.currentPersona.per_Nombre_Madre} <br />
                                    <strong>Abuelo paterno:</strong> {this.state.currentPersona.per_Nombre_Abuelo_Paterno} <br />
                                    <strong>Abuela paterna:</strong> {this.state.currentPersona.per_Nombre_Abuela_Materna} <br />
                                    <strong>Abuelo materno:</strong> {this.state.currentPersona.per_Nombre_Abuelo_Materno} <br />
                                    <strong>Abuela materna:</strong> {this.state.currentPersona.per_Nombre_Abuela_Materna} <br />
                                </div>
                                <button className="btn btn-sm btn-secondary" onClick={this.closeModalPersonaFamiliaAsendente}>Cerrar</button>
                            </div>
                        </Modal>

                        <Modal // Estado civil
                            isOpen={this.state.showModalPersonaEstadoCivil}
                            className="modalStyle"
                            onRequestClose={this.closeModalPersonaEstadoCivil}
                        >
                            <div className="card border-info">
                                <div className="card-header text-center">
                                    <h5><strong>Datos de estado civil</strong></h5>
                                </div>
                                <div className="card-body p-3">
                                    {this.state.CasadoDivorciadoViudo &&
                                        <React.Fragment>
                                            <strong>Estado civil:</strong> {this.state.currentPersona.per_Estado_Civil} <br />
                                            <strong>Conyuge:</strong> {this.state.currentPersona.per_Nombre_Conyuge} <br />
                                            <strong>Fecha boda civil:</strong> {this.state.currentPersona.per_Fecha_Boda_Civil} <br />
                                            <strong>Registro boda civil:</strong> {this.state.currentPersona.per_Registro_Civil} <br />
                                            <strong>Oficialia boda civil:</strong> {this.state.currentPersona.per_Oficialia_Boda_Civil} <br />
                                            <strong>Libro boda civil:</strong> {this.state.currentPersona.per_Libro_Acta_Boda_Civil} <br />
                                            <strong>Acta boda civil:</strong> {this.state.currentPersona.per_Num_Acta_Boda_Civil} <br />
                                            <strong>Cantidad de hijos:</strong> {this.state.currentPersona.per_Cantidad_Hijos} <br />
                                            <strong>Nombre de hijos:</strong> {this.state.currentPersona.per_Nombre_Hijos}

                                            {this.state.currentPersona.per_Bautizado &&
                                                <React.Fragment>
                                                    <hr />
                                                    <strong>Fecha boda eclesiastica:</strong> {this.state.currentPersona.per_Fecha_Boda_Eclesiastica} <br />
                                                    <strong>Lugar boda eclesiastica:</strong> {this.state.currentPersona.per_Lugar_Boda_Eclesiastica}
                                                </React.Fragment>
                                            }
                                        </React.Fragment>
                                    }
                                    {this.state.ConcubinadoSolteroConHijos &&
                                        <React.Fragment>
                                            <strong>Estado civil:</strong> {this.state.currentPersona.per_Estado_Civil} <br />
                                            <strong>Numero de hijos:</strong> {this.state.currentPersona.per_Nombre_Hijos} <br />
                                            <strong>Cantidad de hijos:</strong> {this.state.currentPersona.per_Cantidad_Hijos}
                                        </React.Fragment>
                                    }
                                    {this.state.soltero &&
                                        <React.Fragment>
                                            <strong>Estado civil:</strong> {this.state.currentPersona.per_Estado_Civil}
                                        </React.Fragment>
                                    }

                                </div>
                                <button className="btn btn-sm btn-secondary" onClick={this.closeModalPersonaEstadoCivil}>Cerrar</button>
                            </div>
                        </Modal>

                        <Modal // Datos eclesiasticos
                            isOpen={this.state.showModalPersonaEclesiasticos}
                            className="modalStyle"
                            onRequestClose={this.closeModalPersonaEclesiasticos}
                        >
                            <div className="card border-info">
                                <div className="card-header text-center">
                                    <h5><strong>Datos eclesiasticos</strong></h5>
                                </div>
                                <div className="card-body p-3">
                                    <strong>Bautizado: </strong>{this.state.currentPersona.per_Bautizado ? 'SI' : 'NO'} <br />
                                    {this.state.currentPersona.per_Bautizado &&
                                        <React.Fragment>
                                            <strong>Lugar bautismo:</strong> {this.state.currentPersona.per_Lugar_Bautismo} <br />
                                            <strong>Ministro que bautizo:</strong> {this.state.currentPersona.per_Ministro_Que_Bautizo} <br />
                                            <strong>Fecha bautismo:</strong> {this.state.currentPersona.per_Fecha_Bautismo}
                                        </React.Fragment>
                                    }
                                    <br />
                                    <hr />
                                    <strong>Bajo imposicion de manos:</strong> {this.state.currentPersona.per_Bajo_Imposicion_De_Manos} <br />
                                    <strong>Fecha recibe promesa:</strong> {this.state.currentPersona.per_Fecha_Recibio_Espiritu_Santo}
                                    <hr />
                                    <strong>Cambios de domicilio:</strong> {this.state.currentPersona.per_Cambios_De_Domicilio} <br />
                                </div>
                                <button className="btn btn-sm btn-secondary" onClick={this.closeModalPersonaEclesiasticos}>Cerrar</button>
                            </div>
                        </Modal>

                        <Modal // Datos del hogar
                            isOpen={this.state.showModalPersonaHogar}
                            className="modalStyle"
                            onRequestClose={this.closeModalPersonaHogar}
                        >
                            <div className="card border-info">
                                <div className="card-header text-center">
                                    <h5><strong>Datos del hogar</strong></h5>
                                </div>
                                <div className="card-body p-3">
                                    {this.state.showModalPersonaHogar &&
                                        this.state.DatosHogarDomicilio.map((HogarDomicilio, i) => {
                                            return (
                                                <p key={i}>
                                                    {HogarDomicilio.hd_Calle} {HogarDomicilio.hd_Numero_Exterior}, {HogarDomicilio.hd_Numero_Interior} <br />
                                                            Tipo subdivision: {HogarDomicilio.hd_Tipo_Subdivision}, Subdivision: {HogarDomicilio.hd_Subdivision} <br />
                                                    {HogarDomicilio.hd_Localidad}, {HogarDomicilio.hd_Municipio_Cuidad} <br />
                                                    {HogarDomicilio.est_Nombre}, {HogarDomicilio.pais_Nombre_Corto} <br />
                                                            Telefono: {HogarDomicilio.hd_Telefono}
                                                </p>
                                            )
                                        })
                                    }
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">Miembros del hogar</th>
                                                <th scope="col">Jerarquia</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.showModalPersonaHogar &&
                                                this.state.MiembrosDelHogar.map((miembro, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td>{miembro.per_Nombre} {miembro.per_Apellido_Paterno} {miembro.per_Apellido_Materno}</td>
                                                            <td>{miembro.hp_Jerarquia}</td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                <button className="btn btn-sm btn-secondary" onClick={this.closeModalPersonaHogar}>Cerrar</button>
                            </div>
                        </Modal> */}
                    </React.Fragment>
                </Layout>
            );
        } else if (this.state.personas.length === 0 && this.state.status === 'success') {
            return (
                <Layout>
                    <React.Fragment>
                        <h3>Aun no hay personas registras!</h3>
                        <p>Haga clic en el boton Registrar persona para registrar una persona.</p>
                    </React.Fragment>
                </Layout>
            );
        } else {
            return (
                <Layout>
                    <React.Fragment>
                        <h3>Cargando información...</h3>
                        <p>Por favor espere.</p>
                    </React.Fragment>
                </Layout>
            );
        }
    };
}

export default ListaDePersonal;