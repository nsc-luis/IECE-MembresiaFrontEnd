import React, { Component } from 'react';
import helpers from '../../../components/Helpers';
import {
    Container, Row, Col, Card, CardHeader,
    CardBody, CardFooter, Form, Input, Label,
    Button, FormFeedback, Table,
    Modal, ModalFooter, ModalBody, ModalHeader
} from 'reactstrap';
import axios from 'axios';
import logo from '../../../assets/images/IECE_LogoOficial.jpg'
import './style.css';
import moment from 'moment/min/moment-with-locales';
import 'moment/dist/locale/es'
import TableToExcel from "@linways/table-to-excel";
import jsPDF from 'jspdf';

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
            listaArreglada:[],
            infoSecretario:{},
        }
    }

    componentDidMount() {
        this.getPersonas();
        this.getInfoDistrito();
        this.getInfoSector();
        this.getListaHogares();
        }

    getPersonas = async() => {
        await helpers.authAxios.get("/Persona/GetBySector/" + sector)
            .then(res => {
                //Filtro de hogares 
                const knownElements = []
                const filteredElements = []
                res.data.map( element => {
                    if(!knownElements.includes(element.hogar.hd_Id_Hogar)){
                        knownElements.push(element.hogar.hd_Id_Hogar)
                        filteredElements.push(element)
                    }
                })
                this.setState({data: filteredElements})
            })
    }
    
    getListaHogares = async () => {
        await helpers.authAxios.get(this.url + "/HogarDomicilio/getListaHogaresBySector/" + localStorage.getItem('sector'))
            .then(res => {
                this.setState({ infoListaHogares: res.data.listahogares});
            })
            console.log("Sale de la API: ", this.state.infoListaHogares)
            this.arreglarLista();
    }

