import React, { Component } from 'react';
import helpers from '../../components/Helpers';
import {
    Button, Input, Alert, Container, Row, Col, Card, FormFeedback, ButtonGroup, InputGroup,
    Form, FormGroup, CardBody, CardFooter, ListGroup, ListGroupItem
} from 'reactstrap';
// import { Link } from 'react-router-dom';
// import HogarPersonaDomicilio from './HogarPersonaDomicilio';
import './style.css'

import rutaLogo from '../../assets/images/IECE_LogoOficial.jpg'
import moment from 'moment/moment';

class InformeAnualPastor extends Component {
    infoSesion = JSON.parse(localStorage.getItem('infoSesion'));
    maxPaginas = 2;
    constructor(props) {
        super(props);
        this.state = {
            informe: {
                idInforme: 0,
                idTipoUsuario: 0, //1 Pastor 2 Obispo
                mes: 0,
                nombreMes: null,
                anio: null,
                idDistrito: 0,
                idSector: 0,
                lugarReunion: null,
                fechaReunion: null,
                status: 0,
                usu_id_usuario: 0,
                fechaRegistro: null,
            },
            sector: {
                sec_Id_Sector: 0,
                sec_Numero: 0,
                sec_Alias: ''
            },
            distrito: {
                dis_Numero: 0,
                dis_Alias: ''
            },
            misiones: [],
            desgloseMoviemientoEstadistico: [],
            visitasPastor: {
                porPastor: 0,
                porAncianosAux: 0,
                porDiaconos: 0,
                porAuxiliares: 0
            },
            cultosSector: {
                ordinarios: 0,
                especiales: 0,
                deAvivamiento: 0,
                deAniversario: 0,
                porElDistrito: 0
            },
            estudiosSector: {
                estudios: {
                    idEstudioSector: 0,
                    idInforme: 0,
                    idTipoEstudio: 1,
                    escuelaDominical: 0,
                    varonil: 0,
                    femenil: 0,
                    juvenil: 0,
                    infantil: 0,
                    iglesia: 0,
                },
                conferencias: {
                    idEstudioSector: 0,
                    idInforme: 0,
                    idTipoEstudio: 2,
                    escuelaDominical: 0,
                    varonil: 0,
                    femenil: 0,
                    juvenil: 0,
                    infantil: 0,
                    iglesia: 0,
                }
            },
            cultosMisionesLocales: {
                nombreMision: '',
                idMisionLocal: 0,
                numCultos: 0
            },
            trabajoEvangelismo: {
                hogaresVisitados: 0,
                hogaresConquistados: 0,
                cultosPorLaLocalidad: 0,
                cultosDeHogar: 0,
                campanias: 0,
                aperturaDeMisiones: 0,
                bautismos: 0,
                visitantesPermanentes: 0,
            },
            organizaciones: {
                sociedadFemenil: 0,
                sociedadJuvenil: 0,
                departamentoFemenil: 0,
                departamentoJuvenil: 0,
                departamentoInfantil: 0,
                coros: 0,
                gruposDeCanto: 0,
            },
            adquisicionesSector: {
                predios: 0,
                casas: 0,
                edificios: 0,
                templos: 0,
                vehiculos: 0
            },
            sesiones: {
                enElDistrito: 0,
                conElPersonalDocente: 0,
                conSociedadesFemeniles: 0,
                conSociedadesJuveniles: 0,
                conDepartamentosInfantiles: 0,
                conCorosYGruposDeCanto: 0
            },
            reuniones: {
                enElDistrito: 0,
                conElPersonalDocente: 0,
                conSociedadesFemeniles: 0,
                conSociedadesJuveniles: 0,
                conDepartamentosInfantiles: 0,
                conCorosYGruposDeCanto: 0
            },
            construccionesInicio: {
                idTipoFaseConstruccion: 1,
                colocacionPrimeraPiedra: 0,
                templo: 0,
                casaDeOracion: 0,
                casaPastoral: 0,
                anexos: 0,
                remodelacion: 0
            },
            construccionesConclusion: {
                idTipoFaseConstruccion: 2,
                colocacionPrimeraPiedra: 0,
                templo: 0,
                casaDeOracion: 0,
                casaPastoral: 0,
                anexos: 0,
                remodelacion: 0
            },
            ordenaciones: {
                ancianos: 0,
                diaconos: 0
            },
            dedicaciones: {
                templos: 0,
                casasDeOracion: 0
            },
            llamamientoDePersonal: {
                diaconosAprueba: 0,
                auxiliares: 0,
            },
            regularizacionPatNac: {
                templos: 0,
                casasPastorales: 0,
            },
            regularizacionPatIg: {
                templos: 0,
                casasPastorales: 0,
            },
            movimientoEconomico: {
                existenciaAnterior: 0,
                entradaMes: 0,
                sumaTotal: 0,
                gastosAdmon: 0,
                transferenciasAentidadSuperior: 0,
                existenciaEnCaja: 0
            },
            datosEstadisticos: {
                altasBautizados: {
                    altaHogar: 0,
                    bautismo: 0,
                    cambiodedomexterno: 0,
                    cambiodedominterno: 0,
                    restitución: 0
                },
                altasNoBautizados: {
                    cambiodedomexterno: 0,
                    cambiodedominterno: 0,
                    nuevoingreso: 0,
                    reactivacion: 0,
                },
                bajasBautizados: {
                    defuncion: 0,
                    excomuniontemporal: 0,
                    excomunion: 0,
                    cambiodedominterno: 0,
                    cambiodedomexterno: 0,
                    bajahogar: 0
                },
                bajaNoBautizados: {
                    defuncion: 0,
                    alejamiento: 0,
                    cambiodedomiciliointerno: 0,
                    cambiodedomicilioexterno: 0,
                    pasaapersonalbautizado: 0,
                    porbajadepadres: 0
                },
                hogares: 0,
                personasBautizadas: 0,
                personasNoBautizadas: 0,
                matrimonios: 0,
                legalizaciones: 0,
                presentaciones: 0,
            },
            pagina: 1
        }
    }

