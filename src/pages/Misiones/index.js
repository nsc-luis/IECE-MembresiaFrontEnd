import React, { Component } from 'react';
import helpers from "../../components/Helpers";
import {
    Container, Button, Input, Modal, ModalBody, Alert, CardFooter,
    Card, CardBody, Table, Row, Col, FormFeedback, Form, FormGroup, CardHeader, ModalHeader
} from 'reactstrap';

export default class Misiones extends Component {
    infoSesion = JSON.parse(localStorage.getItem('infoSesion'));
    constructor(props) {
        super(props)
        this.state = {
            misiones: [],
            showForm: false,
            ms_Alias: "",
            ms_AliasInvalid: false,
            ms_NumeroInvalid: false,
            ms_Numero: "",
            editandoMision: false,
            numeroMisiones: [],
            currentMision: {},
            modal_Confirmacion_Baja: false,
            misionADarDeBaja: {}
        }
    }
    componentDidMount() {
        this.getMisiones()
        window.scrollTo(0, 0);
        this.setState({

        })
    }
    mostrarFormulario = () => {
        this.setState({ showForm: !this.state.showForm })
    }

    handleCancelar = () => {
        window.scrollTo(0, 0);
        this.setState({
            ms_Alias: "",
            showForm: !this.state.showForm,
            ms_AliasInvalid: false,
            ms_NumeroInvalid: false,
            editandoMision: false
        })
    }
    onChange = (e) => {
        // this.setState({
        //     [e.target.name]: e.target.value
        // })

        if (e.target.name === 'ms_Alias') {
            this.setState({
                [e.target.name]: e.target.value.toUpperCase()
            });
        } else {
            this.setState({
                [e.target.name]: e.target.value
            });
        }
    }

