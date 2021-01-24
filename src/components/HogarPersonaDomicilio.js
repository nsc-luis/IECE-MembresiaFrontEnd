import React from 'react';
import axios from 'axios';
import Global from '../Global'
import PaisEstado from './PaisEstado';

class Domicilio extends React.Component {
    url = Global.url_api;

    state = {
        ListaHogares: [],
        DatosHogarDomicilio: [],
        MiembrosDelHogar: [],
        SelectHogarId: '0'
    }

    componentWillMount() {
        this.getListaHogares();
    }

    fnGuardaHogarDomicilio = async (datos) => {
        return await axios.post(this.url + "/HogarDomicilio", datos)
            .then(res => res.data)
            .catch(error => error);
    }

    fnGuardaHogar_Persona = async (p, d) => {
        let foo = await this.fnGuardaPersona(p);
        let data = {
            per_Id_Persona: foo.nvaPersona
        }

        if (this.hp_Id_HogarRef.current.value === "0") {
            let bar = await this.fnGuardaHogarDomicilio(d);
            data.hd_Id_Hogar = bar.nvoHogarDomicilio;
            data.hp_Jerarquia = 1;
            console.log(data);
        } else {
            data.hd_Id_Hogar = d.hp_Id_Hogar;
            data.hp_Jerarquia = d.hp_Jerarquia;
            console.log(data);
        }
        console.log(p);
        await axios.post(this.url + "/Hogar_Persona", data);
        console.log(data);
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

    handleHogarSeleccionado = async (e) => {
        let idValue = e.target.value;
        await axios.get(this.url + "/Hogar_Persona/GetMiembros/" + idValue)
            .then(res => {
                this.setState({
                    MiembrosDelHogar: res.data,
                    SelectHogarId: idValue
                });
            });
        await axios.get(this.url + "/Hogar_Persona/GetDatosHogarDomicilio/" + idValue)
            .then(res => {
                this.setState({
                    DatosHogarDomicilio: res.data
                });
            });

        let jerarquias = [];
        for (let i = 1; i <= this.state.MiembrosDelHogar.length + 1; i++) {
            jerarquias.push(<option value={i}>{i}</option>)
        }

        await this.setState({
            JerarquiasDisponibles: jerarquias
        });
    }

    render() {
        const { domicilio, onChangeDomicilio } = this.props
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
                                name="hp_Id_Hogar"
                                className="form-control"
                                onChange={this.handleHogarSeleccionado}
                            >
                                <option value="0">Nuevo hogar / domicilio</option>
                                {
                                    this.state.ListaHogares.map((hogar) => {
                                        return (
                                            <option key={hogar.hd_Id_Hogar} value={hogar.hd_Id_Hogar}>{hogar.per_Nombre} {hogar.per_Apellido_Paterno} {hogar.per_Apellido_Materno} | {hogar.hd_Calle} {hogar.hd_Numero_Exterior}, {hogar.hd_Localidad}, {hogar.est_Nombre}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    </div>
                </div>

                {this.state.SelectHogarId !== '0' &&
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
                            this.state.DatosHogarDomicilio.map((HogarDomicilio) => {
                                return (
                                    <p key={HogarDomicilio.hd_Id_Hogar}>
                                        {HogarDomicilio.hd_Calle} {HogarDomicilio.hd_Numero_Exterior}, {HogarDomicilio.hd_Numero_Interior} <br />
                                                            Tipo subdivision: {HogarDomicilio.hd_Tipo_Subdivision}, Subdivision: {HogarDomicilio.hd_Subdivision} <br />
                                        {HogarDomicilio.hd_Localidad}, {HogarDomicilio.hd_Municipio_Ciudad} <br />
                                        {HogarDomicilio.est_Nombre}, {HogarDomicilio.pais_Nombre_Corto} <br />
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
                                    this.state.MiembrosDelHogar.map((miembro, i) => {
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
                                    >
                                        {this.state.JerarquiasDisponibles}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                }

                {/* <Domicilio /> */}
                {this.state.SelectHogarId === '0' &&
                    <React.Fragment>
                        <div className="form-group">
                            <div className="row">
                                <div className="col-sm-2">
                                    <label>Calle</label>
                                </div>
                                <div className="col-sm-4">
                                    <input
                                        type="text"
                                        name="hd_Calle"
                                        className="form-control"
                                        value={domicilio.hd_Calle}
                                        onChange={onChangeDomicilio}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="row">
                                <div className="col-sm-2">
                                    <label>Numero exterior</label>
                                </div>
                                <div className="col-sm-4">
                                    <input
                                        type="text"
                                        name="hd_Numero_Exterior"
                                        className="form-control"
                                        value={domicilio.hd_Numero_Exterior}
                                        onChange={onChangeDomicilio}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="row">
                                <div className="col-sm-2">
                                    <label>Numero interior</label>
                                </div>
                                <div className="col-sm-4">
                                    <input
                                        type="text"
                                        name="hd_Numero_Interior"
                                        className="form-control"
                                        value={domicilio.hd_Numero_Interior}
                                        onChange={onChangeDomicilio}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="row">
                                <div className="col-sm-2">
                                    <label>Tipo subdivision</label>
                                </div>
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
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="row">
                                <div className="col-sm-2">
                                    <label>Subdivision</label>
                                </div>
                                <div className="col-sm-4">
                                    <input
                                        type="text"
                                        name="hd_Subdivision"
                                        className="form-control"
                                        value={domicilio.hd_Subdivision}
                                        onChange={onChangeDomicilio}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="row">
                                <div className="col-sm-2">
                                    <label>Localidad</label>
                                </div>
                                <div className="col-sm-4">
                                    <input
                                        type="text"
                                        name="hd_Localidad"
                                        className="form-control"
                                        value={domicilio.hd_Localidad}
                                        onChange={onChangeDomicilio}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="row">
                                <div className="col-sm-2">
                                    <label>Municipio/Cuidad</label>
                                </div>
                                <div className="col-sm-4">
                                    <input
                                        type="text"
                                        name="hd_Municipio_Cuidad"
                                        className="form-control"
                                        value={domicilio.hd_Municipio_Cuidad}
                                        onChange={onChangeDomicilio}
                                    />
                                </div>
                            </div>
                        </div>

                        <PaisEstado 
                            domicilio={domicilio}
                            onChangeDomicilio={onChangeDomicilio}
                        />

                        <div className="form-group">
                            <div className="row">
                                <div className="col-sm-2">
                                    <label>Telefono</label>
                                </div>
                                <div className="col-sm-4">
                                    <input
                                        type="text"
                                        name="hd_Telefono"
                                        className="form-control"
                                        value={domicilio.hd_Telefono}
                                        onChange={onChangeDomicilio}
                                    />
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