import React, { Component } from 'react';
import helpers from "../../components/Helpers";
import {
    Container, Button, Input, Modal, ModalBody, Alert,
    CardTitle, Card, CardBody, Table, Row, Col, FormFeedback, FormGroup, ModalHeader, ModalFooter, CardFooter
} from 'reactstrap';
import logo from '../../assets/images/IECE_LogoOficial.jpg';
import '../../assets/css/index.css';
import 'moment/dist/locale/es';

let dto = (JSON.parse(localStorage.getItem("dto")))
let sector = JSON.parse(localStorage.getItem("sector"))

class BajaPersonalMinisterial extends Component {
    constructor(props) {
        super(props);

        this.state = {
            form: {},
            modal_Procesando: false,
            modal_Confirmacion: false,
            personalMinisterial: [],
            submitBtnDisable: false,
        }
    }

    componentDidMount() {

        this.setState({
            form: {
                ...this.state.form,
                id_Ministro: "0",
                nombre_Elemento: "",
                sec_Id_Sector: localStorage.getItem("sector"),
                usu_Id_Usuario: JSON.parse(localStorage.getItem('infoSesion')).pem_Id_Ministro,
                causaDeBaja: "0",
                fechaTransaccion: ""
            }
        })

        //Sube el cursor hasta la parte superior
        window.scrollTo(0, 0);

        //Para sesión de Obispo
        if (sector == null) {


        } else { //Para sesión de Pastor

            helpers.authAxios.get("/PersonalMinisterial/GetAuxiliaresBySector/" + sector)
                .then(res => {
                    this.setState({ personalMinisterial: res.data.personalMinisterial })
                });
        }
    }

    showModal = () => {
        this.setState({ modal: !this.state.modal })
    }



