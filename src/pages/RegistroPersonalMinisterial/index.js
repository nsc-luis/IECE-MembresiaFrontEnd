import React, { Component, Fragment } from 'react';
import helpers from "../../components/Helpers";
import {
    Container, Button, Input, Modal, ModalBody, Label, Alert, CardFooter,
    CardTitle, Card, CardBody, Table, Row, Col, FormFeedback, Form, FormGroup, CardHeader, ModalHeader, ModalFooter
} from 'reactstrap';
import { Link } from 'react-router-dom';
import './style.css';

let dto = (JSON.parse(localStorage.getItem("dto")))
let sector = JSON.parse(localStorage.getItem("sector"))

export default class RegistroPersonalMinisterial extends Component {

    infoSesion = JSON.parse(localStorage.getItem('infoSesion'));
    constructor(props) {
        super(props);
        this.state = {
            form: {},
            formBaja: {},
            modal_Procesando: false,
            modal_Confirmacion: false,
            modal_Confirmacion_Baja: false,
            pem_Id_Ministro: "0",
            sec_Id_Sector: localStorage.getItem("sector"),
            idUsuario: this.infoSesion.pem_Id_Ministro,
            puesto: "0",
            varonesSector: [],
            personalMinisterial: [],
            personas: [],
            personalMinisterialVinculado: [],
            tipoRegistro: "NuevoElemento",
            fechaTransaccion: "",
            pem_Id_MinistroInvalido: false,
            puestoInvalido: false,
            mostrarFormulario: false,
            mostrarFormularioBaja: false,
            mostrarBtnAltaBaja: true,
            submitBtnDisable: false,
        }
    }

    inicializarVariables = () => {
        console.log("Inicializando Variables")
        this.setState({
            pem_Id_Ministro: "0",
            sec_Id_Sector: localStorage.getItem("sector"),
            idUsuario: this.infoSesion.pem_Id_Ministro,
            puesto: "0",
            pem_Id_MinistroInvalido: false,
            puestoInvalido: false,
            submitBtnDisable: false,
            form: {
                ...this.state.form,
                id_Persona: "0",
                id_Ministro: "0",
                nombre_Persona: "",
                nombre_Elemento: "",
                sec_Id_Sector: localStorage.getItem("sector"),
                usu_Id_Usuario: JSON.parse(localStorage.getItem('infoSesion')).pem_Id_Ministro,
                fechaTransaccion: ""
            },
            formBaja: {
                ...this.state.formBaja,
                id_Ministro: "0",
                nombre_Elemento: "",
                sec_Id_Sector: localStorage.getItem("sector"),
                usu_Id_Usuario: JSON.parse(localStorage.getItem('infoSesion')).pem_Id_Ministro,
                causaDeBaja: "0",
                fechaTransaccion: ""
            }
        })
    }

    componentDidMount() {
        this.getPersonalMinisterialBySector();
        this.CargaVariablesParaAlta();
        //Sube el cursor hasta la parte superior
        window.scrollTo(0, 0);

    }

