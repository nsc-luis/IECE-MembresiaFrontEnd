import React, { Component } from 'react';
import helpers from "../../components/Helpers";
import {
    Container, Button, Input, Modal, ModalBody,
    CardTitle, Card, CardBody, Table, Row, Col, FormFeedback
} from 'reactstrap';
import moment from 'moment';
import logo from '../../assets/images/IECE_LogoOficial.jpg'
import '../../assets/css/index.css';
import TableToExcel from "@linways/table-to-excel";

class ReporteTransacciones extends Component {
    constructor(props) {
        super(props);
        this.state = {
            consultaInfo: false,
            fsd: {},
            infoOrganizada: {
                Altas: {
                    Bautizados: {
                        Bautismo: {
                            contador: 0,
                            registros: []
                        },
                        Restitucion: {
                            contador: 0,
                            registros: []
                        },
                        CambioDomicilioInterno: {
                            contador: 0,
                            registros: []
                        },
                        CambioDomicilioExterno: {
                            contador: 0,
                            registros: []
                        }
                    },
                    NoBautizados: {
                        Ingreso: {
                            contador: 0,
                            registros: []
                        },
                        Reactivacion: {
                            contador: 0,
                            registros: []
                        },
                        CambioDomicilioInterno: {
                            contador: 0,
                            registros: []
                        },
                        CambioDomicilioExterno: {
                            contador: 0,
                            registros: []
                        }
                    }
                },
                Bajas: {
                    Bautizados: {
                        Defuncion: {
                            contador: 0,
                            registros: []
                        },
                        ExcomunionTemporal: {
                            contador: 0,
                            registros: []
                        },
                        Excomunion: {
                            contador: 0,
                            registros: []
                        },
                        CambioDomicilioInterno: {
                            contador: 0,
                            registros: []
                        },
                        CambioDomicilioExterno: {
                            contador: 0,
                            registros: []
                        }
                    },
                    NoBautizados: {
                        Defuncion: {
                            contador: 0,
                            registros: []
                        },
                        Alejamiento: {
                            contador: 0,
                            registros: []
                        },
                        CambioDomicilioInterno: {
                            contador: 0,
                            registros: []
                        },
                        CambioDomicilioExterno: {
                            contador: 0,
                            registros: []
                        },
                        BajaPorPadres: {
                            contador: 0,
                            registros: []
                        }
                    }
                },
                TotalAltasBautizados: 0,
                TotalBajasBautizados: 0,
                TotalAltasNoBautizados: 0,
                TotalBajasNoBautizados: 0,
                Matrimonios: {
                    contador: 0,
                    registros: []
                },
                Legalizaciones: {
                    contador: 0,
                    registros: []
                },
                Presentaciones: {
                    contador: 0,
                    registros: []
                }
            },
            personas: {
                Bautizados: {
                    Adulto_Hombre: 0,
                    Adulto_Mujer: 0,
                    Joven_Hombre: 0,
                    Joven_Mujer: 0
                },
                NoBautizados: {
                    Joven_Hombre: 0,
                    Joven_Mujer: 0,
                    Niño: 0,
                    Niña: 0
                },
                AdultosBautizados: 0,
                JovenesBautizados: 0,
                JovenesNoBautizados: 0,
                Niños: 0,
                Total: 0
            },
            fechaInicialInvalid: false,
            fechaFinalInvalid: false,
            hogares: 0,
            registros: [],
            sector: {},
            modal: false
        }
    }
    componentDidMount() {
        window.scrollTo(0, 0);
        this.setState({
            fsd: {
                ...this.state.fsd,
                idSectorDistrito: localStorage.getItem("sector"),
                fechaInicial: moment().startOf('month').format("YYYY-MM-DD"),
                fechaFinal: moment().endOf('month').format("YYYY-MM-DD")
            }
        });
        helpers.authAxios.get(`/Sector/${localStorage.getItem("sector")}`)
            .then(res => {
                this.setState({ sector: res.data.sector[0] })
            })
        helpers.authAxios.get(`/HogarDomicilio/GetBySector/${localStorage.getItem("sector")}`)
            .then(res => {
                let contador = 0;
                res.data.domicilios.forEach(element => {
                    contador = contador + 1;
                });
                this.setState({ hogares: contador });
            })
    }

    downloadTable() {
        console.log("contenido: ", document.getElementById("table1"))
        if (document.getElementById("table1") != null) {
            TableToExcel.convert(document.getElementById("table1"), {
                name: "ResumenMovimientosEstadisticos.xlsx",
                sheet: {
                    name: "Hoja 1"
                }
            });
        } else {
            alert("Debe primeramente Seleccionar el periodo y generar el reporte")
        }
    }

