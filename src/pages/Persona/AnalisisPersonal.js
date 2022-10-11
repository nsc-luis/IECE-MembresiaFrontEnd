import React, { Component } from 'react';
import helpers from '../../components/Helpers';
import {
    Button, Input, Alert, Container, Row, Col, Card,
    Form, FormGroup, Label, CardHeader, CardTitle, CardBody, CardFooter
} from 'reactstrap';
import Layout from '../Layout';
import './style.css'

class AnalisisPersonal extends Component {

    url = helpers.url_api;

    constructor(props) {
        super(props);
        this.state = {
            historial: [],
            domicilioLocalizado: false,
            foto: ""
        }
        this.objPersona = JSON.parse(localStorage.getItem('objPersona'));
        this.bautizado = this.objPersona.persona.per_Bautizado ? 'Bautizado' : 'No bautizado';
        this.getHistorial(this.objPersona.persona.per_Id_Persona);
    }

    componentDidMount() {
        if (this.objPersona.domicilio.length > 0) {
            this.setState({ domicilioLocalizado: true })
        }
        else {
            this.setState({ domicilioLocalizado: false })
        }
        this.setState({
            foto: `${helpers.url_api}/Foto/${this.objPersona.persona.per_Id_Persona}`
        })
    }

    getHistorial = async (id) => {
        await helpers.authAxios.get(this.url + "/Historial_Transacciones_Estadisticas/" + id)
            .then(res => {
                this.setState({ historial: res.data.info });
            })
    }

