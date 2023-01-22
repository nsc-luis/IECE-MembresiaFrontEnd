import React, { Component } from 'react';
import helpers from '../../components/Helpers';
import axios from 'axios';
import {
    Form, FormGroup, Input, Button, Row, Col, Label,
    Container, FormFeedback, Card, CardBody, CardTitle, CardHeader, CardFooter
} from 'reactstrap'
import { Link } from 'react-router-dom';
import Layout from '../Layout';
import './style.css';
import { jsPDF } from "jspdf";
import nvologo from '../../assets/images/IECE_LogoOficial.jpg';
import moment from 'moment';

class ResumenMembresia extends Component {

    url = helpers.url_api;
    infoSesion = JSON.parse(localStorage.getItem('infoSesion'));
    resumen = {
        totalDeMiembros: 0,
        hb: 0,
        mb: 0,
        jhb: 0,
        jmb: 0,
        totalBautizados: 0,
        jhnb: 0,
        jmnb: 0,
        ninos: 0,
        ninas: 0,
        totalNoBautizados: 0
    }

    constructor(props) {
        super(props);
        this.state = {
            sectores: [],
            sectorSeleccionado: "0",
            resumenDeMembresia: {},
            infoSector: {},
            infoMinistro: {},
            infoSecretario: {},
            distrito: {},
            gradoMinistro: ""
        }
    }

    componentDidMount() {
        this.getSectoresPorDistrito();
        this.getDistrito();

    }

