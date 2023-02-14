import Layout from '../Layout';
import helpers from '../../components/Helpers'
import moment from 'moment';
import { Link, Redirect } from 'react-router-dom';
import {
    Container, Row, Col, Form, FormGroup, Input, Button,
    FormFeedback, CardTitle, Card, CardBody, CardHeader, CardText, Label, Alert, Table
} from 'reactstrap';

import React, { Component, useEffect, useState } from 'react';

function AltaRestitucion() {
    //Estados
    const [opcionesPersonas, setOpcionesPersonas] = useState([])
    const [opcionesHogares, setOpcionesHogares] = useState([])
    const [data, setData] = useState({})
    const [hogar, setHogar] = useState(null)
    const [jerarquia, setJerarquia] = useState(null)
    const [miembrosHogar, setMiembrosHogar] = useState([])
    const [mostrarHogar, setMostrarHogar] = useState(false)
    const [paises, setPaises] = useState([])
    const [estados, setEstados] = useState([])
    const [hogarActual, setHogarActual] = useState(false)
    const [direccion, setDireccion]=useState("")

    const user = JSON.parse(localStorage.getItem('infoSesion'))
    const sector = JSON.parse(localStorage.getItem("sector"))
    const dto = JSON.parse(localStorage.getItem("dto"))

    //LLamadas en renderizado
    useEffect(() => {
        helpers.authAxios.get(`/Persona/GetPersonaRestitucion/${sector}/true`)
            .then(res => {
                setOpcionesPersonas(res.data.personas)
                //console.log(opcionesPersonas)
            });
            console.log(opcionesPersonas);
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
                //console.log(paises)
            });
    }, [paises.length]);

    //Manejo de eventos de datos generales
    const handlePersona = (value) => {
        helpers.authAxios.get(`/Persona/${value}`)
            .then(res => {
                setData(res.data)
                console.log(res.data);
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
    const handleCategoria = (value) => {
        setData( prevState => ({
            ...prevState,
            per_Categoria: value
        }))
    };
    const handleComentario = (value) => {
        console.log(value);
        setData( prevState => ({
            ...prevState,
            hte_Comentario: value
        }))
    };
    const handleFechaTransaccion = (value) => {
        console.log(value)
        if(value === "") setMostrarHogar(false)
    
        setData( prevState => ({
            ...prevState,
            fecha_transaccion: value
        }))
    };
    const handleHogarInfo = (event) => {
        setData( prevState => ({
            ...prevState,
            [event.name]: event.value
        }))
        //console.log(data)
    };

    //Fn que llama la API que trae la Dirección con multi-nomenclatura por países, ésta se ejecuta en el componentDidMount
    const getDireccion = async (id) => {
        helpers.authAxios.get("/HogarDomicilio/" + id)
            .then(res => {
                setDireccion(res.data.direccion);
            })
    }

    //Manejo de eventos de hogar
    const handleHogar = (value) => {
        if(value === 0){
            setHogar(null)
            return
        }
        //Opción Mismo Hogar
        if(value === "same"){
            setHogarActual(true)
            helpers.authAxios.get(`Hogar_Persona/GetHogarByPersona/${data.per_Id_Persona}`)
            .then(res => {
                setHogar(res.data.datosDelHogarPorPersona.domicilio);
                setMiembrosHogar(res.data.datosDelHogarPorPersona.miembros)
                console.log("DatosDomicilio: " + res.data.datosDelHogarPorPersona);
                getDireccion(res.data.datosDelHogarPorPersona.domicilio.hd_Id_Hogar)
            });

            return
        }
        //Opción Hogar Existente
        helpers.authAxios.get(`/Hogar_Persona/GetDatosHogarDomicilio/${value}`)
            .then(res => {
                setHogar(res.data.miembros[0])
                getDireccion(res.data.miembros[0].hd_Id_Hogar);
                //console.log(res.data);
            });
        helpers.authAxios.get(`/Hogar_Persona/GetMiembros/${value}`)
            .then(res => {
                setMiembrosHogar(res.data)
            });
            //console.log(hogar)
            console.log("HogarExistente"+ {hogar})

            
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

    
    //Validaciones
    const validarDatosPersona = () => {
        console.log(data);
        if(!data.per_Id_Persona || data.per_Id_Persona === 0){
            alert('Seleccione una persona')
            return
        };
        if(data.fecha_transaccion == null || !data.fecha_transaccion ){
            alert('Seleccione una fecha para la transacción')
            return
        }
        setMostrarHogar(true)
    };
    //Pruebas
    const postData = () => {

        if(jerarquia == null && hogar && !hogarActual ){
            alert('Seleccione una jerarquia en el hogar')
            return
        }
        let formattedData = {}

        if(!mostrarHogar){
            if(hogarActual){
                formattedData = {
                    idPersona: data.per_Id_Persona,
                    comentario: data.hte_Comentario,
                    fecha: data.fecha_transaccion,
                    idMinisto: user.pem_Id_Ministro,
                }
                helpers.authAxios.post(`/Historial_Transacciones_Estadisticas/AltaReactivacionRestitucion_HogarActual`, formattedData)
                .then(res => {
                    if(res.data.status === 'error') {
                        console.log(res.data.mensaje)
                    } 
                    else {
                        console.log(res.data)
                        document.location.href = '/Main';
                    }
                });
            }
            formattedData = {
                id: 0,
                per_Id_Persona: data.per_Id_Persona,
                sec_Id_Sector: sector,
                ct_Codigo_Transaccion: 11002, 
                Usu_Usuario_Id: user.pem_Id_Ministro,
                hte_Fecha_Transaccion: data.fecha_transaccion,
                hte_Comentario: data.hte_Comentario,
                jerarquia: jerarquia,
                hp_Id_Hogar_Persona: hogar.hd_Id_Hogar,
            }
            console.log(formattedData)
            helpers.authAxios.post(`/Historial_Transacciones_Estadisticas/AltaCambioDomicilioReactivacionRestitucion_HogarExistente`, formattedData)
            .then(res => {
                if(res.data.status === 'error') {
                    console.log(res.data.mensaje)
                } 
                else {
                    console.log(res.data)
                    document.location.href = '/Main';
                }
            });
        }else{
            formattedData = {
                id: 0,
                per_Id_Persona: data.per_Id_Persona,
                sec_Id_Sector: sector,
                ct_Codigo_Transaccion: 11002, 
                Usu_Usuario_Id: user.pem_Id_Ministro,
                hte_Fecha_Transaccion: data.fecha_transaccion,
                hte_Comentario: data.hte_Comentario,
                HD: {
                    hd_Id_Hogar: 0,
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
                    Fecha_Registro: moment(),
                }
            }
            helpers.authAxios.post(`/Historial_Transacciones_Estadisticas/AltaCambioDomicilioReactivacionRestitucion_NuevoDomicilio`, formattedData)
                .then(res => {
                    if(res.data.status === 'error') {
                        console.log(res.data.mensaje)
                    } 
                    else {
                        console.log(res.data)
                        document.location.href = '/Main';
                    }
                });
        }
        //console.log(formattedData)
    };
    return(
        <>
            <Container>
                <Card body className="mb-5">
                    <CardTitle className="text-center" tag="h4">
                        Alta Restitución
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
                                    <option key={persona.per_Id_Persona} value={persona.per_Id_Persona}>{persona.per_Nombre + ' ' + persona.per_Apellido_Paterno + ' ' + (persona.per_Apellido_Materno ? persona.per_Apellido_Materno : '')}</option>
                                ))}
                                </Input>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for='Categoria' sm={3}>
                                <h5>Categoria: </h5>
                            </Label>
                            <Col sm={9}>
                                <Input
                                id='Categoria'
                                name='categoria'
                                type='select'
                                value={data.per_Categoria}
                                onChange={(e) => handleCategoria( e.target.value )}
                               >
                                <option value="0" selected disabled >Selecionar categoria</option>
                                <option value="ADULTO_HOMBRE">Adulto Hombre</option>
                                <option value="ADULTO_MUJER">Adulto Mujer</option>
                                <option value="JOVEN_HOMBRE">Joven hombre</option>
                                <option value="JOVEN_MUJER">Joven mujer</option>

                                </Input>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for='Comentario' sm={3}>
                                <h5>Comentario: (opcional) </h5>
                            </Label>
                            <Col sm={9}>
                                <Input
                                id='Comentario'
                                name='comentario'
                                type='textarea'
                                onInput={(e) => handleComentario( e.target.value )}>
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
                        <h5><strong>AVISO:</strong> Al seleccionar la opción "Nuevo hogar / domicilio" deberá completar los campos necesarios.</h5>
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
                            <option value="0" selected>Nuevo Hogar / Domicilio</option>
                            <option value="same">Mismo Hogar</option>
                            {opcionesHogares.map(hogar => (
                                <option key={hogar.hd_Id_Hogar} value={hogar.hd_Id_Hogar}>{hogar.per_Nombre + ' ' + hogar.per_Apellido_Paterno + ' ' + hogar.per_Apellido_Materno}</option>
                            ))}
                            </Input>
                        </Col>
                    </FormGroup>
                    {hogar ? 
                    <Form>
                        <Alert color="warning">
                            <h5><strong>ATENCIÓN:</strong></h5>
                            <ul>
                                <li>Debe establecer una jerarquía para la persona que está dando de alta, siendo la jerarquía 1 el representante del hogar.</li>
                                <li>Sólo puede seleccionar una jerarquía entre 1 y la jerarquia mas baja registrada.</li>
                                {/* <li>Al establecer una jerarquía intermedia entre los miembros del hogar, se sumara 1 a los miembros con jerarquia mas baja a la establecida.</li> */}
                            </ul>
                        </Alert>

                        <h5><strong>Dirección:</strong></h5>
                        {/* <p>{hogar.hd_Calle} #{hogar.hd_Numero_Exterior}, {hogar.hd_Localidad}, {hogar.hd_Municipio_Ciudad}, {hogar.est_Nombre}, {hogar.pais_Nombre_Corto}</p> */}
                        <p><h6>{direccion}</h6></p>
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
                                        <td>{miembro.per_Nombre ? miembro.per_Nombre : '' + ' ' + miembro.per_Apellido_Paterno ? miembro.per_Apellido_Paterno : '' + ' ' + miembro.per_Apellido_Materno ? miembro.per_Apellido_Materno : ''}</td>
                                        <td>{miembro.hp_Jerarquia}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <hr></hr>
                        {!hogarActual && <FormGroup row>
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
                        </FormGroup>}
                    </Form>
                    :
                    <Form>
                        <Row>
                            <Col sm={4}>
                                <FormGroup>
                                    <Label>
                                        Calle
                                    </Label>
                                    <Input onInput={(e) => handleHogarInfo( e.target )} id='hd_Calle' name='hd_Calle' placeholder='Nombre de la calle' type='text'></Input>
                                </FormGroup>
                            </Col>
                            <Col sm={4}>
                                <FormGroup>
                                    <Label>
                                        Numero Exterior
                                    </Label>
                                    <Input onInput={(e) => handleHogarInfo( e.target )} id='hd_Numero_Exterior' name='hd_Numero_Exterior' placeholder='0000' type='text'></Input>
                                </FormGroup>
                            </Col>
                            <Col sm={4}>
                                <FormGroup>
                                    <Label>
                                        Numero Interior
                                    </Label>
                                    <Input onInput={(e) => handleHogarInfo( e.target )} id='hd_Numero_Interior' name='hd_Numero_Interior' placeholder='0000' type='text'></Input>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={4}>
                                <FormGroup>
                                    <Label>
                                        Tipo subdivisión
                                    </Label>
                                    <Input onInput={(e) => handleHogarInfo( e.target )} id='hd_Tipo_Subdivision' name='hd_Tipo_Subdivision' placeholder='Tipo subdivisión' type='select'>
                                        <option value="0" selected disabled >Selecionar tipo subdivisión</option>
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
                                    <Input onInput={(e) => handleHogarInfo( e.target )} id='hd_Subdivision' name='hd_Subdivision' placeholder='Subdivisión' type='text'></Input>
                                </FormGroup>
                            </Col>
                            <Col sm={4}>
                                <FormGroup>
                                    <Label>
                                        Localidad
                                    </Label>
                                    <Input onInput={(e) => handleHogarInfo( e.target )} id='hd_Localidad' name='hd_Localidad' placeholder='Localidad' type='text'></Input>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={4}>
                                <FormGroup>
                                    <Label>
                                        Municipio / Ciudad
                                    </Label>
                                    <Input onInput={(e) => handleHogarInfo( e.target )} id='hd_Municipio_Ciudad' name='hd_Municipio_Ciudad' placeholder='Nombre de Municipio / Ciudad' type='text'></Input>
                                </FormGroup>
                            </Col>
                            <Col sm={4}>
                                <FormGroup>
                                    <Label>
                                        País
                                    </Label>
                                    <Input onInput={(e) => handleHogarInfo( e.target )} id='pais_Id_Pais' name='pais_Id_Pais' placeholder='Selecciona un país' type='select' onChange={(e) => handlePais( e.target.value )}>
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
                                    <Input onInput={(e) => handleHogarInfo( e.target )} id='est_Id_Estado' name='est_Id_Estado' placeholder='Selecciona un estado' type='select'>
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
                                    <Input onInput={(e) => handleHogarInfo( e.target )} id='hd_Telefono' name='hd_Telefono' placeholder='555 555 5555' type='tel'></Input>
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
        </>

    );
}

export default AltaRestitucion;