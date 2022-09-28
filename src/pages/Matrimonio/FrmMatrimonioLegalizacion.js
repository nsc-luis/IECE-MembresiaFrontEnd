import React, { Component } from 'react';
import {
    Container, Row, Col, Card, CardHeader,
    CardBody, CardFooter, Form, Input, Label,
    Button, FormFeedback, Table, FormGroup,
    Modal, ModalFooter, ModalBody, ModalHeader, ButtonGroup
} from 'reactstrap';
import helpers from '../../components/Helpers';
import './style.css';
import HogarPersonaDomicilio from './HogarPersonaDomicilio';

class FrmMatrimonioLegalizacion extends Component {

    url = helpers.url_api;
    fechaNoIngresada = "01/01/1900";

    constructor(props) {
        super(props);
        this.state = {
            matLegal: {},
            bolForaneoHombre: false,
            bolForaneoMujer: false,
            hombres: [],
            mujeres: [],
            modalShow: false,
            mensajeDelProceso: "",
            rSelected: false,
            hogar: {},
            domicilio: {},
            habilitaComponenteDomicilio: false
        }
        this.infoSesion = JSON.parse(localStorage.getItem('infoSesion'));
    }

    componentDidMount() {
        this.setState({
            matLegal: {
                ...this.state.matLegal,
                mat_Tipo_Enlace: "0",
                per_Id_Persona_Hombre: "",
                per_Id_Persona_Mujer: "",
                mat_Nombre_Contrayente_Hombre_Foraneo: "",
                mat_Nombre_Contrayente_Mujer_Foraneo: "",
                mat_Fecha_Boda_Civil: "1900-01-01",
                mat_Numero_Acta: "",
                mat_Libro_Acta: "",
                mat_Oficialia: "",
                mat_Registro_Civil: "",
                mat_Fecha_Boda_Eclesiastica: "1900-01-01",
                mat_Cantidad_Hijos: "",
                mat_Nombre_Hijos: "",
                dis_Id_Distrito: localStorage.getItem("dto"),
                sec_Id_Sector: localStorage.getItem("sector"),
                usu_Id_Usuario: this.infoSesion.pem_Id_Ministro
            },
            domicilio: {
                ...this.state.domicilio,
                hd_Tipo_Subdivision: "COL",
                sec_Id_Sector: localStorage.getItem("sector"),
                dis_Id_Distrito: localStorage.getItem("dto"),
                pais_Id_Pais: "0",
                hd_Calle: "",
                hd_Localidad: "",
                hd_Numero_Exterior: "",
                usu_Id_Usuario: JSON.parse(localStorage.getItem('infoSesion')).pem_Id_Ministro,
                hd_Activo: true,
                nvoEstado: ""
            }
        })
        if (localStorage.getItem("mat_Id_MatrimonioLegalizacion") === "0") {
            this.setState({
                matLegal: {
                    ...this.state.matLegal,
                    mat_Tipo_Enlace: "0",
                    per_Id_Persona_Hombre: "0",
                    per_Id_Persona_Mujer: "0",
                    mat_Nombre_Contrayente_Hombre_Foraneo: "",
                    mat_Nombre_Contrayente_Mujer_Foraneo: "",
                    mat_Fecha_Boda_Civil: "1900-01-01",
                    mat_Numero_Acta: "",
                    mat_Libro_Acta: "",
                    mat_Oficialia: "",
                    mat_Registro_Civil: "",
                    mat_Fecha_Boda_Eclesiastica: "1900-01-01",
                    mat_Cantidad_Hijos: "",
                    mat_Nombre_Hijos: "",
                    dis_Id_Distrito: localStorage.getItem("dto"),
                    sec_Id_Sector: localStorage.getItem("sector"),
                    usu_Id_Usuario: this.infoSesion.pem_Id_Ministro
                },
                habilitaComponenteDomicilio: true
            })
        }
        else {
            helpers.authAxios.get(helpers.url_api + "/Matrimonio_Legalizacion/" + localStorage.getItem("mat_Id_MatrimonioLegalizacion"))
                .then(res => {
                    res.data.matrimonioLegalizacion.mat_Fecha_Boda_Civil = helpers.reFormatoFecha(res.data.matrimonioLegalizacion.mat_Fecha_Boda_Civil);
                    res.data.matrimonioLegalizacion.mat_Fecha_Boda_Eclesiastica = helpers.reFormatoFecha(res.data.matrimonioLegalizacion.mat_Fecha_Boda_Eclesiastica)
                    this.setState({
                        matLegal: res.data.matrimonioLegalizacion,
                        bolForaneoHombre: res.data.matrimonioLegalizacion.mat_Nombre_Contrayente_Hombre_Foraneo !== "" ? true : false,
                        bolForaneoMujer: res.data.matrimonioLegalizacion.mat_Nombre_Contrayente_Mujer_Foraneo !== "" ? true : false,
                        habilitaComponenteDomicilio: false
                    })
                    this.getHombres(res.data.matrimonioLegalizacion.mat_Tipo_Enlace);
                    this.getMujeres(res.data.matrimonioLegalizacion.mat_Tipo_Enlace);
                });
        }
    }

