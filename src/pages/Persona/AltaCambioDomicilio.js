import Layout from '../Layout';
import HogarPersonaDomicilio from './HogarPersonaDomicilio';
import {
    Container, Row, Col, Form, FormGroup, Input, Button,
    FormFeedback, /* CardTitle, */ Card, CardBody, CardHeader
} from 'reactstrap';

import React, { Component } from 'react';

export default class AltaRestitucion extends Component {
    const_regex = {
        alphaSpaceRequired: /^[a-zA-Z]{3}[a-zA-Z\d\s]{0,37}$/,
        formatoFecha: /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\4(?:(?:1[6-9]|[2-9]\d)?\d{4})$/,
        formatoEmail: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        formatoTelefono: /^(\+\d{1,3})*(\(\d{2,3}\))*\d{7,25}$/
    }

    constructor(props) {
        super(props)
        this.state = {
            nombre: null,
            procedencia: null,
            fecha: null,
            isValidName: false,
            isValidDate: false,

            profesiones_oficios: [],
            infante: false,
            DatosHogar: {},
            MiembroEsBautizado: false,
            PromesaDelEspitiruSanto: false,
            CasadoDivorciadoViudo: false,
            ConcubinatoSolteroConHijos: false,
            soltero: false,
            datosPersonaEncontrada: {},
            RFCSinHomoclave: "",
            distritoSeleccionado: "0",
            sectores: [],
            per_Apellido_Materno_OK: false,
            hogar: {},
            redirect: false,
            showModalAltaPersona: false,
            emailInvalido: false,
            fechaBautismoInvalida: false,
            fechaBodaCivilInvalida: false,
            fechaEspitiruSantoInvalida: false,
            fechaBodaEclesiasticaInvalida: false,
            telMovilInvalido: false,
            mensajes: {},
            DatosHogarDomicilio: [],
            MiembrosDelHogar: [],
            JerarquiasDisponibles: []
        };
        if (!localStorage.getItem("token")) {
            document.location.href = '/';
        }

        this.handleDate = this.handleDate.bind(this);
        this.handleName = this.handleName.bind(this);
        this.handle_hd_Id_Hogar = this.handle_hd_Id_Hogar.bind(this);
        this.handle_hp_Jerarquia = this.handle_hp_Jerarquia.bind(this);
    }

    handleDate(event){
        this.setState({isValidDate: this.const_regex.formatoFecha.test(event.target.value) })
    }
    handleName(event){
        this.setState({isValidName: this.const_regex.alphaSpaceRequired.test(event.target.value) })
    }

    handle_hd_Id_Hogar = async (e) => {
        let idHogar = e.target.value;
        this.setState({
            hogar: {
                ...this.state.hogar,
                hd_Id_Hogar: idHogar,
                hp_Jerarquia: "1"
            }
        })
        this.fnGetDatosDelHogar(idHogar);
    }

    handle_hp_Jerarquia = (e) => {
        this.setState({
            hogar: {
                ...this.state.hogar,
                hp_Jerarquia: e.target.value
            }
        })
    }
  render() {
    const {
        onChange,
        form,
        domicilio,
        FrmValidaPersona,
        bolPersonaEncontrada,
        setFrmValidaPersona,
        setBolPersonaEncontrada,
        onChangeDomicilio,
        categoriaSeleccionada,
        msjCategoriaSeleccionada,
        habilitaPerBautizado,
        per_Nombre_NoValido,
        per_Apellido_Paterno_NoValido,
        per_Fecha_Nacimiento_NoValido,
        changeRFCSinHomo,
        changeEstadoCivil,
        fnGuardaPersona,
        fnGuardaPersonaEnHogar,
        tituloAgregarEditar,
        boolAgregarNvaPersona,
        fnEditaPersona
    } = this.props
    return(
        <Layout>
        <Container>
          {/* Datos generales */}
          <div className="row mx-auto mt-3">
              <div className="col-sm-12">
                  <div className="card border-info acceso-directo">
                      <div className="card-header">
                          <h5><strong>Alta por Cambio de Domicilio</strong></h5>
                      </div>
                      <div className="card-body">
                      <FormGroup>
                        <div className="row">
                        <div className="col-sm-2">
                            <label><strong>*</strong> Persona</label>
                        </div>
                            <div className="col-sm-4">
                                    <Input
                                        type="search"
                                        name="nombre"
                                        className="form-control"
                                        onChange={this.handleName}
                                        value={this.state.nombre}
                                    />
                            </div>
                            {!this.state.isValidName &&
                                <span className="text-danger">
                                    Campo requerido, solo acepta letras, numeros y espacios.
                                </span>
                            }
                        </div>
                      </FormGroup>
                      <FormGroup>
                        <div className="row">
                        <div className="col-sm-2">
                            <label><strong>*</strong> Procedencia</label>
                        </div>
                        <div className="col-sm-4">
                                <Input
                                    type="select"
                                    name="procedencia"
                                    className="form-control"
                                    value={this.state.procedencia}
                                />
                            </div>
                        </div>
                      </FormGroup>
                        <FormGroup>
                            <div className="row">
                            <div className="col-sm-2">
                                    <label><strong>*</strong> Fecha de transaccion</label>
                                </div>
                                <div className="col-sm-4">
                                        <Input
                                            type="text"
                                            name="per_Fecha_Transaccion"
                                            className="form-control"
                                            onChange={this.handleDate}
                                            value={this.state.fecha}
                                            placeholder="DD/MM/AAAA"
                                        />
                                </div>
                                {!this.state.isValidDate &&
                                    <span className="text-danger">
                                        Campo requerido, el formato de fecha debe ser DD/MM/AAAA.
                                    </span>
                                }
                            </div>
                        </FormGroup>
                          <div className='row'>
                            <div className="col-sm-2">
                                <Button
                                    type="button"
                                    color="danger"
                                >
                                    <i>Cancelar</i>
                                </Button>
                            </div>
                            <div className="col-sm-2">
                                <Button
                                    type="button"
                                    color="primary"
                                >
                                    <i>Continuar</i>
                                </Button>
                            </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
            {/* Hogar */}
            <div className="row mx-auto mt-3">
                <div className="col-sm-12">
                    <div className="card border-info acceso-directo">
                        <div className="card-header">
                            <h5><strong>Hogar / Domicilio</strong></h5>
                        </div>
                        <div className="card-body">
                            <HogarPersonaDomicilio
                                domicilio={domicilio}
                                onChangeDomicilio={onChangeDomicilio}
                                handle_hd_Id_Hogar={this.handle_hd_Id_Hogar}
                                handle_hp_Jerarquia={this.handle_hp_Jerarquia}
                                hogar={this.state.hogar}
                                DatosHogarDomicilio={this.state.DatosHogarDomicilio}
                                MiembrosDelHogar={this.state.MiembrosDelHogar}
                                JerarquiasDisponibles={this.state.JerarquiasDisponibles}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    </Layout>

    );
  }
}