    getPersonalMinisterialBySector = async () => {
        await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/PersonalMinisterial/GetPersonalMinisterialBySector/${localStorage.getItem('sector')}`)
            .then(res => {
                if (res.data.status === "success")
                    this.setState({ personalMinisterialVinculado: res.data.administrativo })
                else {
                    alert("Error:\nNo se pudo consultar la lista de personas, favor de reportar o intentar mas tarde.")
                }
            })
        )
    }

    onChange = (e) => {
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        })

        if (e.target.name == "id_Persona" && e.target.value != "0") {

            let persona = this.state.varonesSector.filter((person) => person.per_Id_Persona == e.target.value);
            console.log("lista", persona)
            this.setState({
                form: {
                    ...this.state.form,
                    [e.target.name]: e.target.value,
                    nombre_Persona: persona[0].per_Nombre + " " + persona[0].per_Apellido_Paterno + (persona[0].per_Apellido_Materno ? " " + persona[0].per_Apellido_Materno : "")

                }
            })
        }

        if (e.target.name == "id_Ministro" && e.target.value != "0") {

            let ministro = this.state.personalMinisterial.filter((person) => person.pem_Id_Ministro == e.target.value);
            console.log("lista", ministro)
            this.setState({
                form: {
                    ...this.state.form,
                    [e.target.name]: e.target.value,
                    nombre_Elemento: ministro[0].pem_Nombre,
                    tipoRegistro: "ElementoExistente"
                }
            })
        } else if (e.target.name == "id_Ministro" && e.target.value == "0") {
            this.setState({
                form: {
                    ...this.state.form,
                    [e.target.name]: e.target.value,
                    tipoRegistro: "ElementoExistente"
                }
            })
        }
    }

    onChangeBaja = (e) => {
        this.setState({
            formBaja: {
                ...this.state.formBaja,
                [e.target.name]: e.target.value
            }
        })

        if (e.target.name == "id_Ministro" && e.target.value != "0") {

            let ministro = this.state.personalMinisterialVinculado.filter((person) => person.pem_Id_Ministro == e.target.value);
            console.log("lista", ministro)
            this.setState({
                formBaja: {
                    ...this.state.formBaja,
                    [e.target.name]: e.target.value,
                    nombre_Elemento: ministro[0].pem_Nombre,
                }
            })
        }
    }

    quitarAcentos(cadena) {
        return cadena.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    existeMinistro(persona) {
        return this.state.personalMinisterial.some(elemento =>
            this.quitarAcentos(elemento.pem_Nombre) === persona)
    }

    CargaVariablesParaAlta = () => {
        //Para sesión de Obispo
        if (sector == null) {


        } else { //Para sesión de Pastor
            helpers.authAxios.get("/PersonalMinisterial/GetPersonaCuyoIdPersonaNoEstaEnPersonalMinisterialBySector/" + sector)
                .then(res => {
                    console.log("varones: ", res.data.personas)
                    this.setState({ varonesSector: res.data.personas })
                });

            helpers.authAxios.get("/PersonalMinisterial/GetPersonalMinisterialSinIdMiembroByDistrito/" + dto)
                .then(res => {
                    this.setState({ personalMinisterial: res.data.personalSinVincularConPersona })
                });

            this.getAuxiliaresPorSector();
        }
    }

    getAuxiliaresPorSector = async () => {
        await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/PersonalMinisterial/GetAuxiliaresBySector2/${JSON.parse(localStorage.getItem("sector"))}`)
            .then(res => {
                if (res.data.status === "success")
                    this.setState({ auxiliares: res.data.auxiliares })
                else {
                    alert("Error:\nNo se pudo consultar la lista de auxiliares, favor de reportar o intentar mas tarde.")
                }
            })
        )
    }

    handle_BtnAsignarMostrarFormulario = () => {
        this.setState({
            mostrarFormulario: !this.state.mostrarFormulario,
            mostrarFormularioBaja: false,
            mostrarBtnAltaBaja: !this.state.mostrarBtnAltaBaja
        })

        this.inicializarVariables();
    }

    handle_BtnAsignarMostrarFormularioBaja = () => {
        this.setState({
            mostrarFormulario: false,
            mostrarFormularioBaja: !this.state.mostrarFormularioBaja,
            mostrarBtnAltaBaja: !this.state.mostrarBtnAltaBaja
        })

        this.inicializarVariables();
    }


    enviarInfo = async (e) => {
        e.preventDefault()
        let info = {
            pem_Id_Ministro: this.state.pem_Id_Ministro,
            sec_Id_Sector: this.state.sec_Id_Sector,
            idUsuario: this.infoSesion.pem_Id_Ministro,
            puesto: this.state.puesto
        }

        console.log("info: ", info)
        if (this.state.pem_Id_Ministro === "0") {
            this.setState({
                pem_Id_MinistroInvalido: true
            })
            return false
        }

        if (this.state.puesto === "0") {
            this.setState({
                puestoInvalido: true
            })
            return false
        }

        // Envía el formulario si no hay errores
        this.setState({ submitBtnDisable: true });
        await helpers.validaToken().then(helpers.authAxios.post(`${helpers.url_api}/PersonalMinisterial/SetPersonalAdministrativoBySector`, info)
            .then(res => {
                if (res.data.status === "success") {
                    this.getPersonalAdministrativoBySector()
                    this.setState({
                        pem_Id_MinistroInvalido: false,
                        puestoInvalido: false,
                        pem_Id_Ministro: "0",
                        puesto: "0"
                    })
                }
            })
        )
        this.handle_BtnAsignarMostrarFormulario()
    }

    enviar1 = () => {
        if (this.state.form.id_Persona === "0") {
            alert("Error!. Debe seleccionar primero a Persona que desea vincular o registrar como elemento del Personal Ministerial")
            return false;
        }
        if (this.state.form.fechaTransaccion === "") {
            alert("Error!. Debe seleccionar la fecha del Alta del Elemento del Personal Ministerial")
            return false;
        }


        if (this.state.form.id_Ministro === "0") {//Si No eligió ningun elemento ya registrado en Personal Ministerial y desea Registrarlo como Nuevo.
            if (this.existeMinistro(this.state.form.nombre_Persona) === true) {
                alert("Notificación: Esta persona ya aparece como parte del Personal Ministerial, búsquelo en la caja de selección del Personal Ministerial del Distrito.")
                return false;
            }

            this.setState({
                modal_Confirmacion: true,
                tipoRegistro: "NuevoElemento"
            })
        } else {//Si eligió algun elemento que ya está registrado en Personal Ministerial y solo desea vincularlo.
            this.setState({
                modal_Confirmacion: true,
                tipoRegistro: "ElementoExistente"
            })
        }
    }

    enviarBaja = () => {
        console.log("Causa: ", this.state.formBaja.causaDeBaja)
        if (this.state.formBaja.id_Ministro === "0") {
            alert("Error!. Debe seleccionar primero al Elemento que desea dar de baja del Personal Ministerial ")
            return false;
        }

        if (this.state.formBaja.fechaTransaccion === "") {
            alert("Error!. Debe seleccionar la fecha de la Baja del Elemento del Personal Ministerial")
            return false;
        }

        if (this.state.formBaja.causaDeBaja == "0") {
            alert("Error!. Debe seleccionar la Causa de baja del Personal Ministerial ")
            return false;
        }

        this.setState({
            modal_Confirmacion_Baja: true,
        })
    }

    closemodal_Confirmacion = () => {
        this.setState({ modal_Confirmacion: false })
    }

    closemodal_Confirmacion_Baja = () => {
        this.setState({ modal_Confirmacion_Baja: false })
    }



    ChangeSubmitBtnDisable = (bol) => {//Sirve para evitar multiples registros por dobleclick en botón Submit
        this.setState({ submitBtnDisable: bol });
    }

    handleContinue = async () => {
        // Cierra el Modal de COnfirmación y continua
        this.closemodal_Confirmacion();
        //Desabilita el Botón para evitar multiple ejecución por Clicks repetidos
        this.ChangeSubmitBtnDisable(true)

        this.setState({
            mensajeDelProceso: "Procesando...",
            modal_Procesando: true
        });
        //Procede a vincular o incorporar a la persona como parte del Personal Ministerial
        helpers.validaToken().then(helpers.authAxios.post(`${helpers.url_api}/PersonalMinisterial/AddPersonalMinisterial`, this.state.form)
            .then(res => {
                if (res.data.status === "success") {
                    setTimeout(() => {
                        this.setState({
                            mensajeDelProceso: "Los datos fueron grabados satisfactoriamente."
                        });
                    }, 1000);
                    setTimeout(() => {
                        document.location.href = '/RegistroPersonalMinisterial'
                    }, 2000);
                }
                else {
                    this.setState({
                        mensajeDelProceso: "Procesando...",
                        modal_Procesando: true
                    });
                    setTimeout(() => {
                        this.setState({
                            mensajeDelProceso: res.data.mensaje,
                            modal_Procesando: false
                        });
                    }, 1500);
                    alert(`Error: \n${res.data.mensaje}`);
                }
            })
        );
    };

    handleContinue_Baja = async () => {
        // Cierra el Modal de COnfirmación y continua
        this.closemodal_Confirmacion_Baja();
        //Desabilita el Botón para evitar multiple ejecución por Clicks repetidos
        this.ChangeSubmitBtnDisable(true)

        this.setState({
            mensajeDelProceso: "Procesando...",
            modal_Procesando: true
        });
        //Procede a vincular o incorporar a la persona como parte del Personal Ministerial
        helpers.validaToken().then(helpers.authAxios.post(`${helpers.url_api}/PersonalMinisterial/BajaDeAuxiliar`, this.state.formBaja)
            .then(res => {
                if (res.data.status === "success") {
                    setTimeout(() => {
                        this.setState({
                            mensajeDelProceso: "Los datos fueron grabados satisfactoriamente."
                        });
                    }, 1000);
                    setTimeout(() => {
                        document.location.href = '/RegistroPersonalMinisterial'
                    }, 2000);
                }
                else {
                    this.setState({
                        mensajeDelProceso: "Procesando...",
                        modal_Procesando: true
                    });
                    setTimeout(() => {
                        this.setState({
                            mensajeDelProceso: res.data.mensaje,
                            modal_Procesando: false
                        });
                    }, 1500);
                    alert(`Error: \n${res.data.mensaje}`);
                }
            })
        );
    };


    removerAsignacion = async (info) => {
        console.log("objeto a Borrar: ", info)
        await helpers.validaToken().then(helpers.authAxios.post(`${helpers.url_api}/PersonalMinisterial/RemoverAsignacionDeAdministracion/${localStorage.getItem("sector")}/${info.cargo}`)
            .then(res => {
                if (res.data.status === "success") {
                    this.getPersonalAdministrativoBySector()
                    this.setState({
                        pem_Id_MinistroInvalido: false,
                        puestoInvalido: false,
                        pem_Id_Ministro: "0",
                        puesto: "0"
                    })
                }
            })
        )
    }



    render() {
        return (
            <Container>

                {this.state.mostrarBtnAltaBaja &&
                    <div >
                        <FormGroup>
                            <Row>
                                <Col xs="12">
                                    <Alert color="warning">
                                        <strong>AVISO: </strong>
                                        <ul>
                                            <li>Para dar de Alta a un Nuevo Elemento, presione el Botón <strong>"Alta de Personal"</strong>.</li>
                                            <li>Para dar de Baja a algún Auxiliar, seleccione el Botón <strong>"Baja de Personal"</strong>.</li>
                                            <li>Si no aparece la foto de algún Elemento del Personal Ministerial, envíela al correo <strong>soporte@iece.mx</strong>. La fotografía debe ser con fondo blanco y el Elemento con atuendo oficial y buena presentación.</li>
                                        </ul>
                                    </Alert>
                                </Col>
                            </Row>
                        </FormGroup>

                        <FormGroup className="text-right pb-3">
                            <Button
                                style={{ margin: '8px' }}
                                color="danger"
                                onClick={this.handle_BtnAsignarMostrarFormularioBaja}
                            >
                                Baja de Personal
                            </Button>
                            <Button
                                style={{ margin: '8px' }}
                                color="primary"
                                onClick={this.handle_BtnAsignarMostrarFormulario}
                            >
                                Alta de Personal
                            </Button>
                        </FormGroup>
                    </div>
                }


                {this.state.mostrarFormulario &&
                    <FormGroup>
                        <Card className="card" id="pdf">
                            <CardTitle className="text-center card-header text-gray-900" tag="h3">
                                <Row className="text-center text-gray-900">

                                    <Col>
                                        ALTA DEL PERSONAL MINISTERIAL
                                    </Col>
                                </Row>
                            </CardTitle>
                            <CardBody>
                                <Alert color="success" className="alertLogin">
                                    <strong>Nota para incorporar un Elemento al Personal Ministerial en este Sector: </strong>

                                    <ul>
                                        <br></br>
                                        <li>Es posible que la persona que desea dar de Alta como Personal Ministerial ya esté registrada en la Base de Datos del Personal Ministerial que se tiene en la Dirección General, si así fuere,
                                            aparecerá en la Segunda caja de selección y sólo será necesario Vincular el ID de Membresía con el Id que tiene como Personal Ministerial.
                                            <br></br>
                                            <ul>
                                                <li>Si la persona que desea dar de Alta se encuentra en la Segunda Caja de Selección, Selecciónelo.
                                                    En este caso sólo se requiere <strong>Vincular</strong> los IDs correspondientes.</li>
                                                <li>Si la persona que desea dar de Alta NO se encuentra en la Segunda Caja de Selección, elija la Opción <strong>"NUEVO ELEMENTO"</strong> para darlo de Alta como parte del Personal Ministerial. </li>
                                                <li>Sólo se podrá dar de Alta como Nuevo Elemento a <strong>"AUXILIARES"</strong>, los demás Grados Ministeriales son registrados por Secretaría General.</li>
                                            </ul>
                                        </li>
                                    </ul>
                                </Alert>

                            </CardBody>
                        </Card>

                        <Card className="card mt-3" id="pdf">
                            <CardBody>
                                <>
                                    <Row className=' mb-3'>
                                        <div className="col col-md-1"></div>
                                        <div className="col col-md-6">
                                            <label><h6>PASO 1.- Seleccione la persona a Incorporar al Personal Ministerial</h6></label>
                                        </div>
                                        <div className="col col-md-4">
                                            <Input
                                                type="select"
                                                name="id_Persona"
                                                onChange={this.onChange}
                                                className="form-control "
                                                value={this.state.form.id_Persona}
                                            >
                                                <option value="0">SELECCIONE LA PERSONA</option>
                                                {this.state.varonesSector.map((persona) => {
                                                    return <React.Fragment key={persona.per_Id_Persona}>
                                                        <option value={persona.per_Id_Persona}> {persona.per_Nombre} {persona.per_Apellido_Paterno} {persona.per_Apellido_Materno}</option>
                                                    </React.Fragment>
                                                }
                                                )}
                                            </Input>
                                        </div>
                                        <div className="col col-md-1"></div>
                                    </Row>

                                    <Row className='mb-2'>
                                        <div className="col col-md-1"></div>
                                        <div className="col col-md-6">
                                            <label ><h6>PASO 2.- Revise en esta Segunda caja de opciones y, si encuentra a la persona que desea incorporar al Personal Ministerial,
                                                Seleccionelo para confirmar que es la misma persona y Vincularlo. Si no se encuentra en la lista, elija "NUEVO ELEMENTO"</h6></label>
                                        </div>
                                        <div className="col col-md-4">
                                            <Input type="select"
                                                name="id_Ministro"
                                                onChange={this.onChange}
                                                className="form-control "
                                                value={this.state.form.id_Ministro}
                                            >
                                                <option value="0">NUEVO ELEMENTO</option>
                                                {this.state.personalMinisterial.map((min) => {
                                                    return <React.Fragment key={min.pem_Id_Ministro}>
                                                        <option value={min.pem_Id_Ministro}>
                                                            {min.pem_Nombre}
                                                        </option>
                                                    </React.Fragment>
                                                }
                                                )}
                                            </Input>
                                        </div>
                                        <div className="col col-md-1"></div>
                                    </Row>

                                    <Row className='mb-3'>
                                        <div className="col col-md-1"></div>
                                        <Col xs="6">
                                            <h6>PASO 3.- Indique la Fecha del Alta o Vinculación:</h6>
                                        </Col>
                                        <Col xs="2">
                                            <Input
                                                type="date"
                                                name="fechaTransaccion"
                                                placeholder='DD/MM/AAAA'
                                                onChange={this.onChange}
                                                value={this.state.form.fechaTransaccion}
                                                title="Si es Alta de un Nuevo Personal, indique la fecha en que inició como auxiliar el Nuevo Elemento
                                            Si es Vinculación de un elemento ya existente, indique la fecha actual."
                                            />
                                            <FormFeedback>Este campo es requerido</FormFeedback>
                                        </Col>
                                        <div className="col col-md-1"></div>
                                    </Row>

                                    <CardFooter className='mt-3'>
                                        <Row className='mt-3'>
                                            <Col className="col-md-7"></Col>
                                            <Col className=" col-md-2 text-right">
                                                <Button className="btn-secondary ml-auto" onClick={this.handle_BtnAsignarMostrarFormulario}>
                                                    Cancelar
                                                </Button>
                                            </Col>
                                            <Col className=" col-md-2 text-right">
                                                <Button className="btn-success ml-auto" onClick={this.enviar1} disabled={this.submitBtnDisable}>
                                                    {(this.state.form.id_Ministro === "0") ? (<>Registrar</>) : (<>Vincular</>)}
                                                </Button>
                                            </Col>
                                            <Col className="col-md-1"></Col>
                                        </Row>
                                    </CardFooter>
                                </>
                            </CardBody>
                        </Card>
                    </FormGroup>
                }

                {this.state.mostrarFormularioBaja &&
                    <FormGroup>
                        <Card className="card" id="pdf">
                            <CardTitle className="text-center card-header text-gray-900" tag="h3">
                                <Row className="text-center text-gray-900">

                                    <Col>
                                        BAJA DEL PERSONAL MINISTERIAL (AUXILIARES)
                                    </Col>
                                </Row>
                            </CardTitle>
                            <CardBody>
                                <Alert color="warning" className="alertLogin">
                                    <strong>Nota: </strong>
                                    <ul>
                                        <li>Sólo puede dar de Baja a <strong>Auxiliares</strong> que aparecen en esta Pantalla</li>
                                    </ul>
                                </Alert>

                            </CardBody>
                        </Card>

                        <Card className="card" id="pdf">
                            <CardBody>
                                <>
                                    <Row className=' mb-5'>
                                        <div className="col col-md-1"></div>
                                        <div className="col col-md-6">
                                            <label><h6>Seleccione el Elemento a dar de Baja del Personal Ministerial:</h6></label>
                                        </div>
                                        <div className="col col-md-4">
                                            <Input
                                                type="select"
                                                name="id_Ministro"
                                                onChange={this.onChangeBaja}
                                                className="form-control "
                                                value={this.state.formBaja.id_Ministro}
                                            >
                                                <option value="0">SELECCIONE LA PERSONA</option>
                                                {this.state.personalMinisterialVinculado.filter(x => x.pem_Grado_Ministerial === "AUXILIAR" || x.pem_Grado_Ministerial === "DIÁCONO A PRUEBA").map((persona) => {
                                                    return <React.Fragment key={persona.pem_Id_Ministro}>
                                                        <option value={persona.pem_Id_Ministro}> {persona.pem_Nombre} </option>
                                                    </React.Fragment>
                                                }
                                                )}
                                            </Input>
                                        </div>
                                        <div className="col col-md-1"></div>
                                    </Row>

                                    <Row className=' mb-5'>
                                        <div className="col col-md-1"></div>
                                        <div className="col col-md-6">
                                            <label><h6>Causa de la Baja del Auxiliar:</h6></label>
                                        </div>
                                        <div className="col col-md-4">
                                            <Input
                                                type="select"
                                                name="causaDeBaja"
                                                onChange={this.onChangeBaja}
                                                className="form-control "
                                                value={this.state.formBaja.causaDeBaja}
                                            >
                                                <option value="0">ELIJA UNA CAUSA</option>
                                                <option value="DEFUNCIÓN">DEFUNCIÓN</option>
                                                <option value="CESE">CESE</option>
                                                <option value="CESE Y EXCOMUNIÓN">CESE Y EXCOMUNIÓN</option>
                                                <option value="RENUNCIA AL MINISTERIO">RENUNCIA AL MINISTERIO</option>
                                                <option value="SUSPENCION TEMPORAL DEL MINISTERIO">SUSPENCION TEMPORAL DEL MINISTERIO</option>
                                            </Input>
                                        </div>
                                        <div className="col col-md-1"></div>
                                    </Row>

                                    <Row className=' mb-3'>
                                        <div className="col col-md-1"></div>
                                        <Col xs="6">
                                            <h6>Fecha de transacción:</h6>
                                        </Col>
                                        <Col xs="3">
                                            <Input
                                                type="date"
                                                name="fechaTransaccion"
                                                placeholder='DD/MM/AAAA'
                                                onChange={this.onChangeBaja}
                                                value={this.state.formBaja.fechaTransaccion}
                                            />
                                            <FormFeedback>Este campo es requerido</FormFeedback>
                                        </Col>
                                        <div className="col col-md-4"></div>
                                    </Row>
                                </>
                            </CardBody>

                            <CardFooter>
                                <Row className='mt-3'>
                                    <Col className="col-md-7"></Col>
                                    <Col className=" col-md-2 text-right">
                                        <Button className="btn-secondary ml-auto" onClick={this.handle_BtnAsignarMostrarFormularioBaja}>
                                            Cancelar
                                        </Button>
                                    </Col>
                                    <Col className=" col-md-2 text-right">
                                        <Button className="btn-danger ml-auto" onClick={this.enviarBaja} disabled={this.submitBtnDisable}>
                                            Dar de Baja
                                        </Button>
                                    </Col>
                                    <Col className="col-md-1"></Col>
                                </Row>

                            </CardFooter>

                        </Card>


                    </FormGroup>

                }

                <FormGroup>
                    <Card className="border-info">
                        <CardTitle>
                            <h4 className="text-center pt-4">ANCIANOS</h4>
                        </CardTitle>
                        <CardBody>
                            <Table id="miTabla" className="table table-striped table-bordered table-sm bt-0">
                                <thead className="text-center bg-gradient-info">
                                    <th width="35%">NOMBRE</th>
                                    <th width="20%">GRADO</th>
                                    <th width="15%">FOTO</th>
                                </thead>
                                <tbody>
                                    {this.state.personalMinisterialVinculado.filter(x => x.pem_Grado_Ministerial === "ANCIANO").map((obj, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{obj.pem_Nombre}</td>
                                                <td><b>{obj.pem_Grado_Ministerial}</b></td>
                                                <td><img style={{ width: '50px', height: '50px' }} src={`data:${obj.MIMEType};base64,${obj.imagen}`} alt="Imagen de ministro" type="image/jpg"></img></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                </FormGroup>
                <FormGroup>
                    <Card className="border-info">
                        <CardTitle>
                            <h4 className="text-center pt-4">DIÁCONOS</h4>
                        </CardTitle>
                        <CardBody>
                            <Table id="miTabla" className="table table-striped table-bordered table-sm bt-0">
                                <thead className="text-center bg-gradient-info">
                                    <th width="35%">NOMBRE</th>
                                    <th width="20%">GRADO</th>
                                    <th width="15%">FOTO</th>

                                </thead>
                                <tbody>
                                    {this.state.personalMinisterialVinculado.filter(x => x.pem_Grado_Ministerial === "DIÁCONO").map((obj, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{obj.pem_Nombre}</td>
                                                <td><b>{obj.pem_Grado_Ministerial}</b></td>
                                                <td><img style={{ width: '50px', height: '50px' }} src={`data:${obj.MIMEType};base64,${obj.imagen}`} alt="Imagen de ministro" type="image/jpg"></img></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                </FormGroup>
                <FormGroup>
                    <Card className="border-info">
                        <CardTitle>
                            <h4 className="text-center pt-4">AUXILIARES</h4>
                        </CardTitle>
                        <CardBody>
                            <Table id="miTabla" className="table table-striped table-bordered table-sm bt-0">
                                <thead className="text-center bg-gradient-info">
                                    <th width="35%">NOMBRE</th>
                                    <th width="20%">GRADO</th>
                                    <th width="15%">FOTO</th>
                                </thead>
                                <tbody>
                                    {this.state.personalMinisterialVinculado.filter(x => x.pem_Grado_Ministerial === "AUXILIAR" || x.pem_Grado_Ministerial === "DIÁCONO A PRUEBA").map((obj, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{obj.pem_Nombre}</td>
                                                <td><b>{obj.pem_Grado_Ministerial}</b></td>
                                                <td><img style={{ width: '50px', height: '50px' }} src={`data:${obj.MIMEType};base64,${obj.imagen}`} alt="Imagen de ministro" type="image/jpg"></img></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                </FormGroup>

                <Modal isOpen={this.state.modal_Confirmacion} className="card">
                    <ModalHeader className="card-header">
                        <h2>Confirmación</h2>
                    </ModalHeader>
                    <ModalBody className="card-body">
                        <div >
                            <div >
                                {this.state.tipoRegistro == "NuevoElemento" &&
                                    <p>¿Esta seguro de querer agregar a <strong> {this.state.form.nombre_Persona} </strong>como elemento del Personal Ministerial?</p>
                                }
                                {this.state.tipoRegistro == "ElementoExistente" &&
                                    <p>¿Estas seguro de Vincular a
                                        <strong> {this.state.form.nombre_Persona} </strong>
                                        con el Elemento del Personal Ministerial ya Existente en la Base de Datos de Secretaría General bajo el nombre de:
                                        <strong> {this.state.form.nombre_Elemento} </strong>?
                                    </p>
                                }
                            </div>
                        </div>
                    </ModalBody>

                    <div className="modal-buttons">
                        <button className="btn btn-secondary m-3" onClick={this.closemodal_Confirmacion}>Cancelar</button>
                        <button className="btn btn-success m-3 " onClick={this.handleContinue} disabled={this.submitBtnDisable}>Continuar</button>
                    </div>

                </Modal>
                <Modal isOpen={this.state.modal_Confirmacion_Baja} className="card">
                    <ModalHeader className="card-header">
                        <h2>Confirmación</h2>
                    </ModalHeader>
                    <ModalBody className="card-body">
                        <div >
                            <div >
                                <p>¿Estas seguro de querer dar de Baja a <strong> {this.state.formBaja.nombre_Elemento} </strong>del Personal Ministerial?</p>
                            </div>
                        </div>
                    </ModalBody>

                    <div className="modal-buttons">
                        <button className="btn btn-secondary m-3" onClick={this.closemodal_Confirmacion_Baja}>Cancelar</button>
                        <button className="btn btn-danger m-3 " onClick={this.handleContinue_Baja} disabled={this.submitBtnDisable}>Continuar</button>
                    </div>

                </Modal>
                <Modal isOpen={this.state.modal_Procesando}>
                    <ModalBody>
                        Procesando...
                    </ModalBody>
                </Modal>
            </Container >
        )
    }
}