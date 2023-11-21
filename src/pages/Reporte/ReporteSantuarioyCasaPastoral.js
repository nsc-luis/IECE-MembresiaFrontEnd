import Layout from "../Layout";

import helpers from "../../components/Helpers";
import {
    Container, Button,
    CardTitle, Card, CardBody, Table, UncontrolledCollapse, Row, Col,
    FormGroup, Input, CardHeader, CardFooter, Label
} from 'reactstrap';

import React, { Fragment, useEffect, useState, } from 'react';
import TableToExcel from "@linways/table-to-excel";
import jsPDF from 'jspdf';
import moment from 'moment/min/moment-with-locales';
import 'moment/dist/locale/es'
import logo from '../../assets/images/IECE_LogoOficial.jpg'

export default function ReporteSantuarioyCasaPastoral() {
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
    const [casaPastoral, setCasaPastoral] = useState([])
    const [casaPastoralConDomicilio, setCasaPastoralConDomicilio] = useState([])
    const [santuarioConFoto, setSantuarioConFoto] = useState([])
    const [santuario, setSantuario] = useState([])
    const [direccion, setDireccion] = useState([])
    const [domicilio, setDomicilio] = useState([])
    //Llamadas en render

    useEffect(() => {
        window.scrollTo(0, 0)
        //setEntidadTitulo("TODOS LOS SECTORES");
    }, [])


    const reseteo_casaPastoral = () => {
        setCasaPastoralConDomicilio([{
            casaPastoral: null,
            domicilio: null,
            direccion: null

        }]);
    };

    useEffect(() => {

        if (sector == null) { //Para Sesión Obispo
            console.log("inicia programa")
            getTemplosConFotoByDistrito(dto)
            getCasasPastoralesByDistrito(dto)
            getInfoDistrito()
            setSectorSeleccionado("todos");
            setLider("OBISPO");
            setEntidadTitulo("TODOS LOS SECTORES");


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
            getTemploConFotoBySector(sector)
            getCasaPastoralBySector(sector)
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


    const getTemploConFotoBySector = async (sec) => {
        try {
            await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/Templo/GetTemployDomicilioBySector/${sec}`)
                .then(res => {
                    console.log("templo", res.santuarioConFoto);
                    if (res.data.status === "success")
                        setSantuarioConFoto(res.data.santuarioConFoto)
                    else {
                        setSantuarioConFoto(null)

                    }
                })
            )
        }
        catch {
            alert("ERROR!\nOcurrió un problema al consultar la información, cierre la aplicación y vuelva a intentar.")
        }
    }

    const getCasaPastoralBySector = async (sec) => {
        try {
            await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/CasaPastoral/GetCasaPastoralyDomicilioBySector/${sec}`)
                .then(res => {
                    console.log("respuesta", res.data);
                    if (res.data.status === "success") {
                        setCasaPastoralConDomicilio(res.data.casaPastoralConDomicilio)
                        //setDomicilio(res.data.casaPastoralConDomicilio.domicilio)
                        //setDireccion(res.data.casaPastoralConDomicilio.direccion)

                    }
                    else if (res.data.status == "notFound") {
                        reseteo_casaPastoral();



                    }
                })
            )
        }
        catch {
            alert("ERROR!\nOcurrió un problema al consultar la información, cierre la aplicación y vuelva a intentar.")
        }
    }

    const getTemplosConFotoByDistrito = async (dis) => {
        try {
            await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/Templo/GetTemployDomicilioByDistrito/${dis}`)
                .then(res => {
                    console.log("templo", res.data.santuarioConFoto);
                    if (res.data.status === "success")
                        setSantuarioConFoto(res.data.santuarioConFoto)
                    else {
                        setSantuarioConFoto(null)

                    }
                })
            )
        }
        catch {
            alert("ERROR!\nOcurrio un problema al consultar la información, cierre la aplicación y vuelva a intentar.")
        }
    }

    const getCasasPastoralesByDistrito = async (dis) => {
        try {
            await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/CasaPastoral/GetCasaPastoralyDomicilioByDistrito/${dis}`)
                .then(res => {
                    console.log("respuesta", res.data);
                    if (res.data.status === "success") {
                        setCasaPastoralConDomicilio(res.data.casaPastoralConDomicilio)
                        //setDomicilio(res.data.casaPastoralConDomicilio.domicilio)
                        //setDireccion(res.data.casaPastoralConDomicilio.direccion)

                    }
                    else if (res.data.status == "notFound") {
                        reseteo_casaPastoral();

                    }
                })
            )
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
            getTemploConFotoBySector(e.target.value)
            getCasaPastoralBySector(e.target.value)
            setSectorSeleccionado(e.target.value);
            getTitulo(e.target.value)
        } else {
            getTemplosConFotoByDistrito(dto)
            getCasasPastoralesByDistrito(dto)
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

    const downloadTable = () => {
        const table1 = document.getElementById("table1");
        const table2 = document.getElementById("table2");
        const book = TableToExcel.tableToBook(table1, { sheet: { name: "Santuarios" } });
        TableToExcel.tableToSheet(book, table2, { sheet: { name: "Casas Pastorales" } });
        TableToExcel.save(book, "Santuarios y CasasPastorales.xlsx")
    };

    const reporteSantuarioyCasaPastoralPDF = () => {
        let index = 1
        // INSTANCIA NUEVO OBJETO PARA CREAR PDF
        const doc = new jsPDF("p", "mm", "letter");
        let pageHeight = doc.internal.pageSize.height;
        doc.addImage(logo, 'PNG', 10, 5, 70, 20);
        doc.text("REPORTE DE SANTUARIOS Y CASAS PASTORALES", 140, 10, { align: "center", maxWidth: 110 });
        doc.setFontSize(10);

        if (sector) {
            doc.text(entidadTitulo, 140, 25, { align: "center" });
        }
        else {
            doc.text(`${infoDis.dis_Tipo_Distrito} ${infoDis.dis_Numero}: ${infoDis.dis_Alias}`, 140, 23, { align: "center" })
            doc.text(entidadTitulo, 140, 28, { align: "center" })
        }
        doc.line(10, 30, 200, 30);

        doc.setFontSize(8);
        let yAxis = 30
        // doc.setFillColor(191, 201, 202) // Codigos de color RGB (red, green, blue)
        // doc.rect(10, yAxis, 190, 4, "F");
        doc.setFont("", "", "bold");
        yAxis += 3;


        index = 1;
        //yAxis += 7;
        santuarioConFoto.map((obj) => {
            yAxis += 4;
            doc.setFont("", "", "bold");
            doc.setFontSize(12);
            doc.setFillColor(191, 201, 202) // Codigos de color RGB (red, green, blue)
            doc.rect(10, (yAxis - 4), 190, 5, "F");
            doc.text("SANTUARIO", 12, yAxis);
            let textoNormalWidth = doc.getTextWidth(`SANTUARIO`);
            if (sectorSeleccionado == "todos") {
                doc.setFont("", "", "bold");
                let textoNormalWidth = doc.getTextWidth("SANTUARIO");
                doc.setFontSize(8);
                doc.setFont("", "", "normal");
                doc.text(`${obj.sector.sec_Tipo_Sector} ${obj.sector.sec_Numero}: ${obj.sector.sec_Alias} `, 16 + textoNormalWidth, yAxis - .5)
            }

            doc.setFont("", "", "normal");
            doc.setFontSize(8);
            yAxis += 10;

            if (obj.templo) {
                doc.addImage(obj.foto, 'JPG', 140, yAxis - 8, 60, 45);
                doc.setFont("", "", "bold");
                doc.text(`TIPO DE SANTUARIO: `, 10, yAxis);
                textoNormalWidth = doc.getTextWidth(`TIPO DE SANTUARIO: `);
                doc.setFont("", "", "normal");
                doc.text(`${obj.tem_Tipo_Templo !== null ? ` ${obj.tem_Tipo_Templo} ` : "--"}`, 10 + textoNormalWidth, yAxis);
                yAxis += 6;

                doc.setFont("", "", "bold");
                doc.text(`PROPIEDAD DE: `, 10, yAxis);
                textoNormalWidth = doc.getTextWidth(`PROPIEDAD DE: `);
                doc.setFont("", "", "normal");
                doc.text(`${obj.tem_Propiedad_De !== null ? ` ${obj.tem_Propiedad_De} ` : " PENDIENTE"}`, 10 + textoNormalWidth, yAxis);
                yAxis += 6;

                doc.setFont("", "", "bold");
                doc.text(`AFORO: `, 10, yAxis);
                textoNormalWidth = doc.getTextWidth(`AFORO: `);
                doc.setFont("", "", "normal");
                doc.text(`${obj.tem_Aforo !== null ? ` ${obj.tem_Aforo} ` : "--"}`, 10 + textoNormalWidth, yAxis);
                yAxis += 6;

                doc.setFont("", "", "bold");
                doc.text(`TELÉFONO FIJO: `, 10, yAxis);
                textoNormalWidth = doc.getTextWidth(`TELÉFONO FIJO: `);
                doc.setFont("", "", "normal");
                doc.text(`${obj.telFijo !== null ? ` ${obj.telFijo} ` : "--"}`, 10 + textoNormalWidth, yAxis);
                yAxis += 6;

                doc.setFont("", "", "bold");
                doc.text(`DOMICILIO: `, 10, yAxis);
                textoNormalWidth = doc.getTextWidth(`DOMICILIO: `);
                doc.setFont("", "", "normal");

                //Función para separar TextoLargo en varios renglones según se necesite
                const textoLargo = `${obj.domicilio !== null ? ` ${obj.domicilio} ` : "--"}`;
                const anchoMaximo = 110; // Ancho máximo por línea en el PDF

                const lineas = doc.splitTextToSize(textoLargo, anchoMaximo);
                // Imprimir cada línea en el PDF
                lineas.forEach(linea => {
                    doc.text(10 + textoNormalWidth, yAxis, linea);
                    yAxis += 4; // Espacio entre líneas (ajustar según sea necesario)
                });
            } else {
                doc.text(`NO HAY SANTUARIO REGISTRADO; Envíe datos y foto a la Dirección General `, 10, yAxis);
            }

            yAxis += 12;
            index++;
            if (yAxis >= pageHeight - 50) {
                doc.addPage();
                yAxis = 15 // Restart height position
            }
        })


        //INICIA CASA PASTORAL
        casaPastoralConDomicilio.map((obj) => {
            yAxis += 4;
            doc.setFont("", "", "bold");
            doc.setFontSize(12);
            doc.setFillColor(191, 201, 202) // Codigos de color RGB (red, green, blue)
            doc.rect(10, (yAxis - 4), 190, 5, "F");
            doc.text("CASA PASTORAL", 12, yAxis);
            let textoNormalWidth = doc.getTextWidth(`CASA PASTORAL`);
            if (sectorSeleccionado == "todos") {
                doc.setFont("", "", "bold");
                let textoNormalWidth = doc.getTextWidth("CASA PASTORAL");
                doc.setFontSize(8);
                doc.setFont("", "", "normal");
                doc.text(`${obj.sector.sec_Tipo_Sector} ${obj.sector.sec_Numero}: ${obj.sector.sec_Alias} `, 16 + textoNormalWidth, yAxis - .5)
            }
            doc.setFont("", "", "normal");
            doc.setFontSize(8);
            yAxis += 8;

            if (obj.casaPastoral != null) {

                doc.setFont("", "", "bold");
                doc.text(`UBICACIÓN: `, 10, yAxis);
                textoNormalWidth = doc.getTextWidth(`UBICACIÓN: `);
                doc.setFont("", "", "normal");

                doc.text(`${obj.casaPastoral.cp_Mismo_Predio_Templo === true ? ` ESTÁ EN EL MISMO PREDIO QUE EL DEL SANTUARIO.` : " ESTÁ EN DIFERENTE PREDIO QUE EL DEL SANTUARIO."}`, 10 + textoNormalWidth, yAxis);

                yAxis += 6;

                doc.setFont("", "", "bold");
                doc.text(`PROPIEDAD DE: `, 10, yAxis);
                textoNormalWidth = doc.getTextWidth(`PROPIEDAD DE: `);
                doc.setFont("", "", "normal");
                doc.text(`${obj.casaPastoral.cp_Propiedad_De !== null ? ` ${obj.casaPastoral.cp_Propiedad_De} ` : " PENDIENTE. "}`, 10 + textoNormalWidth, yAxis);
                yAxis += 6;

                if (obj.casaPastoral.cp_Mismo_Predio_Templo !== true) {

                    doc.setFont("", "", "bold");
                    doc.text(`TELÉFONO FIJO: `, 10, yAxis);
                    textoNormalWidth = doc.getTextWidth(`TELÉFONO FIJO: `);
                    doc.setFont("", "", "normal");
                    doc.text(`${obj.casaPastoral.cp_Tel_Fijo !== null ? ` ${obj.casaPastoral.cp_Tel_Fijo} ` : "--"}`, 10 + textoNormalWidth, yAxis);
                    yAxis += 6;


                    doc.setFont("", "", "bold");
                    doc.text(`DOMICILIO: `, 10, yAxis);
                    textoNormalWidth = doc.getTextWidth(`DOMICILIO: `);
                    doc.setFont("", "", "normal");

                    //Función para separar TextoLargo en varios renglones según se necesite
                    const textoLargo = `${obj.direccion !== null ? ` ${obj.direccion} ` : "--"}`;
                    const anchoMaximo = 110; // Ancho máximo por línea en el PDF

                    const lineas = doc.splitTextToSize(textoLargo, anchoMaximo);
                    // Imprimir cada línea en el PDF
                    lineas.forEach(linea => {
                        doc.text(10 + textoNormalWidth, yAxis, linea);
                        yAxis += 4; // Espacio entre líneas (ajustar según sea necesario)
                    });
                }

            } else {
                doc.text(`NO HAY CASA PASTORAL REGISTRADA `, 10, yAxis);
            }

            yAxis += 6;
            index++;
            if (yAxis >= pageHeight - 50) {
                doc.addPage();
                yAxis = 15 // Restart height position
            }
        })

        if (yAxis >= pageHeight - 50) {
            doc.addPage();
            yAxis = 15 // Restart height position
        }

        yAxis += sectorSeleccionado == "todos" ? 15 : 35;

        yAxis += 15;
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
        console.log("casaPastoralCiclo: ", casaPastoralConDomicilio),
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
                <Button className="btn-danger m-3 " onClick={() => reporteSantuarioyCasaPastoralPDF()}><i className="fas fa-file-pdf mr-2"></i>Descargar PDF</Button>
                <Card body>
                    <Row>
                        <Col lg="5">
                            <img src={logo} alt="Logo" width="100%" className="ml-3"></img>
                        </Col>
                        <Col lg="6" >
                            <CardTitle className="text-center" tag="h3">
                                REPORTE DE SANTUARIOS Y CASAS PASTORALES
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

                        {santuarioConFoto.map((santuario) => (
                            <FormGroup>
                                <Card className="border-info">
                                    <CardHeader className="categoriasReportes">
                                        <h4 className="text-center ">SANTUARIO</h4>
                                        {sectorSeleccionado == "todos" &&
                                            <h5 className="text-center ">{`${santuario.sector.sec_Tipo_Sector} ${santuario.sector.sec_Numero}: ${santuario.sector.sec_Alias} `}</h5>
                                        }
                                    </CardHeader>
                                    <CardBody>
                                        {santuario.templo ?
                                            <div className='container'>
                                                <Row >
                                                    <Col md='4'></Col>
                                                    <Col className=''>
                                                        <img className='img-thumbnail' src={`data:${santuario.MIMEType};base64,${santuario.foto}`} alt="Imagen de templo" type="image/jpg" ></img>
                                                    </Col>
                                                    <Col md='4'></Col>
                                                </Row>

                                                <Row className="my-2">
                                                    <Col md='4' >
                                                        <Label> Tipo de Santuario</Label>
                                                        <Input bsSize="sm" type="text" value={santuario.tem_Tipo_Templo ? santuario.tem_Tipo_Templo : "--"} />
                                                    </Col>
                                                    <Col md='4'>
                                                        <Label> Propiedad de:</Label>
                                                        <Input bsSize="sm" type="text" value={santuario.tem_Propiedad_De ? santuario.tem_Propiedad_De : "PENDIENTE"} readOnly="true" />
                                                    </Col>
                                                    <Col md='4'>
                                                        <Label> Aforo:</Label>
                                                        <Input bsSize="sm" type="text" value={santuario.tem_Aforo ? santuario.tem_Aforo : "--"} />
                                                    </Col>
                                                </Row>
                                                <Row className="my-2">
                                                    <Col md='9'>
                                                        <Label> Domicilio:</Label>
                                                        <Input bsSize="sm" type="text" value={santuario.domicilio ? santuario.domicilio : "--"} />
                                                    </Col>
                                                    <Col md='3'>
                                                        <Label className='bold'> Teléfono Fijo:</Label>
                                                        <Input bsSize="sm" type="text" value={santuario.telFijo ? santuario.telFijo : "--"} />
                                                    </Col>
                                                </Row>
                                            </div>

                                            :
                                            <div>
                                                <h4 className='text-center'>No hay Templo Registrado. Envíe información del Santuario a la Dirección General.</h4>
                                            </div>
                                        }
                                    </CardBody>
                                </Card>
                            </FormGroup>
                        ))}

                        {casaPastoralConDomicilio.map((cpcd) => (
                            < FormGroup >
                                <Card className="border-info">
                                    <CardHeader className="categoriasReportes">
                                        <h4 className="text-center ">CASA PASTORAL</h4>
                                        {(sectorSeleccionado === "todos") &&
                                            <h5 className="text-center ">{`${cpcd.sector.sec_Tipo_Sector} ${cpcd.sector.sec_Numero}: ${cpcd.sector.sec_Alias} `}</h5>
                                        }
                                    </CardHeader>
                                    <CardBody>

                                        {cpcd.casaPastoral !== null ?
                                            <Fragment>
                                                <Row className="my-2">
                                                    <Col md='8'>
                                                        <fieldset className="row mb-2">
                                                            <legend className="col-form-label col-sm-8 pt-0"><strong>Ubicación de la Casa Pastoral</strong></legend>
                                                            <div className="col-sm-10">
                                                                <div className="form-check">
                                                                    <input className="form-check-input" type="radio" name={cpcd.casaPastoral.cp_Id_CasaPastoral} id="gridRadios1" value="option1" checked={cpcd.casaPastoral.cp_Mismo_Predio_Templo === true} />
                                                                    <label className="form-check-label" htmlFor="gridRadios1">
                                                                        Está en el mismo predio que el Santuario
                                                                    </label>
                                                                </div>
                                                                <div className="form-check">
                                                                    <input className="form-check-input" type="radio" name={cpcd.casaPastoral.cp_Id_CasaPastoral} id="gridRadios2" value="option2" checked={cpcd.casaPastoral.cp_Mismo_Predio_Templo === false} />
                                                                    <label className="form-check-label" htmlFor="gridRadios2">
                                                                        Está en un predio diferente al del Santuario
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </fieldset>
                                                    </Col>
                                                    {!cpcd.casaPastoral.cp_Mismo_Predio_Templo &&
                                                        <Col md='4'>
                                                            <Label className='bold'> Propiedad de:</Label>
                                                            <Input
                                                                name="cp_Propiedad_De"
                                                                bsSize="sm"
                                                                type="select"
                                                                //onChange={this.onChangeCasaPastoral}
                                                                value={cpcd.casaPastoral.cp_Propiedad_De}
                                                                disabled={true} >
                                                                <option value="0">PENDIENTE</option>
                                                                <option value="DE LA IECE">DE LA IECE</option>
                                                                <option value="DE LA NACION">DE LA NACION</option>
                                                                <option value="DE PARTICULAR">DE PARTICULAR</option>
                                                                <option value="RENTADO">AJENO (RENTADO)</option>
                                                                <option value="PRESTADO">AJENO (PRESTADO)</option>
                                                            </Input>
                                                        </Col>
                                                    }
                                                </Row>
                                                {!cpcd.casaPastoral.cp_Mismo_Predio_Templo &&
                                                    <Row className="my-2">
                                                        <Col md='9'>
                                                            <Label> Domicilio:</Label>
                                                            <Input bsSize="sm" type="text" value={cpcd.direccion} />
                                                        </Col>
                                                        <Col md='3'>
                                                            <Label className='bold'> Teléfono Fijo:</Label>
                                                            <Input bsSize="sm" type="text" value={cpcd.casaPastoral.cp_Tel_Fijo} />
                                                        </Col>
                                                    </Row>
                                                }
                                            </Fragment>
                                            :
                                            <div>
                                                <h4 className='text-center'>No hay Casa Pastoral Registrada</h4>
                                            </div>

                                        }
                                    </CardBody>
                                </Card>
                            </FormGroup>
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
                            <Col xs="1"></Col>
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

                        <Table responsive hover id="table1" data-cols-width="50, 20,70">
                            <thead>
                                <tr>
                                    <th width="30%"><b>SECTOR</b></th>
                                    <th width="30%">SANTUARIO</th>
                                    <th width="70%">DETALLE</th>
                                </tr>
                            </thead>

                            {santuarioConFoto.map((obj, index) => {
                                return (
                                    <tbody>
                                        <>
                                            <tr>
                                                <td rowSpan={5} style={{ textAlign: 'center', verticalAlign: 'middle' }}>{`${obj.sector.sec_Tipo_Sector} ${obj.sector.sec_Numero}: ${obj.sector.sec_Alias} `}</td>
                                                <td><strong>Tipo de Santuario: </strong></td>
                                                <td>{obj.tem_Tipo_Templo ? obj.tem_Tipo_Templo : "--"}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Propiedad de:</strong></td>
                                                <td>{obj.tem_Propiedad_De ? obj.tem_Propiedad_De : "--"}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Aforo:</strong></td>
                                                <td>{obj.tem_Aforo ? obj.tem_Aforo : "--"}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Domicilio:</strong></td>
                                                <td>{obj.domicilio ? obj.domicilio : "--"}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Teléfono Fijo</strong></td>
                                                <td>{obj.telFijo !== null ? `${obj.telFijo}` : "--"}</td>
                                            </tr>
                                        </>
                                    </tbody>
                                )
                            }
                            )}
                        </Table>

                        <Table responsive hover id="table2" data-cols-width="50, 20,70">
                            <thead>
                                <tr>
                                    <th width="30%"><b>SECTOR</b></th>
                                    <th width="30%">CASA PASTORAL</th>
                                    <th width="70%">DETALLE</th>
                                </tr>
                            </thead>


                            {casaPastoralConDomicilio.map((obj, index) => {
                                return (
                                    <tbody>
                                        <>
                                            {obj.casaPastoral !== null ?
                                                <>
                                                    <tr>
                                                        <td rowSpan={4} style={{ textAlign: 'center', verticalAlign: 'middle' }}>{`${obj.sector.sec_Tipo_Sector} ${obj.sector.sec_Numero}: ${obj.sector.sec_Alias} `}</td>
                                                        <td><strong>Ubicación: </strong></td>
                                                        <td>{obj.casaPastoral.cp_Mismo_Predio_Templo === true ? "Mismo predio que el del Santuario" : "Diferente predio al del Santuario"}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Propiedad de:</strong></td>
                                                        <td>{obj.casaPastoral.tem_Propiedad_De && obj.casaPastoral.cp_Mismo_Predio_Templo !== true ? obj.casaPastoral.tem_Propiedad_De : "--"}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Domicilio:</strong></td>
                                                        <td>{obj.direccion && obj.casaPastoral.cp_Mismo_Predio_Templo !== true ? obj.direccion : "--"}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Teléfono Fijo</strong></td>
                                                        <td>{obj.casaPastoral.cp_Tel_Fijo !== null && obj.casaPastoral.cp_Mismo_Predio_Templo !== true ? `${obj.casaPastoral.cp_Tel_Fijo}` : "--"}</td>
                                                    </tr>
                                                </>
                                                :
                                                <tr>
                                                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{`${obj.sector.sec_Tipo_Sector} ${obj.sector.sec_Numero}: ${obj.sector.sec_Alias} `}</td>
                                                    <td><strong>No hay casa pastoral registrada </strong></td>
                                                </tr>
                                            }
                                        </>
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
