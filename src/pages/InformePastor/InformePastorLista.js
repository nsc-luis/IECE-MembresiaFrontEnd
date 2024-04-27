import React, { Component } from 'react';
import helpers from "../../components/Helpers";
import {
    Container, Button, Input, Modal, ModalBody, Label, Alert, CardFooter,
    CardTitle, Card, CardBody, Table, Row, Col, FormFeedback, Form, FormGroup, CardHeader
} from 'reactstrap';
import { Link } from 'react-router-dom';

class InformePastorLista extends Component {
    infoSesion = JSON.parse(localStorage.getItem('infoSesion'));
    maxAnio = new Date().getFullYear() + 1;
    constructor(props) {
        super(props);
        this.state = {
            sector: {
                sec_Numero: 0,
                sec_Alias: '',
                sec_Id_Sector: 0
            },
            distrito: {
                dis_Numero: 0,
                dis_Alias: '',
                dis_Id_Distrito: 0
            },
            showForm: false,
            mensajeDelProceso: "Procesando...",
            modalShow: false,
            informes: [],
            nuevoInforme: {
                idInforme: 0,
                idTipoUsuario: 1, //1 Pastor 2 Obispo
                mes: null,
                anio: null,
                idDistrito: 0,
                idSector: 0,
                lugarReunion: null,
                fechaReunion: null,
                status: 0,
                usu_id_usuario: 0,
                fechaRegistro: new Date().toDateString(),
            }
        }
    }

    componentDidMount() {
        // this.obtenerDatosEstadisticos();
        this.getDistrito();
        this.getSector();
        this.obtenerInformes();
        helpers.handle_LinkEncabezado("Seccion: Informes", "Listado de Informes Pastorales")
        console.log(this.infoSesion);
    }

    //Data
    getDistrito = async () => {
        await helpers.validaToken().then(helpers.authAxios.get('/Distrito/' + localStorage.getItem('dto'))
            .then(res => {
                this.setState({
                    distrito: res.data,
                    nuevoInforme: {
                        ...this.state.nuevoInforme,
                        idDistrito: res.data.dis_Id_Distrito,
                        usu_id_usuario: this.infoSesion.pem_Id_Ministro
                    }
                })
                console.log(res.data);
            })
        );
    }

    getSector = async () => {
        await helpers.validaToken().then(helpers.authAxios.get('/Sector/' + localStorage.getItem('sector'))
            .then(res => {
                this.setState({
                    sector: res.data.sector[0],
                    nuevoInforme: {
                        ...this.state.nuevoInforme,
                        idSector: res.data.sector[0].sec_Id_Sector,
                    }
                })
                console.log(res.data);
            })
        );
    }

    obtenerInformes = async () => {
        await helpers.validaToken().then(helpers.authAxios.get("/Informe?idTipoUsuario=1")
            .then(res => {
                console.log(res);
                this.setState({ informes: res.data })
            })
        );
    }

    insertarInforme = async (e) => {
        e.preventDefault()

        await helpers.validaToken().then(helpers.authAxios.post("/Informe", this.state.nuevoInforme)
            .then(res => {
                if (res.status === 200) {
                    this.obtenerInformes();
                    this.handleCancelar();
                    this.setState({
                        nuevoInforme: {
                            idInforme: 0,
                            idTipoUsuario: 1,
                            mes: 0,
                            anio: 0,
                            lugarReunion: '',
                            fechaReunion: new Date().toDateString(),
                            status: 0,
                            usu_id_usuario: 0,
                            fechaRegistro: new Date().toDateString(),
                        }
                    })
                    console.log(res);
                }
                else {
                    alert(res.data.mensaje)
                }
            })
        )
    }

    //Utils
    mostrarFormulario = () => {
        this.setState({ showForm: !this.state.showForm })
    }

    handleCancelar = () => {
        window.scrollTo(0, 0);
        this.setState({
            showForm: !this.state.showForm
        })
    }

    handleChange(event) {
        event.persist();
        console.log(event);
        const { name, value } = event.target;

        // Divide el nombre para obtener un array de claves
        const keys = name.split('.');

        // Crea una copia profunda del estado actual
        const newState = { ...this.state };

        // Utiliza las claves para acceder al objeto específico que deseas actualizar
        let currentObject = newState;
        for (let i = 0; i < keys.length - 1; i++) {
            currentObject = currentObject[keys[i]];
        }

        // Actualiza la propiedad específica
        currentObject[keys[keys.length - 1]] = value;

        // Actualiza el estado con la nueva copia
        this.setState(newState);
        console.log(newState);
    }