    onChange = (e) => {
        this.setState({
            fsd: {
                ...this.state.fsd,
                [e.target.name]: e.target.value
            }
        });
    }
    organizaInfo = (info, ct_Codigo_Transaccion, objeto) => {
        var filtro = info.filter((obj) => {
            return obj.ct_Codigo_Transaccion === ct_Codigo_Transaccion;
        })
        objeto.contador = filtro.length;
        objeto.registros = filtro;
    }
    buscarInfo = async () => {
        let fii = this.state.fsd.fechaInicial === undefined || this.state.fsd.fechaInicial === "" ? true : false;
        let ffi = this.state.fsd.fechaFinal === undefined || this.state.fsd.fechaFinal === "" ? true : false;
        let fi = moment(this.state.fsd.fechaFinal) < moment(this.state.fsd.fechaInicial) ? true : false;

        this.setState({
            fechaInicialInvalid: this.state.fsd.fechaInicial === undefined || this.state.fsd.fechaInicial === "" ? true : false,
            fechaFinalInvalid: this.state.fsd.fechaFinal === undefined || this.state.fsd.fechaFinal === "" ? true : false
        })

        if (fi) {
            alert("Error:\nLa fecha inicial no puede ser mayor a la fecha final.");
        }

        if (fii || ffi || fi) {
            this.setState({ consultaInfo: false });
            return false;
        }
        var info = {
            Altas: {
                Bautizados: {
                    Bautismo: {
                        contador: 0,
                        registros: []
                    },
                    Restitucion: {
                        contador: 0,
                        registros: []
                    },
                    CambioDomicilioInterno: {
                        contador: 0,
                        registros: []
                    },
                    CambioDomicilioExterno: {
                        contador: 0,
                        registros: []
                    }
                },
                NoBautizados: {
                    Ingreso: {
                        contador: 0,
                        registros: []
                    },
                    Reactivacion: {
                        contador: 0,
                        registros: []
                    },
                    CambioDomicilioInterno: {
                        contador: 0,
                        registros: []
                    },
                    CambioDomicilioExterno: {
                        contador: 0,
                        registros: []
                    }
                }
            },
            Bajas: {
                Bautizados: {
                    Defuncion: {
                        contador: 0,
                        registros: []
                    },
                    ExcomunionTemporal: {
                        contador: 0,
                        registros: []
                    },
                    Excomunion: {
                        contador: 0,
                        registros: []
                    },
                    CambioDomicilioInterno: {
                        contador: 0,
                        registros: []
                    },
                    CambioDomicilioExterno: {
                        contador: 0,
                        registros: []
                    }
                },
                NoBautizados: {
                    Defuncion: {
                        contador: 0,
                        registros: []
                    },
                    Alejamiento: {
                        contador: 0,
                        registros: []
                    },
                    CambioDomicilioInterno: {
                        contador: 0,
                        registros: []
                    },
                    CambioDomicilioExterno: {
                        contador: 0,
                        registros: []
                    },
                    BajaPorPadres: {
                        contador: 0,
                        registros: []
                    }
                }
            },
            TotalAltasBautizados: 0,
            TotalBajasBautizados: 0,
            TotalAltasNoBautizados: 0,
            TotalBajasNoBautizados: 0,
            Matrimonios: {
                contador: 0,
                registros: []
            },
            Legalizaciones: {
                contador: 0,
                registros: []
            },
            Presentaciones: {
                contador: 0,
                registros: []
            }
        }

        await helpers.authAxios.get(`/Persona/GetBySector/${localStorage.getItem("sector")}`)
            .then(res => {
                let personas = {
                    Bautizados: {
                        Adulto_Hombre: 0,
                        Adulto_Mujer: 0,
                        Joven_Hombre: 0,
                        Joven_Mujer: 0
                    },
                    NoBautizados: {
                        Joven_Hombre: 0,
                        Joven_Mujer: 0,
                        Niño: 0,
                        Niña: 0
                    },
                    AdultosBautizados: 0,
                    JovenesBautizados: 0,
                    JovenesNoBautizados: 0,
                    Niños: 0,
                    Total: 0
                };
                let filtro = res.data.filter((obj) => {
                    return obj.persona.per_Activo && obj.persona.per_Vivo
                });
                filtro.forEach(p => {
                    if (p.persona.per_Bautizado === true) {
                        personas.Bautizados.Adulto_Hombre = p.persona.per_Categoria === "ADULTO_HOMBRE" ? personas.Bautizados.Adulto_Hombre + 1 : personas.Bautizados.Adulto_Hombre + 0;
                        personas.Bautizados.Adulto_Mujer = p.persona.per_Categoria === "ADULTO_MUJER" ? personas.Bautizados.Adulto_Mujer + 1 : personas.Bautizados.Adulto_Mujer + 0;
                        personas.Bautizados.Joven_Hombre = p.persona.per_Categoria === "Joven_Hombre" ? personas.Bautizados.Joven_Hombre + 1 : personas.Bautizados.Joven_Hombre + 0;
                        personas.Bautizados.Joven_Mujer = p.persona.per_Categoria === "Joven_Mujer" ? personas.Bautizados.Joven_Mujer + 1 : personas.Bautizados.Joven_Mujer + 0;
                    }
                    else {
                        personas.NoBautizados.Joven_Hombre = p.persona.per_Categoria === "JOVEN_HOMBRE" ? personas.NoBautizados.Joven_Hombre + 1 : personas.NoBautizados.Joven_Hombre + 0;
                        personas.NoBautizados.Joven_Mujer = p.persona.per_Categoria === "JOVEN_MUJER" ? personas.NoBautizados.Joven_Mujer + 1 : personas.NoBautizados.Joven_Mujer + 0;
                        personas.NoBautizados.Niño = p.persona.per_Categoria === "NIÑO" ? personas.NoBautizados.Niño + 1 : personas.NoBautizados.Niño + 0;
                        personas.NoBautizados.Niña = p.persona.per_Categoria === "NIÑA" ? personas.NoBautizados.Niña + 1 : personas.NoBautizados.Niña + 0;
                    }
                    personas.AdultosBautizados = personas.Bautizados.Adulto_Hombre + personas.Bautizados.Adulto_Mujer;
                    personas.JovenesBautizados = personas.Bautizados.Joven_Hombre + personas.Bautizados.Joven_Mujer;
                    personas.JovenesNoBautizados = personas.NoBautizados.Joven_Hombre + personas.NoBautizados.Joven_Mujer;
                    personas.Niños = personas.NoBautizados.Niño + personas.NoBautizados.Niña;
                });
                personas.Total = personas.AdultosBautizados + personas.JovenesBautizados + personas.JovenesNoBautizados + personas.Niños;
                this.setState({ personas: personas })
            });
        await helpers.authAxios.post(`/Historial_Transacciones_Estadisticas/HistorialPorFechaSector`, this.state.fsd)
            .then(res => {
                this.organizaInfo(res.data.datos, 11001, info.Altas.Bautizados.Bautismo);
                this.organizaInfo(res.data.datos, 11002, info.Altas.Bautizados.Restitucion);
                this.organizaInfo(res.data.datos, 11003, info.Altas.Bautizados.CambioDomicilioInterno);
                this.organizaInfo(res.data.datos, 11004, info.Altas.Bautizados.CambioDomicilioExterno);
                this.organizaInfo(res.data.datos, 12001, info.Altas.NoBautizados.Ingreso);
                this.organizaInfo(res.data.datos, 12004, info.Altas.NoBautizados.Reactivacion);
                this.organizaInfo(res.data.datos, 12002, info.Altas.NoBautizados.CambioDomicilioInterno);
                this.organizaInfo(res.data.datos, 12003, info.Altas.NoBautizados.CambioDomicilioExterno);
                this.organizaInfo(res.data.datos, 11101, info.Bajas.Bautizados.Defuncion);
                this.organizaInfo(res.data.datos, 11102, info.Bajas.Bautizados.ExcomunionTemporal);
                this.organizaInfo(res.data.datos, 11103, info.Bajas.Bautizados.Excomunion);
                this.organizaInfo(res.data.datos, 11104, info.Bajas.Bautizados.CambioDomicilioInterno);
                this.organizaInfo(res.data.datos, 11105, info.Bajas.Bautizados.CambioDomicilioExterno);
                this.organizaInfo(res.data.datos, 12101, info.Bajas.NoBautizados.Defuncion);
                this.organizaInfo(res.data.datos, 12102, info.Bajas.NoBautizados.Alejamiento);
                this.organizaInfo(res.data.datos, 12103, info.Bajas.NoBautizados.CambioDomicilioInterno);
                this.organizaInfo(res.data.datos, 12104, info.Bajas.NoBautizados.CambioDomicilioExterno);
                this.organizaInfo(res.data.datos, 12106, info.Bajas.NoBautizados.BajaPorPadres);
                this.organizaInfo(res.data.datos, 21001, info.Matrimonios);
                this.organizaInfo(res.data.datos, 21102, info.Legalizaciones);
                this.organizaInfo(res.data.datos, 23203, info.Presentaciones);
                info.TotalAltasBautizados = info.Altas.Bautizados.Bautismo.contador + info.Altas.Bautizados.Restitucion.contador + info.Altas.Bautizados.CambioDomicilioInterno.contador + info.Altas.Bautizados.CambioDomicilioExterno.contador;
                info.TotalBajasBautizados = info.Bajas.Bautizados.Defuncion.contador + info.Bajas.Bautizados.ExcomunionTemporal.contador + info.Bajas.Bautizados.Excomunion.contador + info.Bajas.Bautizados.CambioDomicilioInterno.contador + info.Bajas.Bautizados.CambioDomicilioExterno.contador;
                info.TotalAltasNoBautizados = info.Altas.NoBautizados.Ingreso.contador + info.Altas.NoBautizados.Reactivacion.contador + info.Altas.NoBautizados.CambioDomicilioInterno.contador + info.Altas.NoBautizados.CambioDomicilioExterno.contador;
                info.TotalBajasNoBautizados = info.Bajas.NoBautizados.Defuncion.contador + info.Bajas.NoBautizados.Alejamiento.contador + info.Bajas.NoBautizados.CambioDomicilioInterno.contador + info.Bajas.NoBautizados.CambioDomicilioExterno.contador + info.Bajas.NoBautizados.BajaPorPadres.contador;

                let hte = res.data.datos.filter(hte => {
                    return hte.ct_Tipo !== "EDICION"
                });

                this.setState({
                    infoOrganizada: info,
                    consultaInfo: true,
                    registros: hte
                });
            })
    }
    showModal = () => {
        this.setState({ modal: !this.state.modal })
    }
    ReporteTransaccionesToPDF = async () => {
        if (this.state.consultaInfo === false) {
            alert("Error:\nAntes de generar el documento PDF debe ejecutar la búsqueda por rango de fechas.");
            return false;
        }
        var transacciones = "";
        this.state.registros.forEach(r => {
            transacciones += `<${r.ct_Tipo} (${r.ct_Subtipo}) ${r.per_Nombre} ${r.per_Apellido_Paterno} ${r.sec_Sector_Alias} ${helpers.reFormatoFecha(r.hte_Fecha_Transaccion)}> `
        });

        var datos = {
            "FechaInicial": this.state.fsd.fechaInicial,
            "FechaFinal": this.state.fsd.fechaFinal,
            "AdultosBautizados": this.state.personas.AdultosBautizados,
            "AltasBautizadosBautismo": this.state.infoOrganizada.Altas.Bautizados.Bautismo.contador,
            "AltasBautizadosCambioDomicilio": this.state.infoOrganizada.Altas.Bautizados.CambioDomicilioExterno.contador + this.state.infoOrganizada.Altas.Bautizados.CambioDomicilioInterno.contador,
            "AltasBautizadosRestitucion": this.state.infoOrganizada.Altas.Bautizados.Restitucion.contador,
            "AltasNoBautizadosCambioDomicilio": this.state.infoOrganizada.Altas.NoBautizados.CambioDomicilioExterno.contador + this.state.infoOrganizada.Altas.NoBautizados.CambioDomicilioInterno.contador,
            "AltasNoBautizadosNuevoIngreso": this.state.infoOrganizada.Altas.NoBautizados.Ingreso.contador,
            "AltasNoBautizadosReactivacion": this.state.infoOrganizada.Altas.NoBautizados.Reactivacion.contador,
            "BajasBautizadosCambioDomicilio": this.state.infoOrganizada.Bajas.Bautizados.CambioDomicilioExterno.contador + this.state.infoOrganizada.Bajas.Bautizados.CambioDomicilioInterno.contador,
            "BajasBautizadosDefuncion": this.state.infoOrganizada.Bajas.Bautizados.Defuncion.contador,
            "BajasBautizadosExcomunion": this.state.infoOrganizada.Bajas.Bautizados.Excomunion.contador,
            "BajasNoBautizadosAlejamiento": this.state.infoOrganizada.Bajas.NoBautizados.Alejamiento.contador,
            "BajasNoBautizadosCambioDomicilio": this.state.infoOrganizada.Bajas.NoBautizados.CambioDomicilioExterno.contador + this.state.infoOrganizada.Bajas.NoBautizados.CambioDomicilioInterno.contador,
            "BajasNoBautizadosDefuncion": this.state.infoOrganizada.Bajas.NoBautizados.Defuncion.contador,
            "BautizadosAdultoHombre": this.state.personas.Bautizados.Adulto_Hombre,
            "BautizadosAdultoMujer": this.state.personas.Bautizados.Adulto_Mujer,
            "BautizadosJovenHombre": this.state.personas.Bautizados.Joven_Hombre,
            "BautizadosJovenMujer": this.state.personas.Bautizados.Joven_Mujer,
            "JovenesBautizados": this.state.personas.JovenesBautizados,
            "JovenesNoBautizados": this.state.personas.JovenesNoBautizados,
            "Legalizaciones": this.state.infoOrganizada.Legalizaciones.contador,
            "Matrimonios": this.state.infoOrganizada.Matrimonios.contador,
            "Ninas": this.state.personas.NoBautizados.Niña,
            "Ninos": this.state.personas.NoBautizados.Niño,
            "NoBautizadosJovenHombre": this.state.personas.NoBautizados.Joven_Hombre,
            "NoBautizadosJovenMujer": this.state.personas.NoBautizados.Joven_Mujer,
            "Presentaciones": this.state.infoOrganizada.Presentaciones.contador,
            "Total": this.state.personas.Total,
            "TotalAltasBautizados": this.state.infoOrganizada.TotalAltasBautizados,
            "TotalAltasNoBautizados": this.state.infoOrganizada.TotalAltasNoBautizados,
            "TotalBajasBautizados": this.state.infoOrganizada.TotalBajasBautizados,
            "TotalBajasNoBautizados": this.state.infoOrganizada.TotalBajasNoBautizados,
            "NoDeHogares": this.state.hogares,
            "Secretario": "",
            "Ministro": JSON.parse(localStorage.getItem("infoSesion")).pem_Nombre,
            "Transacciones": transacciones
        }

        var request = new Request(
            `${helpers.url_api}/DocumentosPDF/ReporteMovimientosEstadisticos`,
            {
                method: "post",
                body: JSON.stringify(datos),
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json'
                },
                mode: "cors",
                cache: "default",
            });

