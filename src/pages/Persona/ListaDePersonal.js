import React, { Component } from 'react';
import helpers from '../../components/Helpers';
import '../../assets/css/index.css';
import {
    Modal, ModalHeader, ModalBody, ModalFooter,
    Button, Input, Alert, Container, Row, Col, Card,
    Form, FormGroup, Label, CardHeader, CardTitle, CardBody, CardFooter
} from 'reactstrap';
import Layout from '../Layout';
import { Link } from 'react-router-dom';
import IECELogo from '../../assets/images/IECE_logo.png'
import ModalInfoHogar from './ModalInfoHogar';
import jsPDF from 'jspdf';
import nvologo from '../../assets/images/nvoLogo.png'

class ListaDePersonal extends Component {

    url = helpers.url_api;
    infoSesion = JSON.parse(localStorage.getItem('infoSesion'));

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
            showModalEliminaPersona: false,
            tempPersonas: [],
            sectores: [],
            fNombre: '',
            fCategoria: '0',
            fSector: '0',
            fGrupo: '0',
            fProfesionOficio: '',
            modalInfoHogar: false,
            objPersona: {},
        };
        if (!localStorage.getItem("token")) {
            document.location.href = '/';
        }
    }

    componentDidMount() {
        this.getPersonas();
        this.getSector();
        this.getSectoresPorDistrito();
    }

    getSectoresPorDistrito = async () => {
        if (localStorage.getItem('sector') === null) {
            await helpers.authAxios.get(this.url + '/Sector/GetSectoresByDistrito/' + localStorage.getItem('dto'))
                .then(res => {
                    this.setState({
                        sectores: res.data.sectores
                    })
                });
        }
        else {
            await helpers.authAxios.get(this.url + '/Sector/' + localStorage.getItem('sector'))
                .then(res => {
                    this.setState({
                        sectores: res.data.sector
                    })
                });
        }
    }

    getPersonas = () => {
        if (localStorage.getItem('sector') !== null) {
            helpers.authAxios.get(this.url + "/persona/GetBySector/" + localStorage.getItem('sector'))
                .then(res => {
                    this.setState({
                        personas: res.data,
                        status: 'success',
                        tempPersonas: res.data
                    });
                });
        }
        else {
            helpers.authAxios.get(this.url + "/persona/GetByDistrito/" + localStorage.getItem('dto'))
                .then(res => {
                    this.setState({
                        personas: res.data,
                        status: 'success',
                        tempPersonas: res.data
                    });
                });
        }
    };

    InfoAdicional = () => {
        return (
            alert("Disponible proximamente.")
        );
    }

    fnEliminaPersona = async (persona) => {
        await helpers.authAxios.delete(this.url + "/persona/" + persona.per_Id_Persona)
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
        return infoStatus;
    }

    getSector = async () => {
        if (localStorage.getItem('sector') !== null) {
            await helpers.authAxios.get(this.url + "/sector/" + localStorage.getItem('sector'))
                .then(res => {
                    this.setState({
                        sector: res.data.sector[0]
                    });
                });
        }
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

        let getHogar = await helpers.authAxios.get(this.url + "/Hogar_Persona/GetHogarByPersona/" + persona.per_Id_Persona)
            .then(res => res.data);

        await helpers.authAxios.get(this.url + "/Hogar_Persona/GetDatosHogarDomicilio/" + getHogar.hd_Id_Hogar)
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

    handle_filtroPorNombre = (e) => {
        this.setState({ fNombre: e.target.value })
        if (e.target.value !== '') {
            var result = this.state.personas.filter((obj) => {
                const query = e.target.value.toLowerCase();
                return (
                    obj.persona.per_Nombre.toLowerCase().includes(query)
                    || obj.persona.per_Apellido_Paterno.toLowerCase().includes(query)
                    || obj.persona.per_Apellido_Materno.toLowerCase().includes(query)
                );
            });
            this.setState({ personas: result });
        }
    }

    handle_filtroPorCategoria = (e) => {
        this.setState({ fCategoria: e.target.value })
        if (e.target.value !== '0') {
            var result = this.state.personas.filter((obj) => {
                return obj.persona.per_Categoria.startsWith(e.target.value)
            });
            this.setState({ personas: result })
        }
    }

    handle_filtroPorGrupo = (e) => {
        this.setState({ fGrupo: e.target.value })
        if (e.target.value !== '0') {
            let boolBautizado = e.target.value === "bautizado" ? true : false;
            var result = this.state.personas.filter((obj) => {
                return obj.persona.per_Bautizado === boolBautizado
            });
            this.setState({ personas: result })
        }
    }

    handle_filtroPorSector = (e) => {
        this.setState({ fSector: e.target.value })
        if (e.target.value !== '0') {
            var result = this.state.personas.filter((obj) => {
                return obj.persona.sec_Id_Sector === parseInt(e.target.value)
            });
            this.setState({ personas: result })
        }
    }

    handle_filtroPorProfesion = (e) => {
        this.setState({ fProfesionOficio: e.target.value });
        if (e.target.value !== '') {
            var result = this.state.personas.filter((obj) => {
                const query = e.target.value.toLowerCase();
                return (
                    obj.persona.profesionOficio1[0].pro_Sub_Categoria.toLowerCase().includes(query)
                    || obj.persona.profesionOficio1[0].pro_Categoria.toLowerCase().includes(query)
                    || obj.persona.profesionOficio2[0].pro_Sub_Categoria.toLowerCase().includes(query)
                    || obj.persona.profesionOficio2[0].pro_Categoria.toLowerCase().includes(query)
                );
            });
            this.setState({ personas: result });
        }
    }

    handle_BorrarFiltros = () => {
        this.setState({
            personas: this.state.tempPersonas,
            fCategoria: '0',
            fNombre: '',
            fGrupo: '0',
            fSector: '0',
            fProfesionOficio: ''
        })
    }

    handle_showModalInfoHogar = async (info) => {
        this.setState({
            objPersona: info,
            modalInfoHogar: true
        })
    }

    handle_closeModalInfoHogar = () => {
        this.setState({ modalInfoHogar: false })
    }

    handle_LinkEncabezado = (seccion, componente, info) => {
        localStorage.setItem('seccion', seccion);
        localStorage.setItem('componente', componente);
        localStorage.setItem('objPersona', JSON.stringify(info));
    }

    hojaDatosEstadisticosPDF = (info) => {
        console.log(info);
        const doc = new jsPDF("p", "mm", "letter");
        doc.addImage(nvologo, 'PNG', 5, 0, 80, 30);
        doc.text("DATOS ESTADISTICOS", 110, 19);
        doc.line(10, 32, 200, 32);

        doc.setFontSize(9)
        doc.text(`1.- Nombre(s): ${info.persona.per_Nombre} ${info.persona.per_Apellido_Paterno} ${info.persona.per_Apellido_Materno}`, 13, 40);
        doc.text(`2.- Edad: ${info.persona.edad}`, 13, 46);
        doc.text(`Nacionalidad: ${info.persona.per_Nacionalidad}`, 50, 46);
        doc.text(`3.- Lugar y fecha de nacimiento: ${info.persona.per_Lugar_De_Nacimiento}, EN FECHA: ${info.persona.per_Fecha_Nacimiento}`, 13, 52);
        doc.text(`4.- Nombre de sus padres: ${info.persona.per_Nombre_Padre}, ${info.persona.per_Nombre_Madre}`, 13, 58);
        doc.text(`5.- Abuelos paternos: ${info.persona.per_Nombre_Abuelo_Paterno}, ${info.persona.per_Nombre_Abuela_Paterna}`, 13, 64);
        doc.text(`6.- Abuelos maternos: ${info.persona.per_Nombre_Abuelo_Materno}, ${info.persona.per_Nombre_Abuela_Materna}`, 13, 70);
        doc.text(`7.- Estado civil: ${info.persona.per_Estado_Civil}`, 13, 76);
        doc.text(`Fecha boda civil: ${info.persona.per_Fecha_Boda_CivilFormateada}`, 120, 76);
        doc.text(`Segun Acta No.: ${info.persona.per_Num_Acta_Boda_Civil}`, 18, 82);
        doc.text(`Del libro No.: ${info.persona.per_Libro_Acta_Boda_Civil}`, 70, 82);
        doc.text(`Que lleva la oficialia.: ${info.persona.per_Oficialia_Boda_Civil}`, 120, 82);
        doc.text(`Del registro civil en: ${info.persona.per_Registro_Civil}`, 18, 88);
        doc.text(`8.- Contrajo matrimonio eclesiastico en la IECE el día: ${info.persona.per_Fecha_Boda_Eclesiastica}`, 13, 94);
        doc.text(`Lugar de matrimonio eclesiastico en la IECE: ${info.persona.per_Lugar_Boda_Eclesiastica}`, 18, 100);
        doc.text(`9.- Nombre de esposa(o): ${info.persona.per_Nombre_Conyuge}`, 13, 106);
        doc.text(`10.- Cuantos hijos y sus nombres: ${info.persona.per_Cantidad_Hijos}`, 13, 112);
        doc.text(`${info.persona.per_Nombre_Hijos}`, 75, 112);
        doc.text(`11.- Lugar y fecha de bautismo: ${info.persona.per_Lugar_Bautismo}, EN FECHA: ${info.persona.per_Fecha_Bautismo}`, 13, 118);
        doc.text(`12.- Por quien fue bautizado: ${info.persona.per_Ministro_Que_Bautizo}`, 13, 124);
        doc.text(`13.- Fecha en la que recibio la Promesa del Espiritu Santo: ${info.persona.per_Ministro_Que_Bautizo}`, 13, 130);
        doc.text(`Bajo la imposicion de manos del presbiterio: ${info.persona.per_Bajo_Imposicion_De_Manos}`, 20, 136);
        doc.text(`14.- Puestos desempeñados en la IECE: ${info.persona.per_Cargos_Desempenados}`, 13, 142);
        doc.text(`15.- Cambios de domicilio: ${info.persona.per_Cambios_De_Domicilio}`, 13, 148);
        doc.text(`16.- Domicilio actual: ${info.domicilio[0].hd_Calle} ${info.domicilio[0].hd_Numero_Exterior}, Interior: ${info.domicilio[0].hd_Numero_Interior}, ${info.domicilio[0].hd_Tipo_Subdivision} ${info.domicilio[0].hd_Subdivision}, ${info.domicilio[0].hd_Municipio_Ciudad}, ${info.domicilio[0].est_Nombre}, ${info.domicilio[0].pais_Nombre_Corto}`, 13, 154);
        doc.text(`17.- Telefonos: ${info.persona.per_Telefono_Movil}`, 13, 160);
        doc.text(`18.- Profesion / Oficio1: ${info.persona.profesionOficio1[0].pro_Categoria} / ${info.persona.profesionOficio1[0].pro_Sub_Categoria}`, 13, 166);
        doc.text(`Profesion / Oficio2: ${info.persona.profesionOficio2[0].pro_Categoria} / ${info.persona.profesionOficio2[0].pro_Sub_Categoria}`, 19, 172);
        doc.line(30, 250, 90, 250);
        doc.text("FECHA", 54, 255);
        doc.line(120, 250, 180, 250);
        doc.text("LA COMISION", 142, 255);
        doc.save("HojaDatosEstadisticos.pdf");
    }

    render() {
        /*  if (this.state.personas.length >= 1) { */
        return (
            <Layout>
                {/* <h1 className="text-info">Listado de personal</h1> */}
                <Container>
                    <Row>
                        <Col xs="9">
                            {localStorage.getItem('sector') !== null &&
                                <p>
                                    Personal del {this.state.sector.dis_Tipo_Distrito} {this.state.sector.dis_Numero} ({this.state.sector.dis_Alias}, {this.state.sector.dis_Area}) <br />
                                    {this.state.sector.sec_Tipo_Sector} {this.state.sector.sec_Numero}: {this.state.sector.sec_Alias}
                                </p>
                            }
                            {localStorage.getItem('sector') === null &&
                                <p> Personal de TODOS los SECOTRES del DISTRITO. </p>
                            }
                        </Col>
                        <Col xs="2">
                            {/* <Link to="/RegistroDePersona" className="btn bnt-sm btn-primary">Registrar persona</Link> */}
                            {/* <button onClick={helpers.handle_RegistroNvaPersona} className="btn bnt-sm btn-primary">Registrar persona</button> */}
                        </Col>
                    </Row>

                    {/* SECCION DE FILTROS 1 */}
                    <Row>
                        <Col xs="3">
                            <Input
                                type="select"
                                onChange={this.handle_filtroPorSector}
                                value={this.state.fSector}
                            >
                                {localStorage.getItem('sector') === null &&
                                    <React.Fragment>
                                        <option value="0">TODOS LOS SECTORES</option>
                                        {this.state.sectores.map(sector => {
                                            return (
                                                <React.Fragment key={sector.sec_Id_Sector}>
                                                    <option value={sector.sec_Id_Sector}>{sector.sec_Tipo_Sector}: {sector.sec_Alias}</option>
                                                </React.Fragment>
                                            )
                                        })
                                        }
                                    </React.Fragment>
                                }
                                {localStorage.getItem('sector') !== null &&
                                    <React.Fragment>
                                        {this.state.sectores.map(sector => {
                                            return (
                                                <React.Fragment key={sector.sec_Id_Sector}>
                                                    <option value={sector.sec_Id_Sector}>{sector.sec_Tipo_Sector}: {sector.sec_Alias}</option>
                                                </React.Fragment>
                                            )
                                        })
                                        }
                                    </React.Fragment>
                                }
                            </Input>
                            <Label>Filtro por sector</Label>
                        </Col>
                        <Col xs="3">
                            <Input
                                type="text"
                                placeholder='Ej: Nombre o Apellido'
                                value={this.state.fNombre}
                                onChange={this.handle_filtroPorNombre}
                            >
                            </Input>
                            <Label>Filtro por nombre</Label>
                        </Col>
                        <Col xs="3">
                            <Input
                                type="select"
                                value={this.state.fGrupo}
                                onChange={this.handle_filtroPorGrupo}
                            >
                                <option value="0">TODOS</option>
                                <option value="bautizado">Bautizado</option>
                                <option value="noBautizado">No bautizado</option>
                            </Input>
                            <Label>Filtro por grupo</Label>
                        </Col>
                        <Col xs="3">
                            <Input
                                type="select"
                                value={this.state.fCategoria}
                                onChange={this.handle_filtroPorCategoria}
                            >
                                <option value="0">TODOS</option>
                                <option value="ADULTO_HOMBRE">Adulto hombre</option>
                                <option value="ADULTO_MUJER">Adulto mujer</option>
                                <option value="JOVEN_HOMBRE">Jóven hombre</option>
                                <option value="JOVEN_MUJER">Jóven mujer</option>
                                <option value="NIÑO">Niños</option>
                                <option value="NIÑA">Niñas</option>
                            </Input>
                            <Label>Filtro por categoria</Label>
                        </Col>
                    </Row>

                    {/* SECCION DE FILTROS 2 */}
                    <Row>
                        <Col xs="3">
                            <Input
                                type="text"
                                placeholder='Ej: Medico, Carpintero'
                                value={this.state.fProfesionOficio}
                                onChange={this.handle_filtroPorProfesion}
                            />
                            <Label>Filtro por profesión/ocupación</Label>
                        </Col>
                        <Col xs="3">
                            <Button
                                type="button"
                                onClick={this.handle_BorrarFiltros}
                            >
                                Reiniciar filtros.
                            </Button>
                        </Col>
                    </Row>
                    {this.state.personas.length >= 1 &&

                        <React.Fragment>
                            {/* TABLA: LISTA DE PERSONAS */}
                            <table className="table" id="tblPersonas">
                                <thead>
                                    <tr>
                                        <th scope="col">Nombre</th>
                                        <th scope="col" className="text-center">Grupo</th>
                                        <th scope="col" className="text-center">Categoria</th>
                                        <th scope="col" className="text-center">Activo</th>
                                        {/* <th scope="col" className="text-center">Vivo</th> */}
                                        <th scope="col" className="text-center">Sector</th>
                                        <th scope="col" className="text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.personas.map((obj) => {
                                            return (
                                                <React.Fragment key={obj.persona.per_Id_Persona}>
                                                    <tr>
                                                        <td>{obj.persona.per_Nombre} {obj.persona.per_Apellido_Paterno} {obj.persona.per_Apellido_Materno} </td>
                                                        <td className="text-center">
                                                            {this.InfoStatus(obj.persona).bautizado}
                                                        </td>
                                                        <td className="text-center">
                                                            {obj.persona.per_Categoria}
                                                        </td>
                                                        <td className="text-center">
                                                            {this.InfoStatus(obj.persona).activo}
                                                        </td>
                                                        <td className="text-center">
                                                            {obj.persona.sec_Numero}
                                                        </td>
                                                        <td className="text-center">
                                                            <Link
                                                                // onClick={this.handle_modalInfoPersona}
                                                                onClick={() => this.handle_LinkEncabezado("Seccion: ", "Analisis Personal", obj)}
                                                                className="btn btn-success btn-sm btnMarginRight"
                                                                title="Analizar persona"
                                                                to="/AnalisisPersonal"
                                                            >
                                                                <span className="fas fa-eye icon-btn-p"></span>Analizar
                                                            </Link>
                                                            <button
                                                                // onClick={this.handle_modalInfoPersona}
                                                                onClick={() => this.handle_showModalInfoHogar(obj)}
                                                                className="btn btn-info btn-sm btnMarginRight"
                                                                title="Hogar">
                                                                <span className="fas fa-home icon-btn-p"></span>Hogar
                                                            </button>
                                                            <button
                                                                // onClick={this.handle_modalInfoPersona}
                                                                onClick={() => this.hojaDatosEstadisticosPDF(obj)}
                                                                className="btn btn-danger btn-sm"
                                                                title="Hoja de datos">
                                                                <span className="fas fa-file-pdf icon-btn-p"></span>Hoja Datos
                                                            </button>

                                                        </td>
                                                    </tr>

                                                    {/* MODAL INFORMACION DE LA PERSONA (OBSOLETO) */}
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
                                                            <ModalFooter>
                                                                <Button color="secondary" onClick={this.handle_modalInfoPersonaClose}>Cancel</Button>
                                                                <Button
                                                                    color="danger"
                                                                    onClick={() => helpers.ToPDF("infoDatosEstadisticos")} >
                                                                    <span className="fas fa-file-pdf icon-btn-p"></span>Generar PDF
                                                                </Button>
                                                                <Button
                                                                    color="success"
                                                                    onClick={() => this.handle_editarPersona(this.state.currentPersona)} >
                                                                    <span className="fas fa-pencil-alt icon-btn-p"></span>Editar
                                                                </Button>
                                                            </ModalFooter>
                                                        </Container>
                                                    </Modal>
                                                </React.Fragment>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>

                            {/* MODAL: INFORMACION DEL HOGAR */}
                            <Modal
                                isOpen={this.state.modalInfoHogar}
                                onRequestClose={this.handle_closeModalInfoHogar}
                                size="lg"
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle><h4>INFORMACION DE HOGAR</h4></CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        <ModalInfoHogar
                                            objPersona={this.state.objPersona}
                                        />
                                    </CardBody>
                                    <CardFooter>
                                        <Button
                                            type="button"
                                            onClick={this.handle_closeModalInfoHogar}
                                        >
                                            Cerrar
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </Modal>

                            {/* MODAL: ELIMINAR UNA PERSONA (OBSOLETO) */}
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
                        </React.Fragment>
                    }
                    {this.state.personas.length === 0 &&
                        <React.Fragment>
                            <h3>Aun no hay personas registras o no hay coincidencias con el filtro!</h3>
                            {/* <p>Haga clic en el boton Registrar persona para registrar una persona.</p> */}
                        </React.Fragment>
                    }

                </Container>
            </Layout>
        )

    };
}

export default ListaDePersonal;