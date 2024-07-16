import React, { Component } from 'react';
import helpers from '../../components/Helpers';
import '../../assets/css/index.css'
import Modal from 'react-modal';
import {
    Button, Input, Alert, Container, Row, Col, Card, FormFeedback, ButtonGroup, InputGroup, Table,
    Form, FormGroup, CardBody, ModalBody, ListGroup, ListGroupItem, UncontrolledTooltip
} from 'reactstrap';
import './style.css'

import rutaLogo from '../../assets/images/IECE_LogoOficial.jpg'
import moment from 'moment/moment';

class InformeObispo extends Component {
    infoSesion = JSON.parse(localStorage.getItem('infoSesion'));
    maxPaginas = 2;
    idInforme = localStorage.getItem("idInformeObispo")
    // cellNumber = new Array(22).fill()
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
            // OBISPO
            sectores: [],
            actividadesObispo: [],
            actividadObispo: {},
            informesSectores: [],
            movtosAdministrativoEconomico: {},
            acuerdosDeDistrito: [],
            acuerdosEliminados: [],
            otrasActividadesObispo: [],
            actividadesEliminadas: [],
            // TERMINA OBISPO
            distrito: {
                dis_Numero: 0,
                dis_Alias: ''
            },
            misiones: [],
            visitantesPermantes: [],
            desgloseMoviemientoEstadistico: [],
            indiceActividad: null,
            indiceAcuerdo: null,
            otraActividadTextArea: "",
            acuerdoDeDistritoTextArea: "",
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
            adquisicionesDistrito: {
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
                hombresBautizados: 0,
                mujeresBautizadas: 0,
                jovenesHombresBautizados: 0,
                jovenesHombresNoBautizados: 0,
                jovenesMujeresBautizadas: 0,
                jovenesMujeresNoBautizadas: 0,
                ninas: 0,
                ninos: 0,
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
        this.setState({
            mensajeDelProceso: "Cargando informe...",
            modalShow: true
        });
        // this.getSector();
        // this.getSectores();
    }

    getDistrito = async () => {
        await helpers.validaToken().then(helpers.authAxios.get('/Distrito/' + localStorage.getItem('dto'))
            .then(res => {
                this.setState({
                    distrito: res.data
                })
                this.obtenerInforme(this.idInforme)
            })
        );
    }

    obtenerInforme = async (id) => {
        await helpers.validaToken().then(helpers.authAxios.get("/Informe/Obispo/" + id)
            .then(res => {
                console.log(res);
                this.state.informe = res.data.informe;
                this.state.informe.nombreMes = res.data.nombreMes;
                this.state.informe.fechaReunion = moment(res.data.informe.fechaReunion).format('YYYY-MM-DD');
                this.setState({
                    actividadesObispo: res.data.actividadObispo.sectores !== null ? res.data.actividadObispo.sectores.sort((a, b) => { return b.sector.sec_Tipo_Sector.localeCompare(a.sector.sec_Tipo_Sector) }) : this.state.actividadesObispo,
                    actividadObispo: res.data.actividadObispo !== null ? res.data.actividadObispo : this.actividadObispo,
                    datosEstadisticos: res.data.movtosEstadisticos !== null ? res.data.movtosEstadisticos : this.state.datosEstadisticos,
                    informesSectores: res.data.informesSectores !== null ? res.data.informesSectores : this.state.informesSectores,
                    movtosAdministrativoEconomico: res.data.movtosAdministrativoEconomico !== null ? res.data.movtosAdministrativoEconomico : this.state.movtosAdministrativoEconomico,
                    acuerdosDeDistrito: res.data.actividadObispo.acuerdosDeDistrito !== null ? res.data.actividadObispo.acuerdosDeDistrito : this.state.acuerdosDeDistrito,
                    otrasActividadesObispo: res.data.actividadObispo.otrasActividadesObispo !== null ? res.data.actividadObispo.otrasActividadesObispo : this.state.otrasActividadesObispo,
                })
                this.obtenerMovimientosEstadisticos();
            })
        );
    }

    obtenerMovimientosEstadisticos = async () => {

        const startDate = moment([this.state.informe.anio, this.state.informe.mes - 1]).startOf('month').format("YYYY-MM-DD");
        const endDate = moment([this.state.informe.anio, this.state.informe.mes - 1]).endOf('month').format("YYYY-MM-DD");
        const body = {
            fechaInicial: startDate,
            fechaFinal: endDate,
            idSectorDistrito: this.state.distrito.dis_Id_Distrito
        }
        await helpers.validaToken().then(helpers.authAxios.post("/Historial_Transacciones_Estadisticas/HistorialPorFechaDistrito", body)
            .then(res => {
                this.setState({
                    desgloseMoviemientoEstadistico: res.data.datos.length > 0 ? res.data.datos : this.state.desgloseMoviemientoEstadistico
                })
                this.setState({
                    modalShow: false
                });
            })

        )
    }

    agregarActividad() {
        if (this.state.indiceActividad === null) {
            const nuevaActividad = {
                idOtraActividad: 0,
                idInforme: 0,
                descripcion: this.state.otraActividadTextArea,
                numDeOrden: this.state.otrasActividadesObispo.length === 0 ? 1 : this.state.otrasActividadesObispo[-1] + 1
            }
            this.state.otrasActividadesObispo.push(nuevaActividad);
            this.setState({
                otraActividadTextArea: ''
            });
        } else {
            const nuevoArray = [...this.state.otrasActividadesObispo]
            nuevoArray[this.state.indiceActividad] = { ...nuevoArray[this.state.indiceActividad], descripcion: this.state.otraActividadTextArea, numDeOrden: this.state.indiceActividad + 1 }
            this.setState({ otrasActividadesObispo: nuevoArray });
            this.setState({
                otraActividadTextArea: ''
            });
            this.setState({
                indiceActividad: null
            })
        }
    }

    editarActividad(index) {
        const actividad = this.state.otrasActividadesObispo[index];
        this.setState({
            indiceActividad: index
        })
        this.setState({
            otraActividadTextArea: actividad.descripcion
        });
    }

    eliminarActividad(index) {
        this.state.actividadesEliminadas.push(this.state.otrasActividadesObispo[index])
        this.setState(prevState => ({
            otrasActividadesObispo: prevState.otrasActividadesObispo.filter((_, i) => i !== index)
        }));
    }
    agregarAcuerdoDeDistrito() {
        if (this.state.indiceAcuerdo === null) {
            const nuevoAcuerdo = {
                idAcuerdoDeDistrito: 0,
                idInforme: 0,
                descripcion: this.state.acuerdoDeDistritoTextArea,
                numDeOrdenDeAcuerdo: this.state.acuerdosDeDistrito.length === 0 ? 1 : this.state.acuerdosDeDistrito[-1] + 1
            }
            this.state.acuerdosDeDistrito.push(nuevoAcuerdo);
            this.setState({
                acuerdoDeDistritoTextArea: ''
            });
        } else {
            const nuevoArray = [...this.state.acuerdosDeDistrito]
            nuevoArray[this.state.indiceAcuerdo] = { ...nuevoArray[this.state.indiceAcuerdo], descripcion: this.state.acuerdoDeDistritoTextArea, numDeOrdenDeAcuerdo: this.state.indiceAcuerdo + 1 }
            this.setState({ acuerdosDeDistrito: nuevoArray });
            this.setState({
                acuerdoDeDistritoTextArea: ''
            });
            this.setState({
                indiceAcuerdo: null
            })
        }
    }

    editarAcuerdoDeDistrito(index) {
        const acuerdo = this.state.acuerdosDeDistrito[index];
        this.setState({
            indiceAcuerdo: index
        })
        this.setState({
            acuerdoDeDistritoTextArea: acuerdo.descripcion
        });
    }

    eliminarAcuerdoDeDistrito(index) {
        this.state.acuerdosEliminados.push(this.state.acuerdosDeDistrito[index])
        this.setState(prevState => ({
            acuerdosDeDistrito: prevState.acuerdosDeDistrito.filter((_, i) => i !== index)
        }));
    }


    handleOtraActividad(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }
    handleAcuerdoDeDistrito(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
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
            idTipoUsuario: 2,
            idDistrito: this.state.informe.idDistrito,
            idSector: this.state.informe.idSector,
            lugarReunion: this.state.informe.lugarReunion,
            fechaReunion: this.state.informe.fechaReunion,
            status: this.state.informe.status,
            usu_id_usuario: this.infoSesion.pem_Id_Ministro,
            fechaRegistro: null,
            trabajoEvangelismo: this.state.trabajoEvangelismo,
            CultosMisionSector: this.state.misiones,
            organizaciones: this.state.organizaciones,
            adquisicionesDistrito: this.state.actividadObispo.adquisicionesDistrito,
            reunionesDistrito: this.state.actividadObispo.reunionesObispo,
            sesionesDistrito: this.state.actividadObispo.sesionesObispo,
            construccionesDistritoInicio: this.state.actividadObispo.construccionesDistritoInicio,
            construccionesDistritoConclusion: this.state.actividadObispo.construccionesDistritoFinal,
            ordenaciones: this.state.ordenaciones,
            dedicaciones: this.state.actividadObispo.dedicacionesDistrito,
            llamamientoDePersonal: this.state.llamamientoDePersonal,
            regularizacionPatNac: this.state.actividadObispo.regularizacionesPrediosTemplosNacionDistrito,
            regularizacionPatIg: this.state.actividadObispo.regularizacionesPrediosTemplosIglesiaDistrito,
            movimientoEconomico: this.state.movtosAdministrativoEconomico.movimientoEconomico,
            acuerdosDeDistrito: this.state.acuerdosDeDistrito,
            acuerdosEliminados: this.state.acuerdosEliminados,
            otrasActividades: this.state.otrasActividadesObispo,
            actividadesEliminadas: this.state.actividadesEliminadas,
            actividadesObispo: this.state.actividadesObispo
        }

