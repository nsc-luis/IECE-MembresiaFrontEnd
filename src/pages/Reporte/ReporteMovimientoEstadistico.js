import Layout from "../Layout";
import helpers from "../../components/Helpers";
import {
    Container, Button, Input,
    CardTitle, Card, CardBody, Table, UncontrolledCollapse, Row, Col, FormGroup
} from 'reactstrap';

import React, { Fragment, useEffect, useState } from 'react';
import TableToExcel from "@linways/table-to-excel";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'
import Moment from "react-moment";
import moment from 'moment/min/moment-with-locales';
import 'moment/locale/es';
import 'moment/dist/locale/es'
import logo from '../../assets/images/IECE_LogoOficial.jpg'

export default function ReporteMovimientoEstadistico() {
    //Estados
    const [bautismos, setBautismos] = useState(null)
    const [restituciones, setRestituciones] = useState(null)
    const [altasCambioDom, setAltasCambioDom] = useState(null)
    const [defunciones, setDefunciones] = useState(null)
    const [excomunionesTemp, setExcomunionesTemp] = useState(null)
    const [excomuniones, setExcomuniones] = useState(null)
    const [bajasCambioDom, setBajasCambiosDom] = useState(null)
    const [actualizacionB, setActualizacionB] = useState(null)
    const [nuevoIngreso, setNuevoIngreso] = useState(null)
    const [altasCambioDomNB, setAltasCambioDomNB] = useState(null)
    const [reactivaciones, setReactivaciones] = useState(null)
    const [defuncionesNB, setDefuncionesNB] = useState(null)
    const [alejamientos, setAlejamientos] = useState(null)
    const [bajasCambioDomNB, setBajasCambioDomNB] = useState(null)
    const [cambiosABautizado, setCambiosABautizado] = useState(null)
    const [bajasPorPadres, setBajasPorPadres] = useState(null)
    const [actualizacionNB, setActualizacionNB] = useState(null)
    const [matrimonios, setMatrimonios] = useState(null)
    const [legalizaciones, setLegalizaciones] = useState(null)
    const [presentacionesNiños, setPresentacionesNiños] = useState(null)
    const [altasHogares, setAltasHogares] = useState(null)
    const [bajasHogares, setBajasHogares] = useState(null)
    const [actualizacionHogar, setActualizacionHogar] = useState(null)

    const [excelData, setExcelData] = useState([])

    const [infoDis, setInfoDis] = useState([])
    const [infoSec, setInfoSec] = useState([])
    const [infoSecretario, setInfoSecretario] = useState("")
    const [loading, setLoading] = useState(true)

    const [startDate, setStartDate] = useState(moment().startOf('month').format("YYYY-MM-DD"))
    const [endDate, setEndDate] = useState(moment().endOf('month').format("YYYY-MM-DD"))

    const dto = JSON.parse(localStorage.getItem("dto"))
    const sector = JSON.parse(localStorage.getItem("sector"))
    const [dataGeneral, setDataGeneral] = useState(null)
    const [sectores, setSectores] = useState([])
    const [lider, setLider] = useState("")
    const [sectorSeleccionado, setSectorSeleccionado] = useState(null)
    const [entidadTitulo, setEntidadTitulo] = useState("")


    //Llamadas en render
    useEffect(() => {
        window.scrollTo(0, 0)
        loadData()
    }, [])

    const params = {
        fechaInicial: startDate,
        fechaFinal: endDate,
    }

    const loadData = async () => {
        // const codes = [11001, 11002, 11004, 11101, 11102,11103,11105,21001, 21102,23203,31001,31102]

        if (sector === null) {
            getDataDistrito();
            await helpers.validaToken().then(helpers.authAxios.get("/Distrito/" + dto)
                .then(resDto => {
                    setInfoDis(resDto.data)
                }))

            setSectorSeleccionado("todos");
            setLider("OBISPO")
            setEntidadTitulo("TODOS LOS SECTORES")

            helpers.validaToken().then(helpers.authAxios.get("/PersonalMinisterial/GetSecretarioByDistrito/" + dto)
                .then(res => {
                    setInfoSecretario(res.data.infoSecretario.length > 0 ? res.data.infoSecretario[0].pem_Nombre : "")
                })
            );

            helpers.validaToken().then(helpers.authAxios.get('/Sector/GetSectoresByDistrito/' + dto)
                .then(res => {
                    setSectores(res.data.sectores.filter(sec => sec.sec_Tipo_Sector == "SECTOR"))
                })
            )
        } else {
            getDataSector(sector);
            await helpers.validaToken().then(helpers.authAxios.get("/Distrito/" + dto)
                .then(resDto => {
                    console.log("InfoDis: ", resDto.data);
                    setInfoDis(resDto.data)

                }))
            await helpers.validaToken().then(helpers.authAxios.get("/Sector/" + sector)
                .then(resSec => {
                    setInfoSec(resSec.data.sector[0])
                    const sectores = []
                    sectores.push(resSec.data.sector[0])
                    setSectores(sectores);
                    setSectorSeleccionado(sector)
                    setEntidadTitulo(sectores[0].sec_Tipo_Sector + " " + sectores[0].sec_Numero + " " + sectores[0].sec_Alias)
                }))


            await helpers.validaToken().then(helpers.authAxios.get("/PersonalMinisterial/GetSecretarioBySector/" + sector)
                .then(res => {
                    setInfoSecretario(res.data.infoSecretario.length > 0 ? res.data.infoSecretario[0].pem_Nombre : "")
                    setLider("PASTOR")
                })


            )


        }
    }

    const getDataSector = async (sec) => {
        params.idSectorDistrito = sec
        console.log("Sector: ", params.idSectorDistrito);
        await helpers.validaToken().then(helpers.authAxios.post("/Historial_Transacciones_Estadisticas/HistorialPorFechaSector", params)
            .then(res => {
                console.log("DatosApi: ", res.data);
                setDataGeneral(res.data.datos)
                orderData(res.data.datos)

                setExcelData(res.data.datos)

                console.log("res-data-datos: ", res.data.datos);

            })

        )
    }

    const getDataDistrito = async () => {
        params.idSectorDistrito = dto
        await helpers.validaToken().then(helpers.authAxios.post("/Historial_Transacciones_Estadisticas/HistorialPorFechaDistrito", params)
            .then(res => {
                orderData(res.data.datos)
                setExcelData(res.data.datos)
            }))
    }

    const handle_sectorSeleccionado = async (e) => {

        if (e.target.value !== "todos") {

            getDataSector(e.target.value)
            setSectorSeleccionado(e.target.value);
            getTitulo(e.target.value)
        } else {
            getDataDistrito();
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
    const orderData = (trans) => {
        setBautismos(trans.filter(t => t.ct_Codigo_Transaccion === 11001))
        setRestituciones(trans.filter(t => t.ct_Codigo_Transaccion === 11002))
        setAltasCambioDom(trans.filter(t => sector ? t.ct_Codigo_Transaccion === 11003 || t.ct_Codigo_Transaccion === 11004 : t.ct_Codigo_Transaccion === 11004))
        setDefunciones(trans.filter(t => t.ct_Codigo_Transaccion === 11101))
        setExcomunionesTemp(trans.filter(t => t.ct_Codigo_Transaccion === 11102))
        setExcomuniones(trans.filter(t => t.ct_Codigo_Transaccion === 11103))
        setBajasCambiosDom(trans.filter(t => sector ? t.ct_Codigo_Transaccion === 11104 || t.ct_Codigo_Transaccion === 11105 : t.ct_Codigo_Transaccion === 11105))
        setActualizacionB(trans.filter(t => t.ct_Codigo_Transaccion === 11201))
        setNuevoIngreso(trans.filter(t => t.ct_Codigo_Transaccion === 12001))
        setAltasCambioDomNB(trans.filter(t => sector ? t.ct_Codigo_Transaccion === 12002 || t.ct_Codigo_Transaccion === 12003 : t.ct_Codigo_Transaccion === 12003))
        setReactivaciones(trans.filter(t => t.ct_Codigo_Transaccion === 12004))
        setDefuncionesNB(trans.filter(t => t.ct_Codigo_Transaccion === 12101))
        setAlejamientos(trans.filter(t => t.ct_Codigo_Transaccion === 12102))
        setBajasCambioDomNB(trans.filter(t => sector ? t.ct_Codigo_Transaccion === 12103 || t.ct_Codigo_Transaccion === 12104 : t.ct_Codigo_Transaccion === 12104))
        setCambiosABautizado(trans.filter(t => t.ct_Codigo_Transaccion === 12105))
        setBajasPorPadres(trans.filter(t => t.ct_Codigo_Transaccion === 12106))
        setActualizacionNB(trans.filter(t => t.ct_Codigo_Transaccion === 12201))
        setMatrimonios(trans.filter(t => t.ct_Codigo_Transaccion === 21001))
        setLegalizaciones(trans.filter(t => t.ct_Codigo_Transaccion === 21102))
        setPresentacionesNiños(trans.filter(t => t.ct_Codigo_Transaccion === 23203))
        setAltasHogares(trans.filter(t => t.ct_Codigo_Transaccion === 31001))
        setBajasHogares(trans.filter(t => t.ct_Codigo_Transaccion === 31102))
        setActualizacionHogar(trans.filter(t => t.ct_Codigo_Transaccion === 31203))


        setLoading(false)

    }

    const downloadTable = () => {
        TableToExcel.convert(document.getElementById("table1"), {
            name: "Reporte_Movimiento_Estadistico.xlsx",
            sheet: {
                name: "Hoja 1"
            }
        });
    }

    const handleStartDate = (e) => {
        setStartDate(moment(e.value).format("YYYY-MM-DD"))
    }
    const handleEndDate = (e) => {
        setEndDate(moment(e.value).format("YYYY-MM-DD"))
    }

    const handleDownloadPDF = () => {
        // INSTANCIA NUEVO OBJETO PARA CREAR PDF
        const doc = new jsPDF("p", "mm", "letter");

        const headers = [
            'No.',
            'Tipo',
            'Subtipo',
            'Nombre',
            'Comentario',
            'Fecha'
        ]

        doc.setFontSize(14);
        doc.addImage(logo, 'PNG', 10, 5, 70, 20);
        doc.text("REPORTE DE MOVIMIENTO ESTADISTICO", 140, 10, { align: "center" });
        doc.setFontSize(8);

        if (sector) {
            doc.text(entidadTitulo, 140, 18, { align: "center" });
            //doc.text(`AL DÍA ${moment().format('LL').toUpperCase()}`, 135, 23, {align:"center"});
        }
        else {
            doc.text(`${infoDis.dis_Tipo_Distrito} ${infoDis.dis_Numero}: ${infoDis.dis_Alias}`, 140, 16, { align: "center" })
            doc.text(entidadTitulo, 140, 22, { align: "center" })
            //doc.text(`AL DÍA ${moment().format('LL').toUpperCase()}`, 135, 23, {align:"center"});
        }
        doc.line(10, 32, 200, 32);

        doc.line(10, 28, 200, 28);

        let yAxis = 30;
        const dataUnida = (data) => {
            if (yAxis > 230) {
                doc.addPage()
                yAxis = 5
            }
            if (data.length > 0) {
                yAxis += 3;
            }

            data = data.map((persona, index) => ([
                (index + 1).toString(),
                persona.ct_Tipo,
                persona.ct_Subtipo,
                persona.per_Nombre + ' ' + persona.apellidoPrincipal + ' ' + (persona.per_Apellido_Materno ? persona.per_Apellido_Materno : ""),
                typeof persona.hte_Comentario?.trim() !== "string" || persona.hte_Comentario?.trim() === "" ? "-" : persona.hte_Comentario?.trim(),
                (moment(persona.hte_Fecha_Transaccion).format("DD/MM/YYYY")).toString(),
            ]))

            autoTable(doc,
                {
                    head: [headers],
                    body: data,
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
        }


        let categoriaTodas = []; //Para unir todos los Arrays de las Categorias en un Solo Array
        categoriaTodas = categoriaTodas.concat(actualizacionB,
            bautismos, restituciones, altasCambioDom, bajasCambioDom, defunciones, excomunionesTemp, excomuniones,
            actualizacionNB, nuevoIngreso, altasCambioDomNB, reactivaciones,
            bajasCambioDomNB, defuncionesNB, alejamientos, cambiosABautizado, bajasPorPadres,
            matrimonios, legalizaciones, presentacionesNiños,
            altasHogares, bajasHogares, actualizacionHogar
        )

        console.log("categorias-ordenadas: ", categoriaTodas);

        dataUnida(categoriaTodas);

        if (yAxis > 230) {
            doc.addPage()
            yAxis = 10
        }

        doc.setFontSize(8);
        yAxis += 10;
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
        doc.setFont("", "", "bold");
        doc.text(`${JSON.parse(localStorage.getItem("infoSesion")).pem_Nombre}`, 130, yAxis);
        doc.text(`${infoSecretario}`, 40, yAxis);

        doc.save("ReporteMovimientoEstadistico.pdf");
    }


    const TableRow = (props) => {
        const data = props.data
        const label = props.label
        const total = props.total

        if (data.length > 0) {
            return (
                <>
                    <tbody>
                        <tr className="border" >
                            <th colSpan={8}><h5>{label}</h5></th>
                        </tr>
                    </tbody>
                    {data.map((persona, index) => (
                        <tbody>
                            <tr className="border">
                                <td width="5%">{index + 1}</td>
                                <td width="10%">{persona.ct_Tipo}</td>
                                <td width="15%">{persona.ct_Subtipo}</td>
                                <td width="25%">{persona.per_Nombre} {persona.apellidoPrincipal} {persona.per_Apellido_Materno}</td>
                                <td width="35%">{persona.hte_Comentario}</td>
                                <td width="10%">{moment(persona.hte_Fecha_Transaccion).format("DD/MMM/YYYY")}</td>
                            </tr>
                        </tbody>
                    ))}
                    <tr className="border">
                        <th className="text-right" colSpan="12 mr-3" >Total por {label}: {total} </th>
                    </tr>
                    <tr><br></br></tr>
                </>
            )
        } else {
            return (
                <>
                    <tr className="border">
                        <th className="text-right mr-3" colSpan="12 ">Total por {label}: {total} </th>
                    </tr>
                </>
            )
        }

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

                <Button className="btn-success m-3 " onClick={downloadTable}><i className="fas fa-file-excel mr-2"></i>Descargar Excel</Button>
                <Button className="btn-danger m-3 " onClick={handleDownloadPDF}><i className="fas fa-file-pdf mr-2"></i>Descargar PDF</Button>
                {/* TABLA */}
                <Card body id="pdf">
                    <CardTitle className="text-center" tag="h3">
                        {!loading ?
                            <Row>
                                <Col lg="3">
                                    <img src={logo} alt=" Logo" width="100%"></img>
                                </Col>
                                <Col>
                                    REPORTE DE MOVIMIENTO ESTADISTICO PERIÓDICO

                                    {sector ? <h5>Sector: {infoSec.sec_Alias}</h5> : <h5>Distrito: {infoDis.dis_Alias}</h5>}
                                </Col>
                            </Row>
                            : ""
                        }
                    </CardTitle>
                    {!loading ?
                        <CardBody>
                            <Row className="m-3 justify-content-center">
                                <Col lg="1" className="text-center">
                                    <h4>De:</h4>
                                </Col>
                                <Col lg="3" className="text-center">
                                    <Input type="date" value={startDate} onInput={(e) => handleStartDate(e.target)}></Input>
                                </Col>
                                <Col lg="1" className="text-center">
                                    <h4>Al:</h4>
                                </Col>
                                <Col lg="3" className="text-center">
                                    <Input type="date" value={endDate} onInput={(e) => handleEndDate(e.target)}></Input>
                                </Col>
                                <Col lg="2" className="text-center">
                                    <Button color="primary" onClick={() => loadData()}>Buscar</Button>
                                </Col>
                            </Row>

                            {/* <Button color="primary" size="lg" className="text-left mb-2" block id="altas">Altas</Button>
                        <UncontrolledCollapse defaultOpen toggler="#altas"> */}
                            <Card>
                                <CardBody>
                                    <Table size="sm" className="border">
                                        <tr className="text-center border">
                                            <th width="5%"><h5>No. </h5></th>
                                            <th width="10%"><h5>Tipo Mov.</h5></th>
                                            <th width="15%"><h5>Subtipo Mov.</h5></th>
                                            <th width="25%"><h5>Nombre </h5></th>
                                            <th width="35%"><h5>Comentario</h5></th>
                                            <th width="10%"><h5>Fecha</h5></th>
                                        </tr>
                                    </Table>
                                    <Table size="sm">
                                        <tr className="categoriasReportes" >
                                            <td colSpan="12">
                                                <h4><strong>MEMBRESIA BAUTIZADA</strong></h4>
                                            </td>
                                        </tr>
                                        <tr className="subCategoriasReportes">
                                            <td colSpan="12">
                                                <h6 fontSize="4"><strong>ACTUALIZACIONES</strong></h6>
                                            </td>
                                        </tr>

                                        <TableRow label={'Actualización'} data={actualizacionB} total={actualizacionB ? actualizacionB.length : 0} />

                                        <tr className="subCategoriasReportes">
                                            <td colSpan="12">
                                                <h6 fontSize="4"><strong>ALTAS</strong></h6>
                                            </td>
                                        </tr>

                                        <TableRow label={'Bautismo'} data={bautismos} total={bautismos ? bautismos.length : 0} />
                                        <TableRow label={'Restitución'} data={restituciones} total={restituciones ? restituciones.length : 0} />
                                        <TableRow label={'Cambio de Domicilio'} data={altasCambioDom} total={altasCambioDom ? altasCambioDom.length : 0} />

                                        <tr className="subCategoriasReportes">
                                            <td colSpan="12">
                                                <h6 fontSize="4"><strong>BAJAS</strong></h6>
                                            </td>
                                        </tr>

                                        <TableRow label={'Excomunión'} data={excomuniones} total={excomuniones ? excomuniones.length : 0} />
                                        <TableRow label={'Excomunión Temporal'} data={excomunionesTemp} total={excomunionesTemp ? excomunionesTemp.length : 0} />
                                        <TableRow label={'Baja Cambio Domicilio'} data={bajasCambioDom} total={bajasCambioDom ? bajasCambioDom.length : 0} />
                                        <TableRow label={'Defunción'} data={defunciones} total={defunciones ? defunciones.length : 0} />
                                    </Table>
                                    <Table size="sm">
                                        <tr className="categoriasReportes">
                                            <td colSpan="12">
                                                <h4><strong>MEMBRESIA NO BAUTIZADA</strong></h4>
                                            </td>
                                        </tr>

                                        <tr className="subCategoriasReportes">
                                            <td colSpan="12">
                                                <h6 fontSize="4"><strong>ACTUALIZACIONES</strong></h6>
                                            </td>
                                        </tr>

                                        <TableRow label={'Actualización No Bautizado'} data={actualizacionNB} total={actualizacionNB ? actualizacionNB.length : 0} />

                                        <tr className="subCategoriasReportes">
                                            <td colSpan="12">
                                                <h6 fontSize="4"><strong>ALTAS</strong></h6>
                                            </td>
                                        </tr>

                                        <TableRow label={'Nuevo Ingreso'} data={nuevoIngreso} total={nuevoIngreso ? nuevoIngreso.length : 0} />
                                        <TableRow label={'Cambio de Domicilio'} data={altasCambioDomNB} total={altasCambioDomNB ? altasCambioDomNB.length : 0} />
                                        <TableRow label={'Reactivación'} data={reactivaciones} total={reactivaciones ? reactivaciones.length : 0} />

                                        <tr className="subCategoriasReportes">
                                            <td colSpan="12">
                                                <h6 fontSize="4"><strong>BAJAS</strong></h6>
                                            </td>
                                        </tr>

                                        <TableRow label={'Defunción'} data={defuncionesNB} total={defuncionesNB ? defuncionesNB.length : 0} />
                                        <TableRow label={'Cambio de Domicilio'} data={bajasCambioDomNB} total={bajasCambioDomNB ? bajasCambioDomNB.length : 0} />
                                        <TableRow label={'Alejamiento'} data={alejamientos} total={alejamientos ? alejamientos.length : 0} />
                                        <TableRow label={'Pasa a Personal Bautizado'} data={cambiosABautizado} total={cambiosABautizado ? cambiosABautizado.length : 0} />
                                        <TableRow label={'Por Baja de Padres'} data={bajasPorPadres} total={bajasPorPadres ? bajasPorPadres.length : 0} />
                                    </Table>
                                    <Table size="sm">
                                        <tr className="categoriasReportes">
                                            <td colSpan="12">
                                                <h4><strong>HOGARES</strong></h4>
                                            </td>
                                        </tr>

                                        <tr className="subCategoriasReportes">
                                            <td colSpan="5">
                                                <h6 fontSize="4"><strong>ACTUALIZACIONES</strong></h6>
                                            </td>
                                        </tr>

                                        <TableRow label={'Actualizaciones'} data={actualizacionHogar} total={actualizacionHogar ? actualizacionHogar.length : 0} />

                                        <tr className="subCategoriasReportes">
                                            <td colSpan="12">
                                                <h6 fontSize="4"><strong>ALTAS</strong></h6>
                                            </td>
                                        </tr>

                                        <TableRow label={'Alta Hogares'} data={altasHogares} total={altasHogares ? altasHogares.length : 0} />

                                        <tr className="subCategoriasReportes">
                                            <td colSpan="12">
                                                <h6 fontSize="4"><strong>BAJAS</strong></h6>
                                            </td>
                                        </tr>
                                        <TableRow label={'Baja Hogares'} data={bajasHogares} total={bajasHogares ? bajasHogares.length : 0} />
                                    </Table>
                                    <Table size="sm">
                                        <tr className="categoriasReportes">
                                            <td colSpan="12">
                                                <h4><strong>SUCESOS</strong></h4>
                                            </td>
                                        </tr>

                                        <tr className="subCategoriasReportes">
                                            <td colSpan="12">
                                                <h6 fontSize="4"><strong>MATRIMONIOS</strong></h6>
                                            </td>
                                        </tr>

                                        <TableRow label={'Matrimonios'} data={matrimonios} total={matrimonios ? matrimonios.length / 2 : 0} />

                                        <tr className="subCategoriasReportes">
                                            <td colSpan="12">
                                                <h6 fontSize="4"><strong>LEGALIZACIONES</strong></h6>
                                            </td>
                                        </tr>

                                        <TableRow label={'Legalizaciones'} data={legalizaciones} total={legalizaciones ? legalizaciones.length / 2 : 0} />

                                        <tr className="subCategoriasReportes">
                                            <td colSpan="12">
                                                <h6 fontSize="4"><strong>PRESENTACIÓN DE NIÑOS</strong></h6>
                                            </td>
                                        </tr>

                                        <TableRow label={'Presentaciones de Niños'} data={presentacionesNiños} total={presentacionesNiños ? presentacionesNiños.length : 0} />

                                    </Table>
                                </CardBody>
                            </Card>
                            {/* <h4 className="text-center m-4">Justicia y Verdad</h4>
                            {sector ?
                                <h4 className="text-center m-4"><Moment locale="es" format="LL"></Moment></h4> :
                                <h4 className="text-center m-4"><Moment locale="es" format="LL"></Moment></h4>
                            }
                            <Row className="text-center mt-5">
                                <Col>
                                    <h5 style={{ height: "1.2em" }}></h5>
                                    
                                    <hr color="black"></hr>
                                    <h5>Secretario</h5>
                                </Col>
                                <Col cols="2"></Col>
                                <Col>
                                    <h5>{JSON.parse(localStorage.getItem("infoSesion")).pem_Nombre}</h5>
                                    <hr color="black"></hr>
                                    {sector ? <h5>Pastor</h5> : <h5>Obispo</h5>}
                                </Col>
                            </Row> */}
                        </CardBody> : ""
                    }
                </Card>
                <div hidden>
                    <Row>
                        <Table id='table1' data-cols-width="10,20,40,40,60,40">
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Tipo</th>
                                    <th>SubTipo</th>
                                    <th>Nombre</th>
                                    <th>Comentario</th>
                                    <th>Fecha</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    excelData.map((persona, index) => {
                                        return (
                                            <React.Fragment key={index}>
                                                <tr>
                                                    <td>{index + 1}</td>
                                                    <td>{persona.ct_Tipo}</td>
                                                    <td>{persona.ct_Subtipo}</td>
                                                    <td>{persona.per_Nombre} {persona.apellidoPrincipal} {persona.per_Apellido_Materno}</td>
                                                    <td>{persona.hte_Comentario}</td>
                                                    <td>{moment(persona.hte_Fecha_Transaccion).format("DD/MM/YYYY")}</td>
                                                </tr>
                                            </React.Fragment>
                                        )
                                    })
                                }
                            </tbody>
                        </Table>
                    </Row>
                </div>
            </Container>
        </>
    )
}