    getHombres = async (str) => {
        if (str === "MATRIMONIO") {
            await helpers.authAxios.get(this.url + "/Matrimonio_Legalizacion/GetHombresPorSectorParaMatrimonio/" + localStorage.getItem("sector"))
                .then(res => {
                    this.setState({
                        hombres: res.data.hombresParaMatrimonio
                    })
                })
        }
        else {
            await helpers.authAxios.get(this.url + "/Matrimonio_Legalizacion/GetHombresPorSectorParaLegalizacion/" + localStorage.getItem("sector"))
                .then(res => {
                    this.setState({
                        hombres: res.data.hombresParaLegalizacion
                    })
                })
        }
    }

    getMujeres = async (str) => {
        if (str === "MATRIMONIO") {
            await helpers.authAxios.get(this.url + "/Matrimonio_Legalizacion/GetMujeresPorSectorParaMatrimonio/" + localStorage.getItem("sector"))
                .then(res => {
                    this.setState({
                        mujeres: res.data.mujeresParaMatrimonio
                    })
                })
        }
        else {
            await helpers.authAxios.get(this.url + "/Matrimonio_Legalizacion/GetMujeresPorSectorParaLegalizacion/" + localStorage.getItem("sector"))
                .then(res => {
                    this.setState({
                        mujeres: res.data.mujeresParaLegalizacion
                    })
                })
        }
    }

    onChangeForeaneos = (e) => {

        switch (e.target.name) {
            case "foraneoHombre":
                if (e.target.checked) {
                    this.setState({
                        bolForaneoHombre: true,
                        matLegal: {
                            ...this.state.matLegal,
                            per_Id_Persona_Hombre: "0"
                        }
                    });
                }
                else {
                    this.setState({
                        bolForaneoHombre: false,
                        matLegal: {
                            ...this.state.matLegal,
                            mat_Nombre_Contrayente_Hombre_Foraneo: "",
                            per_Id_Persona_Hombre: "0"
                        }
                    });
                }
                break;
            case "foraneoMujer":
                if (e.target.checked) {
                    this.setState({
                        bolForaneoMujer: true,
                        matLegal: {
                            ...this.state.matLegal,
                            per_Id_Persona_Mujer: "0"
                        }
                    });
                }
                else {
                    this.setState({
                        bolForaneoMujer: false,
                        matLegal: {
                            ...this.state.matLegal,
                            mat_Nombre_Contrayente_Mujer_Foraneo: "",
                            per_Id_Persona_Mujer: "0"
                        }
                    });
                }
                break;
        }
    }

    onChange = (e) => {
        this.setState({
            matLegal: {
                ...this.state.matLegal,
                [e.target.name]: e.target.value.toUpperCase()
            }
        });

        if (e.target.name === "mat_Tipo_Enlace") {
            switch (e.target.value) {
                case "0":
                    this.setState({
                        hombres: [],
                        mujeres: []
                    });
                    break;
                case "Legalizacion":
                    //this.setState({ bolMatrimonio: false });
                    this.getHombres(e.target.value);
                    this.getMujeres(e.target.value);
                    break;
                default:
                    //this.setState({ bolMatrimonio: true });
                    this.getHombres(e.target.value);
                    this.getMujeres(e.target.value);
                    break;
            }

        }
    }

