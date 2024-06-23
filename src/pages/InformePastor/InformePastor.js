import React, { Component } from 'react';
import '../../assets/css/index.css'
import 'react-day-picker/lib/style.css';
import helpers from '../../components/Helpers'
import Modal from 'react-modal';
import {
    Container, Button, Card, CardBody, Row, Col,
    FormGroup, Input, ModalBody,
    Form, ListGroup, ListGroupItem, UncontrolledTooltip
} from 'reactstrap';
import moment from 'moment/min/moment-with-locales';
import 'moment/dist/locale/es'
import logo from '../../assets/images/IECE_LogoOficial.jpg'
import './style.css'

class InformePastor extends Component {
    infoSesion = JSON.parse(localStorage.getItem('infoSesion'));
    maxPaginas = 2;
    idInforme = localStorage.getItem("idInformePastoral")

    constructor(props) {
        super(props);
        this.state = {
            mensajeDelProceso: "Procesando...",
            modalShow: false,
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
            visitantesPermantes: [],
            desgloseMoviemientoEstadistico: [],
            indiceActividad: null,
            otraActividadTextArea: "",
            otrasActividades: [],
            actividadesEliminadas: [],
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
                personasBautizadasAlFinalDelMes: 0,
                personasNoBautizadas: 0,
                personasNoBautizadasAlFinalDelMes: 0,
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
        //const { id } = this.props.match.params;
        this.obtenerInforme(this.idInforme)
        this.getDistrito()
        this.getSector()
    }

    getDistrito = async () => {
        await helpers.validaToken().then(helpers.authAxios.get('/Distrito/' + localStorage.getItem('dto'))
            .then(res => {
                this.setState({
                    distrito: res.data
                })
                //console.log(res.data);
            })
        );
    }

    getSector = async () => {
        await helpers.validaToken().then(helpers.authAxios.get('/Sector/' + localStorage.getItem('sector'))
            .then(res => {
                this.setState({
                    sector: res.data.sector[0]
                })
                /* const { id } = this.props.match.params;
                this.obtenerInforme(id); */
                this.obtenerInforme(this.idInforme);
                //console.log(res.data);
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
                //console.log(res);
                this.setState({
                    datosEstadisticos: res.data
                })
            })
        );
    }

    obtenerInforme = async (id) => {
        await helpers.validaToken().then(helpers.authAxios.get("/Informe/" + id)
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
                this.state.otrasActividades = res.data.otrasActividades !== null ? res.data.otrasActividades : this.state.otrasActividades;
                this.obtenerMisiones();
                this.obtenerDatosEstadisticos();
                this.obtenerMovimientosEstadisticos();
                this.obtenerVisitantes();
                //console.log(res);
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
                //console.log(this.state.misiones);
            })
        );
    }

    obtenerVisitantes = async () => {
        await helpers.validaToken().then(helpers.authAxios.get("/Visitante/VisitantesBySector/" + localStorage.getItem('sector'))
            .then(res => {
                const visitantes = res.data.visitantes;
                this.state.visitantesPermantes = visitantes.filter(f => f.visitante.vp_Tipo_Visitante === 'PERMANENTE')
                this.state.trabajoEvangelismo.visitantesPermanentes = this.state.visitantesPermantes.length
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
                this.state.desgloseMoviemientoEstadistico = res.data.datos
                    .filter(f => f.ct_Codigo_Transaccion !== 11201 && //Actualizacion de bautizado
                        f.ct_Codigo_Transaccion !== 12201 &&// Actualizacion de no bautizado
                        f.ct_Codigo_Transaccion !== 31203); // Actualizacion de Hogar;
                //console.log("res-data-datos: ", res.data.datos);
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
        this.state.actividadesEliminadas.push(this.state.otrasActividades[index])
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
    }

    // Actualización del estado para Movimiento Economico
    handleMovimientoEconomicoChange = (e) => {
        const { name, value } = e.target;
        const nameParts = name.split('.'); // Dividir el name por el punto

        if (nameParts.length === 2 && nameParts[0] === 'movimientoEconomico') {
            const property = nameParts[1];

            this.setState((prevState) => {
                const updatedMovimientoEconomico = {
                    ...prevState.movimientoEconomico,
                    [property]: value
                };

                return { movimientoEconomico: updatedMovimientoEconomico };
            });
        }
    };

    handleMovimientoEconomicoBlur = (e) => {
        const { name, value } = e.target;
        const parsedValue = parseFloat(value.replace(/,/g, ''));
        const nameParts = name.split('.'); // Dividir el name por el punto

        if (nameParts.length === 2 && nameParts[0] === 'movimientoEconomico') {
            const property = nameParts[1];

            this.setState((prevState) => {
                const updatedMovimientoEconomico = {
                    ...prevState.movimientoEconomico,
                    [property]: isNaN(parsedValue) ? 0 : parsedValue
                };

                // Realizar operaciones matemáticas sin formatear
                if (property === 'gastosAdmon' || property === 'transferenciasAentidadSuperior' || property === 'existenciaAnterior' || property === 'entradaMes') {
                    updatedMovimientoEconomico.sumaTotal = (parseFloat(updatedMovimientoEconomico.existenciaAnterior) || 0) + (parseFloat(updatedMovimientoEconomico.entradaMes) || 0);
                    updatedMovimientoEconomico.existenciaEnCaja = (parseFloat(updatedMovimientoEconomico.sumaTotal) || 0) - (parseFloat(updatedMovimientoEconomico.gastosAdmon) || 0) - (parseFloat(updatedMovimientoEconomico.transferenciasAentidadSuperior) || 0);
                }

                // Formatear los resultados
                updatedMovimientoEconomico.sumaTotal = updatedMovimientoEconomico.sumaTotal.toLocaleString('mx-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                updatedMovimientoEconomico.existenciaEnCaja = updatedMovimientoEconomico.existenciaEnCaja.toLocaleString('mx-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

                return { movimientoEconomico: updatedMovimientoEconomico };
            });
        }
    };
    // Formateador para moneda mexicana
    // formatCurrency = (value) => {
    //     return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 }).format(value);
    // };

    actualizarInforme = async (e) => {
        e.preventDefault()

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
            otrasActividades: this.state.otrasActividades,
            actividadesEliminadas: this.state.actividadesEliminadas,
        }

        await helpers.validaToken().then(helpers.authAxios.put("/Informe/" + data.idInforme, data)
            .then(res => {
                if (res.status === 200) {
                    alert('Informe guardado con éxito.');
                    /* const { id } = this.props.match.params;
                    this.obtenerInforme(id); */
                    this.obtenerInforme(this.idInforme);
                }
                else {
                    alert(res.data.mensaje)
                    /* const { id } = this.props.match.params;
                    this.obtenerInforme(id); */
                    this.obtenerInforme(this.idInforme);
                }
            })
        )
    }

    descargarInforme = async (informeId) => {
        this.setState({
            mensajeDelProceso: "Procesando...",
            modalShow: true
        });
        await helpers.validaToken().then(helpers.authAxios.post("/DocumentosPDF/InformePastorPorSector/" + informeId, null, { responseType: 'blob' })
            .then(res => {
                // console.log(res);
                const url = window.URL.createObjectURL(res.data);

                const a = document.createElement('a');
                a.href = url;
                a.download = `InformePastorPorSector_${moment().format("yyyy-MM-DDThh-mm-ss")}.pdf`;
                a.target = '_blank';  // This does not really affect the download
                document.body.appendChild(a);
                a.click();

                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                this.setState({
                    modalShow: false
                });
            })
        )
    }


    render() {
        // const { id } = this.props.match.params;
        // 'suma Total: ', this.state.movimientoEconomico)
        // const { id } = localStorage.getItem("idInformePastoral");
        return (
            <Container>
                <Card>
                    <Form onSubmit={this.guardar}>
                        <CardBody>
                            {this.state.pagina === 1 ?
                                <FormGroup className='contenedor-informe'>
                                    {
                                        this.state.informe.idInforme > 0 ?
                                            <Row className='flex justify-content-end'>
                                                <Button
                                                    color="danger"
                                                    size="sm"
                                                    onClick={() => this.descargarInforme(this.state.informe.idInforme)}>
                                                    <span className="fas fa-file-pdf icon-btn-p"></span> Descargar PDF
                                                </Button>
                                            </Row>
                                            : ''
                                    }
                                    <Row className='flex justify-content-center'>
                                        <Col xs="8" sm="8" lg="8">
                                            <img src={logo} alt="Logo" className='logo-informe'></img>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="12" sm="12" lg="12">
                                            <p>
                                                INFORME QUE RINDE EL PASTOR DEL SECTOR NO. <b style={{ textDecoration: 'underline' }}>{this.state.sector.sec_Numero}</b> CON BASE EN: <b style={{ textDecoration: 'underline' }}> {this.state.sector.sec_Alias + ' '} </b>
                                                AL DISTRITO NUMERO <b style={{ textDecoration: 'underline' }}>{this.state.distrito.dis_Numero}</b > CON ASIENTO EN <b style={{ textDecoration: 'underline' }}>{this.state.distrito.dis_Alias}</b> DEL TRABAJO Y MOVIMIENTO REGISTRADO
                                                DURANTE EL MES DE <b style={{ textDecoration: 'underline' }}>{this.state.informe.nombreMes ? this.state.informe.nombreMes.toUpperCase() : ''}</b> DE <b style={{ textDecoration: 'underline' }}>{this.state.informe.anio}.</b>
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
                                                        <Col xs="6" sm="6" lg="6">
                                                            Por el Pastor
                                                        </Col>
                                                        <Col xs="6" sm="6" lg="6">
                                                            <Input type='number' min={0} max={9999}
                                                                id='porPastor'
                                                                name='visitasPastor.porPastor'
                                                                value={this.state.visitasPastor.porPastor}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="porPastor"
                                                            >
                                                                Visitas a hogares realizadas exclusivamente por el Pastor.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="6" sm="6" lg="6">
                                                            Por Ancianos Auxiliares
                                                        </Col>
                                                        <Col xs="6" sm="6" lg="6">
                                                            <Input type='number' min={0} max={9999}
                                                                id='porAncianosAux'
                                                                name='visitasPastor.porAncianosAux'
                                                                value={this.state.visitasPastor.porAncianosAux}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="porAncianosAux"
                                                            >
                                                                Visitas a hogares realizadas exclusivamente por Ancianos Auxiliares.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="6" sm="6" lg="6">
                                                            Por Diaconos
                                                        </Col>
                                                        <Col xs="6" sm="6" lg="6">
                                                            <Input type='number' min={0} max={9999}
                                                                id='porDiaconos'
                                                                name='visitasPastor.porDiaconos'
                                                                value={this.state.visitasPastor.porDiaconos}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="porDiaconos"
                                                            >
                                                                Visitas a hogares realizadas exclusivamente por Diáconos.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="6" sm="6" lg="6">
                                                            Por Auxiliares
                                                        </Col>
                                                        <Col xs="6" sm="6" lg="6">
                                                            <Input type='number' min={0} max={9999}
                                                                id='porAuxiliares'
                                                                name='visitasPastor.porAuxiliares'
                                                                value={this.state.visitasPastor.porAuxiliares}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="porAuxiliares"
                                                            >
                                                                Visitas a hogares realizadas exclusivamente por Auxiliares.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col xs="3" sm="3" lg="3">
                                                    <Row className='elemento'>
                                                        <Col xs="6" sm="6" lg="6">
                                                            Ordinarios
                                                        </Col>
                                                        <Col xs="6" sm="6" lg="6">
                                                            <Input type='number' min={0} max={9999}
                                                                id='ordinarios'
                                                                name='cultosSector.ordinarios'
                                                                value={this.state.cultosSector.ordinarios}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="ordinarios"
                                                            >
                                                                Cultos en la base del Sector y que no requieren llevar Programa de culto.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="6" sm="6" lg="6">
                                                            Especiales
                                                        </Col>
                                                        <Col xs="6" sm="6" lg="6">
                                                            <Input type='number' min={0} max={9999}
                                                                id='especiales'
                                                                name='cultosSector.especiales'
                                                                value={this.state.cultosSector.especiales}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="especiales"
                                                            >
                                                                Cultos en la base del Sector que se realizan bajo un Programa de culto.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="6" sm="6" lg="6">
                                                            De avivamiento
                                                        </Col>
                                                        <Col xs="6" sm="6" lg="6">
                                                            <Input type='number' min={0} max={9999}
                                                                id='deAvivamiento'
                                                                name='cultosSector.deAvivamiento'
                                                                value={this.state.cultosSector.deAvivamiento}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="deAvivamiento"
                                                            >
                                                                Cultos intencionados al cultivo del ánimo espiritual, fervor y devoción de la iglesia, tales como cultos de avivamiento espiritual y De derramamiento del Espíritu Santo.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="6" sm="6" lg="6">
                                                            De aniversario
                                                        </Col>
                                                        <Col xs="6" sm="6" lg="6">
                                                            <Input type='number' min={0} max={9999}
                                                                id='deAniversario'
                                                                name='cultosSector.deAniversario'
                                                                value={this.state.cultosSector.deAniversario}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="deAniversario"
                                                            >
                                                                Cultos realizados en el Sector para conmemorar un Aniversario dentro de la jurisdicción local.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="6" sm="6" lg="6">
                                                            Por el Distrito
                                                        </Col>
                                                        <Col xs="6" sm="6" lg="6">
                                                            <Input type='number' min={0} max={9999}
                                                                id='porElDistrito'
                                                                name='cultosSector.porElDistrito'
                                                                value={this.state.cultosSector.porElDistrito}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="porElDistrito"
                                                            >
                                                                Cultos realizados en el Sector, pero programados y llevados a cabo por el Distrito.
                                                            </UncontrolledTooltip>
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
                                                                id='estudioDominical'
                                                                name='estudiosSector.estudios.escuelaDominical'
                                                                value={this.state.estudiosSector.estudios.escuelaDominical}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="estudioDominical"
                                                            >
                                                                Cantidad de Estudios de la Guía Bíblica de Escuela Dominical.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='estudiosSector.conferencias.escuelaDominical'
                                                                id='confDominical'
                                                                readOnly
                                                                value={this.state.estudiosSector.conferencias.escuelaDominical}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="confDominical"
                                                            >
                                                                N/A
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Varonil
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='estudioVaronil'
                                                                name='estudiosSector.estudios.varonil'
                                                                value={this.state.estudiosSector.estudios.varonil}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="estudioVaronil"
                                                            >
                                                                Cantidad de Estudios de la Guía Bíblica impartidos al Sector Varonil.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='confVaronil'
                                                                name='estudiosSector.conferencias.varonil'
                                                                value={this.state.estudiosSector.conferencias.varonil}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="confVaronil"
                                                            >
                                                                Cantidad de Conferencias impartidas al Sector Varonil.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Femenil
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='estudioFemenil'
                                                                name='estudiosSector.estudios.femenil'
                                                                value={this.state.estudiosSector.estudios.femenil}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="estudioFemenil"
                                                            >
                                                                Cantidad de Estudios de la Guía Bíblica impartidos al Sector Femenil
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='confFemenil'
                                                                name='estudiosSector.conferencias.femenil'
                                                                value={this.state.estudiosSector.conferencias.femenil}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="confFemenil"
                                                            >
                                                                Cantidad de Conferencias impartidas al Sector Femenil.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Juvenil
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='estudioJuvenil'
                                                                name='estudiosSector.estudios.juvenil'
                                                                value={this.state.estudiosSector.estudios.juvenil}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="estudioJuvenil"
                                                            >
                                                                Cantidad de Estudios de la Guía Bíblica impartidos al Sector Juvenil.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='confJuvenil'
                                                                name='estudiosSector.conferencias.juvenil'
                                                                value={this.state.estudiosSector.conferencias.juvenil}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="confJuvenil"
                                                            >
                                                                Cantidad de Conferencias impartidas al Sector Juvenil.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Infantil
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='estudioInfantil'
                                                                name='estudiosSector.estudios.infantil'
                                                                value={this.state.estudiosSector.estudios.infantil}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="estudioInfantil"
                                                            >
                                                                Cantidad de Estudios de la Guía Bíblica impartidos al Sector Infantil.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='confInfantil'
                                                                name='estudiosSector.conferencias.infantil'
                                                                value={this.state.estudiosSector.conferencias.infantil}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="confInfantil"
                                                            >
                                                                Cantidad de Conferencias impartidas al Sector Infantil.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Iglesia
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='estudiosSector.estudios.iglesia'
                                                                id='estIglesia'
                                                                readOnly
                                                                value={this.state.estudiosSector.estudios.iglesia}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="estIglesia"
                                                            >
                                                                N/A
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='confIglesia'
                                                                name='estudiosSector.conferencias.iglesia'
                                                                value={this.state.estudiosSector.conferencias.iglesia}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="confIglesia"
                                                            >
                                                                Cantidad de Conferencias impartidas a la Congregación.
                                                            </UncontrolledTooltip>
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
                                                                    id='cultoMision'
                                                                    name={`misiones.${index}.cultos`}
                                                                    value={this.state.misiones[index].cultos}
                                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                                <UncontrolledTooltip
                                                                    placement="right"
                                                                    target="cultoMision"
                                                                >
                                                                    Cantidad de Cultos realizados en las misiones locales del Sector. Si no aparecen alguna misión del Sector, asegúrese de darla de Alta desde la función 'Misiones del Sector'.
                                                                </UncontrolledTooltip>
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
                                                                id='hogaresVisitados'
                                                                name='trabajoEvangelismo.hogaresVisitados'
                                                                value={this.state.trabajoEvangelismo.hogaresVisitados}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="hogaresVisitados"
                                                            >
                                                                Cantidad de visitas de evangelismo tanto a Visitantes Permanentes y Ocasionales como las realizadas en el trabajo de apertura de hogares (Casa por casa o por referencia).
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Hogares conquistados
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='hogaresConquistados'
                                                                name='trabajoEvangelismo.hogaresConquistados'
                                                                value={this.state.trabajoEvangelismo.hogaresConquistados}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="hogaresConquistados"
                                                            >
                                                                Hogares que se lograron abrir a la predicación del evangelio, producto del trabajo de evangelismo Casa por Casa o por Referencia.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Visitantes permanentes
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='visitantesPermanentes'
                                                                name='trabajoEvangelismo.visitantesPermanentes'
                                                                value={this.state.trabajoEvangelismo.visitantesPermanentes}
                                                                onChange={(e) => this.handleChange(e)} readOnly></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="visitantesPermanentes"
                                                            >
                                                                Cantidad de Visitantes que se considerán Permanentes en la asistencia a las actividades de la Iglesia. Este número se extrae automáticamente de la Lista de Visitantes Permanentes que se hayan registrado como tales en la función de 'Visitantes'.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Cultos por la localidad
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='cultosLocalidad'
                                                                name='trabajoEvangelismo.cultosPorLaLocalidad'
                                                                value={this.state.trabajoEvangelismo.cultosPorLaLocalidad}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="cultosLocalidad"
                                                            >
                                                                Cantidad de Cultos realizados en el Sector que hayan sido por programa de Evangelismo.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Cultos de Hogar
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='cultosHogar'
                                                                name='trabajoEvangelismo.cultosDeHogar'
                                                                value={this.state.trabajoEvangelismo.cultosDeHogar}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="cultosHogar"
                                                            >
                                                                Cantidad de Cultos de evangelismo realizados en los Hogares Cristianos, de Visitantes o Simpatizantes del evangelio.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Campañas
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='campanias'
                                                                name='trabajoEvangelismo.campanias'
                                                                value={this.state.trabajoEvangelismo.campanias}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="campanias"
                                                            >
                                                                Cantidad de campañas de evangelismo realizadas en el Sector, en el mes en curso.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Apertura de Misiones
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='aperturaMision'
                                                                name='trabajoEvangelismo.aperturaDeMisiones'
                                                                value={this.state.trabajoEvangelismo.aperturaDeMisiones}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="aperturaMision"
                                                            >
                                                                Cantidad de misiones que oficialmente se hayan abierto o establecido como misiones del Sector (habiendose levantado acta respectiva).
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Bautismos
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='bautismos'
                                                                name='trabajoEvangelismo.bautismos'
                                                                //value={this.state.trabajoEvangelismo.bautismos}
                                                                value={this.state.datosEstadisticos.altasBautizados.bautismo}
                                                                readOnly
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="bautismos"
                                                            >
                                                                Cantidad de Bautismos de personal que exclusivamente pertenece a este Sector y que se hayan realizado en el mes en curso. Este número se extrae automáticamente de las Altas por Bautismo que se hayan registrado en el Sistema de Movimientos Estadísticos de la Membresía.
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
                                                DATOS DEL ESTADO ACTUAL DE LA IGLESIA
                                            </Row>
                                            <Row className='titulo'>
                                                <Col xs="2" sm="2" lg="2"></Col>
                                                <Col xs="5" sm="5" lg="5">Número de personal en comunión al principio del mes:</Col>
                                                <Col xs="1" sm="1" lg="1" type='number'>
                                                    <u>{this.state.datosEstadisticos.personasBautizadas}</u>
                                                </Col>
                                                <Col xs="3" sm="3" lg="3"></Col>
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
                                                                value={this.state.datosEstadisticos.altasBautizados.cambiodedomexterno + this.state.datosEstadisticos.altasBautizados.cambiodedominterno}
                                                                readOnly></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8" style={{ fontWeight: 'bold' }}>
                                                            Total de altas
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='datosEstadisticos.altasBautizados.cambiodedomexterno'
                                                                value={this.state.datosEstadisticos.altasBautizados.bautismo + this.state.datosEstadisticos.altasBautizados.restitución + this.state.datosEstadisticos.altasBautizados.cambiodedomexterno + this.state.datosEstadisticos.altasBautizados.cambiodedominterno}
                                                                readOnly></Input>
                                                            <span className='font-weight-bold text-lg'>{ }</span>
                                                        </Col>
                                                    </Row>
                                                    <br />
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
                                                                value={this.state.datosEstadisticos.bajasBautizados.cambiodedomexterno + this.state.datosEstadisticos.bajasBautizados.cambiodedominterno}
                                                                readOnly></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8" style={{ fontWeight: 'bold' }}>
                                                            Total de bajas
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='datosEstadisticos.bajasBautizados.cambiodedomexterno'
                                                                value={this.state.datosEstadisticos.bajasBautizados.defuncion + this.state.datosEstadisticos.bajasBautizados.excomunion + this.state.datosEstadisticos.bajasBautizados.excomuniontemporal + this.state.datosEstadisticos.bajasBautizados.cambiodedomexterno + this.state.datosEstadisticos.bajasBautizados.cambiodedominterno}
                                                                readOnly></Input>
                                                        </Col>
                                                    </Row>
                                                    <br />
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
                                                                value={this.state.datosEstadisticos.hogaresAlFinalDelMes}
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
                                                        <Col xs="3" sm="3" lg="3">
                                                            Hombres
                                                        </Col>
                                                        <Col xs="3" sm="3" lg="3">
                                                            <Input type='number' min={0} max={9999}
                                                                name='datosEstadisticos.hombresBautizados'
                                                                value={this.state.datosEstadisticos.hombresBautizados}
                                                                readOnly></Input>
                                                        </Col>
                                                        <Col xs="3" sm="3" lg="3">
                                                            Hombres
                                                        </Col>
                                                        <Col xs="3" sm="3" lg="3">
                                                            <Input type='number' min={0} max={9999}
                                                                name='datosEstadisticos.jovenesHombresBautizados'
                                                                value={this.state.datosEstadisticos.jovenesHombresBautizados}
                                                                readOnly></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="3" sm="3" lg="3">
                                                            Mujeres
                                                        </Col>
                                                        <Col xs="3" sm="3" lg="3">
                                                            <Input type='number' min={0} max={9999}
                                                                name='datosEstadisticos.mujeresBautizadas'
                                                                value={this.state.datosEstadisticos.mujeresBautizadas}
                                                                readOnly></Input>
                                                        </Col>
                                                        <Col xs="3" sm="3" lg="3">
                                                            Mujeres
                                                        </Col>
                                                        <Col xs="3" sm="3" lg="3">
                                                            <Input type='number' min={0} max={9999}
                                                                name='datosEstadisticos.jovenesMujeresBautizadas'
                                                                value={this.state.datosEstadisticos.jovenesMujeresBautizadas}
                                                                readOnly></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="3" sm="3" lg="3">
                                                            Total
                                                        </Col>
                                                        <Col xs="3" sm="3" lg="3">
                                                            <Input type='number' min={0} max={9999}
                                                                value={this.state.datosEstadisticos.hombresBautizados + this.state.datosEstadisticos.mujeresBautizadas}
                                                                readOnly></Input>
                                                        </Col>
                                                        <Col xs="3" sm="3" lg="3">
                                                            Total
                                                        </Col>
                                                        <Col xs="3" sm="3" lg="3">
                                                            <Input type='number' min={0} max={9999}
                                                                value={this.state.datosEstadisticos.jovenesHombresBautizados + this.state.datosEstadisticos.jovenesMujeresBautizadas}
                                                                readOnly></Input>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col xs="6" sm="6" lg="6">
                                                    <Row className='elemento'>
                                                        <Col xs="3" sm="3" lg="3">
                                                            Hombres
                                                        </Col>
                                                        <Col xs="3" sm="3" lg="3">
                                                            <Input type='number' min={0} max={9999}
                                                                name='datosEstadisticos.jovenesHombresNoBautizados'
                                                                value={this.state.datosEstadisticos.jovenesHombresNoBautizados}
                                                                readOnly></Input>
                                                        </Col>
                                                        <Col xs="3" sm="3" lg="3">
                                                            Niños
                                                        </Col>
                                                        <Col xs="3" sm="3" lg="3">
                                                            <Input type='number' min={0} max={9999}
                                                                name='datosEstadisticos.ninos'
                                                                value={this.state.datosEstadisticos.ninos}
                                                                readOnly></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="3" sm="3" lg="3">
                                                            Mujeres
                                                        </Col>
                                                        <Col xs="3" sm="3" lg="3">
                                                            <Input type='number' min={0} max={9999}
                                                                name='datosEstadisticos.jovenesMujeresNoBautizadas'
                                                                value={this.state.datosEstadisticos.jovenesMujeresNoBautizadas}
                                                                readOnly></Input>
                                                        </Col>
                                                        <Col xs="3" sm="3" lg="3">
                                                            Niñas
                                                        </Col>
                                                        <Col xs="3" sm="3" lg="3">
                                                            <Input type='number' min={0} max={9999}
                                                                name='datosEstadisticos.ninas'
                                                                value={this.state.datosEstadisticos.ninas}
                                                                readOnly></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="3" sm="3" lg="3">
                                                            Total
                                                        </Col>
                                                        <Col xs="3" sm="3" lg="3">
                                                            <Input type='number' min={0} max={9999}
                                                                value={this.state.datosEstadisticos.jovenesHombresNoBautizados + this.state.datosEstadisticos.jovenesMujeresNoBautizadas}
                                                                readOnly></Input>
                                                        </Col>
                                                        <Col xs="3" sm="3" lg="3">
                                                            Total
                                                        </Col>
                                                        <Col xs="3" sm="3" lg="3">
                                                            <Input type='number' min={0} max={9999}
                                                                value={this.state.datosEstadisticos.ninos + this.state.datosEstadisticos.ninas}
                                                                readOnly></Input>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row className='elemento'>
                                                <Col xs="5" sm="5" lg="5" style={{ fontWeight: 'bold' }}>
                                                    No. completo de personal bautizado
                                                </Col>
                                                <Col xs="1" sm="1" lg="1">
                                                    {/* <Input type='number' min={0} max={9999}
                                                        name='datosEstadisticos.personasBautizadas'
                                                        value={this.state.datosEstadisticos.personasBautizadas}
                                                        onChange={(e) => this.handleChange(e)}></Input> */}
                                                    <u><span className='font-weight-bold text-lg'>{this.state.datosEstadisticos.personasBautizadasAlFinalDelMes}</span></u>
                                                </Col>
                                                <Col xs="5" sm="5" lg="5" style={{ fontWeight: 'bold' }}>
                                                    No. completo de personal no bautizado
                                                </Col>
                                                <Col xs="1" sm="1" lg="1">
                                                    {/* <Input type='number' min={0} max={9999}
                                                        name='datosEstadisticos.personasNoBautizadas'
                                                        value={this.state.datosEstadisticos.personasNoBautizadas}
                                                        onChange={(e) => this.handleChange(e)}></Input> */}
                                                    <u><span className='font-weight-bold text-lg'>{this.state.datosEstadisticos.personasNoBautizadasAlFinalDelMes}</span></u>
                                                </Col>
                                            </Row>
                                            <Row className='elemento'>
                                                <Col xs="5" sm="5" lg="5" style={{ fontWeight: 'bold' }}>
                                                    Número completo de personal que integra la iglesia
                                                </Col>
                                                <Col xs="2" sm="2" lg="2">
                                                    <u><span className='font-weight-bold text-lg'>{this.state.datosEstadisticos.personasBautizadasAlFinalDelMes + this.state.datosEstadisticos.personasNoBautizadasAlFinalDelMes}</span></u>
                                                </Col>
                                            </Row>
                                            <br />

                                            <Row className='elemento'>
                                                <Col xs="12" sm="12" lg="12">
                                                    <b>DESGLOSE DE MOVIMIENTO ESTADÍSTICO</b>
                                                </Col>
                                                <Col xs="12" sm="12" lg="12">
                                                    <ListGroup>
                                                        {this.state.desgloseMoviemientoEstadistico.length > 0 ? this.state.desgloseMoviemientoEstadistico.map((obj, index) => (
                                                            <ListGroupItem key={obj.hte_Id_Transaccion}>{index + 1}.- <b>{obj.ct_Tipo}</b> por <b>{obj.ct_Subtipo}</b> corresponde a <b>{obj.per_Nombre} {obj.per_Apellido_Paterno} {obj.per_Apellido_Materno}</b></ListGroupItem>
                                                        )) : <u>No hay Movimientos Estadísticos que desglosar.</u>}
                                                    </ListGroup>
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
                                :
                                <FormGroup className='contenedor-informe'>
                                    {
                                        this.state.informe.idInforme > 0 ?
                                            <Row className='flex justify-content-end'>
                                                <Button
                                                    color="danger"
                                                    size="sm"
                                                    onClick={() => this.descargarInforme(this.state.informe.idInforme)}>
                                                    <span className="fas fa-file-pdf icon-btn-p"></span> Descargar PDF
                                                </Button>
                                            </Row>
                                            : ''
                                    }
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
                                                                id='orgFemenil'
                                                                name='organizaciones.sociedadFemenil'
                                                                value={this.state.organizaciones.sociedadFemenil}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="orgFemenil"
                                                            >
                                                                Registro de la organización de una Sociedad Femenil del Sector.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Sociedad juvenil
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='orgJuvenil'
                                                                name='organizaciones.sociedadJuvenil'
                                                                value={this.state.organizaciones.sociedadJuvenil}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="orgJuvenil"
                                                            >
                                                                Registro de la organización de una Sociedad Juvenil del Sector.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Departamento femenil
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='depFemenil'
                                                                name='organizaciones.departamentoFemenil'
                                                                value={this.state.organizaciones.departamentoFemenil}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="depFemenil"
                                                            >
                                                                Registro de la organización de un Departamento Femenil del Sector.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Departamento juvenil
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='depJuvenil'
                                                                name='organizaciones.departamentoJuvenil'
                                                                value={this.state.organizaciones.departamentoJuvenil}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="depJuvenil"
                                                            >
                                                                Registro de la organización de un Departamento Juvenil del Sector.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Departamento infantil
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='depInfantil'
                                                                name='organizaciones.departamentoInfantil'
                                                                value={this.state.organizaciones.departamentoInfantil}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="depInfantil"
                                                            >
                                                                Registro de la organización de un Departament Infantil del Sector.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Coros
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='coros'
                                                                name='organizaciones.coros'
                                                                value={this.state.organizaciones.coros}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="coros"
                                                            >
                                                                Cantidad de organizaciones de Coros del Sector.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Grupos de canto
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='gruposCanto'
                                                                name='organizaciones.gruposDeCanto'
                                                                value={this.state.organizaciones.gruposDeCanto}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="gruposCanto"
                                                            >
                                                                Cantidad de organizaciones de Grupos de Canto del Sector.
                                                            </UncontrolledTooltip>
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
                                                                id='predios'
                                                                name='adquisicionesSector.predios'
                                                                value={this.state.adquisicionesSector.predios}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="predios"
                                                            >
                                                                Adquisición de un nuevo predio para uso dentro de la Jurisdiccion del Sector.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Casas
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='casas'
                                                                name='adquisicionesSector.casas'
                                                                value={this.state.adquisicionesSector.casas}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="casas"
                                                            >
                                                                Aduisición de Casas para uso dentro de la Jurisdiccion del Sector.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Edificios
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='edificios'
                                                                name='adquisicionesSector.edificios'
                                                                value={this.state.adquisicionesSector.edificios}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="edificios"
                                                            >
                                                                Adquisición de Edificios para uso dentro de la jurisdicción del Sector.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Templos
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='templos'
                                                                name='adquisicionesSector.templos'
                                                                value={this.state.adquisicionesSector.templos}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="templos"
                                                            >
                                                                Adquisición de Templos para uso dentro de la jurisdicción del Sector.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Vehículos
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='vehiculos'
                                                                name='adquisicionesSector.vehiculos'
                                                                value={this.state.adquisicionesSector.vehiculos}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="vehiculos"
                                                            >
                                                                Adquisición de Vehículos para uso dentro de la jurisdicción del Sector.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row className='subtitulos'>
                                                <Col xs="6" sm="6" lg="6">
                                                    2.- SESIONES Y REUNIONES
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
                                                                id='sesionDistrito'
                                                                name='sesiones.enElDistrito'
                                                                value={this.state.sesiones.enElDistrito}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="sesionDistrito"
                                                            >
                                                                Cantidad de Sesiones (Que requieren levantar Acta respectiva) llevadas a cabo por programación del Distrito.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='reunionDistrito'
                                                                name='reuniones.enElDistrito'
                                                                value={this.state.reuniones.enElDistrito}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="reunionDistrito"
                                                            >
                                                                Cantidad de Reuniones (Que no requieren Acta, sino sólo minuta) llevadas a cabo en actividad del Distrito.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Con el personal docente
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='sesionPersonalDocente'
                                                                name='sesiones.conElPersonalDocente'
                                                                readOnly
                                                                value={this.state.sesiones.conElPersonalDocente}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="sesionPersonalDocente"
                                                            >
                                                                N/A
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='reunionPersonalDocente'
                                                                name='reuniones.conElPersonalDocente'
                                                                value={this.state.reuniones.conElPersonalDocente}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="reunionPersonalDocente"
                                                            >
                                                                Cantidad de Reuniones (Que no requieren Acta, sino sólo minuta) llevadas a cabo por el Pastor con el Personal Docente.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Con Sociedad o Depto. femenil
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='sesionFem'
                                                                name='sesiones.conSociedadesFemeniles'
                                                                value={this.state.sesiones.conSociedadesFemeniles}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="sesionFem"
                                                            >
                                                                Cantidad de Sesiones de Pastor con Soc. O Dpto. Femenil (Que requieren levantar Acta respectiva).
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='reunionFeme'
                                                                name='reuniones.conSociedadesFemeniles'
                                                                value={this.state.reuniones.conSociedadesFemeniles}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="reunionFeme"
                                                            >
                                                                Cantidad de Reuniones (Que no requieren Acta, sino sólo minuta) llevadas a cabo por el Pastor con la Soc. O Dpto. Femenil.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Con Sociedad o Depto. Juvenil
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='sesionJuv'
                                                                name='sesiones.conSociedadesJuveniles'
                                                                value={this.state.sesiones.conSociedadesJuveniles}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="sesionJuv"
                                                            >
                                                                Cantidad de Sesiones de Pastor con Soc. O Dpto. Juvenil (Que requieren levantar Acta respectiva).
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='reunionJuv'
                                                                name='reuniones.conSociedadesJuveniles'
                                                                value={this.state.reuniones.conSociedadesJuveniles}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="reunionJuv"
                                                            >
                                                                Cantidad de Reuniones (Que no requieren Acta, sino sólo minuta) llevadas a cabo por el Pastor con la Soc. O Dpto. Juvenil.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Con Depto. infantil
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='sesionInf'
                                                                name='sesiones.conDepartamentosInfantiles'
                                                                value={this.state.sesiones.conDepartamentosInfantiles}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="sesionInf"
                                                            >
                                                                Cantidad de Sesiones de Pastor con el  Dpto. Juvenil (Que requieren levantar Acta respectiva).
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='reunionInf'
                                                                name='reuniones.conDepartamentosInfantiles'
                                                                value={this.state.reuniones.conDepartamentosInfantiles}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="reunionInf"
                                                            >
                                                                Cantidad de Reuniones (Que no requieren Acta, sino sólo minuta) llevadas a cabo por el Pastor con el  Dpto. Infantil.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Con Coros y Grupos de canto
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='sesionCoros'
                                                                name='sesiones.conCorosYGruposDeCanto'
                                                                value={this.state.sesiones.conCorosYGruposDeCanto}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="sesionCoros"
                                                            >
                                                                Cantidad de Sesiones de Pastor con el  Coros o Grupos de Canto (Que requieren levantar Acta respectiva).
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='reunionCoros'
                                                                name='reuniones.conCorosYGruposDeCanto'
                                                                value={this.state.reuniones.conCorosYGruposDeCanto}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="reunionCoros"
                                                            >
                                                                Cantidad de Reuniones (Que no requieren Acta, sino sólo minuta) llevadas a cabo por el Pastor con Coros o Grupos de Canto.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col xs="6" sm="6" lg="6">
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4"></Col>
                                                        <Col xs="4" sm="4" lg="4" className='subtitulos'>
                                                            INICIO
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4" className='subtitulos'>
                                                            CONCLUSIÓN
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Colocación de 1a. Piedra
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='inicioColPiedra'
                                                                name='construccionesInicio.colocacionPrimeraPiedra'
                                                                value={this.state.construccionesInicio.colocacionPrimeraPiedra}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="inicioColPiedra"
                                                            >
                                                                Cantidad de actos de colocación de Primera Piedra realizados en la jurisdicción del Sector, en el mes en curso.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                name='construccionesConclusion.colocacionPrimeraPiedra'
                                                                id='conclusionColPrimeraPiedra'
                                                                readOnly
                                                                value={this.state.construccionesConclusion.colocacionPrimeraPiedra}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="conclusionColPrimeraPiedra"
                                                            >
                                                                N/A
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Templo
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='inicioTemplo'
                                                                name='construccionesInicio.templo'
                                                                value={this.state.construccionesInicio.templo}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="inicioTemplo"
                                                            >
                                                                Cantidad de templos del Sector cuya construcción se inicia en el mes en curso.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='finTemplo'
                                                                name='construccionesConclusion.templo'
                                                                value={this.state.construccionesConclusion.templo}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="finTemplo"
                                                            >
                                                                Cantidad de templos cuya construcción haya concluido en el mes en curso.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Casa de Oración
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='inicioCasaOracion'
                                                                name='construccionesInicio.casaDeOracion'
                                                                value={this.state.construccionesInicio.casaDeOracion}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="inicioCasaOracion"
                                                            >
                                                                Cantidad de Casas de oración del Sector  cuya construcción se inicia en el mes en curso.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='finCasaOracion'
                                                                name='construccionesConclusion.casaDeOracion'
                                                                value={this.state.construccionesConclusion.casaDeOracion}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="finCasaOracion"
                                                            >
                                                                Cantidad de Casa de oración cuya construccion se haya haya concluido en el mes en curso..
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Casa pastoral
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='inicioCasaPastoral'
                                                                name='construccionesInicio.casaPastoral'
                                                                value={this.state.construccionesInicio.casaPastoral}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="inicioCasaPastoral"
                                                            >
                                                                Cantidad de Casas Pastorales cuya construcción se inicia en el mes en curso..
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='finCasaPastoral'
                                                                name='construccionesConclusion.casaPastoral'
                                                                value={this.state.construccionesConclusion.casaPastoral}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="finCasaPastoral"
                                                            >
                                                                Cantidad de Casas Pastorales cuya construcción se haya haya concluido en el mes en curso.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Anexos
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='inicioAnexos'
                                                                name='construccionesInicio.anexos'
                                                                value={this.state.construccionesInicio.anexos}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="inicioAnexos"
                                                            >
                                                                Cantidad de construcción de Anexos en las instalaciones del Templo del Sector, cuya construcción se inicia en el mes en curso.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='finAnexos'
                                                                name='construccionesConclusion.anexos'
                                                                value={this.state.construccionesConclusion.anexos}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="finAnexos"
                                                            >
                                                                Cantidad de Anexos cuya construcción se haya haya concluido en el mes en curso.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Remodelación
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='inicioRemodelacion'
                                                                name='construccionesInicio.remodelacion'
                                                                value={this.state.construccionesInicio.remodelacion}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="inicioRemodelacion"
                                                            >
                                                                Cantidad de Remodelaciones  a las instalaciones del Templo o casa Pastoral  del Sector, cuya construcción se inicia en el mes en curso.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='finRemodelacion'
                                                                name='construccionesConclusion.remodelacion'
                                                                value={this.state.construccionesConclusion.remodelacion}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="finRemodelacion"
                                                            >
                                                                Cantidad de Remodelaciones cuya construcción se haya haya concluido en el mes en curso.
                                                            </UncontrolledTooltip>
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
                                                                id='ordenacionAnciano'
                                                                name='ordenaciones.ancianos'
                                                                value={this.state.ordenaciones.ancianos}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="ordenacionAnciano"
                                                            >
                                                                Cantidad de Ordenaciones ministeriales para grado de Ancianos exclusivamente de personal que pertenezca al Sector.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Diáconos
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='ordenacionDiacono'
                                                                name='ordenaciones.diaconos'
                                                                value={this.state.ordenaciones.diaconos}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="ordenacionDiacono"
                                                            >
                                                                Cantidad de Ordenaciones ministeriales para grado de Diácono exclusivamente de personal que pertenezca al Sector.
                                                            </UncontrolledTooltip>
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
                                                                id='dedicacionTemplo'
                                                                name='dedicaciones.templos'
                                                                value={this.state.dedicaciones.templos}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="dedicacionTemplo"
                                                            >
                                                                Cantidad de dedicaciones de Templos en la jurisdicción del Sector.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Casas de Oración
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='dedicacionCasaOracion'
                                                                name='dedicaciones.casasDeOracion'
                                                                value={this.state.dedicaciones.casasDeOracion}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="dedicacionCasaOracion"
                                                            >
                                                                Cantidad de dedicaciones de Casas de Oración en la jurisdiccion del Sector.
                                                            </UncontrolledTooltip>
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
                                                                id='diaconosPrueba'
                                                                name='llamamientoDePersonal.diaconosAprueba'
                                                                value={this.state.llamamientoDePersonal.diaconosAprueba}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="diaconosPrueba"
                                                            >
                                                                Cantidad de presentaciones oficiales de Diáconos a prueba exclusivamente de personal que pertenezca al Sector.
                                                            </UncontrolledTooltip>

                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Auxiliares
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='auxiliares'
                                                                name='llamamientoDePersonal.auxiliares'
                                                                value={this.state.llamamientoDePersonal.auxiliares}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="auxiliares"
                                                            >
                                                                Cantidad de llamamientos de Nuevos Auxiliares exclusivamente de personal que pertenezca al Sector.
                                                            </UncontrolledTooltip>

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
                                                                id='nacTemplos'
                                                                name='regularizacionPatNac.templos'
                                                                value={this.state.regularizacionPatNac.templos}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="nacTemplos"
                                                            >
                                                                Cantidad de regularizaciones de Predios de Templos dentro de la jurisdicción del Sector considerados Propiedad de la Nación que hayan concluido en el mes en curso.
                                                            </UncontrolledTooltip>

                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='igTemplos'
                                                                name='regularizacionPatIg.templos'
                                                                value={this.state.regularizacionPatIg.templos}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="igTemplos"
                                                            >
                                                                Cantidad de regularizaciones de Predios de Templos dentro de la jurisdicción del Sector considerados Propiedad de la Iglesia que hayan concluido en el mes en curso.
                                                            </UncontrolledTooltip>

                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Casas pastorales
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='nacCasaPastoral'
                                                                name='regularizacionPatNac.casasPastorales'
                                                                value={this.state.regularizacionPatNac.casasPastorales}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="nacCasaPastoral"
                                                            >
                                                                Cantidad de regularizaciones de Predios de Casas Pastorales dentro de la jurisdicción del Sector considerados Propiedad de la Nación, que hayan concluido en el mes en curso.
                                                            </UncontrolledTooltip>

                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}
                                                                id='igCasaPastoral'
                                                                name='regularizacionPatIg.casasPastorales'
                                                                value={this.state.regularizacionPatIg.casasPastorales}
                                                                onChange={(e) => this.handleChange(e)}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="igCasaPastoral"
                                                            >
                                                                Cantidad de regularizaciones de Predios de Casas Pastorales dentro de la jurisdicción del Sector considerados Propiedad de la Iglesia que hayan concluido en el mes en curso.
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
                                                MOVIMIENTO ECONÓMICO
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
                                                            <Input type='text' min={0} max={9999}
                                                                id='exAnterior'
                                                                name='movimientoEconomico.existenciaAnterior'
                                                                value={this.state.movimientoEconomico.existenciaAnterior ? this.state.movimientoEconomico.existenciaAnterior.toLocaleString('mx', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}
                                                                onChange={this.handleMovimientoEconomicoChange}
                                                                onBlur={this.handleMovimientoEconomicoBlur}
                                                            ></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="exAnterior"
                                                            >
                                                                Cantidad con la que cerró la tesorería local en el mes anterior.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Entradas en el mes
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='text' min={0} max={9999}
                                                                id='entradas'
                                                                name='movimientoEconomico.entradaMes'
                                                                value={this.state.movimientoEconomico.entradaMes ? this.state.movimientoEconomico.entradaMes.toLocaleString('mx', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}
                                                                onChange={this.handleMovimientoEconomicoChange}
                                                                onBlur={this.handleMovimientoEconomicoBlur}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="entradas"
                                                            >
                                                                Cantidad del Total de entradas a la tesorería local en el mes en curso.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Suma total
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='text' min={0} max={9999}
                                                                id='sumaTotal'
                                                                name='movimientoEconomico.sumaTotal'
                                                                value={this.state.movimientoEconomico.sumaTotal ? this.state.movimientoEconomico.sumaTotal.toLocaleString('mx', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}
                                                                disabled
                                                                onChange={this.handleMovimientoEconomicoChange}
                                                                onBlur={this.handleMovimientoEconomicoBlur}></Input>
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
                                                            <Input type='text' min={0} max={9999}
                                                                id='gastosAdmon'
                                                                name='movimientoEconomico.gastosAdmon'
                                                                value={this.state.movimientoEconomico.gastosAdmon ? this.state.movimientoEconomico.gastosAdmon.toLocaleString('mx', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}
                                                                onChange={this.handleMovimientoEconomicoChange}
                                                                onBlur={this.handleMovimientoEconomicoBlur}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="gastosAdmon"
                                                            >
                                                                Total de Gastos de la Administración del Sector del mes en curso.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Transferencias al Dto.
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='text' min={0} max={9999}
                                                                id='tranDto'
                                                                name='movimientoEconomico.transferenciasAentidadSuperior'
                                                                value={this.state.movimientoEconomico.transferenciasAentidadSuperior ? this.state.movimientoEconomico.transferenciasAentidadSuperior.toLocaleString('mx', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}
                                                                onChange={this.handleMovimientoEconomicoChange}
                                                                onBlur={this.handleMovimientoEconomicoBlur}></Input>
                                                            <UncontrolledTooltip
                                                                placement="right"
                                                                target="tranDto"
                                                            >
                                                                Total de Transferencias de la Tesorería del Sector a la Tesorería del Distrito.
                                                            </UncontrolledTooltip>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Existencia en caja
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='text' min={0} max={9999}
                                                                id='existenciaFinal'
                                                                name='movimientoEconomico.existenciaEnCaja'
                                                                value={this.state.movimientoEconomico.existenciaEnCaja ? this.state.movimientoEconomico.existenciaEnCaja.toLocaleString('mx', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}
                                                                disabled
                                                                onChange={this.handleMovimientoEconomicoChange}
                                                                onBlur={this.handleMovimientoEconomicoBlur}></Input>
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
                                                OTRAS ACTIVIDADES
                                            </Row>
                                        </Col>
                                        <Col xs="11" sm="11" lg="11">
                                            <Input style={{ maxHeight: '20em', minHeight: '2em' }} className='m-2' type='textarea'
                                                id='otrasActividades'
                                                name='otraActividadTextArea'
                                                value={this.state.otraActividadTextArea}
                                                onChange={(e) => this.handleOtraActividad(e)}></Input>
                                            <UncontrolledTooltip
                                                placement="left"
                                                target="otrasActividades"
                                            >
                                                Desglose de actividades realizadas por el Pastor o efectuadas dentro de la jurisdicción local y que no pudieron se reflejados en alguna sección o concepto predefinido del presente informe mensual pastoral. Tambien puede agregarse comentarios complementarios de aquellos conceptos que en los rubros predefinidos en este informe requieran aumentar explicación para dar claridad del trabajo logrado en el mes. Toda actividad ralizada fuera de la jurisdicción local no es necesario anotarla en este concepto.
                                            </UncontrolledTooltip>
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
                <Modal isOpen={this.state.modalShow}>
                    <ModalBody>
                        {this.state.mensajeDelProceso}
                    </ModalBody>
                </Modal>
            </Container>
        );
    }
}

export default InformePastor;