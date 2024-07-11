import React, { Component } from 'react';
import helpers from '../../components/Helpers';
import {
    Modal, ModalBody, ModalFooter, ModalHeader, Container, Button,
    Form, FormFeedback, FormGroup, Card, CardBody, CardHeader, CardFooter,
    Row, Input, Col, Alert, Table
} from 'reactstrap';
import DetallePersona from './DetallePersona';

export default class BuscarPersona extends Component {

    constructor(props) {
        super(props)
        this.state = {
            cadena: "",
            cadenaInvalida: false,
            showModal: false,
            personas: [],
            objetoPersona: {},
            showDetallePersona: false
        }
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    showModal = () => {
        this.setState({ showModal: !this.state.showModal })
    }

    showDetallePersona = (objeto) => {
        this.setState({
            objetoPersona: objeto,
            showDetallePersona: true
        })
    }

    hideDetallePersona = (objeto) => {
        this.setState({
            objetoPersona: {},
            showDetallePersona: false
        })
    }

    buscarCadena = async (e) => {
        e.preventDefault()
        this.setState({ cadenaInvalida: this.state.cadena === "" || this.state.cadena.length < 4 ? true : false })
        if (this.state.cadena === "" || this.state.cadena.length < 4) return false
        this.showModal()
        await helpers.validaToken().then(helpers.authAxios.post(`Persona/BuscaPersonaByNombre/${this.state.cadena}`)
            .then(res => {
                this.setState({ personas: res.data })
                this.showModal()
                if (res.data.length === 0) alert("No se encontraron resultados.")
            })
        )
    }
    render() {
        return (
            <Container>
                {this.state.showDetallePersona === false &&
                    <React.Fragment>
                        <FormGroup>
                            <Alert color="warning">
                                Los campos marcados con * son requeriddos.
                            </Alert>
                        </FormGroup>
                        <Form onSubmit={this.buscarCadena}>
                            <FormGroup>
                                <Row>
                                    <Col xs="10">
                                        <Input
                                            placeholder="Nombre, apellido paterno o materno"
                                            name="cadena"
                                            value={this.state.cadena}
                                            invalid={this.state.cadenaInvalida}
                                            onChange={this.onChange}
                                        />
                                        <FormFeedback>Este campo es requerido. No puedes estar en blanco y requiere al menos 4 letras.</FormFeedback>
                                    </Col>
                                    <Col xs="2">
                                        <Button
                                            type="submit"
                                            color="primary"
                                        >
                                            <spam className="fas fa-fw fa-search"></spam>Buscar
                                        </Button>
                                    </Col>
                                </Row>
                            </FormGroup>
                        </Form>

                        {this.state.personas.length > 0 &&
                            <React.Fragment>
                                <FormGroup>
                                    <Row>
                                        <h5>Se encontraron {this.state.personas.length} personas.</h5>
                                    </Row>
                                </FormGroup>

                                <FormGroup>
                                    <Table striped>
                                        <thead>
                                            <tr>
                                                <th width="30%">Nombre</th>
                                                <th width="10%">Grupo</th>
                                                <th width="10%">Activo</th>
                                                <th width="20%">Distrito</th>
                                                <th width="20%">Sector</th>
                                                <th width="10%"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.personas.map((obj) => {
                                                return (
                                                    <tr key={obj.persona.per_Id_Persona}>
                                                        <td>{obj.persona.per_Apellido_Paterno} {obj.persona.per_Apellido_Materno} {obj.persona.per_Nombre}</td>
                                                        <td>{obj.persona.per_Bautizado === true ? "Bautizado" : "No bautizado"}</td>
                                                        <td>{obj.persona.per_Activo === true ? "Activo" : "No activo"}</td>
                                                        <td>{obj.persona.dis_Tipo_Distrito} {obj.persona.dis_Numero}, {obj.persona.dis_Alias}</td>
                                                        <td>SECTOR {obj.persona.sec_Numero}, {obj.persona.sec_Alias}</td>
                                                        <td>
                                                            <Button
                                                                color="primary"
                                                                onClick={() => this.showDetallePersona(obj)}
                                                            >
                                                                <span className="fas fa-binoculars"></span>
                                                            </Button>
                                                            {/* <Button color="danger"><span className="fas fa-file-pdf"></span></Button> */}
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </Table>
                                </FormGroup>
                            </React.Fragment>
                        }
                    </React.Fragment>
                }

                {this.state.showDetallePersona === true &&
                    <DetallePersona
                        objetoPersona={this.state.objetoPersona}
                        hideDetallePersona={this.hideDetallePersona}
                    />
                }

                <Modal isOpen={this.state.showModal}>
                    <ModalBody>
                        <h5>Procesando...</h5>
                    </ModalBody>
                </Modal>
            </Container >
        )
    }
}