    togglePage(page) {
        if (page <= this.maxPaginas && page > 0) {
            this.setState({ pagina: page })
        }
    }

    componentDidMount() {
        this.getDistrito();
        this.getSector();
    }

    getDistrito = async () => {
        await helpers.validaToken().then(helpers.authAxios.get('/Distrito/' + localStorage.getItem('dto'))
            .then(res => {
                this.setState({
                    distrito: res.data
                })
                console.log(res.data);
            })
        );
    }

    getSector = async () => {
        await helpers.validaToken().then(helpers.authAxios.get('/Sector/' + localStorage.getItem('sector'))
            .then(res => {
                this.setState({
                    sector: res.data.sector[0]
                })
                const { id } = this.props.match.params;
                this.obtenerInforme(id);
                console.log(res.data);
            })
        );
    }

    obtenerDatosEstadisticos = async () => {
        const body = {
            sec_Id_Sector: this.state.sector.sec_Id_Sector,
            year: this.state.informe.anio,
            mes: this.state.informe.mes
        }
        await helpers.validaToken().then(helpers.authAxios.post("Registro_Transacciones/movimientosEstadisticosReporteBySector", body)
            .then(res => {
                console.log(res);
                this.setState({
                    datosEstadisticos: res.data
                })
            })
        );
    }

    obtenerInforme = async (id) => {
        await helpers.validaToken().then(helpers.authAxios.get("/InformeAnualPastor/" + id)
            .then(res => {
                this.state.informe = res.data;
                this.state.informe.fechaReunion = moment(res.data.fechaReunion).format('YYYY-MM-DD');
                this.state.visitasPastor = res.data.visitasPastor !== null ? res.data.visitasPastor : this.state.visitasPastor;
                this.state.cultosSector = res.data.cultosSector !== null ? res.data.cultosSector : this.state.cultosSector;
                this.state.estudiosSector.estudios = res.data.estudiosSector !== null ? res.data.estudiosSector : this.state.estudiosSector.estudios;
                this.state.estudiosSector.conferencias = res.data.conferenciasSector !== null ? res.data.conferenciasSector : this.state.estudiosSector.conferencias;
                this.state.trabajoEvangelismo = res.data.trabajoEvangelismo !== null ? res.data.trabajoEvangelismo : this.state.trabajoEvangelismo;
                this.state.misiones = res.data.cultosMisionSector !== null ? res.data.cultosMisionSector : this.state.cultosMisionSector;
                this.state.organizaciones = res.data.organizaciones !== null ? res.data.organizaciones : this.state.organizaciones;
                this.state.adquisicionesSector = res.data.adquisicionesSector !== null ? res.data.adquisicionesSector : this.state.adquisicionesSector;
                this.state.sesiones = res.data.sesiones !== null ? res.data.sesiones : this.state.sesiones;
                this.state.reuniones = res.data.reuniones !== null ? res.data.reuniones : this.state.reuniones;
                this.state.construccionesInicio = res.data.construccionesInicio !== null ? res.data.construccionesInicio : this.state.construccionesInicio;
                this.state.construccionesConclusion = res.data.construccionesConclusion !== null ? res.data.construccionesConclusion : this.state.construccionesConclusion;
                this.state.ordenaciones = res.data.ordenaciones !== null ? res.data.ordenaciones : this.state.ordenaciones;
                this.state.dedicaciones = res.data.dedicaciones !== null ? res.data.dedicaciones : this.state.dedicaciones;
                this.state.llamamientoDePersonal = res.data.llamamientoDePersonal !== null ? res.data.llamamientoDePersonal : this.state.llamamientoDePersonal;
                this.state.regularizacionPatNac = res.data.regularizacionPatNac !== null ? res.data.regularizacionPatNac : this.state.regularizacionPatNac;
                this.state.regularizacionPatIg = res.data.regularizacionPatIg !== null ? res.data.regularizacionPatIg : this.state.regularizacionPatIg;
                this.state.movimientoEconomico = res.data.movimientoEconomico !== null ? res.data.movimientoEconomico : this.state.movimientoEconomico;
                this.obtenerMisiones();
                this.obtenerDatosEstadisticos();
                this.obtenerMovimientosEstadisticos();
                console.log(res);
            })
        );
    }

    obtenerMisiones = async (id) => {
        await helpers.validaToken().then(helpers.authAxios.get("/Mision_Sector/" + localStorage.getItem('sector'))
            .then(res => {
                const cultosMisionCopia = [...this.state.misiones]
                this.state.misiones = res.data.misiones.map(m => {
                    const cultoMision = cultosMisionCopia.find(f => f.ms_Id_MisionSector === m.ms_Id)
                    return {
                        ...m,
                        ms_Id_MisionSector: m.ms_Id,
                        idInforme: cultoMision ? cultoMision.idInforme : 0,
                        cultos: cultoMision ? cultoMision.cultos : 0,
                    }
                }
                );
                console.log(this.state.misiones);
            })
        );
    }

