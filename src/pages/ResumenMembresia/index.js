import React, { Component/* , Box, Tipography */ } from 'react';
import helpers from '../../components/Helpers';
import {
    Form, FormGroup, Input, Button, Row, Col,
    Container, Card, CardBody, CardTitle, CardHeader, CardFooter,
    /* Label, ResponsiveContainer, FormFeedback */
} from 'reactstrap'
import './style.css';
import { jsPDF } from "jspdf";
import nvologo from '../../assets/images/IECE_LogoOficial.jpg';
import moment from 'moment';
import { PieChart, Pie, Tooltip, Cell, Legend } from 'recharts'

class ResumenMembresia extends Component {

    url = helpers.url_api;
    infoSesion = JSON.parse(localStorage.getItem('infoSesion'));
    resumen = {
        totalDeMiembros: 0,
        hb: 0,
        mb: 0,
        jhb: 0,
        jmb: 0,
        totalBautizados: 0,
        jhnb: 0,
        jmnb: 0,
        ninos: 0,
        ninas: 0,
        totalNoBautizados: 0
    }

    constructor(props) {
        super(props);
        this.state = {
            dto: JSON.parse(localStorage.getItem("dto")),
            sector: JSON.parse(localStorage.getItem("sector")),
            sectores: [],
            sectorSeleccionado: "0",
            distritoSeleccionado: "0",
            resumenDeMembresia: {},
            infoSector: {},
            infoMinistro: {},
            infoSecretario: {},
            distrito: {},
            distritos: [],
            gradoMinistro: "",
            resumenBautizados: [],
            resumenNoBautizados: [],
            hogares: 0,
            entidadTitulo: "",
            //sec_Id_Sector:"",
            dg: this.infoSesion.dg
        }
    }

    componentDidMount() {
        if (this.infoSesion.dg) {
            this.getDistritos()
        }
        else {
            this.getSectoresPorDistrito(localStorage.getItem('dto'));
            this.getDistrito(localStorage.getItem('dto'));
            this.seleccionaSectorActivo(localStorage.getItem('dto'));
        }
        window.scrollTo(0, 0);

    }

    convertirData = () => {
        let data01 = Object.keys(this.state.resumenDeMembresia);
        /* console.log("Data1: ", data01); */
        let data02 = data01.map(key => {
            return { [key]: (this.state.resumenDeMembresia)[key] }
        });
        /* console.log("Data2: ", data02); */
    }

    getDistritos = async () => {
        await helpers.validaToken().then(helpers.authAxios.get(this.url + '/Distrito')
            .then(res => {
                this.setState({
                    distritos: res.data.distritos
                })
            })
        );
    }

    getDistrito = async (idDistrito) => {
        await helpers.validaToken().then(helpers.authAxios.get(this.url + '/Distrito/' + idDistrito)
            .then(res => {
                this.setState({
                    distrito: res.data
                })
            })
        );
    }

    getSectoresPorDistrito = async (idDistrito) => {
        if (localStorage.getItem('sector') === null) {
            await helpers.validaToken().then(helpers.authAxios.get(this.url + '/Sector/GetSectoresByDistrito/' + idDistrito)
                .then(res => {
                    this.setState({
                        sectores: res.data.sectores.filter(sec => sec.sec_Tipo_Sector === "SECTOR")
                    })
                })
            )
        }
        else {
            await helpers.validaToken().then(helpers.authAxios.get(this.url + '/Sector/' + localStorage.getItem('sector'))
                .then(res => {
                    this.setState({
                        sectores: res.data.sector
                    })
                })
            )
        }
    }

    conviertePersonasParaGraph = (dataPersonas) => {
        let dataTodos = Object.keys(dataPersonas);
        let dataBautizados = dataTodos.filter(item => item === 'hb' || item === "mb" || item === "jhb" || item === "jmb");
        /* console.log("DataBautizados: ", dataBautizados); */
        let dataNoBautizados = dataTodos.filter(item => item === "jhnb" || item === "jmnb" || item === "ninos" || item === "ninas");
        let a = "";
        let b = "";
        let resumenBautizados = dataBautizados
            .map(key => {

                switch (key) {
                    case "hb":
                        a = "Adultos Hombres Bautizados"
                        break
                    case "mb":
                        a = "Adultos Mujeres Bautizadas"
                        break
                    case "jhb":
                        a = "Jovenes Hombres Bautizados"
                        break
                    case "jmb":
                        a = "Jovenes Mujeres Bautizadas"
                        break
                    default:
                }
                return {
                    name: a,
                    value: (dataPersonas)[key]
                }
            });
        /* console.log("DataB: ", resumenBautizados); */
        let resumenNoBautizados = dataNoBautizados
            .map(key => {
                switch (key) {
                    case "jhnb":
                        b = "Jovenes Hombres No Bautizados"
                        break
                    case "jmnb":
                        b = "Jovenes Mujeres No Bautizadas"
                        break
                    case "ninos":
                        b = "Niños"
                        break
                    case "ninas":
                        b = "Niñas"
                        break
                    default:
                }
                return {
                    name: b,
                    value: (dataPersonas)[key]
                }
            });
        /* console.log("DataNB: ", resumenNoBautizados); */
        this.setState({ resumenBautizados, resumenNoBautizados });
    }

