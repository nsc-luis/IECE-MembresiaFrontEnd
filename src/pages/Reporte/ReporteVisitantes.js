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

export default function ReporteVisitantes() {
    //Estados
    //const [comisiones, setComisiones] = useState([])
    //const [personalAdministrativo, setPersonalAdministrativo] = useState([])
    const [infoDis, setInfoDis] = useState([])
    const [infoSec, setInfoSec] = useState([])
    const [infoSecretario, setInfoSecretario] = useState({})
    const dto = JSON.parse(localStorage.getItem("dto"))
    const sector = JSON.parse(localStorage.getItem("sector"))
    const [sectores, setSectores] = useState([])
    const [sectorSeleccionado, setSectorSeleccionado] = useState(null)
    const [entidadTitulo, setEntidadTitulo] = useState("")
    const [lider, setLider] = useState("")
    const [visitantes, setVisitantes] = useState([])
    const [visitantesPermanentes, setVisitantesPermanentes] = useState([])
    const [visitantesOcasionales, setVisitantesOcasionales] = useState([])
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
            getVisitantesByDistrito(dto)
            getInfoDistrito()
            setSectorSeleccionado("todos");
            setLider("OBISPO");
            setEntidadTitulo("Todos los Sectores")


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

        } else { //Para Sesión Pastor
            getVisitantesBySector(sector)
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


    const getVisitantesByDistrito = async (dis) => {


        try {
            setMensajeDelProceso("Procesando...")
            setModalShow(true)

            await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/Visitante/VisitantesByDistrito/${dto}`)
                .then(res => {
                    console.log("REspuesta: ", res.data.visitantes)
                    if (res.data.status === "success") {
                        setVisitantes(res.data.visitantes)
                        setVisitantesPermanentes(res.data.visitantes.filter(visitante => visitante.visitante.vp_Tipo_Visitante === 'PERMANENTE' && visitante.visitante.vp_Activo))
                        setVisitantesOcasionales(res.data.visitantes.filter(visitante => visitante.visitante.vp_Tipo_Visitante === 'OCASIONAL' && visitante.visitante.vp_Activo))
                        setMensajeDelProceso("")
                        setModalShow(false)
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


    const getVisitantesBySector = async (sec) => {
        try {
            setMensajeDelProceso("Procesando...")
            setModalShow(true)

            await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/Visitante/VisitantesBySector/${sec}`)
                .then(res => {
                    console.log("REspuesta: ", res.data.visitantes)
                    if (res.data.status === "success") {
                        setVisitantes(res.data.visitantes)
                        setVisitantesPermanentes(res.data.visitantes.filter(visitante => visitante.visitante.vp_Tipo_Visitante === 'PERMANENTE' && visitante.visitante.vp_Activo))
                        setVisitantesOcasionales(res.data.visitantes.filter(visitante => visitante.visitante.vp_Tipo_Visitante === 'OCASIONAL' && visitante.visitante.vp_Activo))
                        setMensajeDelProceso("")
                        setModalShow(false)
                        window.scrollTo(0, 0)
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

    const getInfoDistrito = () => {
        console.log("Dto: ", dto)
        helpers.validaToken().then(helpers.authAxios.get("/Distrito/" + dto)
            .then(res => {
                setInfoDis(res.data)
                console.log("Distrito: ", res.data)
                //setEntidadTitulo(res.data.dis_Tipo_Distrito + " " + (res.data.dis_Tipo_Distrito == "MISION" ? "" : "No. " + res.data.dis_Numero + ": ") + res.data.dis_Alias)
            })
        )
    }


    const handle_sectorSeleccionado = async (e) => {

        if (e.target.value !== "todos") {
            console.log("Sector Seleccionado: ", e.target.value)
            getVisitantesBySector(e.target.value)
            setSectorSeleccionado(e.target.value);
            getTitulo(e.target.value)
        } else {
            getVisitantesByDistrito(dto)
            setSectorSeleccionado("todos");
            setEntidadTitulo("TODOS LOS SECTORES");
        }
    }

    const getTitulo = (sector) => {
        console.log("SectorParaTitulo: ", sectores);
        sectores.map(sec => {

            if (sec.sec_Id_Sector === sector) {
                setEntidadTitulo(sec.sec_Tipo_Sector + " " + sec.sec_Numero + ": " + sec.sec_Alias)
                console.log("entidadTitulo: ", sec.sec_Tipo_Sector + " " + sec.sec_Numero + " " + sec.sec_Alias)
            }
        })
    }

    const downloadTable = () => {
        const table1 = document.getElementById("table1");
        const table2 = document.getElementById("table2");
        const book = TableToExcel.tableToBook(table1, { sheet: { name: "VisitantesPermanentes" } });
        TableToExcel.tableToSheet(book, table2, { sheet: { name: "VisitantesOcasionales" } });
        TableToExcel.save(book, "Lista de Visitantes.xlsx")
    };

    const reportePersonalBautizadoPDF = () => {
        let index = 1
        // INSTANCIA NUEVO OBJETO PARA CREAR PDF
        const doc = new jsPDF("p", "mm", "letter");
        let pageHeight = doc.internal.pageSize.height;
        doc.addImage(logo, 'PNG', 10, 5, 70, 20);
        doc.text("LISTA DE VISITANTES", 140, 12, { align: "center", maxWidth: 110 });
        doc.setFontSize(10);

        if (sector) {
            doc.text(entidadTitulo, 140, 23, { align: "center" });
        }
        else {
            doc.text(`${infoDis.dis_Tipo_Distrito} ${infoDis.dis_Numero}: ${infoDis.dis_Alias}`, 140, 19, { align: "center" })
            doc.text(entidadTitulo, 140, 25, { align: "center" })
        }
        doc.line(10, 30, 200, 30);

        let yAxis = 32
        index = 1;
        yAxis += 4;
        doc.setFont("", "", "normal");
        doc.setFontSize(12);
        doc.setFillColor(191, 201, 202) // Codigos de color RGB (red, green, blue)
        doc.rect(10, (yAxis - 4), 190, 5, "F");
        doc.setFont("", "", "bold");
        doc.text(`VISITANTES PERMANENTES: ${visitantesPermanentes.length}`, 100, yAxis, { align: "center" }); //Nombre complementario de Categoría
        doc.setFont("", "", "normal");

        doc.setFontSize(7);
        yAxis += 6;
        //Si la Categoría es "Departamento"
        visitantesPermanentes.map((visitante) => {
            doc.text(`${index}.- ${visitante.visitante.vp_Nombre} `, 10, yAxis);
            if (sector == null) {
                doc.text(`${visitante.visitante.vp_Telefono_Contacto ? visitante.visitante.vp_Telefono_Contacto : "--"} `, 65, yAxis);
                doc.text(`${visitante.visitante.vp_Direccion ? visitante.visitante.vp_Direccion : "--"} `, 85, yAxis);
                doc.text(`${visitante.sector.sec_Tipo_Sector} ${visitante.sector.sec_Numero}`, 180, yAxis);
            } else {
                doc.text(`${visitante.visitante.vp_Telefono_Contacto ? visitante.visitante.vp_Telefono_Contacto : "--"} `, 70, yAxis);
                doc.text(`${visitante.visitante.vp_Direccion ? visitante.visitante.vp_Direccion : "--"} `, 90, yAxis);
            }
            yAxis += 5;
            index++;
            if (yAxis >= pageHeight - 10) {
                doc.addPage();
                yAxis = 15 // Restart height position
            }
        })

        index = 1;
        yAxis += 15;
        doc.setFont("", "", "normal");
        doc.setFontSize(12);
        doc.setFillColor(191, 201, 202) // Codigos de color RGB (red, green, blue)
        doc.rect(10, (yAxis - 4), 190, 5, "F");
        doc.setFont("", "", "bold");
        doc.text(`VISITANTES OCASIONALES: ${visitantesOcasionales.length}`, 100, yAxis, { align: "center" }); //Nombre complementario de Categoría
        doc.setFont("", "", "normal");

        doc.setFontSize(7);
        yAxis += 6;
        //Si la Categoría es "Departamento"
        visitantesOcasionales.map((visitante) => {
            doc.text(`${index}.- ${visitante.visitante.vp_Nombre} `, 10, yAxis);
            if (sector == null) {
                doc.text(`${visitante.visitante.vp_Telefono_Contacto ? visitante.visitante.vp_Telefono_Contacto : "--"} `, 65, yAxis);
                doc.text(`${visitante.visitante.vp_Direccion ? visitante.visitante.vp_Direccion : "--"} `, 85, yAxis);
                doc.text(`${visitante.sector.sec_Tipo_Sector} ${visitante.sector.sec_Numero}`, 180, yAxis);
            } else {
                doc.text(`${visitante.visitante.vp_Telefono_Contacto ? visitante.visitante.vp_Telefono_Contacto : "--"} `, 70, yAxis);
                doc.text(`${visitante.visitante.vp_Direccion ? visitante.visitante.vp_Direccion : "--"} `, 90, yAxis);
            }
            yAxis += 5;
            index++;
            if (yAxis >= pageHeight - 10) {
                doc.addPage();
                yAxis = 15 // Restart height position
            }
        })

        yAxis += 2;
        //doc.rect(75, yAxis, 15, 4);
        yAxis += 3;

        if (yAxis >= pageHeight - 30) {
            doc.addPage();
            yAxis = 15 // Restart height position
        }

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


        doc.save("Reporte de Visitantes.pdf");
    }


    return (
        console.log("visitantesPermanentes ", visitantesPermanentes),
        console.log("TipoSesion", sector),
        <>
            <Container lg>
                {/*CONTROLES DE SELECCION DE DISTRITO Y SECTOR */}
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
                                        <option value="todos">DISTRITO</option>
                                    </React.Fragment>
                                }
                            </Input>
                        </Col>
                    </Row>
                </FormGroup>

                {/*BOTONES PARA DESCARGA DE DOCUMENTOS IMRIMIBLES */}
                <Button className="btn-success m-3 " onClick={() => downloadTable()}><i className="fas fa-file-excel mr-2"></i>Descargar Excel</Button>
                <Button className="btn-danger m-3 " onClick={() => reportePersonalBautizadoPDF()}><i className="fas fa-file-pdf mr-2"></i>Descargar PDF</Button>

                {/*CABECERA DE LA LISTA INCLUYE EL LOGO*/}
                <Card body>
                    <Row>
                        <Col lg="5">
                            <img src={logo} alt="Logo" width="100%" className="ml-3"></img>
                        </Col>
                        <Col lg="6" >
                            <CardTitle className="text-center" tag="h3">
                                LISTA DE VISITANTES
                                <FormGroup>
                                    <Row>
                                        <h1> </h1>
                                    </Row>
                                </FormGroup>

                                <h5>{entidadTitulo}</h5>
                            </CardTitle>
                        </Col>
                    </Row>
                    <CardBody>
                        {/*CASO DE SESION PASTOR*/}
                        {/* {sectorSeleccionado !== 'todos' ? */}
                        <>

                            <Card >
                                {/*TITULO DE LA SECCIÓN*/}
                                <CardHeader style={{ textAlign: "center" }} >
                                    <h4>VISITANTES PERMANENTES: {visitantesPermanentes.length}</h4>
                                </CardHeader>
                                {/*CUERPO DE LA TABLA*/}
                                <CardBody>
                                    <Card>
                                        {visitantesPermanentes.length > 0 ?
                                            <CardBody>

                                                <Table className="table table-striped table-bordered table-sm">
                                                    <thead className="text-center bg-gradient-info">
                                                        <tr>
                                                            <th width="3%">No.</th>
                                                            <th width="30%">NOMBRE</th>
                                                            <th width="12%">TELEFONO</th>
                                                            <th width="45%">DIRECCIÓN</th>
                                                            <th width="10%">SECTOR</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>

                                                        {visitantesPermanentes.map((visitante, index) => {
                                                            return <tr key={visitante.vp_Id_Visitante}>
                                                                <td>{index + 1}</td>
                                                                <td>{visitante.visitante.vp_Nombre}</td>
                                                                <td>{visitante.visitante.vp_Telefono_Contacto}</td>
                                                                <td>{visitante.visitante.vp_Direccion}</td>
                                                                <td>{visitante.sector.sec_Tipo_Sector} {visitante.sector.sec_Numero}</td>
                                                            </tr>
                                                        })}
                                                    </tbody>
                                                </Table>
                                            </CardBody>
                                            : <CardBody>No hay visitantes de esta categoría registrados</CardBody>}
                                    </Card>
                                </CardBody>
                            </Card>

                            {/*TITULO DE LA SECCIÓN*/}
                            <Card >
                                <CardHeader style={{ textAlign: "center" }} >
                                    <h4>VISITANTES OCASIONALES: {visitantesOcasionales.length}</h4>
                                </CardHeader>
                                {/*CUERPO DE LA TABLA*/}
                                <CardBody>
                                    <Card>
                                        {visitantesOcasionales.length > 0 ?
                                            <CardBody>
                                                <Table className="table table-striped table-bordered table-sm">
                                                    <thead className="text-center bg-gradient-info">
                                                        <tr>
                                                            <th width="3%">No.</th>
                                                            <th width="30%">NOMBRE</th>
                                                            <th width="12%">TELEFONO</th>
                                                            <th width="45%">DIRECCIÓN</th>
                                                            <th width="10%">SECTOR</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {visitantesOcasionales.map((visitante, index) => {
                                                            return <tr key={visitante.vp_Id_Visitante}>
                                                                <td>{index + 1}</td>
                                                                <td>{visitante.visitante.vp_Nombre}</td>
                                                                <td>{visitante.visitante.vp_Telefono_Contacto}</td>
                                                                <td>{visitante.visitante.vp_Direccion}</td>
                                                                <td>{visitante.sector.sec_Tipo_Sector} {visitante.sector.sec_Numero}</td>
                                                            </tr>
                                                        })}
                                                    </tbody>
                                                </Table>
                                            </CardBody>
                                            : <CardBody>No hay visitantes de esta categoría registrados</CardBody>}
                                    </Card>
                                </CardBody>
                            </Card>
                            <br>
                            </br>
                        </>
                        {/* :
                            ""} */}




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
                        Reporte de Visitantes
                        <h5>Distrito: {JSON.parse(localStorage.getItem("infoSesion")).dis_Alias}</h5>
                        {sector ? <h5>Sector: {JSON.parse(localStorage.getItem("infoSesion")).sec_Alias}</h5> : null}
                    </CardTitle>
                    <CardBody>
                        <Table responsive hover id="table1" data-cols-width="10,40,20,80,30">
                            <thead className="text-center bg-gradient-info">
                                <tr>
                                    <th >No.</th>
                                    <th >NOMBRE</th>
                                    <th >TELÉFONO</th>
                                    <th >DIRECCIÓN</th>
                                    <th >SECTOR</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visitantesPermanentes.map((obj, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{obj.visitante.vp_Nombre}</td>
                                            <td>{obj.visitante.vp_Telefono_Contacto != null ? obj.visitante.vp_Telefono_Contacto : "--"}</td>
                                            <td>{obj.visitante.vp_Direccion != null ? obj.visitante.vp_Direccion : "--"}</td>
                                            <td>{obj.sector.sec_Tipo_Sector} {obj.sector.sec_Numero}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>

                        <table responsive hover id="table2" data-cols-width="10,40,20,80,30">
                            <thead className="text-center bg-gradient-info">
                                <tr>
                                    <th >No.</th>
                                    <th >NOMBRE</th>
                                    <th >TELÉFONO</th>
                                    <th >DIRECCIÓN</th>
                                    <th >SECTOR</th>
                                </tr>
                            </thead>
                            <tbody>

                                {visitantesOcasionales.map((obj, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{obj.visitante.vp_Nombre}</td>
                                            <td>{obj.visitante.vp_Telefono_Contacto != null ? obj.visitante.vp_Telefono_Contacto : "--"}</td>
                                            <td>{obj.visitante.vp_Direccion != null ? obj.visitante.vp_Direccion : "--"}</td>
                                            <td>{obj.sector.sec_Tipo_Sector} {obj.sector.sec_Numero}</td>
                                        </tr>
                                    )
                                })}

                            </tbody>
                        </table>

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