        await helpers.validaToken().then(helpers.authAxios.put("/Informe/" + data.idInforme, data)
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
            <>
                <Container>
                    <Card>
                        <Form onSubmit={this.guardar}>
                            <CardBody>
                                {this.state.pagina === 1 ?
                                    <FormGroup className='contenedor-informe'>
                                        <Row className='flex justify-content-center'>
                                            <Col xs="8" sm="8" lg="8">
                                                <img src={rutaLogo} className='logo-informe'></img>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12" sm="12" lg="12">
                                                <p className='text-center'>
                                                    INFORME QUE RINDE EL OBISPO DEL DISTRITO NO. <u><b>{this.state.distrito.dis_Numero}</b></u> CON ASIENTO EN: <u><b> {this.state.distrito.dis_Alias + ' '} </b></u>
                                                    AL PRESIDENTE GENERAL DEL TRABAJO Y MOVIMIENTO REGISTRADO
                                                    DURANTE EL MES DE <u><b>{this.state.informe.nombreMes ? this.state.informe.nombreMes.toUpperCase() : ''}</b></u> DEL AÑO <u><b>{this.state.informe.anio}.</b></u>
                                                </p>
                                            </Col>
                                        </Row>
                                        <Row className='titulo'>
                                            ACTIVIDADES DEL OBISPO
                                        </Row>
                                        {this.state.actividadesObispo.length > 0 && this.state.actividadesObispo.map((obj, index) => (
                                            <Row key={index} className='contenedor-seccion'>
                                                <Col xs="12" sm="12" lg="12">
                                                    <Row className='titulo'>
                                                        {obj.sector.sec_Tipo_Sector} {obj.sector.sec_Numero}.- {obj.sector.sec_Alias}
                                                    </Row>
                                                    <Row className='subtitulos'>
                                                        <Col xs="3" sm="3" lg="3">
                                                            Visitas a:
                                                        </Col>
                                                        <Col xs="3" sm="3" lg="3">
                                                            Cultos
                                                        </Col>
                                                        <Col xs="3" sm="3" lg="3">
                                                            Conferencias
                                                        </Col>
                                                        <Col xs="3" sm="3" lg="3">
                                                            Concentraciones
                                                        </Col>
                                                    </Row>
                                                    <Row className='lista-elementos'>
                                                        <Col xs="3" sm="3" lg="3">
                                                            <Row className='elemento'>
                                                                <Col xs="7" sm="7" lg="7">
                                                                    Sectores
                                                                </Col>
                                                                <Col xs="5" sm="5" lg="5">
                                                                    <Input type='number' min={0} max={9999}
                                                                        id='aSectores'
                                                                        name={`actividadesObispo.${index}.visitasObispo.aSectores`}
                                                                        value={this.state.actividadesObispo[index].visitasObispo.aSectores}
                                                                        onChange={(e) => this.handleChange(e)}></Input>
                                                                    <UncontrolledTooltip
                                                                        placement="right"
                                                                        target="aSectores"
                                                                    >
                                                                        Visitas realizadas exclusivamente por el Obispo al Sector o Misión de Dto. en consideración.
                                                                    </UncontrolledTooltip>
                                                                </Col>
                                                            </Row>
                                                            <Row className='elemento'>
                                                                <Col xs="7" sm="7" lg="7">
                                                                    Hogares
                                                                </Col>
                                                                <Col xs="5" sm="5" lg="5">
                                                                    <Input type='number' min={0} max={9999}
                                                                        id='aHogares'
                                                                        name={`actividadesObispo.${index}.visitasObispo.aHogares`}
                                                                        value={this.state.actividadesObispo[index].visitasObispo.aHogares}
                                                                        onChange={(e) => this.handleChange(e)}
                                                                    ></Input>
                                                                    <UncontrolledTooltip
                                                                        placement="right"
                                                                        target="aHogares"
                                                                    >
                                                                        Visitas realizadas exclusivamente por el Obispo a hogares del Sector o Misión de Dto. en consideración.
                                                                    </UncontrolledTooltip>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                        <Col xs="3" sm="3" lg="3">
                                                            <Row className='elemento'>
                                                                <Col xs="7" sm="7" lg="7">
                                                                    Ordinarios
                                                                </Col>
                                                                <Col xs="5" sm="5" lg="5">
                                                                    <Input type='number' min={0} max={9999}
                                                                        id='cultosOrdinarios'
                                                                        name={`actividadesObispo.${index}.cultosDistrito.ordinarios`}
                                                                        value={this.state.actividadesObispo[index].cultosDistrito.ordinarios}
                                                                        onChange={(e) => this.handleChange(e)}></Input>
                                                                    <UncontrolledTooltip
                                                                        placement="right"
                                                                        target="cultosOrdinarios"
                                                                    >
                                                                        Cultos Ordinarios realizados por programa de Distrito en el Sector o Misión de Dto. en consideración.
                                                                    </UncontrolledTooltip>
                                                                </Col>
                                                            </Row>
                                                            <Row className='elemento'>
                                                                <Col xs="7" sm="7" lg="7">
                                                                    Especiales
                                                                </Col>
                                                                <Col xs="5" sm="5" lg="5">
                                                                    <Input type='number' min={0} max={9999}
                                                                        id='cultosEspeciales'
                                                                        name={`actividadesObispo.${index}.cultosDistrito.especiales`}
                                                                        value={this.state.actividadesObispo[index].cultosDistrito.especiales}
                                                                        onChange={(e) => this.handleChange(e)}></Input>
                                                                    <UncontrolledTooltip
                                                                        placement="right"
                                                                        target="cultosEspeciales"
                                                                    >
                                                                        Cultos especiales (con programa de culto) realizados por programa de Distrito en el Sector o Misión de Dto. en consideración.
                                                                    </UncontrolledTooltip>
                                                                </Col>
                                                            </Row>
                                                            <Row className='elemento'>
                                                                <Col xs="7" sm="7" lg="7">
                                                                    De Avivamiento
                                                                </Col>
                                                                <Col xs="5" sm="5" lg="5">
                                                                    <Input type='number' min={0} max={9999}
                                                                        id='cultosDeAvivamiento'
                                                                        name={`actividadesObispo.${index}.cultosDistrito.deAvivamiento`}
                                                                        value={this.state.actividadesObispo[index].cultosDistrito.deAvivamiento}
                                                                        onChange={(e) => this.handleChange(e)}></Input>
                                                                    <UncontrolledTooltip
                                                                        placement="right"
                                                                        target="cultosDeAvivamiento"
                                                                    >
                                                                        Cultos intencionados al cultivo del ánimo espiritual, fervor y devoción de la iglesia, tales como cultos de gozo espiritual y de derramamiento del Espíritu Santo, realizados por programa de Distrito en el Sector o Misión de Dto. en consideración.
                                                                    </UncontrolledTooltip>
                                                                </Col>
                                                            </Row>
                                                            <Row className='elemento'>
                                                                <Col xs="7" sm="7" lg="7">
                                                                    Evangelismo
                                                                </Col>
                                                                <Col xs="5" sm="5" lg="5">
                                                                    <Input type='number' min={0} max={9999}
                                                                        id='cultosEvangelismo'
                                                                        name={`actividadesObispo.${index}.cultosDistrito.evangelismo`}
                                                                        value={this.state.actividadesObispo[index].cultosDistrito.evangelismo}
                                                                        onChange={(e) => this.handleChange(e)}></Input>
                                                                    <UncontrolledTooltip
                                                                        placement="right"
                                                                        target="cultosEvangelismo"
                                                                    >
                                                                        Cultos de Evangelismo realizados por programa de Distrito en el Sector o Misión de Distrito en consideración.
                                                                    </UncontrolledTooltip>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                        <Col xs="3" sm="3" lg="3">
                                                            <Row className='elemento'>
                                                                <Col xs="7" sm="7" lg="7">
                                                                    Iglesia
                                                                </Col>
                                                                <Col xs="5" sm="5" lg="5">
                                                                    <Input type='number' min={0} max={9999}
                                                                        id='confIglesia'
                                                                        name={`actividadesObispo.${index}.conferenciasDistrito.iglesia`}
                                                                        value={this.state.actividadesObispo[index].conferenciasDistrito.iglesia}
                                                                        onChange={(e) => this.handleChange(e)}></Input>
                                                                    <UncontrolledTooltip
                                                                        placement="right"
                                                                        target="confIglesia"
                                                                    >
                                                                        Cantidad de Conferencias a la Congregación, impartidas por programa de Distrito en el Sector o Misión de Dto. en consideración.
                                                                    </UncontrolledTooltip>
                                                                </Col>
                                                            </Row>
                                                            <Row className='elemento'>
                                                                <Col xs="7" sm="7" lg="7">
                                                                    Sector Varonil
                                                                </Col>
                                                                <Col xs="5" sm="5" lg="5">
                                                                    <Input type='number' min={0} max={9999}
                                                                        id='confSecVaronil'
                                                                        name={`actividadesObispo.${index}.conferenciasDistrito.sectorVaronil`}
                                                                        value={this.state.actividadesObispo[index].conferenciasDistrito.sectorVaronil}
                                                                        onChange={(e) => this.handleChange(e)}></Input>
                                                                    <UncontrolledTooltip
                                                                        placement="right"
                                                                        target="confSecVaronil"
                                                                    >
                                                                        Cantidad de Conferencias al sector Varonil, impartidas por programa de Distrito en el Sector o Misión de Dto. en consideración.
                                                                    </UncontrolledTooltip>
                                                                </Col>
                                                            </Row>
                                                            <Row className='elemento'>
                                                                <Col xs="7" sm="7" lg="7">
                                                                    Sociedad Femenil
                                                                </Col>
                                                                <Col xs="5" sm="5" lg="5">
                                                                    <Input type='number' min={0} max={9999}
                                                                        id='confSocFemenil'
                                                                        name={`actividadesObispo.${index}.conferenciasDistrito.sociedadFemenil`}
                                                                        value={this.state.actividadesObispo[index].conferenciasDistrito.sociedadFemenil}
                                                                        onChange={(e) => this.handleChange(e)}></Input>
                                                                    <UncontrolledTooltip
                                                                        placement="right"
                                                                        target="confSocFemenil"
                                                                    >
                                                                        Cantidad de Conferencias al sector Femenil, impartidas por programa de Distrito en el Sector o Misión de Dto. en consideración.
                                                                    </UncontrolledTooltip>
                                                                </Col>
                                                            </Row>
                                                            <Row className='elemento'>
                                                                <Col xs="7" sm="7" lg="7">
                                                                    Sociedad Juvenil
                                                                </Col>
                                                                <Col xs="5" sm="5" lg="5">
                                                                    <Input type='number' min={0} max={9999}
                                                                        id='confSocJuvenil'
                                                                        name={`actividadesObispo.${index}.conferenciasDistrito.sociedadJuvenil`}
                                                                        value={this.state.actividadesObispo[index].conferenciasDistrito.sociedadJuvenil}
                                                                        onChange={(e) => this.handleChange(e)}></Input>
                                                                    <UncontrolledTooltip
                                                                        placement="right"
                                                                        target="confSocJuvenil"
                                                                    >
                                                                        Cantidad de Conferencias al sector Juvenil impartidas por programa de Distrito en el Sector o Misión de Dto. en consideración.
                                                                    </UncontrolledTooltip>
                                                                </Col>
                                                            </Row>
                                                            <Row className='elemento'>
                                                                <Col xs="7" sm="7" lg="7">
                                                                    Infantil
                                                                </Col>
                                                                <Col xs="5" sm="5" lg="5">
                                                                    <Input type='number' min={0} max={9999}
                                                                        id='confInfantil'
                                                                        name={`actividadesObispo.${index}.conferenciasDistrito.sectorInfantil`}
                                                                        value={this.state.actividadesObispo[index].conferenciasDistrito.sectorInfantil}
                                                                        onChange={(e) => this.handleChange(e)}></Input>
                                                                    <UncontrolledTooltip
                                                                        placement="right"
                                                                        target="confInfantil"
                                                                    >
                                                                        Cantidad de Conferencias al sector Infantil, impartidas por programa de Distrito en el Sector o Misión de Dto. en consideración.
                                                                    </UncontrolledTooltip>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                        <Col xs="3" sm="3" lg="3">
                                                            <Row className='elemento'>
                                                                <Col xs="7" sm="7" lg="7">
                                                                    Iglesia
                                                                </Col>
                                                                <Col xs="5" sm="5" lg="5">
                                                                    <Input type='number' min={0} max={9999}
                                                                        id='concIglesia'
                                                                        name={`actividadesObispo.${index}.concentracionesDistrito.iglesia`}
                                                                        value={this.state.actividadesObispo[index].concentracionesDistrito.iglesia}
                                                                        onChange={(e) => this.handleChange(e)}></Input>
                                                                    <UncontrolledTooltip
                                                                        placement="right"
                                                                        target="concIglesia"
                                                                    >
                                                                        Cantidad de concentraciones de Iglesias, realizadas por programa de Distrito, teniendo como enfitrión al Sector o Misión de Dto. en consideración.
                                                                    </UncontrolledTooltip>
                                                                </Col>
                                                            </Row>
                                                            <Row className='elemento'>
                                                                <Col xs="7" sm="7" lg="7">
                                                                    Sector Varonil
                                                                </Col>
                                                                <Col xs="5" sm="5" lg="5">
                                                                    <Input type='number' min={0} max={9999}
                                                                        id='concSecVaronil'
                                                                        name={`actividadesObispo.${index}.concentracionesDistrito.sectorVaronil`}
                                                                        value={this.state.actividadesObispo[index].concentracionesDistrito.sectorVaronil}
                                                                        onChange={(e) => this.handleChange(e)}></Input>
                                                                    <UncontrolledTooltip
                                                                        placement="right"
                                                                        target="concSecVaronil"
                                                                    >
                                                                        Cantidad de concentraciones para el sector Varonil, realizadas por programa de Distrito, teniendo como enfitrión al Sector o Misión de Dto. en consideración.
                                                                    </UncontrolledTooltip>
                                                                </Col>
                                                            </Row>
                                                            <Row className='elemento'>
                                                                <Col xs="7" sm="7" lg="7">
                                                                    Sociedad Femenil
                                                                </Col>
                                                                <Col xs="5" sm="5" lg="5">
                                                                    <Input type='number' min={0} max={9999}
                                                                        id='concSecFemenil'
                                                                        name={`actividadesObispo.${index}.concentracionesDistrito.sociedadFemenil`}
                                                                        value={this.state.actividadesObispo[index].concentracionesDistrito.sociedadFemenil}
                                                                        onChange={(e) => this.handleChange(e)}></Input>
                                                                    <UncontrolledTooltip
                                                                        placement="right"
                                                                        target="concSecFemenil"
                                                                    >
                                                                        Cantidad de concentraciones para el sector Femenil, realizadas por programa de Distrito, teniendo como enfitrión al Sector o Misión de Dto. en consideración.
                                                                    </UncontrolledTooltip>
                                                                </Col>
                                                            </Row>
                                                            <Row className='elemento'>
                                                                <Col xs="7" sm="7" lg="7">
                                                                    Sociedad Juvenil
                                                                </Col>
                                                                <Col xs="5" sm="5" lg="5">
                                                                    <Input type='number' min={0} max={9999}
                                                                        id='concSocJuvenil'
                                                                        name={`actividadesObispo.${index}.concentracionesDistrito.sociedadJuvenil`}
                                                                        value={this.state.actividadesObispo[index].concentracionesDistrito.sociedadJuvenil}
                                                                        onChange={(e) => this.handleChange(e)}></Input>
                                                                    <UncontrolledTooltip
                                                                        placement="right"
                                                                        target="concSocJuvenil"
                                                                    >
                                                                        Cantidad de concentraciones para el sector Juvenil, realizadas por programa de Distrito, teniendo como enfitrión al Sector o Misión de Dto. en consideración.
                                                                    </UncontrolledTooltip>
                                                                </Col>
                                                            </Row>
                                                            <Row className='elemento'>
                                                                <Col xs="7" sm="7" lg="7">
                                                                    Sector Infantil
                                                                </Col>
                                                                <Col xs="5" sm="5" lg="5">
                                                                    <Input type='number' min={0} max={9999}
                                                                        id='concInfantil'
                                                                        name={`actividadesObispo.${index}.concentracionesDistrito.sectorInfantil`}
                                                                        value={this.state.actividadesObispo[index].concentracionesDistrito.sectorInfantil}
                                                                        onChange={(e) => this.handleChange(e)}></Input>
                                                                    <UncontrolledTooltip
                                                                        placement="right"
                                                                        target="concInfantil"
                                                                    >
                                                                        Cantidad de concentraciones para el sector Infantil realizadas por programa de Distrito, teniendo como enfitrión al Sector o Misión de Dto. en consideración.
                                                                    </UncontrolledTooltip>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        ))}
                                        <Row>
                                            <table className='tabla-obispo'>
                                                <tr>
                                                    <th className='table-header' rowSpan="2">SECTORES</th>
                                                    <th className='table-header' colSpan="2">Visitas hogares</th>
                                                    <th className='table-header' colSpan="5">Cultos</th>
                                                    <th className='table-header' colSpan="6">Estudios y conferencias</th>
                                                    <th className='table-header' colSpan="2">Misiones</th>
                                                    <th className='table-header' colSpan="8">Trabajo de Evangelismo</th>
                                                </tr>
                                                <tr>
                                                    <th className='table-header sectores-header'>POR EL PASTOR</th>
                                                    <th className='table-header sectores-header'>POR PERS. AUX.</th>
                                                    <th className='table-header sectores-header'>ORDINARIOS</th>
                                                    <th className='table-header sectores-header'>ESPECIALES</th>
                                                    <th className='table-header sectores-header'>DE AVIVIAMIENTO</th>
                                                    <th className='table-header sectores-header'>DE ANIVERSARIO</th>
                                                    <th className='table-header sectores-header'>POR EL DIST.</th>
                                                    <th className='table-header sectores-header'>IGLESIA</th>
                                                    <th className='table-header sectores-header'>ESC. DOM.</th>
                                                    <th className='table-header sectores-header'>VARONIL</th>
                                                    <th className='table-header sectores-header'>FEMENIL</th>
                                                    <th className='table-header sectores-header'>JUVENIL</th>
                                                    <th className='table-header sectores-header'>INFANTIL</th>
                                                    <th className='table-header sectores-header'>NUM. DE MIS.</th>
                                                    <th className='table-header sectores-header'>CULTOS</th>
                                                    <th className='table-header sectores-header'>HOGARES VISIT.</th>
                                                    <th className='table-header sectores-header'>HOGARES CONQ.</th>
                                                    <th className='table-header sectores-header'>VIS. PERM.</th>
                                                    <th className='table-header sectores-header'>CULTOS POR LOC.</th>
                                                    <th className='table-header sectores-header'>CULTOS DE HOGAR</th>
                                                    <th className='table-header sectores-header'>CAMPAÑAS</th>
                                                    <th className='table-header sectores-header'>APERT. DE MIS.</th>
                                                    <th className='table-header sectores-header'>BAUTISMOS</th>
                                                </tr>
                                                {this.state.informesSectores.length > 0 && this.state.informesSectores.map((obj, index) => (
                                                    <tr>
                                                        <td className='table-cell' style={{ textAlign: 'left' }}>{obj.sector.sec_Tipo_Sector} {obj.sector.sec_Numero} {obj.sector.sec_Alias}</td>
                                                        <td className='table-cell'>{obj.visitasPastor.porPastor ? obj.visitasPastor.porPastor : ""}</td>
                                                        <td className='table-cell'>{obj.visitasPastor.porAncianosAux || obj.visitasPastor.porAuxiliares || obj.visitasPastor.porDiaconos ? obj.visitasPastor.porAncianosAux + obj.visitasPastor.porAuxiliares + obj.visitasPastor.porDiaconos : ""}</td>
                                                        <td className='table-cell'>{obj.cultosSector.ordinarios ? obj.cultosSector.ordinarios : ""}</td>
                                                        <td className='table-cell'>{obj.cultosSector.especiales ? obj.cultosSector.especiales : ""}</td>
                                                        <td className='table-cell'>{obj.cultosSector.deAvivamiento ? obj.cultosSector.deAvivamiento : ""}</td>
                                                        <td className='table-cell'>{obj.cultosSector.deAniversario ? obj.cultosSector.deAniversario : ""}</td>
                                                        <td className='table-cell'>{obj.cultosSector.porElDistrito ? obj.cultosSector.porElDistrito : ""}</td>
                                                        <td className='table-cell'>{obj.estudiosSector.iglesia || obj.conferenciasSector.iglesia ? obj.estudiosSector.iglesia + obj.conferenciasSector.iglesia : ""}</td>
                                                        <td className='table-cell'>{obj.estudiosSector.escuelaDominical || obj.conferenciasSector.escuelaDominical ? obj.estudiosSector.escuelaDominical + obj.conferenciasSector.escuelaDominical : ""}</td>
                                                        <td className='table-cell'>{obj.estudiosSector.varonil || obj.conferenciasSector.varonil ? obj.estudiosSector.varonil + obj.conferenciasSector.varonil : ""}</td>
                                                        <td className='table-cell'>{obj.estudiosSector.femenil || obj.conferenciasSector.femenil ? obj.estudiosSector.femenil + obj.conferenciasSector.femenil : ""}</td>
                                                        <td className='table-cell'>{obj.estudiosSector.juvenil || obj.conferenciasSector.juvenil ? obj.estudiosSector.juvenil + obj.conferenciasSector.juvenil : ""}</td>
                                                        <td className='table-cell'>{obj.estudiosSector.infantil || obj.conferenciasSector.infantil ? obj.estudiosSector.infantil + obj.conferenciasSector.infantil : ""}</td>
                                                        <td className='table-cell'>{obj.misionesSector.length ? obj.misionesSector.length : ""}</td>
                                                        <td className='table-cell'>
                                                            {obj.cultosMisionSector && obj.cultosMisionSector.length > 0 ? (
                                                                obj.cultosMisionSector.map(c => {
                                                                    let total = 0;
                                                                    total += c.cultos;
                                                                    return total;
                                                                })
                                                            ) : (
                                                                ""
                                                            )}
                                                        </td>
                                                        <td className='table-cell'>{obj.trabajoEvangelismo.hogaresVisitados ? obj.trabajoEvangelismo.hogaresVisitados : ""}</td>
                                                        <td className='table-cell'>{obj.trabajoEvangelismo.hogaresConquistados ? obj.trabajoEvangelismo.hogaresConquistados : ""}</td>
                                                        <td className='table-cell'>{obj.trabajoEvangelismo.visitantesPermanentes ? obj.trabajoEvangelismo.visitantesPermanentes : ""}</td>
                                                        <td className='table-cell'>{obj.trabajoEvangelismo.cultosPorLaLocalidad ? obj.trabajoEvangelismo.cultosPorLaLocalidad : ""}</td>
                                                        <td className='table-cell'>{obj.trabajoEvangelismo.cultosDeHogar ? obj.trabajoEvangelismo.cultosDeHogar : ""}</td>
                                                        <td className='table-cell'>{obj.trabajoEvangelismo.campanias ? obj.trabajoEvangelismo.campanias : ""}</td>
                                                        <td className='table-cell'>{obj.trabajoEvangelismo.aperturaDeMisiones ? obj.trabajoEvangelismo.aperturaDeMisiones : ""}</td>
                                                        <td className='table-cell'>{obj.trabajoEvangelismo.bautismos ? obj.trabajoEvangelismo.bautismos : ""}</td>
                                                        {/* {this.state.informesSectores.length > 0 && this.state.informesSectores.map((sec, index) => (
                                                        <td className='table-cell'>{sec.visitasPastor.porPastor}</td>
                                                    ))} */}
                                                    </tr>
                                                ))}
                                            </table>
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
                                    </FormGroup>
                                    :
                                    <FormGroup className='contenedor-informe'>
                                        <Row className='contenedor-seccion'>
                                            <Col xs="12" sm="12" lg="12">
                                                <Row className='titulo'>
                                                    DATOS DEL ESTADO ACTUAL DEL DISTRITO
                                                </Row>
                                                <Row className='titulo'>
                                                    Número de personal en comunión al principio del mes {this.state.datosEstadisticos.personasBautizadas}
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
                                                                    value={this.state.datosEstadisticos.bajasBautizados.excomunion + this.state.datosEstadisticos.bajasBautizados.excomuniontemporal}
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
                                                                    value={this.state.datosEstadisticos.bajasBautizados.defuncion + this.state.datosEstadisticos.bajasBautizados.excomunion + this.state.datosEstadisticos.bajasBautizados.excomuniontemporal + this.state.datosEstadisticos.bajasBautizados.cambiodedomexterno}
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
                                                                <Input type='number' min={0} max={9999}
                                                                    name='datosEstadisticos.hombresBautizados'
                                                                    value={this.state.datosEstadisticos.hombresBautizados}
                                                                    readOnly></Input>
                                                            </Col>
                                                            <Col xs="4" sm="4" lg="4">
                                                                Hombres
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='datosEstadisticos.jovenesHombresBautizados'
                                                                    value={this.state.datosEstadisticos.jovenesHombresBautizados}
                                                                    readOnly></Input>
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="4" sm="4" lg="4">
                                                                Mujeres
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='datosEstadisticos.mujeresBautizadas'
                                                                    value={this.state.datosEstadisticos.mujeresBautizadas}
                                                                    readOnly></Input>
                                                            </Col>
                                                            <Col xs="4" sm="4" lg="4">
                                                                Mujeres
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='datosEstadisticos.jovenesMujeresBautizadas'
                                                                    value={this.state.datosEstadisticos.jovenesMujeresBautizadas}
                                                                    readOnly></Input>
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="4" sm="4" lg="4">
                                                                Total
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    value={this.state.datosEstadisticos.hombresBautizados + this.state.datosEstadisticos.mujeresBautizadas}
                                                                    readOnly></Input>
                                                            </Col>
                                                            <Col xs="4" sm="4" lg="4">
                                                                Total
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    value={this.state.datosEstadisticos.jovenesHombresBautizados + this.state.datosEstadisticos.jovenesMujeresBautizadas}
                                                                    readOnly></Input>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                    <Col xs="6" sm="6" lg="6">
                                                        <Row className='elemento'>
                                                            <Col xs="4" sm="4" lg="4">
                                                                Hombres
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='datosEstadisticos.jovenesHombresNoBautizados'
                                                                    value={this.state.datosEstadisticos.jovenesHombresNoBautizados}
                                                                    readOnly></Input>
                                                            </Col>
                                                            <Col xs="4" sm="4" lg="4">
                                                                Niños
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='datosEstadisticos.ninos'
                                                                    value={this.state.datosEstadisticos.ninos}
                                                                    readOnly></Input>
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="4" sm="4" lg="4">
                                                                Mujeres
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='datosEstadisticos.jovenesMujeresNoBautizadas'
                                                                    value={this.state.datosEstadisticos.jovenesMujeresNoBautizadas}
                                                                    readOnly></Input>
                                                            </Col>
                                                            <Col xs="4" sm="4" lg="4">
                                                                Niñas
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='datosEstadisticos.ninas'
                                                                    value={this.state.datosEstadisticos.ninas}
                                                                    readOnly></Input>
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="4" sm="4" lg="4">
                                                                Total
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    value={this.state.datosEstadisticos.jovenesHombresNoBautizados + this.state.datosEstadisticos.jovenesMujeresNoBautizadas}
                                                                    readOnly></Input>
                                                            </Col>
                                                            <Col xs="4" sm="4" lg="4">
                                                                Total
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    value={this.state.datosEstadisticos.ninos + this.state.datosEstadisticos.ninas}
                                                                    readOnly></Input>
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
                                                        <u><span className='font-weight-bold text-lg'>{this.state.datosEstadisticos.personasBautizadas}</span></u>
                                                    </Col>
                                                    <Col xs="4" sm="4" lg="4">
                                                        No. completo de personal no bautizado
                                                    </Col>
                                                    <Col xs="2" sm="2" lg="2">
                                                        {/* <Input type='number' min={0} max={9999}
                                                        name='datosEstadisticos.personasNoBautizadas'
                                                        value={this.state.datosEstadisticos.personasNoBautizadas}
                                                        onChange={(e) => this.handleChange(e)}></Input> */}
                                                        <u><span className='font-weight-bold text-lg'>{this.state.datosEstadisticos.personasNoBautizadas}</span></u>
                                                    </Col>
                                                </Row>
                                                <Row className='elemento'>
                                                    <Col xs="4" sm="4" lg="4">
                                                        Número completo de personal que integra el Distrito
                                                    </Col>
                                                    <Col xs="2" sm="2" lg="2">
                                                        <u><span className='font-weight-bold text-lg'>{this.state.datosEstadisticos.personasBautizadas + this.state.datosEstadisticos.personasNoBautizadas}</span></u>
                                                    </Col>
                                                </Row>
                                                <Row className='elemento'>
                                                    <Col xs="12" sm="12" lg="12">
                                                        <b>Desglose de movimiento estadístico</b>
                                                    </Col>
                                                    <Col xs="12" sm="12" lg="12">
                                                        <ListGroup>
                                                            {this.state.desgloseMoviemientoEstadistico.length > 0 && this.state.desgloseMoviemientoEstadistico.map((obj, index) => (
                                                                <ListGroupItem key={index}>{index + 1}.- <b>{obj.ct_Tipo}</b> por <b>{obj.ct_Subtipo}</b> corresponde a <b>{obj.per_Nombre} {obj.per_Apellido_Paterno} {obj.per_Apellido_Materno}</b> - {moment(obj.hte_Fecha_Transaccion).format("YYYY-MM-DD")}</ListGroupItem>
                                                            ))}
                                                        </ListGroup>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                        <Row className='contenedor-seccion'>
                                            <Col xs="12" sm="12" lg="12">
                                                <Row className='titulo'>
                                                    MOVIMIENTO ADMINISTRATIVO, ECLESIÁSTICO Y MATERIAL
                                                </Row>
                                            </Col>
                                        </Row>
                                        <Row className='contenedor-seccion'>
                                            <Col xs="12" sm="12" lg="12">
                                                <Row className='subtitulos'>
                                                    <Col xs="12" sm="12" lg="12" className='text-left'>
                                                        1.- ORGANIZACIONES
                                                    </Col>
                                                </Row>
                                                <Row className='lista-elementos'>
                                                    <Col xs="12" sm="12" lg="12">
                                                        <Row className='elemento'>
                                                            <Col xs="3" sm="3" lg="3">
                                                                Sociedad femenil
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='movtosAdministrativoEconomico.sociedadFemenil'
                                                                    value={this.state.movtosAdministrativoEconomico.sociedadFemenil}
                                                                    id='OrgSocFem'
                                                                    readOnly
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="OrgSocFem"
                                                                >
                                                                    Las organizaciones provienen de los Inf. Pastorales.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="3" sm="3" lg="3">
                                                                Sociedad juvenil
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='movtosAdministrativoEconomico.sociedadJuvenil'
                                                                    id="OrgSocJuv"
                                                                    value={this.state.movtosAdministrativoEconomico.sociedadJuvenil}
                                                                    readOnly
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="OrgSocJuv"
                                                                >
                                                                    Las organizaciones provienen de los Inf. Pastorales.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="3" sm="3" lg="3">
                                                                Departamento femenil
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='movtosAdministrativoEconomico.departamentoFemenil'
                                                                    id='OrgDepFem'
                                                                    value={this.state.movtosAdministrativoEconomico.departamentoFemenil}
                                                                    readOnly
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="OrgDepFem"
                                                                >
                                                                    Las organizaciones provienen de los Inf. Pastorales.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="3" sm="3" lg="3">
                                                                Departamento juvenil
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='movtosAdministrativoEconomico.departamentoJuvenil'
                                                                    id='OrgDepJuv'
                                                                    value={this.state.movtosAdministrativoEconomico.departamentoJuvenil}
                                                                    readOnly
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="OrgDepJuv"
                                                                >
                                                                    Las organizaciones provienen de los Inf. Pastorales.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="3" sm="3" lg="3">
                                                                Departamento infantil
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='movtosAdministrativoEconomico.departamentoInfantil'
                                                                    value={this.state.movtosAdministrativoEconomico.departamentoInfantil}
                                                                    id='OrgDepInf'
                                                                    readOnly
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="OrgDepInf"
                                                                >
                                                                    Las organizaciones provienen de los Inf. Pastorales.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="3" sm="3" lg="3">
                                                                Coros
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='movtosAdministrativoEconomico.coros'
                                                                    id='OrgCoros'
                                                                    value={this.state.movtosAdministrativoEconomico.coros}
                                                                    readOnly
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="OrgCoros"
                                                                >
                                                                    Las organizaciones provienen de los Inf. Pastorales.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="3" sm="3" lg="3">
                                                                Grupos de canto
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='movtosAdministrativoEconomico.gruposDeCanto'
                                                                    id='OrgGpos'
                                                                    value={this.state.movtosAdministrativoEconomico.gruposDeCanto}
                                                                    readOnly
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="OrgGpos"
                                                                >
                                                                    Las organizaciones provienen de los Inf. Pastorales.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                                <Row className='subtitulos'>
                                                    <Col xs="12" sm="12" lg="12" className='text-left'>
                                                        2.- SESIONES
                                                    </Col>
                                                </Row>
                                                <Row className='lista-elementos'>
                                                    <Col xs="12" sm="12" lg="12">
                                                        <Row className='elemento'>
                                                            <Col xs="3" sm="3" lg="3"></Col>
                                                            <Col xs="2" sm="2" lg="2" className='subtitulos'>
                                                                SESIONES
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2" className='subtitulos'>
                                                                REUNIONES
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="3" sm="3" lg="3">
                                                                En el Distrito
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='actividadObispo.sesionesObispo.enElDistrito'
                                                                    id='SesDto'
                                                                    value={this.state.actividadObispo.sesionesObispo.enElDistrito}
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target='SesDto'
                                                                >
                                                                    Cantidad de Sesiones (Que requieren levantarse Acta respectiva) presididas por el Obispo o designado del Obispo llevadas a cabo en actividad del Distrito.

                                                                </UncontrolledTooltip>
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='actividadObispo.reunionesObispo.enElDistrito'
                                                                    id='ReunDto'
                                                                    value={this.state.actividadObispo.reunionesObispo.enElDistrito}
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target='ReunDto'
                                                                >
                                                                    Cantidad de Reuniones (Que no requieren Acta, sino sólo minuta) presididas por el Obispo o designado del Obispo, llevadas a cabo en actividad del Distrito.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="3" sm="3" lg="3">
                                                                Con el personal docente
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='actividadObispo.sesionesObispo.conElPersonalDocente'
                                                                    id='SesPerMin'
                                                                    value={this.state.actividadObispo.sesionesObispo.conElPersonalDocente}
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target='SesPerMin'
                                                                >
                                                                    N/A

                                                                </UncontrolledTooltip>
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='actividadObispo.reunionesObispo.conElPersonalDocente'
                                                                    id='ReunPerMin'
                                                                    value={this.state.actividadObispo.reunionesObispo.conElPersonalDocente}
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="ReunPerMin"
                                                                >
                                                                    Cantidad de Reuniones (Que no requieren Acta, sino sólo minuta) presididas por el Obispo o designado del Obispo con la Soc. o Dpto. Femenil.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="3" sm="3" lg="3">
                                                                Con Sociedades o Dept. femenil
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='actividadObispo.sesionesObispo.conSociedadesFemeniles'
                                                                    id='SesFem'
                                                                    value={this.state.actividadObispo.sesionesObispo.conSociedadesFemeniles}
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="SesFem"
                                                                >
                                                                    N/A
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='actividadObispo.reunionesObispo.conSociedadesFemeniles'
                                                                    id='ReunFem'
                                                                    value={this.state.actividadObispo.reunionesObispo.conSociedadesFemeniles}
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="ReunFem"
                                                                >
                                                                    Cantidad de Reuniones (Que no requieren Acta, sino sólo minuta) presididas por el Obispo o designado del Obispo con la Soc. o Dpto. Femenil.

                                                                </UncontrolledTooltip>
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="3" sm="3" lg="3">
                                                                Con Sociedades o Depto. Juvenil
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='actividadObispo.sesionesObispo.conSociedadesJuveniles'
                                                                    id='SesJuv'
                                                                    value={this.state.actividadObispo.sesionesObispo.conSociedadesJuveniles}
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="SesJuv"
                                                                >
                                                                    N/A
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='actividadObispo.reunionesObispo.conSociedadesJuveniles'
                                                                    id="ReunJuv"
                                                                    value={this.state.actividadObispo.reunionesObispo.conSociedadesJuveniles}
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="ReunJuv"
                                                                >
                                                                    Cantidad de Reuniones (Que no requieren Acta, sino sólo minuta) presididas por el Obispo o designado del Obispo con la Soc. o Dpto. Juvenil.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="3" sm="3" lg="3">
                                                                Con Depto. infantil
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='actividadObispo.sesionesObispo.conDepartamentosInfantiles'
                                                                    id='SesInf'
                                                                    value={this.state.actividadObispo.sesionesObispo.conDepartamentosInfantiles}
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="SesInf"
                                                                >
                                                                    N/A
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='actividadObispo.reunionesObispo.conDepartamentosInfantiles'
                                                                    id='ReunInf'
                                                                    value={this.state.actividadObispo.reunionesObispo.conDepartamentosInfantiles}
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="ReunInf"
                                                                >
                                                                    Cantidad de Reuniones (Que no requieren Acta, sino sólo minuta) presididas por el Obispo o designado del Obispo con el  Dpto. Infantil.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="3" sm="3" lg="3">
                                                                Con Coros y Grupos de canto
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='actividadObispo.sesionesObispo.conCorosYGruposDeCanto'
                                                                    id='SesCoros'
                                                                    value={this.state.actividadObispo.sesionesObispo.conCorosYGruposDeCanto}
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="SesCoros"
                                                                >
                                                                    N/A
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='actividadObispo.reunionesObispo.conCorosYGruposDeCanto'
                                                                    id='ReunCoros'
                                                                    value={this.state.actividadObispo.reunionesObispo.conCorosYGruposDeCanto}
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="ReunCoros"
                                                                >
                                                                    Cantidad de Reuniones (Que no requieren Acta, sino sólo minuta) presididas por el Obispo o designado del Obispo con el  Dpto. Infantil.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                                <Row className='subtitulos'>
                                                    <Col xs="12" sm="12" lg="12" className='text-left'>
                                                        3.- ORDENACIONES
                                                    </Col>
                                                </Row>
                                                <Row className='lista-elementos'>
                                                    <Col xs="12" sm="12" lg="12">
                                                        <Row className='elemento'>
                                                            <Col xs="3" sm="3" lg="3">
                                                                Ancianos
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='movtosAdministrativoEconomico.ordenaciones.ancianos'
                                                                    id='OrdAnc'
                                                                    value={this.state.movtosAdministrativoEconomico.ordenaciones.ancianos}
                                                                    readOnly
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="OrdAnc"
                                                                >
                                                                    Las ordenaciones provienen de los Inf. Pastorales.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="3" sm="3" lg="3">
                                                                Diáconos
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='movtosAdministrativoEconomico.ordenaciones.diaconos'
                                                                    id='OrdDia'
                                                                    value={this.state.movtosAdministrativoEconomico.ordenaciones.diaconos}
                                                                    readOnly
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="OrdDia"
                                                                >
                                                                    Las ordenaciones provienen de los Inf. Pastorales.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                                <Row className='subtitulos'>
                                                    <Col xs="12" sm="12" lg="12" className='text-left'>
                                                        4.- LLAMAMIENTO DE PERSONAL
                                                    </Col>
                                                </Row>
                                                <Row className='lista-elementos'>
                                                    <Col xs="12" sm="12" lg="12">
                                                        <Row className='elemento'>
                                                            <Col xs="3" sm="3" lg="3">
                                                                Diáconos a pruebas
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='movtosAdministrativoEconomico.llamamientoDePersonal.diaconosAprueba'
                                                                    id='LlamDiac'
                                                                    value={this.state.movtosAdministrativoEconomico.llamamientoDePersonal.diaconosAprueba}
                                                                    readOnly
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="LlamDiac"
                                                                >
                                                                    Los llamamientos ministeriales provienen de los Inf. Pastorales.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="3" sm="3" lg="3">
                                                                Auxiliares
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='movtosAdministrativoEconomico.llamamientoDePersonal.auxiliares'
                                                                    id='LlamAux'
                                                                    value={this.state.movtosAdministrativoEconomico.llamamientoDePersonal.auxiliares}
                                                                    readOnly
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="LlamAux"
                                                                >
                                                                    Los llamamientos ministeriales provienen de los Inf. Pastorales.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                                <Row className='subtitulos'>
                                                    <Col xs="12" sm="12" lg="12" className='text-left'>
                                                        5.- ADQUISICIONES
                                                    </Col>
                                                </Row>
                                                <Row className='lista-elementos'>
                                                    <Col xs="12" sm="12" lg="12">
                                                        <Row className='elemento'>
                                                            <Col xs="3" sm="3" lg="3">

                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                Por Sectores
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                Por Admon. Distrital
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                Total
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="3" sm="3" lg="3">
                                                                Predios
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='movtosAdministrativoEconomico.adquisicionesSector.predios'
                                                                    id='AdqPreSec'
                                                                    value={this.state.movtosAdministrativoEconomico.adquisicionesSector.predios}
                                                                    readOnly
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="AdqPreSec"
                                                                >
                                                                    Adquisiciones de Predios hechas por los Sectores. Éstas provienen de los Inf. Pastorales.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='actividadObispo.adquisicionesDistrito.predios'
                                                                    id='AdqPreDis'
                                                                    value={this.state.actividadObispo.adquisicionesDistrito.predios}
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="AdqPreDis"
                                                                >
                                                                    Adquisiciones de Predios hechas exclusivamente por la Admon. Distrital.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    value={this.state.movtosAdministrativoEconomico.adquisicionesSector.predios + this.state.actividadObispo.adquisicionesDistrito.predios}
                                                                    id='AdqPreSuma'
                                                                    readOnly></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="AdqPreSuma"
                                                                >
                                                                    Suma de Adquisiciones de Predios hechas por los Sectores y por la Admon. Distrital.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="3" sm="3" lg="3">
                                                                Casas
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='movtosAdministrativoEconomico.adquisicionesSector.casas'
                                                                    id='AdqCasSec'
                                                                    value={this.state.movtosAdministrativoEconomico.adquisicionesSector.casas}
                                                                    readOnly
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="AdqCasSec"
                                                                >
                                                                    Adquisiciones de Casas hechas por los Sectores. Éstas provienen de los Inf. Pastorales.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='actividadObispo.adquisicionesDistrito.casas'
                                                                    id='AdqCasDis'
                                                                    value={this.state.actividadObispo.adquisicionesDistrito.casas}
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="AdqCasDis"
                                                                >
                                                                    Adquisiciones de Casas hechas exclusivamente por la Admon. Distrital.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    value={this.state.movtosAdministrativoEconomico.adquisicionesSector.casas + this.state.actividadObispo.adquisicionesDistrito.casas}
                                                                    id='AdqCasSuma'
                                                                    readOnly></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="AdqCasSuma"
                                                                >
                                                                    Suma de Adquisiciones de Casas, hechas por los Sectores y por la Admon. Distrital.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="3" sm="3" lg="3">
                                                                Edificios
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='movtosAdministrativoEconomico.adquisicionesSector.edificios'
                                                                    id='AdqEdiSec'
                                                                    value={this.state.movtosAdministrativoEconomico.adquisicionesSector.edificios}
                                                                    readOnly
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="AdqEdiSec"
                                                                >
                                                                    Adquisiciones de Edificios, realizadas por los Sectores. Éstas provienen de los Inf. Pastorales.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='actividadObispo.adquisicionesDistrito.edificios'
                                                                    id='AdqEdiDis'
                                                                    value={this.state.actividadObispo.adquisicionesDistrito.edificios}
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="AdqEdiDis"
                                                                >
                                                                    Adquisiciones de Edificios hechas exclusivamente por la Admon. Distrital.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    value={this.state.movtosAdministrativoEconomico.adquisicionesSector.edificios + this.state.actividadObispo.adquisicionesDistrito.edificios}
                                                                    id='AdqEdiSuma'
                                                                    readOnly></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="AdqEdiSuma"
                                                                >
                                                                    Suma de Adquisiciones de Edificios, hechas por los Sectores y por la Admon. Distrital.
                                                                </UncontrolledTooltip>

                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="3" sm="3" lg="3">
                                                                Templos
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='movtosAdministrativoEconomico.adquisicionesSector.templos'
                                                                    id='AdqTemSec'
                                                                    value={this.state.movtosAdministrativoEconomico.adquisicionesSector.templos}
                                                                    readOnly
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="AdqTemSec"
                                                                >
                                                                    Adquisiciones de Templos, realizadas por los Sectores. Éstas provienen de los Inf. Pastorales.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='actividadObispo.adquisicionesDistrito.templos'
                                                                    id='AdqTemDis'
                                                                    value={this.state.actividadObispo.adquisicionesDistrito.templos}
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="AdqTemDis"
                                                                >
                                                                    Adquisiciones de Templos, hechas exclusivamente por la Admon. Distrital.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    value={this.state.movtosAdministrativoEconomico.adquisicionesSector.templos + this.state.actividadObispo.adquisicionesDistrito.templos}
                                                                    id='AdqTemSuma'
                                                                    readOnly></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="AdqTemSuma"
                                                                >
                                                                    Suma de Adquisiciones de Templos, hechas por los Sectores y por la Admon. Distrital.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="3" sm="3" lg="3">
                                                                Vehículos
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='movtosAdministrativoEconomico.adquisicionesSector.vehiculos'
                                                                    id='AdqVehSec'
                                                                    value={this.state.movtosAdministrativoEconomico.adquisicionesSector.vehiculos}
                                                                    readOnly
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="AdqVehSec"
                                                                >
                                                                    Adquisiciones de Vehículos, realizadas por los Sectores. Éstas provienen de los Inf. Pastorales.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='actividadObispo.adquisicionesDistrito.vehiculos'
                                                                    id='AdqVehDis'
                                                                    value={this.state.actividadObispo.adquisicionesDistrito.vehiculos}
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="AdqVehDis"
                                                                >
                                                                    Adquisiciones de Vehículos, hechas exclusivamente por la Admon. Distrital.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    value={this.state.movtosAdministrativoEconomico.adquisicionesSector.vehiculos + this.state.actividadObispo.adquisicionesDistrito.vehiculos}
                                                                    id='AdqVehSuma'
                                                                    readOnly></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="AdqVehSuma"
                                                                >
                                                                    Suma de Adquisiciones de Vehículos, hechas por los Sectores y por la Admon. Distrital.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                                <Row className='subtitulos'>
                                                    <Col xs="12" sm="12" lg="12" className='text-left'>
                                                        6.- CONSTRUCCIONES
                                                    </Col>
                                                </Row>
                                                <Row className='lista-elementos'>
                                                    <Col xs="12" sm="12" lg="12">
                                                        <Row className='elemento'>
                                                            <Col xs="3" sm="3" lg="3"></Col>
                                                            <Col xs="3" sm="3" lg="3" className='subtitulos'>
                                                                EN SECTORES
                                                            </Col>
                                                            <Col xs="3" sm="3" lg="3" className='subtitulos'>
                                                                EN DISTRITO
                                                            </Col>
                                                            <Col xs="3" sm="3" lg="3" className='subtitulos'>
                                                                TOTAL
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="3" sm="3" lg="3"></Col>
                                                            <Col xs="9" sm="9" lg="9">
                                                                <Row>
                                                                    <Col xs="2" sm="2" lg="2" className='subtitulos'>
                                                                        Inicio
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2" className='subtitulos'>
                                                                        Conclusión
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2" className='subtitulos'>
                                                                        Inicio
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2" className='subtitulos'>
                                                                        Conclusión
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2" className='subtitulos'>
                                                                        Inicio
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2" className='subtitulos'>
                                                                        Conclusión
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="3" sm="3" lg="3">
                                                                Colocación de 1a. Piedra
                                                            </Col>
                                                            <Col xs="9" sm="9" lg="9">
                                                                <Row>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            name='movtosAdministrativoEconomico.construccionesInicio.colocacionPrimeraPiedra'
                                                                            id='ColPriPieSec'
                                                                            value={this.state.movtosAdministrativoEconomico.construccionesInicio.colocacionPrimeraPiedra}
                                                                            readOnly></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="ColPriPieSec"
                                                                        >
                                                                            Colocaciones de 1a. piedra, reportadas por los Sectores. Éstas provienen de los Inf. Pastorales.
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            name='movtosAdministrativoEconomico.construccionesConclusion.colocacionPrimeraPiedra'
                                                                            id='ColPriPieDis'
                                                                            value={this.state.movtosAdministrativoEconomico.construccionesConclusion.colocacionPrimeraPiedra}
                                                                            readOnly
                                                                            onChange={(e) => this.handleChange(e)}></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="ColPriPieDis"
                                                                        >
                                                                            N/A
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            name='actividadObispo.construccionesDistritoInicio.colocacionPrimeraPiedra'
                                                                            id='ColPriPieDisIni'
                                                                            value={this.state.actividadObispo.construccionesDistritoInicio.colocacionPrimeraPiedra}
                                                                            onChange={(e) => this.handleChange(e)}></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="ColPriPieDisIni"
                                                                        >
                                                                            Colocaciones de 1a. piedra, realizadas exclusivamente por la Admon. Distrital.
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            name='actividadObispo.construccionesDistritoFinal.colocacionPrimeraPiedra'
                                                                            id='ColPriPieDisConc'
                                                                            value={this.state.actividadObispo.construccionesDistritoFinal.colocacionPrimeraPiedra}
                                                                            onChange={(e) => this.handleChange(e)}></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="ColPriPieDisConc"
                                                                        >
                                                                            N/A
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            value={this.state.movtosAdministrativoEconomico.construccionesInicio.colocacionPrimeraPiedra + this.state.actividadObispo.construccionesDistritoInicio.colocacionPrimeraPiedra}
                                                                            id='ColPriPieSumaIni'
                                                                            readOnly></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="ColPriPieSumaIni"
                                                                        >
                                                                            Suma de Colocaciones de 1a. piedra, realizadas por Sectores y la Admon. Distrital.
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            value={this.state.movtosAdministrativoEconomico.construccionesConclusion.colocacionPrimeraPiedra + this.state.actividadObispo.construccionesDistritoFinal.colocacionPrimeraPiedra}
                                                                            id='ColPriPieSumaConc'
                                                                            readOnly></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="ColPriPieSumaConc"
                                                                        >
                                                                            N/A
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="3" sm="3" lg="3">
                                                                Templo
                                                            </Col>
                                                            <Col xs="9" sm="9" lg="9">
                                                                <Row>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            name='movtosAdministrativoEconomico.construccionesInicio.templo'
                                                                            id='ConstTemSecIni'
                                                                            value={this.state.movtosAdministrativoEconomico.construccionesInicio.templo}
                                                                            readOnly></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="ConstTemSecIni"
                                                                        >
                                                                            Cantidad de templos cuya construcción se inicia en el mes en curso, reportado por los Pastores
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            name='movtosAdministrativoEconomico.construccionesConclusion.templo'
                                                                            id='ConstTemSecConc'
                                                                            value={this.state.movtosAdministrativoEconomico.construccionesConclusion.templo}
                                                                            readOnly
                                                                            onChange={(e) => this.handleChange(e)}></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="ConstTemSecConc"
                                                                        >
                                                                            Cantidad de templos cuya construcción concluyó en el mes en curso reportada por los Pastores.
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            name='actividadObispo.construccionesDistritoInicio.templo'
                                                                            id='ConstTemDisIni'
                                                                            value={this.state.actividadObispo.construccionesDistritoInicio.templo}
                                                                            onChange={(e) => this.handleChange(e)}></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="ConstTemDisIni"
                                                                        >
                                                                            Cantidad de templos cuya construcción se inicia en el mes en curso que hayan sido gestionadas exclusivamente por la Administración Distrital.
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            name='actividadObispo.construccionesDistritoFinal.templo'
                                                                            id='ConstTemDisConc'
                                                                            value={this.state.actividadObispo.construccionesDistritoFinal.templo}
                                                                            onChange={(e) => this.handleChange(e)}></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="ConstTemDisConc"
                                                                        >
                                                                            Cantidad de  templos cuya construcción concluyó, que hayan sido gestionadas exclusivamente por la Administración Distrital.
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            value={this.state.movtosAdministrativoEconomico.construccionesInicio.templo + this.state.actividadObispo.construccionesDistritoInicio.templo}
                                                                            id='ConstTemSumaIni'
                                                                            readOnly></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="ConstTemSumaIni"
                                                                        >
                                                                            Suma de Templos en etapa inicial de construcción en el mes en curso, reportadas por Pastores y Admon. Distrital
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            value={this.state.movtosAdministrativoEconomico.construccionesConclusion.templo + this.state.actividadObispo.construccionesDistritoFinal.templo}
                                                                            id='ConstTemSumaConc'
                                                                            readOnly></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="ConstTemSumaConc"
                                                                        >
                                                                            Suma de Templos cuya construcción concluye en el mes en curso, reportadas por Pastores y Admon. Distrital
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="3" sm="3" lg="3">
                                                                Casa de Oración
                                                            </Col>
                                                            <Col xs="9" sm="9" lg="9">
                                                                <Row>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            name='movtosAdministrativoEconomico.construccionesInicio.casaDeOracion'
                                                                            id='ConstCasOraSecIni'
                                                                            value={this.state.movtosAdministrativoEconomico.construccionesInicio.casaDeOracion}
                                                                            readOnly></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="ConstCasOraSecIni"
                                                                        >
                                                                            Cantidad de Casas de Oración cuya construcción se inicia en el mes en curso, reportada en los Informes Pastorales.
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            name='movtosAdministrativoEconomico.construccionesConclusion.casaDeOracion'
                                                                            id='ConstCasOraSecConc'
                                                                            value={this.state.movtosAdministrativoEconomico.construccionesConclusion.casaDeOracion}
                                                                            readOnly
                                                                            onChange={(e) => this.handleChange(e)}></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="ConstCasOraSecConc"
                                                                        >
                                                                            Cantidad de Casas de Oración cuya construcción concluyó en el mes en curso, reportada en los Informes Pastorales.
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            name='actividadObispo.construccionesDistritoInicio.casaDeOracion'
                                                                            id='ConstCasOraDisIni'
                                                                            value={this.state.actividadObispo.construccionesDistritoInicio.casaDeOracion}
                                                                            onChange={(e) => this.handleChange(e)}></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="ConstCasOraDisIni"
                                                                        >
                                                                            Cantidad de Casas de Oración cuya construcción se inicia en el mes en curso, gestionadas exclusivamente por la Administración Distrital.
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            name='actividadObispo.construccionesDistritoFinal.casaDeOracion'
                                                                            id='ConstCasOraDisConc'
                                                                            value={this.state.actividadObispo.construccionesDistritoFinal.casaDeOracion}
                                                                            onChange={(e) => this.handleChange(e)}></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="ConstCasOraDisConc"
                                                                        >
                                                                            Cantidad de Casas de Oración cuya construcción concluyó en el mes en curso, gestionadas exclusivamente por la Administración Distrital.
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            value={this.state.movtosAdministrativoEconomico.construccionesInicio.casaDeOracion + this.state.actividadObispo.construccionesDistritoInicio.casaDeOracion}
                                                                            id='ConstCasOraSumaIni'
                                                                            readOnly></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="ConstCasOraSumaIni"
                                                                        >
                                                                            Suma de Casas de Oración en etapa inicial de construcción en el mes en curso, reportadas por Pastores y Admon. Distrital
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            value={this.state.movtosAdministrativoEconomico.construccionesConclusion.casaDeOracion + this.state.actividadObispo.construccionesDistritoFinal.casaDeOracion}
                                                                            id='ConstCasOraSumaConc'
                                                                            readOnly></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="ConstCasOraSumaConc"
                                                                        >
                                                                            Suma de Casas de Oración cuya construcción concluye en el mes en curso, reportadas por Pastores y Admon. Distrital
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="3" sm="3" lg="3">
                                                                Casa pastoral
                                                            </Col>
                                                            <Col xs="9" sm="9" lg="9">
                                                                <Row>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            name='movtosAdministrativoEconomico.construccionesInicio.casaPastoral'
                                                                            id='ConstCasPastSecIni'
                                                                            value={this.state.movtosAdministrativoEconomico.construccionesInicio.casaPastoral}
                                                                            readOnly></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="ConstCasPastSecIni"
                                                                        >
                                                                            Cantidad de Casas Pastorales cuya construcción se inicia en el mes en curso, reportada en los Informes Pastorales.
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            name='movtosAdministrativoEconomico.construccionesConclusion.casaPastoral'
                                                                            id='ConstCasPastSecConc'
                                                                            value={this.state.movtosAdministrativoEconomico.construccionesConclusion.casaPastoral}
                                                                            readOnly
                                                                            onChange={(e) => this.handleChange(e)}></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="ConstCasPastSecConc"
                                                                        >
                                                                            Cantidad de Casas Pastorales cuya construcción concluyó en el mes en curso, reportada en los Informes Pastorales.
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            name='actividadObispo.construccionesDistritoInicio.casaPastoral'
                                                                            id='ConstCasPastDisIni'
                                                                            value={this.state.actividadObispo.construccionesDistritoInicio.casaPastoral}
                                                                            onChange={(e) => this.handleChange(e)}></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="ConstCasPastDisIni"
                                                                        >
                                                                            Cantidad de Casas Pastorales cuya construcción se inicia en el mes en curso, gestionadas exclusivamente por la Administración Distrital.
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            name='actividadObispo.construccionesDistritoFinal.casaPastoral'
                                                                            id='ConstCasPastDisConc'
                                                                            value={this.state.actividadObispo.construccionesDistritoFinal.casaPastoral}
                                                                            onChange={(e) => this.handleChange(e)}></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="ConstCasPastDisConc"
                                                                        >
                                                                            Cantidad de Casas Pastorales cuya construcción concluyó en el mes en curso, gestionadas exclusivamente por la Administración Distrital.
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            value={this.state.movtosAdministrativoEconomico.construccionesInicio.casaPastoral + this.state.actividadObispo.construccionesDistritoInicio.casaPastoral}
                                                                            id='ConstCasPastSumaIni'
                                                                            readOnly></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="ConstCasPastSumaIni"
                                                                        >
                                                                            Suma de Casas Pastorales en etapa inicial de construcción en el mes en curso, reportadas por Pastores y Admon. Distrital
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            value={this.state.movtosAdministrativoEconomico.construccionesConclusion.casaPastoral + this.state.actividadObispo.construccionesDistritoFinal.casaPastoral}
                                                                            id='ConstCasPastSumaConc'
                                                                            readOnly></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="ConstCasPastSumaConc"
                                                                        >
                                                                            Suma de Casas Pastorales cuya construcción concluye en el mes en curso, reportadas por Pastores y Admon. Distrital
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="3" sm="3" lg="3">
                                                                Anexos
                                                            </Col>
                                                            <Col xs="9" sm="9" lg="9">
                                                                <Row>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            name='movtosAdministrativoEconomico.construccionesInicio.anexos'
                                                                            id='ConstAnexSecIni'
                                                                            value={this.state.movtosAdministrativoEconomico.construccionesInicio.anexos}
                                                                            readOnly></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="ConstAnexSecIni"
                                                                        >
                                                                            Cantidad de Anexos cuya construcción se inicia en el mes en curso, reportada en los Informes Pastorales.
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            name='movtosAdministrativoEconomico.construccionesConclusion.anexos'
                                                                            id='ConstAnexSecConc'
                                                                            value={this.state.movtosAdministrativoEconomico.construccionesConclusion.anexos}
                                                                            readOnly
                                                                            onChange={(e) => this.handleChange(e)}></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="ConstAnexSecConc"
                                                                        >
                                                                            Cantidad de Anexos cuya construcción concluyó en el mes en curso, reportada en los Informes Pastorales.
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            name='actividadObispo.construccionesDistritoInicio.anexos'
                                                                            id='ConstAnexDisIni'
                                                                            value={this.state.actividadObispo.construccionesDistritoInicio.anexos}
                                                                            onChange={(e) => this.handleChange(e)}></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="ConstAnexDisIni"
                                                                        >
                                                                            Cantidad de Anexos cuya construcción se inicia en el mes en curso, gestionadas exclusivamente por la Administración Distrital.
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            name='actividadObispo.construccionesDistritoFinal.anexos'
                                                                            id='ConstAnexDisConc'
                                                                            value={this.state.actividadObispo.construccionesDistritoFinal.anexos}
                                                                            onChange={(e) => this.handleChange(e)}></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="ConstAnexDisConc"
                                                                        >
                                                                            Cantidad de Anexos cuya construcción concluyó en el mes en curso, gestionadas exclusivamente por la Administración Distrital.
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            value={this.state.movtosAdministrativoEconomico.construccionesInicio.anexos + this.state.actividadObispo.construccionesDistritoInicio.anexos}
                                                                            id='ConstAnextSumaIni'
                                                                            readOnly></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="ConstAnextSumaIni"
                                                                        >
                                                                            Suma de Anexos en etapa inicial de construcción en el mes en curso, reportadas por Pastores y Admon. Distrital
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            value={this.state.movtosAdministrativoEconomico.construccionesConclusion.anexos + this.state.actividadObispo.construccionesDistritoFinal.anexos}
                                                                            id='ConstAnexSumaConc'
                                                                            readOnly></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="ConstAnexSumaConc"
                                                                        >
                                                                            Suma de Anexos cuya construcción concluye en el mes en curso, reportadas por Pastores y Admon. Distrital
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="3" sm="3" lg="3">
                                                                Remodelación
                                                            </Col>
                                                            <Col xs="9" sm="9" lg="9">
                                                                <Row>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            name='movtosAdministrativoEconomico.construccionesInicio.remodelacion'
                                                                            id='ConstRemSecIni'
                                                                            value={this.state.movtosAdministrativoEconomico.construccionesInicio.remodelacion}
                                                                            readOnly></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="ConstRemSecIni"
                                                                        >
                                                                            Cantidad de Remodelaciones cuya construcción se inicia en el mes en curso, reportada en los Informes Pastorales.
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            name='movtosAdministrativoEconomico.construccionesConclusion.remodelacion'
                                                                            id='ConstRemSecConc'
                                                                            value={this.state.movtosAdministrativoEconomico.construccionesConclusion.remodelacion}
                                                                            readOnly
                                                                            onChange={(e) => this.handleChange(e)}></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="ConstRemSecConc"
                                                                        >
                                                                            Cantidad de Remodelaciones cuya construcción concluyó en el mes en curso, reportada en los Informes Pastorales.
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            name='actividadObispo.construccionesDistritoInicio.remodelacion'
                                                                            id='ConstRemDisIni'
                                                                            value={this.state.actividadObispo.construccionesDistritoInicio.remodelacion}
                                                                            onChange={(e) => this.handleChange(e)}></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="ConstRemDisIni"
                                                                        >
                                                                            Cantidad de Remodelaciones cuya construcción se inicia en el mes en curso, gestionadas exclusivamente por la Administración Distrital.
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            name='actividadObispo.construccionesDistritoFinal.remodelacion'
                                                                            id='ConstRemDisConc'
                                                                            value={this.state.actividadObispo.construccionesDistritoFinal.remodelacion}
                                                                            onChange={(e) => this.handleChange(e)}></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="ConstRemDisConc"
                                                                        >
                                                                            Cantidad de Remodelaciones cuya construcción concluyó en el mes en curso, gestionadas exclusivamente por la Administración Distrital.
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            value={this.state.movtosAdministrativoEconomico.construccionesInicio.remodelacion + this.state.actividadObispo.construccionesDistritoInicio.remodelacion}
                                                                            id='ConstRemSumaIni'
                                                                            readOnly></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="ConstRemSumaIni"
                                                                        >
                                                                            Suma de Remodelaciones en etapa inicial de construcción en el mes en curso, reportadas por Pastores y Admon. Distrital
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            value={this.state.movtosAdministrativoEconomico.construccionesConclusion.remodelacion + this.state.actividadObispo.construccionesDistritoFinal.remodelacion}
                                                                            id='ConstRemSumaConc'
                                                                            readOnly></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="ConstRemSumaConc"
                                                                        >
                                                                            Suma de Remodelaciones cuya construcción concluye en el mes en curso, reportadas por Pastores y Admon. Distrital
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                                <Row className='subtitulos'>
                                                    <Col xs="12" sm="12" lg="12" className='text-left'>
                                                        7.- DEDICACIONES
                                                    </Col>
                                                </Row>
                                                <Row className='lista-elementos'>
                                                    <Col xs="12" sm="12" lg="12">
                                                        <Row className='elemento'>
                                                            <Col xs="3" sm="3" lg="3"></Col>
                                                            <Col xs="2" sm="2" lg="2" className='subtitulos'>
                                                                EN SECTORES
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2" className='subtitulos'>
                                                                POR ADMON. DISTRITAL
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2" className='subtitulos'>
                                                                TOTAL
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="3" sm="3" lg="3">
                                                                Templos
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='movtosAdministrativoEconomico.dedicaciones.templos'
                                                                    id='DedTemSec'
                                                                    value={this.state.movtosAdministrativoEconomico.dedicaciones.templos}
                                                                    readOnly></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="DedTemSec"
                                                                >
                                                                    Cantidad de dedicaciones de Templos en el mes en curso, reportada en los Informes Pastorales
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='actividadObispo.dedicacionesDistrito.templos'
                                                                    id='DedTemDis'
                                                                    value={this.state.actividadObispo.dedicacionesDistrito.templos}
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="DedTemDis"
                                                                >
                                                                    Cantidad de  Dedicaciones de Templos en el mes en curso, que hayan sido gestionadas por el Distrito y no por algún Sector
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    value={this.state.movtosAdministrativoEconomico.dedicaciones.templos + this.state.dedicaciones.templos}
                                                                    id='DedTemSuma'
                                                                    readOnly></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="DedTemSuma"
                                                                >
                                                                    Suma de Dedicaciones de Templos en el mes en curso, las reportadas por los Sectores y las gestionadas por el Distrito.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="3" sm="3" lg="3">
                                                                Casas de Oración
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='movtosAdministrativoEconomico.dedicaciones.casasDeOracion'
                                                                    id='DedCasOraSec'
                                                                    value={this.state.movtosAdministrativoEconomico.dedicaciones.casasDeOracion}
                                                                    readOnly></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="DedCasOraSec"
                                                                >
                                                                    Cantidad de Dedicaciones de Casas de Oración en el mes en curso, reportada en los Informes Pastorales
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='actividadObispo.dedicacionesDistrito.casasDeOracion'
                                                                    id='DedCasoraDis'
                                                                    value={this.state.actividadObispo.dedicacionesDistrito.casasDeOracion}
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="DedCasoraDis"
                                                                >
                                                                    Cantidad de Dedicaciones de Casas de Oración en el mes en curso, que hayan sido gestionadas por el Distrito y no por algún Sector
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                            <Col xs="2" sm="2" lg="2">
                                                                <Input type='number' min={0} max={9999}
                                                                    value={this.state.movtosAdministrativoEconomico.dedicaciones.casasDeOracion + this.state.dedicaciones.casasDeOracion}
                                                                    id='DedCasoraSuma'
                                                                    readOnly></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="DedCasoraSuma"
                                                                >
                                                                    Suma de Dedicaciones de Casas de Oración en el mes en curso, las reportadas por los Sectores y las gestionadas por el Distrito.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                                <Row className='subtitulos'>
                                                    <Col xs="12" sm="12" lg="12" className='text-left'>
                                                        8.- REGULARIZACION DE PREDIOS Y TEMPLOS
                                                    </Col>
                                                </Row>
                                                <Row className='lista-elementos'>
                                                    <Col xs="12" sm="12" lg="12">
                                                        <Row className='elemento'>
                                                            <Col xs="3" sm="3" lg="3"></Col>
                                                            <Col xs="3" sm="3" lg="3" className='subtitulos'>
                                                                EN SECTORES
                                                            </Col>
                                                            <Col xs="3" sm="3" lg="3" className='subtitulos'>
                                                                POR ADMON. DISTRITAL
                                                            </Col>
                                                            <Col xs="3" sm="3" lg="3" className='subtitulos'>
                                                                TOTAL
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="3" sm="3" lg="3"></Col>
                                                            <Col xs="9" sm="9" lg="9">
                                                                <Row>
                                                                    <Col xs="2" sm="2" lg="2" className='subtitulos'>
                                                                        Patrimonio Nacional
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2" className='subtitulos'>
                                                                        Patrimonio de la Iglesia
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2" className='subtitulos'>
                                                                        Patrimonio Nacional
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2" className='subtitulos'>
                                                                        Patrimonio de la Iglesia
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2" className='subtitulos'>
                                                                        Patrimonio Nacional
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2" className='subtitulos'>
                                                                        Patrimonio de la Iglesia
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="3" sm="3" lg="3">
                                                                Templos
                                                            </Col>
                                                            <Col xs="9" sm="9" lg="9">
                                                                <Row>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            name='movtosAdministrativoEconomico.regularizacionPatNac.templos'
                                                                            id='RegTemNacSec'
                                                                            value={this.state.movtosAdministrativoEconomico.regularizacionPatNac.templos}
                                                                            readOnly></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="RegTemNacSec"
                                                                        >
                                                                            Cantidad de regularizaciones de Predios de Templos considerados Propiedad de la Nación que hayan concluido en el mes en curso  informadas en los Informes Pastorales.
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            name='movtosAdministrativoEconomico.regularizacionPatIg.templos'
                                                                            id='RegTemIglSec'
                                                                            value={this.state.movtosAdministrativoEconomico.regularizacionPatIg.templos}
                                                                            readOnly
                                                                            onChange={(e) => this.handleChange(e)}></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="RegTemIglSec"
                                                                        >
                                                                            Cantidad de regularizaciones de Predios de Templos considerados Propiedad de la Iglesia que hayan concluido en el mes en curso  informadas en los Informes Pastorales.
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            name='actividadObispo.regularizacionesPrediosTemplosNacionDistrito.templos'
                                                                            id='RegTemNacDis'
                                                                            value={this.state.actividadObispo.regularizacionesPrediosTemplosNacionDistrito.templos}
                                                                            onChange={(e) => this.handleChange(e)}></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="RegTemNacDis"
                                                                        >
                                                                            Cantidad de  regularizaciones de Predios de Templos Propiedad de la Nación que hayan sido gestionadas exclusivamente por la Administración Distrital.
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            name='actividadObispo.regularizacionesPrediosTemplosIglesiaDistrito.templos'
                                                                            id='RegTemIglDis'
                                                                            value={this.state.actividadObispo.regularizacionesPrediosTemplosIglesiaDistrito.templos}
                                                                            onChange={(e) => this.handleChange(e)}></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="RegTemIglDis"
                                                                        >
                                                                            Cantidad de regularizaciones de Predios de Templos Propiedad de la Iglesia que hayan sido gestionadas exclusivamente por la Administración Distrital.
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            id='RegTemNacSuma'
                                                                            value={this.state.movtosAdministrativoEconomico.regularizacionPatNac.templos + this.state.actividadObispo.regularizacionesPrediosTemplosNacionDistrito.templos}
                                                                            readOnly></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="RegTemNacSuma"
                                                                        >
                                                                            Suma de Regularizaciones de predios de Templos Propiedad de la Nación que hayan sido gestionadas tanto por los Sectores como por la Administración Distrital.
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            value={this.state.movtosAdministrativoEconomico.regularizacionPatIg.templos + this.state.actividadObispo.regularizacionesPrediosTemplosIglesiaDistrito.templos}
                                                                            id='RegTemIglSuma'
                                                                            readOnly></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="RegTemIglSuma"
                                                                        >
                                                                            Suma de regularizaciones de Predios de Templos Propiedad de la Iglesia que hayan sido gestionadas tanto por los Sectores como por la Administración Distrital.
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="3" sm="3" lg="3">
                                                                Casas pastorales
                                                            </Col>
                                                            <Col xs="9" sm="9" lg="9">
                                                                <Row>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            name='movtosAdministrativoEconomico.regularizacionPatNac.casasPastorales'
                                                                            id='RegCasPastNacSec'
                                                                            value={this.state.movtosAdministrativoEconomico.regularizacionPatNac.casasPastorales}
                                                                            readOnly></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="RegCasPastNacSec"
                                                                        >
                                                                            Cantidad de regularizaciones de Predios de Casas Pastorales considerados Propiedad de la Nación que hayan concluido en el mes en curso  informadas en los Informes Pastorales.
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            name='movtosAdministrativoEconomico.regularizacionPatIg.casasPastorales'
                                                                            id='RegCasPastIglSec'
                                                                            value={this.state.movtosAdministrativoEconomico.regularizacionPatIg.casasPastorales}
                                                                            readOnly
                                                                            onChange={(e) => this.handleChange(e)}></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="RegCasPastIglSec"
                                                                        >
                                                                            Cantidad de regularizaciones de Predios de Casas Pastorales considerados Propiedad de la Iglesia que hayan concluido en el mes en curso  informadas en los Informes Pastorales.
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            name='actividadObispo.regularizacionesPrediosTemplosNacionDistrito.casasPastorales'
                                                                            id='RegCasPastNacDis'
                                                                            value={this.state.actividadObispo.regularizacionesPrediosTemplosNacionDistrito.casasPastorales}
                                                                            onChange={(e) => this.handleChange(e)}></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="RegCasPastNacDis"
                                                                        >
                                                                            Cantidad de  regularizaciones de Predios de Casas Pastorales Propiedad de la Nación que hayan sido gestionadas exclusivamente por la Administración Distrital.
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            name='actividadObispo.regularizacionesPrediosTemplosIglesiaDistrito.casasPastorales'
                                                                            id='RegCasPastIglDis'
                                                                            value={this.state.actividadObispo.regularizacionesPrediosTemplosIglesiaDistrito.casasPastorales}
                                                                            onChange={(e) => this.handleChange(e)}></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="RegCasPastIglDis"
                                                                        >
                                                                            Cantidad de regularizaciones de Predios de Casas Pastorales Propiedad de la Iglesia que hayan sido gestionadas exclusivamente por la Administración Distrital.
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            id='RegCasPastNacSuma'
                                                                            value={this.state.movtosAdministrativoEconomico.regularizacionPatNac.casasPastorales + this.state.actividadObispo.regularizacionesPrediosTemplosNacionDistrito.casasPastorales}
                                                                            readOnly></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="RegCasPastNacSuma"
                                                                        >
                                                                            Suma de Regularizaciones de predios de Casas Pastorales Propiedad de la Nación que hayan sido gestionadas tanto por los Sectores como por la Administración Distrital.
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                    <Col xs="2" sm="2" lg="2">
                                                                        <Input type='number' min={0} max={9999}
                                                                            id='RegCasPastIglSuma'
                                                                            value={this.state.movtosAdministrativoEconomico.regularizacionPatIg.casasPastorales + this.state.actividadObispo.regularizacionesPrediosTemplosIglesiaDistrito.casasPastorales}
                                                                            readOnly></Input>
                                                                        <UncontrolledTooltip
                                                                            placement="right"
                                                                            target="RegCasPastIglSuma"
                                                                        >
                                                                            Suma de regularizaciones de Predios de Casas Pastorales Propiedad de la Iglesia que hayan sido gestionadas tanto por los Sectores como por la Administración Distrital.
                                                                        </UncontrolledTooltip>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                        <Row className='contenedor-seccion'>
                                            <Col xs="12" sm="12" lg="12">
                                                <Row className='titulo'>
                                                    MOVIMIENTO ECONOMICO DE LA ADMINISTRACION DE DISTRITO
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
                                                                    name='movtosAdministrativoEconomico.movimientoEconomico.existenciaAnterior'
                                                                    id='exAnterior'
                                                                    value={this.state.movtosAdministrativoEconomico.movimientoEconomico.existenciaAnterior}
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="exAnterior"
                                                                >
                                                                    Cantidad con la que cerró la tesorería Distrital en el mes anterior.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="8" sm="8" lg="8">
                                                                Entradas en el mes
                                                            </Col>
                                                            <Col xs="4" sm="4" lg="4">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='movtosAdministrativoEconomico.movimientoEconomico.entradaMes'
                                                                    id='entradas'
                                                                    value={this.state.movtosAdministrativoEconomico.movimientoEconomico.entradaMes}
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="entradas"
                                                                >
                                                                    Cantidad del Total de entradas a la tesorería Distrital en el mes en curso.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="8" sm="8" lg="8">
                                                                Suma total
                                                            </Col>
                                                            <Col xs="4" sm="4" lg="4">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='movtosAdministrativoEconomico.movimientoEconomico.sumaTotal'
                                                                    id='sumaTotal'
                                                                    value={parseFloat(this.state.movtosAdministrativoEconomico.movimientoEconomico.existenciaAnterior) + parseFloat(this.state.movtosAdministrativoEconomico.movimientoEconomico.entradaMes)}
                                                                    disabled
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="sumaTotal"
                                                                >
                                                                    Suma de la Existencia anterior y la Entrada del mes en curso.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                    <Col xs="6" sm="6" lg="6">
                                                        <Row className='elemento'>
                                                            <Col xs="8" sm="8" lg="8">
                                                                Gastos de la Admon.
                                                            </Col>
                                                            <Col xs="4" sm="4" lg="4">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='movtosAdministrativoEconomico.movimientoEconomico.gastosAdmon'
                                                                    id='gastosAdmon'
                                                                    value={this.state.movtosAdministrativoEconomico.movimientoEconomico.gastosAdmon}
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="gastosAdmon"
                                                                >
                                                                    Total de Gastos de la Administración del Distrito del mes en curso.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="8" sm="8" lg="8">
                                                                Transf. a Tes. Gral.
                                                            </Col>
                                                            <Col xs="4" sm="4" lg="4">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='movtosAdministrativoEconomico.movimientoEconomico.transferenciasAentidadSuperior'
                                                                    id='transf'
                                                                    value={this.state.movtosAdministrativoEconomico.movimientoEconomico.transferenciasAentidadSuperior}
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="transf"
                                                                >
                                                                    Total de Transferencias de la Tesorería del Distrito a la Tesorería General.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="8" sm="8" lg="8">
                                                                Existencia en caja
                                                            </Col>
                                                            <Col xs="4" sm="4" lg="4">
                                                                <Input type='number' min={0} max={9999}
                                                                    name='movtosAdministrativoEconomico.movimientoEconomico.existenciaEnCaja'
                                                                    id='existenciaFinal'
                                                                    value={(parseFloat(this.state.movtosAdministrativoEconomico.movimientoEconomico.existenciaAnterior) + parseFloat(this.state.movtosAdministrativoEconomico.movimientoEconomico.entradaMes)) - (parseFloat(this.state.movtosAdministrativoEconomico.movimientoEconomico.gastosAdmon) + parseFloat(this.state.movtosAdministrativoEconomico.movimientoEconomico.transferenciasAentidadSuperior))}
                                                                    disabled
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="existenciaFinal"
                                                                >
                                                                    Existencia al final del Mes en curso.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                        <Row className='contenedor-seccion'>
                                            <Col xs="12" sm="12" lg="12">
                                                <Row className='titulo'>
                                                    ACUERDOS DEL DISTRITO
                                                </Row>
                                            </Col>
                                            <Col xs="11" sm="11" lg="11">
                                                <Input style={{ maxHeight: '20em', minHeight: '2em' }} className='m-2' type='textarea'
                                                    name='acuerdoDeDistritoTextArea'
                                                    id='acuerdos'
                                                    value={this.state.acuerdoDeDistritoTextArea}
                                                    onChange={(e) => this.handleAcuerdoDeDistrito(e)}></Input>
                                                <UncontrolledTooltip
                                                    placement="bottom"
                                                    target="acuerdos"
                                                >
                                                    Desglose de los Acuerdos tomados por el Distrito en las Sesiones Ordinarias de información o Sesiones extraordinarias del mes en Curso.
                                                </UncontrolledTooltip>
                                            </Col>
                                            <Col xs="1" sm="1" lg="1" className='text-center align-self-center'>
                                                <Button color='success' onClick={() => this.agregarAcuerdoDeDistrito()}><span className='fa fa-icon fa-check'></span></Button>
                                            </Col>
                                            <Col xs="12" sm="12" lg="12">
                                                <ListGroup className='m-2'>
                                                    {this.state.acuerdosDeDistrito.length > 0 && this.state.acuerdosDeDistrito.map((obj, index) => (
                                                        <Row>
                                                            <Col xs="10" sm="10" lg="10">
                                                                <ListGroupItem key={obj.numDeOrdenDeAcuerdo}>{index + 1}.-{obj.descripcion}</ListGroupItem>
                                                            </Col>
                                                            <Col xs="1" sm="1" lg="1" className='text-center align-self-center'>
                                                                <Button color='info' onClick={() => this.editarAcuerdoDeDistrito(index)}><span className='fa fa-icon fa-edit'></span></Button>
                                                            </Col>
                                                            <Col xs="1" sm="1" lg="1" className='text-center align-self-center'>
                                                                <Button color='danger' onClick={() => this.eliminarAcuerdoDeDistrito(index)}><span className='fa fa-icon fa-times'></span></Button>
                                                            </Col>
                                                        </Row>
                                                    ))}
                                                </ListGroup>
                                            </Col>
                                        </Row>
                                        <Row className='contenedor-seccion'>
                                            <Col xs="12" sm="12" lg="12">
                                                <Row className='titulo'>
                                                    OTRAS ACTIVIDADES
                                                </Row>
                                            </Col>
                                            <Col xs="11" sm="11" lg="11">
                                                <Input style={{ maxHeight: '20em', minHeight: '2em' }} className='m-2' type='textarea'
                                                    name='otraActividadTextArea'
                                                    id='otrasActividades'
                                                    value={this.state.otraActividadTextArea}
                                                    onChange={(e) => this.handleOtraActividad(e)}></Input>
                                                <UncontrolledTooltip
                                                    placement="bottom"
                                                    target="otrasActividades"
                                                >
                                                    Actividades realizadas por el Obispo efectuadas dentro de la jurisdiccion distrital y que no pudieron se reflejados en algún concepto de las Secciones del presente informe mensual distrital. Tambien puede agregarse comentarios complementarios de aquellos conceptos que en los rubros predefinidos en este informe requieran ampliar explicación para dar claridad del trabajo realizado en el mes.
                                                </UncontrolledTooltip>
                                            </Col>
                                            <Col xs="1" sm="1" lg="1" className='text-center align-self-center'>
                                                <Button color='success' onClick={() => this.agregarActividad()}><span className='fa fa-icon fa-check'></span></Button>
                                            </Col>
                                            <Col xs="12" sm="12" lg="12">
                                                <ListGroup className='m-2'>
                                                    {this.state.otrasActividadesObispo.length > 0 && this.state.otrasActividadesObispo.map((obj, index) => (
                                                        <Row>
                                                            <Col xs="10" sm="10" lg="10">
                                                                <ListGroupItem key={obj.numDeOrden}>{index + 1}.-{obj.descripcion}</ListGroupItem>
                                                            </Col>
                                                            <Col xs="1" sm="1" lg="1" className='text-center align-self-center'>
                                                                <Button color='info' onClick={() => this.editarActividad(index)}><span className='fa fa-icon fa-edit'></span></Button>
                                                            </Col>
                                                            <Col xs="1" sm="1" lg="1" className='text-center align-self-center'>
                                                                <Button color='danger' onClick={() => this.eliminarActividad(index)}><span className='fa fa-icon fa-times'></span></Button>
                                                            </Col>
                                                        </Row>
                                                    ))}
                                                </ListGroup>
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
                                                    Obispo del Distrito
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
                                    </FormGroup>
                                }
                            </CardBody>
                        </Form>
                    </Card >
                    <Row className='botones-inferiores'>
                        <Button color='primary' onClick={() => this.togglePage(this.state.pagina - 1)}><span className='fa fa-icon fa-arrow-left'></span></Button>
                        <span className='paginador'>Pagina {this.state.pagina} / {this.maxPaginas}</span>
                        <Button color='primary' onClick={() => this.togglePage(this.state.pagina + 1)}><span className='fa fa-icon fa-arrow-right'></span></Button>
                    </Row>
                </Container >
                <Modal isOpen={this.state.modalShow}>
                    <ModalBody>
                        {this.state.mensajeDelProceso}
                    </ModalBody>
                </Modal>
            </>
        );
    }
}

export default InformeObispo;