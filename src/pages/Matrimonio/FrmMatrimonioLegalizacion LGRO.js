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
            habilitaComponenteDomicilio: false,
            boolNvoEstado: false,
            matNombreContrayenteMujerForaneoInvalid: false,
            matNombreContrayenteHombreForaneoInvalid: false,
            matTipoEnalceInvalid: false,
            perIdPersonaHombreInvalid: false,
            perIdPersonaMujerInvalid: false,
            matFechaBodaEclesiasticaInvalid: false,
            sector: {}
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
                mat_Fecha_Boda_Civil: null,
                mat_Numero_Acta: "",
                mat_Libro_Acta: "",
                mat_Oficialia: "",
                mat_Registro_Civil: "",
                mat_Fecha_Boda_Eclesiastica: null,
                mat_Cantidad_Hijos: "0",
                mat_Nombre_Hijos: "",
                dis_Id_Distrito: localStorage.getItem("dto"),
                sec_Id_Sector: localStorage.getItem("sector"),
                usu_Id_Usuario: this.infoSesion.pem_Id_Ministro
            },
            domicilio: {
                ...this.state.domicilio,
                hd_Tipo_Subdivision: "COL.",
                sec_Id_Sector: localStorage.getItem("sector"),
                dis_Id_Distrito: localStorage.getItem("dto"),
                pais_Id_Pais: "0",
                est_Id_Estado: "0",
                hd_Calle: "",
                hd_Localidad: "",
                hd_Numero_Exterior: "",
                usu_Id_Usuario: JSON.parse(localStorage.getItem('infoSesion')).pem_Id_Ministro,
                hd_Activo: true,
                nvoEstado: ""
            }
        })
        if (localStorage.getItem("mat_Id_MatrimonioLegalizacion") === "0") { //Si es para Nuevo Registro de Matrimonio/Leg., No para edición
            this.setState({
                matLegal: {
                    ...this.state.matLegal,
                    mat_Tipo_Enlace: "0",
                    per_Id_Persona_Hombre: "0",
                    per_Id_Persona_Mujer: "0",
                    mat_Nombre_Contrayente_Hombre_Foraneo: "",
                    mat_Nombre_Contrayente_Mujer_Foraneo: "",
                    mat_Fecha_Boda_Civil: null,
                    mat_Numero_Acta: "",
                    mat_Libro_Acta: "",
                    mat_Oficialia: "",
                    mat_Registro_Civil: "",
                    mat_Fecha_Boda_Eclesiastica: null,
                    mat_Cantidad_Hijos: "0",
                    mat_Nombre_Hijos: "",
                    dis_Id_Distrito: localStorage.getItem("dto"),
                    sec_Id_Sector: localStorage.getItem("sector"),
                    usu_Id_Usuario: this.infoSesion.pem_Id_Ministro
                },
                habilitaComponenteDomicilio: true
            })
        }
        else {//Si se tiene ya un Id de Registro de Matrimonio

            helpers.authAxios.get(helpers.url_api + "/Matrimonio_Legalizacion/" + localStorage.getItem("mat_Id_MatrimonioLegalizacion"))
                .then(res => {
                    res.data.matrimonioLegalizacion.mat_Fecha_Boda_Civil = res.data.matrimonioLegalizacion.mat_Fecha_Boda_Civil === null ? null : helpers.reFormatoFecha(res.data.matrimonioLegalizacion.mat_Fecha_Boda_Civil);
                    res.data.matrimonioLegalizacion.mat_Fecha_Boda_Eclesiastica = helpers.reFormatoFecha(res.data.matrimonioLegalizacion.mat_Fecha_Boda_Eclesiastica)
                    this.setState({
                        matLegal: res.data.matrimonioLegalizacion,
                        bolForaneoHombre: res.data.matrimonioLegalizacion.mat_Nombre_Contrayente_Hombre_Foraneo !== "" ? true : false,
                        bolForaneoMujer: res.data.matrimonioLegalizacion.mat_Nombre_Contrayente_Mujer_Foraneo !== "" ? true : false,
                        habilitaComponenteDomicilio: false
                    })
                    this.getHombres(localStorage.getItem("sector"));
                    this.getMujeres(localStorage.getItem("sector"));
                });
        }
    }

    getHombres = async (str) => {
        if (str === "MATRIMONIO") {// Si el argumento es 'MATRIMONIO' trae a Hombres Candidatos para Matrimonio.
            await helpers.authAxios.get(this.url + "/Matrimonio_Legalizacion/GetHombresPorSectorParaMatrimonio/" + localStorage.getItem("sector"))
                .then(res => {
                    this.setState({
                        hombres: res.data.hombresParaMatrimonio.sort((a, b) => {
                            const nameA = a.per_Nombre; // ignore upper and lowercase
                            const nameB = b.per_Nombre; // ignore upper and lowercase
                            if (nameA < nameB) {
                                return -1;
                            }
                            if (nameA > nameB) {
                                return 1;
                            }

                            // names must be equal
                            return 0;
                        })

                    })
                })
        }
        else {//Si el argumento es 'LEGALIZACION' trae a Hombres Candidatos para Legalización.
            await helpers.authAxios.get(this.url + "/Matrimonio_Legalizacion/GetHombresPorSectorParaLegalizacion/" + localStorage.getItem("sector"))
                .then(res => {
                    this.setState({
                        hombres: res.data.hombresParaLegalizacion.sort((a, b) => {
                            const nameA = a.per_Nombre; // ignore upper and lowercase
                            const nameB = b.per_Nombre; // ignore upper and lowercase
                            if (nameA < nameB) {
                                return -1;
                            }
                            if (nameA > nameB) {
                                return 1;
                            }

                            // names must be equal
                            return 0;
                        })
                    })
                })
        }
    }

    getSector = async (id) => { //Trae los datos del Sector y los graba en la Variable de Estado 'sector'
        await helpers.authAxios.get(`/Sector/${id}`)
            .then(res => {
                this.setState({ sector: res.data.sector[0] })
            })
    }

    handleChangeEstado = (e) => {
        if (e.target.value === "999") {
            this.setState({
                boolNvoEstado: true,
                domicilio: {
                    ...this.state.domicilio,
                    est_Id_Estado: e.target.value
                }
            })
        }
        else {
            this.setState({
                boolNvoEstado: false,
                domicilio: {
                    ...this.state.domicilio,
                    nvoEstado: "",
                    est_Id_Estado: e.target.value
                }
            })
        }
    }

    getMujeres = async (str) => {
        if (str === "MATRIMONIO") {
            await helpers.authAxios.get(this.url + "/Matrimonio_Legalizacion/GetMujeresPorSectorParaMatrimonio/" + localStorage.getItem("sector"))
                .then(res => {
                    this.setState({
                        mujeres: res.data.mujeresParaMatrimonio.sort((a, b) => {
                            const nameA = a.per_Nombre; // ignore upper and lowercase
                            const nameB = b.per_Nombre; // ignore upper and lowercase
                            if (nameA < nameB) {
                                return -1;
                            }
                            if (nameA > nameB) {
                                return 1;
                            }

                            // names must be equal
                            return 0;
                        })
                    })
                })
        }
        else {
            await helpers.authAxios.get(this.url + "/Matrimonio_Legalizacion/GetMujeresPorSectorParaLegalizacion/" + localStorage.getItem("sector"))
                .then(res => {
                    this.setState({
                        mujeres: res.data.mujeresParaLegalizacion.sort((a, b) => {
                            const nameA = a.per_Nombre; // ignore upper and lowercase
                            const nameB = b.per_Nombre; // ignore upper and lowercase
                            if (nameA < nameB) {
                                return -1;
                            }
                            if (nameA > nameB) {
                                return 1;
                            }

                            // names must be equal
                            return 0;
                        })
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
            default:
        }
    }

    onChange = (e) => {
        this.setState({
            matLegal: {
                ...this.state.matLegal,
                [e.target.name]: e.target.value.toUpperCase()
            }
        });

        if (e.target.name === "mat_Tipo_Enlace") { //Si el Input que modificó es 'mat_Tipo_Enlace'
            this.getSector(this.state.matLegal.sec_Id_Sector); //Trae los datos del Sector y los graba en la Variable de Estado 'sector'
            switch (e.target.value) {
                case "0": //Si no eligió nada.
                    this.setState({
                        hombres: [],
                        mujeres: []
                    });
                    break;
                case "LEGALIZACION": //Si eligió Legalización.
                    //this.setState({ bolMatrimonio: false });
                    this.getHombres(e.target.value); //Ejecuta fn pasandole como argumento 'LEGALIZACION'
                    this.getMujeres(e.target.value);//Ejecuta fn pasandole como argumento 'LEGALIZACION'
                    break;
                default: //Si eligió Matrimonio
                    //this.setState({ bolMatrimonio: true });
                    this.getHombres(e.target.value);//Ejecuta fn pasandole como argumento 'MATRIMONIO'
                    this.getMujeres(e.target.value);//Ejecuta fn pasandole como argumento 'MATRIMONIO'
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

        const handle_Submit = async (e) => { //Al presionar el Botón grabar
            e.preventDefault();

            if (localStorage.getItem("mat_Id_MatrimonioLegalizacion") === "0") {//Si no Edición, sino un NUevo Registro de Matrimonio/Legaliz.
                // VALIDACIONES
                this.setState({
                    matTipoEnalceInvalid: this.state.matLegal.mat_Tipo_Enlace === "0" ? true : false,
                    matNombreContrayenteMujerForaneoInvalid: this.state.bolForaneoMujer && this.state.matLegal.mat_Nombre_Contrayente_Mujer_Foraneo === "" ? true : false,
                    matNombreContrayenteHombreForaneoInvalid: this.state.bolForaneoHombre && this.state.matLegal.mat_Nombre_Contrayente_Hombre_Foraneo === "" ? true : false,
                    perIdPersonaMujerInvalid: !this.state.bolForaneoMujer && this.state.matLegal.per_Id_Persona_Mujer === "0" ? true : false,
                    perIdPersonaHombreInvalid: !this.state.bolForaneoHombre && this.state.matLegal.per_Id_Persona_Hombre === "0" ? true : false,
                    matFechaBodaEclesiasticaInvalid: this.state.matLegal.mat_Fecha_Boda_Eclesiastica === null || this.state.matLegal.mat_Fecha_Boda_Eclesiastica === "" ? true : false
                });

                let matTipoEnalceInvalidTmp = this.state.matLegal.mat_Tipo_Enlace === "0" ? true : false;
                let matNombreContrayenteMujerForaneoInvalidTmp = this.state.bolForaneoMujer && this.state.matLegal.mat_Nombre_Contrayente_Mujer_Foraneo === "" ? true : false;
                let matNombreContrayenteHombreForaneoInvalidTmp = this.state.bolForaneoHombre && this.state.matLegal.mat_Nombre_Contrayente_Hombre_Foraneo === "" ? true : false;
                let perIdPersonaMujerInvalidTmp = !this.state.bolForaneoMujer && this.state.matLegal.per_Id_Persona_Mujer === "0" ? true : false;
                let perIdPersonaHombreInvalidTmp = !this.state.bolForaneoHombre && this.state.matLegal.per_Id_Persona_Hombre === "0" ? true : false;
                let matFechaBodaEclesiasticaInvalidTmp = this.state.matLegal.mat_Fecha_Boda_Eclesiastica === null || this.state.matLegal.mat_Fecha_Boda_Eclesiastica === "" ? true : false;
                if (matTipoEnalceInvalidTmp || matNombreContrayenteMujerForaneoInvalidTmp ||
                    matNombreContrayenteHombreForaneoInvalidTmp || perIdPersonaMujerInvalidTmp ||
                    perIdPersonaHombreInvalidTmp || matFechaBodaEclesiasticaInvalidTmp) {
                    return false;
                }

                // HABILITA SECCION DEL NUEVO DOMICILIO
                if (this.state.rSelected) {
                    // VALIDACIONES
                    if (this.state.domicilio.pais_Id_Pais === "0" || this.state.domicilio.est_Id_Estado === "0") {
                        alert("Error:\nDebe seleccionar un pais / estado.");
                        return false;
                    }
                    if (this.state.domicilio.est_Id_Estado === "999" && this.state.domicilio.nvoEstado === "") {
                        alert("Error:\nHas seleccionado agregar \"Otro estado\", por lo tanto, el campo no puede quedar vacio.");
                        return false;
                    }
                }

                // PREPARA OBJETO PARA REGISTRO DE BASE DE DATOS
                let matLegalDom = {
                    matLegalEntity: this.state.matLegal, //Objeto que contiene los datos del Formulario
                    HogarDomicilioEntity: this.state.domicilio, //Objeto que contiene los datos del Domicilio
                    boolNvoDomicilio: this.state.rSelected, //Si se creará un Nuevo Hogar
                    nvoEstado: this.state.domicilio.nvoEstado, //Si se creará un Nuevo Estado
                    sectorAlias: this.state.sector.sec_Alias //El Alias del Sector.
                }

                try {
                    helpers.authAxios.post(`${helpers.url_api}/Matrimonio_Legalizacion/AltaMatriminioLegalizacion`, matLegalDom)
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
                }
                catch (error) {
                    alert("Error: Hubo un problema en la comunicacion con el servidor. Intente mas tarde.");
                    // setTimeout(() => { document.location.href = '/ListaDePersonal'; }, 3000);
                }
            }
            else { //Si es una Edición y trae el numero de Id de un Registro de Matrimonio/Leg.
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
                    alert("Error: Hubo un problema en la comunicación con el Servidor. Intente mas tarde.");
                    // setTimeout(() => { document.location.href = '/ListaDePersonal'; }, 3000);
                }
            }
        }

        return (
            <Container>
                <Row>
                    <Col xs="12">
                        <Form onSubmit={handle_Submit}>
                            <Card>
                                <CardHeader>
                                    <h5><strong>Registro de Matrimonios y Legalizaciones.</strong></h5>
                                </CardHeader>
                                <CardBody>
                                    <FormGroup>
                                        <Row>
                                            <Col xs="2">
                                                <Label><strong>Elija el Tipo de Enlace: *</strong></Label>
                                            </Col>
                                            <Col xs="4">
                                                <Input type="select"
                                                    name="mat_Tipo_Enlace"
                                                    onChange={this.onChange}
                                                    value={this.state.matLegal.mat_Tipo_Enlace}
                                                    invalid={this.state.matTipoEnalceInvalid}
                                                >
                                                    <option value="0">Selecionar categoria</option>
                                                    <option value="MATRIMONIO">MATRIMONIO</option>
                                                    <option value="LEGALIZACION">LEGALIZACION</option>
                                                </Input>
                                                <FormFeedback>Debe seleccionar un tipo de enlace.</FormFeedback>
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                    <Row>
                                        <Col xs="6">
                                            <Card>
                                                <CardHeader className='cardTituloContrayenteHombre'>
                                                    Contrayente Hombre
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
                                                                        invalid={this.state.perIdPersonaHombreInvalid}
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
                                                                    <FormFeedback>Debe seleccionar el contrayente hombre.</FormFeedback>
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
                                                                        invalid={this.state.matNombreContrayenteHombreForaneoInvalid}
                                                                    />
                                                                    <FormFeedback>Este campo no puede quedar vacio.</FormFeedback>
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
                                                    Contrayente Mujer
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
                                                                        invalid={this.state.perIdPersonaMujerInvalid}
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
                                                                    <FormFeedback>Debe seleccionar la contrayente mujer.</FormFeedback>
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
                                                                        invalid={this.state.matNombreContrayenteMujerForaneoInvalid}
                                                                    />
                                                                    <FormFeedback>Este campo no puede quedar vacío.</FormFeedback>
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
                                                <Label><strong>Número Acta: </strong></Label>
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
                                                <Label><strong>Oficialía: </strong></Label>
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
                                                    invalid={this.state.matFechaBodaEclesiasticaInvalid}
                                                />
                                                <Label><strong>Fecha Boda Eclesiastica: </strong></Label>
                                                <FormFeedback>Debe seleccionar una fecha para continuar.</FormFeedback>
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
                                                    min="0"
                                                    max="25"
                                                />
                                                <Label><strong>Cantidad Hijos: </strong></Label>
                                                <FormFeedback></FormFeedback>
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col xs="12">
                                            <FormGroup>
                                                <Label><strong>Nombre de Hijos: </strong> &#40;Nota: En caso de haber, asegúrese de poner los nombres de los hijos de ambos.&#41;</Label>
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
                                                    <Label><strong>¿Crearán un Nuevo Hogar en la Localidad? </strong></Label>
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
                                            handleChangeEstado={this.handleChangeEstado}
                                            boolNvoEstado={this.state.boolNvoEstado}
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
            </Container >
        )
    }
}

export default FrmMatrimonioLegalizacion;