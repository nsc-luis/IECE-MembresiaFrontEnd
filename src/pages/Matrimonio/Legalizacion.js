import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
    Container, Row, Col, Card, CardHeader,
    CardBody, CardFooter, Form, Input, Label,
    Button, FormFeedback, FormGroup,
    Modal, ModalBody, ButtonGroup, Alert
} from 'reactstrap';
import helpers from '../../components/Helpers';
import './style.css';
import HogarPersonaDomicilio from './HogarPersonaDomicilio';

class Legalizacion extends Component {

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
            matFechaBodaCivilInvalid: false,
            sector: {},
            DatosHogarDomicilio: [],
            MiembrosDelHogar: [],
            JerarquiasDisponibles: [],
            direccion: "",
            mensajes: "",
            viviranEnLocalidad: false,
            ListaHogares: [],
            submitBtnDisable: false
        }
        localStorage.setItem("mat_Id_MatrimonioLegalizacion", "0")
        this.infoSesion = JSON.parse(localStorage.getItem('infoSesion'));
    }

    componentDidMount() {
        this.setState({
            matLegal: {
                ...this.state.matLegal,
                mat_Tipo_Enlace: "LEGALIZACION",
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
                mat_Apellido_Casada: "",
                dis_Id_Distrito: localStorage.getItem("dto"),
                sec_Id_Sector: localStorage.getItem("sector"),
                usu_Id_Usuario: this.infoSesion.pem_Id_Ministro
            },
            habilitaComponenteDomicilio: true,
            domicilio: {
                ...this.state.domicilio,
                hd_Tipo_Subdivision: "COL.",
                sec_Id_Sector: localStorage.getItem("sector"),
                dis_Id_Distrito: localStorage.getItem("dto"),
                pais_Id_Pais: "0",
                est_Id_Estado: "0",
                hd_Calle: "",
                hd_Localidad: "",
                hd_CP: "",
                hd_Numero_Exterior: "",
                usu_Id_Usuario: JSON.parse(localStorage.getItem('infoSesion')).pem_Id_Ministro,
                hd_Activo: true,
                nvoEstado: ""
            },
            hogar: { //Inicializa las variables del Objeto 'Hogar'
                ...this.state.hogar,
                hd_Id_Hogar: "0",
                hp_Jerarquia: "1"
            },
            mensajes: { //Inicializa las variables del Objeto 'mensajes'
                ...this.state.mensajes,
                emailInvalido: 'Formato incorrecto. Ej: buzon@dominio.com.',
                fechaBautismoInvalida: 'Debe ingresar la fecha de bautismo, formato admintido: dd/mm/aaaa.',
                fechaBodaCivilInvalida: 'Formato admitido: dd/mm/aaaa.',
                fechaEspitiruSantoInvalida: 'Formato admitido: dd/mm/aaaa.',
                fechaBodaEclesiasticaInvalida: 'Formato admitido: dd/mm/aaaa.',
                telMovilInvalido: 'Formatos admitidos: +521234567890, +52(123)4567890, (123)4567890, 1234567890. Hasta 25 numeros sin espacios.',
            }
        })

        this.getSector(localStorage.getItem("sector")); //Trae los datos del Sector y los graba en la Variable de Estado 'sector'
        this.getHombres(localStorage.getItem("sector")); //Trae Candidatos a Matrimonio
        this.getMujeres(localStorage.getItem("sector"));//Trae Candidatas a Matrimonio
    }

    ChangeSubmitBtnDisable = (bol) => {//Sirve para evitar multiples registros por dobleclick en botón Submit
        this.setState({ submitBtnDisable: bol });
    }

    getHombres = async (str) => {//Trae a los Hombres del Sector que esten Activas y que su estado civil sea diferente a 'Casado(a)' o 'Concubinato'
        await helpers.validaToken().then(helpers.authAxios.get(this.url + "/Matrimonio_Legalizacion/GetHombresPorSectorParaLegalizacion/" + localStorage.getItem("sector"))
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
        )
    }

    getSector = async (id) => { //Trae los datos del Sector y los graba en la Variable de Estado 'sector'
        await helpers.validaToken().then(helpers.authAxios.get(`/Sector/${id}`)
            .then(res => {
                this.setState({ sector: res.data.sector[0] })
            })
        )
    }

    getMujeres = async (str) => {//Trae a las Mujeres del Sector que esten Activas y que su estado civil sea diferente a 'Casado(a)' o 'Concubinato'
        await helpers.validaToken().then(helpers.authAxios.get(this.url + "/Matrimonio_Legalizacion/GetMujeresPorSectorParaLegalizacion/" + localStorage.getItem("sector"))
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
        )
    }

    onChange = (e) => {
        this.setState({
            matLegal: {
                ...this.state.matLegal,
                [e.target.name]: e.target.value.toUpperCase()
            }
        });

        if (e.target.name === "mat_Fecha_Boda_Civil") {
            this.setState({
                matFechaBodaCivilInvalid: false
            })
        }

        if (e.target.name === "mat_Fecha_Boda_Eclesiastica") {
            this.setState({
                matFechaBodaEclesiasticaInvalid: false,
            })
        }

        //Si es persona Local, trae sus datos de Hogar para conformar la Posible Lista de Hogares Existentes
        if (e.target.name === "per_Id_Persona_Mujer" || e.target.name === "per_Id_Persona_Hombre") {

            helpers.validaToken().then(helpers.authAxios.get(this.url + "/Hogar_Persona/GetHogarByPersona/" + e.target.value)
                .then(res => {

                    //Si en el hogar de este conyuge, él o ella es el único bautizado, lo toma en cuenta para conformar la Lista de Hogares
                    if (res.data.datosDelHogarPorPersona.bautizadosVivos < 2) {
                        this.setState({
                            ListaHogares: [...this.state.ListaHogares, res.data.datosDelHogarPorPersona]
                        });
                        console.log("Datos-Hogar: ", res.data.datosDelHogarPorPersona);
                    }
                })
            );


        }

    }

    componentWillUnmount() {
        localStorage.removeItem("mat_Id_MatrimonioLegalizacion");
    }

    handle_CancelaCaptura = () => {
        this.setState({ enableFrmRegistroMatLegal: false })
    }

    handle_Submit = async (e) => { //Al presionar el Botón grabar
        e.preventDefault();

        if (localStorage.getItem("mat_Id_MatrimonioLegalizacion") === "0") {//Si no Edición, sino un NUevo Registro de Matrimonio/Legaliz.
            // VALIDACIONES
            //Modifica los estados de las varibales de bloque las Variables de Invalidaciones, si deben estar en 'true'
            this.setState({
                matTipoEnalceInvalid: this.state.matLegal.mat_Tipo_Enlace === "0" ? true : false,
                matNombreContrayenteMujerForaneoInvalid: this.state.bolForaneoMujer && this.state.matLegal.mat_Nombre_Contrayente_Mujer_Foraneo === "" ? true : false,
                matNombreContrayenteHombreForaneoInvalid: this.state.bolForaneoHombre && this.state.matLegal.mat_Nombre_Contrayente_Hombre_Foraneo === "" ? true : false,
                perIdPersonaMujerInvalid: !this.state.bolForaneoMujer && this.state.matLegal.per_Id_Persona_Mujer === "0" ? true : false,
                perIdPersonaHombreInvalid: !this.state.bolForaneoHombre && this.state.matLegal.per_Id_Persona_Hombre === "0" ? true : false,
                matFechaBodaEclesiasticaInvalid: this.state.matLegal.mat_Fecha_Boda_Eclesiastica === null || this.state.matLegal.mat_Fecha_Boda_Eclesiastica === "" ? true : false,
                matFechaBodaCivilInvalid: this.state.matLegal.mat_Fecha_Boda_Civil === null || this.state.matLegal.mat_Fecha_Boda_Civil === "" ? true : false
            });

            //Pone en varibales de bloque las Variables de Invalidaciones, si deben estar en 'true'
            let matTipoEnalceInvalidTmp = this.state.matLegal.mat_Tipo_Enlace === "0" ? true : false;
            let matNombreContrayenteMujerForaneoInvalidTmp = this.state.bolForaneoMujer && this.state.matLegal.mat_Nombre_Contrayente_Mujer_Foraneo === "" ? true : false;
            let matNombreContrayenteHombreForaneoInvalidTmp = this.state.bolForaneoHombre && this.state.matLegal.mat_Nombre_Contrayente_Hombre_Foraneo === "" ? true : false;
            let perIdPersonaMujerInvalidTmp = !this.state.bolForaneoMujer && this.state.matLegal.per_Id_Persona_Mujer === "0" ? true : false;
            let perIdPersonaHombreInvalidTmp = !this.state.bolForaneoHombre && this.state.matLegal.per_Id_Persona_Hombre === "0" ? true : false;
            let matFechaBodaEclesiasticaInvalidTmp = this.state.matLegal.mat_Fecha_Boda_Eclesiastica === null || this.state.matLegal.mat_Fecha_Boda_Eclesiastica === "" ? true : false;
            let matFechaBodaCivilInvalidTmp = this.state.matLegal.mat_Fecha_Boda_Civil === null || this.state.matLegal.mat_Fecha_Boda_Civil === "" ? true : false;
            //Si alguna variable de Invalidación tiene valor 'true' cancela la Transacción,
            if (matTipoEnalceInvalidTmp || matNombreContrayenteMujerForaneoInvalidTmp ||
                matNombreContrayenteHombreForaneoInvalidTmp || perIdPersonaMujerInvalidTmp ||
                perIdPersonaHombreInvalidTmp || matFechaBodaEclesiasticaInvalidTmp ||
                matFechaBodaCivilInvalidTmp) {
                return false;
            }

            // Si se va a crear un Hogar Nuevo
            if (this.state.rSelected === true && this.state.hogar.hd_Id_Hogar === "0") {

                if (this.state.domicilio.pais_Id_Pais === "0"
                    || this.state.domicilio.hd_Calle === ""
                    || this.state.domicilio.hd_Municipio_Ciudad === "") {
                    alert("Error!. Debe ingresar al menos Calle, Ciudad y País y Estado para un Nuevo Domicilio.")
                    return false;
                }
                // Valida campos del Componente 'HogarPersonaDomicilio'

                if (this.state.domicilio.pais_Id_Pais === "0" || this.state.domicilio.est_Id_Estado === "0") {
                    alert("Error:\nDebe seleccionar un Pais / Estado.");
                    return false;
                }
                if (this.state.domicilio.est_Id_Estado === "999" && this.state.domicilio.nvoEstado === "") {
                    alert("Error:\nHas seleccionado agregar \"Otro Estado\", por lo tanto, el campo no puede quedar vacío.");
                    return false;
                }
            }

            // PREPARA OBJETO PARA REGISTRO DE BASE DE DATOS
            let matLegalDom = {
                matLegalEntity: this.state.matLegal, //Objeto que contiene los datos del Formulario
                HogarDomicilioEntity: this.state.domicilio, //Objeto que contiene los datos del Domicilio
                boolNvoDomicilio: this.state.rSelected && this.state.hogar.hd_Id_Hogar === "0" ? true : false, //Si se creará un Nuevo Hogar
                nvoEstado: this.state.domicilio.nvoEstado, //Si se creará un Nuevo Estado
                sectorAlias: this.state.sector.sec_Alias, //El Alias del Sector.
                viviranEnLocalidad: this.state.viviranEnLocalidad
            }

            //Para deshabilitar el botón y evitar multiples registros de Matrimonio y Ediciones de Persona
            this.ChangeSubmitBtnDisable(true)

            //Procede a Registrar la Legalización y a editar Personas
            try {
                this.setState({
                    mensajeDelProceso: "Procesando...",
                    modalShow: true
                });
                helpers.validaToken().then(helpers.authAxios.post(`${helpers.url_api}/Matrimonio_Legalizacion/AltaLegalizacion`, matLegalDom)
                    .then(res => {
                        if (res.data.status === "success") {
                            setTimeout(() => {
                                this.setState({
                                    mensajeDelProceso: "Los datos fueron grabados satisfactoriamente."
                                });
                            }, 1500);
                            setTimeout(() => {
                                document.location.href = '/Main'
                            }, 1500);
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
                    })
                );
            }
            catch (error) {
                alert("Error: Hubo un problema en la comunicacion con el servidor. Intente mas tarde.");
                // setTimeout(() => { document.location.href = '/ListaDePersonal'; }, 3000);
            }
        }
        else { //Si es una Edición y trae el numero de Id de un Registro de Matrimonio/Leg.
            try {
                helpers.validaToken().then(helpers.authAxios.put(helpers.url_api + "/Matrimonio_Legalizacion/" + localStorage.getItem("mat_Id_MatrimonioLegalizacion"), this.state.matLegal)
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
                    })
                );
            } catch (error) {
                alert("Error: Hubo un problema en la comunicación con el Servidor. Intente mas tarde.");
                // setTimeout(() => { document.location.href = '/ListaDePersonal'; }, 3000);
            }
        }
    }

    handleKeyPress = (e) => {
        console.log("Tecla: ", e.key)
        if (e.key === 'Enter') {
            alert("No se permiten saltos de linea en este campo. Escriba a Renglón seguido.");
            e.preventDefault();
        }
    }


    render() {
        // const {
        //     handle_CancelaCaptura,
        //     mat_Id_MatrimonioLegalizacion
        // } = this.props


        return (
            <Container>
                <Row>
                    <Col xs="12">
                        <Form onSubmit={this.handle_Submit}>
                            <Card>
                                <CardHeader>
                                    <h5><strong>Legalización de Matrimonio</strong></h5>
                                </CardHeader>
                                <CardBody>
                                    <Alert color="warning" >
                                        <strong>Aviso: </strong> <br />
                                        <ul>
                                            <li>El personal aplicable a Legalización de Matrimonio debe tener estado civil 'Casado(a)'.
                                            </li>
                                        </ul>
                                    </Alert>
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
                                                                                <option key={mujer.per_Id_Persona} value={mujer.per_Id_Persona}> {mujer.per_Nombre} {mujer.apellidoPrincipal} {mujer.per_Apellido_Materno} </option>
                                                                            )
                                                                        })
                                                                    }
                                                                </Input>
                                                                <FormFeedback>Debe seleccionar la contrayente mujer.</FormFeedback>
                                                            </Col>
                                                        </Row>
                                                    </FormGroup>
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
                                                    invalid={this.state.matFechaBodaCivilInvalid}
                                                    autoComplete="nope"
                                                />
                                                <Label><strong>Fecha Boda Civil: </strong></Label>
                                                <FormFeedback>Debe seleccionar una fecha para continuar.</FormFeedback>
                                            </FormGroup>
                                        </Col>
                                        <Col xs="4">
                                            <FormGroup>
                                                <Input
                                                    name="mat_Numero_Acta"
                                                    onChange={this.onChange}
                                                    type="text"
                                                    value={this.state.matLegal.mat_Numero_Acta}
                                                    autoComplete="nope"
                                                />
                                                <Label><strong>Número Acta: </strong></Label>
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
                                                    autoComplete="nope"
                                                />
                                                <Label><strong>Libro Acta: </strong></Label>
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
                                                    autoComplete="nope"
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
                                                    autoComplete="nope"
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
                                                    autoComplete="nope"
                                                />
                                                <Label><strong>Fecha Boda Eclesiastica: </strong></Label>
                                                <FormFeedback>Debe seleccionar una fecha para continuar.</FormFeedback>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <hr />
                                    <Row>
                                        <Col xs="4" className="col-sm-4">
                                            <Input
                                                type="text"
                                                name="mat_Apellido_Casada"
                                                onChange={this.onChange}
                                                className="form-control"
                                                value={this.state.matLegal.mat_Apellido_Casada}
                                                autoComplete="nope"
                                            />
                                            <label><strong>Apellido de Casada</strong> &#40;Nota: Sólo si se desea que aparezca con Apellido de Casada.&#41;</label>
                                        </Col>
                                        {/* <Col xs="4">
                                            <FormGroup>
                                                <Input
                                                    name="mat_Cantidad_Hijos"
                                                    onChange={this.onChange}
                                                    type="number"
                                                    value={this.state.matLegal.mat_Cantidad_Hijos}
                                                    autoComplete="nope"
                                                    min="0"
                                                    max="25"
                                                />
                                                <Label><strong>Cantidad Hijos: </strong></Label>
                                                <FormFeedback></FormFeedback>
                                            </FormGroup>
                                        </Col> */}
                                    </Row>

                                    {/* <Row>
                                        <Col xs="12">
                                            <FormGroup>
                                                <Input
                                                    name="mat_Nombre_Hijos"
                                                    onChange={this.onChange}
                                                    type="textarea"
                                                    value={this.state.matLegal.mat_Nombre_Hijos}
                                                    autoComplete="nope"
                                                    onKeyPress={this.handleKeyPress}
                                                />
                                                <Label><strong>Nombre de Hijos: </strong> &#40;Nota: Donde sea aplicable, incluya los hijos de ambos.&#41;</Label>
                                                <FormFeedback></FormFeedback>
                                            </FormGroup>
                                        </Col>
                                    </Row> */}
                                </CardBody>
                                <CardFooter>
                                    <Row >
                                        <Col className="col xs-10"></Col>
                                        <Col className=" col-auto xs-2">
                                            <Link
                                                type="button"
                                                to="/ListaDePersonal"
                                                className="btn btn-secondary"
                                            >
                                                Cancelar
                                            </Link>
                                        </Col>
                                        <Col className="col-auto  xs-2">
                                            <Button
                                                type="submit"
                                                color="primary"
                                                submitBtnDisable={this.state.submitBtnDisable}
                                            >
                                                <span className="fas fa-save icon-btn-p"></span>Guardar
                                            </Button>
                                        </Col>
                                    </Row>
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

export default Legalizacion;