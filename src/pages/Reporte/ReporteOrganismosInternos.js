import Layout from "../Layout";

import helpers from "../../components/Helpers";
import {
    Container, Button,
    CardTitle, Card, CardBody, Table, UncontrolledCollapse, Row, Col,
    FormGroup, Input, CardHeader,
} from 'reactstrap';

import React, { useEffect, useState, } from 'react';
import TableToExcel from "@linways/table-to-excel";
import jsPDF from 'jspdf';
import moment from 'moment/min/moment-with-locales';
import 'moment/dist/locale/es'
import logo from '../../assets/images/IECE_LogoOficial.jpg'

export default function ReporteOrganismosInternos() {
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
    const [organismosInternos, setOrganismosInternos] = useState([])
    //Llamadas en render

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    

    useEffect(() => {

        if (sector == null) { //Para Sesión Obispo
            console.log("inicia programa")
            getOrganismosInternosByDistrito(dto)
            getInfoDistrito()
            setSectorSeleccionado("todos");
            setLider("OBISPO");
            setEntidadTitulo("")


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
            getOrganismosInternosBySector(sector)
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


    const getOrganismosInternosByDistrito = async (dis) => {
        try {
            await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/Organismo_Interno/GetByDistrito/${dis}`)
                .then(res => {
                    console.log("REspuesta: ", res.data.organismosInternos)
                    if (res.data.status === "success") {
                        setOrganismosInternos(res.data.organismosInternos)
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


    const getOrganismosInternosBySector = async (sec) => {
        try {
            await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/Organismo_Interno/GetBySector/${sec}`)
                .then(res => {
                    console.log("REspuesta: ", res.data.organismosInternos)
                    if (res.data.status === "success") {
                        setOrganismosInternos(res.data.organismosInternos)
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
            getOrganismosInternosBySector(e.target.value)
            setSectorSeleccionado(e.target.value);
            getTitulo(e.target.value)
        } else {
            getOrganismosInternosByDistrito(dto)
            setSectorSeleccionado("todos");
            setEntidadTitulo("TODOS LOS SECTORES");
        }
    }

    const getTitulo = (sector) => {
        console.log("SectorParaTitulo: ", sectores);
        sectores.map(sec => {

            if (sec.sec_Id_Sector == sector) {
                setEntidadTitulo(sec.sec_Tipo_Sector + " " + sec.sec_Numero + ": " + sec.sec_Alias)
                console.log("entidadTitulo: ", sec.sec_Tipo_Sector + " " + sec.sec_Numero + " " + sec.sec_Alias)
            }
        })
    }

    const downloadTable1 = () => {
        TableToExcel.convert(document.getElementById("table1"), {
            name: "Personal_Bautizado.xlsx",
            sheet: {
                name: "Hoja 1"
            }
        });
    }

    const downloadTable = () => {
        TableToExcel.convert(document.getElementById("table1"), {
            name: "Organismos Internos.xlsx",
            sheet: {
                name: "Hoja 1"
            }
        });
    }

    const reportePersonalBautizadoPDF = () => {
        let index = 1
        // INSTANCIA NUEVO OBJETO PARA CREAR PDF
        const doc = new jsPDF("p", "mm", "letter");
        let pageHeight = doc.internal.pageSize.height;
        doc.addImage(logo, 'PNG', 10, 5, 70, 20);
        doc.text("LISTA DE ORGANISMOS INTERNOS", 140, 12, { align: "center", maxWidth: 110 });
        doc.setFontSize(10);

        if (sector) {
            doc.text(entidadTitulo, 140, 23, { align: "center" });
        }
        else {
            doc.text(`${infoDis.dis_Tipo_Distrito} ${infoDis.dis_Numero}: ${infoDis.dis_Alias}`, 140, 19, { align: "center" })
            doc.text(entidadTitulo, 140, 25, { align: "center" })
        }
        doc.line(10, 30, 200, 30);

        doc.setFontSize(8);
        let yAxis = 32
        // doc.setFillColor(191, 201, 202) // Codigos de color RGB (red, green, blue)
        // doc.rect(10, yAxis, 190, 4, "F");
        doc.setFont("", "", "bold");
        yAxis += 3;


        index = 1;
        // yAxis += 7;
        organismosInternos.map((obj) => {
            yAxis += 4;
            doc.setFont("", "", "normal");
            doc.setFontSize(12);
            doc.setFillColor(191, 201, 202) // Codigos de color RGB (red, green, blue)
            doc.rect(10, (yAxis - 4), 190, 5, "F");
            doc.text(`${obj.oi.org_Tipo_Organismo} ${obj.oi.org_Categoria}`, 12, yAxis);
            let textoNormalWidth = doc.getTextWidth(`${obj.oi.org_Tipo_Organismo} ${obj.oi.org_Categoria}`);
            doc.setFont("", "", "bold");
            doc.text(`"${obj.oi.org_Nombre}"`, 14 + textoNormalWidth, yAxis);
            doc.setFont("", "", "normal");
            if (sectorSeleccionado == "todos") {
                let textoNormalWidth = doc.getTextWidth(`${obj.oi.org_Tipo_Organismo} ${obj.oi.org_Categoria} "${obj.oi.org_Nombre}"}`);
                doc.setFontSize(8);
                doc.text(` -  (${obj.sector.sec_Tipo_Sector} ${obj.sector.sec_Numero}, ${obj.sector.sec_Alias})`, 16 + textoNormalWidth, yAxis - .5)
            }

            doc.setFontSize(10);
            if (obj.oi.org_Tipo_Organismo === "DEPARTAMENTO") {
                yAxis += 5;

                doc.setFont("", "", "bold");
                doc.text(`PRESIDENTE: `, 25, yAxis);
                textoNormalWidth = doc.getTextWidth(`PRESIDENTE: `);
                doc.setFont("", "", "normal");
                doc.text(`${obj.presidente !== null ? ` ${obj.presidente.per_Nombre_Completo} ` : "--"}`, 25 + textoNormalWidth, yAxis);
                yAxis += 5;

                doc.setFont("", "", "bold");
                doc.text(`SECRETARIO(A): `, 25, yAxis);
                textoNormalWidth = doc.getTextWidth(`SECRETARIO(A): `);
                doc.setFont("", "", "normal");
                doc.text(`${obj.secretario !== null ? ` ${obj.secretario.per_Nombre_Completo} ` : "--"}`, 25 + textoNormalWidth, yAxis);

                yAxis += 5;
                doc.setFont("", "", "bold");
                doc.text(`TESORERO(A): `, 25, yAxis);
                doc.setFont("", "", "normal");
                doc.text(`${obj.tesorero !== null ? ` ${obj.tesorero.per_Nombre_Completo} ` : "--"}`, 25 + textoNormalWidth, yAxis);
            } else {

                yAxis += 5;
                doc.setFont("", "", "bold");
                doc.text(`PRESIDENTE: `, 25, yAxis);
                textoNormalWidth = doc.getTextWidth("PRESIDENTE: ");
                doc.setFont("", "", "normal");
                doc.text(`${obj.presidente !== null ? ` ${obj.presidente.per_Nombre_Completo} ` : "--"}`, 25 + textoNormalWidth, yAxis);

                yAxis += 5;
                doc.setFont("", "", "bold");
                doc.text(`VICE-PRESIDENTE: `, 25, yAxis);
                textoNormalWidth = doc.getTextWidth("VICE-PRESIDENTE: ");
                doc.setFont("", "", "normal");
                doc.text(`${obj.vicePresidente !== null ? ` ${obj.vicePresidente.per_Nombre_Completo} ` : "--"}`, 25 + textoNormalWidth, yAxis);

                yAxis += 5;
                doc.setFont("", "", "bold");
                doc.text(`SECRETARIO(A): `, 25, yAxis);
                textoNormalWidth = doc.getTextWidth("SECRETARIO(A): ");
                doc.setFont("", "", "normal");
                doc.text(`${obj.secretario !== null ? ` ${obj.secretario.per_Nombre_Completo} ` : "--"}`, 25 + textoNormalWidth, yAxis);

                yAxis += 5;
                doc.setFont("", "", "bold");
                doc.text(`SUB-SECRETARIO(A): `, 25, yAxis);
                textoNormalWidth = doc.getTextWidth("SUB-SECRETARIO(A): ");
                doc.setFont("", "", "normal");
                doc.text(`${obj.subSecretario !== null ? ` ${obj.subSecretario.per_Nombre_Completo} ` : "--"}`, 25 + textoNormalWidth, yAxis);

                yAxis += 5;
                doc.setFont("", "", "bold");
                doc.text("TESORERO(A): ", 25, yAxis);
                textoNormalWidth = doc.getTextWidth("TESORERO(A): ");
                doc.setFont("", "", "normal");
                doc.text(`${obj.tesorero !== null ? ` ${obj.tesorero.per_Nombre_Completo} ` : "--"}`, 25 + textoNormalWidth, yAxis);

                yAxis += 5;
                doc.setFont("", "", "bold");
                doc.text("SUB-TESORERO(A): ", 25, yAxis);
                textoNormalWidth = doc.getTextWidth("SUB-TESORERO(A): ");
                doc.setFont("", "", "normal");
                doc.text(`${obj.subTesorero !== null ? ` ${obj.subTesorero.per_Nombre_Completo} ` : "--"}`, 25 + textoNormalWidth, yAxis);
            }

            yAxis += 12;
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


        doc.save("ReportePersonalBautizado.pdf");
    }


    return (
        console.log("tipo de sesión: ", sector),
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
                                        <option value="todos">DISTRITO</option>
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
                                LISTA DE ORGANISMOS INTERNOS
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

                        {organismosInternos.map((obj) => (
                            <>
                                <Card key={obj.oi.org_Id}>
                                    <CardHeader style={{ textAlign: "center" }} className="categoriasReportes">
                                        <h4>{obj.oi.org_Tipo_Organismo} {obj.oi.org_Categoria} '<b>{obj.oi.org_Nombre}</b>'</h4>
                                        {sectorSeleccionado == "todos" &&
                                            <h5>({obj.sector.sec_Tipo_Sector} {obj.sector.sec_Numero}, {obj.sector.sec_Alias})</h5>}
                                    </CardHeader>
                                    <CardBody>
                                        <Table className="table table-striped table-bordered table-sm">
                                            {/* <thead className="text-center bg-gradient-info">
                                            <tr>
                                                <th width="30%">CARGO</th>
                                                <th width="70%">NOMBRE</th>
                                            </tr>
                                        </thead> */}
                                            <tbody>
                                                {obj.oi.org_Tipo_Organismo === "DEPARTAMENTO" &&
                                                    <>
                                                        <tr>
                                                            <td><strong>Presidente</strong></td>
                                                            <td>{obj.presidente !== null ? `${obj.presidente.per_Nombre_Completo}` : "--"}</td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Secretario(a)</strong></td>
                                                            <td>{obj.secretario !== null ? `${obj.secretario.per_Nombre_Completo}` : "--"}</td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Tesorero(a)</strong></td>
                                                            <td>{obj.tesorero !== null ? `${obj.tesorero.per_Nombre_Completo}` : "--"}</td>
                                                        </tr>
                                                    </>
                                                }
                                                {obj.oi.org_Tipo_Organismo === "SOCIEDAD" &&
                                                    <>
                                                        <tr>
                                                            <td><strong>Presidente</strong></td>
                                                            <td>{obj.presidente !== null ? `${obj.presidente.per_Nombre_Completo}` : "--"}</td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Vice-Presidente</strong></td>
                                                            <td>{obj.vicePresidente !== null ? `${obj.vicePresidente.per_Nombre_Completo}` : "--"}</td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Secretario(a)</strong></td>
                                                            <td>{obj.secretario !== null ? `${obj.secretario.per_Nombre_Completo}` : "--"}</td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Sub-Secretario(a)</strong></td>
                                                            <td>{obj.subSecretario !== null ? `${obj.subSecretario.per_Nombre_Completo}` : "--"}</td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Tesorero(a)</strong></td>
                                                            <td>{obj.tesorero !== null ? `${obj.tesorero.per_Nombre_Completo}` : "--"}</td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Sub-Tesorero(a)</strong></td>
                                                            <td>{obj.subTesorero !== null ? `${obj.subTesorero.per_Nombre_Completo}` : "--"}</td>
                                                        </tr>
                                                        <br></br>
                                                    </>
                                                }
                                            </tbody>
                                        </Table>
                                    </CardBody>
                                </Card>
                                <br>
                                </br>
                            </>

                        ))}


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
                        Reporte de Organismos Internos
                        <h5>Distrito: {JSON.parse(localStorage.getItem("infoSesion")).dis_Alias}</h5>
                        {sector ? <h5>Sector: {JSON.parse(localStorage.getItem("infoSesion")).sec_Alias}</h5> : null}
                    </CardTitle>
                    <CardBody>
                        {/* <Table responsive hover id="table1" data-cols-width="30,40,20">
                            <thead className="text-center bg-gradient-info">
                                <th >CARGO</th>
                                <th >NOMBRE</th>
                                <th >GRADO</th>
                            </thead>
                            <tbody>
                                {organismosInternos.map((obj, index) => {
                                    return (
                                        <tr key={index}>
                                            <td><b>{obj.cargo}</b></td>
                                            <td>{obj.datosPersonalMinisterial != null ? obj.datosPersonalMinisterial.pem_Nombre : ""}</td>
                                            <td>{obj.datosPersonalMinisterial != null ? obj.datosPersonalMinisterial.pem_Grado_Ministerial : ""}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table> */}

                        <Table responsive hover id="table1" data-cols-width="50, 20,30">
                            <thead>
                                <tr>
                                    <th width="30%"><b>SOCIEDAD</b></th>
                                    <th width="30%">CARGO</th>
                                    <th width="70%">NOMBRE</th>
                                </tr>
                            </thead>
                            {organismosInternos.map((obj, index) => {
                                return (
                                    <tbody>
                                        {obj.oi.org_Tipo_Organismo === "DEPARTAMENTO" &&
                                            <>
                                                <tr>
                                                    <td rowSpan={3} style={{ textAlign: 'center', verticalAlign: 'middle' }}>{obj.oi.org_Tipo_Organismo} {obj.oi.org_Categoria} {obj.oi.org_Nombre}</td>
                                                    <td><strong>Presidente</strong></td>
                                                    <td>{obj.presidente !== null ? `${obj.presidente.per_Nombre_Completo} ` : "--"}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Secretario</strong></td>
                                                    <td>{obj.secretario !== null ? `${obj.secretario.per_Nombre_Completo}` : "--"}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Tesorero</strong></td>
                                                    <td>{obj.tesorero !== null ? `${obj.tesorero.per_Nombre_Completo}` : "--"}</td>
                                                </tr>
                                            </>
                                        }
                                        {obj.oi.org_Tipo_Organismo === "SOCIEDAD" &&
                                            <>
                                                <tr>
                                                    <td rowSpan={6} style={{ textAlign: 'center', verticalAlign: 'middle' }}>{obj.oi.org_Tipo_Organismo} {obj.oi.org_Categoria} {obj.oi.org_Nombre}</td>
                                                    <td><strong>Presidente</strong></td>
                                                    <td>{obj.presidente !== null ? `${obj.presidente.per_Nombre_Completo}` : "--"}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Vice-Presidente</strong></td>
                                                    <td>{obj.vicePresidente !== null ? `${obj.vicePresidente.per_Nombre_Completo}` : "--"}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Secretario</strong></td>
                                                    <td>{obj.secretario !== null ? `${obj.secretario.per_Nombre_Completo}` : "--"}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Sub-Secretario</strong></td>
                                                    <td>{obj.subSecretario !== null ? `${obj.subSecretario.per_Nombre_Completo}` : "--"}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Tesorero</strong></td>
                                                    <td>{obj.tesorero !== null ? `${obj.tesorero.per_Nombre_Completo}` : "--"}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Sub-Tesorero</strong></td>
                                                    <td>{obj.subTesorero !== null ? `${obj.subTesorero.per_Nombre_Completo}` : "--"}</td>
                                                </tr>
                                            </>
                                        }
                                    </tbody>
                                )
                            }
                            )}
                        </Table>

                    </CardBody>
                </Card>
            </Container >
        </>
    )
}
