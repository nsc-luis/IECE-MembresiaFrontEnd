import Layout from '../Layout';
import {
    Container, Row, Col, Form, FormGroup, Input, Button,
    FormFeedback, /* CardTitle, */ Card, CardBody, CardHeader
} from 'reactstrap';

import React, { Component } from 'react';

export default class AltaRestitucion extends Component {
    constructor(props) {
        super(props)
        this.state = {
            nombre: null,
            categoria: null,
            fecha: null,
        };
        if (!localStorage.getItem("token")) {
            document.location.href = '/';
        }
    }

  render() {
    return(
        <Layout>
        <Container>
          {/* Datos generales */}
          <div className="row mx-auto mt-3">
              <div className="col-sm-12">
                  <div className="card border-info acceso-directo">
                      <div className="card-header">
                          <h5><strong>Alta por Restitución</strong></h5>
                      </div>
                      <div className="card-body">
                          <div className="row">
                            <div className="col-sm-2">
                                <label><strong>*</strong> Nombre</label>
                            </div>
                              <div className="col-sm-4">
                                  <FormGroup>
                                      <Input
                                          type="select"
                                          name="nombre"
                                          className="form-control"
                                          value={this.state.nombre}
                                      />
                                  </FormGroup>
                              </div>
                          </div>
                          <div className="row">
                          <div className="col-sm-2">
                                <label><strong>*</strong> Categoria</label>
                            </div>
                              <div className="col-sm-4">
                                  <FormGroup>
                                      <Input
                                          type="select"
                                          name="per_category"
                                          className="form-control"
                                          value={this.state.per_category}
                                        >                                                           <option value="0">Selecionar categoria</option>
                                            <option value="ADULTO_HOMBRE">Adulto Hombre</option>
                                            <option value="ADULTO_MUJER">Adulto Mujer</option>
                                            <option value="JOVEN_HOMBRE">Joven hombre</option>
                                            <option value="JOVEN_MUJER">Joven mujer</option>
                                            <option value="NIÑO">Niño</option>
                                            <option value="NIÑA">Niña</option>
                                        </Input>
                                  </FormGroup>
                              </div>
                          </div>
                          <div className="row">
                          <div className="col-sm-2">
                                <label><strong>*</strong> Comentario</label>
                            </div>
                              <div className="col-sm-4">
                                  <FormGroup>
                                      <Input
                                          type="text"
                                          name="commeent"
                                          className="form-control"
                                          value={this.state.comment}
                                      />
                                  </FormGroup>
                              </div>
                          </div>
                          <div className="row">
                          <div className="col-sm-2">
                                <label><strong>*</strong> Fecha de transaccion</label>
                            </div>
                              <div className="col-sm-4">
                                  <FormGroup>
                                      <Input
                                          type="text"
                                          name="per_Fecha_Transaccion"
                                          className="form-control"
                                          value={this.state.nombre}
                                          placeholder="DD/MM/AAAA"
                                      />
                                  </FormGroup>
                              </div>
                          </div>
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

        </Container>
    </Layout>

    );
  }
}