    seleccionaSectorActivo = async () => {
        if (localStorage.getItem('sector') === null) { //Sesión de Obispo

            //Setea la variable de Estado "SectorSeleccionado"
            this.setState({ sectorSeleccionado: "todos" });

            //Consulta el Resumen de Membresía Distrital
            await helpers.validaToken().then(helpers.authAxios.get(this.url + '/Persona/GetResumenMembresiaByDistrito/' + this.state.dto/* localStorage.getItem('dto') */)
                .then(res => {
                    //console.log(res.data.value);
                    this.setState({ resumenDeMembresia: res.data.resumen })
                    this.conviertePersonasParaGraph(res.data.resumen);//Ejecuta fn que convierte la data para uso en Gráfica.
                })
            );

            //Consulta el Resumen de Hogares Distritales
            //await helpers.validaToken().then(helpers.authAxios.get(`/HogarDomicilio/GetByDistrito/${localStorage.getItem("dto")}`)
            await helpers.validaToken().then(helpers.authAxios.get(`/HogarDomicilio/GetByDistrito/${this.state.dto}`)
                .then(res => {
                    let contador = 0;
                    //console.log("hogares desde API:", res.data.domicilios)
                    res.data.domicilios.forEach(element => {
                        contador = contador + 1;
                    });
                    this.setState({ hogares: contador });
                })
            )

            //Consulta el Nombre del Obispo del Distrito y el Titulo del Lider que aparecerá en el PDF
            await helpers.validaToken().then(helpers.authAxios.get(this.url + "/PersonalMinisterial/GetObispoByDistrito/" + this.state.dto/* localStorage.getItem("dto") */)
                .then(res => {
                    this.setState({
                        infoMinistro: res.data.ministros.length > 0 ? res.data.ministros[0].pem_Nombre : "",
                        gradoMinistro: "OBISPO"
                    });
                })
            )

            //Consulta el Secretario del Distrito
            await helpers.validaToken().then(helpers.authAxios.get(this.url + "/PersonalMinisterial/GetSecretarioByDistrito/" + this.state.dto/* localStorage.getItem("dto") */)
                .then(res => {
                    this.setState({
                        infoSecretario: res.data.infoSecretario.length > 0 ? res.data.infoSecretario[0].pem_Nombre : ""
                    });
                })
            )

            //Setea el Título que aparecerá en el archivo PDF
            this.setState({
                infoSector: {
                    ...this.state.infoSector,
                    sec_Alias: "TODOS LOS SECTORES DEL DISTRITO"
                }
            });

        } else { //Sesión de Pastor

            this.setState({ sectorSeleccionado: localStorage.getItem('sector') });

            //this.setState({sec_Id_Sector: localStorage.getItem('sector')});
            await helpers.validaToken().then(helpers.authAxios.get(this.url + '/Persona/GetResumenMembresiaBySector/' + localStorage.getItem('sector'))
                .then(res => {
                    this.setState({ resumenDeMembresia: res.data.resumen.value });
                    this.conviertePersonasParaGraph(res.data.resumen.value);//Ejecuta fn que convierte la data para uso en Gráfica.
                })
            );

            await helpers.validaToken().then(helpers.authAxios.get(`/HogarDomicilio/GetBySector/${localStorage.getItem("sector")}`)
                .then(res => {
                    let contador = 0;
                    //console.log("hogares desde API:", res.data.domicilios)
                    res.data.domicilios.forEach(element => {
                        contador = contador + 1;
                    });
                    this.setState({ hogares: contador });
                })
            )

            //Consulta los detalles del Sector
            await helpers.validaToken().then(helpers.authAxios.get(this.url + "/Sector/" + localStorage.getItem('sector'))
                .then(res => {
                    this.setState({
                        infoSector: res.data.sector[0],
                        entidadTitulo: res.data.sector[0].sec_Alias
                    })
                })
            );

            //Consulta el Nombre del Pastor y el Título de Lider que aparecerá en el Reporte PDF
            await helpers.validaToken().then(helpers.authAxios.get(this.url + "/Sector/GetPastorBySector/" + localStorage.getItem('sector'))
                .then(res => {
                    this.setState({
                        infoMinistro: res.data.ministros.length > 0 ? res.data.ministros[0].pem_Nombre : "",
                        gradoMinistro: "PASTOR"
                    });
                })
            )

            //Consulta el Nombre del Secretario del Sector
            await helpers.validaToken().then(helpers.authAxios.get(this.url + "/PersonalMinisterial/GetSecretarioBySector/" + localStorage.getItem('sector'))
                .then(res => {
                    this.setState({
                        infoSecretario: res.data.infoSecretario.length > 0 ? res.data.infoSecretario[0].pem_Nombre : ""
                    });
                })
            )
        }
    }

