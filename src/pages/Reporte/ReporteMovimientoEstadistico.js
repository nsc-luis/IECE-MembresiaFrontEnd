import Layout from "../Layout";
import helpers from "../../components/Helpers";
import {
    Container, Button,Input,
     CardTitle, Card, CardBody, Table, UncontrolledCollapse, Row, Col
} from 'reactstrap';

import React, { Fragment, useEffect, useState, } from 'react';
import TableToExcel from "@linways/table-to-excel";
import jsPDF from 'jspdf';
import html2canvas from "html2canvas";
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

    // const downloadTable = () =>{
    //     TableToExcel.convert(document.getElementById("table1"), {
    //         name: "Cumpleaños_membresia.xlsx",
    //         sheet: {
    //           name: "Hoja 1"
    //         }
    //       });
    // }

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

    const printRef = React.useRef();
    const handleDownloadPDF = async () =>{
        const input = document.getElementById('pdf');
        html2canvas(input)
          .then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'JPEG', 0, 0);
            // pdf.output('dataurlnewwindow');
            pdf.save("download.pdf");
          })
        ;
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
                                        
                                        <TableRow label={'Actualizacion Bautizado'} data= {actualizacionB} total={actualizacionB ? actualizacionB.length : 0}/>
                                       
                                        <tr className="bg-light">
                                            <td colSpan="4">
                                                <h5>ALTAS</h5>
                                            </td>
                                        </tr>

                                        <TableRow label={'Bautismo'} data= {bautismos} total={bautismos ? bautismos.length : 0}/>
                                        <TableRow label={'Restitución'} data= {restituciones} total={restituciones ? restituciones.length : 0}/>
                                        <TableRow label={'Cambio de Domicilio'} data= {altasCambioDom} total={altasCambioDom ? altasCambioDom.length : 0}/>

                                        <tr className="bg-light">
                                            <td colSpan="4">
                                                <h5>BAJAS</h5>
                                            </td>
                                        </tr>

                                        <TableRow label={'Excomunión'} data= {excomuniones} total={excomuniones ? excomuniones.length : 0}/>
                                        <TableRow label={'Excomunión Temporal'} data= {excomunionesTemp} total={excomunionesTemp ? excomunionesTemp.length : 0}/>
                                        <TableRow label={'Baja Cambio Domicilio'} data= {bajasCambioDom} total={bajasCambioDom ? bajasCambioDom.length : 0}/>
                                        <TableRow label={'Defunción'} data= {defunciones} total={defunciones ? defunciones.length : 0}/>
                                        

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

                                        <TableRow label={'Actualizaciones'} data= {actualizacionHogar} total={actualizacionHogar ? actualizacionHogar.length : 0}/>

                                        <tr className="bg-light">
                                            <td colSpan="4">
                                                <h5>ALTAS</h5>
                                            </td>
                                        </tr>

                                        <TableRow label={'Alta Hogares'} data= {altasHogares} total={altasHogares ? altasHogares.length : 0}/>

                                        <tr className="bg-light">
                                            <td colSpan="4">
                                                <h5>BAJAS</h5>
                                            </td>
                                        </tr>
                                        <TableRow label={'Baja Hogares'} data= {bajasHogares} total={bajasHogares ? bajasHogares.length : 0}/>
                                       
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

                                        <TableRow label={'Actualizacion No Bautizado'} data= {actualizacionNB} total={actualizacionNB ? actualizacionNB.length : 0}/>
                                        
                                        <tr className="bg-light">
                                            <td colSpan="4">
                                                <h5>ALTAS</h5>
                                            </td>
                                        </tr>

                                        <TableRow label={'Nuevo Ingreso'} data= {nuevoIngreso} total={nuevoIngreso ? nuevoIngreso.length : 0}/>
                                        <TableRow label={'Cambio de Domicilio'} data= {altasCambioDomNB} total={altasCambioDomNB ? altasCambioDomNB.length : 0}/>
                                        <TableRow label={'Reactivación'} data= {reactivaciones} total={reactivaciones ? reactivaciones.length : 0}/>
                                        
                                        <tr className="bg-light">
                                            <td colSpan="4">
                                                <h5>BAJAS</h5>
                                            </td>
                                        </tr>

                                        <TableRow label={'Defunción'} data= {defuncionesNB} total={defuncionesNB ? defuncionesNB.length : 0}/>
                                        <TableRow label={'Cambio de Domicilio'} data= {bajasCambioDomNB} total={bajasCambioDomNB ? bajasCambioDomNB.length : 0}/>
                                        <TableRow label={'Alejamiento'} data= {alejamientos} total={alejamientos ? alejamientos.length : 0}/>
                                        <TableRow label={'Pasa a Personal Bautizado'} data= {cambiosABautizado} total={cambiosABautizado ? cambiosABautizado.length : 0}/>
                                        <TableRow label={'Baja de Padres'} data= {bajasPorPadres} total={bajasPorPadres ? bajasPorPadres.length : 0}/>
                                        
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

                                        <TableRow label={'Matrimonios'} data= {matrimonios} total={matrimonios ? matrimonios.length / 2 : 0}/>
                                       
                                        <tr className="bg-light">
                                            <td colSpan="4">
                                                <h5>Legalizaciones</h5>
                                            </td>
                                        </tr>

                                        <TableRow label={'Legalizaciones'} data= {legalizaciones} total={legalizaciones ? legalizaciones.length / 2 : 0}/>
                                        
                                        <tr className="bg-light">
                                            <td colSpan="4">
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