    getMisiones = async () => {
        try {
            await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/Mision_Sector/${localStorage.getItem("sector")}`)
                .then(res => {
                    this.setState({ misiones: res.data.misiones })
                    this.numeroDeMisiones()
                }))
        }
        catch (err) {
            alert("Error:\nNo se ha sido posible conectarse a la base de datos del sistema. Intente mas tarde.")
        }
    }
    enviarInfo = async (e) => {
        e.preventDefault()
        this.setState({
            ms_AliasInvalid: this.state.ms_Alias === "" || this.state.ms_Alias === null ? true : false,
            ms_NumeroInvalid: this.state.ms_Numero === "" || this.state.ms_Numero === 0 ? true : false
        })

        if (this.state.ms_Alias === "") {
            return false
        }

        let info = {
            ms_Alias: this.state.ms_Alias,
            sec_Id_Sector: localStorage.getItem("sector"),
            usu_Id_Usuario: this.infoSesion.pem_Id_Ministro
        }

        if (!this.state.editandoMision) { //Si no es Edición, sino Alta procede a registrar nueva misión
            try {
                await helpers.validaToken().then(helpers.authAxios.post(`${helpers.url_api}/Mision_Sector`, info)
                    .then(res => {
                        this.setState({ mision: res.data.mision })
                        this.handleCancelar()
                        this.getMisiones()
                    }))
            }
            catch (err) {
                alert("Error:\nNo se ha sido posible conectarse a la base de datos del sistema. Intente mas tarde.")
            }
        }
        else { //Si es Edición, procede a editar misión
            let info = {
                ms_Alias: this.state.ms_Alias,
                ms_Numero: this.state.ms_Numero,
                sec_Id_Sector: localStorage.getItem("sector"),
                usu_Id_Usuario: this.infoSesion.pem_Id_Ministro
            }
            try {
                await helpers.validaToken().then(helpers.authAxios.put(`${helpers.url_api}/Mision_Sector/${this.state.currentMision.ms_Id}`, info)
                    .then(res => {
                        this.setState({ mision: res.data.mision })
                        this.handleCancelar()
                        this.getMisiones()
                    }))
            }
            catch (err) {
                alert("Error:\nNo ha sido posible conectarse a la base de datos del sistema. Intente mas tarde.")
            }
        }

    }
    numeroDeMisiones = () => {
        const numerosArray = Array.from(
            { length: this.state.misiones.length },
            (_, index) => index + 1
        );

        this.setState({ numeroMisiones: numerosArray });
    }



    formParaEditar = (info) => {

        this.setState({
            ms_Alias: info.ms_Alias,
            ms_Numero: info.ms_Numero,
            editandoMision: true,
            currentMision: info
        })

        this.mostrarFormulario()
    }

    baja = async () => {
        try {
            await helpers.validaToken().then(helpers.authAxios.post(`${helpers.url_api}/Mision_Sector/BajaDeMision/${this.state.misionADarDeBaja.ms_Id}`)
                .then(res => {
                    this.getMisiones()
                    this.setState({ modal_Confirmacion_Baja: false })
                }))
        }
        catch (err) {
            alert("Error:\nNo se ha sido posible conectarse a la base de datos del sistema. Intente mas tarde.")
        }
    }

    bajaTentativa = (sector) => {
        console.log("Baja Tentativa");
        this.setState({
            modal_Confirmacion_Baja: true,
            misionADarDeBaja: sector,
            showForm: false,
        })
    }

    closemodal_Confirmacion_Baja = () => {
        this.setState({ modal_Confirmacion_Baja: false })
    }

    render() {
        return (
            <Container>
                <FormGroup>
                    <Row>
                        <Col xs="12">
                            <Alert color="warning">
                                <strong>AVISO: </strong>
                                <ul>
                                    <li>Para registrar una Misión, presione el Botón <strong>"Registrar Nueva Misión"</strong>.</li>
                                    <li>Para dar de Baja una Misión ya existente, presione el Botón <strong>"Baja"</strong> en el renglón correspondiente.</li>
                                    <li>Para dar de Editar el Número o Nombre de una Misión, presione el Botón <strong>"Editar"</strong> en el renglón correspondiente.</li>
                                </ul>
                            </Alert>
                        </Col>
                    </Row>
                </FormGroup>
                <FormGroup>
                    <Row>
                        <Col xs="12" style={{ textAlign: 'right' }}>
                            <Button
                                type="button"
                                color="primary"
                                onClick={this.mostrarFormulario}
                                hidden={this.state.showForm}
                            >
                                Registrar Nueva Misión
                            </Button>
                        </Col>
                    </Row>
                </FormGroup>

                {this.state.showForm &&
                    <FormGroup>
                        <Card className="border-info">
                            <CardHeader>
                                <h4 className="text-center pt-2"> {this.state.editandoMision ? 'EDICIÓN DE MISIÓN DEL SECTOR' : 'ALTA DE MISIÓN DEL SECTOR'}</h4>
                            </CardHeader>
                            <Form onSubmit={this.enviarInfo}>
                                <CardBody>
                                    <FormGroup>
                                        <Row>
                                            <Col xs="12">
                                                <Alert color="warning">
                                                    <strong>AVISO: </strong>LOS CAMPOS MARCADOS CON * SON REQUERIDOS.
                                                </Alert>
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                    <FormGroup>
                                        {this.state.editandoMision &&
                                            <Row>
                                                <Col xs="3">
                                                    * Número de Misión:
                                                </Col>
                                                <Col xs="2">
                                                    <Input
                                                        className="form-control mb-2"
                                                        type="select"
                                                        name="ms_Numero"
                                                        onChange={this.onChange}
                                                        value={this.state.ms_Numero}
                                                        invalid={this.state.ms_NumeroInvalid}
                                                    >
                                                        {this.state.numeroMisiones.map(numero => (
                                                            <option key={numero} value={numero}>
                                                                {numero}
                                                            </option>
                                                        ))}
                                                    </Input>
                                                    <FormFeedback>Este campo es requerido</FormFeedback>
                                                </Col>
                                            </Row>
                                        }
                                        <Row>
                                            <Col xs="3">
                                                * Nombre de Misión:
                                            </Col>
                                            <Col xs="9">
                                                <Input
                                                    className="form-control "
                                                    type="text"
                                                    name="ms_Alias"
                                                    onChange={this.onChange}
                                                    value={this.state.ms_Alias}
                                                    invalid={this.state.ms_AliasInvalid}
                                                />
                                                <FormFeedback>Este campo es requerido</FormFeedback>
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                </CardBody>
                                <CardFooter>
                                    <Row>
                                        <Col xs="12" style={{ textAlign: 'right' }}>
                                            <Button
                                                type="button"
                                                color="secondary"
                                                className="entreBotones"
                                                onClick={this.handleCancelar}
                                            >
                                                Cancelar
                                            </Button>
                                            <Button
                                                type="submit"
                                                color="success"
                                            >
                                                <span className="fa fa-save"></span>Guardar
                                            </Button>
                                        </Col>
                                    </Row>
                                </CardFooter>
                            </Form>
                        </Card>
                    </FormGroup>
                }

                {this.state.misiones.length > 0 &&
                    <Card className="border-info">
                        <CardHeader>
                            <h4 className="text-center pt-2">MISIONES DEL SECTOR</h4>
                        </CardHeader>
                        <CardBody>
                            <Table className="table table-striped table-bordered table-sm bt-0">
                                <thead className="text-center bg-gradient-info">
                                    <tr>
                                        <th>No. de Misión</th>
                                        <th>Alias de Misión</th>
                                        <th>Estatus</th>
                                        <th>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.misiones.map((mision) => {
                                        return (
                                            <tr key={mision.ms_Id} className="mb-3">
                                                <td>{mision.ms_Numero}</td>
                                                <td>{mision.ms_Alias}</td>
                                                <td>{mision.ms_Activo === true ? "Activo" : "Inactivo"}</td>
                                                <td className="text-center p-2">
                                                    <Button
                                                        className="m-2"
                                                        color="success"
                                                        type="button"
                                                        onClick={() => this.formParaEditar(mision)}
                                                    >
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        className="m-2"
                                                        color="danger"
                                                        type="button"
                                                        onClick={() => this.bajaTentativa(mision)}
                                                    >
                                                        Baja
                                                    </Button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                }
                {this.state.misiones.length < 1 &&
                    <h4>NO HAY MISIONES REGISTRADAS DE ESTE SECTOR</h4>
                }

                <Modal isOpen={this.state.modal_Confirmacion_Baja} className="card">
                    <ModalHeader className="card-header">
                        <h2>Confirmación</h2>
                    </ModalHeader>
                    <ModalBody className="card-body">
                        <div >
                            <div >
                                <p>¿Estas seguro de querer dar de Baja la Misión<strong> {this.state.misionADarDeBaja.ms_Alias}</strong>?</p>
                            </div>
                        </div>
                    </ModalBody>

                    <div className="modal-buttons">
                        <button className="btn btn-secondary m-3" onClick={this.closemodal_Confirmacion_Baja}>Cancelar</button>
                        <button className="btn btn-danger m-3 " onClick={this.baja} >Continuar</button>
                    </div>
                </Modal>

            </Container>
        )
    }
}