    handle_sectorSeleccionado = async (e) => {
        if (e.target.value === "todos") { //Si es Sesión Obispo
            this.setState({ sectorSeleccionado: e.target.value });
            await helpers.validaToken().then(helpers.authAxios.get(this.url + '/Persona/GetResumenMembresiaByDistrito/' + this.state.dto/* localStorage.getItem('dto') */)
                .then(res => {
                    //console.log(res.data.value);
                    this.setState({ resumenDeMembresia: res.data.resumen })
                    this.conviertePersonasParaGraph(res.data.resumen);//Ejecuta fn que convierte la data para uso en Gráfica.
                })
            );

            //await helpers.validaToken().then(helpers.authAxios.get(`/HogarDomicilio/GetByDistrito/${localStorage.getItem("dto")}`)
            await helpers.validaToken().then(helpers.authAxios.get(`/HogarDomicilio/GetByDistrito/${this.state.dto}`)
                .then(res => {
                    let contador = 0;
                    res.data.domicilios.forEach(element => {
                        contador = contador + 1;
                    });
                    this.setState({ hogares: contador });
                })
            )



            //Consulta el Nombre del Obispo del Distrito y el Titulo del Lider que aparecerá en el PDF
            await helpers.validaToken().then(helpers.authAxios.get(this.url + "/PersonalMinisterial/GetObispoByDistrito/" + this.state.dto/* localStorage.getItem("dto") */)
                .then(res => {
                    this.setState({
                        infoMinistro: res.data.ministros.length > 0 ? res.data.ministros[0].pem_Nombre : "",
                        gradoMinistro: "OBISPO"
                    });
                })
            )

            //Consulta el Secretario del Distrito
            await helpers.validaToken().then(helpers.authAxios.get(this.url + "/PersonalMinisterial/GetSecretarioByDistrito/" + this.state.dto/* localStorage.getItem("dto") */)
                .then(res => {
                    this.setState({
                        infoSecretario: res.data.infoSecretario.length > 0 ? res.data.infoSecretario[0].pem_Nombre : ""
                    });
                })
            )

            //Setea el Título que aparecerá en el archivo PDF
            this.setState({
                infoSector: {
                    ...this.state.infoSector,
                    sec_Alias: "TODOS LOS SECTORES DEL DISTRITO"
                }
            });


        }
        else {
            e.persist();
            this.setState({ sectorSeleccionado: e.target.value });

            await helpers.validaToken().then(helpers.authAxios.get(this.url + '/Persona/GetResumenMembresiaBySector/' + e.target.value)
                .then(res => {
                    // console.log(res.data.value);
                    this.setState({ resumenDeMembresia: res.data.resumen.value })
                    this.conviertePersonasParaGraph(res.data.resumen.value);//Ejecuta fn que convierte la data para uso en Gráfica.
                })
            );

            await helpers.validaToken().then(helpers.authAxios.get(`/HogarDomicilio/GetBySector/${e.target.value}`)
                .then(res => {
                    let contador = 0;
                    res.data.domicilios.forEach(element => {
                        contador = contador + 1;
                    });
                    this.setState({ hogares: contador });
                })
            );

            //Consulta los detalles del Sector
            await helpers.validaToken().then(helpers.authAxios.get(this.url + "/Sector/" + e.target.value)
                .then(res => {
                    this.setState({
                        infoSector: res.data.sector[0],
                        entidadTitulo: res.data.sector[0].sec_Tipo_Sector + " " + res.data.sector[0].sec_Numero + " " + res.data.sector[0].sec_Alias
                    })
                })
            );

            //Consulta el Nombre del Pastor y el Título de Lider que aparecerá en el Reporte PDF
            await helpers.validaToken().then(helpers.authAxios.get(this.url + "/Sector/GetPastorBySector/" + e.target.value)
                .then(res => {
                    this.setState({
                        infoMinistro: res.data.ministros.length > 0 ? res.data.ministros[0].pem_Nombre : "",
                        gradoMinistro: "PASTOR"
                    });
                })
            );

            //Consulta el Nombre del Secretario del Sector
            await helpers.validaToken().then(helpers.authAxios.get(this.url + "/PersonalMinisterial/GetSecretarioBySector/" + e.target.value)
                .then(res => {
                    this.setState({
                        infoSecretario: res.data.infoSecretario.length > 0 ? res.data.infoSecretario[0].pem_Nombre : ""
                    });
                })
            );
        }
    }

