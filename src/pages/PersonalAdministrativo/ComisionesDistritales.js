import React, { Component } from 'react';
import helpers from "../../components/Helpers";
import {
    Container, Button, Input, Modal, ModalBody, Label, Alert, CardFooter,
    CardTitle, Card, CardBody, Table, Row, Col, FormFeedback, Form, FormGroup, CardHeader,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import './style.css';

class ComisionesDistritales extends Component {
    constructor(props) {
        super(props);
        // Supongamos que tienes un array de datos con información de las comisiones, nombres e jerarquía.
        this.state = {
            comisiones: [],
            comisionesDistritalesDisponibles: [],
            personasBautizadas: [],
            integranteComision: {
                distrito_Id: localStorage.getItem('dto'),
                comision_Id: "",
                integrante_Id: "",
                jerarquia: 0,
                activa: true,
                descripcion_Adicional: "",
                fecha_Registro: new Date().toLocaleDateString()
            },
            submitBtnDisable: false,
            mostrarBotonAgregarIntegrante: true,
            mostrarFormulario: false,
            errors: {},
            numbers: [],
            comisionSeleccionada: [],
            modalShow: false,
            mensajeDelProceso: "",
            submitting: false
        };
    }

    inicializarVariables = () => {
        console.log("Inicializando Variables")
        this.setState({
            integranteComision: {
                distrito_Id: localStorage.getItem('dto'),
                comision_Id: "",
                integrante_Id: "",
                jerarquia: 0,
                activa: true,
                descripcion_Adicional: "",
                fecha_Registro: new Date().toLocaleDateString()
            },
            submitBtnDisable: false,
            mostrarBotonAgregarIntegrante: true,
            mostrarFormulario: false,
            errors: {},
            numbers: []
        })
    }

    handle_BtnAgregarMostrarFormulario = () => {
        console.log("clicked!")
        this.inicializarVariables();
        this.setState({
            mostrarFormulario: !this.state.mostrarFormulario,
            mostrarBotonAgregarIntegrante: !this.state.mostrarBotonAgregarIntegrante
        });

    }

    componentDidMount() {
        this.getComisionesDistritalesByDistrito();
        this.getComisionesDistritales();
        this.getPersonalMinisterialByDistrito();
        //Sube el cursor hasta la parte superior
        window.scrollTo(0, 0);
    }


    getComisionesDistritales = async () => {
        //console.log(helpers.authAxios.get((helpers.authAxios.get(`${helpers.url_api}/Integrante_Comision_Distrital/GetComisionesByDistrito/${localStorage.getItem('dto')}`))))
        await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/Comision_Distrital/GetComisionDistrital`)
            .then(res => {
                //console.log("comisionesDisponibles: ", res.data)
                if (res.data.status === true)
                    this.setState({ comisionesDistritalesDisponibles: res.data.comisionesDisponibles })
                else {
                    alert("Error:\nNo se pudo consultar la lista de personas, favor de reportar o intentar mas tarde.")
                }
            })
        )
    }

    getComisionesDistritalesByDistrito = async () => {
        console.log("Recargando lista de comisiones")
        await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/Integrante_Comision_Distrital/GetComisionesByDistrito/${localStorage.getItem('dto')}`)
            .then(res => {
                console.log("Recargó comisiones: ", res.data.comisiones)
                if (res.data.status === true) {
                    this.setState({
                        comisiones: res.data.comisiones
                    });
                    this.inicializarVariables();


                    //Desaparecerá un Mensaje de espera
                    this.setState({
                        modalShow: false
                    })

                }
                else {
                    alert("Error:\nNo se pudo consultar la lista de personas, favor de reportar o intentar mas tarde.")
                }
            })
        )
    }

    getPersonalMinisterialByDistrito = async () => {
        //console.log(helpers.authAxios.get((helpers.authAxios.get(`${helpers.url_api}/Integrante_Comision_Distrital/GetComisionesByDistrito/${localStorage.getItem('dto')}`))))
        await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/PersonalMinisterial/GetPersonalMinisterialByDistrito/${localStorage.getItem('dto')}`)
            .then(res => {
                //console.log("personasBautizadas: ", res.data.personas)
                if (res.data.status === "success")
                    this.setState({ personasBautizadas: res.data.administrativo })
                else {
                    alert("Error:\nNo se pudo consultar la lista de personas, favor de reportar o intentar mas tarde.")
                }
            })
        )
    }


    handleChange = (e) => {
        console.log("comisionSeleccionada:", [e.target.name], e.target.value)
        this.setState({
            integranteComision: {
                ...this.state.integranteComision,
                [e.target.name]: e.target.value
            },
            errors: {
                ...this.state.errors,
                [e.target.name]: false
            }
        })

        if ([e.target.name] == "comision_Id") {
            console.log("filtrando: ", e.target.name)
            let cantidadIntegrantes = this.state.comisiones.filter((com) => com.comision_Id == e.target.value)[0].integrantes.length;
            console.log("cantiadIntegrantes: ", cantidadIntegrantes)
            this.setState({
                comisionSeleccionada: this.state.comisiones.filter((com) => com.comision_Id == e.target.value),
                numbers: Array.from({ length: cantidadIntegrantes + 1 }, (_, index) => index + 1)
            })
            console.log("Filtro: ", this.state.comisiones.filter((com) => com.comision_Id == e.target.value));
        }
    }

    // Función para manejar el evento "Dar de Baja"
    handleDarDeBaja = async (integrante_Comision_Id) => {
        console.log("Dando de Baja: ", integrante_Comision_Id)
        await helpers.validaToken().then(helpers.authAxios.put(`${helpers.url_api}/Integrante_Comision_Distrital/BajaDeIntegranteComision/${integrante_Comision_Id}`)
            .then(() => { this.getComisionesDistritalesByDistrito() })
        )
    }

    guardarComision = async (e) => {
        e.preventDefault();

        if (this.state.submitting) {
            return; // Evitar múltiples envíos si ya se está procesando
        }

        const newErrors = {};

        if (this.state.integranteComision.comision_Id == null || this.state.integranteComision.comision_Id == "") {
            newErrors.comision_Id = true;
        }

        if (this.state.integranteComision.integrante_Id == null || this.state.integranteComision.integrante_Id == "") {
            newErrors.integrante_Id = true;
        }

        if (this.state.integranteComision.jerarquia == null || this.state.integranteComision.jerarquia == "") {
            newErrors.jerarquia = true;
        }

        console.log("errores: ", newErrors)
        if (Object.keys(newErrors).length > 0) {
            this.setState({ errors: newErrors });
            return false
        } else {
            // Envía el formulario si no hay errores
            this.setState({ submitBtnDisable: true });

            let comisionEntity = {
                Activo: this.state.integranteComision.activa,
                Distrito_Id: this.state.integranteComision.distrito_Id,
                Comision_Id: this.state.integranteComision.comision_Id,
                Integrante_Id: this.state.integranteComision.integrante_Id,
                Jerarquia_Integrante: this.state.integranteComision.jerarquia,
                Descripcion_Adicional: this.state.integranteComision.descripcion_Adicional,
                Fecha_Registro: new Date().toISOString(),
            }

            this.setState({ submitting: true }); //Controla la propiedad disabled del Botón de Submit para evitar multiples clicks

            await helpers.validaToken().then(helpers.authAxios.post(`${helpers.url_api}/Integrante_Comision_Distrital/PostIntegrante_Comision_Distrital`, comisionEntity)
                .then(res => {
                    console.log("Se agregó un Integrante ", res)

                    if (res.data.status === "success") {

                        //Aparecerá un Mensaje de espera
                        this.setState({
                            mensajeDelProceso: "Procesando...",
                            modalShow: true
                        })

                        console.log("Se actualiza la lista de comisiones ", res)
                        this.getComisionesDistritalesByDistrito();
                        this.handle_BtnAgregarMostrarFormulario();
                    }
                })
            );
        }
    }

    render() {
        //Crea un arreglo de numeros de 1 al 20

        console.log("Renderizando");
        return (

            <div className="container">

                <FormGroup>
                    <Row>
                        <Col xs="12">
                            <Alert color="warning">
                                <strong>AVISO: </strong>
                                <ul>
                                    <li>Para establecer una Nueva Asignación de Comisión Distrital, presione el Botón <strong>"Nueva Asignación"</strong>.</li>
                                    <li>Para dar de Baja un integrante de una Comisión, seleccione el Botón <strong>"Baja de Designación"</strong> en el renglón correspondiente.</li>
                                    <li> <strong>El personal cualificado</strong> para una designación de <strong>Comisión Distrital</strong> debe ser del Personal Ministerial del Distrito.</li>
                                    <li> Para ver a todos los Elementos del Personal Ministerial, asegúrese de que en cada Sector se haya realizado <strong>la Vinculación</strong> o <strong>la Alta</strong> del Personal Ministerial.</li>
                                </ul>
                            </Alert>
                        </Col>
                    </Row>
                </FormGroup>

                <div className="text-right pb-3">
                    {this.state.mostrarBotonAgregarIntegrante &&
                        <Button
                            color="primary"
                            onClick={this.handle_BtnAgregarMostrarFormulario}
                        >
                            Nueva Designación
                        </Button>
                    }
                </div>

                {
                    this.state.mostrarFormulario &&
                    <Form
                        onSubmit={this.guardarComision}
                        className="container p-3 border" /* onChange={this.FrmRegistroPersona} */
                    >
                        <div className="container ">
                            <FormGroup>
                                <Row>
                                    <Col xs="3">
                                        *COMISIÓN:
                                    </Col>
                                    <Col xs="9">
                                        <Input
                                            type="select"
                                            onChange={this.handleChange}
                                            name="comision_Id"
                                            value={this.state.integranteComision.comision_Id}
                                            placeholder="Seleccione una Comisión"
                                            required
                                            className={this.state.errors.comision_Id ? 'is-invalid' : ''}
                                        >
                                            <option value="0">Elija una Comisión</option>
                                            {this.state.comisionesDistritalesDisponibles.map((com) => {
                                                return (
                                                    <React.Fragment key={com.comisionDistrital_Id}>
                                                        <option value={com.comisionDistrital_Id}>{com.nombre}</option>
                                                    </React.Fragment>
                                                )
                                            })
                                            }
                                        </Input>
                                        {this.state.errors.comision_Id && <FormFeedback>Este campo es requerido</FormFeedback>}
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                    <Col xs="3">
                                        *INTEGRANTE:
                                    </Col>
                                    <Col xs="9">
                                        <Input
                                            type="select"
                                            onChange={this.handleChange}
                                            name="integrante_Id"
                                            value={this.state.integranteComision.integrante_Id}
                                            placeholder="Seleccione una Persona"
                                            required
                                            className={this.state.errors.integrante_Id ? 'is-invalid' : ''}

                                        >
                                            <option value="0">Elija al Integrante de la Comisión</option>
                                            {this.state.personasBautizadas.map((per) => {
                                                return (
                                                    <React.Fragment key={per.per_Id_Persona}>
                                                        <option value={per.per_Id_Persona}>{per.per_Nombre + ' ' + per.apellidoPrincipal + ' ' + (per.per_Apellido_Materno ? per.per_Apellido_Materno : "")}</option>
                                                    </React.Fragment>
                                                )
                                            })
                                            }
                                        </Input>
                                        {this.state.errors.integrante_Id && <FormFeedback>Este campo es requerido</FormFeedback>}
                                    </Col>
                                </Row>
                            </FormGroup>

                            <FormGroup>
                                <Row>
                                    <Col xs="3">
                                        * ORDEN/JERARQUÍA DE INTEGRANTE:
                                    </Col>
                                    <Col xs="9">
                                        <Input
                                            type="select"
                                            onChange={this.handleChange}
                                            name="jerarquia"
                                            value={this.state.integranteComision.jerarquia}
                                            placeholder="Elija el orden de Integrante en el que se mostrará en su Comisión"
                                            required
                                            className={this.state.errors.jerarquia ? 'is-invalid' : ''}
                                        >
                                            <option value="0">Elija el orden/jerarquía del Integrante</option>
                                            {this.state.numbers.map((num) => {
                                                return (
                                                    <React.Fragment key={num}>
                                                        <option value={num}>{num}</option>
                                                    </React.Fragment>
                                                )
                                            })
                                            }
                                        </Input>
                                        {this.state.errors.jerarquia && <FormFeedback>Este campo es requerido</FormFeedback>}
                                    </Col>
                                </Row>
                            </FormGroup>

                            <Row>
                                <Col xs="8"></Col>
                                <Col xs="2" >
                                    <Button
                                        type="button"
                                        className="btn btn-secondary form-control"
                                        onClick={(this.inicializarVariables)}
                                    >
                                        <span className="fa fa-save" style={{ paddingRight: "10px" }}></span>
                                        Cancelar
                                    </Button>
                                </Col>
                                <Col xs="2" >
                                    <Button
                                        type="submit"
                                        className="btn btn-success form-control"
                                        name="btnGuardarIntegranteComision"
                                        disabled={this.state.submitBtnDisable}
                                    >
                                        <span className="fa fa-save" style={{ paddingRight: "10px" }}></span>
                                        Asignar
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    </Form>
                }

                <h4 className="text-center pt-4">COMISIONES DISTRITALES Y SUS INTEGRANTES</h4>
                <table id="miTabla" className="table table-striped table-bordered table-sm">
                    <thead className="text-center bg-gradient-info">
                        <tr>
                            <th width="30%">Comisión</th>
                            <th width="30%">Nombre de Integrante</th>
                            <th width="15%">Orden de Jerarquía</th>
                            <th width="20%">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.comisiones.map((item) => (
                            item.integrantes.length > 0 &&
                            <tr>
                                <td className="border">{item.comision}</td>
                                <td className="border-bottom">
                                    {item.integrantes.map((persona) => (
                                        <FormGroup key={persona.integrante_Comision_Id}>
                                            {persona.integrante} <br />
                                        </FormGroup>
                                    ))}
                                </td>
                                <td>
                                    {item.integrantes.map((persona) => (
                                        <FormGroup key={persona.integrante_Comision_Id}>
                                            {persona.jerarquia} <br />
                                        </FormGroup>
                                    ))}
                                </td>
                                <td >
                                    {item.integrantes.map((persona) => (
                                        <FormGroup key={persona.integrante_Comision_Id}>
                                            <button id="miBoton"
                                                className="btn btn-danger"
                                                onClick={() => this.handleDarDeBaja(persona.integrante_Comision_Id)}
                                            >
                                                Baja de Designación
                                            </button> <br />
                                        </FormGroup>
                                    ))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/*Modal success*/}
                <Modal isOpen={this.state.modalShow}>
                    <ModalBody>
                        {this.state.mensajeDelProceso}
                    </ModalBody>
                </Modal>
            </div >
        );
    }
}

export default ComisionesDistritales;