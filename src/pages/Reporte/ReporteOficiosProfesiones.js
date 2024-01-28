import Layout from "../Layout";
import helpers from "../../components/Helpers";
import {
    Container, Button, FormGroup, Input,
    CardTitle, Card, CardBody, Table, UncontrolledCollapse, Row, Col, Modal, ModalBody
} from 'reactstrap';

import React, { useEffect, useState, } from 'react';
import TableToExcel from "@linways/table-to-excel";
import jsPDF from 'jspdf';
import Moment from "react-moment";
import moment from 'moment/min/moment-with-locales';
import 'moment/dist/locale/es'
import logo from '../../assets/images/IECE_LogoOficial.jpg'
import autoTable from 'jspdf-autotable'

export default function ReporteOficiosProfesiones() {
    //Estados
    const [personas, setPersonas] = useState([])
    const [infoDis, setInfoDis] = useState([])
    const [infoSec, setInfoSec] = useState([])
    const dto = JSON.parse(localStorage.getItem("dto"))
    const sector = JSON.parse(localStorage.getItem("sector"))
    const [infoSecretario, setInfoSecretario] = useState(null)
    const [sectores, setSectores] = useState([])
    const [lider, setLider] = useState("")
    const [sectorSeleccionado, setSectorSeleccionado] = useState(null)
    const [entidadTitulo, setEntidadTitulo] = useState("")
    const [mensajeDelProceso, setMensajeDelProceso] = useState("")
    const [modalShow, setModalShow] = useState(false)


    //Llamadas en render
    useEffect(() => {
        window.scrollTo(0, 0);
        if (sector == null) { //Si es Sesión de OBISPO

            getInfoDistrito()
            getPersonasDistrito()
            setSectorSeleccionado("todos");
            setLider("OBISPO")
            setEntidadTitulo("TODOS LOS SECTORES")

            helpers.validaToken().then(helpers.authAxios.get('/Sector/GetSectoresByDistrito/' + dto)
                .then(res => {
                    setSectores(res.data.sectores.filter(sec => sec.sec_Tipo_Sector == "SECTOR"))
                }))

            helpers.validaToken().then(helpers.authAxios.get("/PersonalMinisterial/GetSecretarioByDistrito/" + dto)
                .then(res => {
                    setInfoSecretario(res.data.infoSecretario.length > 0 ? res.data.infoSecretario[0].pem_Nombre : "")
                })
            );
        } else { //Si es Sesión de PASTOR
            getInfoDistrito()
            getPersonasSector(sector)
            setLider("PASTOR")

            helpers.validaToken().then(helpers.authAxios.get("/Sector/" + sector)
                .then(res => {
                    setInfoSec(res.data.sector[0])
                    const sectores = []
                    sectores.push(res.data.sector[0])
                    setSectores(sectores);
                    setSectorSeleccionado(sector)
                    setEntidadTitulo(sectores[0].sec_Tipo_Sector + " " + sectores[0].sec_Numero + " " + sectores[0].sec_Alias)
                })
            )

            helpers.validaToken().then(helpers.authAxios.get("/PersonalMinisterial/GetSecretarioBySector/" + sector)
                .then(res => {
                    setInfoSecretario(res.data.infoSecretario.length > 0 ? res.data.infoSecretario[0].pem_Nombre : "")
                })
            )

            getTitulo(sector)
        }
    }, [])

    const getPersonasSector = async (sec) => {
        setMensajeDelProceso("Procesando...")
        setModalShow(true)


        await helpers.validaToken().then(helpers.authAxios.get("/Persona/GetBySector/" + sec)
            .then(res => {
                console.log("Profesiones1: ", res.data.filter((per) => (per.persona.per_Activo === true && per.persona.profesionOficio1[0].pro_Sub_Categoria != 'OTRO')))
                setPersonas(res.data.filter((per) => (per.persona.per_Activo === true && per.persona.profesionOficio1[0].pro_Sub_Categoria != 'OTRO'))
                    .sort(function (a, b) {
                        if (a.persona.profesionOficio1[0].pro_Sub_Categoria < b.persona.profesionOficio1[0].pro_Sub_Categoria) { return -1; }
                        if (a.persona.profesionOficio1[0].pro_Sub_Categoria > b.persona.profesionOficio1[0].pro_Sub_Categoria) { return 1; }
                        return 0;
                    })
                )
                setMensajeDelProceso("")
                setModalShow(false)

            })
        );
    }


    const getInfoDistrito = () => {
        helpers.validaToken().then(helpers.authAxios.get("/Distrito/" + dto)
            .then(res => {
                setInfoDis(res.data)
            })
        )
    }


    const getPersonasDistrito = () => {
        setMensajeDelProceso("Procesando...")
        setModalShow(true)


        helpers.validaToken().then(helpers.authAxios.get("/Persona/GetByDistrito/" + dto)
            .then(res => {
                setPersonas(res.data
                    .filter(per => per.persona.per_Activo === true && per.persona.profesionOficio1[0].pro_Sub_Categoria != 'OTRO')
                    .sort(function (a, b) {
                        if (a.persona.profesionOficio1[0].pro_Sub_Categoria < b.persona.profesionOficio1[0].pro_Sub_Categoria) { return -1; }
                        if (a.persona.profesionOficio1[0].pro_Sub_Categoria > b.persona.profesionOficio1[0].pro_Sub_Categoria) { return 1; }
                        return 0;
                    })
                )
                setMensajeDelProceso("")
                setModalShow(false)

            })
        );
    }

    const handle_sectorSeleccionado = async (e) => {

        if (e.target.value !== "todos") {

            getPersonasSector(e.target.value)
            setSectorSeleccionado(e.target.value);
            getTitulo(e.target.value)
        } else {
            getPersonasDistrito();
            setSectorSeleccionado("todos");
            setEntidadTitulo("TODOS LOS SECTORES")
        }
    }

    const getTitulo = (sector) => {
        console.log("Sector: ", sectores);
        sectores.map(sec => {

            if (sec.sec_Id_Sector == sector) {
                setEntidadTitulo(sec.sec_Tipo_Sector + " " + sec.sec_Numero + ": " + sec.sec_Alias)
                //console.log("entidadTitulo: ",sec.sec_Tipo_Sector + " " + sec.sec_Numero + " " + sec.sec_Alias)
            }
        })
    }

    const downloadTable = () => {
        TableToExcel.convert(document.getElementById("table1"), {
            name: "Personal_Oficios_y_Profesiones.xlsx",
            sheet: {
                name: "Hoja 1"
            }
        });
    }

    let totalCount = 0;

    const countPersons = (type) => {
        let count = 0
        personas.map(persona => {
            if (persona.persona.per_Categoria === type) {
                count += 1
            }
        })
        totalCount += count;
        return count
    }
    const reportePersonalBautizadoPDF = () => {
        totalCount = 0
        let index = 1
        // INSTANCIA NUEVO OBJETO PARA CREAR PDF
        const doc = new jsPDF("lanscape", "mm", "letter");

        doc.addImage(logo, 'PNG', 10, 5, 70, 20);
        doc.text("LISTA PROFESIONES Y OFICIOS", 165, 10, { align: "center" });
        doc.setFontSize(10);

        if (sector) {
            doc.text(entidadTitulo, 165, 22, { align: "center" });
            //doc.text(`AL DÍA ${moment().format('LL').toUpperCase()}`, 135, 23, {align:"center"});
        }
        else {
            doc.text(`${infoDis.dis_Tipo_Distrito} ${infoDis.dis_Numero}: ${infoDis.dis_Alias}`, 165, 17, { align: "center" })
            doc.text(entidadTitulo, 165, 22, { align: "center" })
            //doc.text(`AL DÍA ${moment().format('LL').toUpperCase()}`, 135, 23, {align:"center"});
        }
        doc.line(10, 32, 270, 32);
        let yAxis = 34

        doc.setFontSize(8);
        const headers = [
            'Indice',
            'Nombre',
            'Grupo',
            'Profesion_Oficio_1',
            'Profesion_Oficio_2',
            'Tel_Celular',
            'Email',
        ]

        const data = personas.map((persona, index) => ([
            String(index + 1),
            persona.persona.apellidoPrincipal + ' ' + (persona.persona.per_Apellido_Materno ? persona.persona.per_Apellido_Materno : "") + " " + persona.persona.per_Nombre,
            persona.persona.per_Bautizado ? "Bautizado".toUpperCase() : "No Bautizado".toUpperCase(),
            String(persona.persona.profesionOficio1[0].pro_Sub_Categoria != 'OTRO' ? persona.persona.profesionOficio1[0].pro_Sub_Categoria : '-'),
            String(persona.persona.profesionOficio2[0].pro_Sub_Categoria != 'OTRO' ? persona.persona.profesionOficio2[0].pro_Sub_Categoria : '-'),
            String(persona.persona.per_Telefono_Movil ? persona.persona.per_Telefono_Movil : '-'),
            String(persona.persona.per_Email_Personal ? persona.persona.per_Email_Personal : '-')
        ]))
        console.log("data: ", data)
        console.log("datatable: ", Object.values(data))
        //doc.table(10, 35, data, headers, {autoSize:true, fontSize: 6.5, padding:1})
        //doc.table(10, 35, data, headers, { margin, fontSize: 6, padding: 1 })
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
                headStyles: { fillColor: [196, 229, 252], halign: "center" },
                bodyStyles: { fontSize: 6 },
            })
        //yAxis += data.length * 8
        yAxis = doc.previousAutoTable.finalY;


        yAxis = 35 + data.length * 7 + 5
        doc.setFontSize(8);

        if (yAxis > 230) {
            doc.addPage()
            yAxis = 10
        }


        //yAxis += 20;
        doc.text(`JUSTICIA Y VERDAD`, 90, yAxis);
        yAxis += 5;
        doc.text(`AL DÍA ${moment().format('LL').toUpperCase()}`, 85, yAxis);

        yAxis += 35;
        doc.line(30, yAxis, 90, yAxis);
        doc.line(120, yAxis, 180, yAxis);
        yAxis += 3;
        doc.text("SECRETARIO", 51, yAxis);
        doc.text(lider, 145, yAxis);
        yAxis -= 5;
        doc.text(`${infoSecretario}`, 40, yAxis);
        doc.text(`${JSON.parse(localStorage.getItem("infoSesion")).pem_Nombre}`, 130, yAxis);


        doc.save("ReporteOficiosProfesiones.pdf");
    }
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
                                <option value="1">{`${infoDis.dis_Tipo_Distrito} ${infoDis.dis_Numero}: ${infoDis.dis_Alias}`}</option>
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
                                value={sectorSeleccionado}
                                onChange={handle_sectorSeleccionado}
                            >
                                <option value="0">Selecciona un sector</option>

                                {sectores.map(sector => {
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

                                <FormGroup>
                                    <Row>
                                        <h1></h1>
                                    </Row>
                                </FormGroup>
                                {/* {sector?(sector ? <h5>{infoSec.sec_Alias}</h5> : null):(dto ? <h5>{infoDis.dis_Alias}</h5> : null)} */}
                                <h5>{entidadTitulo}</h5>

                                {/* {sector ? <h5>{infoSec}</h5> : null} */}

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
                                        <td>{persona.persona.apellidoPrincipal} {persona.persona.per_Apellido_Materno} {persona.persona.per_Nombre}</td>
                                        <td>{persona.persona.per_Bautizado ? "Bautizado".toUpperCase() : "No Bautizado".toUpperCase()}</td>
                                        <td>{persona.persona.profesionOficio1[0].pro_Sub_Categoria == 'OTRO' ? ' ' : persona.persona.profesionOficio1[0].pro_Sub_Categoria}</td>
                                        <td>{persona.persona.profesionOficio2[0].pro_Sub_Categoria == 'OTRO' ? ' ' : persona.persona.profesionOficio2[0].pro_Sub_Categoria}</td>
                                        <td>{persona.persona.per_Telefono_Movil}</td>
                                        <td>{persona.persona.per_Email_Personal}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </CardBody>
                </Card>
            </Container>
            {/*Modal success*/}
            <Modal isOpen={modalShow}>
                {/* <ModalHeader>
                        Solo prueba.
                    </ModalHeader> */}
                <ModalBody>
                    {mensajeDelProceso}
                </ModalBody>
                {/* <ModalFooter>
                        <Button color="secondary" onClick={this.handle_modalClose}>Cancel</Button>
                    </ModalFooter> */}
            </Modal>

        </>
    )
}
