import Layout from "../Layout";
import helpers from "../../components/Helpers";
import {
    Container, Button,
    CardTitle, Card, CardBody, Table, UncontrolledCollapse, Row, Col,
    FormGroup, Input
} from 'reactstrap';
import ReactModal from 'react-modal';
import React, { useEffect, useState, useRef } from 'react';
import TableToExcel from "@linways/table-to-excel";
import jsPDF from 'jspdf';
import moment from 'moment/min/moment-with-locales';
import 'moment/dist/locale/es'
import logo from '../../assets/images/IECE_LogoOficial.jpg'

export default function ReporteMisiones() {
    //Estados
    const [misiones, setMisiones] = useState([])
    const [misionesSectores, setMisionesSectores] = useState([])
    const [numeroMisiones, setNumeroMisiones] = useState("")
    const [infoDis, setInfoDis] = useState([])
    const [infoSec, setInfoSec] = useState([])
    const [infoSecretario, setInfoSecretario] = useState({})
    const dto = JSON.parse(localStorage.getItem("dto"))
    const sector = JSON.parse(localStorage.getItem("sector"))
    const [sectores, setSectores] = useState([])
    const [sectorSeleccionado, setSectorSeleccionado] = useState(null)
    const [entidadTitulo, setEntidadTitulo] = useState("")
    const [lider, setLider] = useState("")
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
            getMisionesDistrito(dto);
            getInfoDistrito();
            getMisionesDeSectores(dto);
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
            getMisionesSector(sector);
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

    const numeroDeMisiones = () => {
        const numerosArray = Array.from(
            { length: misiones.length },
            (_, index) => index + 1
        );

        setNumeroMisiones(numerosArray);
    }

    const getMisionesDistrito = async (dto) => {

        setMensajeDelProceso("Procesando...")
        setModalShow(true)

        try {

            await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/Sector/GetMsionesDeDistrito/${dto}`)
                .then(res => {
                    setMisiones(res.data.misiones ? res.data.misiones : [])
                    numeroDeMisiones()
                    setMensajeDelProceso("")
                    setModalShow(false)
                    window.scrollTo(0, 0)
                }))
        }
        catch (err) {
            alert("Error:\nNo se ha sido posible conectarse a la base de datos del sistema. Intente mas tarde.")
        }
    }

    const getMisionesDeSectores = async (dto) => {

        setMensajeDelProceso("Procesando...")
        setModalShow(true)

        try {

            await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/Mision_Sector/GetMisionesSectores/${dto}`)
                .then(res => {
                    setMisionesSectores(res.data.misiones ? res.data.misiones : [])
                    numeroDeMisiones()
                    setMensajeDelProceso("")
                    setModalShow(false)
                    window.scrollTo(0, 0)
                }))
        }
        catch (err) {
            alert("Error:\nNo se ha sido posible conectarse a la base de datos del sistema. Intente mas tarde.")
        }
    }

    const getMisionesSector = async (sec) => {
        setMensajeDelProceso("Procesando...")
        setModalShow(true)

        await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/Mision_Sector/${sec}`)
            .then(res => {
                setMisiones(res.data.misiones)
                numeroDeMisiones()
                setMensajeDelProceso("")
                setModalShow(false)
                window.scrollTo(0, 0)
            })
        );
    }


    const handle_sectorSeleccionado = async (e) => {

        if (e.target.value !== "todos") {
            console.log("Sector Seleccionado: ", e.target.value)
            getMisionesSector(e.target.value)
            setSectorSeleccionado(e.target.value);
            getTitulo(e.target.value)
        } else {
            getMisionesDistrito();
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
        const book = TableToExcel.tableToBook(table1, { sheet: { name: "Misiones" } });
        TableToExcel.tableToSheet(book, table2, { sheet: { name: "Misiones de Sectores" } });
        TableToExcel.save(book, "Lista de Misiones.xlsx")
    };

    const reportePersonalBautizadoPDF = () => {
        let index = 1
        // INSTANCIA NUEVO OBJETO PARA CREAR PDF
        const doc = new jsPDF("p", "mm", "letter");
        let pageHeight = doc.internal.pageSize.height;
        doc.addImage(logo, 'PNG', 10, 5, 70, 20);
        doc.text("LISTA DE MISIONES", 140, 9, { align: "center", maxWidth: 110 });
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

        if (misiones.length > 0) {
            doc.setFont("", "", "bold");
            yAxis += 3;
            if (sector !== null) { //Si el reporte es de Sector aparece una leyenda y si es de Dto. aparece otra.
                doc.text(`MISIONES DEL SECTOR`, 15, yAxis);
            } else {
                doc.text(`MISIONES DEL DISTRITO`, 15, yAxis);
            }
            yAxis += 7;
            misiones.map(((mision, index) => {
                if (mision != null) {
                    doc.setFont("", "", "bold");
                    doc.text(`MISIÓN ${mision.ms_Numero}: ${mision.ms_Alias}`, 20, yAxis);
                    doc.setFont("", "", "normal");
                    yAxis += 4;
                    index++;
                    if (yAxis >= pageHeight - 10) {
                        doc.addPage();
                        yAxis = 15 // Restart height position
                    }
                }
            }))
        } else {
            if (sector !== null) { //Si el reporte es de Sector aparece una leyenda y si es de Dto. aparece otra.
                yAxis += 4;
                doc.text('NO HAY MISIONES REGISTRADAS EN ESTE SECTOR', 25, yAxis);
            } else {
                yAxis += 4;
                doc.text('NO HAY MISIONES REGISTRADAS EN ESTE DISTRITO', 25, yAxis);
            }
        }

        if (sector !== null) {//Si el reporte es de Sector, se crea un espacio en blanco para que firmas aparezcan mas abajo.
            yAxis += 100;
        }

        yAxis += 2;
        //doc.rect(75, yAxis, 15, 4);
        yAxis += 3;

        if (sector == null) {
            if (misionesSectores !== null) {
                doc.setFillColor(191, 201, 202) // Codigos de color RGB (red, green, blue)
                doc.rect(10, yAxis, 190, 4, "F");
                doc.setFont("", "", "bold");
                yAxis += 3;
                if (sector === null) { //Si el reporte es de Sector aparece una leyenda y si es de Dto. aparece otra.
                    doc.text(`MISIONES DE LOS SECTORES`, 15, yAxis);
                }
                yAxis += 7;
                misionesSectores.map(((mision, index) => {
                    if (mision != null) {
                        doc.setFont("", "", "bold");
                        doc.text(`${mision.sectores.sec_Tipo_Sector} ${mision.sectores.sec_Numero}: ${mision.sectores.sec_Alias}`, 20, yAxis);
                        if (mision.misiones.length > 0) {
                            mision.misiones.map((mission, index) => {
                                doc.setFont("", "", "normal");
                                yAxis += 4;
                                doc.text(`MISIÓN  ${mission.ms_Numero} :  ${mission.ms_Alias.toUpperCase()}`, 25, yAxis);
                            })
                        } else {
                            doc.setFont("", "", "normal");
                            yAxis += 4;
                            doc.text('NO HAY MISIONES REGISTRADAS EN ESTE SECTOR', 25, yAxis);
                            yAxis += 4;
                        }

                        yAxis += 8;

                        index++;
                        if (yAxis >= pageHeight - 10) {
                            doc.addPage();
                            yAxis = 15 // Restart height position
                        }
                    }
                }))
            } else {
                yAxis += 4;
                doc.text('NO HAY MISIONES REGISTRADAS', 25, yAxis);
            }
        }


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
        window.scrollTo(0, 0),
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
                            <CardTitle className="text-center" tag="h3" ref={elementToFocus}>
                                LISTA DE MISIONES DE EVANGELISMO
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
                        <Button size="md" className="text-left categoriasReportes " block id="misiones">{sector == null ? 'MISIONES DEL DISTRITO:' : 'MISONES DEL SECTOR:'}</Button>
                        <UncontrolledCollapse defaultOpen toggler="#misiones">
                            <Card>
                                <CardBody>
                                    {misiones.length > 0 ?
                                        <h5>
                                            <ul type="1">
                                                {
                                                    misiones.map(((mision, index) => {
                                                        return <fragment>
                                                            <li className="list-group d-flex justify-content-between align-items-start ">
                                                                <div className="ms-2 me-auto mb-2">
                                                                    <ul className="list-unstyled pl-4" >
                                                                        <li className="font-weight-normal" style={{ fontSize: '1.2rem' }} key={index}> MISIÓN {mision.ms_Numero}: {mision.ms_Alias}</li>
                                                                    </ul>
                                                                </div>
                                                            </li>
                                                        </fragment>

                                                    }))
                                                }

                                            </ul>
                                        </h5> :
                                        <h4>{sector == null ? 'NO HAY MISIONES REGISTRADAS EN ESTE DISTRITO' : 'NO HAY MISIONES REGISTRADAS DE ESTE SECTOR'}</h4>
                                    }
                                </CardBody>
                            </Card>


                        </UncontrolledCollapse>

                        {sector == null && misionesSectores ?
                            <UncontrolledCollapse defaultOpen toggler="#adultos_mujeres">
                                <Button size="md" className="text-left categoriasReportes mt-2" block id="adultos_mujeres">MISIONES DE SECTORES </Button>
                                <Card>
                                    <CardBody>
                                        <h5>
                                            <ul type="1">
                                                {
                                                    misionesSectores.map(((mision, index) => {
                                                        return <fragment>
                                                            <li className="list-group d-flex justify-content-between align-items-start mb-3">
                                                                <div className="ms-2 me-auto mb-2">
                                                                    <div className="font-weight-normal" style={{ fontSize: '1.2rem' }} key={index}>{mision.sectores.sec_Tipo_Sector} {mision.sectores.sec_Numero}: {mision.sectores.sec_Alias}</div>
                                                                    {mision.misiones.length > 0 ?
                                                                        mision.misiones.map((mission, index) => {
                                                                            return <ul className="list-unstyled pl-4" >
                                                                                <li className="font-weight-light" style={{ fontSize: '1.1rem' }} key={index}> MISIÓN {mission.ms_Numero}: {mission.ms_Alias}</li>
                                                                            </ul>
                                                                        }) :
                                                                        <ul className="list-unstyled pl-4" >
                                                                            <li className="font-weight-light" style={{ fontSize: '1.1rem' }} key={index}>NO HAY MISIONES REGISTRADAS EN ESTE SECTOR</li>
                                                                        </ul>}
                                                                </div>
                                                            </li>
                                                        </fragment>

                                                    }))
                                                }

                                            </ul>
                                        </h5>
                                    </CardBody>
                                </Card>
                            </UncontrolledCollapse> :
                            <h4></h4>
                        }
                        <div className="pb-7"></div>
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
                        Listas de Misiones de Evangelismo
                        <h5>Distrito: {JSON.parse(localStorage.getItem("infoSesion")).dis_Alias}</h5>
                        {sector ? <h5>Sector: {JSON.parse(localStorage.getItem("infoSesion")).sec_Alias}</h5> : null}
                    </CardTitle>
                    <CardBody>
                        <Table responsive hover id="table1" data-cols-width="30,40">
                            <thead className="text-center bg-gradient-info">
                                <tr>
                                    <th >MISION</th>
                                    <th >NOMBRE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {misiones ? misiones.map((obj, index) => {
                                    return (

                                        <tr key={index}>
                                            <td><b>MISIÓN {obj.ms_Numero}</b></td>
                                            <td>{obj.ms_Alias != null ? obj.ms_Alias : ""}</td>
                                        </tr>
                                    )
                                }) :
                                    (
                                        <tr >
                                            <td><b>No ha misiones registradas</b></td>
                                            <td></td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </Table>

                        <table responsive hover id="table2" data-cols-width="60,60" >
                            <thead className="text-center bg-gradient-info">
                                <tr>
                                    <th>SECTOR</th>
                                    <th>MISIÓN</th>
                                </tr>
                            </thead>
                            <tbody>
                                {misionesSectores ? misionesSectores.map(mision => (
                                    <>
                                        <tr>
                                            <td>MISIÓN  {mision.sectores.sec_Tipo_Sector} {mision.sectores.sec_Numero}: {mision.sectores.sec_Alias} </td>
                                        </tr>
                                        {mision.misiones.map((mission, index) => {
                                            return mission ? <tr>
                                                <td></td>
                                                <td>MISIÓN {mission.ms_Numero}: {mission.ms_Alias} </td>
                                            </tr> : <tr>
                                                <td></td>
                                                <td>NO HAY MISIONES REGISTRADAS</td>
                                            </tr>
                                        })}
                                    </>
                                )) :
                                    (
                                        <tr className="spacer">
                                            <td><b>NO HAY MISIONES REGISTRADAS</b></td>
                                            <td></td>
                                        </tr>
                                    )}
                            </tbody>
                        </table>

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
