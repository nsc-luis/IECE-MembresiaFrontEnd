import React, { Component, Fragment } from 'react';
import helpers from "../../components/Helpers";
import {
    Container, Button, Input, Modal, ModalBody, Label, Alert, CardFooter,
    CardTitle, Card, CardBody, Table, Row, Col, FormFeedback, Form, FormGroup, CardHeader, ModalHeader, ModalFooter
} from 'reactstrap';
import './style.css';
import PaisEstado from '../../components/PaisEstado';

class SantuarioyCasaPastoral extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sec_Id_Sector: localStorage.getItem("sector"),
            dis_Id_Distrito: localStorage.getItem("dto"),
            santuario: {},
            casaPastoral: {},
            domicilio: {},
            direccion: "",
            mostrarFormulario: false,
            tipoTransaccion: "",
            modalShow: false,
            propiedadDe_Invalid: false,

            mismoPredioSantuario: true,
            objCasaPastoral: {},
            boolNvoEstado: false,
            usu_Id_Usuario: JSON.parse(localStorage.getItem('infoSesion')).pem_Id_Ministro,
            nvoEstado_Disponible: true,
            boolHabilitaEdicion: false,
            mensajeDelProceso: "",

        };
        this.infoSesion = JSON.parse(localStorage.getItem("infoSesion"));
    }

    componentDidMount() {
        this.getTemploConFoto();
        this.getCasaPastoral();
        window.scrollTo(0, 0);
        //this.inicializacionVariables()
    }

    componentDidUpdate(prevProps, prevState) {
        //Sube el cursor hasta la parte superior
        window.scrollTo(0, 0);
    }

    reseteo_casaPastoral() {
        this.setState({
            ...this.state.casaPastoral,
            casaPastoral: {
                cp_Id_CasaPastoral: 0, //Si no hay casa pastoral el Id se coloca en Cero
                cp_Id_Sector: this.state.sec_Id_Sector,
                cp_Activo: true,
                cp_Mismo_Presio_Templo: true,
                cp_Propiedad_De: null,
                cp_Id_Domicilio: null,
                cp_Tel_Fijo: null,
                cp_Foto: null,
            }
        })
    }

    reseteo_domicilio() {
        this.setState({
            ...this.state.domicilio,
            domicilio: { //Si no hay hay Domicilio = casa pastoral en el mismo predio del Santuario: se resetean datos del Formulario
                hd_Id_Hogar: 0,
                dom_Tipo_Subdivision: "",
                pais_Id_Pais: "0",
                dom_Calle: "",
                dom_Numero_Exterior: "",
                dom_Numero_Interior: "",
                dom_Subdivision: "",
                dom_Localidad: "",
                dom_Municipio_Ciudad: "",
                est_Id_Estado: "0",
                dom_Codigo_Postal: "",
                dom_Telefono: "",
                nvoEstado: ""
            }
        })
    }

    cargarDomicilio() {
        this.setState({
            ...this.state.domicilio,
            domicilio: {
                dom_Tipo_Subdivision: this.state.domicilio.dom_Tipo_Subdivision,
                pais_Id_Pais: this.state.domicilio.pais_Id_Pais,
                dom_Calle: this.state.domicilio.dom_Calle,
                dom_Numero_Exterior: this.state.domicilio.dom_Numero_Exterior,
                dom_Numero_Interior: this.state.domicilio.dom_Numero_Exterior,
                dom_Subdivision: this.state.domicilio.dom_Subdivision,
                dom_Localidad: this.state.domicilio.dom_Localidad,
                dom_Municipio_Ciudad: this.state.domicilio.dom_Municipio_Ciudad,
                est_Id_Estado: this.state.domicilio.est_Id_Estado,
                dom_Codigo_Postal: this.state.domicilio.dom_Codigo_Postal,
                dom_Telefono: this.state.casaPastoral.cp_Tel_Fijo,
                nvoEstado: ""
            }
        })
    }

    habilitaEdicion = () => {
        this.setState({ boolHabilitaEdicion: !this.state.boolHabilitaEdicion })
    }

    cancelarEdicion = () => {
        this.setState({
            ...this.state.domicilio,
            domicilio: {
                hd_Id_Hogar: 0,
                dom_Calle: "",
                dom_Numero_Exterior: "",
                dom_Numero_Interior: "",
                dom_Tipo_Subdivision: "COL.",
                dom_Subdivision: "",
                dom_Localidad: "",
                dom_Municipio_Ciudad: "",
                est_Id_Estado: "0",
                pais_Id_Pais: "0",
                dom_Codigo_Postal: "",
                dom_Telefono: ""
            },
            hogarSeleccionado: "0",
            boolHabilitaEdicion: true
        })
    }

    getTemploConFoto = async () => {
        this.setState({
            mensajeDelProceso: "Procesando...",
            modalShow: true
        })


        await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/Templo/GetTemployDomicilioBySector/${localStorage.getItem('sector')}`)
            .then(res => {
                console.log("templo", res.santuarioConFoto);
                if (res.data.status === "success")
                    this.setState({
                        santuario: res.data.santuarioConFoto[0],
                        mensajeDelProceso: "",
                        modalShow: false

                    })
                else {
                    this.setState({ santuario: null })

                }
            })
        )
    }

    getCasaPastoral = async () => {
        await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/CasaPastoral/GetCasaPastoralyDomicilioBySector/${localStorage.getItem('sector')}`)
            .then(res => {
                console.log("respuesta", res.data);
                //console.log("domicilio", res.data.casaPastoralConDomicilio.domicilio);
                if (res.data.status === "success") {
                    this.setState({
                        casaPastoral: res.data.casaPastoralConDomicilio[0].casaPastoral,
                        domicilio: res.data.casaPastoralConDomicilio[0].domicilio,
                        direccion: res.data.casaPastoralConDomicilio[0].direccion
                    })
                }
                else if (res.data.status == "notFound") {
                    // this.setState({
                    //     casaPastoral: null,
                    //     domicilio: null,
                    // })
                    this.reseteo_casaPastoral();
                    this.reseteo_domicilio();
                }
            })
        )
    }

    handle_BtnFormularioAltaEdicionCasaPastoral = () => {

        //Se activa la variable de estado para que muestr el Dormulario de Actualización o Alta de Casa Pastoral
        this.setState({
            mostrarFormulario: true,
        })

        //Si no existía registo de Casa Pastoral, se inicializa la variable que activa el Botón de radio
        if (this.state.casaPastoral.cp_Id_CasaPastoral == 0) {
            this.setState({
                casaPastoral: {
                    ...this.state.casaPastoral,
                    cp_Mismo_Predio_Templo: true
                }
            })
        }

        //Si la Casa Pastoral no tenía registrado un domicilio diferente al del Santuario
        if (this.state.domicilio == null) {
            this.reseteo_domicilio();
        }
    }

    handleRadioChange = (event) => {
        const { name, value } = event.target;
        console.log("botón", name, value)
        this.setState((prevState) => ({
            casaPastoral: {
                ...prevState.casaPastoral,
                cp_Mismo_Predio_Templo: value === 'mismaUbicacion' ? true : false, // Convierte el valor de cadena a booleano
            },
        }));

        this.reseteo_domicilio()
    };

    onChangeCasaPastoral = async (e) => {

        if (this.state.propiedadDe_Invalid != "0" || this.state.propiedadDe_Invalid != null) {
            this.setState({ propiedadDe_Invalid: false })

        }


        this.setState({
            casaPastoral: {
                ...this.state.casaPastoral,
                [e.target.name]: e.target.value.toUpperCase()
            }
        })
    }


    onChangeDomicilio = async (e) => {

        if (e.target.name === "dom_Telefono") { //Si el elemento que cambio es Telefono, se va a grabar en el Objeto casaPastoral
            this.setState({
                casaPastoral: {
                    ...this.state.casaPastoral,
                    cp_Tel_Fijo: e.target.value
                }
            })
        }

        if (e.target.name === "pais_Id_Pais") { //Si el elemento que cambio es País, resetea el Id_Estado a '0 y el boolNvoEstado a 'false'.
            this.setState({
                domicilio: {
                    ...this.state.domicilio,
                    nvoEstado: "",
                    est_Id_Estado: "0",
                    pais_Id_Pais: e.target.value.toUpperCase(),
                },
                boolNvoEstado: false,
            })

            if (e.target.value == "66" || e.target.value == "151") {
                this.setState({ nvoEstado_Disponible: false })
            } else {
                this.setState({ nvoEstado_Disponible: true })
            }

            //manda traer los Estados de ese País.
            await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/Estado/GetEstadoByIdPais/${this.state.domicilio.pais_Id_Pais}`)
                .then(res => {
                    let contador = 0;
                    res.data.estados.forEach(estado => {
                        contador = contador + 1;
                    });

                    if (contador > 0) { //Si detecta que hay Estados para ese País, resetea el campo Estado para que elija un Estado nuevo.
                        this.setState({
                            boolNvoEstado: false,
                            domicilio: {
                                ...this.state.domicilio,
                                est_Id_Estado: "0",
                            }
                        })
                    }
                })
            )
        } else {//si el elemento que cambió es algun otro del Domicilio, lo graba en el Objeto "domicilio"
            this.setState({
                domicilio: {
                    ...this.state.domicilio,
                    [e.target.name]: e.target.value.toUpperCase()
                }
            })
        }



    }


    handleChangeEstado = (e) => {
        //console.log("Estado: ", e.target.name, e.target.value)
        if (e.target.value === "999") { //Si selecciona 'OTRO ESTADO'
            this.setState({
                boolNvoEstado: true,
                domicilio: {
                    ...this.state.domicilio,
                    est_Id_Estado: e.target.value
                }
            })
        }
        else { //Si se selecciona un Estado con Id valido
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

    handleBlurDomicilio = (e) => {
        this.setState({ //Carga el Objeto 'domicilio' con cada input que se va llenando desde lso componentes HogarPersonaDomicilio y PaisEstado.
            domicilio: {
                ...this.state.domicilio,
                [e.target.name]: e.target.value.toUpperCase().trim(),
            }
        })
    }

    enviarCasaPastoraConDomicilio = async (e) => {

        e.preventDefault();

        if (this.state.casaPastoral.cp_Mismo_Predio_Templo == false) {
            if (this.state.domicilio.pais_Id_Pais === "0"
                || this.state.domicilio.dom_Calle === ""
                || this.state.domicilio.dom_Municipio_Ciudad === ""
                || this.state.domicilio.est_Id_Estado === "0") {
                alert("Error!. Debe ingresar los Campos Obligatorios: Calle, Ciudad y País y Estado para un Nuevo Domicilio.")
                return false;
            }
            // if (this.state.casaPastoral.cp_Propiedad_De == "0" || this.state.casaPastoral.cp_Propiedad_De == null) {
            //     this.setState({ propiedadDe_Invalid: true })
            //     return false;
            // }
        }

        let objCasaPastoralConDomicilio = {
            domicilio: this.state.domicilio,
            casaPastoral: this.state.casaPastoral
        }

        if (this.state.domicilio.est_Id_Estado === "999") {//Si el Estado_Id = 999, indica que Seleccionó la opción Otro Estado para registrarlo. 
            if (this.state.domicilio.nvoEstado === "" || this.state.domicilio.nvoEstado === undefined) { //Si el País no tiene registrado algun Estado.
                alert("Error:\nEl País seleccionado no tiene Estados relacionados, por lo tanto, debe ingresar un nombre de Estado que desea Registrar.")
                //return false;
            }
            else { //Si nvoEstado trae algun Estado nuevo para Registrar, lo manda grabar
                console.log("NvoEstado: ", this.state.domicilio.nvoEstado)
                console.log("Pais: ", this.state.domicilio.pais_Id_Pais)
                console.log("Usuario: ", this.infoSesion.pem_Id_Ministro)
                try {
                    await helpers.validaToken().then(helpers.authAxios.post(`${helpers.url_api}/Estado/SolicitudNvoEstado/${this.state.domicilio.nvoEstado}/${this.state.domicilio.pais_Id_Pais}/${this.infoSesion.pem_Id_Ministro}`)
                        .then(res => {
                            this.setState({
                                domicilio: {
                                    ...this.state.domicilio,
                                    est_Id_Estado: res.data.estado.est_Id_Estado
                                }
                            })

                            let objCasaPastoralConDomicilio = {
                                domicilio: this.state.domicilio,
                                casaPastoral: this.state.casaPastoral
                            }

                            //manda los objetos casaPastoral y domicilio a la API para grabarse en BBDD.
                            helpers.validaToken().then(helpers.authAxios.post(`${helpers.url_api}/CasaPastoral/PostCasaPastoralConDomicilio/`, objCasaPastoralConDomicilio)
                                .then(res => {
                                    if (res.data.status === "success") {
                                        // alert(res.data.mensaje);
                                        setTimeout(() => { document.location.href = '/SantuarioyCasaPastoral'; }, 1000);
                                        this.setState({
                                            mensajeDelProceso: "Procesando...",
                                            modalShow: true
                                        });
                                        setTimeout(() => {
                                            this.setState({
                                                mensajeDelProceso: "Los datos fueron grabados satisfactoriamente."
                                            });
                                        }, 1000);
                                        setTimeout(() => {
                                            document.location.href = '/SantuarioyCasaPastoral'
                                        }, 1000);
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
                                        }, 1000);
                                    }
                                })
                            )
                        })
                    )
                }
                catch {
                    alert("Error: Hubo un problema en la comunicación con el Servidor. Intente mas tarde.");
                }
            }
        }
        else { //Si seleccionó un País que tenía Estados ya existentes, manda los objetos casaPastoral y domicilio a la API para grabarse en BBDD.
            console.log("ObjetoCasaPastoraldomicilio: ", objCasaPastoralConDomicilio)
            try {
                //console.log("Datos a API con EstadoId: ", `${helpers.url_api}/HogarDomicilio/${this.state.domicilio.hd_Id_Hogar}/${this.state.domicilio.nvoEstado}`, this.state.domicilio)
                await helpers.validaToken().then(helpers.authAxios.post(`${helpers.url_api}/CasaPastoral/PostCasaPastoralConDomicilio/`, objCasaPastoralConDomicilio)
                    .then(res => {
                        if (res.data.status === "success") {
                            // alert(res.data.mensaje);
                            setTimeout(() => { document.location.href = '/SantuarioyCasaPastoral'; }, 1000);
                            this.setState({
                                mensajeDelProceso: "Procesando...",
                                modalShow: true
                            });
                            setTimeout(() => {
                                this.setState({
                                    mensajeDelProceso: "Los datos fueron grabados satisfactoriamente."
                                });
                            }, 1000);
                            setTimeout(() => {
                                document.location.href = '/SantuarioyCasaPastoral'
                            }, 1000);
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
                            }, 1000);
                        }
                    })
                )
            }
            catch {
                alert("Error: Hubo un problema en la comunicacion con el servidor. Intente mas tarde.");
            }
        }
    }

    handle_Cancel() {
        document.location.href = '/SantuarioyCasaPastoral'
    }

    render() {
        return (
            <Container>
                {this.state.mostrarFormulario && //Si sí hay Casa Pastoral Registrada, se abre Formulario para Edición o Alta
                    <div>
                        <FormGroup>
                            <Form onSubmit={this.enviarCasaPastoraConDomicilio}>
                                <Card className="border-info">
                                    <CardHeader className='bg-info'>
                                        <h4 className="text-center pt-2">{this.state.casaPastoral.cp_Id_CasaPastoral === 0 ?
                                            <span>ALTA DE CASA PASTORAL</span> :
                                            <span>ACTUALIZACIÓN DE CASA PASTORAL</span>}</h4>
                                    </CardHeader>
                                    <CardBody>

                                        <Fragment>
                                            <Row className="my-2">
                                                <Col md='8'>
                                                    <fieldset className="row mb-2">
                                                        <legend className="col-form-label col-sm-8 pt-0"><strong>Ubicación de la Casa Pastoral</strong></legend>
                                                        <div className="col-sm-10">
                                                            <div className="form-check">
                                                                <input className="form-check-input" type="radio" name="gridRadios" id="gridRadios1" value="mismaUbicacion" onChange={this.handleRadioChange} checked={this.state.casaPastoral.cp_Mismo_Predio_Templo} />
                                                                <label className="form-check-label" for="gridRadios1">
                                                                    Está en el mismo predio que el Santuario
                                                                </label>
                                                            </div>
                                                            <div className="form-check">
                                                                <input className="form-check-input" type="radio" name="gridRadios" id="gridRadios2" value="diferenteUbicacion" onChange={this.handleRadioChange} checked={!this.state.casaPastoral.cp_Mismo_Predio_Templo} />
                                                                <label className="form-check-label" for="gridRadios2">
                                                                    Está en un predio diferente al del Santuario
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </fieldset>
                                                </Col>
                                                {!this.state.casaPastoral.cp_Mismo_Predio_Templo && //esta parte se abre sólo si la casa pastoral esta en diferente ubicación al Santuario
                                                    <Col md='4'>
                                                        <Label className='bold'> Propiedad de:</Label>
                                                        <Input
                                                            name="cp_Propiedad_De"
                                                            bsSize="sm"
                                                            type="select"
                                                            onChange={this.onChangeCasaPastoral}
                                                            value={this.state.casaPastoral.cp_Propiedad_De}
                                                            invalid={this.state.propiedadDe_Invalid}
                                                            disabled={true}
                                                        >
                                                            <option value="0">PENDIENTE</option>
                                                            <option value="DE LA IECE">DE LA IECE</option>
                                                            <option value="DE LA NACION">DE LA NACION</option>
                                                            <option value="DE PARTICULAR">DE PARTICULAR</option>
                                                            <option value="RENTADO">AJENO (RENTADO)</option>
                                                            <option value="PRESTADO">AJENO (PRESTADO)</option>
                                                        </Input>
                                                        <FormFeedback>Seleccione una opción válida</FormFeedback>
                                                    </Col>
                                                }
                                            </Row>
                                            {!this.state.casaPastoral.cp_Mismo_Predio_Templo && //esta parte se abre sólo si la casa pastoral esta en diferente ubicación al Santuario
                                                <React.Fragment>
                                                    <hr />
                                                    <Row><Col><h5 className='pb-3'>DOMICILIO DE LA CASA PASTORAL</h5></Col></Row>

                                                    <FormGroup>
                                                        <Row>
                                                            <Col xs="4">
                                                                <Input
                                                                    type="text"
                                                                    name="dom_Calle"
                                                                    value={this.state.domicilio.dom_Calle}
                                                                    onChange={this.onChangeDomicilio}
                                                                    onBlur={this.handleBlurDomicilio}
                                                                    readOnly={this.state.boolHabilitaEdicion}
                                                                />
                                                                <Label>Calle *</Label>
                                                                <FormFeedback>Este campo es obligatorio</FormFeedback>
                                                            </Col>
                                                            <Col xs="4">
                                                                <Input
                                                                    type="text"
                                                                    name="dom_Numero_Exterior"
                                                                    value={this.state.domicilio.dom_Numero_Exterior}
                                                                    onChange={this.onChangeDomicilio}
                                                                    onBlur={this.handleBlurDomicilio}
                                                                    readOnly={this.state.boolHabilitaEdicion}
                                                                />
                                                                <Label>Número Exterior</Label>
                                                            </Col>
                                                            <Col xs="4">
                                                                <Input
                                                                    type="text"
                                                                    name="dom_Numero_Interior"
                                                                    value={this.state.domicilio.dom_Numero_Interior}
                                                                    onChange={this.onChangeDomicilio}
                                                                    onBlur={this.handleBlurDomicilio}
                                                                    readOnly={this.state.boolHabilitaEdicion}
                                                                />
                                                                <Label>Número Interior</Label>
                                                            </Col>
                                                        </Row>
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Row>
                                                            <Col xs="4">
                                                                <Input
                                                                    type="select"
                                                                    name="dom_Tipo_Subdivision"
                                                                    value={this.state.domicilio.dom_Tipo_Subdivision}
                                                                    onChange={this.onChangeDomicilio}
                                                                    onBlur={this.handleBlurDomicilio}
                                                                    readOnly={this.state.boolHabilitaEdicion}

                                                                >
                                                                    <option value=""></option>
                                                                    <option value="COL.">COLONIA</option>
                                                                    <option value="FRACC.">FRACC.</option>
                                                                    <option value="EJ.">EJIDO</option>
                                                                    <option value="SUBDIV.">SUBDIV</option>
                                                                    <option value="BRGY.">BRGY</option>
                                                                    <option value="RANCHO">RANCHO</option>
                                                                    <option value="MANZANA">MANZANA</option>
                                                                    <option value="RESIDENCIAL">RESIDENCIAL</option>
                                                                    <option value="SECTOR">SECTOR</option>
                                                                    <option value="SECC.">SECCIÓN</option>
                                                                    <option value="UNIDAD">UNIDAD</option>
                                                                    <option value="BARRIO">BARRIO</option>
                                                                    <option value="ZONA">ZONA</option>
                                                                </Input>
                                                                <Label>Tipo de Asentamiento</Label>
                                                            </Col>
                                                            <Col xs="4">
                                                                <Input
                                                                    type="text"
                                                                    name="dom_Subdivision"
                                                                    value={this.state.domicilio.dom_Subdivision}
                                                                    onChange={this.onChangeDomicilio}
                                                                    onBlur={this.handleBlurDomicilio}
                                                                    readOnly={this.state.boolHabilitaEdicion}
                                                                />
                                                                <Label>Nombre del Asentamiento</Label>
                                                            </Col>
                                                            <Col xs="4">
                                                                <Input
                                                                    type="text"
                                                                    name="dom_Localidad"
                                                                    value={this.state.domicilio.dom_Localidad}
                                                                    onChange={this.onChangeDomicilio}
                                                                    onBlur={this.handleBlurDomicilio}
                                                                    readOnly={this.state.boolHabilitaEdicion}
                                                                    autoComplete='nope'
                                                                />
                                                                <Label>Localidad/Poblado</Label>
                                                            </Col>
                                                        </Row>
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Row>
                                                            <Col xs="4">
                                                                <Input
                                                                    type="text"
                                                                    name="dom_Municipio_Ciudad"
                                                                    value={this.state.domicilio.dom_Municipio_Ciudad}
                                                                    onChange={this.onChangeDomicilio}
                                                                    onBlur={this.handleBlurDomicilio}
                                                                    readOnly={this.state.boolHabilitaEdicion}
                                                                    autoComplete='nope'
                                                                />
                                                                <Label>Municipio/Ciudad *</Label>
                                                                <FormFeedback>Este campo es obligatorio</FormFeedback>
                                                            </Col>
                                                            <Col xs="4">
                                                                <Input
                                                                    type="text"
                                                                    name="dom_Codigo_Postal"
                                                                    value={this.state.domicilio.dom_Codigo_Postal}
                                                                    onChange={this.onChangeDomicilio}
                                                                    onBlur={this.handleBlurDomicilio}
                                                                    readOnly={this.state.boolHabilitaEdicion}
                                                                    autoComplete='nope'
                                                                />
                                                                <Label>Código Postal</Label>
                                                            </Col>
                                                            <Col xs="4">
                                                                <Input
                                                                    type="text"
                                                                    name="dom_Telefono"
                                                                    value={this.state.domicilio.dom_Telefono}
                                                                    onChange={this.onChangeDomicilio}
                                                                    onBlur={this.handleBlurDomicilio}
                                                                    readOnly={this.state.boolHabilitaEdicion}
                                                                    autoComplete='nope'
                                                                />
                                                                <Label>Teléfono de Casa</Label>
                                                            </Col>
                                                            {/* <Col xs="4">
                                                            <Input
                                                                type="text"
                                                                name="hd_Activo"
                                                                value={this.state.domicilio.hd_Activo ? "SI" : "NO"}
                                                                readOnly={true}
                                                            />
                                                            <Label>Activo</Label>
                                                        </Col> */}
                                                        </Row>
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Row>
                                                            <PaisEstado
                                                                domicilio={this.state.domicilio}
                                                                onChangeDomicilio={this.onChangeDomicilio}
                                                                onBlurDomicilio={this.handleBlurDomicilio}
                                                                boolNvoEstado={this.state.boolNvoEstado}
                                                                handleChangeEstado={this.handleChangeEstado}
                                                                nvoEstado_Disponible={this.state.nvoEstado_Disponible}
                                                                readOnly={this.state.boolHabilitaEdicion}
                                                            />
                                                        </Row>
                                                    </FormGroup>
                                                </React.Fragment>
                                            }
                                        </Fragment>

                                    </CardBody>
                                    <CardFooter className="text-right pb-3">

                                        <Button
                                            style={{ margin: '8px' }}
                                            color="secondary"
                                            onClick={this.handle_Cancel}
                                        > Cancelar
                                        </Button>
                                        <Button
                                            type="onsubmit"
                                            style={{ margin: '8px' }}
                                            color="primary"
                                        //onClick={this.handle_BtnFormularioAltaEdicionCasaPastoral}
                                        >
                                            {this.state.casaPastoral.cp_Id_CasaPastoral === 0 ?
                                                <span>Proceder con la Alta</span> :
                                                <span>Proceder con la Edición</span>
                                            }
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </Form>
                        </FormGroup>

                    </div>
                }


                {/* //INICIA PANTALLA PRINCIPAL */
                    !this.state.mostrarFormulario &&
                    (
                        <Fragment>
                            <div >
                                <FormGroup>
                                    <Row>
                                        <Col xs="12">
                                            <Alert color="warning">
                                                <strong>AVISO: </strong>
                                                <ul>
                                                    <li>Las actualizaciones del Santuario serán realizados por la Dirección General en coordinación con el Departamento Legal. Si hubiere algún dato del Santuario que el Pastor desee actualizar, favor de enviar la solicitud con la descripción del cambio al correo <strong>soporte@iece.mx</strong>.</li>
                                                    <li>Si no se muestra la foto del Santuario, favor de enviarla correo <strong>soporte@iece.mx</strong> para completar el registro. La fotografía debe ser tomada de día y procurando que no aparezcan vehículos o personas, solo el Santuario.</li>
                                                    <li>El dato <strong>'Propiedad de'</strong> relacionado al propietario o dueño del Templo y de la Casa Pastoral será registrado y actualizado por la Dirección General y el Apoderado Legal </li>
                                                    <li>Si no hay Casa Pastoral registrada, pero sí existe una en el Sector, favor de darla de Alta presionando el botón <strong>"Alta de Casa Pastoral"</strong>. Si hubiere algún dato que el Pastor desee actualizar de la Casa Pastoral, puede hacerlo presionando el botón "Editar Casa Pastoral".</li>
                                                </ul>
                                            </Alert>
                                        </Col>
                                    </Row>
                                </FormGroup>
                            </div>



                            <FormGroup>
                                <Card className="border-info">
                                    <CardHeader className='bg-info'>
                                        <h4 className="text-center pt-2">SANTUARIO</h4>
                                    </CardHeader>
                                    <CardBody>
                                        {this.state.santuario.templo ?
                                            <div className='container'>
                                                <Row >
                                                    <Col md='4'></Col>
                                                    <Col className=''>
                                                        <img className='img-thumbnail' src={`data:${this.state.santuario.MIMEType};base64,${this.state.santuario.foto}`} alt="Imagen de templo" type="image/jpg" ></img>
                                                    </Col>
                                                    <Col md='4'></Col>
                                                </Row>

                                                <Row className="my-2">
                                                    <Col md='4' >
                                                        <Label> Tipo de Santuario</Label>
                                                        <Input bsSize="sm" type="text" value={this.state.santuario.tem_Tipo_Templo} />
                                                    </Col>
                                                    <Col md='4'>
                                                        <Label> Propiedad de:</Label>
                                                        <Input bsSize="sm" type="text" value={this.state.santuario.tem_Propiedad_De ? this.state.santuario.tem_Propiedad_De : "PENDIENTE"} readOnly="true" />
                                                    </Col>
                                                    <Col md='4'>
                                                        <Label> Aforo:</Label>
                                                        <Input bsSize="sm" type="text" value={this.state.santuario.tem_Aforo} />
                                                    </Col>
                                                </Row>
                                                <Row className="my-2">
                                                    <Col md='9'>
                                                        <Label> Domicilio:</Label>
                                                        <Input bsSize="sm" type="text" value={this.state.santuario.domicilio} />
                                                    </Col>
                                                    <Col md='3'>
                                                        <Label className='bold'> Teléfono Fijo:</Label>
                                                        <Input bsSize="sm" type="text" value={this.state.santuario.telFijo} />
                                                    </Col>
                                                </Row>
                                            </div> :
                                            <div>
                                                <h4 className='text-center'>No hay Templo Registrado. Envíe información del Santuario a la Dirección General.</h4>
                                            </div>
                                        }
                                    </CardBody>
                                </Card>
                            </FormGroup>
                            <FormGroup>
                                <Card className="border-info">
                                    <CardHeader className='bg-info'>
                                        <h4 className="text-center pt-2">CASA PASTORAL</h4>
                                    </CardHeader>
                                    <CardBody>
                                        {this.state.casaPastoral.cp_Id_CasaPastoral !== 0 ?
                                            <Fragment>
                                                <Row className="my-2">
                                                    <Col md='8'>
                                                        <fieldset className="row mb-2">
                                                            <legend className="col-form-label col-sm-8 pt-0"><strong>Ubicación de la Casa Pastoral</strong></legend>
                                                            <div className="col-sm-10">
                                                                <div className="form-check">
                                                                    <input className="form-check-input" type="radio" name="gridRadios" id="gridRadios1" value="option1" checked={this.state.casaPastoral.cp_Mismo_Predio_Templo === true} />
                                                                    <label className="form-check-label" htmlFor="gridRadios1">
                                                                        Está en el mismo predio que el Santuario
                                                                    </label>
                                                                </div>
                                                                <div className="form-check">
                                                                    <input className="form-check-input" type="radio" name="gridRadios" id="gridRadios2" value="option2" checked={this.state.casaPastoral.cp_Mismo_Predio_Templo === false} />
                                                                    <label className="form-check-label" htmlFor="gridRadios2">
                                                                        Está en un predio diferente al del Santuario
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </fieldset>
                                                    </Col>
                                                    {!this.state.casaPastoral.cp_Mismo_Predio_Templo &&
                                                        <Col md='4'>
                                                            <Label className='bold'> Propiedad de:</Label>
                                                            <Input
                                                                name="cp_Propiedad_De"
                                                                bsSize="sm"
                                                                type="select"
                                                                onChange={this.onChangeCasaPastoral}
                                                                value={this.state.casaPastoral.cp_Propiedad_De}
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
                                                {!this.state.casaPastoral.cp_Mismo_Predio_Templo &&
                                                    <Row className="my-2">
                                                        <Col md='9'>
                                                            <Label> Domicilio:</Label>
                                                            <Input bsSize="sm" type="text" value={this.state.direccion} />
                                                        </Col>
                                                        <Col md='3'>
                                                            <Label className='bold'> Teléfono Fijo:</Label>
                                                            <Input bsSize="sm" type="text" value={this.state.casaPastoral.cp_Tel_Fijo} />
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
                                    <CardFooter className="text-right pb-3">

                                        <Button
                                            style={{ margin: '8px' }}
                                            color="primary"
                                            onClick={this.handle_BtnFormularioAltaEdicionCasaPastoral}
                                        >
                                            {this.state.casaPastoral.cp_Id_CasaPastoral !== 0 ?
                                                <span>Editar Casa Pastoral</span> : //Si sí hay Casa Pastoral
                                                <span>Alta de Casa Pastoral</span> //Si no hay casa Pastoral
                                            }
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </FormGroup>
                        </Fragment>
                    )}


                <Modal isOpen={this.state.modalShow}>
                    <ModalBody>
                        Procesando...
                    </ModalBody>
                </Modal>
            </Container >
        );
    }
}

export default SantuarioyCasaPastoral;