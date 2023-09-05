import React, { Component } from 'react';
import helpers from "../../components/Helpers";
import {
    Container, Button, Input, Modal, ModalBody, Label, Alert, CardFooter,
    CardTitle, Card, CardBody, Table, Row, Col, FormFeedback, Form, FormGroup, CardHeader
} from 'reactstrap';
import { Link } from 'react-router-dom';
import './style.css';

class ComisionesLocales extends Component {

    constructor(props) {
        super(props);
        const fechaActual = new Date().toLocaleDateString();
        // Supongamos que tienes un array de datos con información de las comisiones, nombres e jerarquía.
        this.state = {
            comisiones: [],
            comisionesLocalesDisponibles: [],
            personasBautizadas: [],
            integranteComision: {
                sector_Id: localStorage.getItem('sector'),
                comision_Id: "",
                integrante_Id: "",
                jerarquia: 0,
                activa: true,
                descripcion_Adicional: "",
                fecha_Registro: fechaActual
            },
            submitBtnDisable: false,
            mostrarBotonAgregarIntegrante: true,
            mostrarFormulario: false
        };
    }

    handle_BtnAgregarMostrarFormulario = () => {
        this.setState({
            mostrarFormulario: !this.state.mostrarFormulario,
            mostrarBotonAgregarIntegrante: !this.state.mostrarBotonAgregarIntegrante
        })
    }

    componentDidMount() {
        this.getComisionesLocalesBySector();
        this.getComisionesLocales();
        this.getBautizadosBySector();
        //Sube el cursor hasta la parte superior
        window.scrollTo(0, 0);
    }

