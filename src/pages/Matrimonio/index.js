import React, { Component } from 'react';
import {
    Container, Row, Col, Card, CardHeader,
    CardBody, CardFooter, Form, Input, Label,
    Button, FormFeedback, Table, FormGroup,
    Modal, ModalFooter, ModalBody, ModalHeader
} from 'reactstrap';
import helpers from '../../components/Helpers';
import Layout from '../Layout';
import './style.css';
import FrmMatrimonioLegalizacion from './FrmMatrimonioLegalizacion';

class Matrimonio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            enableFrmRegistroMatLegal: false,
            listaMatrimoniosLegalizaciones: [],
            currentMatrimonioLegalizacion: {},
            modalEliminaMatrimonio: false,
            modalShow: false,
            mensajeDelProceso: "",
            mat_Id_MatrimonioLegalizacion: "0"
        }
        this.infoSesion = JSON.parse(localStorage.getItem('infoSesion'));
    }

    componentDidMount() {
        this.getListaMatrimoniosLegalizacionesPorSector();
    }

    getListaMatrimoniosLegalizacionesPorSector = async () => {
        await helpers.authAxios.get(helpers.url_api + '/Matrimonio_Legalizacion/GetBySector/' + this.infoSesion.sec_Id_Sector)
            .then(res => {
                this.setState({
                    listaMatrimoniosLegalizaciones: res.data.matrimoniosLegalizaciones
                });
            })
    }

    handle_frmMatrimonioLegalizacion = () => {
        localStorage.setItem("mat_Id_MatrimonioLegalizacion", "0")
        this.setState({ 
            enableFrmRegistroMatLegal: true,
            mat_Id_MatrimonioLegalizacion: "0"
        })
    }

    editarMatrimonioLegalizacion = (id) => {
        localStorage.setItem("mat_Id_MatrimonioLegalizacion", id)
        this.setState({ 
            enableFrmRegistroMatLegal: true,
            mat_Id_MatrimonioLegalizacion: id
        })
    }

    handle_CancelaCaptura = () => {
        this.setState({ enableFrmRegistroMatLegal: false })
    }

    modalEliminaMatrimonio = (registro) => {
        this.setState({
            currentMatrimonioLegalizacion: registro,
            modalEliminaMatrimonio: true
        });
    }

    closeModalEliminaMatrimonio = () => {
        this.setState({
            currentMatrimonioLegalizacion: {},
            modalEliminaMatrimonio: false
        });
    }

    eliminaMatrimonio = async(id) => {
        console.log(id);
        try {
            await helpers.authAxios.delete(helpers.url_api + "/Matrimonio_Legalizacion/" + id)
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
                                mensajeDelProceso: "Los datos fueron eliminados satisfactoriamente."
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

    componentWillUnmount() {
        localStorage.removeItem("mat_Id_MatrimonioLegalizacion");
    }

    render() {
        if (this.state.listaMatrimoniosLegalizaciones.length > 0) {
            return (
                <Layout>
                    <Container>
                        {!this.state.enableFrmRegistroMatLegal &&
                            <React.Fragment>
                                {/* <Row>
                                    <h1 className="text-info">Matrimonios y legalizaciones</h1>
                                </Row> */}
                                <Row>
                                    <Col sm="8"></Col>
                                    <Col sm="4">
                                        <Button
                                            onClick={this.handle_frmMatrimonioLegalizacion}
                                            color="primary"
                                            size="sm"
                                            className="btnNuevoRegistro">
                                            Registrar nuevo matrimonio/legalización
                                        </Button>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm="12">
                                        <Table>
                                            <thead>
                                                <tr>
                                                    <th>Conyuge hombre</th>
                                                    <th>Conyuge mujer</th>
                                                    <th>Tipo de enlace</th>
                                                    <th>Sector</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    this.state.listaMatrimoniosLegalizaciones.map((matLeg) => {
                                                        return (
                                                            <React.Fragment key={matLeg.mat_Id_MatrimonioLegalizacion}>
                                                                <tr>
                                                                    <td> {matLeg.mat_NombreConyugeHombre} </td>
                                                                    <td> {matLeg.mat_NombreConyugeMujer} </td>
                                                                    <td> {matLeg.mat_Tipo_Enlace} </td>
                                                                    <td> Sector {matLeg.sec_Numero}: {matLeg.sec_Alias} </td>
                                                                    <td>
                                                                        <Button
                                                                            color="success"
                                                                            size="sm"
                                                                            onClick={() => this.editarMatrimonioLegalizacion(matLeg.mat_Id_MatrimonioLegalizacion)}
                                                                        >
                                                                            <span className="fas fa-pencil-alt icon-btn-p"></span>Editar
                                                                        </Button>
                                                                        <Button
                                                                            color="danger"
                                                                            size="sm"
                                                                            onClick={() => this.modalEliminaMatrimonio(matLeg)}
                                                                        >
                                                                            <span className="fas fa-trash-alt icon-btn-p"></span>Eliminar
                                                                        </Button>
                                                                    </td>
                                                                </tr>
                                                            </React.Fragment>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                                <Modal isOpen={this.state.modalEliminaMatrimonio}>
                                    <ModalHeader>
                                        <h4>Borrar enlace conyugal</h4>
                                    </ModalHeader>
                                    <ModalBody>
                                        A continuación se borrara el enlace: {this.state.currentMatrimonioLegalizacion.mat_Tipo_Enlace}, entre: <br />
                                        {this.state.currentMatrimonioLegalizacion.mat_NombreConyugeHombre} y {this.state.currentMatrimonioLegalizacion.mat_NombreConyugeMujer}. <br />
                                        ¿Desea continuar?
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button
                                            color="danger"
                                            onClick={this.closeModalEliminaMatrimonio}
                                        >
                                            No
                                        </Button>
                                        <Button
                                            color="primary"
                                            onClick={() => this.eliminaMatrimonio(this.state.currentMatrimonioLegalizacion.mat_Id_MatrimonioLegalizacion)}
                                        >
                                            Si
                                        </Button>
                                    </ModalFooter>
                                </Modal>
                            </React.Fragment>
                        }
                        {this.state.enableFrmRegistroMatLegal &&
                            <FrmMatrimonioLegalizacion
                                handle_CancelaCaptura={this.handle_CancelaCaptura}
                                mat_Id_MatrimonioLegalizacion={this.state.mat_Id_MatrimonioLegalizacion}
                            />
                        }
                    </Container>
                    <Modal isOpen={this.state.modalShow}>
                        <ModalBody>
                            {this.state.mensajeDelProceso}
                        </ModalBody>
                    </Modal>
                </Layout>
            )
        }
        else {
            return (
                <Layout>
                    <Container>
                        {!this.state.enableFrmRegistroMatLegal &&
                            <React.Fragment>
                                {/* <Row>
                                    <h1 className="text-info">Matrimonios y legalizaciones</h1>
                                </Row> */}
                                <Row>
                                    <Col sm="8"></Col>
                                    <Col sm="4">
                                        <Button
                                            onClick={this.handle_frmMatrimonioLegalizacion}
                                            color="primary"
                                            size="sm"
                                            className="btnNuevoRegistro">
                                            Registrar nuevo matrimonio/legalización
                                        </Button>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm="12">
                                        <h3>Aun no hay matrimonios/legalizaciones registrados!</h3>
                                        <p>Haga clic en el boton Registrar para registrar un nuevo matrimonio/legalizacion.</p>
                                    </Col>
                                </Row>
                            </React.Fragment>
                        }
                        {this.state.enableFrmRegistroMatLegal &&
                            <FrmMatrimonioLegalizacion
                                handle_CancelaCaptura={this.handle_CancelaCaptura}
                            />
                        }
                    </Container>
                </Layout>
            )
        }

    }
}

export default Matrimonio;