    obtenerMovimientosEstadisticos = async () => {

        const startDate = moment([this.state.informe.anio, this.state.informe.mes - 1]).startOf('month').format("YYYY-MM-DD");
        const endDate = moment([this.state.informe.anio, this.state.informe.mes - 1]).endOf('month').format("YYYY-MM-DD");
        const body = {
            fechaInicial: startDate,
            fechaFinal: endDate,
            idSectorDistrito: this.state.sector.sec_Id_Sector,
        }
        await helpers.validaToken().then(helpers.authAxios.post("/Historial_Transacciones_Estadisticas/HistorialPorFechaSector", body)
            .then(res => {
                this.state.desgloseMoviemientoEstadistico = res.data.datos;
                console.log("res-data-datos: ", res.data.datos);
            })

        )
    }

    handleChange(event) {
        event.persist();
        const { name, value } = event.target;

        // Divide el nombre para obtener un array de claves
        const keys = name.split('.');

        // Crea una copia profunda del estado actual
        const newState = { ...this.state };

        // Accede al objeto o array específico
        let currentObject = newState;
        for (let i = 0; i < keys.length - 2; i++) { // -2 para dejar fuera el índice y la propiedad final
            currentObject = currentObject[keys[i]];
        }

        // Si el segundo último elemento es un número, es un índice de un array
        const maybeIndex = parseInt(keys[keys.length - 2], 10);
        if (!isNaN(maybeIndex)) {
            // Actualiza el valor en el array
            currentObject[maybeIndex][keys[keys.length - 1]] = Number(value);
        } else {
            // Caso de propiedad de objeto regular
            currentObject[keys[keys.length - 2]][keys[keys.length - 1]] = value;
        }

        // Actualiza el estado con la nueva copia
        this.setState(newState);
        console.log(newState);
    }

    actualizarInforme = async (e) => {
        e.preventDefault()
        this.state.movimientoEconomico.sumaTotal = this.state.movimientoEconomico.existenciaAnterior + this.state.movimientoEconomico.entradaMes;
        this.state.movimientoEconomico.existenciaEnCaja = this.state.movimientoEconomico.sumaTotal - (this.state.movimientoEconomico.gastosAdmon + this.state.movimientoEconomico.transferenciasAentidadSuperior);
        const data = {
            idInforme: this.state.informe.idInforme,
            idTipoUsuario: 1,
            idDistrito: this.state.informe.idDistrito,
            idSector: this.state.informe.idSector,
            lugarReunion: this.state.informe.lugarReunion,
            fechaReunion: this.state.informe.fechaReunion,
            status: this.state.informe.status,
            usu_id_usuario: this.infoSesion.pem_Id_Ministro,
            fechaRegistro: null,
            visitasPastor: this.state.visitasPastor,
            cultosSector: this.state.cultosSector,
            estudiosSector: this.state.estudiosSector.estudios,
            conferenciasSector: this.state.estudiosSector.conferencias,
            trabajoEvangelismo: this.state.trabajoEvangelismo,
            CultosMisionSector: this.state.misiones,
            organizaciones: this.state.organizaciones,
            adquisicionesSector: this.state.adquisicionesSector,
            reuniones: this.state.reuniones,
            sesiones: this.state.sesiones,
            construccionesInicio: this.state.construccionesInicio,
            construccionesConclusion: this.state.construccionesConclusion,
            ordenaciones: this.state.ordenaciones,
            dedicaciones: this.state.dedicaciones,
            llamamientoDePersonal: this.state.llamamientoDePersonal,
            regularizacionPatNac: this.state.regularizacionPatNac,
            regularizacionPatIg: this.state.regularizacionPatIg,
            movimientoEconomico: this.state.movimientoEconomico,
        }

        await helpers.validaToken().then(helpers.authAxios.put("/InformeAnualPastor/" + data.idInforme, data)
            .then(res => {
                if (res.status === 200) {
                    alert('Informe guardado con éxito.');
                }
                else {
                    alert(res.data.mensaje)
                }
            })
        )
    }



