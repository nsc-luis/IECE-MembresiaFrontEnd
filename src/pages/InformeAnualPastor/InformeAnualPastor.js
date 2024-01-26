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

class InformeAnualPastor extends Component {
    infoSesion = JSON.parse(localStorage.getItem('infoSesion'));
    maxPaginas = 2;
    constructor(props) {
        super(props);
        this.state = {
            informe: {
                idInforme: 0,
                idTipoUsuario: 0, //1 Pastor 2 Obispo
                mes: null,
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
                sec_Numero: 0,
                sec_Alias: ''
            },
            distrito: {
                dis_Numero: 0,
                dis_Alias: ''
            },
            visitasPastor: {
                porPastor: 0,
                porAncianoAux: 0,
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
                //PENDIENTE REVISAR EL DICCIONARIO DE DATOS
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
                campanas: 0,
                aperturaDeMisiones: 0,
                bautismos: 0,
                visitantesPermanentes: 0,
            },
            datosEstadisticos: {
                altasBautizados:{
                    altaHogar: 0,
                    bautismo: 0,
                    cambiodedomexterno: 0,
                    cambiodedominterno: 0,
                    restitución: 0
                },
                altasNoBautizados:{
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
            },
            pagina: 1
        }
    }

    togglePage(page){
        if(page <= this.maxPaginas && page > 0){
            this.setState({pagina: page})
        }
    }

    componentDidMount(){
        const { id } = this.props.match.params;
        this.obtenerDatosEstadisticos();
        this.getDistrito();
        this.getSector();
        this.obtenerInforme(id);
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
                console.log(res.data);
            })
        );
    }

    obtenerDatosEstadisticos = async () => {
        const body = {
            sec_Id_Sector: 227,
            year: 2023,
            mes: 1
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
                console.log(res);
            })
        );
    }

    handleChange(event) {
        event.persist();
        console.log(event);
        const { name, value } = event.target;

        // Divide el nombre para obtener un array de claves
        const keys = name.split('.');
        
        // Crea una copia profunda del estado actual
        const newState = { ...this.state };
      
        // Utiliza las claves para acceder al objeto específico que deseas actualizar
        let currentObject = newState;
        for (let i = 0; i < keys.length - 1; i++) {
          currentObject = currentObject[keys[i]];
        }
      
        // Actualiza la propiedad específica
        currentObject[keys[keys.length - 1]] = value;
      
        // Actualiza el estado con la nueva copia
        this.setState(newState);
        console.log(newState);
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
                                            <img src= {rutaLogo} className='logo-informe'></img>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="12" sm="12" lg="12">
                                        <p>
                                            INFORME QUE RINDE EL PASTOR DEL SECTOR NO. <b>{this.state.sector.sec_Numero}</b> CON BASE EN: <b> {this.state.sector.sec_Alias + ' '} </b>
                                            AL DISTRITO NUMERO <b>{this.state.distrito.dis_Numero}</b> CON ASIENTO EN <b>{this.state.distrito.dis_Alias}</b> DEL TRABAJO Y MOVIMIENTO REGISTRADO
                                            DURANTE EL MES DE {this.state.informe.mes} DE {this.state.informe.anio}.
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
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Por Ancianos Auxiliares
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Por Diaconos
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Por Auxiliares
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col xs="3" sm="3" lg="3">
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Ordinarios
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Especiales
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            De avivamiento
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            De aniversario
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Por el Distrito
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col xs="6" sm="6" lg="6">
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Escuela dominical
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Varonil
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Femenil
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Juvenil
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Infantil
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Iglesia
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            
                                        </Col>
                                        <Col xs="12" sm="12" lg="12">
                                            <Row className='subtitulos'>
                                                <Col xs="6" sm="6" lg="6">
                                                    Cultos en las misiones
                                                </Col>
                                                <Col xs="6" sm="6" lg="6">
                                                    TRABAJO DE EVANGELISMO
                                                </Col>
                                            </Row>
                                            <Row className='lista-elementos'>
                                                <Col xs="6" sm="6" lg="6">
                                                    <Row className='elemento'>
                                                        <Col xs="2" sm="2" lg="2">
                                                            Mision 1
                                                        </Col>
                                                        <Col xs="6" sm="6" lg="6">
                                                            <Input type='text' min={0} max={9999}></Input>
                                                        </Col>
                                                        <Col xs="2" sm="2" lg="2">
                                                            Cultos
                                                        </Col>
                                                        <Col xs="2" sm="2" lg="2">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="2" sm="2" lg="2">
                                                            Mision 2
                                                        </Col>
                                                        <Col xs="6" sm="6" lg="6">
                                                            <Input type='text' min={0} max={9999}></Input>
                                                        </Col>
                                                        <Col xs="2" sm="2" lg="2">
                                                            Cultos
                                                        </Col>
                                                        <Col xs="2" sm="2" lg="2">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="2" sm="2" lg="2">
                                                            Mision 3
                                                        </Col>
                                                        <Col xs="6" sm="6" lg="6">
                                                            <Input type='text' min={0} max={9999}></Input>
                                                        </Col>
                                                        <Col xs="2" sm="2" lg="2">
                                                            Cultos
                                                        </Col>
                                                        <Col xs="2" sm="2" lg="2">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="2" sm="2" lg="2">
                                                            Mision 4
                                                        </Col>
                                                        <Col xs="6" sm="6" lg="6">
                                                            <Input type='text' min={0} max={9999}></Input>
                                                        </Col>
                                                        <Col xs="2" sm="2" lg="2">
                                                            Cultos
                                                        </Col>
                                                        <Col xs="2" sm="2" lg="2">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="2" sm="2" lg="2">
                                                            Mision 5
                                                        </Col>
                                                        <Col xs="6" sm="6" lg="6">
                                                            <Input type='text' min={0} max={9999}></Input>
                                                        </Col>
                                                        <Col xs="2" sm="2" lg="2">
                                                            Cultos
                                                        </Col>
                                                        <Col xs="2" sm="2" lg="2">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="2" sm="2" lg="2">
                                                            Mision 6
                                                        </Col>
                                                        <Col xs="6" sm="6" lg="6">
                                                            <Input type='text' min={0} max={9999}></Input>
                                                        </Col>
                                                        <Col xs="2" sm="2" lg="2">
                                                            Cultos
                                                        </Col>
                                                        <Col xs="2" sm="2" lg="2">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="2" sm="2" lg="2">
                                                            Mision 7
                                                        </Col>
                                                        <Col xs="6" sm="6" lg="6">
                                                            <Input type='text' min={0} max={9999}></Input>
                                                        </Col>
                                                        <Col xs="2" sm="2" lg="2">
                                                            Cultos
                                                        </Col>
                                                        <Col xs="2" sm="2" lg="2">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="2" sm="2" lg="2">
                                                            Mision 8
                                                        </Col>
                                                        <Col xs="6" sm="6" lg="6">
                                                            <Input type='text' min={0} max={9999}></Input>
                                                        </Col>
                                                        <Col xs="2" sm="2" lg="2">
                                                            Cultos
                                                        </Col>
                                                        <Col xs="2" sm="2" lg="2">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="2" sm="2" lg="2">
                                                            Mision 9
                                                        </Col>
                                                        <Col xs="6" sm="6" lg="6">
                                                            <Input type='text' min={0} max={9999}></Input>
                                                        </Col>
                                                        <Col xs="2" sm="2" lg="2">
                                                            Cultos
                                                        </Col>
                                                        <Col xs="2" sm="2" lg="2">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col xs="6" sm="6" lg="6">
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Hogares visitados
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Hogares conquistados
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Visitantes permanentes
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Cultos por la localidad
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Cultos de Hogar
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Campañas
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Apertura de Misiones
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Bautismos
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
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
                                                Número de personal en comunión al principio del mes {'##'}
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
                                                            onChange={(e) => this.handleChange(e)}></Input>
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
                                                            onChange={(e) => this.handleChange(e)}></Input>
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
                                                            onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Total de altas
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Matrimonios
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Presentación de niños
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
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
                                                            onChange={(e) => this.handleChange(e)}></Input>
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
                                                            onChange={(e) => this.handleChange(e)}></Input>
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
                                                            onChange={(e) => this.handleChange(e)}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Total de bajas
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Legalizaciones
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
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
                                                            onChange={(e) => this.handleChange(e)}></Input>
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
                                                    <Input type='number' min={0} max={9999}
                                                    name='datosEstadisticos.personasBautizadas'
                                                    value={this.state.datosEstadisticos.personasBautizadas}
                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                </Col>
                                                <Col xs="4" sm="4" lg="4">
                                                    No. completo de personal no bautizado
                                                </Col>
                                                <Col xs="2" sm="2" lg="2">
                                                    <Input type='number' min={0} max={9999}
                                                    name='datosEstadisticos.personasNoBautizadas'
                                                    value={this.state.datosEstadisticos.personasNoBautizadas}
                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                </Col>
                                            </Row>
                                            <Row className='elemento'>
                                                <Col xs="8" sm="8" lg="8">
                                                    Número completo de personal que integra la iglesia
                                                </Col>
                                                <Col xs="4" sm="4" lg="4">
                                                    <Input type='number' min={0} max={9999}></Input>
                                                </Col>
                                            </Row>
                                            <Row className='elemento'>
                                                <Col xs="12" sm="12" lg="12">
                                                    <b>Desglose de movimiento estadístico</b>
                                                </Col>
                                                <Col xs="12" sm="12" lg="12">
                                                    <ListGroup>
                                                        <ListGroupItem>Movimiento 1</ListGroupItem>
                                                        <ListGroupItem>Movimiento 2</ListGroupItem>
                                                        <ListGroupItem>Movimiento 3</ListGroupItem>
                                                        <ListGroupItem>Movimiento 4</ListGroupItem>
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
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Sociedad juvenil
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Departamento femenil
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Departamento juvenil
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Departamento infantil
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Coros
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Grupos de canto
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col xs="6" sm="6" lg="6">
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Predios
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Casas
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Edificios
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Templos
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Vehículos
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
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
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Con el personal docente
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Con Sociedades o Dept. femenil
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Con Sociedades o Depto. Juvenil
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Con Depto. infantil
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Con Coros y Grupos de canto
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
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
                                                            <Input type='number'></Input>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number'></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Templo
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number'></Input>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number'></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Casa de Oración
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number'></Input>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number'></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Casa pastoral
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number'></Input>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number'></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Anexos
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number'></Input>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number'></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Remodelación
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number'></Input>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number'></Input>
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
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Diáconos
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col xs="6" sm="6" lg="6">
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Templos
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number'></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Casas de Oración
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number'></Input>
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
                                                            <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Auxiliares
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999}></Input>
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
                                                           <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                           <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="4" sm="4" lg="4">
                                                            Casas pastorales
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                           <Input type='number' min={0} max={9999}></Input>
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                           <Input type='number' min={0} max={9999}></Input>
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
                                                            <Input type='number' min={0} max={9999999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Entradas en el mes
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Suma total
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999999}></Input>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col xs="6" sm="6" lg="6">
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Gastos de la admon.
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Transferencias al Dto.
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999999}></Input>
                                                        </Col>
                                                    </Row>
                                                    <Row className='elemento'>
                                                        <Col xs="8" sm="8" lg="8">
                                                            Existencia en caja
                                                        </Col>
                                                        <Col xs="4" sm="4" lg="4">
                                                            <Input type='number' min={0} max={9999999}></Input>
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
                                                    <Input type='text'></Input>
                                                </Col>
                                                <Col xs="2" sm="2" lg="2">
                                                    Fecha de reunión:
                                                </Col>
                                                <Col xs="4" sm="4" lg="4">
                                                    <Input type='date'></Input>
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