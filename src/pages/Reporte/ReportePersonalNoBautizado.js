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


export default function ReportePersonalNoBautizado(){
    //Estados
    const [personas, setPersonas] = useState([])
    const dto = JSON.parse(localStorage.getItem("dto"))
    const sector = JSON.parse(localStorage.getItem("sector"))
    //Llamadas en render
    useEffect(() => {
        if(sector == null){
            helpers.authAxios.get("/Persona/GetByDistrito/" + dto)
                .then(res => {
                    setPersonas(res.data.filter(persona => !persona.persona.per_Bautizado))
                });
        }else{
            helpers.authAxios.get("/Persona/GetBySector/" + sector)
            .then(res => {
                setPersonas(res.data.filter(persona => !persona.persona.per_Bautizado))
            });
        }
    }, [personas.length])

    const downloadTable = () =>{
        TableToExcel.convert(document.getElementById("table1"), {
            name: "Personal_No_Bautizado.xlsx",
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
        doc.text("REPORTE DE PERSONAL NO BAUTIZADO", 85, 10);
        doc.setFontSize(8);
        doc.text(`DISTRITO: ${JSON.parse(localStorage.getItem("infoSesion")).dis_Alias}`, 85, 15)
        
        if (sector) {
            doc.text(`SECTOR: ${JSON.parse(localStorage.getItem("infoSesion")).sec_Alias}`, 85, 20);
            doc.text(`AL DÍA ${moment().format('LL').toUpperCase()}`, 85, 25);
        }
        else {
            doc.text(`AL DÍA ${moment().format('LL').toUpperCase()}`, 85, 20);
        }
        doc.line(10, 32, 200, 32);
        
        let yAxis = 35
        doc.setFillColor(137, 213, 203) // Codigos de color RGB (red, green, blue)
        doc.rect(10, yAxis, 190, 4, "F");
        doc.setFont("", "", "bold");
        yAxis += 3;
        doc.text("JOVENES HOMBRES", 15, yAxis);
        doc.text(`${countPersons("JOVEN_HOMBRE")}`, 80, yAxis);
        yAxis += 7;
        personas.map((persona) => {
            if(persona.persona.per_Categoria === "JOVEN_HOMBRE"){
                doc.text(`${index}.- ${persona.persona.per_Nombre} ${persona.persona.per_Apellido_Paterno} ${persona.persona.per_Apellido_Materno}`, 20, yAxis);
                yAxis+=5;
                index++;
            }
        })

        index = 1;
        yAxis += 7;
        doc.setFillColor(137, 213, 203) // Codigos de color RGB (red, green, blue)
        doc.rect(10, yAxis, 190, 4, "F");
        doc.setFont("", "", "bold");
        yAxis += 3;
        doc.text("JOVENES MUJERES", 15, yAxis);
        doc.text(`${countPersons("JOVEN_MUJER")}`, 80, yAxis);
        yAxis += 7;
        personas.map((persona) => {
            if(persona.persona.per_Categoria === "JOVEN_MUJER"){
                doc.text(`${index}.- ${persona.persona.per_Nombre} ${persona.persona.per_Apellido_Paterno} ${persona.persona.per_Apellido_Materno}`, 20, yAxis);
                yAxis+=5;
                index++;
            }
        })

        index = 1;
        yAxis += 7;
        doc.setFillColor(137, 213, 203) // Codigos de color RGB (red, green, blue)
        doc.rect(10, yAxis, 190, 4, "F");
        doc.setFont("", "", "bold");
        yAxis += 3;
        doc.text("NIÑOS", 15, yAxis);
        doc.text(`${countPersons("NIÑO")}`, 80, yAxis);
        yAxis += 7;
        personas.map((persona) => {
            if(persona.persona.per_Categoria === "NIÑO"){
                doc.text(`${index}.- ${persona.persona.per_Nombre} ${persona.persona.per_Apellido_Paterno} ${persona.persona.per_Apellido_Materno}`, 20, yAxis);
                yAxis+=5;
                index++;
            }
        })

        index = 1;
        yAxis += 7;
        doc.setFillColor(137, 213, 203) // Codigos de color RGB (red, green, blue)
        doc.rect(10, yAxis, 190, 4, "F");
        doc.setFont("", "", "bold");
        yAxis += 3;
        doc.text("NIÑAS", 15, yAxis);
        doc.text(`${countPersons("NIÑA")}`, 80, yAxis);
        yAxis += 7;
        personas.map((persona) => {
            if(persona.persona.per_Categoria === "NIÑA"){
                doc.text(`${index}.- ${persona.persona.per_Nombre} ${persona.persona.per_Apellido_Paterno} ${persona.persona.per_Apellido_Materno}`, 20, yAxis);
                yAxis+=5;
                index++;
            }
        })

        yAxis += 2;
        doc.rect(75, yAxis, 15, 4);
        yAxis += 3;
        doc.text("TOTAL DE PERSONAL NO BAUTIZADO:", 20, yAxis);
        doc.text(`${totalCount}`, 80, yAxis);

        yAxis += 25;
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


        doc.save("ReportePersonalNoBautizado.pdf");
    }
    return(
        <Layout>
            <Container>
                <Button className="btn-success m-3 " onClick={() => downloadTable()}><i className="fas fa-file-excel mr-2"></i>Descargar Excel</Button>
                <Button className="btn-danger m-3 " onClick={() => reportePersonalBautizadoPDF()}><i className="fas fa-file-pdf mr-2"></i>Descargar PDF</Button>
                <Card body>
                    <Row>
                        <Col lg="5">
                            <img src={logo} width="100%"></img> 
                        </Col>
                        <Col lg="7">
                            <CardTitle className="text-left" tag="h3">
                                REPORTE DE PERSONAL NO BAUTIZADO
                                <h5 className="mt-3"><strong>Distrito: </strong>{JSON.parse(localStorage.getItem("infoSesion")).dis_Alias}</h5>
                                {sector ? <h5 className="mt-3"><strong>Sector: </strong>{JSON.parse(localStorage.getItem("infoSesion")).sec_Alias}</h5> : null}
                            </CardTitle>
                        </Col>
                    </Row>
                    <CardBody>
                        <Button color="primary" size="lg" className="text-left mb-2" block id="jovenes_hombres">Jovenes hombres: {countPersons("JOVEN_HOMBRE")}</Button>
                        <UncontrolledCollapse defaultOpen toggler="#jovenes_hombres">
                            <Card>
                                <CardBody>
                                    <h5>
                                        <ol type="1">
                                        {personas.map((persona) => {
                                            if(persona.persona.per_Categoria === "JOVEN_HOMBRE"){
                                                return <li key={persona.persona.per_Id_Persona}>{persona.persona.per_Nombre} {persona.persona.per_Apellido_Paterno} {persona.persona.per_Apellido_Materno}</li>
                                            }
                                        })}
                                        </ol>
                                    </h5>
                                </CardBody>
                            </Card>
                        </UncontrolledCollapse>
                        <Button color="primary" size="lg" className="text-left mb-2" block id="jovenes_mujeres">Jovenes mujeres: {countPersons("JOVEN_MUJER")}</Button>
                        <UncontrolledCollapse defaultOpen toggler="#jovenes_mujeres">
                            <Card>
                                <CardBody>
                                    <h5>
                                        <ol type="1">
                                        {personas.map((persona) => {
                                            if(persona.persona.per_Categoria === "JOVEN_MUJER"){
                                                return <li key={persona.persona.per_Id_Persona}>{persona.persona.per_Nombre} {persona.persona.per_Apellido_Paterno} {persona.persona.per_Apellido_Materno}</li>
                                            }
                                        })}
                                        </ol>
                                    </h5>
                                </CardBody>
                            </Card>
                        </UncontrolledCollapse>
                        <Button color="primary" size="lg" className="text-left mb-2" block id="niños">Niños: {countPersons("NIÑO")}</Button>
                        <UncontrolledCollapse defaultOpen toggler="#niños">
                            <Card>
                                <CardBody>
                                    <h5>
                                        <ol type="1">
                                        {personas.map((persona) => {
                                            if(persona.persona.per_Categoria === "NIÑO"){
                                                return <li key={persona.persona.per_Id_Persona}>{persona.persona.per_Nombre} {persona.persona.per_Apellido_Paterno} {persona.persona.per_Apellido_Materno}</li>
                                            }
                                        })}
                                        </ol>
                                    </h5>
                                </CardBody>
                            </Card>
                        </UncontrolledCollapse>
                        <Button color="primary" size="lg" className="text-left mb-2" block id="niñas">Niñas: {countPersons("NIÑA")}</Button>
                        <UncontrolledCollapse defaultOpen toggler="#niñas">
                            <Card>
                                <CardBody>
                                    <h5>
                                        <ol type="1">
                                        {personas.map((persona) => {
                                            if(persona.persona.per_Categoria === "NIÑA"){
                                                return <li key={persona.persona.per_Id_Persona}>{persona.persona.per_Nombre} {persona.persona.per_Apellido_Paterno} {persona.persona.per_Apellido_Materno}</li>
                                            }
                                        })}
                                        </ol>
                                    </h5>
                                </CardBody>
                            </Card>
                        </UncontrolledCollapse>

                        <h4 className="text-right m-4">Total de personal no bautizado: <strong>{totalCount}</strong></h4>
                        <h4 className="text-center m-4">Justicia y Verdad</h4>
                        {sector ?
                            <h4 className="text-center m-4">{JSON.parse(localStorage.getItem("infoSesion")).sec_Alias} a <Moment locale="es" format="LL"></Moment></h4> :
                            <h4 className="text-center m-4">{JSON.parse(localStorage.getItem("infoSesion")).dis_Alias} a <Moment locale="es" format="LL"></Moment></h4>
                        }
                        <Row className="text-center mt-5">
                            <Col>
                                <h5 style={{height: "1.2em"}}></h5>
                                {/* <Input className="text-center" bsSize="sm" type="text" placeholder="Escriba nombre del secretario"></Input> */}
                                <hr color="black"></hr>
                                <h5>Secretario</h5>
                            </Col>
                            <Col cols="2"></Col>
                            <Col>
                                <h5>{JSON.parse(localStorage.getItem("infoSesion")).pem_Nombre}</h5>
                                <hr color="black"></hr>
                                {sector ? <h5>Pastor</h5> : <h5>Obispo</h5>}
                            </Col>
                        </Row>
                </CardBody>
                </Card>


                {/* TABLA */}
                <Card hidden body>
                <CardTitle className="text-center" tag="h3">
                    Reporte de Personal Bautizado
                    <h5>Distrito: {JSON.parse(localStorage.getItem("infoSesion")).dis_Alias}</h5>
                    {sector ? <h5>Sector: {JSON.parse(localStorage.getItem("infoSesion")).sec_Alias}</h5> : null}
                </CardTitle>
                <CardBody>
                    <Table responsive hover id="table1" data-cols-width="10,20,20,20,20,20">
                        <thead>
                            <tr>
                                <th data-f-bold>Indice</th>
                                <th data-f-bold>Nombre(s)</th>
                                <th data-f-bold>Apellido Paterno</th>
                                <th data-f-bold>Apellido Materno</th>
                                <th data-f-bold>Categoria</th>
                                <th data-f-bold>Telefono Movil</th>
                            </tr>
                        </thead>
                        <tbody>
                            {personas.map((persona, index) => (
                                <tr key={persona.persona.per_Id_Persona}>
                                    <td>{index + 1}</td>
                                    <td>{persona.persona.per_Nombre}</td>
                                    <td>{persona.persona.per_Apellido_Paterno}</td>
                                    <td>{persona.persona.per_Apellido_Materno}</td>
                                    <td>{persona.persona.per_Categoria}</td>
                                    <td>{persona.persona.per_Telefono_Movil}</td>
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
