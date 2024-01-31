import helpers from "../../components/Helpers";
import {
    Container, Button, FormGroup, Input,
    CardTitle, Card, CardBody, Table, UncontrolledCollapse, Row, Col, Modal, ModalBody
} from 'reactstrap';

import React, { useEffect, useState, } from 'react';
import TableToExcel from "@linways/table-to-excel";
import jsPDF from 'jspdf';
import moment from 'moment/min/moment-with-locales';
import 'moment/dist/locale/es'
import logo from '../../assets/images/IECE_LogoOficial.jpg'

export default function ReportePersonalNoBautizado() {
    //Estados
    const [personas, setPersonas] = useState([])
    const [infoSecretario, setInfoSecretario] = useState({})
    const [infoDis, setInfoDis] = useState([])
    const [infoSec, setInfoSec] = useState([])
    const dto = JSON.parse(localStorage.getItem("dto"))
    const sector = JSON.parse(localStorage.getItem("sector"))
    const [sectores, setSectores] = useState([])
    const [sectorSeleccionado, setSectorSeleccionado] = useState(null)
    const [entidadTitulo, setEntidadTitulo] = useState("")
    const [lider, setLider] = useState("")
    const [mensajeDelProceso, setMensajeDelProceso] = useState("")
    const [modalShow, setModalShow] = useState(false)

    //Llamadas en render

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {

        if (sector === null) {
            setSectorSeleccionado("todos");
            getPersonasDistrito();
            setLider("OBISPO")
            setEntidadTitulo("TODOS LOS SECTORES")
            getInfoDistrito()

            helpers.validaToken().then(helpers.authAxios.get('/Sector/GetSectoresByDistrito/' + dto)
                .then(res => {
                    setSectores(res.data.sectores.filter(sec => sec.sec_Tipo_Sector === "SECTOR"))
                })
            )

            helpers.validaToken().then(helpers.authAxios.get("/PersonalMinisterial/GetSecretarioByDistrito/" + dto)
                .then(res => {
                    setInfoSecretario(res.data.infoSecretario.length > 0 ? res.data.infoSecretario[0].pem_Nombre : "")
                })
            );
        } else {

            getInfoDistrito()
            getPersonasSector(sector)
            setLider("PASTOR")


            helpers.validaToken().then(helpers.authAxios.get("/Sector/" + sector)
                .then(res => {
                    setInfoSec(res.data.sector[0])
                    const sectores = []
                    sectores.push(res.data.sector[0])
                    //console.log("sectores: ", sectores)
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
        }
    }, [])

    const getInfoDistrito = () => {
        console.log("Dto: ", dto)
        helpers.validaToken().then(helpers.authAxios.get("/Distrito/" + dto)
            .then(res => {
                setInfoDis(res.data)
                console.log("Distrito: ", res.data)
            })
        )
    }

    const getPersonasDistrito = () => {
        setMensajeDelProceso("Procesando...")
        setModalShow(true)


        helpers.validaToken().then(helpers.authAxios.get("/Persona/GetByDistrito/" + dto)
            .then(res => {
                setPersonas(res.data.filter(persona => persona.persona.per_Bautizado === false && persona.persona.per_En_Comunion === false && persona.persona.per_Activo)
                    .sort(function (a, b) {
                        if (a.persona.apellidoPrincipal < b.persona.apellidoPrincipal) { return -1; }
                        if (a.persona.apellidoPrincipal > b.persona.apellidoPrincipal) { return 1; }
                        return 0;
                    }))
                setMensajeDelProceso("")
                setModalShow(false)

            })
        );
    }

    const getPersonasSector = (sec) => {
        setMensajeDelProceso("Procesando...")
        setModalShow(true)


        helpers.validaToken().then(helpers.authAxios.get("/Persona/GetBySector/" + sec)
            .then(res => {
                setPersonas(res.data.filter(persona => (
                    persona.persona.per_Bautizado === false && persona.persona.per_En_Comunion === false && persona.persona.per_Activo))
                    .sort(function (a, b) {
                        if (a.persona.apellidoPrincipal < b.persona.apellidoPrincipal) { return -1; }
                        if (a.persona.apellidoPrincipal > b.persona.apellidoPrincipal) { return 1; }
                        return 0;
                    }))
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

            if (sec.sec_Id_Sector === sector) {
                setEntidadTitulo(sec.sec_Tipo_Sector + " " + sec.sec_Numero + ": " + sec.sec_Alias)
                //console.log("entidadTitulo: ",sec.sec_Tipo_Sector + " " + sec.sec_Numero + " " + sec.sec_Alias)
            }
        })
    }

    const downloadTable = () => {

        TableToExcel.convert(document.getElementById("table1"), {
            name: "Personal_No_Bautizado.xlsx",
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
        const doc = new jsPDF("p", "mm", "letter");
        let pageHeight = doc.internal.pageSize.height;

        doc.addImage(logo, 'PNG', 10, 5, 70, 20);
        doc.text("LISTA DE PERSONAL NO BAUTIZADO", 85, 10);

        doc.setFontSize(10);
        if (sector) {
            doc.text(entidadTitulo, 140, 22, { align: "center" });
            // doc.text(`AL DÍA ${moment().format('LL').toUpperCase()}`, 135, 23, {align:"center"});
        }
        else {
            doc.text(`${infoDis.dis_Tipo_Distrito} ${infoDis.dis_Numero}: ${infoDis.dis_Alias}`, 140, 17, { align: "center" })
            doc.text(entidadTitulo, 140, 22, { align: "center" })
            // doc.text(`AL DÍA ${moment().format('LL').toUpperCase()}`, 135, 23, {align:"center"});
        }
        doc.line(10, 32, 200, 32);
        doc.setFontSize(8);
        let yAxis = 35
        doc.setFillColor(191, 201, 202) // Codigos de color RGB (red, green, blue)
        doc.rect(10, yAxis, 190, 4, "F");
        doc.setFont("", "", "bold");
        yAxis += 3;
        doc.text("JOVENES HOMBRES", 15, yAxis);
        doc.text(`${countPersons("JOVEN_HOMBRE")}`, 80, yAxis);
        yAxis += 7;
        personas.map((persona) => {
            if (persona.persona.per_Categoria === "JOVEN_HOMBRE") {
                doc.text(`${index}.- ${persona.persona.per_Apellido_Paterno} ${persona.persona.per_Apellido_Materno ? persona.persona.per_Apellido_Materno : ''} ${persona.persona.per_Nombre}`, 20, yAxis);
                yAxis += 4;
                index++;
                if (yAxis >= pageHeight - 10) {
                    doc.addPage();
                    yAxis = 15 // Restart height position
                }
            }
        })

        index = 1;
        yAxis += 7;
        doc.setFillColor(191, 201, 202) // Codigos de color RGB (red, green, blue)
        doc.rect(10, yAxis, 190, 4, "F");
        doc.setFont("", "", "bold");
        yAxis += 3;
        doc.text("JOVENES MUJERES", 15, yAxis);
        doc.text(`${countPersons("JOVEN_MUJER")}`, 80, yAxis);
        yAxis += 7;
        personas.map((persona) => {
            if (persona.persona.per_Categoria === "JOVEN_MUJER") {
                doc.text(`${index}.- ${persona.persona.per_Apellido_Paterno} ${persona.persona.per_Apellido_Materno ? persona.persona.per_Apellido_Materno : ''} ${persona.persona.per_Nombre}`, 20, yAxis);
                yAxis += 4;
                index++;
                if (yAxis >= pageHeight - 10) {
                    doc.addPage();
                    yAxis = 15 // Restart height position
                }
            }
        })

        index = 1;
        yAxis += 7;
        doc.setFillColor(191, 201, 202) // Codigos de color RGB (red, green, blue)
        doc.rect(10, yAxis, 190, 4, "F");
        doc.setFont("", "", "bold");
        yAxis += 3;
        doc.text("NIÑOS", 15, yAxis);
        doc.text(`${countPersons("NIÑO")}`, 80, yAxis);
        yAxis += 7;
        personas.map((persona) => {
            if (persona.persona.per_Categoria === "NIÑO") {
                doc.text(`${index}.- ${persona.persona.per_Apellido_Paterno} ${persona.persona.per_Apellido_Materno ? persona.persona.per_Apellido_Materno : ''} ${persona.persona.per_Nombre}`, 20, yAxis);
                yAxis += 4;
                index++;
                if (yAxis >= pageHeight - 10) {
                    doc.addPage();
                    yAxis = 15 // Restart height position
                }
            }
        })

        index = 1;
        yAxis += 7;
        doc.setFillColor(191, 201, 202) // Codigos de color RGB (red, green, blue)
        doc.rect(10, yAxis, 190, 4, "F");
        doc.setFont("", "", "bold");
        yAxis += 3;
        doc.text("NIÑAS", 15, yAxis);
        doc.text(`${countPersons("NIÑA")}`, 80, yAxis);
        yAxis += 7;
        personas.map((persona) => {
            if (persona.persona.per_Categoria === "NIÑA") {
                doc.text(`${index}.- ${persona.persona.per_Apellido_Paterno} ${persona.persona.per_Apellido_Materno ? persona.persona.per_Apellido_Materno : ''} ${persona.persona.per_Nombre}`, 20, yAxis);
                yAxis += 4;
                index++;
                if (yAxis >= pageHeight - 10) {
                    doc.addPage();
                    yAxis = 15 // Restart height position
                }
            }
        })

        yAxis += 2;
        doc.rect(75, yAxis, 15, 4);
        yAxis += 3;
        if (yAxis >= pageHeight - 30) {
            doc.addPage();
            yAxis = 15 // Restart height position
        }

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
        doc.text(lider, 145, yAxis);
        yAxis -= 5;
        doc.text(`${JSON.parse(localStorage.getItem("infoSesion")).pem_Nombre}`, 130, yAxis);
        doc.text(`${infoSecretario}`, 40, yAxis);


        doc.save("ReportePersonalNoBautizado.pdf");
    }
    return (
        <>
            <Container lg>
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
                <Card body>
                    <Row>
                        <Col lg="5"  >
                            <img src={logo} alt="Logo" width="100%" className="ml-3"></img>
                        </Col>
                        <Col lg="6">
                            <CardTitle className="text-center" tag="h3">
                                LISTA DE PERSONAL NO BAUTIZADO
                                <FormGroup>
                                    <Row>
                                        <h1></h1>
                                    </Row>
                                </FormGroup>

                                <h5>{entidadTitulo}</h5>
                            </CardTitle>
                        </Col>
                    </Row>
                    <CardBody>
                        <Button size="lg" className="text-left categoriasReportes" block id="jovenes_hombres">Jovenes hombres: {countPersons("JOVEN_HOMBRE")}</Button>
                        <UncontrolledCollapse defaultOpen toggler="#jovenes_hombres">
                            <Card>
                                <CardBody>
                                    <h5>
                                        <ol type="1">
                                            {personas.map((persona) => {
                                                if (persona.persona.per_Categoria === "JOVEN_HOMBRE") {
                                                    return <li key={persona.persona.per_Id_Persona}>{persona.persona.per_Apellido_Paterno} {persona.persona.per_Apellido_Materno} {persona.persona.per_Nombre} </li>
                                                } else { return null }
                                            })}
                                        </ol>
                                    </h5>
                                </CardBody>
                            </Card>
                        </UncontrolledCollapse>
                        <Button size="lg" className="text-left mt-2 categoriasReportes" block id="jovenes_mujeres">Jovenes mujeres: {countPersons("JOVEN_MUJER")}</Button>
                        <UncontrolledCollapse defaultOpen toggler="#jovenes_mujeres">
                            <Card>
                                <CardBody>
                                    <h5>
                                        <ol type="1">
                                            {personas.map((persona) => {
                                                if (persona.persona.per_Categoria === "JOVEN_MUJER") {
                                                    return <li key={persona.persona.per_Id_Persona}>{persona.persona.per_Apellido_Paterno} {persona.persona.per_Apellido_Materno} {persona.persona.per_Nombre} </li>
                                                } else { return null }
                                            })}
                                        </ol>
                                    </h5>
                                </CardBody>
                            </Card>
                        </UncontrolledCollapse>
                        <Button size="lg" className="text-left mt-2 categoriasReportes" block id="niños">Niños: {countPersons("NIÑO")}</Button>
                        <UncontrolledCollapse defaultOpen toggler="#niños">
                            <Card>
                                <CardBody>
                                    <h5>
                                        <ol type="1">
                                            {personas.map((persona) => {
                                                if (persona.persona.per_Categoria === "NIÑO") {
                                                    return <li key={persona.persona.per_Id_Persona}>{persona.persona.per_Apellido_Paterno} {persona.persona.per_Apellido_Materno} {persona.persona.per_Nombre} </li>
                                                } else { return null }
                                            })}
                                        </ol>
                                    </h5>
                                </CardBody>
                            </Card>
                        </UncontrolledCollapse>
                        <Button size="lg" className="text-left mt-2 categoriasReportes" block id="niñas">Niñas: {countPersons("NIÑA")}</Button>
                        <UncontrolledCollapse defaultOpen toggler="#niñas">
                            <Card>
                                <CardBody>
                                    <h5>
                                        <ol type="1">
                                            {personas.map((persona) => {
                                                if (persona.persona.per_Categoria === "NIÑA") {
                                                    return <li key={persona.persona.per_Id_Persona}>{persona.persona.per_Apellido_Paterno} {persona.persona.per_Apellido_Materno} {persona.persona.per_Nombre} </li>
                                                } else { return null }
                                            })}
                                        </ol>
                                    </h5>
                                </CardBody>
                            </Card>
                        </UncontrolledCollapse>

                        <h4 className="text-right m-4">Total de personal no bautizado: <strong>{totalCount}</strong></h4>
                        <h4 className="text-center m-4">Justicia y Verdad</h4>
                        <h4 className="text-center m-4">a {moment().format('LL')}</h4>
                        <Row className="text-center mt-5">
                            <Col xs="1"></Col>
                            <Col xs="4">
                                {/* <h5 style={{height: "1.2em"}}></h5> */}
                                <h5>{`${infoSecretario}`}</h5>
                                <hr color="black"></hr>
                                <h5>Secretario</h5>
                            </Col>
                            <Col cols="2"></Col>
                            <Col xs="4">
                                <h5>{JSON.parse(localStorage.getItem("infoSesion")).pem_Nombre}</h5>
                                <hr color="black"></hr>
                                {sector ? <h5>Pastor</h5> : <h5>Obispo</h5>}
                            </Col >
                            <Col xs="1"></Col>
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
                        <Table responsive hover id="table1" data-cols-width="10,20,20,20,20,20,20">
                            <thead>
                                <tr>
                                    <th data-f-bold>Indice</th>
                                    <th data-f-bold>Nombre(s)</th>
                                    <th data-f-bold>Apellido Paterno</th>
                                    <th data-f-bold>Apellido Materno</th>
                                    <th data-f-bold>Categoria</th>
                                    <th data-f-bold>Telefono Movil</th>
                                    <th data-f-bold>Fecha Nacimiento</th>
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
                                        <td>{moment(persona.persona.per_Fecha_Nacimiento).format("YYYY-MM-DD")}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </CardBody>
                </Card>
            </Container>
            {/*Modal success*/}
            <Modal isOpen={modalShow}>
                <ModalBody>
                    {mensajeDelProceso}
                </ModalBody>
            </Modal>

        </>
    )
}
