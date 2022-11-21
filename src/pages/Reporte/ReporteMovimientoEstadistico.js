import Layout from "../Layout";
import helpers from "../../components/Helpers";
import {
    Container, Button,Input,
     CardTitle, Card, CardBody, Table, UncontrolledCollapse, Row, Col
} from 'reactstrap';

import React, { Fragment, useEffect, useState, } from 'react';
import TableToExcel from "@linways/table-to-excel";
import jsPDF from 'jspdf';
import Moment from "react-moment";
import moment from 'moment/min/moment-with-locales';
import 'moment/dist/locale/es'
import logo from '../../assets/images/IECE_LogoOficial.jpg'


export default function ReporteMovimientoEstadistico(){
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

    const [infoDis, setInfoDis] = useState(null)
    const [infoSec, setInfoSec] = useState(null)

    const [loading, setLoading] = useState(true)

    const[startDate, setStartDate] = useState(moment().startOf('month').format("YYYY-MM-DD"))
    const[endDate, setEndDate] = useState(moment().endOf('month').format("YYYY-MM-DD"))

    const dto = JSON.parse(localStorage.getItem("dto"))
    const sector = JSON.parse(localStorage.getItem("sector"))



    //Llamadas en render
    useEffect( () => {
        loadData()
    }, [])

    const loadData = async () => {
        // const codes = [11001, 11002, 11004, 11101, 11102,11103,11105,21001, 21102,23203,31001,31102]
        const params = {
            fechaInicial: startDate,
            fechaFinal: endDate,
        }
        if(sector == null){
            params.idSectorDistrito = dto
            const res = await helpers.authAxios.post("/Historial_Transacciones_Estadisticas/HistorialPorFechaDistrito", params);
            orderData(res.data.datos)
            setExcelData(res.data.datos)
            const resDto = await helpers.authAxios.get("/Distrito/" + dto)
            setInfoDis(resDto.data.dis_Alias)
        }else{
            params.idSectorDistrito = sector
            const res = await helpers.authAxios.post("/Historial_Transacciones_Estadisticas/HistorialPorFechaSector", params);
            console.log(res.data)
            orderData(res.data.datos)
            setExcelData(res.data.datos)
            const resDto = await helpers.authAxios.get("/Distrito/" + dto)
            setInfoDis(resDto.data.dis_Alias)
            const resSec = await helpers.authAxios.get("/Sector/" + sector)
            setInfoSec(resSec.data.sector[0].sec_Alias)
        }
    }

    const orderData = (trans) => {
        setBautismos(trans.filter(t => t.ct_Codigo_Transaccion == 11001))
        setRestituciones(trans.filter(t => t.ct_Codigo_Transaccion == 11002))
        setAltasCambioDom(trans.filter(t => sector ? t.ct_Codigo_Transaccion == 11003 || t.ct_Codigo_Transaccion == 11004 : t.ct_Codigo_Transaccion == 11004 ))
        setDefunciones(trans.filter(t => t.ct_Codigo_Transaccion == 11101))
        setExcomunionesTemp(trans.filter(t => t.ct_Codigo_Transaccion == 11102))
        setExcomuniones(trans.filter(t => t.ct_Codigo_Transaccion == 11103))
        setBajasCambiosDom(trans.filter(t => sector ? t.ct_Codigo_Transaccion == 11104 || t.ct_Codigo_Transaccion == 11105 : t.ct_Codigo_Transaccion == 11105))
        setActualizacionB(trans.filter(t => t.ct_Codigo_Transaccion == 11201))
        setNuevoIngreso(trans.filter(t => t.ct_Codigo_Transaccion == 12001))
        setAltasCambioDomNB(trans.filter(t => sector ? t.ct_Codigo_Transaccion == 12002 || t.ct_Codigo_Transaccion == 12003 : t.ct_Codigo_Transaccion == 12003))
        setReactivaciones(trans.filter(t => t.ct_Codigo_Transaccion == 12004))
        setDefuncionesNB(trans.filter(t => t.ct_Codigo_Transaccion == 12101))
        setAlejamientos(trans.filter(t => t.ct_Codigo_Transaccion == 12102))
        setBajasCambioDomNB(trans.filter(t => sector ?  t.ct_Codigo_Transaccion == 12103 || t.ct_Codigo_Transaccion == 12104 : t.ct_Codigo_Transaccion == 12104))
        setCambiosABautizado(trans.filter(t => t.ct_Codigo_Transaccion == 12105))
        setBajasPorPadres(trans.filter(t => t.ct_Codigo_Transaccion == 12106))
        setActualizacionNB(trans.filter(t => t.ct_Codigo_Transaccion == 12201))
        setMatrimonios(trans.filter(t => t.ct_Codigo_Transaccion == 21001))
        setLegalizaciones(trans.filter(t => t.ct_Codigo_Transaccion == 21102))
        setPresentacionesNiños(trans.filter(t => t.ct_Codigo_Transaccion == 23203))
        setAltasHogares(trans.filter(t => t.ct_Codigo_Transaccion == 31001))
        setBajasHogares(trans.filter(t => t.ct_Codigo_Transaccion == 31102))
        setActualizacionHogar(trans.filter(t => t.ct_Codigo_Transaccion == 31203))


        setLoading(false)

    }

    const downloadTable = () =>{
        TableToExcel.convert(document.getElementById("table1"), {
            name: "Reporte_Movimiento_Estadistico.xlsx",
            sheet: {
              name: "Hoja 1"
            }
          });
    }

    const handleStartDate = (e) =>{
        setStartDate(moment(e.value).format("YYYY-MM-DD"))
    }
    const handleEndDate = (e) =>{
        setEndDate(moment(e.value).format("YYYY-MM-DD"))
    }


    // const countPersons = (type) =>{
    //     let count = 0
    //     personas.map(persona => {
    //         if(persona.persona.per_Categoria === type){
    //             count+=1
    //         }
    //     })
    //     totalCount += count;
    //     return count
    // }

    const handleDownloadPDF = () =>{
        // INSTANCIA NUEVO OBJETO PARA CREAR PDF
        const doc = new jsPDF("p", "mm", "letter");
        let yAxis = 35;
        const headers = [
            'Indice',
            'Nombre',
            'Movimiento',
            'Subtipo',
            'Comentario',
            'Fecha'
        ]
        const customTable = (data, label) =>{
            if(yAxis > 240){
                doc.addPage()
                yAxis = 5
            }
            if(data.length > 0){
                yAxis += 3;
                doc.setFillColor(245, 247, 121) // Codigos de color RGB (red, green, blue)
                doc.rect(10, yAxis, 190, 4, "F");
                doc.setFont("", "", "bold");
                yAxis += 3;
                doc.text(label, 15, yAxis);

                yAxis += 3;
                data = data.map((persona,index) => ({
                    Indice: (index+1).toString(),
                    Nombre: persona.per_Nombre + ' ' + persona.per_Apellido_Paterno + ' ' + persona.per_Apellido_Materno,
                    Movimiento: persona.ct_Tipo,
                    Subtipo: persona.ct_Subtipo,
                    Comentario: persona.hte_Comentario.trim() === "" ? "N/A" : persona.hte_Comentario.trim(),
                    Fecha: (moment(persona.hte_Fecha_Transaccion).format("DD/MM/YYYY")).toString(),
                }))
                doc.table(10, yAxis, data, headers, {fontSize: 8, padding: 1})
                yAxis+= data.length * 12
                console.log(yAxis);
            }
        }

        doc.addImage(logo, 'PNG', 10, 5, 70, 20);
        doc.text("REPORTE DE MOVIMIENTO ESTADISTICO", 85, 10);
        doc.setFontSize(8);
        doc.text(`DISTRITO: ${infoDis}`, 85, 15)

        if (sector) {
            doc.text(`SECTOR: ${infoSec}`, 85, 20);
            doc.text(`AL DÍA ${moment().format('LL').toUpperCase()}`, 85, 25);
        }
        else {
            doc.text(`AL DÍA ${moment().format('LL').toUpperCase()}`, 85, 20);
        }

        if(actualizacionB.length > 0 || bautismos.length > 0 || restituciones.length > 0 || altasCambioDom.length > 0
        || bajasCambioDom.length > 0 ||  defunciones.length > 0 || excomunionesTemp.length > 0 || excomuniones.length > 0){
            doc.setFillColor(137, 213, 203) // Codigos de color RGB (red, green, blue)
            doc.rect(10, yAxis, 190, 4, "F");
            doc.setFont("", "", "bold");
            yAxis += 3;
            doc.text("MEMBRESIA BAUTIZADA", 15, yAxis);
        }

        customTable(actualizacionB, "Actualizaciones")
        customTable(bautismos, "Bautismos")
        customTable(restituciones, "Restituciones")
        customTable(altasCambioDom, "Altas Cambio de Domicilio")
        customTable(bajasCambioDom, "Bajas Cambio de Domicilio")
        customTable(defunciones, "Defunciones")
        customTable(excomunionesTemp, "Excomuniones Temporales")
        customTable(excomuniones, "Excomuniones")

        if(altasHogares.length > 0 || bajasHogares.length > 0 || actualizacionHogar.length > 0){
            doc.setFillColor(137, 213, 203) // Codigos de color RGB (red, green, blue)
            doc.rect(10, yAxis, 190, 4, "F");
            doc.setFont("", "", "bold");
            yAxis += 3;
            doc.text("HOGARES", 15, yAxis);
        }

        customTable(altasHogares, "Altas de Hogares")
        customTable(bajasHogares, "Bajas de Hogares")
        customTable(actualizacionHogar, "Actualización de Hogares")

        if(actualizacionNB.length > 0 || nuevoIngreso.length > 0 || altasCambioDomNB.length > 0 || reactivaciones.length > 0
        || bajasCambioDomNB.length > 0 ||  defuncionesNB.length > 0 || alejamientos.length > 0 || cambiosABautizado.length > 0
        || bajasPorPadres.length > 0){
            doc.setFillColor(137, 213, 203) // Codigos de color RGB (red, green, blue)
            doc.rect(10, yAxis, 190, 4, "F");
            doc.setFont("", "", "bold");
            yAxis += 3;
            console.log(yAxis);
            doc.text("MEMBRESIA NO BAUTIZADA", 15, yAxis);
        }

        customTable(actualizacionNB, "Actualización No Bautizado")
        customTable(nuevoIngreso, "Nuevo Ingreso")
        customTable(altasCambioDomNB, "Altas Cambio de Domicilio No Bautizado")
        customTable(reactivaciones, "Reactivaciones")
        customTable(bajasCambioDomNB, "Bajas Cambio de Domicilio No Bautizado")
        customTable(defuncionesNB, "Defunciones No Bautizado")
        customTable(alejamientos, "Alejamientos")
        customTable(cambiosABautizado, "Cambios a Bautizado")
        customTable(bajasPorPadres, "Baja por Padres")

        if(matrimonios.length > 0 || legalizaciones.length > 0 || presentacionesNiños.length > 0){
            doc.setFillColor(137, 213, 203) // Codigos de color RGB (red, green, blue)
            doc.rect(10, yAxis, 190, 4, "F");
            doc.setFont("", "", "bold");
            yAxis += 3;
            doc.text("SUCESOS", 15, yAxis);
        }

        customTable(matrimonios, "Matrimonios")
        customTable(legalizaciones, "Legalizaciones")
        customTable(presentacionesNiños, "Presentaciones de Niños")


        if(yAxis > 240){
            doc.addPage()
            yAxis = 5
        }

        doc.setFontSize(8);
        yAxis += 20;
        doc.text(`JUSTICIA Y VERDAD`, 90, yAxis);
        yAxis += 5;
        doc.text(`AL DÍA ${moment().format('LL').toUpperCase()}`, 85, yAxis);

        yAxis += 35;
        doc.line(30, yAxis, 90, yAxis);
        doc.line(120, yAxis, 180, yAxis);
        yAxis += 3;
        doc.text("SECRETARIO", 51, yAxis);
        doc.text("PASTOR", 145, yAxis);
        yAxis -= 5;
        doc.setFont("", "", "bold");
        doc.text(`${JSON.parse(localStorage.getItem("infoSesion")).pem_Nombre}`, 130, yAxis);


        doc.save("ReporteMovimientoEstadistico.pdf");
    }


    const TableRow = (props) => {
        const data = props.data
        const label = props.label
        const total = props.total

        if(data.length > 0){
            return(
                <Fragment>
                    <tr>
                        <th>{label}</th>
                    </tr>
                    {data.map((persona, index) => (
                        <tr>
                            <td>{index + 1}.- {persona.per_Nombre} {persona.per_Apellido_Paterno} {persona.per_Apellido_Materno}</td>
                            <td>{persona.ct_Tipo}</td>
                            <td>{persona.ct_Subtipo}</td>
                            <td>{persona.hte_Comentario}</td>
                            <td>{moment(persona.hte_Fecha_Transaccion).format("DD/MM/YYYY")}</td>
                        </tr>
                    )) }
                    <tr>
                        <th className="text-right" colSpan="4">Total por {label}: {total} </th>
                    </tr>
                </Fragment>
            )
        }else{
            return ""
        }

    }
    return(
        <Layout>
            <Container fluid>
                <Button className="btn-success m-3 " onClick={downloadTable}><i className="fas fa-file-excel mr-2"></i>Descargar Excel</Button>
                <Button className="btn-danger m-3 " onClick={handleDownloadPDF}><i className="fas fa-file-pdf mr-2"></i>Descargar PDF</Button>
                {/* TABLA */}
                <Card body id="pdf">
                <CardTitle className="text-center" tag="h3">
                {!loading ?
                <Row>
                    <Col lg="3">
                        <img src={logo} width="100%"></img>
                    </Col>
                    <Col>
                        REPORTE DE MOVIMIENTO ESTADISTICO PERIODICO
                        
                        {sector ? <h5>Sector: {infoSec}</h5> :
                        <h5>Distrito: {infoDis}</h5>}
                    </Col>
                </Row>
                : ""
                }
                </CardTitle>
                {!loading ?
                    <CardBody>
                    <Row className="m-3 justify-content-center">
                            <Col lg="1" className="text-center">
                                <h3>De</h3>
                            </Col>
                            <Col lg="2" className="text-center">
                                <Input type="date" value={startDate} onInput={(e) => handleStartDate(e.target)}></Input>
                            </Col>
                            <Col lg="1" className="text-center">
                                <h3>al</h3>
                            </Col>
                            <Col lg="2" className="text-center">
                                <Input type="date" value={endDate} onInput={(e) => handleEndDate(e.target)}></Input>
                            </Col>
                            <Col lg="2" className="text-center">
                                <Button color="info" onClick={() => loadData()}>Buscar...</Button>
                            </Col>
                    </Row>

                        {/* <Button color="primary" size="lg" className="text-left mb-2" block id="altas">Altas</Button>
                        <UncontrolledCollapse defaultOpen toggler="#altas"> */}
                            <Card>
                                <CardBody>
                                    <Table borderless>
                                        <tr>
                                            <th><h4>Nombre</h4></th>
                                            <th><h4>Tipo Movimiento</h4></th>
                                            <th><h4>Subtipo Movimiento</h4></th>
                                            <th><h4>Comentario</h4></th>
                                            <th><h4>Fecha</h4></th>
                                        </tr>
                                        <tr className="bg-info">
                                            <td colSpan="5">
                                                <h4><strong>MEMBRESIA BAUTIZADA</strong></h4>
                                            </td>
                                        </tr>
                                        <tr className="bg-light">
                                            <td colSpan="5">
                                                <h5>ACTUALIZACIONES</h5>
                                            </td>
                                        </tr>

                                        <TableRow label={'Actualizacion Bautizado'} data= {actualizacionB} total={actualizacionB ? actualizacionB.length : 0}/>

                                        <tr className="bg-light">
                                            <td colSpan="5">
                                                <h5>ALTAS</h5>
                                            </td>
                                        </tr>

                                        <TableRow label={'Bautismo'} data= {bautismos} total={bautismos ? bautismos.length : 0}/>
                                        <TableRow label={'Restitución'} data= {restituciones} total={restituciones ? restituciones.length : 0}/>
                                        <TableRow label={'Cambio de Domicilio'} data= {altasCambioDom} total={altasCambioDom ? altasCambioDom.length : 0}/>

                                        <tr className="bg-light">
                                            <td colSpan="5">
                                                <h5>BAJAS</h5>
                                            </td>
                                        </tr>

                                        <TableRow label={'Excomunión'} data= {excomuniones} total={excomuniones ? excomuniones.length : 0}/>
                                        <TableRow label={'Excomunión Temporal'} data= {excomunionesTemp} total={excomunionesTemp ? excomunionesTemp.length : 0}/>
                                        <TableRow label={'Baja Cambio Domicilio'} data= {bajasCambioDom} total={bajasCambioDom ? bajasCambioDom.length : 0}/>
                                        <TableRow label={'Defunción'} data= {defunciones} total={defunciones ? defunciones.length : 0}/>

                                        <tr className="bg-info">
                                            <td colSpan="5">
                                                <h4><strong>MEMBRESIA NO BAUTIZADA</strong></h4>
                                            </td>
                                        </tr>

                                        <tr className="bg-light">
                                            <td colSpan="5">
                                                <h5>ACTUALIZACIONES</h5>
                                            </td>
                                        </tr>

                                        <TableRow label={'Actualizacion No Bautizado'} data= {actualizacionNB} total={actualizacionNB ? actualizacionNB.length : 0}/>

                                        <tr className="bg-light">
                                            <td colSpan="5">
                                                <h5>ALTAS</h5>
                                            </td>
                                        </tr>

                                        <TableRow label={'Nuevo Ingreso'} data= {nuevoIngreso} total={nuevoIngreso ? nuevoIngreso.length : 0}/>
                                        <TableRow label={'Cambio de Domicilio'} data= {altasCambioDomNB} total={altasCambioDomNB ? altasCambioDomNB.length : 0}/>
                                        <TableRow label={'Reactivación'} data= {reactivaciones} total={reactivaciones ? reactivaciones.length : 0}/>

                                        <tr className="bg-light">
                                            <td colSpan="5">
                                                <h5>BAJAS</h5>
                                            </td>
                                        </tr>

                                        <TableRow label={'Defunción'} data= {defuncionesNB} total={defuncionesNB ? defuncionesNB.length : 0}/>
                                        <TableRow label={'Cambio de Domicilio'} data= {bajasCambioDomNB} total={bajasCambioDomNB ? bajasCambioDomNB.length : 0}/>
                                        <TableRow label={'Alejamiento'} data= {alejamientos} total={alejamientos ? alejamientos.length : 0}/>
                                        <TableRow label={'Pasa a Personal Bautizado'} data= {cambiosABautizado} total={cambiosABautizado ? cambiosABautizado.length : 0}/>
                                        <TableRow label={'Baja de Padres'} data= {bajasPorPadres} total={bajasPorPadres ? bajasPorPadres.length : 0}/>

                                        <tr className="bg-info">
                                            <td colSpan="5">
                                                <h4><strong>HOGARES</strong></h4>
                                            </td>
                                        </tr>

                                        <tr className="bg-light">
                                            <td colSpan="5">
                                                <h5>ACTUALIZACIONES</h5>
                                            </td>
                                        </tr>

                                        <TableRow label={'Actualizaciones'} data= {actualizacionHogar} total={actualizacionHogar ? actualizacionHogar.length : 0}/>

                                        <tr className="bg-light">
                                            <td colSpan="5">
                                                <h5>ALTAS</h5>
                                            </td>
                                        </tr>

                                        <TableRow label={'Alta Hogares'} data= {altasHogares} total={altasHogares ? altasHogares.length : 0}/>

                                        <tr className="bg-light">
                                            <td colSpan="5">
                                                <h5>BAJAS</h5>
                                            </td>
                                        </tr>
                                        <TableRow label={'Baja Hogares'} data= {bajasHogares} total={bajasHogares ? bajasHogares.length : 0}/>

                                        <tr className="bg-info">
                                            <td colSpan="5">
                                                <h4><strong>SUCESOS</strong></h4>
                                            </td>
                                        </tr>

                                        <tr className="bg-light">
                                            <td colSpan="5">
                                                <h5>Matrimonios</h5>
                                            </td>
                                        </tr>

                                        <TableRow label={'Matrimonios'} data= {matrimonios} total={matrimonios ? matrimonios.length / 2 : 0}/>

                                        <tr className="bg-light">
                                            <td colSpan="5">
                                                <h5>Legalizaciones</h5>
                                            </td>
                                        </tr>

                                        <TableRow label={'Legalizaciones'} data= {legalizaciones} total={legalizaciones ? legalizaciones.length / 2 : 0}/>

                                        <tr className="bg-light">
                                            <td colSpan="5">
                                                <h5>Presentaciones de niños</h5>
                                            </td>
                                        </tr>

                                        <TableRow label={'Presentaciones de Niños'} data= {presentacionesNiños} total={presentacionesNiños ? presentacionesNiños.length : 0}/>

                                    </Table>
                                </CardBody>
                            </Card>
                        <h4 className="text-center m-4">Justicia y Verdad</h4>
                        {sector ?
                            <h4 className="text-center m-4">{JSON.parse(localStorage.getItem("infoSesion")).sec_Alias} a <Moment locale="es" format="LL"></Moment></h4> :
                            <h4 className="text-center m-4">{JSON.parse(localStorage.getItem("infoSesion")).dis_Alias} a <Moment locale="es" format="LL"></Moment></h4>
                        }
                        <Row className="text-center mt-5">
                            <Col>
                                <h5 style={{height: "1.2em"}}></h5>
                                {/* <Input className="text-center" bsSize="sm" type="text" placeholder="Escriba nombre del secretario"></Input> */}
                                <hr color="black"></hr>
                                <h5>Secretario</h5>
                            </Col>
                            <Col cols="2"></Col>
                            <Col>
                                <h5>{JSON.parse(localStorage.getItem("infoSesion")).pem_Nombre}</h5>
                                <hr color="black"></hr>
                                {sector ? <h5>Pastor</h5> : <h5>Obispo</h5>}
                            </Col>
                        </Row>
                </CardBody> : ""
                }
                </Card>
                <div hidden>
                            <Row>
                                <Table id='table1' data-cols-width="10,60,40,60,40">
                                    <thead>
                                        <tr>
                                            <th>Indice</th>
                                            <th>Nombre</th>
                                            <th>Movimiento</th>
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
                                                            <td>{persona.per_Nombre} {persona.per_Apellido_Paterno} {persona.per_Apellido_Materno}</td>
                                                            <td>{persona.ct_Tipo}</td>
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
        </Layout>
    )
}