    getDistrito = async () => {
        await helpers.authAxios.get(this.url + '/Distrito/' + localStorage.getItem('dto'))
            .then(res => {
                this.setState({
                    distrito: res.data
                })
            });
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

    handle_sectorSeleccionado = async (e) => {
        if (e.target.value === "todos") {
            this.setState({ sectorSeleccionado: e.target.value });
            await helpers.authAxios.get(this.url + '/Persona/GetResumenMembresiaByDistrito/' + localStorage.getItem('dto'))
                .then(res => {
                    // console.log(res.data.value);
                    this.setState({ resumenDeMembresia: res.data.resumen })
                });
            // alert("ALERTA! Aqui podemos hacer 2 cosas:\n- Generar un ciclo que sume los sectores.\n- Agregar dis_Id_Distrito a la tabla de Personal (creo que esta es mejor opcion).");
        }
        else {
            this.setState({ sectorSeleccionado: e.target.value });
            await helpers.authAxios.get(this.url + '/Persona/GetResumenMembresiaBySector/' + e.target.value)
                .then(res => {
                    // console.log(res.data.value);
                    this.setState({ resumenDeMembresia: res.data.resumen.value })
                });
        }
    }

    resumenMembresiaPDF = async () => {

        if (this.state.sectorSeleccionado === '0') {
            alert('Error: Debes seleccionar un sector.');
        }
        else {
            if (this.state.sectorSeleccionado !== "todos") {
                await helpers.authAxios.get(this.url + "/Sector/" + this.state.sectorSeleccionado)
                    .then(res => {
                        this.setState({ infoSector: res.data.sector[0] })
                    });
                await helpers.authAxios.get(this.url + "/Sector/GetPastorBySector/" + this.state.sectorSeleccionado)
                    .then(res => {
                        this.setState({
                            infoMinistro: res.data.ministros.length > 0 ? res.data.ministros[0].pem_Nombre : "",
                            gradoMinistro: "PASTOR"
                        });
                    })
                await helpers.authAxios.get(this.url + "/PersonalMinisterial/GetSecretarioBySector/" + this.state.sectorSeleccionado)
                    .then(res => {
                        this.setState({
                            infoSecretario: res.data.infoSecretario.length > 0 ? res.data.infoSecretario[0].pem_Nombre : ""
                        });
                    })
            }
            else {
                await helpers.authAxios.get(this.url + "/PersonalMinisterial/GetObispoByDistrito/" + localStorage.getItem("dto"))
                    .then(res => {
                        this.setState({
                            infoMinistro: res.data.ministros.length > 0 ? res.data.ministros[0].pem_Nombre : "",
                            gradoMinistro: "OBISPO"
                        });
                    })
                await helpers.authAxios.get(this.url + "/PersonalMinisterial/GetSecretarioByDistrito/" + localStorage.getItem("dto"))
                    .then(res => {
                        this.setState({ 
                            infoSecretario: res.data.infoSecretario.length > 0 ? res.data.infoSecretario[0].pem_Nombre : ""
                        });
                    })
                this.setState({
                    infoSector: {
                        ...this.state.infoSector,
                        sec_Alias: "TODOS LOS SECTORES DEL DISTRITO"
                    }/* ,
                    infoMinistro: {
                        ...this.state.infoMinistro,
                        pem_Nombre: "OBISPO DEL DISTRITO"
                    } */
                });
            }
            const doc = new jsPDF("p", "mm", "letter");

            let fechaActual = moment();
            let mesActual = fechaActual.format("MM");
            let fechaTexto = `AL DÍA ${fechaActual.format('DD')} DE ${helpers.meses[mesActual]} DEL ${fechaActual.format('YYYY')}`;
            let line = 7;

            doc.addImage(nvologo, 'JPG', 10, line, 70, 20);
            doc.text("RESUMEN DE MEMBRESIA GENERAL", 136, 11, {align:'center'});
            doc.setFontSize(10);

            //Si en LocalStorage tiene Numero de Sector, significa que es Sesión Sector
            if (localStorage.getItem('sector') !== null) {
                doc.text(`${this.state.infoSector.sec_Alias}`, 136, 18,{align:'center'});
                /* doc.text(fechaTexto, 85, 25); */
            }
            else {
                doc.text(`${this.state.distrito.dis_Tipo_Distrito}  ${this.state.distrito.dis_Numero}: ${this.state.distrito.dis_Alias}`, 136, 18,{align:'center'});
                doc.text(`${this.state.infoSector.sec_Alias}`, 136, 24,{align:'center'});
                /* doc.text(fechaTexto, 85, 20); */
            }

            line=line+25;
            doc.setFontSize(9);
            doc.line(10, line, 200, line);

            line=line+7;
            doc.setFillColor(191, 201, 202) // Codigos de color RGB (red, green, blue)
            doc.rect(10, line-4, 190, 6, "F");

            doc.setFont("", "", "bold");
            doc.text("MEMBRESIA BAUTIZADA", 15, line);
            doc.text(`${this.state.resumenDeMembresia.totalBautizados}`, 80, line);

            line=line+10;
            doc.setFont("", "", "normal");
            doc.text("ADULTO HOMBRE: ", 20, line);
            doc.text(`${this.state.resumenDeMembresia.hb}`, 70, line);

            line=line+6;
            doc.text("ADULTO MUJER: ", 20, line);
            doc.text(`${this.state.resumenDeMembresia.mb}`, 70, line);

            line=line+6;
            doc.text("JÓVEN HOMBRE: ", 20, line);
            doc.text(`${this.state.resumenDeMembresia.jhb}`, 70, line);

            line=line+6;
            doc.text("JÓVEN MUJER: ", 20, line);
            doc.text(`${this.state.resumenDeMembresia.jmb}`, 70, line);

            line=line+10;
            doc.setFillColor(191, 201, 202) // Codigos de color RGB (red, green, blue)
            doc.rect(10, line-4, 190, 6, "F");
            doc.setFont("", "", "bold");
            doc.text("MEMBRESIA NO BAUTIZADA", 15, line);
            doc.text(`${this.state.resumenDeMembresia.totalNoBautizados}`, 80, line);


            line=line+10;
            doc.setFont("", "", "normal");
            doc.text("JÓVEN HOMBRE: ", 20, line);
            doc.text(`${this.state.resumenDeMembresia.jhnb}`, 70, line);

            line=line+6;
            doc.text("JÓVEN MUJER: ", 20, line);
            doc.text(`${this.state.resumenDeMembresia.jmnb}`, 70, line);

            line=line+6;
            doc.text("NIÑOS: ", 20, line);
            doc.text(`${this.state.resumenDeMembresia.ninos}`, 70, line);

            line=line+6;
            doc.text("NIÑAS: ", 20, line);
            doc.text(`${this.state.resumenDeMembresia.ninas}`, 70, line);

            line=line+5;
            doc.line(10, line, 200, line);

            line=line+8;
            doc.setFont("", "", "bold");
            doc.setFontSize(10);
            doc.text("MEMBRESÍA GENERAL: ", 142, line);
            //doc.rect(175, line-4, 16, 6);
            doc.text(`${this.state.resumenDeMembresia.totalDeMiembros}`, 190, line);
            doc.line(185, line+1, 200, line+1);

            doc.setFont("", "", "normal");
            doc.setFontSize(9);
            line=line+30;
            doc.text(`JUSTICIA Y VERDAD`, 105, line,{align:'center'});
            line=line+5;
            doc.text(fechaTexto, 105, line,{align:'center'});

            line=line+25;
            doc.text(`${this.state.infoSecretario}`, 38, line);
            doc.text(`${this.state.infoMinistro}`, 130, line);

            line=line+1;
            doc.line(30, line, 90, line);

            doc.line(120, line, 180, line);

            line=line+4;
            doc.text("SECRETARIO", 51, line);
            doc.text(this.state.gradoMinistro, 145, line);

            doc.save("ResumenEnPDF.pdf");
        }
    }

    render() {
        return (
            <>                <Container>
                    {/* <h1 className="text-info">Resumen de Membresía</h1> */}
                    <FormGroup>
                        <Row>
                            <Col xs="10">
                                <Input
                                    type="select"
                                    name="idDistrito"
                                >
                                    <option value="1">{`${this.state.distrito.dis_Tipo_Distrito} ${this.state.distrito.dis_Numero}: ${this.state.distrito.dis_Alias}`}</option>
                                </Input>
                            </Col>
                        </Row>
                    </FormGroup>
                    <FormGroup>
                        <Row>
                            <Col xs="10">
                                <Input
                                    type="select"
                                    name="sectorSeleccionado"
                                    value={this.state.sec_Id_Sector}
                                    onChange={this.handle_sectorSeleccionado}
                                >
                                    <option value="0">Selecciona un sector</option>
                                    
                                    {this.state.sectores.map(sector => {
                                        return (
                                            <React.Fragment key={sector.sec_Id_Sector}>
                                                <option value={sector.sec_Id_Sector}> {sector.sec_Tipo_Sector} {sector.sec_Numero}: {sector.sec_Alias}</option>
                                            </React.Fragment>
                                        )
                                    })}
                                    {localStorage.getItem('sector') === null &&
                                        <React.Fragment>
                                            <option value="todos">TODOS LOS SECTORES</option>
                                        </React.Fragment>
                                    }
                                </Input>
                            </Col>
                        </Row>
                    </FormGroup>
                    <FormGroup>
                        <Row>
                            <Col xs="3">
                                <Button
                                    onClick={this.resumenMembresiaPDF}
                                    color="danger"
                                >
                                    <span className="fas fa-file-pdf fa-sm fas-icon-margin"></span>Crear PDF
                                </Button>
                            </Col>
                        </Row>
                    </FormGroup>
                    <FormGroup>
                        <Row>
                            <Col xs="5">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="negrita centrado totalesTitulos">
                                            Personal Bautizado
                                        </CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        <ul>
                                            <li><span className="liWidth">Adultos Hombres: </span>{this.state.resumenDeMembresia.hb}</li>
                                            <li><span className="liWidth">Adultos Mujeres: </span>{this.state.resumenDeMembresia.mb}</li>
                                            <li><span className="liWidth">Jóvenes Hombres: </span>{this.state.resumenDeMembresia.jhb}</li>
                                            <li><span className="liWidth">Jóvenes Mujeres: </span>{this.state.resumenDeMembresia.jmb}</li>
                                        </ul>
                                    </CardBody>
                                    <CardFooter className="negrita">
                                        <span className='totalWidth'>Total de Personal Bautizado: </span> {this.state.resumenDeMembresia.totalBautizados}
                                    </CardFooter>
                                </Card>
                            </Col>
                            <Col xs="5">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="negrita centrado totalesTitulos">
                                            Personal No Bautizado
                                        </CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        <ul>
                                            <li><span className="liWidth">Jóvenes Hombres: </span>{this.state.resumenDeMembresia.jhnb}</li>
                                            <li><span className="liWidth">Jóvenes Mujeres: </span>{this.state.resumenDeMembresia.jmnb}</li>
                                            <li><span className="liWidth">Niños: </span>{this.state.resumenDeMembresia.ninos}</li>
                                            <li><span className="liWidth">Niñas: </span>{this.state.resumenDeMembresia.ninas}</li>
                                        </ul>
                                    </CardBody>
                                    <CardFooter className="negrita">
                                        <span className='totalWidth'>Total de Personal No Bautizado: </span> {this.state.resumenDeMembresia.totalNoBautizados}
                                    </CardFooter>
                                </Card>
                            </Col>
                        </Row>
                    </FormGroup>
                    <FormGroup>
                        <Row>
                            <Col xs="12" className='negrita totalesTitulos'>
                                Número completo de personal que integra la Iglesia: {this.state.resumenDeMembresia.totalDeMiembros}
                            </Col>
                        </Row>
                    </FormGroup>
                </Container>
            </>
        )
    }
}

export default ResumenMembresia;