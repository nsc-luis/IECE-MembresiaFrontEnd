import Layout from "../Layout";
import helpers from "../../components/Helpers";
import {
    Container, Row, Col, Form, FormGroup, Input, Button,
    FormFeedback, CardTitle, Card, CardBody, CardHeader, CardText, Label, Alert, Table
} from 'reactstrap';

import React, { Component, useEffect, useState, useRef } from 'react';
import TableToExcel from "@linways/table-to-excel";


export default function ReportePersonalBautizado(){
    //Estados
    const [personas, setPersonas] = useState([])
    const dto = JSON.parse(localStorage.getItem("dto"))
    const sector = JSON.parse(localStorage.getItem("sector"))

    //dataExcel
    const dataSet = [
        {
            columns: [
                "Name",
                "Nombre(s)",
                "Apellido Paterno",
                "Apellido Materno",
                "Categoria",
                "RFC",
                "Telefono Movil",
                "Sector",
            ],
            data: personas
        }
    ];

    //Llamadas en render
    useEffect(() => {
        if(sector == null){
            helpers.authAxios.get("/Persona/GetByDistrito/" + dto)
                .then(res => {
                    setPersonas(res.data.filter(persona => persona.persona.per_Bautizado))
                    console.log("OBISPO")
                    console.log(personas)
                });
        }else{
            helpers.authAxios.get("/Persona/GetBySector/" + sector)
            .then(res => {
                setPersonas(res.data.filter(persona => persona.persona.per_Bautizado))
                console.log("PASTOR")
                console.log(personas)
            });
        }

        const mappedPersonas = personas.map(persona => ({
            per_Id_Persona: persona.per_Id_Persona,
            per_Nombre: persona.per_Nombre,
            per_Apellido_Paterno: persona.per_Apellido_Paterno,
            per_Apellido_Materno: persona.per_Apellido_Materno,
            per_Categoria: persona.per_Categoria,
            per_RFC_Sin_Homo: persona.per_RFC_Sin_Homo,
            per_Telefono_Movil: persona.per_Telefono_Movil,
            sec_Alias: persona.sec_Alias
        }))
        console.log(mappedPersonas)
    }, [personas.length])

    const downloadTable = () =>{
        TableToExcel.convert(document.getElementById("table1"), {
            name: "Personal_Bautizado.xlsx",
            sheet: {
              name: "Hoja 1"
            }
          });
    }
    return(
        <Layout>
            <Container>
            <Button className="btn-success m-3 " onClick={() => downloadTable()}><i className="fas fa-file-excel mr-2"></i>Descargar Excel</Button>
                <Card body>
                <CardTitle className="text-center" tag="h4">
                    Reporte de Personal Bautizado
                </CardTitle>
                <CardBody>
                    <Table responsive hover id="table1" data-cols-width="10,20,20,20,20,20,20,30">
                        <thead>
                            <tr>
                                <th data-f-bold>ID</th>
                                <th data-f-bold>Nombre(s)</th>
                                <th data-f-bold>Apellido Paterno</th>
                                <th data-f-bold>Apellido Materno</th>
                                <th data-f-bold>Categoria</th>
                                <th data-f-bold>RFC</th>
                                <th data-f-bold>Telefono Movil</th>
                                <th data-f-bold>Sector</th>
                            </tr>
                        </thead>
                        <tbody>
                            {personas.map(persona => (
                                <tr key={persona.persona.per_Id_Persona}>
                                    <td>{persona.persona.per_Id_Persona}</td>
                                    <td>{persona.persona.per_Nombre}</td>
                                    <td>{persona.persona.per_Apellido_Paterno}</td>
                                    <td>{persona.persona.per_Apellido_Materno}</td>
                                    <td>{persona.persona.per_Categoria}</td>
                                    <td>{persona.persona.per_RFC_Sin_Homo}</td>
                                    <td>{persona.persona.per_Telefono_Movil}</td>
                                    <td>{persona.persona.sec_Alias}</td>
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
