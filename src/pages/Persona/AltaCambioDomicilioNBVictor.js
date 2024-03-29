import Layout from '../Layout';
import helpers from '../../components/Helpers'
import moment from 'moment';
import { Link, Redirect } from 'react-router-dom';
import {
    Container, Row, Col, Form, FormGroup, Input, Button,
    FormFeedback, CardTitle, Card, CardBody, CardHeader, CardText, Label, Alert, Table
} from 'reactstrap';

import React, {useEffect, useState } from 'react';

function AltaCambioDomicilioVictor() {
    //Estados
    const [opcionesPersonas, setOpcionesPersonas] = useState([])
    const [opcionesHogares, setOpcionesHogares] = useState([])
    const [data, setData] = useState({})
    const [transaccion, setTransaccion] = useState({})
    const [hogar, setHogar] = useState(null)
    const [jerarquia, setJerarquia] = useState(null)
    const [miembrosHogar, setMiembrosHogar] = useState([])
    const [mostrarHogar, setMostrarHogar] = useState(false)
    const [paises, setPaises] = useState([])
    const [estados, setEstados] = useState([])

    const user = JSON.parse(localStorage.getItem('infoSesion'))
    const dto = JSON.parse(localStorage.getItem("dto"))
    const sector = JSON.parse(localStorage.getItem("sector"))

    //LLamadas en renderizado
    useEffect(() => {
        helpers.authAxios.get(`/Persona/GetPersonaCambioDomicilio/${sector}/false`)
            .then(res => {
                setOpcionesPersonas(res.data.personas)
                console.log(opcionesPersonas)
            });
    }, [opcionesPersonas.length]);

    useEffect(() => {
        helpers.authAxios.get("/HogarDomicilio/GetBySector/" + sector)
            .then(res => {
                setOpcionesHogares(res.data.domicilios)
                console.log(opcionesHogares)
            });
    }, [opcionesHogares.length]);

    useEffect(() => {
        helpers.authAxios.get("/pais")
            .then(res => {
                setPaises(res.data)
                console.log(paises)
            });
    }, [paises.length]);

    //Manejo de eventos de datos generales
    const handlePersona = (value) => {
        helpers.authAxios.get(`/Persona/${value}`)
            .then(res => {
                setData(res.data)
            })
            .then(() => {
                if(data.dis_Id_Distrito === dto){
                    setData( prevState => ({
                        ...prevState,
                        per_Activo: true,
                        per_En_Comunion: false,
                        per_Visibilidad_Abierta: false,
                        ct_Codigo_Transaccion: 12002,
                        procedencia: `${value.sec_Alias}`
                    }))
                }else{
                    setData( prevState => ({
                        ...prevState,
                        per_Activo: true,
                        per_En_Comunion: false,
                        per_Visibilidad_Abierta: false,
                        ct_Codigo_Transaccion: 12003,
                        procedencia: `${value.sec_Alias}`
                    }))
                }
            })
    };
    const handleProcedencia = (value) => {
        setData( prevState => ({
            ...prevState,
            procedencia: value
        }))
        console.log(value);
    };
    const handleFechaTransaccion = (value) => {
        console.log(value)
        if(value == "") setMostrarHogar(false)
    
        setTransaccion( prevState => ({
            ...prevState,
            fecha_transaccion: value
        }))
    };

    //Manejo de eventos de hogar
    const handleHogar = (value) => {
        if(value == 0){
            setHogar(null)
        }
        helpers.authAxios.get(`/Hogar_Persona/GetDatosHogarDomicilio/${value}`)
            .then(res => {
                setHogar(res.data[0])
            });
        helpers.authAxios.get(`/Hogar_Persona/GetMiembros/${value}`)
            .then(res => {
                setMiembrosHogar(res.data)
            });
            console.log(hogar)
            console.log(miembrosHogar)

    };
    const handleJerarquia = (value) => {
        setJerarquia(value)
    };
    const handlePais = (value) => {
        helpers.authAxios.get(`/Estado/GetEstadoByIdPais/${value}`)
            .then(res => {
                setEstados(res.data.estados)
            });
    };
    const handleEstado = (value) => {
    };
    
    //Validaciones
    const validarDatosPersona = () => {
        if(!data.per_Id_Persona || data.per_Id_Persona == 0){
            alert('Seleccione una persona')
            return
        };
        if(transaccion.fecha_transaccion == null || !transaccion.fecha_transaccion ){
            alert('Seleccione una fecha para la transacción')
            return
        }
        setMostrarHogar(true)
    };
    //Pruebas
    const postData = () => {
        if(jerarquia == null && hogar ){
            alert('Seleccione una jerarquia en el hogar')
            return
        }
        let formattedData = {}

        if(hogar){
            formattedData = {
                // id: 0,
                per_Id_Persona: data.per_Id_Persona,
                sec_Id_Sector: sector,
                ct_Codigo_Transaccion: data.ct_Codigo_Transaccion, 
                Usu_Usuario_Id: user.pem_Id_Ministro,
                hte_Fecha_Transaccion: transaccion.fecha_transaccion,
                hte_Comentario: data.procedencia,
                jerarquia: jerarquia,
                hp_Id_Hogar_Persona: hogar.hd_Id_Hogar,
            }
            console.log(formattedData)
            helpers.authAxios.post(`/Historial_Transacciones_Estadisticas/AltaCambioDomicilioReactivacionRestitucion_HogarExistente`, formattedData)
            .then(res => {
                console.log(res)
                document.location.href = '/Main';
            });
        }else{
            formattedData = {
                // id: 0,
                per_Id_Persona: data.per_Id_Persona,
                sec_Id_Sector: sector,
                ct_Codigo_Transaccion: data.ct_Codigo_Transaccion, 
                Usu_Usuario_Id: user.pem_Id_Ministro,
                hte_Fecha_Transaccion: transaccion.fecha_transaccion,
                hte_Comentario: data.procedencia,
                HD: {
                    hd_Calle: data.hd_Calle,
                    hd_Numero_Exterior: data.hd_Numero_Exterior,
                    hd_Numero_Interior: data.hd_Numero_Interior,
                    hd_Tipo_Subdivision: data.hd_Tipo_Subdivision,
                    hd_Subdivision: data.hd_Subdivision,
                    hd_Localidad: data.hd_Localidad,
                    hd_Municipio_Ciudad: data.hd_Municipio_Ciudad,
                    pais_Id_Pais: data.pais_Id_Pais,
                    est_Id_Estado: data.est_Id_Estado,
                    hd_Telefono: data.hd_Telefono,
                    dis_Id_Distrito: dto,
                    sec_Id_Sector: sector,
                    usu_Id_Usuario: user.pem_Id_Ministro,
                    Fecha_Registro: moment().format("YYYY-MM-DD"),
                }
            }
            console.log(formattedData)
            helpers.authAxios.post(`/Historial_Transacciones_Estadisticas/AltaCambioDomicilioReactivacionRestitucion_NuevoDomicilio`, formattedData)
                .then(res => {
                    console.log(res)

                    document.location.href = '/Main';
                });
        }
    };
    return(
        <>
            <Container>
                <Card body className="mb-5">
                    <CardTitle className="text-center" tag="h4">
                        Alta Cambio de Domicilio Personal No Bautizado
                    </CardTitle>
                    <Form>
                        <FormGroup row>
                            <Label for='NombrePersona' sm={3}>
                                <h5>Persona: </h5>
                            </Label>
                            <Col sm={9}>
                                <Input
                                id='NombrePersona'
                                name='nombre'
                                type='select'
                                onChange={e => {handlePersona(e.target.value)}}>
                                <option value="0" selected disabled>Selecionar persona...</option>
                                {opcionesPersonas.map(persona => (
                                    <option key={persona.per_Id_Persona} value={persona.per_Id_Persona}>{persona.per_Nombre + ' ' + persona.per_Apellido_Paterno + ' ' + persona.per_Apellido_Materno ? persona.per_Apellido_Materno : ''}</option>
                                ))}
                                </Input>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for='Procedencia' sm={3}>
                                <h5>Procedencia: </h5>
                            </Label>
                            <Col sm={9}>
                                <Input
                                id='Procedencia'
                                name='procedencia'
                                value={data.procedencia}
                                type='text'
                                onInput={(e) => handleProcedencia( e.target.value )}>
                                </Input>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for='Fecha' sm={3}>
                                <h5>Fecha de transacción: </h5>
                            </Label>
                            <Col sm={9}>
                                <Input
                                id='Fecha'
                                name='fecha'
                                type='date'
                                onChange={(e) => handleFechaTransaccion( e.target.value )}>
                                </Input>
                            </Col>
                        </FormGroup>
                        <Row className="text-center">
                            <Col>
                                <Button color="danger" size='lg'>
                                    Cancelar
                                </Button>
                            </Col>
                            <Col>
                                <Button color="primary" size='lg' onClick={e => validarDatosPersona()}>
                                    Proceder
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
                {/* Hogar */}
                { mostrarHogar &&
                <Card body className="mb-5">
                    <CardTitle className="text-center" tag="h4">
                        Hogar / Domicilio
                    </CardTitle>
                    <FormGroup row>
                        <Label for='Hogar' sm={3}>
                            <h5>Asignar a hogar: </h5>
                        </Label>
                        <Col sm={9}>
                            <Input
                            id='Hogar'
                            name='hogar'
                            type='select'
                            onChange={e => {handleHogar(e.target.value)}}>
                            <option value="0" selected>Seleccione un hogar a asignar</option>
                            {opcionesHogares.map(hogar => (
                                <option key={hogar.hd_Id_Hogar} value={hogar.hd_Id_Hogar}>{hogar.per_Nombre + ' ' + hogar.per_Apellido_Paterno + ' ' + hogar.per_Apellido_Materno}</option>
                            ))}
                            </Input>
                        </Col>
                    </FormGroup>
                    {hogar &&
                    <Form>
                        <Alert color="warning">
                            <h5><strong>ATENCION:</strong></h5>
                            <ul>
                                <li>Debe establecer una jerarquia para la persona que esta registrando, siendo la jerarquia 1 el representante del hogar.</li>
                                <li>Solo puede seleccionar una jerarquia entre 1 y la jerarquia mas baja registrada.</li>
                                {/* <li>Al establecer una jerarquia intermedia entre los miembros del hogar, se sumara 1 a los miembros con jerarquia mas baja a la establecida.</li> */}
                            </ul>
                        </Alert>

                        <h5><strong>Dirección:</strong></h5>
                        <p>{hogar.hd_Calle} #{hogar.hd_Numero_Exterior}, {hogar.hd_Localidad}, {hogar.hd_Municipio_Ciudad}, {hogar.est_Nombre}, {hogar.pais_Nombre_Corto}</p>
                        <Table hover responsive>
                            <thead>
                                <tr>
                                    <th>
                                        Miembros del hogar
                                    </th>
                                    <th>
                                        Jerarquía
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                            {miembrosHogar.map(miembro => (
                                    <tr>
                                        <td>{miembro.per_Nombre + ' ' + miembro.per_Apellido_Paterno + ' ' + miembro.per_Apellido_Materno}</td>
                                        <td>{miembro.hp_Jerarquia}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <hr></hr>
                        <FormGroup row>
                            <Label for='Jerarquia' sm={3}>
                                <h5>Jerarquía por asignar: </h5>
                            </Label>
                            <Col sm={9}>
                                <Input
                                id='Jerarquia'
                                name='jerarquia'
                                type='select'
                                onChange={(e) => handleJerarquia( e.target.value )}
                               >
                                <option value="0" selected disabled >Selecionar jerarquía</option>
                                {miembrosHogar.map((miembro, index) => (
                                    <option key={miembro.hd_Id_Hogar} value={index + 1}>{index + 1}</option>
                                ))}
                                <option value={miembrosHogar.length + 1} >{miembrosHogar.length + 1}</option>
                                </Input>
                            </Col>
                        </FormGroup>
                    </Form>}
                    <Row className="text-center">
                        <Col>
                            <Button color="danger" size='lg' onClick={() => {setMostrarHogar(false)}}>
                                Cancelar
                            </Button>
                        </Col>
                        <Col>
                            <Button color="primary" size='lg' onClick={e => postData()}>
                                <span className='fas fa-save'></span> Guardar
                            </Button>
                        </Col>
                    </Row>
                </Card>}
            </Container>
        </>

    );
}

export default AltaCambioDomicilioVictor