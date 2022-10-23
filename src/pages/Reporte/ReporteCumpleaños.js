import Layout from "../Layout";
import helpers from "../../components/Helpers";
import {
    Container, Button,
     CardTitle, Card, CardBody, Table, UncontrolledCollapse, Row, Col
} from 'reactstrap';

import React, { useEffect, useState, } from 'react';
import TableToExcel from "@linways/table-to-excel";
import jsPDF from 'jspdf';
import Moment from "react-moment";
import moment from 'moment/min/moment-with-locales';
import 'moment/dist/locale/es'
import logo from '../../assets/images/IECE_LogoOficial.jpg'


export default function ReporteCumpleaños(){
    //Estados
    const [personas, setPersonas] = useState([])
    const [infoDis, setInfoDis] = useState(null)
    const [infoSec, setInfoSec] = useState(null)
    const dto = JSON.parse(localStorage.getItem("dto"))
    const sector = JSON.parse(localStorage.getItem("sector"))
    //Llamadas en render
    useEffect(() => {
        if(sector == null){
            helpers.authAxios.get("/Persona/GetByDistrito/" + dto)
                .then(res => {
                    const sortedData = res.data.map( d => (d.persona)).sort((a,b) => {
                        return moment(a.per_Fecha_Nacimiento).dayOfYear() - moment(b.per_Fecha_Nacimiento).dayOfYear()
                    })
                    setPersonas(sortedData)
                });
                helpers.authAxios.get("/Distrito/" + dto)
                .then(res => {
                    setInfoDis(res.data.dis_Alias)
                })
        }else{
            helpers.authAxios.get("/Persona/GetBySector/" + sector)
            .then(res => {
                const sortedData = res.data.map( d => (d.persona)).sort((a,b) => {
                    return moment(a.per_Fecha_Nacimiento).dayOfYear() - moment(b.per_Fecha_Nacimiento).dayOfYear()
                })
                setPersonas(sortedData)
            helpers.authAxios.get("/Distrito/" + dto)
            .then(res => {
                setInfoDis(res.data.dis_Alias)
            })
            helpers.authAxios.get("/Sector/" + sector)
            .then(res => {
                setInfoSec(res.data.sector[0].sec_Alias)
            })
            });
        }
    }, [personas.length])

    const downloadTable = () =>{
        TableToExcel.convert(document.getElementById("table1"), {
            name: "Cumpleaños_membresia.xlsx",
            sheet: {
              name: "Hoja 1"
            }
          });
    }

    let totalCount = 0;

    const countPersons = (type) =>{
        let count = 0
        personas.map(persona => {
            if(persona.persona.per_Categoria === type){
                count+=1 
            }
        })
        totalCount += count;
        return count
    }
    const reportePersonalBautizadoPDF = () =>{
        totalCount = 0
        let index = 1
        // INSTANCIA NUEVO OBJETO PARA CREAR PDF
        const doc = new jsPDF("p", "mm", "letter");

        doc.addImage(logo, 'PNG', 10, 5, 70, 20);
        doc.text("REPORTE CUMPLEAÑOS", 85, 10);
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
            'Nombre',
            'Grupo',
            'Fecha_Nacimiento',
            'Edad_Actual',
        ]
        const data = personas.map((persona,index) => ({
            Indice: String(index+1),
            Nombre: persona.persona ? persona.persona.per_Nombre : " " + ' ' + persona.persona ? persona.persona.per_Apellido_Paterno : " " + ' ' + persona.persona ? persona.persona.per_Apellido_Materno : " ",
            Grupo: persona.persona.per_Bautizado ? "Bautizado".toUpperCase() : "No Bautizado".toUpperCase(),
            Fecha_Nacimiento: String(moment(persona.persona.per_Fecha_Nacimiento).format("DD/MM/YYYY")),
            Edad_Actual: String(moment().diff(persona.persona.per_Fecha_Nacimiento, "years")),
        }))
        doc.table(10, 35, data, headers, {autoSize:true, fontSize: 8, padding:1})

        let yAxis = 160
        doc.setFontSize(8);

        yAxis += 20;
        doc.text(`JUSTICIA Y VERDAD`, 90, yAxis);
        yAxis += 5;
        doc.text(`AL DÍA ${moment().format('LL').toUpperCase()}`, 85, yAxis);

        yAxis += 35;
        doc.line(30, yAxis, 90, yAxis);
        doc.line(120, yAxis, 180, yAxis);
        yAxis += 3;
        doc.text("SECRETARIO", 51, yAxis);
        doc.text("PASTOR", 145, yAxis);
        yAxis -= 5;
        doc.text(`${JSON.parse(localStorage.getItem("infoSesion")).pem_Nombre}`, 130, yAxis);


        doc.save("ReporteCumpleaños.pdf");
    }
    return(
        <Layout>
            <Container fluid>
                <Button className="btn-success m-3 " onClick={() => downloadTable()}><i className="fas fa-file-excel mr-2"></i>Descargar Excel</Button>
                <Button className="btn-danger m-3 " onClick={() => reportePersonalBautizadoPDF()}><i className="fas fa-file-pdf mr-2"></i>Descargar PDF</Button>

                {/* TABLA */}
                <Card body>
                <CardTitle className="text-center" tag="h3">
                <Row>
                    <Col lg="3">
                        <img src={logo} width="100%"></img> 
                    </Col>
                    <Col>
                        REPORTE DE CUMPLEAÑOS
                        <h5>Distrito: {infoDis}</h5>
                        {sector ? <h5>Sector: {infoSec}</h5> : null}
                    </Col>
                </Row>
                </CardTitle>
                <CardBody>
                    <Table responsive hover id="table1" data-cols-width="10,40,20,40,30">
                        <thead>
                            <tr>
                                <th data-f-bold>Indice</th>
                                <th data-f-bold>Nombre Completo</th>
                                <th data-f-bold>Grupo</th>
                                <th data-f-bold>Fecha Nacimiento</th>
                                <th data-f-bold>Edad Actual</th>
                            </tr>
                        </thead>
                        <tbody>
                            {personas.map((persona, index) => (
                                <tr key={persona.per_Id_Persona}>
                                    <td>{index + 1}</td>
                                    <td>{persona.per_Nombre} {persona.per_Apellido_Paterno} {persona.per_Apellido_Materno}</td>
                                    <td>{persona.per_Bautizado ? "Bautizado".toUpperCase() : "No Bautizado".toUpperCase()}</td>
                                    <td>{moment(persona.per_Fecha_Nacimiento).format("LL")}</td>
                                    <td>{moment().diff(persona.per_Fecha_Nacimiento, "years")}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </CardBody>
                </Card>
            </Container>
        </Layout>
    )
}