arreglarLista= () =>{
 //Arregla la lista a manera de presentarla en Pantalla y PDF
 const data2 = []
 console.log("Entra en función Arreglar Lista: ", this.state.infoListaHogares)
 this.state.infoListaHogares.forEach((hogar, index) => {
     const miembros =[]
     let conteo = 0
     hogar.integrantes.forEach((miembro, i) => {
         conteo = i
         miembros.push({
             Grupo: miembro.grupo,
             Nombre: miembro.nombre,
             Nacimiento: moment(miembro.nacimiento).format('d/MMM/YYYY'),
             Edad: miembro.edad,
             Celular: miembro.cel?miembro.cel:"-"
         })
        
         data2.push({
             Indice: (conteo==0)?String(hogar.indice):" ",
             Grupo: String(miembros[i].Grupo),
             Nombre: String(miembros[i].Nombre),
             Nacimiento: (miembros[i].Nacimiento),
             Edad: String(miembros[i].Edad),
             Celular: String(miembros[i].Celular),
             Tel_Casa: (conteo==0)?String(hogar.tel?hogar.tel:"-"):" ",
             Domicilio: (conteo==0)?String(hogar.direccion):" ",
             })
     })
this.setState({listaArreglada : data2})
 })
    }

    getInfoDistrito = async () => {
        await helpers.authAxios.get(this.url + "/distrito/" + localStorage.getItem('dto'))
            .then(res => {
                this.setState({ infoDistrito: res.data});
            })
    }

    getInfoSector = async () => {
        await helpers.authAxios.get(this.url + "/sector/" + localStorage.getItem('sector'))
            .then(res => {
                this.setState({ infoSector: res.data.sector[0]});
            })

        await helpers.authAxios.get(this.url + "/PersonalMinisterial/GetSecretarioBySector/" + localStorage.getItem('sector'))
            .then(res => {
                this.setState({
                    infoSecretario: res.data.infoSecretario.length > 0 ? res.data.infoSecretario[0].pem_Nombre : ""
                });
            })
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
        doc.text("LISTA DE HOGARES", 165, 10, {align:'center'});

        doc.setFontSize(8);
        
        
        if (sector) {
            doc.text(`SECTOR ${this.state.infoSector.sec_Numero}, ${this.state.infoSector.sec_Alias}`, 165, 17, {align:'center'});
            doc.text(`AL DÍA ${moment().format('LL').toUpperCase()}`, 165, 22, {align:'center'});
        }
        else {
            doc.text(`DISTRITO ${this.state.infoDistrito.dis_Numero}, ${this.state.infoDistrito.dis_Alias}`, 165, 17, {align:'center'})
            doc.text(`AL DÍA ${moment().format('LL').toUpperCase()}`, 165, 22, {align:'center'});
        }

        const headers = [
            'Indice',
            'Grupo',
            'Nombre',
            'Nacimiento',
            'Edad',
            'Celular',
            'Tel_Casa',
            'Domicilio',
        ]

        doc.table(10, 35, this.state.listaArreglada, headers, {autoSize:true, fontSize: 8, padding:1, margins: {left: 0, top: 10,bottom: 10, width: 0}})
        
        doc.setFontSize(8);

        if(yAxis < 220){
            yAxis += 3
        }else{
            yAxis = 0
        } 

        
        yAxis = 35+ this.state.listaArreglada.length * 8 + 5

        doc.text(`JUSTICIA Y VERDAD`, 120, yAxis);
        yAxis += 5;
        doc.text(`AL DÍA ${moment().format('LL').toUpperCase()}`, 115, yAxis);

        yAxis += 20;
        doc.line(60, yAxis, 120, yAxis);
        doc.line(160, yAxis, 220, yAxis);
        yAxis += 3;
        doc.text("SECRETARIO", 85, yAxis);
        doc.text("PASTOR", 185, yAxis);
        yAxis -= 5;
        doc.text(`${this.state.infoSecretario}`, 70, yAxis);
        doc.text(`${JSON.parse(localStorage.getItem("infoSesion")).pem_Nombre}`, 170, yAxis)


        doc.save("ReporteHogares.pdf");
    }
    render() {
        let lista;
        let i=1;
        let bgcolor =  "#ddd"
        let cambia = true
        if (this.state.listaArreglada.length >= 0) {
            return (
               <>
                    <Container fluid>
                    <Button className="btn-success m-3 " onClick={() => this.downloadTable()}><i className="fas fa-file-excel mr-2"></i>Descargar Excel</Button>
                <Button className="btn-danger m-3 " onClick={() => this.reporteHogaresPDF()}><i className="fas fa-file-pdf mr-2"></i>Descargar PDF</Button>

                        <Row>
                            <h1 className="text-info">Listado de hogares</h1>
                        </Row>
                        {this.state.infoDistrito.dis_Numero && this.state.infoSector.sec_Alias ? 
                            <Row>
                                <strong>DISTRITO:</strong> &nbsp;  {this.state.infoDistrito.dis_Numero}, {this.state.infoDistrito.dis_Alias}, &nbsp; <strong>Sector:</strong>&nbsp; {this.state.infoSector.sec_Numero} - {this.state.infoSector.sec_Alias}
                            </Row> : null
                        }
                        <Row></Row>
                        <div id="infoListaHogares">
                        <br></br>
                            <Row>
                                <Table id='table1'  className="table table-sm table-bordered" data-cols-width="10,10,30,15,8,15,15,50">
                                    <thead>
                                        <tr align="center" >
                                            <th width="5">Indice</th>
                                            <th width="3.5%">Grupo</th>
                                            <th width="26%">Nombre</th>
                                            <th width="7%">Nacimiento</th>
                                            <th width="3%">Edad</th>
                                            <th width="15%">Celular</th>
                                            <th width="10%">Tel. Casa</th>
                                            <th width="33%">Domicilio</th> 
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.listaArreglada.map((hogar, index) => {
                                               
                                                if (Number(hogar.Indice)){
                                                    cambia=true;
                                                } else{
                                                    cambia=false;
                                                }

                                                if (cambia && bgcolor == "#f2f2f2"){
                                                    bgcolor ="#ddd";
                                                }else if(cambia && bgcolor == "#ddd"){
                                                    bgcolor ="#f2f2f2";
                                                }else if(!cambia && bgcolor == "#f2f2f2"){
                                                    bgcolor ="#f2f2f2";
                                                }else if(!cambia && bgcolor == "#ddd"){
                                                    bgcolor ="#ddd";
                                                }

                                                //let bgcolor = hogar.Indice%2 == 0 && hogar.Indice? "#f2f2f2" : "#ddd"
                                                return (
                                                    <React.Fragment key={hogar.Indice}>
                                                        <tr style={{"background-color": bgcolor}}>
                                                            <td align="center" >{hogar.Indice}</td>
                                                            <td align="center">{hogar.Grupo}</td>
                                                            <td >{hogar.Nombre}</td>   
                                                            <td >{hogar.Nacimiento}</td>
                                                            <td  align="center">{hogar.Edad}</td>
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