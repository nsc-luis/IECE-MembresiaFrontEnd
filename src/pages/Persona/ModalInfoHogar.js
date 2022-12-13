import React, { Component } from 'react';
import helpers from '../../components/Helpers';
import {
    Button, Input, Alert, Container, Row, Col, Card,
    Form, FormGroup, Label, CardHeader, CardTitle, CardBody, CardFooter
} from 'reactstrap';

class ModalInfoHogar extends Component {

    url = helpers.url_api;

    constructor(props) {
        super(props);
        this.state = {
            domicilioLocalizado: false
        }
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
                                        {objPersona.miembros[0].per_Nombre} {objPersona.miembros[0].per_Apellido_Paterno} {objPersona.miembros[0].per_Apellido_Materno}
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
                                    <strong>Calle: </strong>{objPersona.domicilio[0].hd_Calle}, <strong>No.: </strong>{objPersona.domicilio[0].hd_Numero_Exterior}, <strong>Interior: </strong>{objPersona.domicilio[0].hd_Numero_Interior},
                                    <br />
                                    {/* <strong>Tipo subdivision: </strong> */}{objPersona.domicilio[0].hd_Tipo_Subdivision}, {/* <strong>Subdivision: </strong> */}{objPersona.domicilio[0].hd_Subdivision}
                                    <br />
                                    {/* <strong>Localidad: </strong>{objPersona.domicilio[0].hd_Localidad}, 
                            <br /> */}
                                    <strong>Municipio/cuidad: </strong>{objPersona.domicilio[0].hd_Municipio_Ciudad},
                                    <br />
                                    <strong>Pais: </strong>{objPersona.domicilio[0].pais_Nombre_Corto}, <strong>Estado: </strong>{objPersona.domicilio[0].est_Nombre}
                                    <br />
                                    <strong>Telefono: </strong>{objPersona.domicilio[0].hd_Telefono}
                                    <br />
                                    <strong>Estado del hogar: </strong>{objPersona.domicilio[0].hd_Activo ? <span className="hogarActivo">ACTIVO</span> : <span className="hogarInactivo">INACTIVO</span>}
                                </>
                            }
                            {!objPersona.domicilio.length > 0 &&
                                <>
                                    <Alert
                                        color="warning">
                                        No se encontro el domicilio debido a que el pais seleccionado no tiene estado. <br />
                                        Comuniquese con el personal de soporte.
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
                                    <th>Miembro</th>
                                    <th>Jerarquia</th>
                                </tr>
                            </thead>
                            <tbody>
                                {objPersona.miembros.length > 0 &&
                                    <>
                                        {objPersona.miembros.map((miembro) => {
                                            return (
                                                <tr key={miembro.per_Id_Persona}>
                                                    <td>{miembro.per_Nombre} {miembro.per_Apellido_Paterno} {miembro.per_Apellido_Materno} </td>
                                                    <td> {miembro.hp_Jerarquia} </td>
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