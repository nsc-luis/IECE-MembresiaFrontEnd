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
import nvologo from '../../assets/images/nvoLogo.png'

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
        }
    }

    componentDidMount() {
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
                    // console.log(res.data.sector);
                });
            await helpers.authAxios.get(this.url + "/Sector/GetPastorBySector/" + this.state.sectorSeleccionado)
                .then(res => {
                    this.setState({ infoMinistro: res.data.ministros[0] });
                })
            }
            else {
                this.setState({
                    infoSector: {
                        ...this.state.infoSector,
                        sec_Alias: "TODOS LOS SECTORES DEL DISTRITO"
                    },
                    infoMinistro: {
                        ...this.state.infoMinistro,
                        pem_Nombre: "OBISPO DEL DISTRITO"
                    }
                });
            }
            const doc = new jsPDF("p", "mm", "letter");
            doc.addImage(nvologo, 'PNG', 5, 0, 80, 30);
            doc.text("RESUMEN DE MEMBRESIA GENERAL", 85, 10);
            doc.setFontSize(8);
            doc.text(`${this.infoSesion.dis_Tipo_Distrito}: ${this.infoSesion.dis_Alias}`, 85, 15);
            doc.text(`SECTOR: ${this.state.infoSector.sec_Alias}`, 85, 20);
            doc.line(10, 32, 200, 32);

            doc.setFillColor(137, 213, 203) // Codigos de color RGB (red, green, blue)
            doc.rect(10, 35, 190, 4, "F");
            doc.setFont("", "", "bold");
            doc.text("MEMBRESIA BAUTIZADA", 15, 38);
            doc.text("ADULTO HOMBRE: ", 20, 44);
            doc.text("ADULTO MUJER: ", 20, 49);
            doc.text("JÓVEN HOMBRE: ", 20, 54);
            doc.text("JÓVEN MUJER: ", 20, 59);
            doc.text(`${this.state.resumenDeMembresia.totalBautizados}`, 80, 38);
            doc.text(`${this.state.resumenDeMembresia.hb}`, 70, 44);
            doc.text(`${this.state.resumenDeMembresia.mb}`, 70, 49);
            doc.text(`${this.state.resumenDeMembresia.jhb}`, 70, 54);
            doc.text(`${this.state.resumenDeMembresia.jmb}`, 70, 59);

            doc.setFillColor(137, 213, 203) // Codigos de color RGB (red, green, blue)
            doc.rect(10, 65, 190, 4, "F");
            doc.setFont("", "", "bold");
            doc.text("MEMBRESIA NO BAUTIZADA", 15, 68);
            doc.text("JÓVEN HOMBRE: ", 20, 74);
            doc.text("JÓVEN MUJER: ", 20, 79);
            doc.text("NIÑOS: ", 20, 84);
            doc.text("NIÑAS: ", 20, 89);
            doc.text(`${this.state.resumenDeMembresia.totalNoBautizados}`, 80, 68);
            doc.text(`${this.state.resumenDeMembresia.jhnb}`, 70, 74);
            doc.text(`${this.state.resumenDeMembresia.jmnb}`, 70, 79);
            doc.text(`${this.state.resumenDeMembresia.ninos}`, 70, 84);
            doc.text(`${this.state.resumenDeMembresia.ninas}`, 70, 89);
            doc.text("MEMBRESÍA GENERAL: ", 32, 95);
            doc.rect(70, 92, 15, 4);
            doc.text(`${this.state.resumenDeMembresia.totalDeMiembros}`, 80, 95);
            doc.line(30, 140, 90, 140);
            doc.text("PASTOR", 54, 143);
            doc.text(`${this.state.infoMinistro.pem_Nombre}`, 38, 138);
            doc.line(120, 140, 180, 140);
            doc.text("SECRETARIO", 142, 143);
            doc.save("ResumenEnPDF.pdf");
        }
    }

    render() {
        return (
            <Layout>
                <Container>
                    {/* <h1 className="text-info">Resumen de Membresía</h1> */}
                    <FormGroup>
                        <Row>
                            <Col xs="3">
                                <Input
                                    type="select"
                                    name="idDistrito"
                                >
                                    <option value="1">{this.infoSesion.dis_Tipo_Distrito}: {this.infoSesion.dis_Alias}</option>
                                </Input>
                            </Col>
                            <Col xs="3">
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
                                                <option value={sector.sec_Id_Sector}>{sector.sec_Tipo_Sector}: {sector.sec_Alias}</option>
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
                            <Col xs="3">
                                <Button
                                    onClick={this.resumenMembresiaPDF}
                                    color="danger"
                                >
                                    <span className="fas fa-file-pdf fa-sm fas-icon-margin"></span>PDF
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
            </Layout >
        )
    }
}

export default ResumenMembresia;