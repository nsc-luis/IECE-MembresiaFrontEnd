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

    const [infoDis, setInfoDis] = useState(null)
    const [infoSec, setInfoSec] = useState(null)

    const [loading, setLoading] = useState(true)

    const[startDate, setStartDate] = useState(moment().startOf('month').format("YYYY-MM-DD"))
    const[endDate, setEndDate] = useState(moment().endOf('month').format("YYYY-MM-DD"))

    const dto = JSON.parse(localStorage.getItem("dto"))
    const sector = JSON.parse(localStorage.getItem("sector"))

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



    //Llamadas en render
    useEffect( () => {
         loadData()
         calculateLastMont()
    }, [])

    const calculateLastMont = async () =>{
        const params = {
            fechaInicial: moment().subtract(1,'month').startOf('month').format("YYYY-MM-DD"),
            fechaFinal: moment().subtract(1,'month').endOf('month').format("YYYY-MM-DD"),
        }
        console.log(params);
        if(sector == null){
            params.idSectorDistrito = dto
            const res = await helpers.authAxios.get("/Historial_Transacciones_Estadisticas/HistorialPorFechaDistrito", params);
            
            const resDto = await helpers.authAxios.get("/Distrito/" + dto)
            setInfoDis(resDto.data.dis_Alias)
        }else{
            params.idSectorDistrito = sector
            const res = await helpers.authAxios.post("/Historial_Transacciones_Estadisticas/HistorialPorFechaSector", params);
            const resDto = await helpers.authAxios.get("/Distrito/" + dto)
            setInfoDis(resDto.data.dis_Alias)
            const resSec = await helpers.authAxios.get("/Sector/" + sector)
            setInfoSec(resSec.data.sector[0].sec_Alias)
        }
    }
    const loadData = async () =>{
        const params = {
            fechaInicial: startDate,
            fechaFinal: endDate,
        }
        if(sector == null){
            params.idSectorDistrito = dto
            const res = await helpers.authAxios.post("/Historial_Transacciones_Estadisticas/HistorialPorFechaDistrito", params);
            orderData(res.data.datos)
            const resDto = await helpers.authAxios.get("/Distrito/" + dto)
            setInfoDis(resDto.data.dis_Alias)
        }else{
            params.idSectorDistrito = sector
            const res = await helpers.authAxios.post("/Historial_Transacciones_Estadisticas/HistorialPorFechaSector", params);
            console.log(res.data)
            orderData(res.data.datos)
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
            name: "Reporte_Transacciones.xlsx",
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
    return(
        <>
            <Container fluid>
                <Button className="btn-success m-3 " onClick={downloadTable}><i className="fas fa-file-excel mr-2"></i>Descargar Excel</Button>
                {/* <Button className="btn-danger m-3 " onClick={handleDownloadPDF}><i className="fas fa-file-pdf mr-2"></i>Descargar PDF</Button> */}
                {/* TABLA */}
                <Card body id="pdf">
                <CardTitle className="text-center" tag="h3">
                {!loading ?
                <Row>
                    <Col lg="3">
                        <img src={logo} width="100%"></img>
                    </Col>
                    <Col>
                        REPORTE DE TRANSACCIONES
                        <h5>Distrito: {infoDis}</h5>
                        {sector ? <h5>Sector: {infoSec}</h5> : null}
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
                    <Row>
                        <Table id='table1'>
                            <tr className="text-center">
                                <td colspan="8">DATOS DEL ESTADO ACTUAL DE LA IGLESIA</td>
                            </tr>
                            <tr className="text-center">
                                <td colspan="4">Numero de personal en comunión al principio del mes: </td>
                                <td colspan="4"><u className="font-weight-normal">29</u></td>
                            </tr>
                            <tr className="text-center">
                                <td colspan="4">ALTAS</td>
                                <td colspan="4">BAJAS</td>
                            </tr>
                            <tr className="text-left">
                                <td colspan="2">Por bautismo</td>
                                <td colspan="2"><u className="font-weight-normal">3</u></td>
                                <td colspan="2">Por defunción</td>
                                <td colspan="2"><u className="font-weight-normal">5</u></td>
                            </tr>
                            <tr className="text-left">
                                <td colspan="2">Por restitución a la comunión</td>
                                <td colspan="2"><u className="font-weight-normal">3</u></td>
                                <td colspan="2">Por excomunión</td>
                                <td colspan="2"><u className="font-weight-normal">3</u></td>
                            </tr>
                            <tr className="text-left">
                                <td colspan="2">Por cambio de domicilio</td>
                                <td colspan="2"><u className="font-weight-normal">3</u></td>
                                <td colspan="2">Por cambio de domicilio</td>
                                <td colspan="2"><u className="font-weight-normal">3</u></td>
                            </tr>
                            <tr className="text-left">
                                <td colspan="2">Total de altas</td>
                                <td colspan="2"><u className="font-weight-normal">3</u></td>
                                <td colspan="2">Total de bajas</td>
                                <td colspan="2"><u className="font-weight-normal">3</u></td>
                            </tr>
                            
                            <tr className="text-center">
                                <td colspan="4">Numero de personal activo No Bautizado al principio del mes: </td>
                                <td colspan="4"><u className="font-weight-normal">29</u></td>
                            </tr>
                            <tr className="text-center">
                                <td colspan="4">ALTAS</td>
                                <td colspan="4">BAJAS</td>
                            </tr>
                            <tr className="text-left">
                                <td colspan="2">Por Nuevo Ingreso</td>
                                <td colspan="2"><u className="font-weight-normal">3</u></td>
                                <td colspan="2">Por defunción</td>
                                <td colspan="2"><u className="font-weight-normal">5</u></td>
                            </tr>
                            <tr className="text-left">
                                <td colspan="2">Por reactivación</td>
                                <td colspan="2"><u className="font-weight-normal">3</u></td>
                                <td colspan="2">Por alejamiento</td>
                                <td colspan="2"><u className="font-weight-normal">3</u></td>
                            </tr>
                            <tr className="text-left">
                                <td colspan="2">Por cambio de domicilio</td>
                                <td colspan="2"><u className="font-weight-normal">3</u></td>
                                <td colspan="2">Por cambio de domicilio</td>
                                <td colspan="2"><u className="font-weight-normal">3</u></td>
                            </tr>
                            <tr className="text-left">
                                <td colspan="2"></td>
                                <td colspan="2"></td>
                                <td colspan="2">Por baja de padres</td>
                                <td colspan="2"><u className="font-weight-normal">3</u></td>
                            </tr>
                            <tr className="text-left">
                                <td colspan="2">Total de altas</td>
                                <td colspan="2"><u className="font-weight-normal">3</u></td>
                                <td colspan="2">Total de bajas</td>
                                <td colspan="2"><u className="font-weight-normal">3</u></td>
                            </tr>
                            <tr className="text-center">
                                    <td colspan="4"></td>
                                    <td colspan="4"></td>
                            </tr>
                            <tr className="text-left">
                                <td colspan="2">Matrimonios</td>
                                <td colspan="2"><u className="font-weight-normal">3</u></td>
                                <td colspan="2">Legalizaciones</td>
                                <td colspan="2"><u className="font-weight-normal">3</u></td>
                            </tr>
                            <tr className="text-left">
                                <td colspan="2">Presentaciones de niños</td>
                                <td colspan="2"><u className="font-weight-normal">3</u></td>
                                <td colspan="2">No. de Hogares</td>
                                <td colspan="2"><u className="font-weight-normal">3</u></td>
                            </tr>
                            <tr className="text-center">
                                <td colspan="4">PERSONAL BAUTIZADO</td>
                                <td colspan="4">PERSONAL NO BAUTIZADO</td>
                            </tr>
                            <tr className="text-center">
                                <td colspan="2">ADULTOS</td>
                                <td colspan="2">JÓVENES</td>
                                <td colspan="2">JÓVENES</td>
                                <td colspan="2">NIÑOS</td>
                            </tr>
                            <tr className="text-left">
                                <td>Hombres</td>
                                <td><u className="font-weight-normal">3</u></td>
                                <td>Hombres</td>
                                <td><u className="font-weight-normal">3</u></td>
                                <td>Hombres</td>
                                <td><u className="font-weight-normal">3</u></td>
                                <td>Niños</td>
                                <td><u className="font-weight-normal">3</u></td>
                            </tr>
                            <tr className="text-left">
                                <td>Mujeres</td>
                                <td><u className="font-weight-normal">3</u></td>
                                <td>Mujeres</td>
                                <td><u className="font-weight-normal">3</u></td>
                                <td>Mujeres</td>
                                <td><u className="font-weight-normal">3</u></td>
                                <td>Niñas</td>
                                <td><u className="font-weight-normal">3</u></td>
                            </tr>
                            <tr className="text-left">
                                <td>Total</td>
                                <td><u className="font-weight-normal">3</u></td>
                                <td>Total</td>
                                <td><u className="font-weight-normal">3</u></td>
                                <td>Total</td>
                                <td><u className="font-weight-normal">3</u></td>
                                <td>Total</td>
                                <td><u className="font-weight-normal">3</u></td>
                            </tr>
                            <tr className="text-center">
                                <td colspan="2">No. Completo de personal bautizado</td>
                                <td colspan="2"><u className="font-weight-normal">3</u></td>
                                <td colspan="2">No. Completo de personal no bautizado</td>
                                <td colspan="2"><u className="font-weight-normal">3</u></td>
                            </tr>
                            <tr className="text-center">
                                <td colspan="4">Número completo del personal que integra la iglesia</td>
                                <td colspan="4"><u className="font-weight-normal">134</u></td>
                            </tr>
                            <tr className="text-center">
                                <td colspan="8">Desglose de movimiento estadistico:</td>
                            </tr>
                        </Table>
                    </Row>
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
            </Container>
        </>
    )
}
