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

    constructor(props) {
        super(props);
        this.url_api = helpers.url_api;
        this.infoSesion = JSON.parse(localStorage.getItem("infoSesion"));
        this.state = {
            data: [],
            infoDistrito: {},
            infoSector: {}
        }
    }

    componentDidMount() {
        this.getPersonas();
        this.getInfoDistrito();
        this.getInfoSector();
    }

    getPersonas = () => {
        helpers.authAxios.get("/Persona/GetBySector/" + sector)
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
                console.log(this.state.data);
            })
    }

    getInfoDistrito = () => {
        axios.get(this.url_api + "/Distrito/" + this.infoSesion.dis_Id_Distrito)
            .then(res => {
                this.setState({ infoDistrito: res.data });
            })
    }

    getInfoSector = () => {
        axios.get(this.url_api + "/Sector/" + this.infoSesion.sec_Id_Sector)
            .then(res => {
                console.log(res)
                this.setState({ infoSector: res.data[0] });
            })
    }
    downloadTable = () => {
        TableToExcel.convert(document.getElementById("table_to_excel"), {
            name: "Reporte_Hogeres.xlsx",
            sheet: {
              name: "Hoja 1"
            }
          });
    }
    reporteHogaresPDF = () => {
        let totalCount = 0
        let index = 1
        let yAxis = 20
        // INSTANCIA NUEVO OBJETO PARA CREAR PDF
        const doc = new jsPDF("landscape", "mm", "letter");
    
        doc.addImage(logo, 'PNG', 10, 5, 70, 20);
        doc.text("REPORTE DE HOGARES", 85, 10);
        doc.setFontSize(8);
        doc.text(`DISTRITO: ${JSON.parse(localStorage.getItem("infoSesion")).dis_Alias}`, 85, 15)
        
        if (sector) {
            doc.text(`SECTOR: ${JSON.parse(localStorage.getItem("infoSesion")).sec_Alias}`, 85, 20);
            doc.text(`AL DÍA ${moment().format('LL').toUpperCase()}`, 85, 25);
        }
        else {
            doc.text(`AL DÍA ${moment().format('LL').toUpperCase()}`, 85, 20);
        }
    
        const headers = [
            'Indice',
            'Tel_Casa',
            'Domicilio',
            'Grupo',
            'Nombre',
            'Nacimiento',
            'Edad',
            'Celular',
        ]
        const data = [] 
        this.state.data.forEach((hogar, index) => {
            // const address = hogar.domicilio[0].hd_Calle ? hogar.domicilio[0].hd_Calle : ' ' +
            //  hogar.domicilio[0].hd_Numero_Interior ? hogar.domicilio[0].hd_Numero_Interior : ' ' 
            // + hogar.domicilio[0] ? hogar.domicilio[0].hd_Numero_Exterior : ' ' + hogar.domicilio[0] ? hogar.domicilio[0].hd_Tipo_Subdivision : ' ' 
            // + hogar.domicilio[0] ? hogar.domicilio[0].hd_Subdivision : ' ' + hogar.domicilio[0] ? hogar.domicilio[0].hd_Municipio_Ciudad : ' ' 
            // + hogar.domicilio[0] ? hogar.domicilio[0].est_Nombre : ' '
            let address = ''
            if(hogar.domicilio[0]){
                const [mappedAddress] = hogar.domicilio.map(element => (
                    {
                        hd_Calle:element.hd_Calle,
                        hd_Numero_Interior:element.hd_Numero_Interior ? element.hd_Numero_Interior : "N/A" ,
                        hd_Numero_Exterior:element.hd_Numero_Exterior,
                        hd_Tipo_Subdivision:element.hd_Tipo_Subdivision,
                        hd_Subdivision:element.hd_Subdivision,
                        hd_Municipio_Ciudad:element.hd_Municipio_Ciudad,
                        est_Nombre:element.est_Nombre,
                    }
                ))
                address = Object.values(mappedAddress).join(',')
                console.log(mappedAddress)
            }else{
                address = "Sin datos"
            }
            
            console.log(address)
            hogar.miembros.forEach( miembro => {
                data.push({
                    Indice: String(index + 1),
                    Tel_Casa: String(hogar.domicilio[0] ? hogar.domicilio[0].hd_Telefono : null),
                    Domicilio: String(address),
                    Grupo: "AGREGAR GRUPO",
                    Nombre: String(miembro.per_Nombre + miembro.per_Apellido_Paterno + miembro.per_Apellido_Materno),
                    Nacimiento: "AGREGAR FECHA NACIMIENTO",
                    Edad: "AGREGAR FECHA NACIMIENTO",
                    Celular: "AGREGAR CELULAR",
                })
                if(yAxis < 220){
                    yAxis += 3
                }else{
                    yAxis = 0
                } 
            })
        })
        doc.table(10, 35, data, headers, {autoSize:true, fontSize: 6, padding:1, margins: {left: 0, top: 10,bottom: 10, width: 0}})
        
        doc.setFontSize(8);

        yAxis += 10;
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
        doc.text(`${JSON.parse(localStorage.getItem("infoSesion")).pem_Nombre}`, 170, yAxis);


        doc.save("ReporteHogares.pdf");
    }
    render() {
        if (this.state.data.length >= 0) {
            return (
                <>
                    <Container fluid>
                    <Button className="btn-success m-3 " onClick={() => this.downloadTable()}><i className="fas fa-file-excel mr-2"></i>Descargar Excel</Button>
                <Button className="btn-danger m-3 " onClick={() => this.reporteHogaresPDF()}><i className="fas fa-file-pdf mr-2"></i>Descargar PDF</Button>

                        <Row>
                            <h1 className="text-info">Listado de hogares</h1>
                        </Row>
                        {this.state.infoDistrito && this.state.infoSector ? 
                            <Row>
                                Pertenecientes al Distrito {this.state.infoDistrito.dis_Numero} - {this.state.infoDistrito.dis_Alias}, Sector {this.state.infoSector.sec_Numero} - {this.state.infoSector.sec_Alias}
                            </Row> : null
                        }
                        <div id="infoListaHogares">
                            <Row>
                                <Table id='table1'>
                                    <thead>
                                        <tr>
                                            <th>Indice</th>
                                            <th>Tel. Casa</th>
                                            <th>Domicilio</th>
                                            <th>Grupo</th>
                                            <th>Nombre</th>
                                            <th>Nacimiento</th>
                                            <th>Edad</th>
                                            <th>Celular</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.data.map((hogar, index) => {
                                                let bgcolor = index%2 == 0 ? "#f2f2f2" : "#ddd"
                                                return (
                                                    <React.Fragment key={hogar.hd_Id_Hogar}>
                                                    <td style={{"background-color": bgcolor}} rowSpan={hogar.miembros.length + 1}>{index + 1}</td>
                                                    <td style={{"background-color": bgcolor}} rowSpan={hogar.miembros.length + 1 }>{hogar.domicilio[0] ? hogar.domicilio[0].hd_Telefono : null }</td>
                                                    <td style={{"background-color": bgcolor}} rowSpan={hogar.miembros.length + 1 }>{hogar.domicilio[0] ? hogar.domicilio[0].hd_Calle : null} { hogar.domicilio[0] ? hogar.domicilio[0].hd_Numero_Interior : null } { hogar.domicilio[0] ? hogar.domicilio[0].hd_Numero_Exterior : null} { hogar.domicilio[0] ? hogar.domicilio[0].hd_Tipo_Subdivision : null} { hogar.domicilio[0] ? hogar.domicilio[0].hd_Subdivision : null} { hogar.domicilio[0] ? hogar.domicilio[0].hd_Municipio_Ciudad : null} { hogar.domicilio[0] ? hogar.domicilio[0].est_Nombre : null}</td>
                                                            {
                                                                hogar.miembros.map(miembro => (

                                                                        <tr>
                                                                            <td style={{"background-color": bgcolor}}>{miembro.per_Bautizado ? "B" : "NB"}</td>
                                                                            <td style={{"background-color": bgcolor}}>{miembro.per_Nombre + ' ' + miembro.per_Apellido_Paterno + ' '+ miembro.per_Apellido_Materno}</td>   
                                                                            <td style={{"background-color": bgcolor}}>{moment(miembro.per_Fecha_Nacimiento).format("DD/MM/YYYY")}</td>
                                                                            <td style={{"background-color": bgcolor}}>{moment().diff(miembro.per_Fecha_Nacimiento, "years")}</td>
                                                                            <td style={{"background-color": bgcolor}}>{miembro.per_Telefono_Movil}</td>
                                                                        </tr>
                                                               
                                                                ))
                                                            }
                                                    </React.Fragment>
                                                )
                                            })
                                        }
                                    </tbody>
                                </Table>
                            </Row>
                        </div>
                        <div hidden>
                            <Row>
                                <Table id='table_to_excel' data-cols-width="5,30,60,40,30,40,40,40">
                                    <thead>
                                        <tr>
                                            <th>Indice</th>
                                            <th>Tel. Casa</th>
                                            <th>Domicilio</th>
                                            <th>Grupo</th>
                                            <th>Nombre</th>
                                            <th>Nacimiento</th>
                                            <th>Edad</th>
                                            <th>Celular</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.data.map((hogar, index) => {
                                                let bgcolor = index%2 == 0 ? "#f2f2f2" : "#ddd"
                                                return (
                                                    <React.Fragment key={hogar.hd_Id_Hogar}>
                                                            {
                                                                hogar.miembros.map(miembro => (

                                                                        <tr>
                                                                            <td style={{"background-color": bgcolor}}>{index + 1}</td>
                                                                            <td style={{"background-color": bgcolor}}>{hogar.domicilio[0] ? hogar.domicilio[0].hd_Telefono : null }</td>
                                                                            <td style={{"background-color": bgcolor}}>{hogar.domicilio[0] ? hogar.domicilio[0].hd_Calle : null} { hogar.domicilio[0] ? hogar.domicilio[0].hd_Numero_Interior : null } { hogar.domicilio[0] ? hogar.domicilio[0].hd_Numero_Exterior : null} { hogar.domicilio[0] ? hogar.domicilio[0].hd_Tipo_Subdivision : null} { hogar.domicilio[0] ? hogar.domicilio[0].hd_Subdivision : null} { hogar.domicilio[0] ? hogar.domicilio[0].hd_Municipio_Ciudad : null} { hogar.domicilio[0] ? hogar.domicilio[0].est_Nombre : null}</td>
                                                                            <td style={{"background-color": bgcolor}}>AGREGAR GRUPO</td>
                                                                            <td style={{"background-color": bgcolor}}>{miembro.per_Nombre + ' ' + miembro.per_Apellido_Paterno + ' '+ miembro.per_Apellido_Materno}</td>   
                                                                            <td style={{"background-color": bgcolor}}>AGREGAR FECHA NACIMIENTO</td>
                                                                            <td style={{"background-color": bgcolor}}>AGREGAR FECHA NACIMIENTO</td>
                                                                            <td style={{"background-color": bgcolor}}>AGREGAR CELULAR</td>
                                                                        </tr>
                                                               
                                                                ))
                                                            }
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