    onChange = (e) => {
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        })

        if (e.target.name == "id_Ministro" && e.target.value != "0") {

            let ministro = this.state.personalMinisterial.filter((person) => person.pem_Id_Ministro == e.target.value);
            console.log("lista", ministro)
            this.setState({
                form: {
                    ...this.state.form,
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

    enviar1 = () => {
        console.log("Causa: ", this.state.form.causaDeBaja)
        if (this.state.form.id_Ministro === "0") {
            alert("Error!. Debe seleccionar primero al Elemento que desea dar de baja del Personal Ministerial ")
            return false;
        }

        if (this.state.form.fechaTransaccion === "") {
            alert("Error!. Debe seleccionar la fecha de la Baja del Elemento del Personal Ministerial")
            return false;
        }

        if (this.state.form.causaDeBaja == "0") {
            alert("Error!. Debe seleccionar la Causa de baja del Personal Ministerial ")
            return false;
        }

        this.setState({
            modal_Confirmacion: true,
        })

    }

    closemodal_Confirmacion = () => {
        this.setState({ modal_Confirmacion: false })
    }

    cancelar = () => {
        document.location.href = '/ListaDePersonal'
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
        helpers.validaToken().then(helpers.authAxios.post(`${helpers.url_api}/PersonalMinisterial/BajaDeAuxiliar`, this.state.form)
            .then(res => {
                if (res.data.status === "success") {
                    setTimeout(() => {
                        this.setState({
                            mensajeDelProceso: "Los datos fueron grabados satisfactoriamente."
                        });
                    }, 1000);
                    setTimeout(() => {
                        document.location.href = '/ListaDePersonal'
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

    ChangeSubmitBtnDisable = (bol) => {//Sirve para evitar multiples registros por dobleclick en botón Submit
        this.setState({ submitBtnDisable: bol });
    }

    render() {
        console.log("form:", this.state.form)
        return (
            <>
                <Container fluid>
                    {/* TABLA */}
                    <Card className="card" id="pdf">
                        <CardTitle className="text-center card-header text-gray-900" tag="h3">
                            <Row className="text-center text-gray-900">

                                <Col>
                                    BAJA DEL PERSONAL MINISTERIAL (AUXILIARES)
                                </Col>
                            </Row>
                        </CardTitle>
                        <CardBody>
                            <>
                                <Row className=' mb-5'>
                                    <div className="col col-md-2"></div>
                                    <div className="col col-md-3">
                                        <label><h6>Seleccione el Elemento a dar de Baja del Personal Ministerial:</h6></label>
                                    </div>
                                    <div className="col col-md-4">
                                        <Input
                                            type="select"
                                            name="id_Ministro"
                                            onChange={this.onChange}
                                            className="form-control "
                                            value={this.state.form.id_Ministro}
                                        >
                                            <option value="0">SELECCIONE LA PERSONA</option>
                                            {this.state.personalMinisterial.map((persona) => {
                                                return <React.Fragment key={persona.pem_Id_Ministro}>
                                                    <option value={persona.pem_Id_Ministro}> {persona.pem_Nombre} </option>
                                                </React.Fragment>
                                            }
                                            )}
                                        </Input>
                                    </div>
                                    <div className="col col-md-3"></div>
                                </Row>

                                <Row className=' mb-5'>
                                    <div className="col col-md-2"></div>
                                    <div className="col col-md-3">
                                        <label><h6>Causa de la Baja del Auxiliar:</h6></label>
                                    </div>
                                    <div className="col col-md-4">
                                        <Input
                                            type="select"
                                            name="causaDeBaja"
                                            onChange={this.onChange}
                                            className="form-control "
                                            value={this.state.form.causaDeBaja}
                                        >
                                            <option value="0">ELIJA UNA CAUSA</option>
                                            <option value="DEFUNCIÓN">DEFUNCIÓN</option>
                                            <option value="CESE">CESE</option>
                                            <option value="CESE Y EXCOMUNIÓN">CESE Y EXCOMUNIÓN</option>
                                            <option value="RENUNCIA AL MINISTERIO">RENUNCIA AL MINISTERIO</option>
                                            <option value="SUSPENCION TEMPORAL DEL MINISTERIO">SUSPENCION TEMPORAL DEL MINISTERIO</option>
                                        </Input>
                                    </div>
                                    <div className="col col-md-5"></div>
                                </Row>

                                <Row className=' mb-3'>
                                    <div className="col col-md-2"></div>
                                    <Col xs="3">
                                        <h6>Fecha de transacción:</h6>
                                    </Col>
                                    <Col xs="3">
                                        <Input
                                            type="date"
                                            name="fechaTransaccion"
                                            placeholder='DD/MM/AAAA'
                                            onChange={this.onChange}
                                            value={this.state.form.fechaTransaccion}
                                        />
                                        <FormFeedback>Este campo es requerido</FormFeedback>
                                    </Col>
                                    <div className="col col-md-4"></div>
                                </Row>
                            </>
                        </CardBody>

                        <CardFooter>
                            <Row className='mt-3'>
                                <Col className="col-md-5"></Col>
                                <Col className=" col-md-1 text-right">
                                    <Button className="btn-secondary ml-auto" onClick={this.cancelar}>
                                        Cancelar
                                    </Button>
                                </Col>
                                <Col className=" col-md-3 text-right">
                                    <Button className="btn-danger ml-auto" onClick={this.enviar1} disabled={this.submitBtnDisable}>
                                        Dar de Baja
                                    </Button>
                                </Col>
                                <Col className="col-md-3"></Col>
                            </Row>

                        </CardFooter>

                    </Card>
                </Container>
                <Modal isOpen={this.state.modal_Confirmacion} className="card">
                    <ModalHeader className="card-header">
                        <h2>Confirmación</h2>
                    </ModalHeader>
                    <ModalBody className="card-body">
                        <div >
                            <div >
                                <p>¿Estas seguro de querer dar de Baja a <strong> {this.state.form.nombre_Elemento} </strong>del Personal Ministerial?</p>
                            </div>
                        </div>
                    </ModalBody>

                    <div className="modal-buttons">
                        <button className="btn btn-secondary m-3" onClick={this.closemodal_Confirmacion}>Cancelar</button>
                        <button className="btn btn-danger m-3 " onClick={this.handleContinue} disabled={this.submitBtnDisable}>Continuar</button>
                    </div>

                </Modal>
                <Modal isOpen={this.state.modal_Procesando}>
                    <ModalBody>
                        Procesando...
                    </ModalBody>
                </Modal>
            </>
        )
    }
}
export default BajaPersonalMinisterial;