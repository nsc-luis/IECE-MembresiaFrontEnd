import React from 'react';
import helpers from '../../components/Helpers'
import PaisEstado from '../../components/PaisEstado';

class Domicilio extends React.Component {
    url = helpers.url_api;

    constructor(props) {
        super(props)
        this.state = {
            ListaHogares: []
        }
        this.infoSesion = JSON.parse(localStorage.getItem("infoSesion"));
    }

    componentWillMount() {
    }

    render() {
        const {
            domicilio,
            onChangeDomicilio,
            handleChangeEstado,
            boolNvoEstado,
            handle_hd_Id_Hogar,
            hogar
        } = this.props

        return (
            <React.Fragment>
                <div className="form-group">
                    <div className="alert alert-info mt-3" role="alert">
                        <h5><strong>AVISO: </strong>Al seleccionar la opcion "Nuevo hogar / domicilio" debera completar los campos necesarios.</h5>
                    </div>
                    <div className="row">
                        <div className="col-sm-2">
                            <label>Asignar a hogar</label>
                        </div>
                        <div className="col-sm-4">
                            <select
                                name="hd_Id_Hogar"
                                className="form-control"
                                onChange={handle_hd_Id_Hogar}
                                /* id="hd_Id_Hogar" */
                                value={hogar.hd_Id_Hogar}
                            >
                                <option value="0">Nuevo hogar / domicilio</option>
                            </select>
                        </div>
                    </div>
                </div>

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
                            <label>Numero exterior</label>
                        </div>
                        <div className="col-sm-4">
                            <input
                                type="text"
                                name="hd_Numero_Interior"
                                className="form-control"
                                value={domicilio.hd_Numero_Interior}
                                onChange={onChangeDomicilio}
                            />
                            <label>Numero interior</label>
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
                                boolNvoEstado={boolNvoEstado}
                                handleChangeEstado={handleChangeEstado}
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
                            <label>Telefono</label>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Domicilio;