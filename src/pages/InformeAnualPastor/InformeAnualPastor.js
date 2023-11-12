import React, { Component } from 'react';
import helpers from '../../components/Helpers';
import {
    Button, Input, Alert, Container, Row, Col, Card, FormFeedback,
    Form, FormGroup, CardBody, CardFooter
} from 'reactstrap';
// import { Link } from 'react-router-dom';
// import HogarPersonaDomicilio from './HogarPersonaDomicilio';
import './style.css'

import rutaLogo from '../../assets/images/IECE_LogoOficial.jpg'

class InformeAnualPastor extends Component {
    infoSesion = JSON.parse(localStorage.getItem('infoSesion'));
    constructor(props) {
        super(props);
    }
    state = {
        visitasPastor: {
            idInforme: 0,
            porPastor: 0,
            porAncianoAux: 0,
            porDiaconos: 0,
            porAuxiliares: 0,
            idUsuario: 0,
            fechaCreacion: null,
        }
    }
    render() {
        return (
            <Container>
                <Card>
                    <Form onSubmit={this.guardar}>
                        <CardBody>
                            <FormGroup className='contenedor-informe'>
                                <Row>
                                    <Col xs="12" sm="12" lg="12">
                                        <img src= {rutaLogo} className='logo-informe'></img>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs="12" sm="12" lg="12">
                                       <p>
                                        INFORME QUE RINDE EL PASTOR DEL SECTOR NO.______ CON BASE EN: ________________
                                        AL DISTRITO NUMERO ________ CON ASIENTO EN _____________ DEL TRABAJO Y MOVIMIENTO REGISTRADO
                                        DUERANTE EL MES DE ________ DE ______________.
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
                                                <Row className='elemento'>
                                                    <Col xs="8" sm="8" lg="8">
                                                        Visitantes permanentes
                                                    </Col>
                                                    <Col xs="4" sm="4" lg="4">
                                                        <Input type='number' min={0} max={9999}></Input>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                        
                                    </Col>
                                </Row>
                            </FormGroup>
                        </CardBody>
                    </Form>
                </Card>
            </Container>
        );
    }
}

export default InformeAnualPastor;