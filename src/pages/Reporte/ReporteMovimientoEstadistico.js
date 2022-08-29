import Layout from "../Layout";
import helpers from "../../components/Helpers";
import {
    Container, Button,Input,
     CardTitle, Card, CardBody, Table, UncontrolledCollapse, Row, Col
} from 'reactstrap';

import React, { useEffect, useState, } from 'react';
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
    const [alejamiientos, setAlejamientos] = useState(null)
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
    
    const [loading, setLoading] = useState(true)
    
    const[startDate, setStartDate] = useState(moment().startOf('month').format("YYYY-MM-DD"))
    const[endDate, setEndDate] = useState(moment().endOf('month').format("YYYY-MM-DD"))
    
    const dto = JSON.parse(localStorage.getItem("dto"))
    const sector = JSON.parse(localStorage.getItem("sector"))
    //Llamadas en render
    useEffect(async () => {
        await loadData()
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
        }else{
            params.idSectorDistrito = sector
            const res = await helpers.authAxios.post("/Historial_Transacciones_Estadisticas/HistorialPorFechaSector", params);
            console.log(res.data)
            orderData(res.data.datos)
        }
    }

    const orderData = (trans) => {
        setBautismos(trans.filter(t => t.ct_Codigo_Transaccion == 11001))
        setRestituciones(trans.filter(t => t.ct_Codigo_Transaccion == 11002))
        setAltasCambioDom(trans.filter(t => t.ct_Codigo_Transaccion == 11003 || t.ct_Codigo_Transaccion == 11004))
        setDefunciones(trans.filter(t => t.ct_Codigo_Transaccion == 11101))
        setExcomunionesTemp(trans.filter(t => t.ct_Codigo_Transaccion == 11102))
        setExcomuniones(trans.filter(t => t.ct_Codigo_Transaccion == 11103))
        setBajasCambiosDom(trans.filter(t => t.ct_Codigo_Transaccion == 11104 || t.ct_Codigo_Transaccion == 11105))
        setActualizacionB(trans.filter(t => t.ct_Codigo_Transaccion == 11201))
        setNuevoIngreso(trans.filter(t => t.ct_Codigo_Transaccion == 12001))
        setAltasCambioDomNB(trans.filter(t => t.ct_Codigo_Transaccion == 12002 || t.ct_Codigo_Transaccion == 12003))
        setReactivaciones(trans.filter(t => t.ct_Codigo_Transaccion == 12004))
        setDefuncionesNB(trans.filter(t => t.ct_Codigo_Transaccion == 12101))
        setAlejamientos(trans.filter(t => t.ct_Codigo_Transaccion == 12102))
        setBajasCambioDomNB(trans.filter(t => t.ct_Codigo_Transaccion == 12103 || t.ct_Codigo_Transaccion == 12104))
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
        
        // switch (code) {
        //     case 11001:
        //         setBautismos(data)
        //         break;
        
        //     case 11002:
        //         setRestituciones(data)
        //         break;
        
        //     case 11004:
        //         setAltasCambioDom(data)
        //         break;
        
        //     case 11101:
        //         setDefunciones(data)
        //         break;
        
        //     case 11102:
        //         setExcomunionesTemp(data)
        //         break;
        
        //     case 11103:
        //         setExcomuniones(data)
        //         break;
        
        //     case 11105:
        //         setBajasCambiosDom(data)
        //         break;
        
        //     case 21001:
        //         setMatrimonios(data)
        //         break;
        
        //     case 21102:
        //         setLegalizaciones(data)
        //         break;
        
        //     case 23203:
        //         setPresentacionesNiños(data)
        //         break;

        //     case 31001:
        //         setAltasHogares(data)
        //         break;
        
        //     case 31102:
        //         setBajasHogares(data)
        //         break;
        
        //     default:
        //         break;
        // }
    }

    const downloadTable = () =>{
        TableToExcel.convert(document.getElementById("table1"), {
            name: "Cumpleaños_membresia.xlsx",
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
    // const reportePersonalBautizadoPDF = () =>{
    //     totalCount = 0
    //     let index = 1
    //     // INSTANCIA NUEVO OBJETO PARA CREAR PDF
    //     const doc = new jsPDF("p", "mm", "letter");

    //     doc.addImage(logo, 'PNG', 10, 5, 70, 20);
    //     doc.text("REPORTE CUMPLEAÑOS", 85, 10);
    //     doc.setFontSize(8);
    //     doc.text(`DISTRITO: ${JSON.parse(localStorage.getItem("infoSesion")).dis_Alias}`, 85, 15)
        
    //     if (sector) {
    //         doc.text(`SECTOR: ${JSON.parse(localStorage.getItem("infoSesion")).sec_Alias}`, 85, 20);
    //         doc.text(`AL DÍA ${moment().format('LL').toUpperCase()}`, 85, 25);
    //     }
    //     else {
    //         doc.text(`AL DÍA ${moment().format('LL').toUpperCase()}`, 85, 20);
    //     }
        
        
    //     const headers = [
    //         'Indice',
    //         'Nombre',
    //         'Grupo',
    //         'Fecha_Nacimiento',
    //         'Edad_Actual',
    //     ]
    //     const data = personas.map((persona,index) => ({
    //         Indice: String(index+1),
    //         Nombre: persona.persona ? persona.persona.per_Nombre : " " + ' ' + persona.persona ? persona.persona.per_Apellido_Paterno : " " + ' ' + persona.persona ? persona.persona.per_Apellido_Materno : " ",
    //         Grupo: persona.persona.per_Bautizado ? "Bautizado" : "No Bautizado",
    //         Fecha_Nacimiento: String(moment(persona.persona.per_Fecha_Nacimiento).format("DD/MM/YYYY")),
    //         Edad_Actual: String(moment().diff(persona.persona.per_Fecha_Nacimiento, "years")),
    //     }))
    //     doc.table(10, 35, data, headers, {autoSize:true, fontSize: 8, padding:1})

    //     let yAxis = 160
    //     doc.setFontSize(8);

    //     yAxis += 20;
    //     doc.text(`JUSTICIA Y VERDAD`, 90, yAxis);
    //     yAxis += 5;
    //     doc.text(`AL DÍA ${moment().format('LL').toUpperCase()}`, 85, yAxis);

    //     yAxis += 35;
    //     doc.line(30, yAxis, 90, yAxis);
    //     doc.line(120, yAxis, 180, yAxis);
    //     yAxis += 3;
    //     doc.text("SECRETARIO", 51, yAxis);
    //     doc.text("PASTOR", 145, yAxis);
    //     yAxis -= 5;
    //     doc.text(`${JSON.parse(localStorage.getItem("infoSesion")).pem_Nombre}`, 130, yAxis);


    //     doc.save("ReporteMovimientoEstadistico.pdf");
    // }
    return(
        <Layout>
            <Container fluid>
                {/* <Button className="btn-success m-3 " onClick={() => downloadTable()}><i className="fas fa-file-excel mr-2"></i>Descargar Excel</Button>
                <Button className="btn-danger m-3 " onClick={() => reportePersonalBautizadoPDF()}><i className="fas fa-file-pdf mr-2"></i>Descargar PDF</Button> */}

                {/* TABLA */}
                <Card body>
                <CardTitle className="text-center" tag="h3">
                <Row>
                    <Col lg="3">
                        <img src={logo} width="100%"></img> 
                    </Col>
                    <Col>
                        REPORTE DE MOVIMIENTO ESTADISTICO PERIODICO
                        <h5>Distrito: {JSON.parse(localStorage.getItem("infoSesion")).dis_Alias}</h5>
                        {sector ? <h5>Sector: {JSON.parse(localStorage.getItem("infoSesion")).sec_Alias}</h5> : null}
                    </Col>
                </Row>
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
                                            <th><h4>Movimiento</h4></th>
                                            <th><h4>Comentario</h4></th>
                                            <th><h4>Fecha</h4></th>
                                        </tr>
                                        <tr className="bg-info">
                                            <td colSpan="4">
                                                <h4><strong>MEMBRESIA BAUTIZADA</strong></h4>
                                            </td>
                                        </tr>
                                        <tr className="bg-light">
                                            <td colSpan="4">
                                                <h5>ACTUALIZACIONES</h5>
                                            </td>
                                        </tr>

                                        {
                                           actualizacionB ? actualizacionB.map((persona, index) => (
                                                <tr>
                                                    <td>{index + 1}.- {persona.per_Nombre} {persona.per_Apellido_Paterno} {persona.per_Apellido_Materno}</td>
                                                    <td>{persona.ct_Tipo}</td>
                                                    <td>{persona.hte_Comentario}</td>
                                                    <td>{moment(persona.hte_Fecha_Transaccion).format("DD/MM/YYYY")}</td>
                                                </tr>
                                            )) :
                                            <tr>
                                                <td colSpan="4">No hay registros</td>
                                            </tr> 
                                        }
                                        <tr>
                                            <th className="text-right" colSpan="4">Total de Actualizaciones: {actualizacionB ? actualizacionB.length : 0} </th>
                                        </tr>

                                        <tr className="bg-light">
                                            <td colSpan="4">
                                                <h5>ALTAS</h5>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Bautismo</th>
                                        </tr>
                                        {
                                           bautismos ? bautismos.map((persona, index) => (
                                                <tr>
                                                    <td>{index + 1}.- {persona.per_Nombre} {persona.per_Apellido_Paterno} {persona.per_Apellido_Materno}</td>
                                                    <td>{persona.ct_Tipo}</td>
                                                    <td>{persona.hte_Comentario}</td>
                                                    <td>{moment(persona.hte_Fecha_Transaccion).format("DD/MM/YYYY")}</td>
                                                </tr>
                                            )) :
                                            <tr>
                                                <td colSpan="4">No hay registros</td>
                                            </tr> 
                                        }
                                        <tr>
                                            <th className="text-right" colSpan="4">Total por Bautismo: {bautismos ? bautismos.length : 0} </th>
                                        </tr>
                                        <tr>
                                            <th>Restitución</th>
                                        </tr>
                                        {
                                            restituciones ? restituciones.map((persona, index) => (
                                                <tr>
                                                    <td>{index + 1}.- {persona.per_Nombre} {persona.per_Apellido_Paterno} {persona.per_Apellido_Materno}</td>
                                                    <td>{persona.ct_Tipo}</td>
                                                    <td>{persona.hte_Comentario}</td>
                                                    <td>{moment(persona.hte_Fecha_Transaccion).format("DD/MM/YYYY")}</td>
                                                </tr>
                                            )):
                                            <tr>
                                                <td colSpan="4">No hay registros</td>
                                            </tr> 
                                        }
                                        <tr>
                                            <th className="text-right" colSpan="4">Total por Restitución: {restituciones ? restituciones.length : 0} </th>
                                        </tr>
                                        <tr>
                                            <th>Cambio de Domicilio</th>
                                        </tr>
                                        {
                                            altasCambioDom ? altasCambioDom.map((persona, index) => (
                                                <tr>
                                                    <td>{index + 1}.- {persona.per_Nombre} {persona.per_Apellido_Paterno} {persona.per_Apellido_Materno}</td>
                                                    <td>{persona.ct_Tipo}</td>
                                                    <td>{persona.hte_Comentario}</td>
                                                    <td>{moment(persona.hte_Fecha_Transaccion).format("DD/MM/YYYY")}</td>
                                                </tr>
                                            )):
                                            <tr>
                                                <td colSpan="4">No hay registros</td>
                                            </tr> 
                                        }
                                        <tr>
                                            <th className="text-right" colSpan="4">Total por Cambio de Domicilio: {altasCambioDom ? altasCambioDom.length : 0} </th>
                                        </tr>
                                        
                                        <tr className="bg-light">
                                            <td colSpan="4">
                                                <h5>BAJAS</h5>
                                            </td>
                                        </tr>

                                        <tr>
                                            <th>Excomunión</th>
                                        </tr>

                                        {
                                           excomuniones ? excomuniones.map((persona, index) => (
                                                <tr>
                                                    <td>{index + 1}.- {persona.per_Nombre} {persona.per_Apellido_Paterno} {persona.per_Apellido_Materno}</td>
                                                    <td>{persona.ct_Tipo}</td>
                                                    <td>{persona.hte_Comentario}</td>
                                                    <td>{moment(persona.hte_Fecha_Transaccion).format("DD/MM/YYYY")}</td>
                                                </tr>
                                            )) :
                                            <tr>
                                                <td colSpan="4">No hay registros</td>
                                            </tr> 
                                        }
                                        <tr>
                                            <th className="text-right" colSpan="4">Total por Excomunión: {excomuniones ? excomuniones.length : 0} </th>
                                        </tr>
                                        <tr>
                                            <th>Excomunión Temporal</th>
                                        </tr>

                                        {
                                           excomunionesTemp ? excomunionesTemp.map((persona, index) => (
                                                <tr>
                                                    <td>{index + 1}.- {persona.per_Nombre} {persona.per_Apellido_Paterno} {persona.per_Apellido_Materno}</td>
                                                    <td>{persona.ct_Tipo}</td>
                                                    <td>{persona.hte_Comentario}</td>
                                                    <td>{moment(persona.hte_Fecha_Transaccion).format("DD/MM/YYYY")}</td>
                                                </tr>
                                            )) :
                                            <tr>
                                                <td colSpan="4">No hay registros</td>
                                            </tr> 
                                        }
                                        <tr>
                                            <th className="text-right" colSpan="4">Total por Excomunión Temporal: {excomunionesTemp ? excomunionesTemp.length : 0} </th>
                                        </tr>
                                        <tr>
                                            <th>Baja Cambio Domicilio</th>
                                        </tr>

                                        {
                                           bajasCambioDom ? bajasCambioDom.map((persona, index) => (
                                                <tr>
                                                    <td>{index + 1}.- {persona.per_Nombre} {persona.per_Apellido_Paterno} {persona.per_Apellido_Materno}</td>
                                                    <td>{persona.ct_Tipo}</td>
                                                    <td>{persona.hte_Comentario}</td>
                                                    <td>{moment(persona.hte_Fecha_Transaccion).format("DD/MM/YYYY")}</td>
                                                </tr>
                                            )) :
                                            <tr>
                                                <td colSpan="4">No hay registros</td>
                                            </tr> 
                                        }
                                        <tr>
                                            <th className="text-right" colSpan="4">Total por Baja Cambio de Domicilio: {bajasCambioDom ? bajasCambioDom.length : 0} </th>
                                        </tr>
                                        <tr>
                                            <th>Defunción</th>
                                        </tr>
                                        {
                                            defunciones ? defunciones.map((persona, index) => (
                                                <tr>
                                                    <td>{index + 1}.- {persona.per_Nombre} {persona.per_Apellido_Paterno} {persona.per_Apellido_Materno}</td>
                                                    <td>{persona.ct_Tipo}</td>
                                                    <td>{persona.hte_Comentario}</td>
                                                    <td>{moment(persona.hte_Fecha_Transaccion).format("DD/MM/YYYY")}</td>
                                                </tr>
                                            )):
                                            <tr>
                                                <td colSpan="4">No hay registros</td>
                                            </tr> 
                                        }
                                        <tr>
                                            <th className="text-right" colSpan="4">Total por Defunción: {defunciones ? defunciones.length : 0} </th>
                                        </tr>

                                        <tr className="bg-info">
                                            <td colSpan="4">
                                                <h4><strong>HOGARES</strong></h4>
                                            </td>
                                        </tr>

                                        <tr className="bg-light">
                                            <td colSpan="4">
                                                <h5>ACTUALIZACIONES</h5>
                                            </td>
                                        </tr>

                                        {
                                           actualizacionHogar ? actualizacionHogar.map((persona, index) => (
                                                <tr>
                                                    <td>{index + 1}.- {persona.per_Nombre} {persona.per_Apellido_Paterno} {persona.per_Apellido_Materno}</td>
                                                    <td>{persona.ct_Tipo}</td>
                                                    <td>{persona.hte_Comentario}</td>
                                                    <td>{moment(persona.hte_Fecha_Transaccion).format("DD/MM/YYYY")}</td>
                                                </tr>
                                            )) :
                                            <tr>
                                                <td colSpan="4">No hay registros</td>
                                            </tr> 
                                        }
                                        <tr>
                                            <th className="text-right" colSpan="4">Total de Actualizaciones: {actualizacionHogar ? actualizacionHogar.length : 0} </th>
                                        </tr>

                                        <tr className="bg-light">
                                            <td colSpan="4">
                                                <h5>ALTAS</h5>
                                            </td>
                                        </tr>
                                        {
                                           altasHogares ? altasHogares.map((persona, index) => (
                                                <tr>
                                                    <td>{index + 1}.- {persona.per_Nombre} {persona.per_Apellido_Paterno} {persona.per_Apellido_Materno}</td>
                                                    <td>{persona.ct_Tipo}</td>
                                                    <td>{persona.hte_Comentario}</td>
                                                    <td>{moment(persona.hte_Fecha_Transaccion).format("DD/MM/YYYY")}</td>
                                                </tr>
                                            )) :
                                            <tr>
                                                <td colSpan="4">No hay registros</td>
                                            </tr> 
                                        }
                                        <tr>
                                            <th className="text-right" colSpan="4">Total por Alta de Hogar: {altasHogares ? altasHogares.length : 0} </th>
                                        </tr>

                                        <tr className="bg-light">
                                            <td colSpan="4">
                                                <h5>BAJAS</h5>
                                            </td>
                                        </tr>

                                        {
                                            bajasHogares ? bajasHogares.map((persona, index) => (
                                                <tr>
                                                    <td>{index + 1}.- {persona.per_Nombre} {persona.per_Apellido_Paterno} {persona.per_Apellido_Materno}</td>
                                                    <td>{persona.ct_Tipo}</td>
                                                    <td>{persona.hte_Comentario}</td>
                                                    <td>{moment(persona.hte_Fecha_Transaccion).format("DD/MM/YYYY")}</td>
                                                </tr>
                                            )):
                                            <tr>
                                                <td colSpan="4">No hay registros</td>
                                            </tr> 
                                        }
                                        <tr>
                                            <th className="text-right" colSpan="4">Total por Baja de Hogares: {bajasHogares ? bajasHogares.length : 0} </th>
                                        </tr>

                                        
                                        <tr className="bg-info">
                                            <td colSpan="4">
                                                <h4><strong>MEMBRESIA NO BAUTIZADA</strong></h4>
                                            </td>
                                        </tr>

                                        <tr className="bg-light">
                                            <td colSpan="4">
                                                <h5>ACTUALIZACIONES</h5>
                                            </td>
                                        </tr>

                                        {
                                           actualizacionNB ? actualizacionNB.map((persona, index) => (
                                                <tr>
                                                    <td>{index + 1}.- {persona.per_Nombre} {persona.per_Apellido_Paterno} {persona.per_Apellido_Materno}</td>
                                                    <td>{persona.ct_Tipo}</td>
                                                    <td>{persona.hte_Comentario}</td>
                                                    <td>{moment(persona.hte_Fecha_Transaccion).format("DD/MM/YYYY")}</td>
                                                </tr>
                                            )) :
                                            <tr>
                                                <td colSpan="4">No hay registros</td>
                                            </tr> 
                                        }
                                        <tr>
                                            <th className="text-right" colSpan="4">Total de Actualizaciones: {actualizacionNB ? actualizacionNB.length : 0} </th>
                                        </tr>

                                        <tr className="bg-light">
                                            <td colSpan="4">
                                                <h5>ALTAS</h5>
                                            </td>
                                        </tr>

                                        <tr>
                                            <th>Nuevo Ingreso</th>
                                        </tr>
                                        {
                                           nuevoIngreso ? nuevoIngreso.map((persona, index) => (
                                                <tr>
                                                    <td>{index + 1}.- {persona.per_Nombre} {persona.per_Apellido_Paterno} {persona.per_Apellido_Materno}</td>
                                                    <td>{persona.ct_Tipo}</td>
                                                    <td>{persona.hte_Comentario}</td>
                                                    <td>{moment(persona.hte_Fecha_Transaccion).format("DD/MM/YYYY")}</td>
                                                </tr>
                                            )) :
                                            <tr>
                                                <td colSpan="4">No hay registros</td>
                                            </tr> 
                                        }
                                        <tr>
                                            <th className="text-right" colSpan="4">Total por Nuevo Ingreso: {nuevoIngreso ? nuevoIngreso.length : 0} </th>
                                        </tr>
                                        
                                        <tr>
                                            <th>Cambio de Domicilio</th>
                                        </tr>
                                        {
                                           altasCambioDomNB ? altasCambioDomNB.map((persona, index) => (
                                                <tr>
                                                    <td>{index + 1}.- {persona.per_Nombre} {persona.per_Apellido_Paterno} {persona.per_Apellido_Materno}</td>
                                                    <td>{persona.ct_Tipo}</td>
                                                    <td>{persona.hte_Comentario}</td>
                                                    <td>{moment(persona.hte_Fecha_Transaccion).format("DD/MM/YYYY")}</td>
                                                </tr>
                                            )) :
                                            <tr>
                                                <td colSpan="4">No hay registros</td>
                                            </tr> 
                                        }
                                        <tr>
                                            <th className="text-right" colSpan="4">Total por Cambio Domicilio: {altasCambioDomNB ? altasCambioDomNB.length : 0} </th>
                                        </tr>
                                        
                                        <tr>
                                            <th>Reactivación</th>
                                        </tr>
                                        {
                                           reactivaciones ? reactivaciones.map((persona, index) => (
                                                <tr>
                                                    <td>{index + 1}.- {persona.per_Nombre} {persona.per_Apellido_Paterno} {persona.per_Apellido_Materno}</td>
                                                    <td>{persona.ct_Tipo}</td>
                                                    <td>{persona.hte_Comentario}</td>
                                                    <td>{moment(persona.hte_Fecha_Transaccion).format("DD/MM/YYYY")}</td>
                                                </tr>
                                            )) :
                                            <tr>
                                                <td colSpan="4">No hay registros</td>
                                            </tr> 
                                        }
                                        <tr>
                                            <th className="text-right" colSpan="4">Total por Reactivación: {reactivaciones ? reactivaciones.length : 0} </th>
                                        </tr>
                                        <tr className="bg-light">
                                            <td colSpan="4">
                                                <h5>BAJAS</h5>
                                            </td>
                                        </tr>

                                        <tr>
                                            <th>Defunción</th>
                                        </tr>
                                        {
                                           defuncionesNB ? defuncionesNB.map((persona, index) => (
                                                <tr>
                                                    <td>{index + 1}.- {persona.per_Nombre} {persona.per_Apellido_Paterno} {persona.per_Apellido_Materno}</td>
                                                    <td>{persona.ct_Tipo}</td>
                                                    <td>{persona.hte_Comentario}</td>
                                                    <td>{moment(persona.hte_Fecha_Transaccion).format("DD/MM/YYYY")}</td>
                                                </tr>
                                            )) :
                                            <tr>
                                                <td colSpan="4">No hay registros</td>
                                            </tr> 
                                        }
                                        <tr>
                                            <th className="text-right" colSpan="4">Total por Defunción: {defuncionesNB ? defuncionesNB.length : 0} </th>
                                        </tr>
                                        
                                        <tr>
                                            <th>Cambio de Domicilio</th>
                                        </tr>
                                        {
                                           bajasCambioDomNB ? bajasCambioDomNB.map((persona, index) => (
                                                <tr>
                                                    <td>{index + 1}.- {persona.per_Nombre} {persona.per_Apellido_Paterno} {persona.per_Apellido_Materno}</td>
                                                    <td>{persona.ct_Tipo}</td>
                                                    <td>{persona.hte_Comentario}</td>
                                                    <td>{moment(persona.hte_Fecha_Transaccion).format("DD/MM/YYYY")}</td>
                                                </tr>
                                            )) :
                                            <tr>
                                                <td colSpan="4">No hay registros</td>
                                            </tr> 
                                        }
                                        <tr>
                                            <th className="text-right" colSpan="4">Total por Cambio Domicilio: {bajasCambioDomNB ? bajasCambioDomNB.length : 0} </th>
                                        </tr>
                                        
                                        <tr>
                                            <th>Alejamiento</th>
                                        </tr>
                                        {
                                           alejamiientos ? alejamiientos.map((persona, index) => (
                                                <tr>
                                                    <td>{index + 1}.- {persona.per_Nombre} {persona.per_Apellido_Paterno} {persona.per_Apellido_Materno}</td>
                                                    <td>{persona.ct_Tipo}</td>
                                                    <td>{persona.hte_Comentario}</td>
                                                    <td>{moment(persona.hte_Fecha_Transaccion).format("DD/MM/YYYY")}</td>
                                                </tr>
                                            )) :
                                            <tr>
                                                <td colSpan="4">No hay registros</td>
                                            </tr> 
                                        }
                                        <tr>
                                            <th className="text-right" colSpan="4">Total por Alejamiento: {alejamiientos ? alejamiientos.length : 0} </th>
                                        </tr>
                                        
                                        <tr>
                                            <th>Pasa a personal bautizado</th>
                                        </tr>
                                        {
                                           cambiosABautizado ? cambiosABautizado.map((persona, index) => (
                                                <tr>
                                                    <td>{index + 1}.- {persona.per_Nombre} {persona.per_Apellido_Paterno} {persona.per_Apellido_Materno}</td>
                                                    <td>{persona.ct_Tipo}</td>
                                                    <td>{persona.hte_Comentario}</td>
                                                    <td>{moment(persona.hte_Fecha_Transaccion).format("DD/MM/YYYY")}</td>
                                                </tr>
                                            )) :
                                            <tr>
                                                <td colSpan="4">No hay registros</td>
                                            </tr> 
                                        }
                                        <tr>
                                            <th className="text-right" colSpan="4">Total por cambio a bautizado: {cambiosABautizado ? cambiosABautizado.length : 0} </th>
                                        </tr>
                                        
                                        <tr>
                                            <th>Por baja de padres</th>
                                        </tr>
                                        {
                                           bajasPorPadres ? bajasPorPadres.map((persona, index) => (
                                                <tr>
                                                    <td>{index + 1}.- {persona.per_Nombre} {persona.per_Apellido_Paterno} {persona.per_Apellido_Materno}</td>
                                                    <td>{persona.ct_Tipo}</td>
                                                    <td>{persona.hte_Comentario}</td>
                                                    <td>{moment(persona.hte_Fecha_Transaccion).format("DD/MM/YYYY")}</td>
                                                </tr>
                                            )) :
                                            <tr>
                                                <td colSpan="4">No hay registros</td>
                                            </tr> 
                                        }
                                        <tr>
                                            <th className="text-right" colSpan="4">Total por baja de padres: {bajasPorPadres ? bajasPorPadres.length : 0} </th>
                                        </tr>

                                        <tr className="bg-info">
                                            <td colSpan="4">
                                                <h4><strong>SUCESOS</strong></h4>
                                            </td>
                                        </tr>

                                        <tr className="bg-light">
                                            <td colSpan="4">
                                                <h5>Matrimonios</h5>
                                            </td>
                                        </tr>

                                        {
                                           matrimonios ? matrimonios.map((persona, index) => (
                                                <tr>
                                                    <td>{index + 1}.- {persona.per_Nombre} {persona.per_Apellido_Paterno} {persona.per_Apellido_Materno}</td>
                                                    <td>{persona.ct_Tipo}</td>
                                                    <td>{persona.hte_Comentario}</td>
                                                    <td>{moment(persona.hte_Fecha_Transaccion).format("DD/MM/YYYY")}</td>
                                                </tr>
                                            )) :
                                            <tr>
                                                <td colSpan="4">No hay registros</td>
                                            </tr> 
                                        }
                                        <tr>
                                            <th className="text-right" colSpan="4">Total de matrimonios: {matrimonios ? matrimonios.length / 2 : 0} </th>
                                        </tr>

                                        <tr className="bg-light">
                                            <td colSpan="4">
                                                <h5>Legalizaciones</h5>
                                            </td>
                                        </tr>

                                        {
                                           legalizaciones ? legalizaciones.map((persona, index) => (
                                                <tr>
                                                    <td>{index + 1}.- {persona.per_Nombre} {persona.per_Apellido_Paterno} {persona.per_Apellido_Materno}</td>
                                                    <td>{persona.ct_Tipo}</td>
                                                    <td>{persona.hte_Comentario}</td>
                                                    <td>{moment(persona.hte_Fecha_Transaccion).format("DD/MM/YYYY")}</td>
                                                </tr>
                                            )) :
                                            <tr>
                                                <td colSpan="4">No hay registros</td>
                                            </tr> 
                                        }
                                        <tr>
                                            <th className="text-right" colSpan="4">Total de legalizaciones: {legalizaciones ? legalizaciones.length / 2: 0} </th>
                                        </tr>

                                        <tr className="bg-light">
                                            <td colSpan="4">
                                                <h5>Presentaciones de niños</h5>
                                            </td>
                                        </tr>

                                        {
                                           presentacionesNiños ? presentacionesNiños.map((persona, index) => (
                                                <tr>
                                                    <td>{index + 1}.- {persona.per_Nombre} {persona.per_Apellido_Paterno} {persona.per_Apellido_Materno}</td>
                                                    <td>{persona.ct_Tipo}</td>
                                                    <td>{persona.hte_Comentario}</td>
                                                    <td>{moment(persona.hte_Fecha_Transaccion).format("DD/MM/YYYY")}</td>
                                                </tr>
                                            )) :
                                            <tr>
                                                <td colSpan="4">No hay registros</td>
                                            </tr> 
                                        }
                                        <tr>
                                            <th className="text-right" colSpan="4">Total de presentaciones de niños: {presentacionesNiños ? presentacionesNiños.length : 0} </th>
                                        </tr>

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
                            <Col>
                                <h5>{JSON.parse(localStorage.getItem("infoSesion")).pem_Nombre}</h5>
                                <hr color="black"></hr>
                                {sector ? <h5>Pastor</h5> : <h5>Obispo</h5>}
                            </Col>
                        </Row>
                </CardBody> : ""
                }
                </Card>
            </Container>
        </Layout>
    )
}
