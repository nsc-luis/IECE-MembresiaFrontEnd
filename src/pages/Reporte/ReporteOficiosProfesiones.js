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


export default function ReporteOficiosProfesiones(){
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
                    setPersonas(res.data)
                });
                helpers.authAxios.get("/Distrito/" + dto)
                .then(res => {
                    setInfoDis(res.data.dis_Alias)
                })
        }else{
            helpers.authAxios.get("/Persona/GetBySector/" + sector)
            .then(res => {
                console.log(res.data)
                setPersonas(res.data)
            });
            helpers.authAxios.get("/Distrito/" + dto)
            .then(res => {
                setInfoDis(res.data.dis_Alias)
            })
            helpers.authAxios.get("/Sector/" + sector)
            .then(res => {
                setInfoSec(res.data.sector[0].sec_Alias)
            })
        }
    }, [personas.length])

    const downloadTable = () =>{
        TableToExcel.convert(document.getElementById("table1"), {
            name: "Personal_Oficios_y_Profesiones.xlsx",
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
        doc.text("LISTA PROFESIONES Y OFICIOS", 85, 10);
        doc.setFontSize(8);
        
        
        if (sector) {
            doc.text(`SECTOR: ${JSON.parse(localStorage.getItem("infoSesion")).sec_Alias}`, 85, 20);
            doc.text(`AL DÍA ${moment().format('LL').toUpperCase()}`, 85, 25);
        }
        else {
            doc.text(`AL DÍA ${moment().format('LL').toUpperCase()}`, 85, 20);
            doc.text(`DISTRITO: ${JSON.parse(localStorage.getItem("infoSesion")).dis_Alias}`, 85, 25)
        }
        
        
        const headers = [
            'Indice',
            'Nombre',
            'Grupo',
            'Profesion_Oficio_1',
            'Profesion_Oficio_2',
            'Tel_Celular',
            'Email',
        ]
        const data = personas.map((persona,index) => ({
            Indice: String(index+1),
            Nombre: persona.persona.per_Nombre + ' ' + persona.persona.per_Apellido_Paterno + ' ' + persona.persona.per_Apellido_Materno,
            Grupo: persona.persona.per_Bautizado ? "Bautizado".toUpperCase() : "No Bautizado".toUpperCase(),
            Profesion_Oficio_1: String(persona.persona.profesionOficio1[0].pro_Sub_Categoria),
            Profesion_Oficio_2: String(persona.persona.profesionOficio2[0].pro_Sub_Categoria),
            Tel_Celular: String(persona.persona.per_Telefono_Movil ? persona.persona.per_Telefono_Movil : 'n/a'),
            Email: String(persona.persona.per_Email_Personal)
        }))
        doc.table(10, 35, data, headers, {autoSize:true, fontSize: 6, padding:1})
        // doc.setFillColor(137, 213, 203) // Codigos de color RGB (red, green, blue)
        // doc.rect(10, yAxis, 190, 4, "F");
        // doc.setFont("", "", "bold");
        // yAxis += 3;
        // doc.text("Indice", 11, yAxis);
        // doc.text("Nombre Completo", 20, yAxis);
        // doc.text("Grupo", 60, yAxis);
        // doc.text("Profesión/Oficio 1", 80, yAxis);
        // doc.text("Profesión/Oficio 2", 110, yAxis);
        // doc.text("Teléfono Movil", 140, yAxis);
        // doc.text("E-mail", 170, yAxis);
        // yAxis += 7;
        // doc.setFontSize(6);
        // personas.map((persona) => {
        //     doc.text(`${index}`, 13, yAxis);
        //     doc.text(`${persona.persona.per_Nombre} ${persona.persona.per_Apellido_Paterno} ${persona.persona.per_Apellido_Materno}`, 20, yAxis);
        //     doc.text(`${persona.persona.per_Bautizado ? 'Bautizado' : 'No Bautizado'}`, 60, yAxis);
        //     doc.text(`${persona.persona.profesionOficio1[0].pro_Sub_Categoria}`, 80, yAxis);
        //     doc.text(`${persona.persona.profesionOficio2[0].pro_Sub_Categoria}`, 110, yAxis);
        //     doc.text(`${persona.persona.per_Telefono_Movil}`, 140, yAxis);
        //     doc.text(`${persona.persona.per_Email_Personal}`, 170, yAxis);
        //     yAxis+=5;
        //     index++;
            
        // })

        // yAxis += 2;
        // doc.rect(75, yAxis, 15, 4);
        // yAxis += 3;
        // doc.text("TOTAL DE PERSONAL BAUTIZADO:", 20, yAxis);
        // doc.text(`${totalCount}`, 80, yAxis);

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


        doc.save("ReporteOficiosProfesiones.pdf");
    }
    return(
        <>
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
                        LISTA DE PROFESIONES Y OFICIOS
                        {/* <h5>Distrito: {infoDis}</h5> */}

                        <div></div>
                        {sector ? <h5>{infoSec}</h5> : null}
                        
                    </Col>
                </Row>
                </CardTitle>
                <CardBody>
                    <Table responsive hover id="table1" data-cols-width="10,40,20,40,40,20,30">
                        <thead>
                            <tr>
                                <th data-f-bold>Indice</th>
                                <th data-f-bold>Nombre Completo</th>
                                <th data-f-bold>Grupo</th>
                                <th data-f-bold>Profesión / Oficio 1</th>
                                <th data-f-bold>Profesión / Oficio 2</th>
                                <th data-f-bold>Telefono Movil</th>
                                <th data-f-bold>E-mail</th>
                            </tr>
                        </thead>
                        <tbody>
                            {personas.map((persona, index) => (
                                <tr key={persona.persona.per_Id_Persona}>
                                    <td>{index + 1}</td>
                                    <td>{persona.persona.per_Nombre} {persona.persona.per_Apellido_Paterno} {persona.persona.per_Apellido_Materno}</td>
                                    <td>{persona.persona.per_Bautizado ? "Bautizado".toUpperCase() : "No Bautizado".toUpperCase()}</td>
                                    <td>{persona.persona.profesionOficio1[0].pro_Sub_Categoria == 'OTRO' ? ' ' : persona.persona.profesionOficio1[0].pro_Sub_Categoria}</td>
                                    <td>{persona.persona.profesionOficio2[0].pro_Sub_Categoria == 'OTRO' ? ' ' : persona.persona.profesionOficio1[0].pro_Sub_Categoria}</td>
                                    <td>{persona.persona.per_Telefono_Movil}</td>
                                    <td>{persona.persona.per_Email_Personal}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </CardBody>
                </Card>
            </Container>
        </>
    )
}
