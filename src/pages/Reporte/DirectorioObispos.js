import Layout from "../Layout";
import helpers from "../../components/Helpers";
import {
    Container, Button,
    CardTitle, Card, CardBody, Table, Row, Col,
    FormGroup, Input, CardHeader
} from 'reactstrap';
import ReactModal from 'react-modal';
import React, { useEffect, useState, useRef } from 'react';
import TableToExcel from "@linways/table-to-excel";
import jsPDF from 'jspdf';
import moment from 'moment/min/moment-with-locales';
import 'moment/dist/locale/es'
import logo from '../../assets/images/IECE_LogoOficial.jpg'
import autoTable from 'jspdf-autotable'

export default function DirectorioObispos() {
    //Estados
    //const [comisiones, setComisiones] = useState([])
    //const [personalAdministrativo, setPersonalAdministrativo] = useState([])
    const [infoDis, setInfoDis] = useState([])
    const [infoSec, setInfoSec] = useState([])
    const dto = JSON.parse(localStorage.getItem("dto"))
    const sector = JSON.parse(localStorage.getItem("sector"))
    const [directorioObispos, setDirectorioObispos] = useState([])
    const [mensajeDelProceso, setMensajeDelProceso] = useState("")
    const [modalShow, setModalShow] = useState(false)
    const elementToFocus = useRef(null);

    //Llamadas en render

    useEffect(() => {
        window.scrollTo(0, 0)
        if (elementToFocus.current) {
            elementToFocus.current.focus();
        }
    }, [])


    useEffect(() => {

        if (sector == null) { //Para Sesión Obispo
            console.log("inicia programa")
            getDirectorioObispos()
        }
    }, [])


    const getDirectorioObispos = async () => {
        try {
            //setMensajeDelProceso("Procesando...")
            //setModalShow(true)

            await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/PersonalMinisterial/GetDirectorioObispos`)
                .then(res => {
                    console.log("REspuesta: ", res.data.directorio)
                    if (res.data.status === "success") {
                        setDirectorioObispos(res.data.directorio)
                        //setMensajeDelProceso("")
                        //setModalShow(false)
                    }
                    else {
                        alert(res.data.mensaje)
                    }
                }))
        }
        catch {
            alert("ERROR!\nOcurrio un problema al consultar la información, cierre la aplicación y vuelva a intentar.")
        }
    }

    const downloadTable = () => {
        //const table1 = document.getElementById("table1");
        //const book = TableToExcel.tableToBook(table1, { sheet: { name: "Directorio de Obispos" } });
        //TableToExcel.save(book, "Directorio de Obispos.xlsx")

        TableToExcel.convert(document.getElementById("table1"), {
            name: "Directorio de Obispos.xlsx",
            sheet: {
                name: "Hoja 1"
            }
        });
    };

    const reportePersonalBautizadoPDF = () => {
        let index = 1
        // INSTANCIA NUEVO OBJETO PARA CREAR PDF
        const doc = new jsPDF("landscape", "mm", "letter");
        let pageHeight = doc.internal.pageSize.height;
        doc.addImage(logo, 'PNG', 10, 5, 70, 20);
        doc.text("DIRECTORIO DE OBISPOS", 165, 15, { align: "center", maxWidth: 110 });
        doc.setFontSize(10);
        doc.text(`(AL DÍA ${moment().format('LL').toUpperCase()})`, 165, 22, { align: 'center' });

        let yAxis = 22
        index = 1;
        yAxis += 4;
        doc.setFontSize(10);
        doc.setFont("", "", "bold");

        const headers = [
            'ENTIDAD',
            'BASE',
            'OBISPO/MISIONERO',
            'TEL.TEMPLO',
            'CEL-1',
            'CEL-2',
            'E-MAIL',
        ]

        const data = directorioObispos.map((distrito) => ([
            String(distrito.dis_Tipo_Distrito + ' ' + distrito.dis_Numero),
            String(`${distrito.dis_Alias} `),
            String(`${distrito.pem_Nombre} `),
            String(`${distrito.tem_Telefono ? distrito.tem_Telefono : ""} `),
            String(`${distrito.pem_Cel1 ? distrito.pem_Cel1 : ""} `),
            String(`${distrito.pem_Cel2 ? distrito.pem_Cel2 : ""} `),
            String(`${distrito.pem_emailIECE ? distrito.pem_emailIECE : ""} `)
        ]))

        autoTable(doc,
            {
                head: [headers],
                body: Object.values(data),
                theme: "plain",
                startY: yAxis,
                margin: { left: 10 },
                styles: {
                    lineColor: [44, 62, 80],
                    lineWidth: .1,
                },
                headStyles: { fillColor: [4, 153, 173], halign: "center" },
                bodyStyles: { fontSize: 6 },
            })
        //yAxis += data.length * 8
        yAxis = doc.previousAutoTable.finalY;

        yAxis += 5;
        index++;
        if (yAxis >= pageHeight - 10) {
            doc.addPage();
            yAxis = 15 // Restart height position
        }

        doc.save("Directorio de Obispos.pdf");
    }

    return (
        <>
            <Container lg>

                {/*BOTONES PARA DESCARGA DE DOCUMENTOS IMRIMIBLES */}
                <Button className="btn-success m-3 " onClick={() => downloadTable()}><i className="fas fa-file-excel mr-2"></i>Descargar Excel</Button>
                <Button className="btn-danger m-3 " onClick={() => reportePersonalBautizadoPDF()}><i className="fas fa-file-pdf mr-2"></i>Descargar PDF</Button>

                {/*CABECERA DE LA LISTA INCLUYE EL LOGO*/}
                <Card body>
                    <Row>
                        <Col lg="5">
                            <img src={logo} alt="Logo" width="100%" className="ml-3"></img>
                        </Col>
                        <Col lg="6" className="d-flex align-items-center justify-content-center">
                            <CardTitle className="text-center " tag="h3">
                                DIRECTORIO DE OBISPOS
                            </CardTitle>
                        </Col>
                    </Row>
                    <CardBody>
                        <>
                            <Card>
                                {directorioObispos.length > 0 ?
                                    <CardBody>

                                        <Table className="table table-striped table-bordered table-sm" data-cols-width="25,60,40,25,25,25,25">
                                            <thead className="text-center bg-gradient-info " >
                                                <tr >
                                                    <th width="15%">ENTIDAD</th>
                                                    <th width="40%">BASE</th>
                                                    <th width="35%">OBISPO</th>
                                                    <th width="20%">TEL. TEMPLO</th>
                                                    <th width="12%">CEL. 1</th>
                                                    <th width="12%">CEL. 2</th>
                                                    <th width="15%">E-MAIL</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {directorioObispos.map((distrito, index) => {
                                                    return <tr key={distrito.dis_Id_Distrito}>
                                                        <td>{distrito.dis_Tipo_Distrito} {distrito.dis_Numero} </td>
                                                        <td>{distrito.dis_Alias}</td>
                                                        <td>{distrito.pem_Nombre}</td>
                                                        <td>{distrito.tem_Telefono}</td>
                                                        <td>{distrito.pem_Cel1}</td>
                                                        <td>{distrito.pem_Cel2}</td>
                                                        <td>{distrito.pem_emailIECE}</td>
                                                    </tr>
                                                })}
                                            </tbody>
                                        </Table>
                                    </CardBody>
                                    : <CardBody>Parece que no tiene permisos para mostrarse el contenido</CardBody>}
                            </Card>
                            <br>
                            </br>
                        </>

                    </CardBody>
                </Card>


                {/* TABLA PARA EXCEL */}
                <Card hidden body>
                    <CardTitle className="text-center" tag="h3">
                        Reporte de Visitantes
                        <h5>Distrito: {JSON.parse(localStorage.getItem("infoSesion")).dis_Alias}</h5>
                        {sector ? <h5>Sector: {JSON.parse(localStorage.getItem("infoSesion")).sec_Alias}</h5> : null}
                    </CardTitle>
                    <CardBody>
                        <Table responsive hover id="table1" data-cols-width="15%, 50%, 35%, 20%, 20%, 20%, 25%">
                            <thead className="text-center bg-gradient-info">
                                <tr>
                                    <th >ENTIDAD</th>
                                    <th >BASE</th>
                                    <th >OBISPO</th>
                                    <th >TEL. TEMPLO</th>
                                    <th >CEL.1</th>
                                    <th >CEL. 2</th>
                                    <th >E-MAIL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {directorioObispos.map((distrito, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{distrito.dis_Tipo_Distrito} {distrito.dis_Numero}</td>
                                            <td>{distrito.dis_Alias}</td>
                                            <td>{distrito.pem_Nombre}</td>
                                            <td>{distrito.tem_Telefono}</td>
                                            <td>{distrito.pem_Cel1}</td>
                                            <td>{distrito.pem_Cel2}</td>
                                            <td>{distrito.pem_emailIECE}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </CardBody>
                </Card>
            </Container >
            {/*Modal success*/}
            <ReactModal
                isOpen={modalShow}
                style={helpers.modalDeCarga}
            >
                {mensajeDelProceso}
            </ReactModal>

        </>
    )
}
