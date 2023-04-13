import React, { Component } from 'react';
import PaisEstado from '../../components/PaisEstado';

class DomicilioJeraquia extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { domicilio, onChangeDomicilio } = this.props
        return (
            <React.Fragment>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-4">
                            <input
                                type="text"
                                name="hd_Calle"
                                className="form-control"
                                value={domicilio.hd_Calle}
                                onChange={onChangeDomicilio}
                            />
                            <label>Calle *</label>
                        </div>
                        <div className="col-sm-4">
                            <input
                                type="text"
                                name="hd_Numero_Exterior"
                                className="form-control"
                                value={domicilio.hd_Numero_Exterior}
                                onChange={onChangeDomicilio}
                            />
                            <label>Número exterior</label>
                        </div>
                        <div className="col-sm-4">
                            <input
                                type="text"
                                name="hd_Numero_Interior"
                                className="form-control"
                                value={domicilio.hd_Numero_Interior}
                                onChange={onChangeDomicilio}
                            />
                            <label>Número interior</label>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-4">
                                <select
                                    name="hd_Tipo_Subdivision"
                                    className="form-control"
                                    value={domicilio.hd_Tipo_Subdivision}
                                    onChange={onChangeDomicilio}
                                >
                                    <option value="COL.">COLONIA</option>
                                    <option value="FRACC.">FRACC</option>
                                    <option value="EJ.">EJIDO</option>
                                    <option value="SUBDIV.">SUBDIV</option>
                                    <option value="BRGY.">BRGY</option>
                                    <option value="RANCHO">RANCHO</option>
                                    <option value="MANZANA">MANZANA</option>
                                    <option value="RESIDENCIAL">RESIDENCIAL</option>
                                    <option value="SECTOR">SECTOR</option>
                                    <option value="SECC.">SECCIÓN</option>
                                    <option value="UNIDAD">UNIDAD</option>
                                    <option value="BARRIO">BARRIO</option>
                                    <option value="ZONA">ZONA</option>
                                </select>
                                <label>Tipo subdivision</label>
                            </div>
                            <div className="col-sm-4">
                                <input
                                    type="text"
                                    name="hd_Subdivision"
                                    className="form-control"
                                    value={domicilio.hd_Subdivision}
                                    onChange={onChangeDomicilio}
                                />
                                <label>Subdivision</label>
                            </div>
                            <div className="col-sm-4">
                                <input
                                    type="text"
                                    name="hd_Localidad"
                                    className="form-control"
                                    value={domicilio.hd_Localidad}
                                    onChange={onChangeDomicilio}
                                />
                                <label>Localidad</label>
                            </div>

                        </div>
                    </div>
                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-4">
                                <input
                                    type="text"
                                    name="hd_Municipio_Ciudad"
                                    className="form-control"
                                    value={domicilio.hd_Municipio_Ciudad}
                                    onChange={onChangeDomicilio}
                                />
                                <label>Municipio/Cuidad *</label>
                            </div>
                            <PaisEstado
                                domicilio={domicilio}
                                onChangeDomicilio={onChangeDomicilio}
                            />
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-4">
                            <input
                                type="text"
                                name="hd_Telefono"
                                className="form-control"
                                value={domicilio.hd_Telefono}
                                onChange={onChangeDomicilio}
                            />
                            <label>Teléfono</label>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default DomicilioJeraquia;