    resumenMembresiaPDF = async () => {

        if (this.state.sectorSeleccionado === '0') {
            alert('Error: Debes seleccionar un sector.');
        }
        else { //Si es Sesión Pastor

            const doc = new jsPDF("p", "mm", "letter");

            let fechaActual = moment();
            let mesActual = fechaActual.format("MM");
            let fechaTexto = `AL DÍA ${fechaActual.format('DD')} DE ${helpers.meses[mesActual]} DEL ${fechaActual.format('YYYY')}`;
            let line = 7;

            doc.addImage(nvologo, 'JPG', 10, line, 70, 20);
            doc.text("RESUMEN DE MEMBRESIA GENERAL", 136, 11, { align: 'center' });
            doc.setFontSize(10);

            //Si en LocalStorage tiene Numero de Sector, significa que es Sesión Sector
            if (this.state.sectorSeleccionado !== "todos") {
                doc.text(`${this.state.infoSector.sec_Tipo_Sector} ${this.state.infoSector.sec_Numero} ${this.state.infoSector.sec_Alias}`, 136, 18, { align: 'center' });
                /* doc.text(fechaTexto, 85, 25); */
            }
            else {
                doc.text(`${this.state.distrito.dis_Tipo_Distrito}  ${this.state.distrito.dis_Numero}: ${this.state.distrito.dis_Alias}`, 136, 18, { align: 'center' });
                doc.text(`${this.state.infoSector.sec_Alias}`, 136, 24, { align: 'center' });
                /* doc.text(fechaTexto, 85, 20); */
            }

            line = line + 25;
            doc.setFontSize(9);
            doc.line(10, line, 200, line);

            line = line + 7;
            doc.setFillColor(191, 201, 202) // Codigos de color RGB (red, green, blue)
            doc.rect(10, line - 4, 190, 6, "F");

            doc.setFont("", "", "bold");
            doc.text("MEMBRESÍA BAUTIZADA", 15, line);
            doc.text(`${this.state.resumenDeMembresia.totalBautizados}`, 80, line);

            line = line + 10;
            doc.setFont("", "", "normal");
            doc.text("ADULTO HOMBRE: ", 20, line);
            doc.text(`${this.state.resumenDeMembresia.hb}`, 70, line);

            line = line + 6;
            doc.text("ADULTO MUJER: ", 20, line);
            doc.text(`${this.state.resumenDeMembresia.mb}`, 70, line);

            line = line + 6;
            doc.text("JÓVEN HOMBRE: ", 20, line);
            doc.text(`${this.state.resumenDeMembresia.jhb}`, 70, line);

            line = line + 6;
            doc.text("JÓVEN MUJER: ", 20, line);
            doc.text(`${this.state.resumenDeMembresia.jmb}`, 70, line);

            line = line + 10;
            doc.setFillColor(191, 201, 202) // Codigos de color RGB (red, green, blue)
            doc.rect(10, line - 4, 190, 6, "F");
            doc.setFont("", "", "bold");
            doc.text("MEMBRESÍA NO BAUTIZADA", 15, line);
            doc.text(`${this.state.resumenDeMembresia.totalNoBautizados}`, 80, line);


            line = line + 10;
            doc.setFont("", "", "normal");
            doc.text("JÓVEN HOMBRE: ", 20, line);
            doc.text(`${this.state.resumenDeMembresia.jhnb}`, 70, line);

            line = line + 6;
            doc.text("JÓVEN MUJER: ", 20, line);
            doc.text(`${this.state.resumenDeMembresia.jmnb}`, 70, line);

            line = line + 6;
            doc.text("NIÑOS: ", 20, line);
            doc.text(`${this.state.resumenDeMembresia.ninos}`, 70, line);

            line = line + 6;
            doc.text("NIÑAS: ", 20, line);
            doc.text(`${this.state.resumenDeMembresia.ninas}`, 70, line);

            line = line + 5;
            doc.line(10, line, 200, line);

            line = line + 8;
            doc.setFont("", "", "bold");
            doc.setFontSize(10);
            doc.text("MEMBRESÍA GENERAL: ", 142, line);
            //doc.rect(175, line-4, 16, 6);
            doc.text(`${this.state.resumenDeMembresia.totalDeMiembros}`, 190, line);
            doc.line(185, line + 1, 200, line + 1);

            line = line + 8;
            doc.setFont("", "", "bold");
            doc.setFontSize(10);
            doc.text("HOGARES ACTUALES: ", 142, line);
            //doc.rect(175, line-4, 16, 6);
            doc.text(`${this.state.hogares}`, 190, line);
            doc.line(185, line + 1, 200, line + 1);

            doc.setFont("", "", "normal");
            doc.setFontSize(9);
            line = line + 30;
            doc.text(`JUSTICIA Y VERDAD`, 105, line, { align: 'center' });
            line = line + 5;
            doc.text(fechaTexto, 105, line, { align: 'center' });

            line = line + 25;
            doc.text(`${this.state.infoSecretario}`, 38, line);
            doc.text(`${this.state.infoMinistro}`, 130, line);

            line = line + 1;
            doc.line(30, line, 90, line);

            doc.line(120, line, 180, line);

            line = line + 4;
            doc.text("SECRETARIO", 51, line);
            doc.text(this.state.gradoMinistro, 145, line);

            doc.save("Resumen de Membresía.pdf");
        }
    }

