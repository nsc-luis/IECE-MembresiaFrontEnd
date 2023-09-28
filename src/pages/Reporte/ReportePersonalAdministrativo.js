import Layout from "../Layout";
import helpers from "../../components/Helpers";
import {
    Container, Button,
    CardTitle, Card, CardBody, Table, UncontrolledCollapse, Row, Col,
    FormGroup, Input
} from 'reactstrap';

import React, { useEffect, useState, } from 'react';
import TableToExcel from "@linways/table-to-excel";
import jsPDF from 'jspdf';
import moment from 'moment/min/moment-with-locales';
import 'moment/dist/locale/es'
import logo from '../../assets/images/IECE_LogoOficial.jpg'

export default function ReportePersonalAdministrativo() {
    //Estados
    const [comisiones, setComisiones] = useState([])
    const [personalAdministrativo, setPersonalAdministrativo] = useState([])
    const [infoDis, setInfoDis] = useState([])
    const [infoSec, setInfoSec] = useState([])
    const [infoSecretario, setInfoSecretario] = useState({})
    const dto = JSON.parse(localStorage.getItem("dto"))
    const sector = JSON.parse(localStorage.getItem("sector"))
    const [sectores, setSectores] = useState([])
    const [sectorSeleccionado, setSectorSeleccionado] = useState(null)
    const [entidadTitulo, setEntidadTitulo] = useState("")
    const [lider, setLider] = useState("")
    //Llamadas en render

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {

        if (sector == null) { //Para Sesión Obispo
            console.log("inicia programa")
            getComisionesDistrito(dto);
            getPersonalAdministrativoDistrito(dto);
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
            getComisionesSector(sector);
            getPersonalAdministrativoSector(sector);
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
        console.log("Dto: ", dto)
        helpers.validaToken().then(helpers.authAxios.get("/Distrito/" + dto)
            .then(res => {
                setInfoDis(res.data)
                console.log("Distrito: ", res.data)
                //setEntidadTitulo(res.data.dis_Tipo_Distrito + " " + (res.data.dis_Tipo_Distrito == "MISION" ? "" : "No. " + res.data.dis_Numero + ": ") + res.data.dis_Alias)
            })
        )
    }

    const getComisionesDistrito = (dto) => {
        helpers.validaToken().then(helpers.authAxios.get("/Integrante_Comision_Distrital/GetComisionesByDistrito/" + dto)
            .then(res => {
                console.log("respuesta: ", res.data.comisiones)
                setComisiones(res.data.comisiones)
            })
        );
    }

    const getComisionesSector = (sec) => {

        helpers.validaToken().then(helpers.authAxios.get("/Integrante_Comision_Local/GetComisionesBySector/" + sec)
            .then(res => {
                console.log("respuesta: ", res.data.comisiones)
                setComisiones(res.data.comisiones)
            })
        );
    }

    const getPersonalAdministrativoSector = (sec) => {

        helpers.validaToken().then(helpers.authAxios.get("/PersonalMinisterial/GetPersonalAdministrativoSecundarioBySector/" + sec)
            .then(res => {
                console.log("respuesta: ", res.data.administrativo)
                setPersonalAdministrativo(res.data.administrativo)
            })
        );
    }


    const getPersonalAdministrativoDistrito = (dto) => {

        helpers.validaToken().then(helpers.authAxios.get("/PersonalMinisterial/GetPersonalAdministrativoSecundarioByDistrito/" + dto)
            .then(res => {
                console.log("respuesta: ", res.data.administrativo)
                setPersonalAdministrativo(res.data.administrativo)
            })
        );
    }

    const handle_sectorSeleccionado = async (e) => {

        if (e.target.value !== "todos") {
            console.log("Sector Seleccionado: ", e.target.value)
            getComisionesSector(e.target.value)
            getPersonalAdministrativoSector(e.target.value)
            setSectorSeleccionado(e.target.value);
            getTitulo(e.target.value)
        } else {
            getComisionesDistrito();
            getPersonalAdministrativoDistrito(dto)
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
        const table1 = document.getElementById("table1");
        const table2 = document.getElementById("table2");
        const book = TableToExcel.tableToBook(table1, { sheet: { name: "Administración" } });
        TableToExcel.tableToSheet(book, table2, { sheet: { name: "Comisiones" } });
        TableToExcel.save(book, "PersonalMinisterialyComisiones.xlsx")
    };

    const reportePersonalBautizadoPDF = () => {
        let index = 1
        // INSTANCIA NUEVO OBJETO PARA CREAR PDF
        const doc = new jsPDF("p", "mm", "letter");
        let pageHeight = doc.internal.pageSize.height;
        doc.addImage(logo, 'PNG', 10, 5, 70, 20);
        doc.text("LISTA DE PERSONAL ADMINISTRATIVO Y COMISIONES", 140, 9, { align: "center", maxWidth: 110 });
        doc.setFontSize(10);

        if (sector) {
            doc.text(entidadTitulo, 140, 24, { align: "center" });
        }
        else {
            doc.text(`${infoDis.dis_Tipo_Distrito} ${infoDis.dis_Numero}: ${infoDis.dis_Alias}`, 140, 21, { align: "center" })
            doc.text(entidadTitulo, 140, 26, { align: "center" })
        }
        doc.line(10, 32, 200, 32);

        doc.setFontSize(8);
        let yAxis = 35
        doc.setFillColor(191, 201, 202) // Codigos de color RGB (red, green, blue)
        doc.rect(10, yAxis, 190, 4, "F");
        doc.setFont("", "", "bold");
        yAxis += 3;
        doc.text("ADMINISTRACIÓN", 15, yAxis);
        yAxis += 7;
        personalAdministrativo.map(((cargo, index) => {
            if (cargo.datosPersonalMinisterial != null) {
                doc.setFont("", "", "bold");
                doc.text(`${cargo.cargo}`, 20, yAxis);
                doc.setFont("", "", "normal");
                yAxis += 4;
                doc.text(`${cargo.datosPersonalMinisterial.pem_Nombre}`, 25, yAxis);
                yAxis += 4;
                index++;
                if (yAxis >= pageHeight - 10) {
                    doc.addPage();
                    yAxis = 15 // Restart height position
                }
            }
        }))


        index = 1;
        yAxis += 7;
        doc.setFillColor(191, 201, 202) // Codigos de color RGB (red, green, blue)
        doc.rect(10, yAxis, 190, 4, "F");
        doc.setFont("", "", "bold");
        yAxis += 3;
        doc.text("COMISIONES", 15, yAxis);
        yAxis += 7;
        comisiones.map((comision) => {
            doc.setFont("", "", "bold");
            if (comision.integrantes.length > 0) {
                doc.text(`${comision.comision}`, 20, yAxis);
                comision.integrantes.map((integrante) => {
                    doc.setFont("", "", "normal");
                    yAxis += 4;
                    doc.text(`${integrante.integrante}`, 25, yAxis);
                })
                yAxis += 4;
                index++;
                if (yAxis >= pageHeight - 10) {
                    doc.addPage();
                    yAxis = 15 // Restart height position
                }
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
                                LISTA DE PERSONAL ADMINISTRATIVO Y COMISIONES
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
                        <UncontrolledCollapse defaultOpen toggler="#adultos_hombres">
                            <Button size="md" className="text-left categoriasReportes " block id="adultos_hombres">ADMINISTRACIÓN</Button>

                            <Card>
                                <CardBody>
                                    <h5>
                                        <ul type="1">
                                            {
                                                personalAdministrativo.map(((cargo, index) => {
                                                    if (cargo.datosPersonalMinisterial != null) {
                                                        return <fragment>
                                                            <li className="list-group d-flex justify-content-between align-items-start">
                                                                <div className="ms-2 me-auto mb-2">
                                                                    <div className="font-weight-bold" style={{ fontSize: '1.2rem' }} key={index}>{cargo.cargo}</div>
                                                                    <ul className="list-unstyled pl-3" >
                                                                        <li className="font-weight-light" style={{ fontSize: '1.1rem' }} key={index}>{cargo.datosPersonalMinisterial.pem_Nombre}</li>
                                                                    </ul>
                                                                </div>
                                                            </li>
                                                        </fragment>
                                                    }
                                                }))
                                            }

                                        </ul>
                                    </h5>
                                </CardBody>
                            </Card>
                        </UncontrolledCollapse>

                        <Button size="md" className="text-left categoriasReportes mt-2" block id="adultos_mujeres">COMISIONES</Button>
                        <UncontrolledCollapse defaultOpen toggler="#adultos_mujeres">
                            <Card>
                                <CardBody>
                                    <h5>
                                        <ul type="1">
                                            {
                                                comisiones.map((comision => {
                                                    if (comision.integrantes.length > 0) {
                                                        return <fragment>
                                                            <li className="list-group d-flex justify-content-between align-items-start">
                                                                <div className="ms-2 me-auto mb-2">
                                                                    <div className="font-weight-bold" style={{ fontSize: '1.2rem' }} key={comision.comision_Id}>{comision.comision}</div>
                                                                    <ol>
                                                                        {comision.integrantes.map((integrante => {
                                                                            return <fragment>
                                                                                <li className="font-weight-light" style={{ fontSize: '1.1rem' }} key={integrante.integrante_comision_Id}>{integrante.integrante}</li>
                                                                            </fragment>
                                                                        }))}
                                                                    </ol>
                                                                </div>
                                                            </li>
                                                        </fragment>
                                                    }
                                                }))
                                            }

                                        </ul>
                                    </h5>
                                </CardBody>
                            </Card>
                        </UncontrolledCollapse>

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
                        Reporte de Personal Administrativo
                        <h5>Distrito: {JSON.parse(localStorage.getItem("infoSesion")).dis_Alias}</h5>
                        {sector ? <h5>Sector: {JSON.parse(localStorage.getItem("infoSesion")).sec_Alias}</h5> : null}
                    </CardTitle>
                    <CardBody>
                        <Table responsive hover id="table1" data-cols-width="30,40,20">
                            <thead className="text-center bg-gradient-info">
                                <th >CARGO</th>
                                <th >NOMBRE</th>
                                <th >GRADO</th>
                            </thead>
                            <tbody>
                                {personalAdministrativo.map((obj, index) => {
                                    return (
                                        <tr key={index}>
                                            <td><b>{obj.cargo}</b></td>
                                            <td>{obj.datosPersonalMinisterial != null ? obj.datosPersonalMinisterial.pem_Nombre : ""}</td>
                                            <td>{obj.datosPersonalMinisterial != null ? obj.datosPersonalMinisterial.pem_Grado_Ministerial : ""}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>

                        <table responsive hover id="table2" data-cols-width="30,40,20">
                            <thead className="text-center bg-gradient-info">
                                <tr>
                                    <th>COMISIÓN</th>
                                    <th >NOMBRE</th>
                                    <th >ORDEN/JERARQUÍA</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comisiones.map((item) => (
                                    item.integrantes.map((persona) => {
                                        return <tr>
                                            <td>{persona.comision} </td>
                                            <td>{persona.integrante} </td>
                                            <td>{persona.jerarquia} </td>
                                        </tr>
                                    })
                                ))}
                            </tbody>
                        </table>

                    </CardBody>
                </Card>
            </Container>
        </>
    )
}