        this.showModal();

        fetch(request)
            .then((response) => response.blob())
            .then((blob) => {
                const file = window.URL.createObjectURL(blob);
                this.showModal();
                window.open(file);
            })
            .catch((err) => {
                alert(err);
            })
    }
    render() {
        return (
            <>
                <Container fluid>
                    <Button
                        className="btn-danger m-3"
                        onClick={this.ReporteTransaccionesToPDF}
                    >
                        <span className="fas fa-file-pdf mr-2"></span>
                        Descargar PDF
                    </Button>
                    {/* <Button className="btn-danger m-3 " onClick={handleDownloadPDF}><i className="fas fa-file-pdf mr-2"></i>Descargar PDF</Button> */}
                    {/* TABLA */}
                    <Card body id="pdf">
                        <CardTitle className="text-center" tag="h3">
                            <Row>
                                <Col lg="3">
                                    <img src={logo} alt=" Logo" width="100%"></img>
                                </Col>
                                <Col>
                                    REPORTE DE TRANSACCIONES
                                    <h5>Sector: {this.state.sector.sec_Alias}</h5>
                                </Col>
                            </Row>
                        </CardTitle>
                        <CardBody>
                            <Row className="m-3 justify-content-center">
                                <Col lg="1" className="text-center">
                                    <h3>De</h3>
                                </Col>
                                <Col lg="3" className="text-center">
                                    <Input
                                        type="date"
                                        name="fechaInicial"
                                        value={this.state.fsd.fechaInicial}
                                        onChange={this.onChange}
                                        invalid={this.state.fechaInicialInvalid}
                                    />
                                    <FormFeedback>Fecha invalida</FormFeedback>
                                </Col>
                                <Col lg="1" className="text-center">
                                    <h3>al</h3>
                                </Col>
                                <Col lg="3" className="text-center">
                                    <Input
                                        type="date"
                                        name="fechaFinal"
                                        value={this.state.fsd.fechaFinal}
                                        onChange={this.onChange}
                                        invalid={this.state.fechaFinalInvalid}
                                    />
                                    <FormFeedback>Fecha invalida</FormFeedback>
                                </Col>
                                <Col lg="2" className="text-center">
                                    <Button
                                        color="primary"
                                        onClick={this.buscarInfo}
                                    >Buscar...</Button>
                                </Col>

                            </Row>
                            <hr />
                            {this.state.consultaInfo &&
                                <>
                                    <Row>
                                        <div className="text-center container-fluid font-weight-bold">
                                            <h5>RESUMEN DE MOVIMIENTOS ESTADÍSTICOS Y MEMBRESÍA ACTUAL</h5>
                                        </div>
                                        <Table id='table1' data-cols-width="30,7,12,7,30,7,12,7">
                                            <tbody>

                                                <tr className="text-center font-weight-bold categoriasReportes">
                                                    <td colSpan="8">PERSONAL BAUTIZADO</td>
                                                </tr>
                                                <tr className="text-center font-weight-bold ">
                                                    <td colSpan="4">ALTAS</td>

                                                    <td colSpan="4">BAJAS</td>
                                                </tr>
                                                <tr className="text-left ">
                                                    <td colSpan="2">Por Bautismo</td>
                                                    <td colSpan="2"><u className="font-weight-normal">{this.state.infoOrganizada.Altas.Bautizados.Bautismo.contador}</u></td>
                                                    <td colSpan="2">Por Defunción</td>
                                                    <td colSpan="2"><u className="font-weight-normal">{this.state.infoOrganizada.Bajas.Bautizados.Defuncion.contador}</u></td>
                                                </tr>
                                                <tr className="text-left">
                                                    <td colSpan="2">Por Restitución a la comunión</td>
                                                    <td colSpan="2"><u className="font-weight-normal">{this.state.infoOrganizada.Altas.Bautizados.Restitucion.contador}</u></td>
                                                    <td colSpan="2">Por Excomunión</td>
                                                    <td colSpan="2"><u className="font-weight-normal">{this.state.infoOrganizada.Bajas.Bautizados.ExcomunionTemporal.contador + this.state.infoOrganizada.Bajas.Bautizados.Excomunion.contador}</u></td>
                                                </tr>
                                                <tr className="text-left">
                                                    <td colSpan="2">Por Cambio de Domicilio</td>
                                                    <td colSpan="2"><u className="font-weight-normal">{this.state.infoOrganizada.Altas.Bautizados.CambioDomicilioInterno.contador + this.state.infoOrganizada.Altas.Bautizados.CambioDomicilioExterno.contador}</u></td>
                                                    <td colSpan="2">Por Cambio de Domicilio</td>
                                                    <td colSpan="2"><u className="font-weight-normal">{this.state.infoOrganizada.Bajas.Bautizados.CambioDomicilioInterno.contador + this.state.infoOrganizada.Bajas.Bautizados.CambioDomicilioExterno.contador}</u></td>
                                                </tr>
                                                <tr className="text-left font-weight-bold">
                                                    <td colSpan="2">Total de altas</td>
                                                    <td colSpan="2">
                                                        <u className="font-weight-normal">
                                                            {this.state.infoOrganizada.TotalAltasBautizados}
                                                        </u>
                                                    </td>
                                                    <td colSpan="2">Total de bajas</td>
                                                    <td colSpan="2">
                                                        <u className="font-weight-normal">
                                                            {this.state.infoOrganizada.TotalBajasBautizados}
                                                        </u>
                                                    </td>
                                                </tr>
                                                <tr className="text-center font-weight-bold categoriasReportes">
                                                    <td colSpan="8">PERSONAL NO BAUTIZADO</td>
                                                </tr>
                                                <tr className="text-center font-weight-bold">
                                                    <td colSpan="4">ALTAS</td>
                                                    <td colSpan="4">BAJAS</td>
                                                </tr>
                                                <tr className="text-left">
                                                    <td colSpan="2">Por Nuevo Ingreso</td>
                                                    <td colSpan="2"><u className="font-weight-normal">{this.state.infoOrganizada.Altas.NoBautizados.Ingreso.contador}</u></td>
                                                    <td colSpan="2">Por Defunción</td>
                                                    <td colSpan="2"><u className="font-weight-normal">{this.state.infoOrganizada.Bajas.NoBautizados.Defuncion.contador}</u></td>
                                                </tr>
                                                <tr className="text-left">
                                                    <td colSpan="2">Por Reactivación</td>
                                                    <td colSpan="2"><u className="font-weight-normal">{this.state.infoOrganizada.Altas.NoBautizados.Reactivacion.contador}</u></td>
                                                    <td colSpan="2">Por Alejamiento</td>
                                                    <td colSpan="2"><u className="font-weight-normal">{this.state.infoOrganizada.Bajas.NoBautizados.Alejamiento.contador}</u></td>
                                                </tr>
                                                <tr className="text-left">
                                                    <td colSpan="2">Por Cambio de Domicilio</td>
                                                    <td colSpan="2"><u className="font-weight-normal">{this.state.infoOrganizada.Altas.NoBautizados.CambioDomicilioInterno.contador + this.state.infoOrganizada.Altas.NoBautizados.CambioDomicilioExterno.contador}</u></td>
                                                    <td colSpan="2">Por Cambio de Domicilio</td>
                                                    <td colSpan="2"><u className="font-weight-normal">{this.state.infoOrganizada.Bajas.NoBautizados.CambioDomicilioInterno.contador + this.state.infoOrganizada.Bajas.NoBautizados.CambioDomicilioExterno.contador}</u></td>
                                                </tr>
                                                <tr className="text-left">
                                                    <td colSpan="2"></td>
                                                    <td colSpan="2"></td>
                                                    <td colSpan="2">Por Baja de Padres</td>
                                                    <td colSpan="2"><u className="font-weight-normal">{this.state.infoOrganizada.Bajas.NoBautizados.BajaPorPadres.contador}</u></td>
                                                </tr>
                                                <tr className="text-left font-weight-bold">
                                                    <td colSpan="2">Total de Altas</td>
                                                    <td colSpan="2"><u className="font-weight-normal">{this.state.infoOrganizada.TotalAltasNoBautizados}</u></td>
                                                    <td colSpan="2">Total de Bajas</td>
                                                    <td colSpan="2"><u className="font-weight-normal">{this.state.infoOrganizada.TotalBajasNoBautizados}</u></td>
                                                </tr>
                                                <tr className="text-center">
                                                    <td colSpan="4"></td>
                                                    <td colSpan="4"></td>
                                                </tr>
                                                <tr className="text-center font-weight-bold categoriasReportes">
                                                    <td colSpan="8">SUCESOS ECLESÍASTICOS Y HOGARES</td>
                                                </tr>
                                                <tr className="text-left">
                                                    <td colSpan="2">Matrimonios</td>
                                                    <td colSpan="2"><u className="font-weight-normal">{this.state.infoOrganizada.Matrimonios.contador}</u></td>
                                                    <td colSpan="2">Legalizaciones</td>
                                                    <td colSpan="2"><u className="font-weight-normal">{this.state.infoOrganizada.Legalizaciones.contador}</u></td>
                                                </tr>
                                                <tr className="text-left">
                                                    <td colSpan="2">Presentaciones de Niños</td>
                                                    <td colSpan="2"><u className="font-weight-normal">{this.state.infoOrganizada.Presentaciones.contador}</u></td>
                                                    <td colSpan="2">No. de Hogares</td>
                                                    <td colSpan="2"><u className="font-weight-normal">{this.state.hogares}</u></td>
                                                </tr>
                                                <tr className="text-center font-weight-bold categoriasReportes">
                                                    <td colSpan="8">DESGLOSE DE MEMBRESÍA ACTUAL</td>
                                                </tr>
                                                <tr className="text-center font-weight-bold ">
                                                    <td colSpan="4">PERSONAL BAUTIZADO</td>
                                                    <td colSpan="4">PERSONAL NO BAUTIZADO</td>
                                                </tr>
                                                <tr className="justify-content-around text-center font-weight-bold">
                                                    <td colSpan="2">ADULTOS</td>
                                                    <td colSpan="2">JÓVENES</td>
                                                    <td colSpan="2">JÓVENES</td>
                                                    <td colSpan="2">NIÑOS</td>
                                                </tr>
                                                <tr className="justify-content-around">
                                                    <td className="col-sm-1">Hombres</td>
                                                    <td className="col-sm-1"><u className="font-weight-normal">{this.state.personas.Bautizados.Adulto_Hombre}</u></td>
                                                    <td className="col-sm-1">Hombres</td>
                                                    <td className="col-sm-1"><u className="font-weight-normal">{this.state.personas.Bautizados.Joven_Hombre}</u></td>

                                                    <td className="col-sm-1">Hombres</td>
                                                    <td className="col-sm-1"><u className="font-weight-normal">{this.state.personas.NoBautizados.Joven_Hombre}</u></td>
                                                    <td className="col-sm-1">Niños</td>
                                                    <td className="col-sm-1"><u className="font-weight-normal">{this.state.personas.NoBautizados.Niño}</u></td>
                                                </tr>
                                                <tr className="text-left">
                                                    <td>Mujeres</td>
                                                    <td><u className="font-weight-normal">{this.state.personas.Bautizados.Adulto_Mujer}</u></td>
                                                    <td>Mujeres</td>
                                                    <td><u className="font-weight-normal">{this.state.personas.Bautizados.Joven_Mujer}</u></td>
                                                    <td>Mujeres</td>
                                                    <td><u className="font-weight-normal">{this.state.personas.NoBautizados.Joven_Mujer}</u></td>
                                                    <td>Niñas</td>
                                                    <td><u className="font-weight-normal">{this.state.personas.NoBautizados.Niña}</u></td>
                                                </tr>
                                                <tr className="text-left justify-content-around">
                                                    <td>Total</td>
                                                    <td><u className="font-weight-normal">{this.state.personas.AdultosBautizados}</u></td>
                                                    <td>Total</td>
                                                    <td><u className="font-weight-normal">{this.state.personas.JovenesBautizados}</u></td>
                                                    <td>Total</td>
                                                    <td><u className="font-weight-normal">{this.state.personas.JovenesNoBautizados}</u></td>
                                                    <td>Total</td>
                                                    <td><u className="font-weight-normal">{this.state.personas.Niños}</u></td>
                                                </tr>
                                                <tr className="text-center font-weight-bold">

                                                    <td colSpan="2">No. Compl. de Personal Bautizado</td>
                                                    <td colSpan="1"><u className="font-weight-normal">{this.state.personas.AdultosBautizados + this.state.personas.JovenesBautizados}</u></td>
                                                    <td colSpan="2"></td>
                                                    <td colSpan="2">No. Compl. de Personal No Bautizado</td>
                                                    <td colSpan="1"><u className="font-weight-normal">{this.state.personas.JovenesNoBautizados + this.state.personas.Niños}</u></td>

                                                </tr>
                                                <tr className="text-center font-weight-bold">
                                                    <td colSpan="2"></td>
                                                    <td colSpan="3">Número Completo del Personal que Integra la Iglesia</td>
                                                    <td colSpan="1"><u className="font-weight-normal">{this.state.personas.Total}</u></td>
                                                    <td colSpan="2"></td>
                                                </tr>
                                                <tr className="text-center font-weight-bold categoriasReportes">
                                                    <td colSpan="8">DESGLOSE DE MOVIMIENTO ESTADÍSTICO</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </Row>
                                    <Row>
                                        <Col xs="12">
                                            <Table>
                                                <tbody>
                                                    {this.state.registros.length > 0 &&
                                                        <>
                                                            {this.state.registros.map(r => {
                                                                return (
                                                                    <React.Fragment key={r.hte_Id_Transaccion}>
                                                                        <tr>
                                                                            <td>{r.ct_Tipo}</td>
                                                                            <td>{r.ct_Subtipo}</td>
                                                                            <td>{r.per_Nombre} {r.per_Apellido_Paterno}</td>
                                                                            <td>{r.sec_Sector_Alias}</td>
                                                                            <td>{helpers.reFormatoFecha(r.hte_Fecha_Transaccion)}</td>
                                                                        </tr>
                                                                    </React.Fragment>
                                                                )
                                                            })}
                                                        </>
                                                    }
                                                </tbody>
                                            </Table>
                                        </Col>
                                    </Row>
                                    <h4 className="text-center m-4">Justicia y Verdad</h4>
                                    <Row className="text-center mt-5">
                                        <Col>
                                            <h5 style={{ height: "1.2em" }}></h5>
                                            {/* <Input className="text-center" bsSize="sm" type="text" placeholder="Escriba nombre del secretario"></Input> */}
                                            <hr color="black"></hr>
                                            <h5>Secretario</h5>
                                        </Col>
                                        <Col cols="2"></Col>
                                        <Col>
                                            <h5>{JSON.parse(localStorage.getItem("infoSesion")).pem_Nombre}</h5>
                                            <hr color="black"></hr>
                                            <h5>Pastor</h5>
                                        </Col>
                                    </Row>
                                </>
                            }
                        </CardBody>
                    </Card>
                </Container>
                <Modal isOpen={this.state.modal}>
                    <ModalBody>
                        Procesando...
                    </ModalBody>
                </Modal>
            </>
        )
    }
}
export default ReporteTransacciones;