    render() {
        return (
            <Container>
                <FormGroup>
                    <Row>
                        <Col xs="12" style={{ textAlign: 'right' }}>
                            <Button
                                type="button"
                                color="primary"
                                onClick={this.mostrarFormulario}
                                hidden={this.state.showForm}
                            >
                                Crear un nuevo Informe
                            </Button>
                        </Col>
                    </Row>
                </FormGroup>

                {this.state.showForm &&
                    <FormGroup>
                        <Card>
                            <Form onSubmit={this.insertarInforme}>
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
                                        <Row className='align-items-center'>
                                            <Col xs="2" className='my-1 text-right'>
                                                * AÑO:
                                            </Col>
                                            <Col xs="2" className='my-1'>
                                                <Input type='number' min={2000} max={this.maxAnio}
                                                    name='nuevoInforme.anio'
                                                    value={this.state.nuevoInforme.anio}
                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                <FormFeedback>Este campo es requerido</FormFeedback>
                                            </Col>
                                            <Col xs="2" className='my-1 text-right'>
                                                * MES:
                                            </Col>
                                            <Col xs="2" className='my-1'>
                                                <Input type='number' min={1} max={12}
                                                    name='nuevoInforme.mes'
                                                    value={this.state.nuevoInforme.mes}
                                                    onChange={(e) => this.handleChange(e)}></Input>
                                                <FormFeedback>Este campo es requerido</FormFeedback>
                                            </Col>
                                            <Col xs="4"></Col>
                                            <Col xs="2" className='my-1 text-right'>
                                                * FECHA DE REUNIÓN:
                                            </Col>
                                            <Col xs="2" className='my-1'>
                                                <Input
                                                    type="date"
                                                    name="nuevoInforme.fechaReunion"
                                                    value={this.state.nuevoInforme.fechaReunion}
                                                    onChange={(e) => this.handleChange(e)}
                                                    autoComplete="nope"
                                                />
                                                <FormFeedback>Este campo es requerido</FormFeedback>
                                            </Col>
                                            <Col xs="2" className='my-1 text-right'>
                                                * LUGAR DE REUNIÓN:
                                            </Col>
                                            <Col xs="4" className='my-1'>
                                                <Input type='text'
                                                    name='nuevoInforme.lugarReunion'
                                                    value={this.state.nuevoInforme.lugarReunion}
                                                    onChange={(e) => this.handleChange(e)}></Input>
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
                                                <span className="fa fa-plus faIconMarginRight"></span>Crear Informe
                                            </Button>
                                        </Col>
                                    </Row>
                                </CardFooter>
                            </Form>
                        </Card>
                    </FormGroup>
                }

                <Card>
                    <CardHeader style={{ textAlign: "center" }}>
                        <h4>Informes Mensuales del sector: #{this.state.sector.sec_Numero} - {this.state.sector.sec_Alias}</h4>
                    </CardHeader>
                    <FormGroup>
                        <CardBody>
                            <table className="table table-striped table-bordered table-sm">
                                <thead className="text-center bg-gradient-info">
                                    <tr>
                                        <th width="33%">AÑO</th>
                                        <th width="33%">MES</th>
                                        <th width="33%">ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.informes.length > 0 &&
                                        this.state.informes.map((obj) => (
                                            <tr key={obj.idInforme}>
                                                <td>{obj.anio}</td>
                                                <td>{obj.mes}</td>
                                                <td className='text-center'>
                                                    <Link to={{
                                                        pathname: "/InformePastor/" + obj.idInforme,
                                                        id: obj.idInforme
                                                    }} className="btn btn-info btn-sm" onClick={() => helpers.handle_LinkEncabezado("Seccion: Informes", "Informe Pastoral")}>
                                                        Detalles
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </CardBody>
                    </FormGroup >
                </Card>

                {this.state.informes.length < 1 &&
                    <h4>
                        No hay informes registrados en este Sector.
                    </h4>
                }

                {/*Modal success*/}
                <Modal isOpen={this.state.modalShow}>
                    <ModalBody>
                        {this.state.mensajeDelProceso}
                    </ModalBody>
                </Modal>
            </Container >
        );
    }
}

export default InformePastorLista;