    getComisionesLocales = async () => {
        //console.log(helpers.authAxios.get((helpers.authAxios.get(`${helpers.url_api}/Integrante_Comision_Local/GetComisionesBySector/${localStorage.getItem('sector')}`))))
        await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/Comision_Local/GetComisionLocal`)
            .then(res => {
                //console.log("comisionesDisponibles: ", res.data)
                if (res.data.status === true)
                    this.setState({ comisionesLocalesDisponibles: res.data.comisionesDisponibles })
                else {
                    alert("Error:\nNo se pudo consultar la lista de personas, favor de reportar o intentar mas tarde.")
                }
            })
        )
    }

    getComisionesLocalesBySector = async () => {
        await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/Integrante_Comision_Local/GetComisionesBySector/${localStorage.getItem('sector')}`)
            .then(res => {
                if (res.data.status === true)
                    this.setState({ comisiones: res.data.comisiones })
                else {
                    alert("Error:\nNo se pudo consultar la lista de personas, favor de reportar o intentar mas tarde.")
                }
            })
        )
    }

    getBautizadosBySector = async () => {
        //console.log(helpers.authAxios.get((helpers.authAxios.get(`${helpers.url_api}/Integrante_Comision_Local/GetComisionesBySector/${localStorage.getItem('sector')}`))))
        await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/Persona/GetBautizadosComunionVivoBySector/${localStorage.getItem('sector')}`)
            .then(res => {
                //console.log("personasBautizadas: ", res.data.personas)
                if (res.data.status === "success")
                    this.setState({ personasBautizadas: res.data.personas })
                else {
                    alert("Error:\nNo se pudo consultar la lista de personas, favor de reportar o intentar mas tarde.")
                }
            })
        )
    }

    handleChange = (e) => {
        this.setState({
            integranteComision: {
                ...this.state.integranteComision,
                [e.target.name]: e.target.value
            }
        })
        
        /* if (e.target.name === "comision_Id") {
            var result = this.state.comisiones.filter((obj) => {
                return obj.comision === "VIGILANCIA"
            })
            this.setState({ comisiones: result })
        } */
    }

    // Función para manejar el evento "Dar de Baja"
    handleDarDeBaja = async (integrante_Comision_Id) => {
        //console.log("Dando de Baja: ", integrante_Comision_Id)
        await helpers.validaToken().then(helpers.authAxios.put(`${helpers.url_api}/Integrante_Comision_Local/BajaDeIntegranteComision/${integrante_Comision_Id}`)
            .then(() => { this.getComisionesLocalesBySector() })
        )
    }

    guardarComision = async (e) => {
        e.preventDefault();
        this.setState({ submitBtnDisable: true });

        let comisionEntity = {
            Activo: this.state.integranteComision.activa,
            Sector_Id: this.state.integranteComision.sector_Id,
            Comision_Id: this.state.integranteComision.comision_Id,
            Integrante_Id: this.state.integranteComision.integrante_Id,
            Jerarquia_Integrante: this.state.integranteComision.jerarquia,
            Descripcion_Adicional: this.state.integranteComision.descripcion_Adicional,
            Fecha_Registro: this.state.integranteComision.fecha_Registro
        }

        await helpers.validaToken().then(helpers.authAxios.post(`${helpers.url_api}/Integrante_Comision_Local/PostIntegrante_Comision_Local`, comisionEntity)
            .then(res => {
                //console.log("respuesta: ", res)

                if (res.data.status === "success") {
                    this.getComisionesLocalesBySector();
                }
            })
        );
        this.handle_BtnAgregarMostrarFormulario();
    }

    render() {
        const numbers = Array.from({ length: 20 }, (_, index) => index + 1);
        //console.log("objetoIntegrante_Comision: ", this.state.integranteComision)
        return (
            <div className="border">
                {this.state.mostrarBotonAgregarIntegrante &&
                    <Button
                        color="primary"
                        onClick={this.handle_BtnAgregarMostrarFormulario}
                    >
                        Agregar integrante
                    </Button>
                }
                {this.state.mostrarFormulario &&
                    <Form
                        onSubmit={this.guardarComision}
                        id="FrmRegistroPersona"
                        className="p-3" /* onChange={this.FrmRegistroPersona} */
                    >
                        <div className="container">
                            <FormGroup>
                                <Row>
                                    <Col xs="3">
                                        * ELIJA LA COMISION:
                                    </Col>
                                    <Col xs="9">
                                        <Input
                                            type="select"
                                            onChange={this.handleChange}
                                            name="comision_Id"
                                            value={this.state.integranteComision.comision_Id}
                                            placeholder="Seleccione una Comisión"

                                        >
                                            <option value="0">Elija una Comisión</option>
                                            {this.state.comisionesLocalesDisponibles.map((com) => {
                                                return (
                                                    <React.Fragment key={com.comisionLocal_Id}>
                                                        <option value={com.comisionLocal_Id}>{com.nombre}</option>
                                                    </React.Fragment>
                                                )
                                            })
                                            }
                                        </Input>
                                        <FormFeedback>Este campo es requerido</FormFeedback>
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                    <Col xs="3">
                                        * ELIJA AL INTEGRANTE:
                                    </Col>
                                    <Col xs="9">
                                        <Input
                                            type="select"
                                            onChange={this.handleChange}
                                            name="integrante_Id"
                                            value={this.state.integranteComision.integrante_Id}
                                            placeholder="Seleccione una Persona"

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
                                        <FormFeedback>Este campo es requerido</FormFeedback>
                                    </Col>
                                </Row>
                            </FormGroup>

                            <FormGroup>
                                <Row>
                                    <Col xs="3">
                                        * ELIJA EL ORDEN DE INTEGRANTE (JERARQUIA EN LA COMISIÓN):
                                    </Col>
                                    <Col xs="9">
                                        <Input
                                            type="select"
                                            onChange={this.handleChange}
                                            name="jerarquia"
                                            value={this.state.integranteComision.jerarquia}
                                            placeholder="Elija el orden de Integrante en el que se mostrará en su Comisión"

                                        >
                                            <option value="0">Elija el orden/jerarquia del Integrante</option>
                                            {numbers.map((num) => {
                                                return (
                                                    <React.Fragment key={num}>
                                                        <option value={num}>{num}</option>
                                                    </React.Fragment>
                                                )
                                            })
                                            }
                                        </Input>
                                        <FormFeedback>Este campo es requerido</FormFeedback>
                                    </Col>
                                </Row>
                            </FormGroup>

                            <Row>
                                <Col xs="8"></Col>
                                <Col xs="2" >
                                    <Button
                                        type="submit"
                                        className="btn btn-secondary form-control"
                                        name="btnGuardarIntegranteComision"
                                        disabled={this.handle_BtnAgregarMostrarFormulario}
                                    >
                                        <span className="fa fa-times" style={{ paddingRight: "10px" }}></span>
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

                <h2>Mi Tabla de Integrantes</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Comisión</th>
                            <th>Nombre de Integrante</th>
                            <th>Orden de Jerarquía</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.comisiones.map((item) => (
                            <tr>
                                <td>{item.comision ? item.comision : ""}</td>
                                <td>
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
                                <td>
                                    {item.integrantes.map((persona) => (
                                        <FormGroup key={persona.integrante_Comision_Id}>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => this.handleDarDeBaja(persona.integrante_Comision_Id)}
                                            >
                                                Dar de Baja
                                            </button> <br />
                                        </FormGroup>
                                    ))}
                                </td>
                            </tr>
                            /* item.integrantes.map(i => (
                                <tr key={i.integrante_Comision_Id}>
                                    <td>{i.comision ? i.comision : ""}</td>
                                    <td>{i.integrante ? i.integrante : ""}</td>
                                    <td>{i.jerarquia ? i.jerarquia : ""}</td>
                                    <td>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => this.handleDarDeBaja(i.integrante_Comision_Id)}
                                        >
                                            Dar de Baja
                                        </button>
                                    </td>
                                </tr>
                            )) */
                        ))}
                    </tbody>
                </table>
            </div >
        );
    }
}

export default ComisionesLocales;