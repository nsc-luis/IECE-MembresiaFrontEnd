import Layout from "../Layout";
import helpers from "../../components/Helpers";
import {
    Container, Button, FormGroup, Input,
    CardTitle, Card, CardBody, Table, Modal, ModalBody, /* UncontrolledCollapse, */ Row, Col
} from 'reactstrap';

import React, { useEffect, useState, } from 'react';
import TableToExcel from "@linways/table-to-excel";
import jsPDF from 'jspdf';
import moment from 'moment/min/moment-with-locales';
import 'moment/dist/locale/es'
import logo from '../../assets/images/IECE_LogoOficial.jpg'

export default function ReporteCumpleaños() {
    //Estados
    const [personas, setPersonas] = useState([])
    const [infoDis, setInfoDis] = useState([])
    const [infoSec, setInfoSec] = useState([])
    const dto = JSON.parse(localStorage.getItem("dto"))
    const sector = JSON.parse(localStorage.getItem("sector"))
    const [infoSecretario, setInfoSecretario] = useState({})
    const [sectores, setSectores] = useState([])
    const [lider, setLider] = useState("")
    const [sectorSeleccionado, setSectorSeleccionado] = useState(null)
    const [entidadTitulo, setEntidadTitulo] = useState("")
    const [mensajeDelProceso, setMensajeDelProceso] = useState("")
    const [modalShow, setModalShow] = useState(false)
    //Llamadas en render
    useEffect(() => {
        window.scrollTo(0, 0);

        if (sector == null) {
            getInfoDistrito()
            getPersonasDistrito()
            setSectorSeleccionado("todos");
            setLider("OBISPO")
            setEntidadTitulo("TODOS LOS SECTORES")

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

        } else {
            getInfoDistrito()
            getPersonasSector(sector)
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

            console.log("Distrito al Final: ", infoDis)
        }
    }, [])

    const getInfoDistrito = () => {
        console.log("Dto: ", dto)
        helpers.validaToken().then(helpers.authAxios.get("/Distrito/" + dto)
            .then(res => {
                setInfoDis(res.data)
                console.log("Distrito: ", res.data)
            })
        )
    }

    const getPersonasDistrito = () => {

        setMensajeDelProceso("Procesando...")
        setModalShow(true)


        helpers.validaToken().then(helpers.authAxios.get("/Persona/GetByDistrito/" + dto)
            .then(res => {
                const sortedData = res.data.map(d => (d.persona)).sort((a, b) => {
                    return moment(a.per_Fecha_Nacimiento).dayOfYear() - moment(b.per_Fecha_Nacimiento).dayOfYear()
                })
                setPersonas(sortedData.filter(per => per.per_Activo === true))
                setMensajeDelProceso("")
                setModalShow(false)
            })
        );
    }

    const getPersonasSector = (sec) => {

        setMensajeDelProceso("Procesando...")
        setModalShow(true)

        helpers.validaToken().then(helpers.authAxios.get("/Persona/GetBySector/" + sec)
            .then(res => {
                const sortedData = res.data.map(d => (d.persona)).sort((a, b) => {
                    return moment(a.per_Fecha_Nacimiento).dayOfYear() - moment(b.per_Fecha_Nacimiento).dayOfYear()
                })
                setPersonas(sortedData.filter(per => per.per_Activo === true))
                setMensajeDelProceso("")
                setModalShow(false)
            })
        );
    }

    const handle_sectorSeleccionado = async (e) => {

        if (e.target.value !== "todos") {

            getPersonasSector(e.target.value)
            setSectorSeleccionado(e.target.value);
            getTitulo(e.target.value)
        } else {
            getPersonasDistrito();
            setSectorSeleccionado("todos");
            setEntidadTitulo("TODOS LOS SECTORES")
        }
    }

    const getTitulo = (sector) => {
        //console.log("Sector: ", sectores);
        sectores.map(sec => {

            if (sec.sec_Id_Sector == sector) {
                setEntidadTitulo(sec.sec_Tipo_Sector + " " + sec.sec_Numero + ": " + sec.sec_Alias)
                //console.log("entidadTitulo: ",sec.sec_Tipo_Sector + " " + sec.sec_Numero + " " + sec.sec_Alias)
            }
        })
    }
    const downloadTable = () => {
        TableToExcel.convert(document.getElementById("table1"), {
            name: "Cumpleaños_membresia.xlsx",
            sheet: {
                name: "Hoja 1"
            }
        });
    }

    let totalCount = 0;

    /* const countPersons = (type) =>{
        let count = 0
        personas.map(persona => {
            if(persona.persona.per_Categoria === type){
                count+=1 
            }
        })
        totalCount += count;
        return count
    } */
    const reportePersonalBautizadoPDF = () => {
        totalCount = 0
        let index = 1
        // INSTANCIA NUEVO OBJETO PARA CREAR PDF
        const doc = new jsPDF("p", "mm", "letter");

        doc.addImage(logo, 'PNG', 10, 5, 70, 20);
        doc.text("LISTA DE CUMPLEAÑOS", 140, 10, { align: "center" });
        doc.setFontSize(10);

        if (sector) {
            doc.text(entidadTitulo, 140, 22, { align: "center" });
            //doc.text(`AL DÍA ${moment().format('LL').toUpperCase()}`, 135, 23, {align:"center"});
        }
        else {
            doc.text(`${infoDis.dis_Tipo_Distrito} ${infoDis.dis_Numero}: ${infoDis.dis_Alias}`, 140, 17, { align: "center" })
            doc.text(entidadTitulo, 140, 22, { align: "center" })
            //doc.text(`AL DÍA ${moment().format('LL').toUpperCase()}`, 135, 23, {align:"center"});
        }
        doc.line(10, 32, 200, 32);

        doc.setFontSize(8);

        const headers = [
            'Indice',
            'Nombre',
            'Grupo',
            'Fecha_Nacimiento',
            'Edad_Actual',
        ]

        console.log("personas: ", personas);
        const data = personas.map((persona, index) => ({
            Indice: String(index + 1),
            Nombre: (persona.apellidoPrincipal ? persona.apellidoPrincipal : " ") + ' ' + (persona.per_Apellido_Materno ? persona.per_Apellido_Materno : " ") + "" + (persona.per_Nombre ? persona.per_Nombre : " "),
            Grupo: persona.per_Bautizado ? "Bautizado".toUpperCase() : "No Bautizado".toUpperCase(),
            Fecha_Nacimiento: String(moment(persona.per_Fecha_Nacimiento).format("LL")),
            Edad_Actual: String(moment().diff(persona.per_Fecha_Nacimiento, "years")),
        }))

        let yAxis = 35 + data.length * 7 + 5
        doc.setFontSize(8);

        doc.table(10, 35, data, headers, { autoSize: true, fontSize: 8, padding: 2, margins: { left: 150, top: 10, bottom: 10, width: 10 } })

        // let yAxis = 160
        // doc.setFontSize(8);

        yAxis += 20;
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
        doc.text(`${infoSecretario}`, 41, yAxis);
        doc.text(`${JSON.parse(localStorage.getItem("infoSesion")).pem_Nombre}`, 130, yAxis);


        doc.save("ReporteCumpleaños.pdf");
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

                <Button className="btn-success m-3 " onClick={() => downloadTable()}><i className="fas fa-file-excel mr-2"></i>Descargar Excel</Button>
                <Button className="btn-danger m-3 " onClick={() => reportePersonalBautizadoPDF()}><i className="fas fa-file-pdf mr-2"></i>Descargar PDF</Button>

                {/* TABLA */}
                <Card body>
                    <CardTitle className="text-center" tag="h3">
                        <Row>
                            <Col lg="3">
                                <img src={logo} width="100%"></img>
                            </Col>
                            <Col>
                                LISTA DE PERSONAL POR FECHA DE CUMPLEAÑOS

                                <FormGroup>
                                    <Row>
                                        <h1></h1>
                                    </Row>
                                </FormGroup>

                                <h5>{entidadTitulo}</h5>
                                {/* {sector ? <h5>Sector: {infoSec}</h5> : null} */}
                            </Col>
                        </Row>
                    </CardTitle>
                    <CardBody>
                        <Table responsive hover id="table1" data-cols-width="10,40,20,40,30">
                            <thead>
                                <tr>
                                    <th data-f-bold>Indice</th>
                                    <th data-f-bold>Nombre Completo</th>
                                    <th data-f-bold>Grupo</th>
                                    <th data-f-bold>Fecha Nacimiento</th>
                                    <th data-f-bold>Edad Actual</th>
                                </tr>
                            </thead>
                            <tbody>
                                {personas.map((persona, index) => (
                                    <tr key={persona.per_Id_Persona}>
                                        <td>{index + 1}</td>
                                        <td>{persona.apellidoPrincipal} {persona.per_Apellido_Materno} {persona.per_Nombre}</td>
                                        <td>{persona.per_Bautizado ? "Bautizado".toUpperCase() : "No Bautizado".toUpperCase()}</td>
                                        <td>{moment(persona.per_Fecha_Nacimiento).format("LL")}</td>
                                        <td>{moment().diff(persona.per_Fecha_Nacimiento, "years")}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </CardBody>
                </Card>
            </Container>
            {/*Modal success*/}
            <Modal isOpen={modalShow}>
                {/* <ModalHeader>
                        Solo prueba.
                    </ModalHeader> */}
                <ModalBody>
                    {mensajeDelProceso}
                </ModalBody>
                {/* <ModalFooter>
                        <Button color="secondary" onClick={this.handle_modalClose}>Cancel</Button>
                    </ModalFooter> */}
            </Modal>
        </>
    )
}
