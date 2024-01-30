import React, { Component } from 'react';
import helpers from "../../components/Helpers";
import {
    Container, Button, Input, Modal, ModalBody, Label, Alert, CardFooter,
    CardTitle, Card, CardBody, Table, Row, Col, FormFeedback, Form, FormGroup, CardHeader, ModalHeader, ModalFooter
} from 'reactstrap';
import './style.css'

export default class DetalleVisitante extends Component {
    infoSesion = JSON.parse(localStorage.getItem('infoSesion'));
    constructor(props) {
        super(props)
        this.state = {
            visitante: {},
            notas: [],
            showDlgNota: false,
            nota: {
                n_Id: 0,
                n_Fecha_Nota: null,
                n_Nota: "",
                usu_Id_Usuario: this.infoSesion.pem_Id_Ministro,
                vp_Id_Visitante: this.props.idVisitante
            },
            n_Fecha_NotaInvalid: false,
            n_NotaInvalid: false,
            editarNota: false
        }
    }
    componentDidMount() {
        this.getInfoVisitante(this.props.idVisitante)
        this.getNotas(this.props.idVisitante)
    }

    getInfoVisitante = async (idVisitante) => {
        try {
            await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/Visitante/${idVisitante}`)
                .then(res => {
                    this.setState({ visitante: res.data.visitante })
                }))
        }
        catch (err) {
            alert("Error:\n" + err)
        }
    }

    getNotas = async (idVisitante) => {
        try {
            await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/Nota/${idVisitante}`)
                .then(res => {
                    res.data.notas.forEach(nota => {
                        nota.n_Fecha_Nota = helpers.reFormatoFecha(nota.n_Fecha_Nota)
                    });
                    this.setState({ notas: res.data.notas })
                }))
        }
        catch (err) {
            alert("Error:\n" + err)
        }
    }

    onChange = (e) => {
        this.setState({
            nota: {
                ...this.state.nota,
                [e.target.name]: e.target.value.toUpperCase()
            }
        })
    }

    showDlgNota = () => {
        this.setState({
            showDlgNota: !this.state.showDlgNota
        })
    }

    hideDlgNota = () => {
        this.setState({
            showDlgNota: false,
            nota: {
                ...this.state.nota,
                n_Id: 0,
                n_Fecha_Nota: null,
                n_Nota: "",
                usu_Id_Usuario: this.infoSesion.pem_Id_Ministro,
                vp_Id_Visitante: this.props.idVisitante
            },
            n_Fecha_NotaInvalid: false,
            n_NotaInvalid: false,
            editarNota: false
        })
    }

    guardarNota = async (e) => {
        e.preventDefault()
        this.setState({
            n_Fecha_NotaInvalid: this.state.nota.n_Fecha_Nota === null ? true : false,
            n_NotaInvalid: this.state.nota.n_Nota === "" ? true : false,
        })

        if (this.state.nota.n_Fecha_Nota === null
            || this.state.nota.n_Nota === "") {
            return false
        }

        if (this.state.editarNota) {
            try {
                await helpers.validaToken().then(helpers.authAxios.put(`${helpers.url_api}/Nota/${this.state.nota.n_Id}`, this.state.nota)
                    .then(res => {
                        this.getNotas(this.props.idVisitante)
                        this.hideDlgNota()
                    }))
            }
            catch (err) {
                alert("Error:\n" + err)
            }
        }
        else {
            try {
                await helpers.validaToken().then(helpers.authAxios.post(`${helpers.url_api}/Nota`, this.state.nota)
                    .then(res => {
                        this.getNotas(this.props.idVisitante)
                        this.hideDlgNota()
                    }))
            }
            catch (err) {
                alert("Error:\n" + err)
            }
        }
    }

    borrarNota = async (idNota) => {
        try {
            await helpers.validaToken().then(helpers.authAxios.delete(`${helpers.url_api}/Nota/${idNota}`)
                .then(res => {
                    this.getNotas(this.props.idVisitante)
                    this.hideDlgNota()

                }))
        }
        catch (err) {
            alert("Error:\n" + err)
        }
    }

    dlgEditarNota = (info) => {
        info.n_Fecha_Nota = helpers.reFormatoFecha(info.n_Fecha_Nota)
        this.setState({
            nota: info,
            showDlgNota: true,
            editarNota: true
        })
    }

    render() {
        const { hideDetalle } = this.props
        return (
            <>
                <Card>
                    <FormGroup>
                        <Row>
                            <Col xs="9">
                                <h4>Datos del visitante</h4>
                            </Col>
                            <Col xs="3" style={{ textAlign: 'right' }}>
                                <Button
                                    type="button"
                                    color="primary"
                                    onClick={this.showDlgNota}
                                >
                                    <span className='fas fa-plus-circle'></span>
                                    Agregar nota
                                </Button>
                            </Col>
                        </Row>
                    </FormGroup>
                    <FormGroup>
                        <Row>
                            <Col xs="2" className="negrita">
                                Nombre:
                            </Col>
                            <Col xs="6" className="border border-dark">
                                {this.state.visitante.vp_Nombre}
                            </Col>
                            <Col xs="4">
                                <span className="fa fa-check faIconMarginRight"></span>
                                {this.state.visitante.vp_Tipo_Visitante}
                            </Col>
                        </Row>
                    </FormGroup>
                    <FormGroup>
                        <Row>
                            <Col xs="2" className="negrita">
                                No. contacto:
                            </Col>
                            <Col xs="3" className="border border-dark">
                                {this.state.visitante.vp_Telefono_Contacto}
                            </Col>
                            <Col xs="3" />
                            <Col xs="4">
                                <span className={this.state.visitante.vp_Activo === true ? "fa fa-check faIconMarginRight" : "fa fa-times faIconMarginRight"}></span>
                                Activo
                            </Col>
                        </Row>
                    </FormGroup>
                    <FormGroup>
                        <Row>
                            <Col xs="2" className="negrita">
                                Direccion:
                            </Col>
                            <Col xs="6" className="border border-dark">
                                {this.state.visitante.vp_Direccion}
                            </Col>
                        </Row>
                    </FormGroup>

                    <h4 style={{ textAlign: "center" }}>Notas / Comentarios</h4>
                    <Table className="table table-striped border bt-0">
                        <thead className="bg-info">
                            <tr>
                                <th style={{ width: "15%" }}>Fecha</th>
                                <th style={{ width: "65%" }}>Nota</th>
                                <th style={{ width: "20%" }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.notas.map((nota) => {
                                return (
                                    <tr key={nota.n_Id}>
                                        <td>{nota.n_Fecha_Nota}</td>
                                        <td>{nota.n_Nota}</td>
                                        <Button
                                            type="button"
                                            color="success"
                                            className='btnMargenDerecho'
                                            onClick={() => this.dlgEditarNota(nota)}
                                        >
                                            <span className="fa fa-edit"></span>
                                            Editar
                                        </Button>
                                        <Button
                                            type="button"
                                            color="danger"
                                            onClick={() => this.borrarNota(nota.n_Id)}
                                        >
                                            <span className="fa fa-times"></span>
                                            Borrar
                                        </Button>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </Card>
                <FormGroup>
                    <Row>
                        <Col xs="10" />
                        <Col xs="2" style={{ textAlign: 'right' }}>
                            <Button
                                type="button"
                                onClick={hideDetalle}
                            >
                                <spam className="fas fa-arrow-circle-left btnMargenDerecho"></spam>
                                Regresar
                            </Button>
                        </Col>
                    </Row>
                </FormGroup>
                <Modal isOpen={this.state.showDlgNota} size="lg">
                    <Form onSubmit={this.guardarNota}>
                        <ModalHeader>
                            <h2>Datos de la nota</h2>
                        </ModalHeader>
                        <ModalBody>
                            <Alert color="warning">
                                <strong>AVISO: </strong>LOS CAMPOS MARCADOS CON * SON REQUERIDOS.
                            </Alert>
                            <FormGroup>
                                <Row>
                                    <Col xs="2">
                                        <span className='negrita'>* Fecha:</span>
                                    </Col>
                                    <Col xs="3">
                                        <Input
                                            type="date"
                                            name='n_Fecha_Nota'
                                            onChange={this.onChange}
                                            value={this.state.nota.n_Fecha_Nota}
                                            invalid={this.state.n_Fecha_NotaInvalid}
                                        />
                                        <FormFeedback>Este campo es necesario.</FormFeedback>
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                    <Col xs="2">
                                        <span className='negrita'>* Nota:</span>
                                    </Col>
                                    <Col xs="10">
                                        <Input
                                            name="n_Nota"
                                            type="textarea"
                                            onChange={this.onChange}
                                            rows="3"
                                            value={this.state.nota.n_Nota}
                                            invalid={this.state.n_NotaInvalid}
                                        />
                                        <FormFeedback>Este campo es necesario.</FormFeedback>
                                    </Col>
                                </Row>
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                type="button"
                                onClick={this.hideDlgNota}
                            >
                                Cancelar
                            </Button>
                            <Button
                                color="success"
                                type="submit"
                            >
                                Guardar
                            </Button>
                        </ModalFooter>
                    </Form>
                </Modal>
            </>
        )
    }
}