    componentWillUnmount() {
        localStorage.removeItem("mat_Id_MatrimonioLegalizacion");
    }

    onRadioBtnClick(rSelected) {
        this.setState({ rSelected });
    }

    /// METODOS PARA HOGAR - DOMICILIO ///
    fnGetDatosDelHogar = async (id) => {
        if (id !== "0") {
            await helpers.authAxios.get(this.url + "/Hogar_Persona/GetMiembros/" + id)
                .then(res => {
                    this.setState({ MiembrosDelHogar: res.data })
                })
            await helpers.authAxios.get(this.url + "/Hogar_Persona/GetDatosHogarDomicilio/" + id)
                .then(res => {
                    this.setState({ DatosHogarDomicilio: res.data })
                })

            let jerarquias = [];
            for (let i = 1; i < this.state.MiembrosDelHogar.length + 2; i++) {
                jerarquias.push(<option value={i}>{i}</option>)
            }

            this.setState({
                JerarquiasDisponibles: jerarquias,
                hogar: {
                    ...this.state.hogar,
                    hp_Jerarquia: jerarquias.length
                }
            })
        } else {
            this.setState({
                MiembrosDelHogar: [],
                DatosHogarDomicilio: [],
                JerarquiasDisponibles: []
            })
        }
    }

    handle_hd_Id_Hogar = async (e) => {
        let idHogar = e.target.value;
        if (idHogar !== "0") {
            await helpers.authAxios.get(this.url + '/Hogar_Persona/GetMiembros/' + idHogar)
                .then(res => {
                    this.setState({
                        hogar: {
                            ...this.state.hogar,
                            hp_Jerarquia: res.data.length
                        }
                    })
                });
            this.setState({
                hogar: {
                    ...this.state.hogar,
                    hd_Id_Hogar: idHogar
                }
            })
        }
        else {
            this.setState({
                hogar: {
                    ...this.state.hogar,
                    hd_Id_Hogar: idHogar,
                    hp_Jerarquia: "1"
                }
            })
        }

        this.fnGetDatosDelHogar(idHogar);
    }

    handleChangeDomicilio = (e) => {
        this.setState({
            domicilio: {
                ...this.state.domicilio,
                [e.target.name]: e.target.value.toUpperCase()
            }
        })
    }

