import React, { Component } from 'react';
import helpers from '../../components/Helpers';
import {
    Button, Input, Alert, Container, Row, Col, Card,
    Form, FormGroup, Label, CardHeader, CardTitle, CardBody, CardFooter
} from 'reactstrap';

class ModalInfoHogar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            domicilioLocalizado: false,
            direccion: "",
            hogarDomicilio: {}
        }
    }

    componentDidMount() {
        this.getDomicilio(this.props.objPersona.hogar.hd_Id_Hogar);
    }

    getDomicilio = async (id) => {
        await helpers.validaToken().then(helpers.authAxios.get(`/HogarDomicilio/${id}`)
            .then(res => {
                if (res.data.status === "success") {
                    this.setState({
                        direccion: res.data.direccion,
                        hogarDomicilio: res.data.hogardomicilio[0]
                    });
                }
                else {
                    this.setState({
                        direccion: null,
                        hogarDomicilio: null
                    });
                }
            })
        );
    }

    render() {
        const { objPersona } = this.props

        return (
            <React.Fragment>
                <Row>
                    <Col xs="12">
                        <p>
                            {objPersona.miembros.length > 0 &&
                                <>
                                    <h5><strong>Titular: </strong>
                                        {objPersona.miembros[0].per_Nombre} {objPersona.miembros[0].apellidoPrincipal} {objPersona.miembros[0].per_Apellido_Materno}
                                    </h5>
                                </>
                            }
                            {objPersona.miembros.length === 0 &&
                                <>
                                    <h5><strong>NO HAY PERSONAS VIVAS EN EL DOMICILIO. </strong></h5>
                                </>
                            }
                            <br />
                            {objPersona.domicilio.length > 0 &&
                                <>
                                    {/* <strong>Calle: </strong>{objPersona.domicilio[0].hd_Calle}, <strong>No.: </strong>{objPersona.domicilio[0].hd_Numero_Exterior}, <strong>Interior: </strong>{objPersona.domicilio[0].hd_Numero_Interior},
                                    <br />
                                    {objPersona.domicilio[0].hd_Tipo_Subdivision}, {objPersona.domicilio[0].hd_Subdivision}
                                    <br />
                                    <strong>Municipio/cuidad: </strong>{objPersona.domicilio[0].hd_Municipio_Ciudad},
                                    <br />
                                    <strong>Pais: </strong>{objPersona.domicilio[0].pais_Nombre_Corto}, <strong>Estado: </strong>{objPersona.domicilio[0].est_Nombre}
                                    <br />
                                    <strong>Telefono: </strong>{objPersona.domicilio[0].hd_Telefono}
                                    <br /> */}
                                    <strong>Dirección: </strong>{this.state.direccion} <br />
                                    <strong>Estado del hogar: </strong>{objPersona.domicilio[0].hd_Activo ? <span className="hogarActivo">ACTIVO</span> : <span className="hogarInactivo">INACTIVO</span>}
                                </>
                            }
                            {!objPersona.domicilio.length > 0 &&
                                <>
                                    <Alert
                                        color="warning">
                                        No se encontró el domicilio debido a que el País seleccionado no tiene Estado registrado. <br />
                                        Comuníquese con el personal de Soporte.
                                    </Alert>
                                </>
                            }
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col xs="12">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th className="text-center">Grupo</th>
                                    <th>Miembro</th>
                                    <th className="text-center">Jerarquía</th>
                                    <th className="text-center">Activo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {objPersona.miembros.length > 0 &&
                                    <>
                                        {objPersona.miembros.map((miembro) => {
                                            console.log(miembro)
                                            return (
                                                <tr key={miembro.per_Id_Persona}>
                                                    <td className="text-center">{miembro.per_Bautizado ? "B" : "NB"}</td>
                                                    <td>{miembro.per_Nombre} {miembro.apellidoPrincipal} {miembro.per_Apellido_Materno} </td>
                                                    <td className="text-center"> {miembro.hp_Jerarquia} </td>
                                                    <td className="text-center">{miembro.per_Activo ? "SI" : "NO"}</td>
                                                </tr>
                                            )
                                        })
                                        }
                                    </>
                                }
                            </tbody>
                        </table>
                    </Col>
                </Row>
                <Row>
                    <Col xs="12">

                    </Col>
                </Row>

            </React.Fragment>
        )
    }
}

export default ModalInfoHogar;