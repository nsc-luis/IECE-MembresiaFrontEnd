import Layout from '../Layout';
import helpers from '../../components/Helpers'

import { Link, Redirect } from 'react-router-dom';
import {
    Container, Row, Col, Form, FormGroup, Input, Button,
    FormFeedback, CardTitle, Card, CardBody, CardHeader, CardText, Label, Alert, Table
} from 'reactstrap';

import React, {useEffect, useState } from 'react';

function AltaCambioDomicilio() {
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

    //LLamadas en renderizado
    useEffect(() => {
        helpers.authAxios.get("/Persona")
            .then(res => {
                setOpcionesPersonas(res.data)
                console.log(opcionesPersonas)
            });
    }, [opcionesPersonas.length]);

    useEffect(() => {
        helpers.authAxios.get("/Hogar_Persona/GetListaHogares")
            .then(res => {
                setOpcionesHogares(res.data)
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
                setData( prevState => ({
                    ...prevState,
                    per_Activo: true,
                    per_En_Comunion: true,
                    per_Visibilidad_Abierta: false
                }))
            })
    };
    const handleProcedencia = (value) => {
        setTransaccion( prevState => ({
            ...prevState,
            procedencia: value
        }))
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
        if (value === "151" || value === "66" || value === "40"){
            helpers.authAxios.get(`/Estado/GetEstadoByIdPais/${value}`)
                .then(res => {
                    setEstados(res.data.estados)
                });
            }
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
        helpers.authAxios.post(`/Persona/Post/${data.per_Id_Persona}`, data)
            .then(res => {
                console.log(res)
            });
        helpers.authAxios.post(`/Persona/AddPersonaHogar/${jerarquia}/${hogar.hd_Id_Hogar}`, data)
            .then(res => {
                console.log(res)
            });
    };
    return(
        <Layout>
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
                                    <option key={persona.per_Id_Persona} value={persona.per_Id_Persona}>{persona.per_Nombre + ' ' + persona.per_Apellido_Paterno + ' ' + persona.per_Apellido_Materno}</option>
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
                                type='text'
                                onInput={(e) => handleProcedencia( e.target.value )}>
                                </Input>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for='Fecha' sm={3}>
                                <h5>Fecha de transaccion: </h5>
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
                    <Alert color="info">
                        <h5><strong>AVISO:</strong> Al seleccionar la opcion "Nuevo hogar / domicilio" debera completar los campos necesarios.</h5>
                    </Alert>
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
                            <option value="0" selected>Nuevo hogar / domicilio</option>
                            {opcionesHogares.map(hogar => (
                                <option key={hogar.hd_Id_Hogar} value={hogar.hd_Id_Hogar}>{hogar.per_Nombre + ' ' + hogar.per_Apellido_Paterno + ' ' + hogar.per_Apellido_Materno}</option>
                            ))}
                            </Input>
                        </Col>
                    </FormGroup>
                    {hogar ? 
                    <Form>
                        <Alert color="warning">
                            <h5><strong>ATENCION:</strong></h5>
                            <ul>
                                <li>Debe establecer una jerarquia para la persona que esta registrando, siendo la jerarquia 1 el representante del hogar.</li>
                                <li>Solo puede seleccionar una jerarquia entre 1 y la jerarquia mas baja registrada.</li>
                                <li>Al establecer una jerarquia intermedia entre los miembros del hogar, se sumara 1 a los miembros con jerarquia mas baja a la establecida.</li>
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
                                        Jerarquia
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
                                <h5>Jerarquia por asignar: </h5>
                            </Label>
                            <Col sm={9}>
                                <Input
                                id='Jerarquia'
                                name='jerarquia'
                                type='select'
                                onChange={(e) => handleJerarquia( e.target.value )}
                               >
                                <option value="0" selected disabled >Selecionar jerarquia</option>
                                {miembrosHogar.map((miembro, index) => (
                                    <option key={miembro.hd_Id_Hogar} value={index + 1}>{index + 1}</option>
                                ))}
                                <option value={miembrosHogar.length + 1} >{miembrosHogar.length + 1}</option>
                                </Input>
                            </Col>
                        </FormGroup>
                    </Form>
                    :
                    <Form>
                        <Row>
                            <Col sm={4}>
                                <FormGroup>
                                    <Label>
                                        Calle
                                    </Label>
                                    <Input id='calle' name='calle' placeholder='Nombre de la calle' type='text'></Input>
                                </FormGroup>
                            </Col>
                            <Col sm={4}>
                                <FormGroup>
                                    <Label>
                                        Numero Exterior
                                    </Label>
                                    <Input id='extNumber' name='extNumber' placeholder='0000' type='text'></Input>
                                </FormGroup>
                            </Col>
                            <Col sm={4}>
                                <FormGroup>
                                    <Label>
                                        Numero Interior
                                    </Label>
                                    <Input id='intNumber' name='intNumber' placeholder='0000' type='text'></Input>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={4}>
                                <FormGroup>
                                    <Label>
                                        Tipo subdivisión
                                    </Label>
                                    <Input id='subDivType' name='subDivType' placeholder='Tipo subdivisión' type='select'>
                                        <option value="COL">COLONIA</option>
                                        <option value="FRACC">FRACC</option>
                                        <option value="EJ">EJIDO</option>
                                        <option value="SUBDIV">SUBDIV</option>
                                        <option value="BRGY">BRGY</option>
                                        <option value="RANCHO">RANCHO</option>
                                        <option value="MANZANA">MANZANA</option>
                                        <option value="RESIDENCIAL">RESIDENCIAL</option>
                                        <option value="SECTOR">SECTOR</option>
                                        <option value="SECCIÓN">SECCIÓN</option>
                                        <option value="UNIDAD">UNIDAD</option>
                                        <option value="BARRIO">BARRIO</option>
                                        <option value="ZONA">ZONA</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col sm={4}>
                                <FormGroup>
                                    <Label>
                                        Subdivisión
                                    </Label>
                                    <Input id='subDiv' name='subDiv' placeholder='Subdivisión' type='text'></Input>
                                </FormGroup>
                            </Col>
                            <Col sm={4}>
                                <FormGroup>
                                    <Label>
                                        Localidad
                                    </Label>
                                    <Input id='localidad' name='localidad' placeholder='Localidad' type='text'></Input>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={4}>
                                <FormGroup>
                                    <Label>
                                        Municipio / Ciudad
                                    </Label>
                                    <Input id='municipioCiudad' name='municipioCiudad' placeholder='Nombre de Municipio / Ciudad' type='text'></Input>
                                </FormGroup>
                            </Col>
                            <Col sm={4}>
                                <FormGroup>
                                    <Label>
                                        País
                                    </Label>
                                    <Input id='pais' name='pais' placeholder='Selecciona un país' type='select' onChange={(e) => handlePais( e.target.value )}>
                                        <option value="0" selected disabled >Selecciona un país</option>
                                        {paises.map(pais => (
                                            <option key={pais.pais_Id_Pais} value={pais.pais_Id_Pais}>{pais.pais_Nombre}</option>
                                        ))}
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col sm={4}>
                                <FormGroup>
                                    <Label>
                                        Estado
                                    </Label>
                                    <Input id='estado' name='estado' placeholder='Selecciona un estado' type='select' onChange={(e) => handleEstado( e.target.value )}>
                                        <option value="0" selected disabled >Selecciona un estado</option>
                                        {estados.map(estado => (
                                            <option key={estado.est_Id_Estado} value={estado.est_Id_Estado}>{estado.est_Nombre}</option>
                                        ))}
                                    </Input>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={4}>
                                <FormGroup>
                                    <Label>
                                        Telefono
                                    </Label>
                                    <Input id='tel' name='tel' placeholder='555 555 5555' type='tel'></Input>
                                </FormGroup>
                            </Col>
                        </Row>
                    </Form>}
                    <Row className="text-center">
                        <Col>
                            <Button color="danger" size='lg'>
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
        </Layout>

    );
}

export default AltaCambioDomicilio