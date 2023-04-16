import React, { Component } from 'react';
import helpers from '../../../components/Helpers';
import {
    Container, Row, Col, Card, CardHeader,
    CardBody, CardFooter, Form, Input, Label,
    Button, FormFeedback, Table,
    Modal, ModalFooter, ModalBody, ModalHeader, FormGroup
} from 'reactstrap';
import axios from 'axios';
import logo from '../../../assets/images/IECE_LogoOficial.jpg'
import './style.css';
import moment from 'moment/min/moment-with-locales';
import 'moment/dist/locale/es'
import TableToExcel from "@linways/table-to-excel";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'

moment.locale('es')

const dto = JSON.parse(localStorage.getItem("dto"))
const sector = JSON.parse(localStorage.getItem("sector"))

class RptListaDeHogares extends Component {

    url = helpers.url_api;
    infoSesion = JSON.parse(localStorage.getItem('infoSesion'));

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            infoDistrito: {},
            infoSector: [],
            infoListaHogares: [],
            listaArreglada: [],
            infoSecretario: {},
            distrito: {},
            sectores: [],
            sectorSeleccionado: localStorage.getItem('sector') ? localStorage.getItem('sector') : "todos",
            lider: ""
        }
    }

    componentDidMount() {
        this.getPersonas(); //Trae todas las personas del Sector o Distrito
        this.getInfoDistrito(); //Trae los datos del Dto.
        this.getInfoSector(); //Trae los datos del Sector
        this.getListaHogares(); //Trae la lista de Hogares del Dto o Sector segun el tipo de Sesión.
        this.getDistrito();//Trae los datos del Distrito
        this.getSectoresPorDistrito();//Trae los Sectores del Distrito
        window.scrollTo(0, 0);
    }

    getDistrito = async () => {
        await helpers.authAxios.get(this.url + '/Distrito/' + localStorage.getItem('dto'))
            .then(res => {
                this.setState({
                    distrito: res.data
                })
            });
    }

    getInfoDistrito = async () => {
        await helpers.authAxios.get(this.url + "/Distrito/" + localStorage.getItem('dto'))
            .then(res => {
                this.setState({ infoDistrito: res.data });
            })
    }

    getSectoresPorDistrito = async () => {
        if (localStorage.getItem('sector') === null) {
            await helpers.authAxios.get(this.url + '/Sector/GetSectoresByDistrito/' + localStorage.getItem('dto'))
                .then(res => {
                    this.setState({
                        sectores: res.data.sectores
                    })
                });
            this.setState({ lider: "OBISPO" })

        }
        else {
            await helpers.authAxios.get(this.url + '/Sector/' + localStorage.getItem('sector'))
                .then(res => {
                    this.setState({
                        sectores: res.data.sector
                    })
                });
            this.setState({ lider: "PASTOR" })
        }
    }

    handle_sectorSeleccionado = async (e) => {
        if (e.target.value === "todos") {
            this.setState({ sectorSeleccionado: e.target.value });
            console.log("Sector: ", e.target.value)
            await helpers.authAxios.get(this.url + '/HogarDomicilio/GetListaHogaresByDistrito/' + localStorage.getItem('dto'))
                .then(res => {
                    // console.log(res.data.value);
                    this.setState({ infoListaHogares: res.data.listahogares })
                    console.log("Hogares: ", res.data.listahogares)
                    this.arreglarLista();
                    this.getInfoSector();
                });
        } else {
            this.setState({ sectorSeleccionado: e.target.value });
            console.log("Sector: ", e.target.value)
            await helpers.authAxios.get(this.url + '/HogarDomicilio/GetListaHogaresBySector/' + e.target.value)
                .then(res => {
                    // console.log(res.data.value);
                    this.setState({
                        infoListaHogares: res.data.listahogares
                    })
                    console.log("Hogares: ", res.data.listahogares)
                    this.arreglarLista();
                    this.getInfoSector();
                });
        }
    }



    getPersonas = async () => {
        await helpers.authAxios.get("/Persona/GetBySector/" + sector)
            .then(res => {
                //Filtro de hogares 
                const knownElements = []
                const filteredElements = []
                res.data.map(element => {
                    if (!knownElements.includes(element.hogar.hd_Id_Hogar)) {
                        knownElements.push(element.hogar.hd_Id_Hogar)
                        filteredElements.push(element)
                    }
                })
                this.setState({ data: filteredElements })
            })
    }

    getListaHogares = async () => {
        if (localStorage.getItem('sector') === null) {

            await helpers.authAxios.get(this.url + "/HogarDomicilio/GetListaHogaresByDistrito/" + localStorage.getItem('dto'))
                .then(res => {
                    this.setState({ infoListaHogares: res.data.listahogares });
                })
            console.log("Sale de la API: ", this.state.infoListahogares)
            //this.setState({ sec_Id_Sector: localStorage.getItem('sector') });
            this.arreglarLista();

        } else {
            await helpers.authAxios.get(this.url + "/HogarDomicilio/GetListaHogaresBySector/" + localStorage.getItem('sector'))
                .then(res => {
                    this.setState({ infoListaHogares: res.data.listahogares });
                })
            console.log("Sale de la API: ", this.state.infoListahogares)
            this.setState({ sec_Id_Sector: localStorage.getItem('sector') });
            this.arreglarLista();
        }

    }

    arreglarLista = () => {
        //Arregla la lista para desplegarla en Pantalla y PDF
        const data2 = []
        console.log("Entra en función Arreglar Lista: ", this.state.infoListaHogares)
        if (this.state.infoListaHogares.length > 0) { //Si el array infoListaHogares tiene por lo menos 1 hogar Arregla/Prepara la lista
            this.state.infoListaHogares.forEach((hogar, index) => {
                const miembros = []
                let conteo = 0
                hogar.integrantes.forEach((miembro, i) => {
                    conteo = i
                    miembros.push({
                        Grupo: miembro.grupo,
                        Nombre: miembro.nombre,
                        Nacimiento: moment(miembro.nacimiento).format('D/MMM/YYYY'),
                        Edad: miembro.edad,
                        Bautismo: miembro.bautismo ? (moment(miembro.bautismo).format('D/MMM/YYYY')) : "-",
                        Celular: miembro.cel ? miembro.cel : "-"

                    })

                    data2.push({
                        Indice: (conteo === 0) ? String(hogar.indice) : " ",
                        Grupo: String(miembros[i].Grupo),
                        Nombre: String(miembros[i].Nombre),
                        Nacimiento: (miembros[i].Nacimiento),
                        Edad: String(miembros[i].Edad),
                        Bautismo: (miembros[i].Bautismo) ? (miembros[i].Bautismo) : " ",
                        Celular: String(miembros[i].Celular),
                        Tel_Casa: (conteo === 0) ? String(hogar.tel ? hogar.tel : "-") : " ",
                        Domicilio: (conteo === 0) ? String(hogar.direccion) : " ",
                    })
                })

                this.setState({ listaArreglada: data2 })

            })
        } else { //Si el Sector no tiene Hogares, resetea el array 'listaArreglada'
            this.setState({ listaArreglada: [] })
        }

    }



    getInfoSector = async () => {
        if (localStorage.getItem('sector') !== null) {
            await helpers.authAxios.get(this.url + "/sector/" + localStorage.getItem('sector'))
                .then(res => {
                    this.setState({ infoSector: res.data.sector[0] });
                })

            await helpers.authAxios.get(this.url + "/PersonalMinisterial/GetSecretarioBySector/" + localStorage.getItem('sector'))
                .then(res => {
                    this.setState({
                        infoSecretario: res.data.infoSecretario.length > 0 ? res.data.infoSecretario[0].pem_Nombre : ""
                    });
                })
        } else {
            await helpers.authAxios.get(this.url + "/sector/" + this.state.sectorSeleccionado)
                .then(res => {
                    this.setState({ infoSector: res.data.sector[0] });
                })
            await helpers.authAxios.get(this.url + "/PersonalMinisterial/GetSecretarioByDistrito/" + localStorage.getItem('dto'))
                .then(res => {
                    this.setState({
                        infoSecretario: res.data.infoSecretario.length > 0 ? res.data.infoSecretario[0].pem_Nombre : ""
                    });
                })
        }


    }

    downloadTable = () => {
        TableToExcel.convert(document.getElementById("table1"), {
            name: "Reporte_Hogeres.xlsx",
            sheet: {
                name: "Hoja 1"
            }
        });
    }

    reporteHogaresPDF = () => {
        //console.log("Lista de Hogares: " + this.state.infoListaHogares.listahogares[0])

        let totalCount = 0
        let index = 1
        let yAxis = 20
        // INSTANCIA NUEVO OBJETO PARA CREAR PDF
        const doc = new jsPDF("landscape", "mm", "letter");

        doc.addImage(logo, 'PNG', 10, 5, 70, 20);
        doc.text("LISTA DE HOGARES", 165, 10, { align: 'center' });

        doc.setFontSize(8);


        if (sector) {
            doc.text(`SECTOR ${this.state.infoSector.sec_Numero}, ${this.state.infoSector.sec_Alias}`, 165, 17, { align: 'center' });
            doc.text(`AL DÍA ${moment().format('LL').toUpperCase()}`, 165, 22, { align: 'center' });
        }
        else {
            doc.text(`DISTRITO ${this.state.infoDistrito.dis_Numero}, ${this.state.infoDistrito.dis_Alias}`, 165, 17, { align: 'center' })
            doc.text(`AL DÍA ${moment().format('LL').toUpperCase()}`, 165, 22, { align: 'center' });
        }
        yAxis = 28;
        const headers = [
            'Hogar',
            'Grupo',
            'Nombre',
            'Nacimiento',
            'Edad',
            'Bautismo',
            'Celular',
            'Tel_Casa',
            'Domicilio',
        ]
        console.log(this.state.listaArreglada);
        let listaUnida = []
        this.state.listaArreglada.forEach(per => {
            //console.log(per);
            //console.log(Object.values(per))
            listaUnida.push(Object.values(per))
            return listaUnida
        })
        //doc.table(10, 35, this.state.listaArreglada, headers, { autoSize: true, fontSize: 8, padding: 1, margins: { left: 0, top: 10, bottom: 10, width: 0 } })

        console.log({ listaUnida });
        autoTable(doc,
            {
                head: [headers],
                body: listaUnida,
                theme: "plain",
                startY: yAxis,
                margin: { left: 10 },
                styles: {
                    lineColor: [44, 62, 80],
                    lineWidth: .1,
                },
                headStyles: { fillColor: [196, 229, 252], halign: "center" },
                bodyStyles: { fontSize: 6 },
            })
        //yAxis += data.length * 8
        yAxis = doc.previousAutoTable.finalY;

        doc.setFontSize(8);

        if (yAxis < 220) {
            yAxis += 3
        } else {
            yAxis = 0
        }

        //yAxis = 35 + this.state.listaArreglada.length * 8 + 9

        doc.text(`JUSTICIA Y VERDAD`, 120, yAxis);
        yAxis += 5;
        doc.text(`AL DÍA ${moment().format('LL').toUpperCase()}`, 115, yAxis);

        yAxis += 20;
        doc.line(60, yAxis, 120, yAxis);
        doc.line(160, yAxis, 220, yAxis);
        yAxis += 3;
        doc.text("SECRETARIO", 85, yAxis);
        doc.text(`${this.state.lider}`, 185, yAxis);
        yAxis -= 5;
        doc.text(`${this.state.infoSecretario}`, 70, yAxis);
        doc.text(`${JSON.parse(localStorage.getItem("infoSesion")).pem_Nombre}`, 170, yAxis)


        doc.save("ReporteHogares.pdf");
    }


    render() {
        let lista;
        let i = 1;
        let bgcolor = "#ddd"
        let cambia = true
        if (this.state.listaArreglada.length >= 0) {
            return (
                <>
                    <Container fluid>
                        <FormGroup>
                            <Row>
                                <Col xs="5">
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
                                <Col xs="5">
                                    <Input
                                        type="select"
                                        name="sectorSeleccionado"
                                        value={this.state.sectorSeleccionado}
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



                        {/* Iniciaba versión anterior */}
                        <Button className="btn-success m-3 " onClick={() => this.downloadTable()}><i className="fas fa-file-excel mr-2"></i>Descargar Excel</Button>
                        <Button className="btn-danger m-3 " onClick={() => this.reporteHogaresPDF()}><i className="fas fa-file-pdf mr-2"></i>Descargar PDF</Button>

                        <Row>
                            <h1 className="text-info">Listado de hogares</h1>
                        </Row>
                        {this.state.infoDistrito.dis_Numero || this.state.infoSector.sec_Alias ?
                            <Row>
                                <strong>DISTRITO:</strong> &nbsp;  {this.state.infoDistrito.dis_Numero}, {this.state.infoDistrito.dis_Alias}, &nbsp; <strong>Sector:</strong>&nbsp; {this.state.infoSector.sec_Numero} - {this.state.infoSector.sec_Alias}
                            </Row> : null
                        }
                        <Row></Row>
                        <div id="infoListaHogares">
                            <br></br>
                            <Row>
                                <Table id='table1' className="table table-sm table-bordered" data-cols-width="5,7,35,15,6,15,15,15,50" >
                                    <thead>
                                        <tr align="center" >
                                            <th width="5%">Hogar</th>
                                            <th width="3.5%">Grupo</th>
                                            <th width="21.5%">Nombre</th>
                                            <th width="7%">Nacimiento</th>
                                            <th width="3%">Edad</th>
                                            <th width="7%">Bautismo</th>
                                            <th width="10%">Celular</th>
                                            <th width="10%">Tel. Casa</th>
                                            <th width="33%">Domicilio</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.listaArreglada.map((hogar, index) => {

                                                if (Number(hogar.Indice)) {
                                                    cambia = true;
                                                } else {
                                                    cambia = false;
                                                }

                                                if (cambia && bgcolor == "#f2f2f2") {
                                                    bgcolor = "#ddd";
                                                } else if (cambia && bgcolor == "#ddd") {
                                                    bgcolor = "#f2f2f2";
                                                } else if (!cambia && bgcolor == "#f2f2f2") {
                                                    bgcolor = "#f2f2f2";
                                                } else if (!cambia && bgcolor == "#ddd") {
                                                    bgcolor = "#ddd";
                                                }

                                                //let bgcolor = hogar.Indice%2 == 0 && hogar.Indice? "#f2f2f2" : "#ddd"
                                                return (
                                                    <React.Fragment key={hogar.Indice}>
                                                        <tr style={{ "background-color": bgcolor }}>
                                                            <td align="center" >{hogar.Indice}</td>
                                                            <td align="center">{hogar.Grupo}</td>
                                                            <td >{hogar.Nombre}</td>
                                                            <td >{hogar.Nacimiento}</td>
                                                            <td align="center">{hogar.Edad}</td>
                                                            <td align="center">{hogar.Bautismo}</td>
                                                            <td >{hogar.Celular}</td>
                                                            <td >{hogar.Tel_Casa}</td>
                                                            <td >{hogar.Domicilio}</td>
                                                        </tr>
                                                    </React.Fragment>
                                                )
                                            })
                                        }
                                    </tbody>
                                </Table>
                            </Row>
                        </div>
                    </Container>
                </>
            )
        } else if (this.state.data.length === 0 && this.state.status === 'success') {
            return (
                <>
                    <React.Fragment>
                        <h3>Aun no hay Hogares Registros!</h3>
                        <p>Los hogares son agregados desde el registro de personal.</p>
                    </React.Fragment>
                </>
            );
        } else {
            return (
                <>
                    <React.Fragment>
                        <h3>Cargando información...</h3>
                        <p>Por favor espere.</p>
                    </React.Fragment>
                </>
            );
        }
    }
}

export default RptListaDeHogares;