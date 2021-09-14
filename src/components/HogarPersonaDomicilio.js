import React from 'react';
import axios from 'axios';
import helpers from './Helpers'
import PaisEstado from '../components/PaisEstado';
import { ThemeConsumer } from 'styled-components';

class Domicilio extends React.Component {
    url = helpers.url_api;

    constructor(props) {
        super(props)
        this.state = {
            ListaHogares: []
        }
    }

    componentWillMount() {
        this.getListaHogares();
    }

    getListaHogares = () => {
        axios.get(this.url + "/Hogar_Persona/GetListaHogares")
            .then(res => {
                this.setState({
                    ListaHogares: res.data,
                    status: 'success'
                });
            });
    }

    render() {
        const {
            domicilio,
            onChangeDomicilio,
            handle_hd_Id_Hogar,
            handle_hp_Jerarquia,
            hogar,
            DatosHogarDomicilio,
            MiembrosDelHogar,
            JerarquiasDisponibles
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
                                {
                                    this.state.ListaHogares.map((h) => {
                                        return (
                                            <option key={h.hd_Id_Hogar} value={h.hd_Id_Hogar}>{h.per_Nombre} {h.per_Apellido_Paterno} {h.per_Apellido_Materno} | {h.hd_Calle} {h.hd_Numero_Exterior}, {h.hd_Localidad}, {h.est_Nombre}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    </div>
                </div>

                {hogar.hd_Id_Hogar !== '0' &&
                    <React.Fragment>
                        <div className="alert alert-warning mt-3" role="alert">
                            <h5>ATENCION: </h5>
                            <ul>
                                <li>Debe establecer una jerarquia para la persona que esta registrando, siendo la jerarquia 1 el representante del hogar.</li>
                                <li>Solo puede seleccionar una jerarquia entre 1 y la jerarquia mas baja registrada.</li>
                                <li>Al establecer una jerarquia intermedia entre los miembros del hogar, se sumara 1 a los miembros con jerarquia mas baja a la establecida.</li>
                            </ul>
                        </div>
                        <strong>HOGAR: </strong>

                        {
                            DatosHogarDomicilio.map((HogarDomicilio) => {
                                return (
                                    <p key={HogarDomicilio.hd_Id_Hogar}>
                                        Calle: {HogarDomicilio.hd_Calle}, No.: {HogarDomicilio.hd_Numero_Exterior}, Interior: {HogarDomicilio.hd_Numero_Interior},
                                        Tipo subdivision: {HogarDomicilio.hd_Tipo_Subdivision}, Subdivision: {HogarDomicilio.hd_Subdivision} <br />
                                        Localidad: {HogarDomicilio.hd_Localidad}, Municipio/cuidad: {HogarDomicilio.hd_Municipio_Ciudad},
                                        {HogarDomicilio.est_Nombre}, Pais: {HogarDomicilio.pais_Nombre_Corto} <br />
                                        Telefono: {HogarDomicilio.hd_Telefono}
                                    </p>
                                )
                            })
                        }
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Miembros del hogar</th>
                                    <th scope="col">Jerarquia</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    MiembrosDelHogar.map((miembro, i) => {
                                        return (
                                            <tr key={i}>
                                                <td>{miembro.per_Nombre} {miembro.per_Apellido_Paterno} {miembro.per_Apellido_Materno}</td>
                                                <td>{miembro.hp_Jerarquia}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>

                        <div className="form-group">
                            <div className="row">
                                <div className="col-sm-2">
                                    <label>Jerarquia por asignar</label>
                                </div>
                                <div className="col-sm-4">
                                    <select
                                        name="hp_Jerarquia"
                                        className="form-control"
                                        onChange={handle_hp_Jerarquia}
                                        value={hogar.hp_Jerarquia}
                                    >
                                        {JerarquiasDisponibles}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                }

                {/* <Domicilio /> */}
                {hogar.hd_Id_Hogar === '0' &&
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
                                    <label>Calle</label>
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
                                            name="hd_Municipio_Cuidad"
                                            className="form-control"
                                            value={domicilio.hd_Municipio_Cuidad}
                                            onChange={onChangeDomicilio}
                                        />
                                        <label>Municipio/Cuidad</label>
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
                                    <label>Telefono</label>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                }
            </React.Fragment>
        )
    }
}

export default Domicilio;