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
            foto: "",
            direccion: ""
        }
        this.objPersona = JSON.parse(localStorage.getItem('objPersona'));
        this.bautizado = this.objPersona.persona.per_Bautizado ? 'Bautizado' : 'No Bautizado';
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

        //Se trae la Data de la Persona que se le pasó desde el Componente Padre
        const {persona} = this.props.location
        this.getDireccion(persona.hogar.hd_Id_Hogar);
    }

    getHistorial = async (id) => {
        await helpers.authAxios.get(this.url + "/Historial_Transacciones_Estadisticas/" + id)
            .then(res => {
                this.setState({ historial: res.data.info });
            })
    }

    //Fn que llama la API que trae la Dirección con multi-nomenclatura por países, ésta se ejecuta en el componentDidMount
    getDireccion = async (id) => {
        await helpers.authAxios.get(this.url + "/HogarDomicilio/" + id)
            .then(res => {
                this.setState({ direccion: res.data.direccion });
            })
    }

    render() {

        return (


            <>
                <Container>
                    <FormGroup>
                        <Row>
                            <Col xs="12">
                                {!this.state.domicilioLocalizado > 0 &&
                                    <>
                                        <Alert
                                            color="warning">
                                            No se encontró el domicilio debido a que el país seleccionado no tiene Estado registrado. <br />
                                            Comuníquese con el personal de soporte.
                                        </Alert>
                                    </>
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col className="negrita" xs="1">Nombre:</Col>
                            <Col xs="7" className="border border-dark"> 
                                {this.objPersona.persona.per_Nombre} 
                                {this.objPersona.persona.per_Apellido_Paterno}
                                {this.objPersona.persona.per_Apellido_Materno} 
                            </Col>
                            <Col className="negrita campoVivo" xs="2">
                                {this.objPersona.persona.per_Vivo &&
                                    <span className="fa fa-check faIconMarginRight"></span>
                                }
                                {!this.objPersona.persona.per_Vivo &&
                                    <span className="fa fa-times faIconMarginRight"></span>
                                }
                                Vivo
                            </Col>
                            <Col >
                                <img className="fotoPersona fotoAnalisis d-block mx-auto" src={this.state.foto} />
                            </Col>

                        </Row>
                    </FormGroup>
                    <FormGroup>
                        <Row>
                            <Col className="negrita" xs="1">Grupo:</Col>
                            <Col xs="2" className="border border-dark"> {this.bautizado.toUpperCase()} </Col>
                            <Col className="negrita" xs="2"></Col>
                            <Col className="negrita" xs="1">Categoria:</Col>
                            <Col xs="2" className="border border-dark"> {this.objPersona.persona.per_Categoria} </Col>
                            <Col className="negrita" xs="2">
                                {this.objPersona.persona.per_En_Comunion &&
                                    <span className="fa fa-check faIconMarginRight"></span>
                                }
                                {!this.objPersona.persona.per_En_Comunion &&
                                    <span className="fa fa-times faIconMarginRight"></span>
                                }
                                En comunión
                            </Col>
                        </Row>
                    </FormGroup>
                    <FormGroup>
                        <Row>
                            <Col className="negrita" xs="1">Edad:</Col>
                            <Col xs="2" className="border border-dark"> {this.objPersona.persona.edad} </Col>
                            <Col className="negrita" xs="2"></Col>
                            <Col className="negrita" xs="1">Est. Civil:</Col>
                            <Col xs="2" className="border border-dark"> {this.objPersona.persona.per_Estado_Civil} </Col>
                            <Col className="negrita" xs="1">
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
                            <Col className="negrita" xs="1">Dirección:</Col>
                            <Col xs="7" className="border border-dark">
                                {this.state.domicilioLocalizado &&
                                    <>
                                        {this.state.direccion}
                                        {/* {this.objPersona.domicilio[0].hd_Calle} {this.objPersona.domicilio[0].hd_Numero_Exterior}, Int. {this.objPersona.domicilio[0].hd_Numero_Interior},
                                        {this.objPersona.domicilio[0].hd_Tipo_Subdivision} {this.objPersona.domicilio[0].hd_Subdivision} */}
                                    </>
                                }
                                {!this.state.domicilioLocalizado &&
                                    <>Sin información para mostrar.</>
                                }
                            </Col>
                            <Col className="negrita" xs="2">
                                {this.objPersona.persona.per_Bautizado &&
                                    <span className="fa fa-check faIconMarginRight"></span>
                                }
                                {!this.objPersona.persona.per_Bautizado &&
                                    <span className="fa fa-times faIconMarginRight"></span>
                                }
                                Bautizado
                            </Col>
                        </Row>
                    </FormGroup>
                    {/* <FormGroup>
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
                    </FormGroup> */}
                    <FormGroup>
                        <Row>
                            <Col className="negrita" xs="1">Teléfonos:</Col>
                            <Col xs="3" className="border border-dark">
                                {this.objPersona.persona.per_Telefono_Movil !== null &&
                                    <>
                                        Cel: {this.objPersona.persona.per_Telefono_Movil} - {" "}
                                    </>
                                }
                                {this.state.domicilioLocalizado && this.objPersona.domicilio[0].hd_Telefono !== null &&
                                    <>
                                     Casa: {this.objPersona.domicilio[0].hd_Telefono}
                                    </>
                                }
                            </Col>
                            <Col className="negrita" xs="1"></Col>
                            <Col className="negrita" xs="1">Email:</Col>
                            <Col xs="3" className="border border-dark"> {this.objPersona.persona.per_Email_Personal} </Col>
                            <Col xs="7"> </Col>
                        </Row>
                    </FormGroup>
                    <FormGroup>
                        <Row>
                            <Col className="negrita" xs="1">Prof./Ofi1:</Col>
                            <Col xs="3" className="border border-dark"> {this.objPersona.persona.profesionOficio1[0].pro_Sub_Categoria} </Col>
                            <Col className="negrita" xs="1"></Col>
                            <Col className="negrita" xs="1">Prof./Ofi2:</Col>
                            <Col xs="3" className="border border-dark"> {this.objPersona.persona.profesionOficio2[0].pro_Sub_Categoria} </Col>
                        </Row>
                    </FormGroup>
                    <FormGroup className="pt-2">
                        <Row >
                            <Col xs="12" >
                                <h5 className="font-weight-bold">Historial Personal</h5>
                            </Col>
                        </Row>
                    </FormGroup>

                    <table className="table table-striped border bt-0">
                        <thead className="bg-info">
                            <tr>
                                <th style={{ width: "10%" }}>Fecha</th>
                                <th style={{ width: "12%" }}>Tipo_Mov</th>
                                <th style={{ width: "15%" }}>SubTipo_Mov</th>
                                <th style={{ width: "12%" }}>Comentarios</th>
                                <th style={{ width: "25%" }}>Sector</th>
                                <th style={{ width: "25%" }}>Distrito</th>
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
            </>
        )
    }
}

export default AnalisisPersonal;