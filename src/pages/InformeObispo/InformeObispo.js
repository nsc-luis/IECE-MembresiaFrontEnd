import React, { Component } from 'react';
import helpers from '../../components/Helpers';
import {
    Button, Input, Alert, Container, Row, Col, Card, FormFeedback, ButtonGroup, InputGroup, Table,
    Form, FormGroup, CardBody, CardFooter, ListGroup, ListGroupItem, UncontrolledTooltip
} from 'reactstrap';
import './style.css'

import rutaLogo from '../../assets/images/IECE_LogoOficial.jpg'
import moment from 'moment/moment';

class InformeObispo extends Component {
    infoSesion = JSON.parse(localStorage.getItem('infoSesion'));
    maxPaginas = 2;
    cellNumber = new Array(22).fill()
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
            // TERMINA OBISPO
            distrito: {
                dis_Numero: 0,
                dis_Alias: ''
            },
            misiones: [],
            visitantesPermantes: [],
            desgloseMoviemientoEstadistico: [],
            indiceActividad: null,
            otraActividadTextArea: "",
            otrasActividades: [],
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
        // this.getSector();
        // this.getSectores();
    }

    getDistrito = async () => {
        await helpers.validaToken().then(helpers.authAxios.get('/Distrito/' + localStorage.getItem('dto'))
            .then(res => {
                this.setState({
                    distrito: res.data
                })
                console.log(res.data);
                const { id } = this.props.match.params;
                this.obtenerInforme(id);
                console.log(res.data);
            })
        );
    }

    // getSector = async () => {
    //     await helpers.validaToken().then(helpers.authAxios.get('/Sector/' + localStorage.getItem('sector'))
    //         .then(res => {
    //             this.setState({
    //                 sector: res.data.sector[0]
    //             })
    //         })
    //     );
    // }

    // getSectores = async () => {
    //     await helpers.validaToken().then(helpers.authAxios.get('/Sector/GetSectoresByDistrito/' + localStorage.getItem('dto'))
    //         .then(res => {
    //             this.setState({
    //                 sectores: res.data.sectores.sort((a,b) => {return b.sec_Tipo_Sector.localeCompare(a.sec_Tipo_Sector)})
    //             })
    //             const { id } = this.props.match.params;
    //             this.obtenerInforme(id);
    //             console.log(res.data);
    //         })
    //     );
    // }

    // obtenerDatosEstadisticos = async () => {
    //     const body = {
    //         sec_Id_Sector: this.state.sector.sec_Id_Sector,
    //         year: this.state.informe.anio,
    //         mes: this.state.informe.mes
    //     }
    //     await helpers.validaToken().then(helpers.authAxios.post("Registro_Transacciones/movimientosEstadisticosReporteBySector", body)
    //         .then(res => {
    //             console.log(res);
    //             this.setState({
    //                 datosEstadisticos: res.data
    //             })
    //         })
    //     );
    // }

    obtenerInforme = async (id) => {
        await helpers.validaToken().then(helpers.authAxios.get("/Informe/Obispo/" + id)
            .then(res => {
                console.log(res);
                this.state.informe = res.data.informe;
                // this.state.informe.fechaReunion = moment(res.data.fechaReunion).format('YYYY-MM-DD');
                // this.state.visitasPastor = res.data.visitasPastor !== null ? res.data.visitasPastor : this.state.visitasPastor;
                // this.state.cultosSector = res.data.cultosSector !== null ? res.data.cultosSector : this.state.cultosSector;
                // this.state.estudiosSector.estudios = res.data.estudiosSector !== null ? res.data.estudiosSector : this.state.estudiosSector.estudios;
                // this.state.estudiosSector.conferencias = res.data.conferenciasSector !== null ? res.data.conferenciasSector : this.state.estudiosSector.conferencias;
                // this.state.trabajoEvangelismo = res.data.trabajoEvangelismo !== null ? res.data.trabajoEvangelismo : this.state.trabajoEvangelismo;
                // this.state.misiones = res.data.cultosMisionSector !== null ? res.data.cultosMisionSector : this.state.cultosMisionSector;
                // this.state.organizaciones = res.data.organizaciones !== null ? res.data.organizaciones : this.state.organizaciones;
                // this.state.adquisicionesSector = res.data.adquisicionesSector !== null ? res.data.adquisicionesSector : this.state.adquisicionesSector;
                // this.state.sesiones = res.data.sesiones !== null ? res.data.sesiones : this.state.sesiones;
                // this.state.reuniones = res.data.reuniones !== null ? res.data.reuniones : this.state.reuniones;
                // this.state.construccionesInicio = res.data.construccionesInicio !== null ? res.data.construccionesInicio : this.state.construccionesInicio;
                // this.state.construccionesConclusion = res.data.construccionesConclusion !== null ? res.data.construccionesConclusion : this.state.construccionesConclusion;
                // this.state.ordenaciones = res.data.ordenaciones !== null ? res.data.ordenaciones : this.state.ordenaciones;
                // this.state.dedicaciones = res.data.dedicaciones !== null ? res.data.dedicaciones : this.state.dedicaciones;
                // this.state.llamamientoDePersonal = res.data.llamamientoDePersonal !== null ? res.data.llamamientoDePersonal : this.state.llamamientoDePersonal;
                // this.state.regularizacionPatNac = res.data.regularizacionPatNac !== null ? res.data.regularizacionPatNac : this.state.regularizacionPatNac;
                // this.state.regularizacionPatIg = res.data.regularizacionPatIg !== null ? res.data.regularizacionPatIg : this.state.regularizacionPatIg;
                // this.state.movimientoEconomico = res.data.movimientoEconomico !== null ? res.data.movimientoEconomico : this.state.movimientoEconomico;
                // this.state.otrasActividades = res.data.otrasActividades !== null ? res.data.otrasActividades : this.state.otrasActividades;
                // this.state.actividadesObispo = res.data.actividadesObispo !== null ? res.data.actividadesObispo : this.state.actividadesObispo;
                // const actObispoMerge = res.data.actividadObispo.sectores.concat(res.data.actividadObispo.misiones);
                // console.log(actObispoMerge);
                this.setState({
                    // actividadesObispo: actObispoMerge !== null ? actObispoMerge : this.state.actividadesObispo
                    actividadesObispo: res.data.actividadObispo.sectores !== null ? res.data.actividadObispo.sectores.sort((a, b) => { return b.sector.sec_Tipo_Sector.localeCompare(a.sector.sec_Tipo_Sector) }) : this.state.actividadesObispo,
                    datosEstadisticos: res.data.movtosEstadisticos !== null ? res.data.movtosEstadisticos : this.state.datosEstadisticos

                })
                //OBISPO
                // this.state.actividadesObispo = res.data.actividadesObispo !== null ? res.data.actividadesObispo : this.state.actividadesObispo;
                //Fin OBISPO
                // this.obtenerMisiones();
                // this.obtenerDatosEstadisticos();
                this.obtenerMovimientosEstadisticos();
                // this.obtenerVisitantes();
            })
        );
    }

    // obtenerMisiones = async (id) => {
    //     await helpers.validaToken().then(helpers.authAxios.get("/Mision_Sector/" + localStorage.getItem('sector'))
    //         .then(res => {
    //             const cultosMisionCopia = [...this.state.misiones]
    //             this.state.misiones = res.data.misiones.map(m => {
    //                 const cultoMision = cultosMisionCopia.find(f => f.ms_Id_MisionSector === m.ms_Id)
    //                 return {
    //                     ...m,
    //                     ms_Id_MisionSector: m.ms_Id,
    //                     idInforme: cultoMision ? cultoMision.idInforme : 0,
    //                     cultos: cultoMision ? cultoMision.cultos : 0,
    //                 }
    //             }
    //             );
    //             console.log(this.state.misiones);
    //         })
    //     );
    // }

    // obtenerVisitantes = async () => {
    //     await helpers.validaToken().then(helpers.authAxios.get("/Visitante/VisitantesByDistrito/" + localStorage.getItem('dto'))
    //         .then(res => {
    //             const visitantes = res.data.visitantes;
    //             this.state.visitantesPermantes = visitantes.filter(f => f.visitante.vp_Tipo_Visitante === 'PERMANENTE')
    //             this.state.trabajoEvangelismo.visitantesPermanentes = this.state.visitantesPermantes.length
    //         })
    //     );
    // }

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
                    desgloseMoviemientoEstadistico: res.data.datos.length > 0  ? res.data.datos : this.state.desgloseMoviemientoEstadistico
                })
                console.log("res-data-datos: ", res.data.datos);
            })

        )
    }

    agregarActividad() {
        if (this.state.indiceActividad === null) {
            const nuevaActividad = {
                idOtraActividad: 0,
                idInforme: 0,
                descripcion: this.state.otraActividadTextArea,
                numDeOrden: this.state.otrasActividades.length === 0 ? 1 : this.state.otrasActividades[-1] + 1
            }
            this.state.otrasActividades.push(nuevaActividad);
            this.setState({
                otraActividadTextArea: ''
            });
        } else {
            const nuevoArray = [...this.state.otrasActividades]
            nuevoArray[this.state.indiceActividad] = { ...nuevoArray[this.state.indiceActividad], descripcion: this.state.otraActividadTextArea, numDeOrden: this.state.indiceActividad + 1 }
            this.setState({ otrasActividades: nuevoArray });
            this.setState({
                otraActividadTextArea: ''
            });
            this.setState({
                indiceActividad: null
            })
        }
    }

    editarActividad(index) {
        const actividad = this.state.otrasActividades[index];
        this.setState({
            indiceActividad: index
        })
        this.setState({
            otraActividadTextArea: actividad.descripcion
        });
    }

    eliminarActividad(index) {
        this.setState(prevState => ({
            otrasActividades: prevState.otrasActividades.filter((_, i) => i !== index)
        }));
    }

    handleOtraActividad(event) {
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
            otrasActividades: this.state.otrasActividades,
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
                                                INFORME QUE RINDE EL OBISPO DEL DISTRITO NO. <b>{this.state.distrito.dis_Numero}</b> CON ASIENTO EN: <b> {this.state.distrito.dis_Alias + ' '} </b>
                                                AL PRESIDENTE GENERAL DEL TRABAJO Y MOVIMIENTO REGISTRADO
                                                DURANTE EL MES DE <b>{this.state.informe.nombreMes}</b> DEL AÑO <b>{this.state.informe.anio}.</b>
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
                                                            <Col xs="8" sm="8" lg="8">
                                                                Sectores
                                                            </Col>
                                                            <Col xs="4" sm="4" lg="4">
                                                                <Input type='number' min={0} max={9999}
                                                                    id='aSectores'
                                                                    name={`actividadesObispo.${index}.visitasObispo.aSectores`}
                                                                    value={this.state.actividadesObispo[index].visitasObispo.aSectores}
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="aSectores"
                                                                >
                                                                    Aqui se ingresan la cantidad de visitas realizadas por el pastor en este mes.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="8" sm="8" lg="8">
                                                                Hogares
                                                            </Col>
                                                            <Col xs="4" sm="4" lg="4">
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
                                                                    Aqui se ingresan la cantidad de visitas realizadas por el pastor en este mes.
                                                                </UncontrolledTooltip>
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
                                                                    id='cultosOrdinarios'
                                                                    name={`actividadesObispo.${index}.cultosDistrito.ordinarios`}
                                                                    value={this.state.actividadesObispo[index].cultosDistrito.ordinarios}
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="cultosOrdinarios"
                                                                >
                                                                    Aqui se ingresan la cantidad de visitas realizadas por el pastor en este mes.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="8" sm="8" lg="8">
                                                                Especiales
                                                            </Col>
                                                            <Col xs="4" sm="4" lg="4">
                                                                <Input type='number' min={0} max={9999}
                                                                    id='cultosEspeciales'
                                                                    name={`actividadesObispo.${index}.cultosDistrito.especiales`}
                                                                    value={this.state.actividadesObispo[index].cultosDistrito.especiales}
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="cultosEspeciales"
                                                                >
                                                                    Aqui se ingresan la cantidad de visitas realizadas por el pastor en este mes.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="8" sm="8" lg="8">
                                                                De Avivamiento
                                                            </Col>
                                                            <Col xs="4" sm="4" lg="4">
                                                                <Input type='number' min={0} max={9999}
                                                                    id='cultosDeAvivamiento'
                                                                    name={`actividadesObispo.${index}.cultosDistrito.deAvivamiento`}
                                                                    value={this.state.actividadesObispo[index].cultosDistrito.deAvivamiento}
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="cultosDeAvivamiento"
                                                                >
                                                                    Aqui se ingresan la cantidad de visitas realizadas por el pastor en este mes.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="8" sm="8" lg="8">
                                                                Evangelismo
                                                            </Col>
                                                            <Col xs="4" sm="4" lg="4">
                                                                <Input type='number' min={0} max={9999}
                                                                    id='cultosEvangelismo'
                                                                    name={`actividadesObispo.${index}.cultosDistrito.evangelismo`}
                                                                    value={this.state.actividadesObispo[index].cultosDistrito.evangelismo}
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="cultosEvangelismo"
                                                                >
                                                                    Aqui se ingresan la cantidad de visitas realizadas por el pastor en este mes.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                    <Col xs="3" sm="3" lg="3">
                                                        <Row className='elemento'>
                                                            <Col xs="8" sm="8" lg="8">
                                                                Iglesia
                                                            </Col>
                                                            <Col xs="4" sm="4" lg="4">
                                                                <Input type='number' min={0} max={9999}
                                                                    id='confIglesia'
                                                                    name={`actividadesObispo.${index}.conferenciasDistrito.iglesia`}
                                                                    value={this.state.actividadesObispo[index].conferenciasDistrito.iglesia}
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="confIglesia"
                                                                >
                                                                    Aqui se ingresan la cantidad de visitas realizadas por el pastor en este mes.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="8" sm="8" lg="8">
                                                                Sector Varonil
                                                            </Col>
                                                            <Col xs="4" sm="4" lg="4">
                                                                <Input type='number' min={0} max={9999}
                                                                    id='confSecVaronil'
                                                                    name={`actividadesObispo.${index}.conferenciasDistrito.sectorVaronil`}
                                                                    value={this.state.actividadesObispo[index].conferenciasDistrito.sectorVaronil}
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="confSecVaronil"
                                                                >
                                                                    Aqui se ingresan la cantidad de visitas realizadas por el pastor en este mes.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="8" sm="8" lg="8">
                                                                Sociedad Femenil
                                                            </Col>
                                                            <Col xs="4" sm="4" lg="4">
                                                                <Input type='number' min={0} max={9999}
                                                                    id='confSocFemenil'
                                                                    name={`actividadesObispo.${index}.conferenciasDistrito.sociedadFemenil`}
                                                                    value={this.state.actividadesObispo[index].conferenciasDistrito.sociedadFemenil}
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="confSocFemenil"
                                                                >
                                                                    Aqui se ingresan la cantidad de visitas realizadas por el pastor en este mes.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="8" sm="8" lg="8">
                                                                Sociedad Juvenil
                                                            </Col>
                                                            <Col xs="4" sm="4" lg="4">
                                                                <Input type='number' min={0} max={9999}
                                                                    id='confSocJuvenil'
                                                                    name={`actividadesObispo.${index}.conferenciasDistrito.sociedadJuvenil`}
                                                                    value={this.state.actividadesObispo[index].conferenciasDistrito.sociedadJuvenil}
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="confSocJuvenil"
                                                                >
                                                                    Aqui se ingresan la cantidad de visitas realizadas por el pastor en este mes.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="8" sm="8" lg="8">
                                                                Infantil
                                                            </Col>
                                                            <Col xs="4" sm="4" lg="4">
                                                                <Input type='number' min={0} max={9999}
                                                                    id='confInfantil'
                                                                    name={`actividadesObispo.${index}.conferenciasDistrito.sectorInfantil`}
                                                                    value={this.state.actividadesObispo[index].conferenciasDistrito.sectorInfantil}
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="confInfantil"
                                                                >
                                                                    Aqui se ingresan la cantidad de visitas realizadas por el pastor en este mes.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                    <Col xs="3" sm="3" lg="3">
                                                        <Row className='elemento'>
                                                            <Col xs="8" sm="8" lg="8">
                                                                Iglesia
                                                            </Col>
                                                            <Col xs="4" sm="4" lg="4">
                                                                <Input type='number' min={0} max={9999}
                                                                    id='concIglesia'
                                                                    name={`actividadesObispo.${index}.concentracionesDistrito.iglesia`}
                                                                    value={this.state.actividadesObispo[index].concentracionesDistrito.iglesia}
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="concIglesia"
                                                                >
                                                                    Aqui se ingresan la cantidad de visitas realizadas por el pastor en este mes.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="8" sm="8" lg="8">
                                                                Sector Varonil
                                                            </Col>
                                                            <Col xs="4" sm="4" lg="4">
                                                                <Input type='number' min={0} max={9999}
                                                                    id='concSecVaronil'
                                                                    name={`actividadesObispo.${index}.concentracionesDistrito.sectorVaronil`}
                                                                    value={this.state.actividadesObispo[index].concentracionesDistrito.sectorVaronil}
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="concSecVaronil"
                                                                >
                                                                    Aqui se ingresan la cantidad de visitas realizadas por el pastor en este mes.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="8" sm="8" lg="8">
                                                                Sociedad Femenil
                                                            </Col>
                                                            <Col xs="4" sm="4" lg="4">
                                                                <Input type='number' min={0} max={9999}
                                                                    id='concSecFemenil'
                                                                    name={`actividadesObispo.${index}.concentracionesDistrito.sociedadFemenil`}
                                                                    value={this.state.actividadesObispo[index].concentracionesDistrito.sociedadFemenil}
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="concSecFemenil"
                                                                >
                                                                    Aqui se ingresan la cantidad de visitas realizadas por el pastor en este mes.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="8" sm="8" lg="8">
                                                                Sociedad Juvenil
                                                            </Col>
                                                            <Col xs="4" sm="4" lg="4">
                                                                <Input type='number' min={0} max={9999}
                                                                    id='concSocJuvenil'
                                                                    name={`actividadesObispo.${index}.concentracionesDistrito.sociedadJuvenil`}
                                                                    value={this.state.actividadesObispo[index].concentracionesDistrito.sociedadJuvenil}
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="concSocJuvenil"
                                                                >
                                                                    Aqui se ingresan la cantidad de visitas realizadas por el pastor en este mes.
                                                                </UncontrolledTooltip>
                                                            </Col>
                                                        </Row>
                                                        <Row className='elemento'>
                                                            <Col xs="8" sm="8" lg="8">
                                                                Sector Infantil
                                                            </Col>
                                                            <Col xs="4" sm="4" lg="4">
                                                                <Input type='number' min={0} max={9999}
                                                                    id='concInfantil'
                                                                    name={`actividadesObispo.${index}.concentracionesDistrito.sectorInfantil`}
                                                                    value={this.state.actividadesObispo[index].concentracionesDistrito.sectorInfantil}
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="concInfantil"
                                                                >
                                                                    Aqui se ingresan la cantidad de visitas realizadas por el pastor en este mes.
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
                                                <th className='table-header' rowSpan="2">Sectores</th>
                                                <th className='table-header' colSpan="2">Visitas hogares</th>
                                                <th className='table-header' colSpan="5">Cultos</th>
                                                <th className='table-header' colSpan="6">Estudios y conferencias</th>
                                                <th className='table-header' colSpan="2">Misiones</th>
                                                <th className='table-header' colSpan="7">Trabajo de Evangelismo</th>
                                            </tr>
                                            <tr>
                                                <th className='table-header sectores-header'>POR EL PASTOR</th>
                                                <th className='table-header sectores-header'>POR EL PERSONAL AUXILIAR</th>
                                                <th className='table-header sectores-header'>ORDINARIOS</th>
                                                <th className='table-header sectores-header'>ESPECIALES</th>
                                                <th className='table-header sectores-header'>DE AVIVIAMIENTO</th>
                                                <th className='table-header sectores-header'>DE ANIVERSARIO</th>
                                                <th className='table-header sectores-header'>POR EL DISTRITO</th>
                                                <th className='table-header sectores-header'>IGLESIA</th>
                                                <th className='table-header sectores-header'>ESCUELA DOMINICAL</th>
                                                <th className='table-header sectores-header'>VARONIL</th>
                                                <th className='table-header sectores-header'>FEMENIL</th>
                                                <th className='table-header sectores-header'>JUVENIL</th>
                                                <th className='table-header sectores-header'>INFANTIL</th>
                                                <th className='table-header sectores-header'>NUMERO DE MISIONES</th>
                                                <th className='table-header sectores-header'>CULTOS</th>
                                                <th className='table-header sectores-header'>HOGARES VISITADOS</th>
                                                <th className='table-header sectores-header'>HOGARES CONQUISTADOS</th>
                                                <th className='table-header sectores-header'>CULTOS POR LA LOCALIDAD</th>
                                                <th className='table-header sectores-header'>CULTOS DE HOGAR</th>
                                                <th className='table-header sectores-header'>CAMPÑAS</th>
                                                <th className='table-header sectores-header'>APERTURA DE MISIONES</th>
                                                <th className='table-header sectores-header'>BAUTISMOS</th>
                                            </tr>
                                            {this.state.actividadesObispo.length > 0 && this.state.actividadesObispo.map((obj, index) => (
                                                <tr>
                                                    <td className='table-cell'>{obj.sector.sec_Tipo_Sector} {obj.sector.sec_Numero} {obj.sector.sec_Alias}</td>
                                                    {this.cellNumber.map(() => (
                                                        <td className='table-cell'></td>
                                                    ))}
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
                                                    Número completo de personal que integra la iglesia
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
                                        </Col>
                                        <Col xs="11" sm="11" lg="11">
                                            <Input style={{ maxHeight: '20em', minHeight: '2em' }} className='m-2' type='textarea'
                                                name='otraActividadTextArea'
                                                value={this.state.otraActividadTextArea}
                                                onChange={(e) => this.handleOtraActividad(e)}></Input>
                                        </Col>
                                        <Col xs="1" sm="1" lg="1" className='text-center align-self-center'>
                                            <Button color='success' onClick={() => this.agregarActividad()}><span className='fa fa-icon fa-check'></span></Button>
                                        </Col>
                                        <Col xs="12" sm="12" lg="12">
                                            <ListGroup className='m-2'>
                                                {this.state.otrasActividades.length > 0 && this.state.otrasActividades.map((obj, index) => (
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
                                        {/* <Col xs="1" sm="1" lg="1" className='text-center align-self-center'>
                                            <Button color='info' onClick={() => this.agregarActividad()}><span className='fa fa-icon fa-edit'></span></Button>
                                        </Col>
                                        <Col xs="1" sm="1" lg="1" className='text-center align-self-center'>
                                            <Button color='danger' onClick={() => this.agregarActividad()}><span className='fa fa-icon fa-times'></span></Button>
                                        </Col> */}
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

export default InformeObispo;