    render() {
        return (
            <Layout>
                <Container>
                    <FormGroup>
                        <Row>
                            <Col xs="12">
                                {!this.state.domicilioLocalizado > 0 &&
                                    <>
                                        <Alert
                                            color="warning">
                                            No se encontro el domicilio debido a que el pais seleccionado no tiene estado. <br />
                                            Comuniquese con el personal de soporte.
                                        </Alert>
                                    </>
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col className="negrita" xs="2">Nombre:</Col>
                            <Col xs="6" className="border border-dark"> {this.objPersona.persona.per_Nombre} {this.objPersona.persona.per_Apellido_Paterno} {this.objPersona.persona.per_Apellido_Materno} </Col>
                            <Col className="negrita campoVivo" xs="2">
                                {this.objPersona.persona.per_Vivo &&
                                    <span className="fa fa-check faIconMarginRight"></span>
                                }
                                {!this.objPersona.persona.per_Vivo &&
                                    <span className="fa fa-times faIconMarginRight"></span>
                                }
                                Vivo
                            </Col>
                            <img className="fotoPersona" src={this.state.foto} width="170" height="140" />
                        </Row>
                    </FormGroup>
                    <FormGroup>
                        <Row>
                            <Col className="negrita" xs="2">Grupo:</Col>
                            <Col xs="2" className="border border-dark"> {this.bautizado} </Col>
                            <Col className="negrita" xs="2">Categoria:</Col>
                            <Col xs="2" className="border border-dark"> {this.objPersona.persona.per_Categoria} </Col>
                            <Col className="negrita" xs="2">
                                {this.objPersona.persona.per_En_Comunion &&
                                    <span className="fa fa-check faIconMarginRight"></span>
                                }
                                {!this.objPersona.persona.per_En_Comunion &&
                                    <span className="fa fa-times faIconMarginRight"></span>
                                }
                                En comunion
                            </Col>
                        </Row>
                    </FormGroup>
                    <FormGroup>
                        <Row>
                            <Col className="negrita" xs="2">Edad:</Col>
                            <Col xs="2" className="border border-dark"> {this.objPersona.persona.edad} </Col>
                            <Col className="negrita" xs="2">Estado civil:</Col>
                            <Col xs="2" className="border border-dark"> {this.objPersona.persona.per_Estado_Civil} </Col>
                            <Col className="negrita" xs="2">
                                {this.objPersona.persona.per_Activo &&
                                    <span className="fa fa-check faIconMarginRight"></span>
                                }
                                {!this.objPersona.persona.per_Activo &&
                                    <span className="fa fa-times faIconMarginRight"></span>
                                }
                                Activo
                            </Col>
                        </Row>
                    </FormGroup>
                    <FormGroup>
                        <Row>
                            <Col className="negrita" xs="2">Direccion:</Col>
                            <Col xs="6" className="border border-dark">
                                {this.state.domicilioLocalizado &&
                                    <>
                                        {this.objPersona.domicilio[0].hd_Calle} {this.objPersona.domicilio[0].hd_Numero_Exterior}, Interior: {this.objPersona.domicilio[0].hd_Numero_Interior},
                                        {this.objPersona.domicilio[0].hd_Tipo_Subdivision} {this.objPersona.domicilio[0].hd_Subdivision}
                                    </>
                                }
                                {!this.state.domicilioLocalizado &&
                                    <>Sin información para mostrar.</>
                                }
                            </Col>
                        </Row>
                    </FormGroup>
                    <FormGroup>
                        <Row>
                            <Col xs="2"></Col>
                            <Col xs="6" className="border border-dark">
                                {this.state.domicilioLocalizado &&
                                    <>
                                        {this.objPersona.domicilio[0].hd_Municipio_Ciudad}, {this.objPersona.domicilio[0].est_Nombre}, {this.objPersona.domicilio[0].pais_Nombre_Corto}
                                    </>
                                }
                                {!this.state.domicilioLocalizado &&
                                    <>Sin información para mostrar.</>
                                }
                            </Col>
                        </Row>
                    </FormGroup>
                    <FormGroup>
                        <Row>
                            <Col className="negrita" xs="2">Celular:</Col>
                            <Col xs="2" className="border border-dark">
                                {this.objPersona.persona.per_Telefono_Movil} ,
                                {this.state.domicilioLocalizado && <>{this.objPersona.domicilio[0].hd_Telefono}</>}
                            </Col>
                            <Col className="negrita" xs="2">Email:</Col>
                            <Col xs="3" className="border border-dark"> {this.objPersona.persona.per_Email_Personal} </Col>
                            <Col xs="7"> </Col>
                        </Row>
                    </FormGroup>
                    <FormGroup>
                        <Row>
                            <Col className="negrita" xs="2">Profesion/Oficio1:</Col>
                            <Col xs="4" className="border border-dark"> {/* {this.objPersona.persona.profesionOficio1[0].pro_Categoria} / */} {this.objPersona.persona.profesionOficio1[0].pro_Sub_Categoria} </Col>
                            <Col className="negrita" xs="2">Profesion/Oficio2:</Col>
                            <Col xs="4" className="border border-dark"> {/* {this.objPersona.persona.profesionOficio2[0].pro_Categoria} / */} {this.objPersona.persona.profesionOficio2[0].pro_Sub_Categoria} </Col>
                        </Row>
                    </FormGroup>
                    <FormGroup>
                        <Row>
                            <Col xs="12">
                                <h5>Historial Personal</h5>
                            </Col>
                        </Row>
                    </FormGroup>

                    <table className="table">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Tipo_Mov</th>
                                <th>SubTipo_Mov</th>
                                <th>Comentarios</th>
                                <th>Sector</th>
                                <th>Distrito</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.historial.map((registro) => {
                                    return (
                                        <React.Fragment>
                                            <tr key={registro.hte_Id_Transaccion}>
                                                <td>{helpers.reFormatoFecha(registro.hte_Fecha_Transaccion)}</td>
                                                <td>{registro.ct_Tipo}</td>
                                                <td>{registro.ct_Subtipo}</td>
                                                <td>{registro.hte_Comentario}</td>
                                                <td>{registro.sec_Alias}</td>
                                                <td>{registro.dis_Tipo_Distrito} {registro.dis_Numero}, {registro.dis_Alias}</td>
                                            </tr>
                                        </React.Fragment>
                                    )
                                })
                            }

                        </tbody>
                    </table>
                </Container>
            </Layout>
        )
    }
}

export default AnalisisPersonal;