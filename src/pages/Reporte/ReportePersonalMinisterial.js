import Layout from "../Layout";
import helpers from "../../components/Helpers";
import {
    Container, Button,
    CardTitle, Card, CardBody, Table, UncontrolledCollapse, Row, Col,
    FormGroup, Input, Modal, ModalBody
} from 'reactstrap';
import ReactModal from 'react-modal';
import React, { useEffect, useState, } from 'react';
import TableToExcel from "@linways/table-to-excel";
import jsPDF from 'jspdf';
import moment from 'moment/min/moment-with-locales';
import 'moment/dist/locale/es'
import logo from '../../assets/images/IECE_LogoOficial.jpg'

export default function ReportePersonalBautizado() {
    //Estados
    const [personas, setPersonas] = useState([])
    const [infoDis, setInfoDis] = useState([])
    const [infoSec, setInfoSec] = useState([])
    const [infoSecretario, setInfoSecretario] = useState({})
    const dto = JSON.parse(localStorage.getItem("dto"))
    const sector = JSON.parse(localStorage.getItem("sector"))
    const [sectores, setSectores] = useState([])
    const [sectorSeleccionado, setSectorSeleccionado] = useState(null)
    const [entidadTitulo, setEntidadTitulo] = useState("")
    const [lider, setLider] = useState("")
    const [personalMinisterial, setPersonalMinisterial] = useState([])
    const [mensajeDelProceso, setMensajeDelProceso] = useState("")
    const [modalShow, setModalShow] = useState(false)


    //Llamadas en render
    useEffect(() => {
        window.scrollTo(0, 0)

        if (sector == null) { //Para Sesión Obispo
            getPersonalMinisterialDistrito();
            getInfoDistrito()
            setSectorSeleccionado("todos");
            setLider("OBISPO")
            setEntidadTitulo("TODOS LOS SECTORES")


            helpers.validaToken().then(helpers.authAxios.get('/Sector/GetSectoresByDistrito/' + dto)
                .then(res => {
                    setSectores(res.data.sectores.filter(sec => sec.sec_Tipo_Sector == "SECTOR"))
                })
            )

            helpers.validaToken().then(helpers.authAxios.get("/PersonalMinisterial/GetSecretarioByDistrito/" + dto)
                .then(res => {
                    setInfoSecretario(res.data.infoSecretario.length > 0 ? res.data.infoSecretario[0].pem_Nombre : "")
                })
            );

        } else { //Para Sesión Pastor
            getPersonalMinisterialSector(sector);
            getInfoDistrito()
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

            getTitulo(sector)
        }
    }, [])

    const getInfoDistrito = () => {
        //console.log("Dto: ", dto)
        helpers.validaToken().then(helpers.authAxios.get("/Distrito/" + dto)
            .then(res => {
                setInfoDis(res.data)
                //console.log("Distrito: ", res.data)
            })
        )
    }

    const getPersonalMinisterialDistrito = async () => {
        setMensajeDelProceso("Procesando...")
        setModalShow(true)

        await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/PersonalMinisterial/GetPersonalMinisterialByDistrito/${dto}`)
            .then(res => {
                //console.log("respuestaAPIFoto: ", res.data.administrativo);
                if (res.data.status === "success") {
                    setPersonalMinisterial(res.data.administrativo)
                    setMensajeDelProceso("")
                    setModalShow(false)
                }
                else {
                    alert("Error:\nNo se pudo consultar la lista del Personal Ministerial, favor de reportar o intentar mas tarde.")
                }
            })
        );
    }

    const getPersonalMinisterialSector = async (sec) => {
        setMensajeDelProceso("Procesando...")
        setModalShow(true)

        await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/PersonalMinisterial/GetPersonalMinisterialBySector/${sec}`)

            .then(res => {

                if (res.data.status === "success") {
                    setPersonalMinisterial(res.data.administrativo)
                }
                else {
                    alert("Error:\nNo se pudo consultar la lista del Personal Ministerial, favor de reportar o intentar mas tarde.")
                }
                setMensajeDelProceso("")
                setModalShow(false)
                window.scrollTo(0, 0)
            })
        )
    }

    const handle_sectorSeleccionado = async (e) => {

        if (e.target.value !== "todos") {
            //console.log("Sector Seleccionado: ", e.target.value)
            getPersonalMinisterialSector(e.target.value)
            setSectorSeleccionado(e.target.value);
            getTitulo(e.target.value)
        } else {
            getPersonalMinisterialDistrito();
            setSectorSeleccionado("todos");
            setEntidadTitulo("TODOS LOS SECTORES")
        }
    }

    const getTitulo = (sector) => {
        //console.log("SectorParaTitulo: ", sectores);
        sectores.map(sec => {

            if (sec.sec_Id_Sector == sector) {
                setEntidadTitulo(sec.sec_Tipo_Sector + " " + sec.sec_Numero + ": " + sec.sec_Alias)
                //console.log("entidadTitulo: ", sec.sec_Tipo_Sector + " " + sec.sec_Numero + " " + sec.sec_Alias)
            }
        })
    }

    const downloadTable = () => {
        TableToExcel.convert(document.getElementById("table1"), {
            name: "Personal_Ministerial.xlsx",
            sheet: {
                name: "Hoja 1"
            }
        });
    }

    let totalCount = 0;

    const countPersons = (type) => {
        let count = 0
        personalMinisterial.map(persona => {
            if (persona.pem_Grado_Ministerial === type) {
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
        doc.text("REPORTE DE PERSONAL MINISTERIAL", 85, 10);
        doc.setFontSize(10);

        if (sector) {
            doc.text(entidadTitulo, 140, 22, { align: "center" });
        }
        else {
            doc.text(`${infoDis.dis_Tipo_Distrito} ${infoDis.dis_Numero}: ${infoDis.dis_Alias}`, 140, 17, { align: "center" })
            doc.text(entidadTitulo, 140, 23, { align: "center" })
        }
        doc.line(10, 32, 200, 32);

        doc.setFontSize(8);
        let yAxis = 35
        doc.setFillColor(191, 201, 202) // Codigos de color RGB (red, green, blue)
        doc.rect(10, yAxis, 190, 4, "F");
        doc.setFont("", "", "bold");
        yAxis += 3;
        doc.text("ANCIANOS", 15, yAxis);
        doc.text(`${countPersons("ANCIANO")}`, 80, yAxis);
        yAxis += 7;
        personalMinisterial.map((persona) => {
            if (persona.pem_Grado_Ministerial === "ANCIANO") {
                doc.text(`${index}.- ${persona.pem_Nombre} `, 20, yAxis);
                if (sector == null) {
                    doc.text(`${persona.sector} `, 100, yAxis);
                    doc.addImage(persona.imagen, 'JPG', 140, yAxis - 4, 8, 8);
                } else {
                    doc.addImage(persona.imagen, 'JPG', 100, yAxis - 4, 8, 8);
                }


                yAxis += 9;
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
        doc.text("DIÁCONOS", 15, yAxis);
        doc.text(`${countPersons("DIÁCONO")}`, 80, yAxis);
        yAxis += 7;
        personalMinisterial.map((persona) => {
            if (persona.pem_Grado_Ministerial === "DIÁCONO") {
                doc.text(`${index}.- ${persona.pem_Nombre} `, 20, yAxis);
                if (sector == null) {
                    doc.text(`${persona.sector} `, 100, yAxis);
                    doc.addImage(persona.imagen, 'JPG', 140, yAxis - 4, 8, 8);
                } else {
                    doc.addImage(persona.imagen, 'JPG', 100, yAxis - 4, 8, 8);
                }
                yAxis += 9;
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
        doc.text("AUXILIARES", 15, yAxis);
        doc.text(`${countPersons("AUXILIAR") + countPersons("DIÁCONO A PRUEBA")}`, 80, yAxis);
        yAxis += 7;
        personalMinisterial.map((persona) => {
            if (persona.pem_Grado_Ministerial === "AUXILIAR" || persona.pem_Grado_Ministerial === "DIÁCONO A PRUEBA") {
                doc.text(`${index}.- ${persona.pem_Nombre} `, 20, yAxis);
                if (sector == null) {
                    doc.text(`${persona.sector} `, 100, yAxis);
                    doc.addImage(persona.imagen, 'JPG', 140, yAxis - 4, 8, 8);
                } else {
                    doc.addImage(persona.imagen, 'JPG', 100, yAxis - 4, 8, 8);
                }
                yAxis += 9;
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

        doc.text("TOTAL DE PERSONAL MINISTERIAL:", 20, yAxis);
        doc.text(`${totalCount}`, 80, yAxis);

        yAxis += 25;
        doc.text(`JUSTICIA Y VERDAD`, 105, yAxis, { align: "center" });
        yAxis += 5;
        doc.text(`AL DÍA ${moment().format('LL').toUpperCase()}`, 105, yAxis, { align: "center" });

        yAxis += 35;
        doc.line(30, yAxis, 90, yAxis);
        doc.line(120, yAxis, 180, yAxis);
        yAxis += 3;
        doc.text("SECRETARIO", 51, yAxis);
        doc.text(lider, 145, yAxis);
        yAxis -= 5;
        doc.text(`${JSON.parse(localStorage.getItem("infoSesion")).pem_Nombre}`, 130, yAxis);
        doc.text(`${infoSecretario}`, 40, yAxis);


        doc.save("Reporte de Personal Ministerial.pdf");
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
                        <Col lg="5">
                            <img src={logo} alt="Logo" width="100%" className="ml-3"></img>
                        </Col>
                        <Col lg="6" >
                            <CardTitle className="text-center" tag="h3">
                                LISTA DE PERSONAL MINISTERIAL
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
                        <Button size="lg" className="text-left categoriasReportes " block id="ancianos">Ancianos: {countPersons("ANCIANO")}</Button>
                        <UncontrolledCollapse defaultOpen toggler="#ancianos">
                            <Card>
                                <CardBody>
                                    <h5>
                                        <ol type="0">
                                            {personalMinisterial.map((persona) => {
                                                if (persona.pem_Grado_Ministerial === "ANCIANO") {
                                                    return <Row>
                                                        <Col md="6">
                                                            <li key={persona.pem_Id_Ministro}>{persona.pem_Nombre} </li>
                                                        </Col>
                                                        {sector == null && <Col md="3">
                                                            <span key={persona.sector}>{persona.sector} </span>
                                                        </Col>}
                                                        <Col md="2">
                                                            <img style={{ width: '50px', height: '50px' }} src={`data:${persona.MIMEType};base64,${persona.imagen}`} alt="Imagen de ministro" type="image/jpg"></img>
                                                        </Col>
                                                        {/* <Col col-2>
                                                            <img style={{ width: '50px', height: 'auto' }} src={helpers.url_api + "/Foto/FotoMinistro/" + persona.pem_Id_Ministro} alt="Imagen de ministro" type="image/jpg"></img>
                                                        </Col> */}
                                                    </Row>
                                                }
                                            })}
                                        </ol>
                                    </h5>
                                </CardBody>
                            </Card>
                        </UncontrolledCollapse>

                        <Button size="lg" className="text-left categoriasReportes mt-2" block id="diaconos">Diáconos: {countPersons("DIÁCONO")}</Button>
                        <UncontrolledCollapse defaultOpen toggler="#diaconos">
                            <Card>
                                <CardBody>
                                    <h5>
                                        <ol type="1">
                                            {personalMinisterial.map((persona) => {
                                                if (persona.pem_Grado_Ministerial === "DIÁCONO") {
                                                    return <Row>
                                                        <Col md="6">
                                                            <li key={persona.pem_Id_Ministro}>{persona.pem_Nombre} </li>
                                                        </Col>
                                                        {sector == null && <Col md="3">
                                                            <span key={persona.sector}>{persona.sector} </span>
                                                        </Col>}
                                                        <Col md="2">
                                                            <img style={{ width: '50px', height: '50px' }} src={`data:${persona.MIMEType};base64,${persona.imagen}`} alt="Imagen de ministro" type="image/jpg"></img>
                                                        </Col>
                                                        {/* <Col col-2>
                                                            <img style={{ width: '50px', height: 'auto' }} src={helpers.url_api + "/Foto/FotoMinistro/" + persona.pem_Id_Ministro} alt="Imagen de ministro" type="image/jpg"></img>
                                                        </Col> */}
                                                    </Row>
                                                }
                                            })}
                                        </ol>
                                    </h5>
                                </CardBody>
                            </Card>
                        </UncontrolledCollapse>
                        <hr></hr>
                        <Button size="lg" className="text-left categoriasReportes mt-2" block id="auxiliares">Auxiliares: {countPersons("AUXILIAR") + countPersons("DIÁCONO A PRUEBA")}</Button>
                        <UncontrolledCollapse defaultOpen toggler="#auxiliares">
                            <Card>
                                <CardBody>
                                    <h5>
                                        <ol type="1">
                                            {personalMinisterial.map((persona) => {
                                                if (persona.pem_Grado_Ministerial === "AUXILIAR" || persona.pem_Grado_Ministerial === "DIÁCONO A PRUEBA") {
                                                    return <Row>
                                                        <Col md="6">
                                                            <li key={persona.pem_Id_Ministro}>{persona.pem_Nombre} </li>
                                                        </Col>
                                                        {sector == null && <Col md="3">
                                                            <span key={persona.sector}>{persona.sector} </span>
                                                        </Col>}
                                                        <Col md="2">
                                                            <img style={{ width: '50px', height: '50px' }} src={`data:${persona.MIMEType};base64,${persona.imagen}`} alt="Imagen de ministro" type="image/jpg"></img>
                                                        </Col>
                                                        {/* <Col col-2>
                                                            <img style={{ width: '50px', height: 'auto' }} src={helpers.url_api + "/Foto/FotoMinistro/" + persona.pem_Id_Ministro} alt="Imagen de ministro" type="image/jpg"></img>
                                                        </Col> */}
                                                    </Row>
                                                }
                                            })}
                                        </ol>
                                    </h5>
                                </CardBody>
                            </Card>
                        </UncontrolledCollapse>


                        {/* <h4 className="text-right m-4">Total de personal bautizado: <strong>{totalCount}</strong></h4> */}
                        <h4 className="text-center m-4">Justicia y Verdad</h4>
                        <h4 className="text-center m-4">a {moment().format('LL')}</h4>


                        <Row className="text-center mt-5 flex-between">
                            <Col xs="1"></Col>
                            <Col xs="4">
                                {/* <h5 style={{height: "1.2em"}}></h5> */}
                                <h5>{`${infoSecretario}`}</h5>
                                <hr color="black"></hr>
                                <h5>Secretario</h5>
                            </Col>
                            <Col xs="2"></Col>
                            <Col xs="4">
                                <h5>{JSON.parse(localStorage.getItem("infoSesion")).pem_Nombre}</h5>
                                <hr color="black"></hr>
                                {sector ? <h5>Pastor</h5> : <h5>Obispo</h5>}
                            </Col>
                            <Col xs="1"></Col>
                        </Row>
                    </CardBody>
                </Card>


                {/* TABLA PARA EXCEL */}
                <Card hidden body>
                    <CardTitle className="text-center" tag="h3">
                        Reporte de Personal Ministerial
                        <h5>Distrito: {JSON.parse(localStorage.getItem("infoSesion")).dis_Alias}</h5>
                        {sector ? <h5>Sector: {JSON.parse(localStorage.getItem("infoSesion")).sec_Alias}</h5> : null}
                    </CardTitle>
                    <CardBody>
                        <Table responsive hover id="table1" data-cols-width="10,40,20">
                            <thead>
                                <tr>
                                    <th data-f-bold>Indice</th>
                                    <th data-f-bold>Nombre(s)</th>
                                    <th data-f-bold>Grado Ministerial</th>

                                </tr>
                            </thead>
                            <tbody>
                                {personalMinisterial.map((persona, index) => (
                                    <tr key={persona.pem_Id_Ministro}>
                                        <td>{index + 1}</td>
                                        <td>{persona.pem_Nombre}</td>
                                        <td>{persona.pem_Grado_Ministerial}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </CardBody>
                </Card>
            </Container>
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