    render() {
        return (
            <Container>
                <Card>
                    <Form onSubmit={this.guardar}>
                        <CardBody>
                            {this.state.pagina === 1 ?
                                <FormGroup className='contenedor-informe'>
                                    <Row>
                                        <Col xs="12" sm="12" lg="12">
                                            <img src={rutaLogo} className='logo-informe'></img>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="12" sm="12" lg="12">
                                            <p>
                                                INFORME QUE RINDE EL PASTOR DEL SECTOR NO. <b>{this.state.sector.sec_Numero}</b> CON BASE EN: <b> {this.state.sector.sec_Alias + ' '} </b>
                                                AL DISTRITO NUMERO <b>{this.state.distrito.dis_Numero}</b> CON ASIENTO EN <b>{this.state.distrito.dis_Alias}</b> DEL TRABAJO Y MOVIMIENTO REGISTRADO
                                                DURANTE EL MES DE <b>{this.state.informe.nombreMes}</b> DE <b>{this.state.informe.anio}.</b>
                                            </p>
                                        </Col>
                                    </Row>
                                    <Row className='contenedor-seccion'>
                                        <Col xs="12" sm="12" lg="12">
                                            <Row className='titulo'>
                                                ACTIVIDADES DEL PERSONAL DOCENTE
                                            </Row>
                                            <Row className='subtitulos'>
                                                <Col xs="3" sm="3" lg="3">
                                                    VISITAS A HOGARES
                                                </Col>
                                                <Col xs="3" sm="3" lg="3">
                                                    CULTOS EN LA BASE
                                                </Col>
                                                <Col xs="6" sm="6" lg="6">
                                                    <Row>
                                                        <Col xs="12" sm="12" lg="12">
                                                            ESTUDIOS BIBLICOS Y CONFERENCIAS
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4"> </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            ESTUDIOS
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            CONFERENCIAS
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row className='lista-elementos'>
                                                <Col xs="3" sm="3" lg="3">
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Por el pastor
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='visitasPastor.porPastor'
                                                                value={this.state.visitasPastor.porPastor}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Por Ancianos Auxiliares
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='visitasPastor.porAncianosAux'
                                                                value={this.state.visitasPastor.porAncianosAux}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Por Diaconos
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='visitasPastor.porDiaconos'
                                                                value={this.state.visitasPastor.porDiaconos}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Por Auxiliares
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='visitasPastor.porAuxiliares'
                                                                value={this.state.visitasPastor.porAuxiliares}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col xs="3" sm="3" lg="3">
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Ordinarios
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='cultosSector.ordinarios'
                                                                value={this.state.cultosSector.ordinarios}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Especiales
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='cultosSector.especiales'
                                                                value={this.state.cultosSector.especiales}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            De avivamiento
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='cultosSector.deAvivamiento'
                                                                value={this.state.cultosSector.deAvivamiento}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            De aniversario
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='cultosSector.deAniversario'
                                                                value={this.state.cultosSector.deAniversario}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Por el Distrito
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='cultosSector.porElDistrito'
                                                                value={this.state.cultosSector.porElDistrito}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col xs="6" sm="6" lg="6">
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Escuela dominical
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='estudiosSector.estudios.escuelaDominical'
                                                                value={this.state.estudiosSector.estudios.escuelaDominical}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='estudiosSector.conferencias.escuelaDominical'
                                                                value={this.state.estudiosSector.conferencias.escuelaDominical}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Varonil
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='estudiosSector.estudios.varonil'
                                                                value={this.state.estudiosSector.estudios.varonil}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='estudiosSector.conferencias.varonil'
                                                                value={this.state.estudiosSector.conferencias.varonil}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Femenil
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='estudiosSector.estudios.femenil'
                                                                value={this.state.estudiosSector.estudios.femenil}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='estudiosSector.conferencias.femenil'
                                                                value={this.state.estudiosSector.conferencias.femenil}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Juvenil
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='estudiosSector.estudios.juvenil'
                                                                value={this.state.estudiosSector.estudios.juvenil}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='estudiosSector.conferencias.juvenil'
                                                                value={this.state.estudiosSector.conferencias.juvenil}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Infantil
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='estudiosSector.estudios.infantil'
                                                                value={this.state.estudiosSector.estudios.infantil}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='estudiosSector.conferencias.infantil'
                                                                value={this.state.estudiosSector.conferencias.infantil}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Iglesia
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='estudiosSector.estudios.iglesia'
                                                                value={this.state.estudiosSector.estudios.iglesia}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='estudiosSector.conferencias.iglesia'
                                                                value={this.state.estudiosSector.conferencias.iglesia}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>

                                        </Col>
                                        <Col xs="12" sm="12" lg="12">
                                            <Row className='subtitulos'>
                                                <Col xs="6" sm="6" lg="6">
                                                    CULTOS EN LAS MISIONES
                                                </Col>
                                                <Col xs="6" sm="6" lg="6">
                                                    TRABAJO DE EVANGELISMO
                                                </Col>
                                            </Row>
                                            <Row className='lista-elementos'>
                                                <Col xs="6" sm="6" lg="6">
                                                    {this.state.misiones.length > 0 && this.state.misiones.map((obj, index) => (
                                                        <Row className='elemento' key={obj.ms_Id}>
                                                            <Col xs="2" sm="2" lg="2" className='text-center'>
                                                                Misión {obj.ms_Numero}
                                                            </Col>
                                                            <Col xs="6" sm="6" lg="6" className='text-center'>
                                                                {obj.ms_Alias}
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2" className='text-center'>
                                                                Cultos
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    name={`misiones.${index}.cultos`}
                                                                    value={this.state.misiones[index].cultos}
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                            </Col>
                                                        </Row>
                                                    ))}
                                                </Col>
                                                <Col xs="6" sm="6" lg="6">
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Hogares visitados
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='trabajoEvangelismo.hogaresVisitados'
                                                                value={this.state.trabajoEvangelismo.hogaresVisitados}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Hogares conquistados
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='trabajoEvangelismo.hogaresConquistados'
                                                                value={this.state.trabajoEvangelismo.hogaresConquistados}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Visitantes permanentes
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='trabajoEvangelismo.visitantesPermanentes'
                                                                value={this.state.trabajoEvangelismo.visitantesPermanentes}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Cultos por la localidad
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='trabajoEvangelismo.cultosPorLaLocalidad'
                                                                value={this.state.trabajoEvangelismo.cultosPorLaLocalidad}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Cultos de Hogar
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='trabajoEvangelismo.cultosDeHogar'
                                                                value={this.state.trabajoEvangelismo.cultosDeHogar}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Campañas
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='trabajoEvangelismo.campanias'
                                                                value={this.state.trabajoEvangelismo.campanias}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Apertura de Misiones
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='trabajoEvangelismo.aperturaDeMisiones'
                                                                value={this.state.trabajoEvangelismo.aperturaDeMisiones}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Bautismos
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='trabajoEvangelismo.bautismos'
                                                                value={this.state.trabajoEvangelismo.bautismos}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col className='text-right my-2'>
                                                    <Button
                                                        type="button"
                                                        color="success"
                                                        className=""
                                                        onClick={this.actualizarInforme}
                                                    >
                                                        Guardar cambios
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row className='contenedor-seccion'>
                                        <Col xs="12" sm="12" lg="12">
                                            <Row className='titulo'>
                                                DATOS DEL ESTADO ACTUAL DE LA IGLESIA
                                            </Row>
                                            <Row className='titulo'>
                                                Número de personal en comunión al principio del mes {this.state.informe.nombreMes}
                                            </Row>
                                            <Row className='subtitulos'>
                                                <Col xs="6" sm="6" lg="6">
                                                    ALTAS
                                                </Col>
                                                <Col xs="6" sm="6" lg="6">
                                                    BAJAS
                                                </Col>
                                            </Row>
                                            <Row className='lista-elementos'>
                                                <Col xs="6" sm="6" lg="6">
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Por bautismo
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='datosEstadisticos.altasBautizados.bautismo'
                                                                value={this.state.datosEstadisticos.altasBautizados.bautismo}
                                                                readOnly></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Por restitución a la comunión
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='datosEstadisticos.altasBautizados.restitución'
                                                                value={this.state.datosEstadisticos.altasBautizados.restitución}
                                                                readOnly></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Por cambio de domicilio
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='datosEstadisticos.altasBautizados.cambiodedomexterno'
                                                                value={this.state.datosEstadisticos.altasBautizados.cambiodedomexterno}
                                                                readOnly></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Total de altas
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='datosEstadisticos.altasBautizados.cambiodedomexterno'
                                                                value={this.state.datosEstadisticos.altasBautizados.bautismo + this.state.datosEstadisticos.altasBautizados.restitución + this.state.datosEstadisticos.altasBautizados.cambiodedomexterno}
                                                                readOnly></Input>
                                                            <span className='font-weight-bold text-lg'>{ }</span>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Matrimonios
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='datosEstadisticos.matrimonios'
                                                                value={this.state.datosEstadisticos.matrimonios}
                                                                readOnly></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Presentación de niños
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='datosEstadisticos.presentaciones'
                                                                value={this.state.datosEstadisticos.presentaciones}
                                                                readOnly></Input>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col xs="6" sm="6" lg="6">
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Por defunción
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='datosEstadisticos.bajasBautizados.defuncion'
                                                                value={this.state.datosEstadisticos.bajasBautizados.defuncion}
                                                                readOnly></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Por excomunión
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='datosEstadisticos.bajasBautizados.excomunion'
                                                                value={this.state.datosEstadisticos.bajasBautizados.excomunion}
                                                                readOnly></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Por cambio de domicilio
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='datosEstadisticos.bajasBautizados.cambiodedomexterno'
                                                                value={this.state.datosEstadisticos.bajasBautizados.cambiodedomexterno}
                                                                readOnly></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Total de bajas
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='datosEstadisticos.bajasBautizados.cambiodedomexterno'
                                                                value={this.state.datosEstadisticos.bajasBautizados.defuncion + this.state.datosEstadisticos.bajasBautizados.excomunion + this.state.datosEstadisticos.bajasBautizados.cambiodedomexterno}
                                                                readOnly></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Legalizaciones
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='datosEstadisticos.legalizaciones'
                                                                value={this.state.datosEstadisticos.legalizaciones}
                                                                readOnly></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            No. de hogares
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='datosEstadisticos.hogares'
                                                                value={this.state.datosEstadisticos.hogares}
                                                                readOnly></Input>
                                                        </Col>
                                                    </Row>

                                                </Col>
                                            </Row>

                                        </Col>
                                        <Col xs="12" sm="12" lg="12">
                                            <Row className='subtitulos'>
                                                <Col xs="6" sm="6" lg="6">
                                                    PERSONAL BAUTIZADO
                                                </Col>
                                                <Col xs="6" sm="6" lg="6">
                                                    PERSONAL NO BAUTIZADO
                                                </Col>
                                            </Row>
                                            <Row className='subtitulos'>
                                                <Col xs="3" sm="3" lg="3">
                                                    ADULTOS
                                                </Col>
                                                <Col xs="3" sm="3" lg="3">
                                                    JÓVENES
                                                </Col>
                                                <Col xs="3" sm="3" lg="3">
                                                    JÓVENES
                                                </Col>
                                                <Col xs="3" sm="3" lg="3">
                                                    NIÑOS
                                                </Col>
                                            </Row>
                                            <Row className='lista-elementos'>
                                                <Col xs="6" sm="6" lg="6">
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Hombres
                                                        </Col>
                                                        <Col xs="2" sm="2" lg="2">
                                                            <Input type='text' min={0} max={9999}></Input>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Hombres
                                                        </Col>
                                                        <Col xs="2" sm="2" lg="2">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Mujeres
                                                        </Col>
                                                        <Col xs="2" sm="2" lg="2">
                                                            <Input type='text' min={0} max={9999}></Input>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Mujeres
                                                        </Col>
                                                        <Col xs="2" sm="2" lg="2">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Total
                                                        </Col>
                                                        <Col xs="2" sm="2" lg="2">
                                                            <Input type='text' min={0} max={9999}></Input>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Total
                                                        </Col>
                                                        <Col xs="2" sm="2" lg="2">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col xs="6" sm="6" lg="6">
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Hombres
                                                        </Col>
                                                        <Col xs="2" sm="2" lg="2">
                                                            <Input type='text' min={0} max={9999}></Input>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Niños
                                                        </Col>
                                                        <Col xs="2" sm="2" lg="2">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Mujeres
                                                        </Col>
                                                        <Col xs="2" sm="2" lg="2">
                                                            <Input type='text' min={0} max={9999}></Input>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Niñas
                                                        </Col>
                                                        <Col xs="2" sm="2" lg="2">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Total
                                                        </Col>
                                                        <Col xs="2" sm="2" lg="2">
                                                            <Input type='text' min={0} max={9999}></Input>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Total
                                                        </Col>
                                                        <Col xs="2" sm="2" lg="2">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row className='elemento'>
                                                <Col xs="4" sm="4" lg="4">
                                                    No. completo de personal bautizado
                                                </Col>
                                                <Col xs="2" sm="2" lg="2">
                                                    {/* <Input type='number' min={0} max={9999}
                                                        name='datosEstadisticos.personasBautizadas'
                                                        value={this.state.datosEstadisticos.personasBautizadas}
                                                        onChange={(e) => this.handleChange(e)}></Input> */}
                                                    <span className='font-weight-bold text-lg'>{this.state.datosEstadisticos.personasBautizadas}</span>
                                                </Col>
                                                <Col xs="4" sm="4" lg="4">
                                                    No. completo de personal no bautizado
                                                </Col>
                                                <Col xs="2" sm="2" lg="2">
                                                    {/* <Input type='number' min={0} max={9999}
                                                        name='datosEstadisticos.personasNoBautizadas'
                                                        value={this.state.datosEstadisticos.personasNoBautizadas}
                                                        onChange={(e) => this.handleChange(e)}></Input> */}
                                                    <span className='font-weight-bold text-lg'>{this.state.datosEstadisticos.personasNoBautizadas}</span>
                                                </Col>
                                            </Row>
                                            <Row className='elemento'>
                                                <Col xs="4" sm="4" lg="4">
                                                    Número completo de personal que integra la iglesia
                                                </Col>
                                                <Col xs="2" sm="2" lg="2">
                                                    <span className='font-weight-bold text-lg'>{this.state.datosEstadisticos.personasBautizadas + this.state.datosEstadisticos.personasNoBautizadas}</span>
                                                </Col>
                                            </Row>
                                            <Row className='elemento'>
                                                <Col xs="12" sm="12" lg="12">
                                                    <b>Desglose de movimiento estadístico</b>
                                                </Col>
                                                <Col xs="12" sm="12" lg="12">
                                                    <ListGroup>
                                                        {this.state.desgloseMoviemientoEstadistico.length > 0 && this.state.desgloseMoviemientoEstadistico.map((obj, index) => (
                                                            <ListGroupItem key={obj.hte_Id_Transaccion}>{index + 1}.- <b>{obj.ct_Tipo}</b> por <b>{obj.ct_Subtipo}</b> corresponde a <b>{obj.per_Nombre} {obj.per_Apellido_Paterno} {obj.per_Apellido_Materno}</b> - {moment(obj.hte_Fecha_Transaccion).format("YYYY-MM-DD")}</ListGroupItem>
                                                        ))}
                                                    </ListGroup>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </FormGroup>
                                :
                                <FormGroup className='contenedor-informe'>
                                    <Row className='contenedor-seccion'>
                                        <Col xs="12" sm="12" lg="12">
                                            <Row className='titulo'>
                                                MOVIMIENTO ADMINISTRATIVO Y MATERIAL
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row className='contenedor-seccion'>
                                        <Col xs="12" sm="12" lg="12">
                                            <Row className='subtitulos'>
                                                <Col xs="6" sm="6" lg="6">
                                                    1.- ORGANIZACIONES
                                                </Col>
                                                <Col xs="6" sm="6" lg="6">
                                                    5.- ADQUISICIONES
                                                </Col>
                                            </Row>
                                            <Row className='lista-elementos'>
                                                <Col xs="6" sm="6" lg="6">
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Sociedad femenil
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='organizaciones.sociedadFemenil'
                                                                value={this.state.organizaciones.sociedadFemenil}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Sociedad juvenil
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='organizaciones.sociedadJuvenil'
                                                                value={this.state.organizaciones.sociedadJuvenil}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Departamento femenil
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='organizaciones.departamentoFemenil'
                                                                value={this.state.organizaciones.departamentoFemenil}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Departamento juvenil
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='organizaciones.departamentoJuvenil'
                                                                value={this.state.organizaciones.departamentoJuvenil}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Departamento infantil
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='organizaciones.departamentoInfantil'
                                                                value={this.state.organizaciones.departamentoInfantil}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Coros
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='organizaciones.coros'
                                                                value={this.state.organizaciones.coros}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Grupos de canto
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='organizaciones.gruposDeCanto'
                                                                value={this.state.organizaciones.gruposDeCanto}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col xs="6" sm="6" lg="6">
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Predios
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='adquisicionesSector.predios'
                                                                value={this.state.adquisicionesSector.predios}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Casas
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='adquisicionesSector.casas'
                                                                value={this.state.adquisicionesSector.casas}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Edificios
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='adquisicionesSector.edificios'
                                                                value={this.state.adquisicionesSector.edificios}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Templos
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='adquisicionesSector.templos'
                                                                value={this.state.adquisicionesSector.templos}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Vehículos
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='adquisicionesSector.vehiculos'
                                                                value={this.state.adquisicionesSector.vehiculos}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row className='subtitulos'>
                                                <Col xs="6" sm="6" lg="6">
                                                    2.- SESIONES
                                                </Col>
                                                <Col xs="6" sm="6" lg="6">
                                                    6.- CONSTRUCCIONES
                                                </Col>
                                            </Row>
                                            <Row className='lista-elementos'>
                                                <Col xs="6" sm="6" lg="6">
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4"></Col>
                                                        <Col xs="4" sm="4" lg="4" className='subtitulos'>
                                                            SESIONES
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4" className='subtitulos'>
                                                            REUNIONES
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            En el Distrito
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='sesiones.enElDistrito'
                                                                value={this.state.sesiones.enElDistrito}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='reuniones.enElDistrito'
                                                                value={this.state.reuniones.enElDistrito}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Con el personal docente
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='sesiones.conElPersonalDocente'
                                                                value={this.state.sesiones.conElPersonalDocente}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='reuniones.conElPersonalDocente'
                                                                value={this.state.reuniones.conElPersonalDocente}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Con Sociedades o Dept. femenil
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='sesiones.conSociedadesFemeniles'
                                                                value={this.state.sesiones.conSociedadesFemeniles}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='reuniones.conSociedadesFemeniles'
                                                                value={this.state.reuniones.conSociedadesFemeniles}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Con Sociedades o Depto. Juvenil
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='sesiones.conSociedadesJuveniles'
                                                                value={this.state.sesiones.conSociedadesJuveniles}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='reuniones.conSociedadesJuveniles'
                                                                value={this.state.reuniones.conSociedadesJuveniles}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Con Depto. infantil
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='sesiones.conDepartamentosInfantiles'
                                                                value={this.state.sesiones.conDepartamentosInfantiles}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='reuniones.conDepartamentosInfantiles'
                                                                value={this.state.reuniones.conDepartamentosInfantiles}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Con Coros y Grupos de canto
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='sesiones.conCorosYGruposDeCanto'
                                                                value={this.state.sesiones.conCorosYGruposDeCanto}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='reuniones.conCorosYGruposDeCanto'
                                                                value={this.state.reuniones.conCorosYGruposDeCanto}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col xs="6" sm="6" lg="6">
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4"></Col>
                                                        <Col xs="4" sm="4" lg="4" className='subtitulos'>
                                                            Inicio
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4" className='subtitulos'>
                                                            Conclusión
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Colocación de 1a. Piedra
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='construccionesInicio.colocacionPrimeraPiedra'
                                                                value={this.state.construccionesInicio.colocacionPrimeraPiedra}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='construccionesConclusion.colocacionPrimeraPiedra'
                                                                value={this.state.construccionesConclusion.colocacionPrimeraPiedra}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Templo
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='construccionesInicio.templo'
                                                                value={this.state.construccionesInicio.templo}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='construccionesConclusion.templo'
                                                                value={this.state.construccionesConclusion.templo}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Casa de Oración
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='construccionesInicio.casaDeOracion'
                                                                value={this.state.construccionesInicio.casaDeOracion}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='construccionesConclusion.casaDeOracion'
                                                                value={this.state.construccionesConclusion.casaDeOracion}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Casa pastoral
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='construccionesInicio.casaPastoral'
                                                                value={this.state.construccionesInicio.casaPastoral}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='construccionesConclusion.casaPastoral'
                                                                value={this.state.construccionesConclusion.casaPastoral}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Anexos
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='construccionesInicio.anexos'
                                                                value={this.state.construccionesInicio.anexos}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='construccionesConclusion.anexos'
                                                                value={this.state.construccionesConclusion.anexos}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Remodelación
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='construccionesInicio.remodelacion'
                                                                value={this.state.construccionesInicio.remodelacion}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='construccionesConclusion.remodelacion'
                                                                value={this.state.construccionesConclusion.remodelacion}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row className='subtitulos'>
                                                <Col xs="6" sm="6" lg="6">
                                                    3.- ORDENACIONES
                                                </Col>
                                                <Col xs="6" sm="6" lg="6">
                                                    7. DEDICACIONES
                                                </Col>
                                            </Row>
                                            <Row className='lista-elementos'>
                                                <Col xs="6" sm="6" lg="6">
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Ancianos
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='ordenaciones.ancianos'
                                                                value={this.state.ordenaciones.ancianos}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Diáconos
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='ordenaciones.diaconos'
                                                                value={this.state.ordenaciones.diaconos}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col xs="6" sm="6" lg="6">
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Templos
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='dedicaciones.templos'
                                                                value={this.state.dedicaciones.templos}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Casas de Oración
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='dedicaciones.casasDeOracion'
                                                                value={this.state.dedicaciones.casasDeOracion}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row className='subtitulos'>
                                                <Col xs="6" sm="6" lg="6">
                                                    4.- LLAMAMIENTO DE PERSONAL
                                                </Col>
                                                <Col xs="6" sm="6" lg="6">
                                                    8. REGULARIZACION DE PREDIOS Y TEMPLOS
                                                </Col>
                                            </Row>
                                            <Row className='lista-elementos'>
                                                <Col xs="6" sm="6" lg="6">
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Diáconos a pruebas
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='llamamientoDePersonal.diaconosAprueba'
                                                                value={this.state.llamamientoDePersonal.diaconosAprueba}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Auxiliares
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='llamamientoDePersonal.auxiliares'
                                                                value={this.state.llamamientoDePersonal.auxiliares}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col xs="6" sm="6" lg="6">
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4"></Col>
                                                        <Col xs="4" sm="4" lg="4" className='subtitulos'>
                                                            Patrimonio Nacional
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4" className='subtitulos'>
                                                            Patrimonio de la iglesia
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Templos
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='regularizacionPatNac.templos'
                                                                value={this.state.regularizacionPatNac.templos}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='regularizacionPatIg.templos'
                                                                value={this.state.regularizacionPatIg.templos}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Casas pastorales
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='regularizacionPatNac.casasPastorales'
                                                                value={this.state.regularizacionPatNac.casasPastorales}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='regularizacionPatIg.casasPastorales'
                                                                value={this.state.regularizacionPatIg.casasPastorales}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row className='contenedor-seccion'>
                                        <Col xs="12" sm="12" lg="12">
                                            <Row className='titulo'>
                                                MOVIMIENTO ECONOMICO
                                            </Row>
                                            <Row className='subtitulos'>
                                                <Col xs="6" sm="6" lg="6">
                                                    INGRESOS
                                                </Col>
                                                <Col xs="6" sm="6" lg="6">
                                                    EGRESOS
                                                </Col>
                                            </Row>
                                            <Row className='lista-elementos'>
                                                <Col xs="6" sm="6" lg="6">
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Existencia Anterior
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='movimientoEconomico.existenciaAnterior'
                                                                value={this.state.movimientoEconomico.existenciaAnterior}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Entradas en el mes
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='movimientoEconomico.entradaMes'
                                                                value={this.state.movimientoEconomico.entradaMes}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Suma total
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='movimientoEconomico.sumaTotal'
                                                                value={parseFloat(this.state.movimientoEconomico.existenciaAnterior) + parseFloat(this.state.movimientoEconomico.entradaMes)}
                                                                disabled
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col xs="6" sm="6" lg="6">
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Gastos de la admon.
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='movimientoEconomico.gastosAdmon'
                                                                value={this.state.movimientoEconomico.gastosAdmon}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Transferencias al Dto.
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='movimientoEconomico.transferenciasAentidadSuperior'
                                                                value={this.state.movimientoEconomico.transferenciasAentidadSuperior}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Existencia en caja
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='movimientoEconomico.existenciaEnCaja'
                                                                value={(parseFloat(this.state.movimientoEconomico.existenciaAnterior) + parseFloat(this.state.movimientoEconomico.entradaMes)) - (parseFloat(this.state.movimientoEconomico.gastosAdmon) + parseFloat(this.state.movimientoEconomico.transferenciasAentidadSuperior))}
                                                                disabled
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row className='contenedor-seccion'>
                                        <Col xs="12" sm="12" lg="12">
                                            <Row className='titulo'>
                                                OTRAS ACTIVIDADES
                                            </Row>
                                            <Row>
                                                <Input type='textarea'></Input>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="12" sm="12" lg="12">
                                            <Row className='pie-informe'>
                                                JUSTICIA Y VERDAD
                                            </Row>
                                            <Row className='nombre-pastor'>
                                                {this.infoSesion.pem_Nombre}
                                            </Row>
                                            <Row className='hint-pastor'>
                                                Pastor de la Iglesia
                                            </Row>
                                            <Row className='elemento'>
                                                <Col xs="2" sm="2" lg="2">
                                                    Lugar de reunión:
                                                </Col>
                                                <Col xs="4" sm="4" lg="4">
                                                    <Input type='text'
                                                        name='informe.lugarReunion'
                                                        value={this.state.informe.lugarReunion}
                                                        onChange={(e) => this.handleChange(e)}></Input>
                                                </Col>
                                                <Col xs="2" sm="2" lg="2">
                                                    Fecha de reunión:
                                                </Col>
                                                <Col xs="4" sm="4" lg="4">
                                                <Input type='date'
                                                        name='informe.fechaReunion'
                                                        value={this.state.informe.fechaReunion}
                                                        onChange={(e) => this.handleChange(e)}></Input>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </FormGroup>
                            }
                        </CardBody>
                    </Form>
                </Card>
                <Row className='botones-inferiores'>
                    <Button color='primary' onClick={() => this.togglePage(this.state.pagina - 1)}><span className='fa fa-icon fa-arrow-left'></span></Button>
                    <span className='paginador'>Pagina {this.state.pagina} / {this.maxPaginas}</span>
                    <Button color='primary' onClick={() => this.togglePage(this.state.pagina + 1)}><span className='fa fa-icon fa-arrow-right'></span></Button>
                </Row>
            </Container>
        );
    }
}

export default InformeAnualPastor;