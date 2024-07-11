import React, { Component } from 'react';
import {
    Modal, ModalBody, ModalFooter, ModalHeader, Container, Button,
    Form, FormFeedback, FormGroup, Card, CardBody, CardHeader, CardFooter,
    Row, Input, Col, Alert, Table
} from 'reactstrap';
import helpers from '../../components/Helpers';
import './style.css'

export default class DetallePersona extends Component {

    constructor(props) {
        super(props)
        this.state = {
            historiaTransaccionesEstadisticas: []
        }
    }

    componentDidMount() {
        const idPersona = this.props.objetoPersona.persona.per_Id_Persona
        this.getTransaccionesHistoricas(idPersona)
    }

    getTransaccionesHistoricas = async (id) => {
        await helpers.validaToken().then(helpers.authAxios.get(`Historial_Transacciones_Estadisticas/${id}`)
            .then(res => {
                this.setState({ historiaTransaccionesEstadisticas: res.data.info })
            })
        )
    }

    render() {
        const {
            objetoPersona,
            hideDetallePersona
        } = this.props



        return (
            <div id="areaDeImpresion">
                <FormGroup>
                    <Card>
                        <CardHeader>
                            <h3>DATOS ESTADISTICOS</h3>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col xs="6">
                                    <strong>Activo: </strong>{objetoPersona.persona.per_Activo ? "SI" : "NO"} <br />
                                    <strong>En comunion: </strong>{objetoPersona.persona.per_En_Comunion ? "SI" : "NO"} <br />
                                    <strong>Vivo: </strong>{objetoPersona.persona.per_Vivo ? "SI" : "NO"} <br />
                                    <strong>Categoria: </strong>{objetoPersona.persona.per_Categoria} <br />
                                    <strong>Nombre: </strong>{objetoPersona.persona.per_Nombre} {objetoPersona.persona.per_Apellido_Paterno} {objetoPersona.persona.per_Apellido_Materno} <br />
                                    <strong>Fecha nacimiento: </strong>{objetoPersona.persona.per_Fecha_Nacimiento} <br />
                                    <strong>Edad: </strong>{objetoPersona.persona.edad} <br />
                                    <strong>Padre: </strong>{objetoPersona.persona.per_Nombre_Padre} <br />
                                    <strong>Madre: </strong>{objetoPersona.persona.per_Nombre_Madre} <br />
                                    <strong>Abuelo paterno: </strong>{objetoPersona.persona.per_Nombre_Abuelo_Paterno} <br />
                                    <strong>Abuela paterno: </strong>{objetoPersona.persona.per_Nombre_Abuela_Paterna} <br />
                                    <strong>Abuelo materno: </strong>{objetoPersona.persona.per_Nombre_Abuelo_Materno} <br />
                                    <strong>Abuela materna: </strong>{objetoPersona.persona.per_Nombre_Abuela_Materna} <br />
                                    <strong>Tel. Movil: </strong>{objetoPersona.persona.per_Telefono_Movil} <br />
                                    <strong>Email: </strong>{objetoPersona.persona.per_Email_Personal} <br />
                                    <strong>Bautizado: </strong>{objetoPersona.persona.per_Bautizado} <br />
                                    <strong>Lugar de bautismo: </strong>{objetoPersona.persona.per_Lugar_Bautismo} <br />
                                    <strong>Fecha bautismo: </strong>{objetoPersona.persona.per_Fecha_Bautismo} <br />
                                    <strong>Ministro que bautizo: </strong>{objetoPersona.persona.per_Ministro_Que_Bautizo} <br />
                                    <strong>Fecha recibio Espiritu Santo: </strong>{objetoPersona.persona.per_Fecha_Recibio_Espiritu_Santo} <br />
                                    <strong>Bajo imposicion de mano: </strong>{objetoPersona.persona.per_Bajo_Imposicion_De_Manos}
                                </Col>
                                <Col xs="6">
                                    <strong>Cargos desempeñados: </strong>{objetoPersona.persona.per_Cargos_Desempenados} <br />
                                    <strong>Estado civil: </strong>{objetoPersona.persona.per_Estado_Civil} <br />
                                    <strong>Conyuge: </strong>{objetoPersona.persona.per_Nombre_Conyuge} <br />
                                    <strong>Fecha boda civil: </strong>{objetoPersona.persona.per_Fecha_Boda_Civil} <br />
                                    <strong>No. de acta: </strong>{objetoPersona.persona.per_Num_Acta_Boda_Civil} <br />
                                    <strong>Libro del acta: </strong>{objetoPersona.persona.per_Libro_Acta_Boda_Civil} <br />
                                    <strong>Oficialia: </strong>{objetoPersona.persona.per_Oficialia_Boda_Civil} <br />
                                    <strong>Registro civil: </strong>{objetoPersona.persona.per_Registro_Civil} <br />
                                    <strong>Fecha boda eclesisastica: </strong>{objetoPersona.persona.per_Fecha_Boda_Eclesiastica} <br />
                                    <strong>Lugar de boda eclesiastica: </strong>{objetoPersona.persona.per_Lugar_Boda_Eclesiastica} <br />
                                    <strong>Cantidad de hijos: </strong>{objetoPersona.persona.per_Cantidad_Hijos} <br />
                                    <strong>Nombre de hijos: </strong>{objetoPersona.persona.per_Nombre_Hijos} <br />
                                    <strong>Nacionalidad: </strong>{objetoPersona.persona.per_Nacionalidad} <br />
                                    <strong>Lugar de nacimiento: </strong>{objetoPersona.persona.per_Lugar_De_Nacimiento} <br />
                                    <strong>{objetoPersona.persona.dis_Tipo_Distrito} </strong> {objetoPersona.persona.dis_Numero}, {objetoPersona.persona.dis_Alias} <br />
                                    <strong>Sector {objetoPersona.persona.sec_Numero}: </strong>{objetoPersona.persona.sec_Alias} <br />
                                    <strong>Profesion 1: </strong>{objetoPersona.persona.profesionOficio1[0].pro_Sub_Categoria}, {objetoPersona.persona.profesionOficio1[0].pro_Categoria} <br />
                                    <strong>Profesion 2: </strong>{objetoPersona.persona.profesionOficio2[0].pro_Sub_Categoria}, {objetoPersona.persona.profesionOficio2[0].pro_Categoria}
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </FormGroup>
                <FormGroup>
                    <Card>
                        <CardHeader>
                            <h3>DATOS DEL HOGAR / DOMICILIO</h3>
                        </CardHeader>
                        <CardBody>
                            <FormGroup>
                                <strong>Titular: </strong>{objetoPersona.domicilio[0].per_Nombre} {objetoPersona.domicilio[0].per_Apellido_Paterno} {objetoPersona.domicilio[0].per_Apellido_Materno} <br />
                                <strong>Domicilio: </strong>{objetoPersona.domicilio[0].hd_Calle} {objetoPersona.domicilio[0].hd_Numero_Exterior}, {objetoPersona.domicilio[0].hd_Tipo_Subdivision} {objetoPersona.domicilio[0].hd_Localidad}, {objetoPersona.domicilio[0].hd_Municipio_Ciudad} {objetoPersona.domicilio[0].est_Nombre} {objetoPersona.domicilio[0].pais_Nombre_Corto} <br />
                                <strong>Estado del domicilio: </strong>{objetoPersona.domicilio[0].hd_Activo === true ? "Activo" : "No activo"}
                            </FormGroup>

                            <FormGroup>
                                <Card>
                                    <CardHeader>
                                        <h5>MIEMBROS DEL HOGAR</h5>
                                    </CardHeader>
                                    <CardBody>
                                        <Table striped>
                                            <thead>
                                                <tr>
                                                    <th>NOMBRE</th>
                                                    <th>GRUPO</th>
                                                    <th>JERARQUIA</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {objetoPersona.miembros.map((miembro) => {
                                                    return (
                                                        <tr key={miembro.hp_Id_Hogar_Persona}>
                                                            <td>{miembro.per_Nombre} {miembro.per_Apellido_Paterno} {miembro.per_Apellido_Materno}</td>
                                                            <td>{miembro.per_Bautizado === true ? "Bautizado" : "No bautizado"}</td>
                                                            <td>{miembro.hp_Jerarquia}</td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </Table>
                                    </CardBody>
                                </Card>
                            </FormGroup>
                        </CardBody>
                    </Card>
                </FormGroup>
                <FormGroup>
                    <Card>
                        <CardHeader>
                            <h3>HISTORIAL ESTADISTICO</h3>
                        </CardHeader>
                        <CardBody>
                            <FormGroup>
                                <Table striped>
                                    <thead>
                                        <tr>
                                            <th>Fecha</th>
                                            <th>Categoria</th>
                                            <th>Tipo</th>
                                            <th>Subtipo</th>
                                            <th>Comentario</th>
                                            <th>Distrito</th>
                                            <th>Sector</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.historiaTransaccionesEstadisticas.map((hte) => {
                                            return (
                                                <tr key={hte.hte_Id_Transaccion}>
                                                    <td>{helpers.reFormatoFecha(hte.hte_Fecha_Transaccion)}</td>
                                                    <td>{hte.ct_Categoria}</td>
                                                    <td>{hte.ct_Tipo}</td>
                                                    <td>{hte.ct_Subtipo}</td>
                                                    <td>{hte.hte_Comentario}</td>
                                                    <td>{hte.dis_Tipo_Distrito} {hte.dis_Numero}</td>
                                                    <td>{hte.sec_Alias}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </Table>
                            </FormGroup>
                        </CardBody>
                    </Card>
                </FormGroup>

                <FormGroup>
                    <Button
                        onClick={hideDetallePersona}
                        className="margenDerecho"
                    >
                        <span className="fas fa-times margenDerecho"></span>
                        Cerrar
                    </Button>
                    <Button
                        onClick={() => window.print()}
                    >
                        <span className="fas fa-print margenDerecho"></span>
                        Imprimir
                    </Button>
                </FormGroup>
            </div>
        )
    }
}