    render() {
        const {
            handle_CancelaCaptura,
            mat_Id_MatrimonioLegalizacion
        } = this.props

        const handle_Submit = async (e) => {
            e.preventDefault();
            if (localStorage.getItem("mat_Id_MatrimonioLegalizacion") === "0") {
                let matLegalDom = {
                    matLegalEntity: this.state.matLegal,
                    HogarDomicilioEntity: this.state.domicilio
                }
                await helpers.authAxios.get(`${helpers.url_api}/Estado/GetEstadoByIdPais/${this.state.domicilio.pais_Id_Pais}`)
                    .then(res => {
                        if (res.data.status === true) {
                            let contador = 0
                            res.data.estados.forEach(element => {
                                contador = contador + 1
                            })
                            if ((contador < 1 && this.state.domicilio.nvoEstado === "") && this.state.rSelected) {
                                alert("Error: \nEl pais seleccionado no tiene Estados para mostrar, por lo tanto, debe ingresar un nombre de Estado.")
                                return false
                            }
                            else {
                                console.log("entro al 1re else")
                                try {
                                    helpers.authAxios.post(`${helpers.url_api}/Matrimonio_Legalizacion/AltaMatriminioLegalizacion/${this.state.rSelected}/${this.state.domicilio.nvoEstado}`, matLegalDom)
                                        .then(res => {
                                            if (res.data.status === "success") {
                                                // alert(res.data.mensaje);
                                                setTimeout(() => { document.location.href = '/Matrimonio'; }, 3000);
                                                this.setState({
                                                    mensajeDelProceso: "Procesando...",
                                                    modalShow: true
                                                });
                                                setTimeout(() => {
                                                    this.setState({
                                                        mensajeDelProceso: "Los datos fueron grabados satisfactoriamente."
                                                    });
                                                }, 1500);
                                                setTimeout(() => {
                                                    document.location.href = '/Matrimonio'
                                                }, 3500);
                                            } else {
                                                // alert(res.data.mensaje);
                                                this.setState({
                                                    mensajeDelProceso: "Procesando...",
                                                    modalShow: true
                                                });
                                                setTimeout(() => {
                                                    this.setState({
                                                        mensajeDelProceso: res.data.mensaje,
                                                        modalShow: false
                                                    });
                                                }, 1500);
                                            }
                                        });
                                } catch (error) {
                                    alert("Error: Hubo un problema en la comunicacion con el servidor. Intente mas tarde.");
                                    // setTimeout(() => { document.location.href = '/ListaDePersonal'; }, 3000);
                                }
                            }
                        }
                        else {
                            try {
                                helpers.authAxios.put(helpers.url_api + "/Matrimonio_Legalizacion/" + localStorage.getItem("mat_Id_MatrimonioLegalizacion"), this.state.matLegal)
                                    .then(res => {
                                        if (res.data.status === "success") {
                                            // alert(res.data.mensaje);
                                            setTimeout(() => { document.location.href = '/Matrimonio'; }, 3000);
                                            this.setState({
                                                mensajeDelProceso: "Procesando...",
                                                modalShow: true
                                            });
                                            setTimeout(() => {
                                                this.setState({
                                                    mensajeDelProceso: "Los datos fueron actualizados satisfactoriamente."
                                                });
                                            }, 1500);
                                            setTimeout(() => {
                                                document.location.href = '/Matrimonio'
                                            }, 3500);
                                        } else {
                                            // alert(res.data.mensaje);
                                            this.setState({
                                                mensajeDelProceso: "Procesando...",
                                                modalShow: true
                                            });
                                            setTimeout(() => {
                                                this.setState({
                                                    mensajeDelProceso: res.data.mensaje,
                                                    modalShow: false
                                                });
                                            }, 1500);
                                        }
                                    });
                            } catch (error) {
                                alert("Error: Hubo un problema en la comunicacion con el servidor. Intente mas tarde.");
                                // setTimeout(() => { document.location.href = '/ListaDePersonal'; }, 3000);
                            }
                        }
                    })
            }
        }

        return (
            <Container>
                <Row>
                    <Col xs="12">
                        <Form onSubmit={handle_Submit}>
                            <Card>
                                <CardHeader>
                                    <h5><strong>Registro de Matrimonios y legalizaciones.</strong></h5>
                                </CardHeader>
                                <CardBody>
                                    <FormGroup>
                                        <Row>
                                            <Col xs="2">
                                                <Label><strong>Elige una opcion: *</strong></Label>
                                            </Col>
                                            <Col xs="4">
                                                <Input type="select"
                                                    name="mat_Tipo_Enlace"
                                                    onChange={this.onChange}
                                                    value={this.state.matLegal.mat_Tipo_Enlace}
                                                >
                                                    <option value="0">Selecionar categoria</option>
                                                    <option value="MATRIMONIO">MATRIMONIO</option>
                                                    <option value="LEGALIZACION">LEGALIZACION</option>
                                                </Input>
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                    <Row>
                                        <Col xs="6">
                                            <Card>
                                                <CardHeader className='cardTituloContrayenteHombre'>
                                                    Contrayente hombre
                                                </CardHeader>
                                                <CardBody className='cardBodyContrayenteHombre'>
                                                    <FormGroup>
                                                        <Row>
                                                            <Col xs="3">
                                                                <Label>Foraneo:</Label>
                                                            </Col>
                                                            <Col xs="1">
                                                                <Input
                                                                    type="checkbox"
                                                                    name="foraneoHombre"
                                                                    onChange={this.onChangeForeaneos}
                                                                    value={this.state.bolForaneoHombre}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </FormGroup>
                                                    {!this.state.bolForaneoHombre &&
                                                        <FormGroup>
                                                            <Row>
                                                                <Col xs="3">
                                                                    <Label><strong>Hombre: *</strong></Label>
                                                                </Col>
                                                                <Col xs="9">
                                                                    <Input type="select"
                                                                        name="per_Id_Persona_Hombre"
                                                                        onChange={this.onChange}
                                                                        value={this.state.matLegal.per_Id_Persona_Hombre}
                                                                    >
                                                                        <option value="0">Seleccionar hombre</option>
                                                                        {
                                                                            this.state.hombres.map((hombre) => {
                                                                                return (
                                                                                    <option key={hombre.per_Id_Persona} value={hombre.per_Id_Persona}> {hombre.per_Nombre} {hombre.per_Apellido_Paterno} {hombre.per_Apellido_Materno} </option>
                                                                                )
                                                                            })
                                                                        }
                                                                    </Input>
                                                                </Col>
                                                            </Row>
                                                        </FormGroup>
                                                    }
                                                    {this.state.bolForaneoHombre &&
                                                        <FormGroup>
                                                            <Row>
                                                                <Col xs="3">
                                                                    <Label><strong>Nombre: *</strong></Label>
                                                                </Col>
                                                                <Col xs="9">
                                                                    <Input
                                                                        name="mat_Nombre_Contrayente_Hombre_Foraneo"
                                                                        type="text"
                                                                        onChange={this.onChange}
                                                                        value={this.state.matLegal.mat_Nombre_Contrayente_Hombre_Foraneo}
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        </FormGroup>
                                                    }
                                                </CardBody>
                                            </Card>
                                        </Col>
                                        <Col xs="6">
                                            <Card>
                                                <CardHeader className='cardTituloContrayenteMujer'>
                                                    Contrayente mujer
                                                </CardHeader>
                                                <CardBody className='cardBodyContrayenteMujer'>
                                                    <FormGroup>
                                                        <Row>
                                                            <Col xs="3">
                                                                <Label>Foraneo:</Label>
                                                            </Col>
                                                            <Col xs="1">
                                                                <Input
                                                                    type="checkbox"
                                                                    name="foraneoMujer"
                                                                    onChange={this.onChangeForeaneos}
                                                                    value={this.state.bolForaneoMujer}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </FormGroup>

                                                    {!this.state.bolForaneoMujer &&
                                                        <FormGroup>
                                                            <Row>
                                                                <Col xs="3">
                                                                    <Label><strong>Mujer: *</strong></Label>
                                                                </Col>
                                                                <Col xs="9">
                                                                    <Input type="select"
                                                                        name="per_Id_Persona_Mujer"
                                                                        onChange={this.onChange}
                                                                        value={this.state.matLegal.per_Id_Persona_Mujer}
                                                                    >
                                                                        <option value="0">Seleccionar mujer</option>
                                                                        {
                                                                            this.state.mujeres.map((mujer) => {
                                                                                return (
                                                                                    <option key={mujer.per_Id_Persona} value={mujer.per_Id_Persona}> {mujer.per_Nombre} {mujer.per_Apellido_Paterno} {mujer.per_Apellido_Materno} </option>
                                                                                )
                                                                            })
                                                                        }
                                                                    </Input>
                                                                </Col>
                                                            </Row>
                                                        </FormGroup>
                                                    }

                                                    {this.state.bolForaneoMujer &&
                                                        <FormGroup>
                                                            <Row>
                                                                <Col xs="3">
                                                                    <Label><strong>Nombre: *</strong></Label>
                                                                </Col>
                                                                <Col xs="9">
                                                                    <Input
                                                                        name="mat_Nombre_Contrayente_Mujer_Foraneo"
                                                                        onChange={this.onChange}
                                                                        type="text"
                                                                        value={this.state.matLegal.mat_Nombre_Contrayente_Mujer_Foraneo}
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        </FormGroup>
                                                    }
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col xs="4">
                                            <FormGroup>
                                                <Input
                                                    name="mat_Fecha_Boda_Civil"
                                                    onChange={this.onChange}
                                                    type="date"
                                                    value={this.state.matLegal.mat_Fecha_Boda_Civil}
                                                />
                                                <Label><strong>Fecha Boda Civil: </strong></Label>
                                                <FormFeedback></FormFeedback>
                                            </FormGroup>
                                        </Col>
                                        <Col xs="4">
                                            <FormGroup>
                                                <Input
                                                    name="mat_Libro_Acta"
                                                    onChange={this.onChange}
                                                    type="text"
                                                    value={this.state.matLegal.mat_Libro_Acta}
                                                />
                                                <Label><strong>Libro Acta: </strong></Label>
                                                <FormFeedback></FormFeedback>
                                            </FormGroup>
                                        </Col>
                                        <Col xs="4">
                                            <FormGroup>
                                                <Input
                                                    name="mat_Numero_Acta"
                                                    onChange={this.onChange}
                                                    type="text"
                                                    value={this.state.matLegal.mat_Numero_Acta}
                                                />
                                                <Label><strong>Numero Acta: </strong></Label>
                                                <FormFeedback></FormFeedback>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="4">
                                            <FormGroup>
                                                <Input
                                                    name="mat_Oficialia"
                                                    onChange={this.onChange}
                                                    type="text"
                                                    value={this.state.matLegal.mat_Oficialia}
                                                />
                                                <Label><strong>Oficialia: </strong></Label>
                                                <FormFeedback></FormFeedback>
                                            </FormGroup>
                                        </Col>
                                        <Col xs="4">
                                            <FormGroup>
                                                <Input
                                                    name="mat_Registro_Civil"
                                                    onChange={this.onChange}
                                                    type="text"
                                                    value={this.state.matLegal.mat_Registro_Civil}
                                                />
                                                <Label><strong>Registro Civil: </strong></Label>
                                                <FormFeedback></FormFeedback>
                                            </FormGroup>
                                        </Col>
                                        <Col xs="4">
                                            <FormGroup>
                                                <Input
                                                    name="mat_Fecha_Boda_Eclesiastica"
                                                    onChange={this.onChange}
                                                    type="date"
                                                    value={this.state.matLegal.mat_Fecha_Boda_Eclesiastica}
                                                />
                                                <Label><strong>Fecha Boda Eclesiastica: </strong></Label>
                                                <FormFeedback></FormFeedback>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="4">
                                            <FormGroup>
                                                <Input
                                                    name="mat_Cantidad_Hijos"
                                                    onChange={this.onChange}
                                                    type="number"
                                                    value={this.state.matLegal.mat_Cantidad_Hijos}
                                                />
                                                <Label><strong>Cantidad Hijos: </strong></Label>
                                                <FormFeedback></FormFeedback>
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col xs="4">
                                            <FormGroup>
                                                <Label><strong>Nombre Hijos: </strong></Label>
                                                <Input
                                                    name="mat_Nombre_Hijos"
                                                    onChange={this.onChange}
                                                    type="textarea"
                                                    value={this.state.matLegal.mat_Nombre_Hijos}
                                                />
                                                <FormFeedback></FormFeedback>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <hr />
                                    {this.state.habilitaComponenteDomicilio &&
                                        <Row>
                                            <Col xs="2">
                                                <FormGroup>
                                                    <Label><strong>¿Crear nuevo hogar? </strong></Label>
                                                </FormGroup>
                                            </Col>
                                            <Col xs="10">
                                                <FormGroup>
                                                    <ButtonGroup>
                                                        <Button color="info" onClick={() => this.onRadioBtnClick(true)} active={this.state.rSelected === true}>Si</Button>
                                                        <Button color="info" onClick={() => this.onRadioBtnClick(false)} active={this.state.rSelected === false}>No</Button>
                                                    </ButtonGroup>
                                                    <FormFeedback></FormFeedback>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    }

                                    {this.state.rSelected &&
                                        <HogarPersonaDomicilio
                                            domicilio={this.state.domicilio}
                                            onChangeDomicilio={this.handleChangeDomicilio}
                                            handle_hd_Id_Hogar={this.handle_hd_Id_Hogar}
                                            hogar={this.state.hogar}
                                        />
                                    }
                                </CardBody>
                                <CardFooter>
                                    <Button
                                        type="button"
                                        onClick={handle_CancelaCaptura}
                                        className="btnCancelarCaptura"
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        color="primary"
                                    >
                                        <span className="fas fa-save icon-btn-p"></span>Guardar
                                    </Button>
                                </CardFooter>
                            </Card>
                        </Form>
                    </Col>
                </Row>
                <Modal isOpen={this.state.modalShow}>
                    <ModalBody>
                        {this.state.mensajeDelProceso}
                    </ModalBody>
                </Modal>
            </Container>
        )
    }
}

export default FrmMatrimonioLegalizacion;