    COLORS = ['#4d9473', '#a23eab', '#58a1e0', '#e39aed'];

    renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {

        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    handle_distritoSeleccionado = (e) => {
        this.setState({
            distritoSeleccionado: e.target.value,
            dto: e.target.value
        })
        this.getDistrito(e.target.value)
        this.getSectoresPorDistrito(e.target.value)
    }

    render() {
        return (
            <>
                <Container lg>
                    {/* <h1 className="text-info">Resumen de Membresía</h1> */}
                    {this.infoSesion.dg &&
                        <FormGroup>
                            <Row>
                                <Col xs="10">
                                    <Input
                                        type="select"
                                        name="distritoSeleccionado"
                                        onChange={this.handle_distritoSeleccionado}
                                        value={this.state.distritoSeleccionado}
                                    >
                                        <option value="0">Selecciona un distrito/mision/region</option>
                                        {this.state.distritos.map((dis) => {
                                            return (
                                                <React.Fragment key={dis.dis_Id_Distrito}>
                                                    <option value={dis.dis_Id_Distrito}>{`${dis.dis_Tipo_Distrito} ${dis.dis_Numero}: ${dis.dis_Alias}`}</option>
                                                </React.Fragment>
                                            )
                                        })}
                                    </Input>
                                </Col>
                            </Row>
                        </FormGroup>
                    }
                    {!this.state.dg &&
                        <FormGroup>
                            <Row>
                                <Col xs="10">
                                    <Input
                                        type="select"
                                        name="idDistrito"
                                    >
                                        <option value="1">{`${this.state.distrito.dis_Tipo_Distrito} ${this.state.distrito.dis_Numero}: ${this.state.distrito.dis_Alias}`}</option>
                                    </Input>
                                </Col>
                            </Row>
                        </FormGroup>
                    }
                    <FormGroup>
                        <Row>
                            <Col xs="10">
                                <Input
                                    type="select"
                                    name="sectorSeleccionado"
                                    value={this.state.sectorSeleccionado}
                                    onChange={this.handle_sectorSeleccionado}
                                >
                                    {/* <option value="0">Selecciona un sector</option> */}

                                    {this.state.sectores.map(sector => {
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
                    <FormGroup>
                        <Row>
                            <Col xs="3">
                                <Button
                                    onClick={this.resumenMembresiaPDF}
                                    color="danger"
                                >
                                    <span className="fas fa-file-pdf fa-sm fas-icon-margin"></span>Crear PDF
                                </Button>
                            </Col>
                        </Row>
                    </FormGroup>

                    <Row>
                        <Col >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="negrita centrado totalesTitulos">
                                        Personal Bautizado
                                    </CardTitle>
                                </CardHeader>
                                <CardBody className="mx-auto d-block ">
                                    <PieChart width={400} height={250} >
                                        <Pie
                                            data={this.state.resumenBautizados}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={this.renderCustomizedLabel}
                                            outerRadius={80}
                                            fill="#7774d8"
                                            dataKey="value"
                                        >
                                            {this.state.resumenBautizados.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={this.COLORS[index % this.COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Legend layout="vertical" align="center" verticalAlign="bottom" />
                                        <Tooltip />
                                    </PieChart>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="negrita centrado totalesTitulos">
                                        Personal No Bautizado
                                    </CardTitle>
                                </CardHeader>
                                <CardBody className="mx-auto d-block">
                                    <PieChart width={400} height={250}>
                                        <Pie
                                            data={this.state.resumenNoBautizados}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={this.renderCustomizedLabel}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {this.state.resumenNoBautizados.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={this.COLORS[index % this.COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Legend layout="vertical" align="center" verticalAlign="bottom" />
                                        <Tooltip />
                                    </PieChart>
                                </CardBody>
                            </Card>

                        </Col>
                    </Row>
                    <FormGroup>
                        <Row>
                            <Col xs="6">
                                <Card>

                                    <CardBody className="mx-auto d-block">
                                        <ul >
                                            <li><span className="liWidth">Adultos Hombres: </span><u>&nbsp;{this.state.resumenDeMembresia.hb}&nbsp;</u></li>
                                            <li><span className="liWidth">Adultos Mujeres: </span><u>&nbsp;{this.state.resumenDeMembresia.mb}&nbsp;</u></li>
                                            <li><span className="liWidth">Jóvenes Hombres: </span><u>&nbsp;{this.state.resumenDeMembresia.jhb}&nbsp;</u></li>
                                            <li><span className="liWidth">Jóvenes Mujeres: </span><u>&nbsp;{this.state.resumenDeMembresia.jmb}&nbsp;</u></li>
                                        </ul>
                                    </CardBody>
                                    <CardFooter className="negrita text-right">
                                        <span className='totalWidth'>Total de Personal Bautizado: </span> <u>&nbsp;{this.state.resumenDeMembresia.totalBautizados}&nbsp;</u>
                                    </CardFooter>
                                </Card>
                            </Col>
                            <Col xs="6">
                                <Card>

                                    <CardBody className="mx-auto d-block">
                                        <ul>
                                            <li><span className="liWidth">Jóvenes Hombres: </span><u>&nbsp;{this.state.resumenDeMembresia.jhnb}&nbsp;</u></li>
                                            <li><span className="liWidth">Jóvenes Mujeres: </span><u>&nbsp;{this.state.resumenDeMembresia.jmnb}&nbsp;</u></li>
                                            <li><span className="liWidth">Niños: </span><u>&nbsp;{this.state.resumenDeMembresia.ninos}&nbsp;</u></li>
                                            <li><span className="liWidth">Niñas: </span><u>&nbsp;{this.state.resumenDeMembresia.ninas}&nbsp;</u></li>
                                        </ul>
                                    </CardBody>
                                    <CardFooter className="negrita text-right">
                                        <span className='totalWidth '>Total de Personal No Bautizado: </span> <u>&nbsp;{this.state.resumenDeMembresia.totalNoBautizados}&nbsp;</u>
                                    </CardFooter>
                                </Card>
                            </Col>
                        </Row>
                    </FormGroup>
                    <FormGroup >
                        <Row className=" card p-2 m-0 mb-2">
                            <Col xs="12" className='negrita totalesTitulos text-right'>
                                Número completo de personal que integra la Iglesia: <u>  &nbsp;{this.state.resumenDeMembresia.totalDeMiembros}&nbsp;  </u>
                            </Col>
                        </Row>

                        <Row className="card p-2 m-0">
                            <Col xs="12" className='negrita totalesTitulos text-right'>
                                Número de Hogares: <u>  &nbsp;{this.state.hogares}&nbsp;  </u>
                            </Col>
                        </Row>
                    </FormGroup>
                </Container>
            </>
        )
    }
}

export default ResumenMembresia;