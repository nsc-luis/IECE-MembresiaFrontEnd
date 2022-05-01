import React, { Component } from 'react';
import {
    Container, Row, Col, Card, CardHeader,
    CardBody, CardFooter, Form, Input, Label,
    Button, FormFeedback, Table, FormGroup,
    Modal, ModalFooter, ModalBody, ModalHeader
} from 'reactstrap';
import axios from 'axios';
import helpers from '../../components/Helpers';
import Layout from '../Layout';
import './style.css';

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
                dis_Id_Distrito: this.infoSesion.dis_Id_Distrito,
                sec_Id_Sector: this.infoSesion.sec_Id_Sector,
                usu_Id_Usuario: this.infoSesion.pem_Id_Ministro
            }
        })
        if (this.props.mat_Id_MatrimonioLegalizacion === "0") {
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
                    dis_Id_Distrito: this.infoSesion.dis_Id_Distrito,
                    sec_Id_Sector: this.infoSesion.sec_Id_Sector,
                    usu_Id_Usuario: this.infoSesion.pem_Id_Ministro
                }
            })
        }
        else {
            helpers.authAxios.get(helpers.url_api + "/Matrimonio_Legalizacion/" + this.props.mat_Id_MatrimonioLegalizacion)
            .then(res => {
                res.data.matrimonioLegalizacion.mat_Fecha_Boda_Civil = helpers.reFormatoFecha(res.data.matrimonioLegalizacion.mat_Fecha_Boda_Civil);
                res.data.matrimonioLegalizacion.mat_Fecha_Boda_Eclesiastica = helpers.reFormatoFecha(res.data.matrimonioLegalizacion.mat_Fecha_Boda_Eclesiastica)
                this.setState({ 
                    matLegal: res.data.matrimonioLegalizacion,
                    bolForaneoHombre: res.data.matrimonioLegalizacion.mat_Nombre_Contrayente_Hombre_Foraneo !== "" ? true : false,
                    bolForaneoMujer: res.data.matrimonioLegalizacion.mat_Nombre_Contrayente_Mujer_Foraneo !== "" ? true : false
                })
                this.getHombres(res.data.matrimonioLegalizacion.mat_Tipo_Enlace);
                this.getMujeres(res.data.matrimonioLegalizacion.mat_Tipo_Enlace);
            });
        }
    }

    getHombres = async (str) => {
        if (str === "MATRIMONIO") {
            await helpers.authAxios.get(this.url + "/Matrimonio_Legalizacion/GetHombresPorSectorParaMatrimonio/" + this.infoSesion.sec_Id_Sector)
                .then(res => {
                    this.setState({
                        hombres: res.data.hombresParaMatrimonio
                    })
                })
        }
        else {
            await helpers.authAxios.get(this.url + "/Matrimonio_Legalizacion/GetHombresPorSectorParaLegalizacion/" + this.infoSesion.sec_Id_Sector)
                .then(res => {
                    this.setState({
                        hombres: res.data.hombresParaLegalizacion
                    })
                })
        }
    }

    getMujeres = async (str) => {
        if (str === "MATRIMONIO") {
            await helpers.authAxios.get(this.url + "/Matrimonio_Legalizacion/GetMujeresPorSectorParaMatrimonio/" + this.infoSesion.sec_Id_Sector)
                .then(res => {
                    this.setState({
                        mujeres: res.data.mujeresParaMatrimonio
                    })
                })
        }
        else {
            await helpers.authAxios.get(this.url + "/Matrimonio_Legalizacion/GetMujeresPorSectorParaLegalizacion/" + this.infoSesion.sec_Id_Sector)
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

    render() {
        const {
            handle_CancelaCaptura
        } = this.props

        const handle_Submit = async (e) => {
            e.preventDefault();
            if (this.props.mat_Id_MatrimonioLegalizacion === "0") {
                try {
                    await helpers.authAxios.post(helpers.url_api + "/Matrimonio_Legalizacion/", this.state.matLegal)
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
            else {
                try {
                    await helpers.authAxios.put(helpers.url_api + "/Matrimonio_Legalizacion/" + this.props.mat_Id_MatrimonioLegalizacion, this.state.matLegal)
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