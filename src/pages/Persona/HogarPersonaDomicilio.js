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
        this.getListaHogares();
    }

    /* getListaHogares = () => {
        helpers.authAxios.get(this.url + "/Hogar_Persona/GetListaHogares")
            .then(res => {
                this.setState({
                    ListaHogares: res.data,
                    status: 'success'
                });
            });
    } */

    getListaHogares = () => {
        helpers.validaToken().then(helpers.authAxios.get(this.url + "/HogarDomicilio/GetBySector/" + localStorage.getItem("sector"))
            .then(res => {
                this.setState({
                    ListaHogares: res.data.domicilios.sort((a, b) => {
                        const nameA = a.per_Nombre; // ignore upper and lowercase
                        const nameB = b.per_Nombre; // ignore upper and lowercase
                        if (nameA < nameB) {
                            return -1;
                        }
                        if (nameA > nameB) {
                            return 1;
                        }

                        // names must be equal
                        return 0;
                    })
                });
            })
        );
    }

    render() {
        const {
            domicilio,
            onChangeDomicilio,
            onBlurDomicilio,
            handle_hd_Id_Hogar,
            handle_hp_Jerarquia,
            hogar,
            DatosHogarDomicilio,
            MiembrosDelHogar,
            JerarquiasDisponibles,
            boolNvoEstado,
            handleChangeEstado,
            direccion,
            habilitaPerBautizado,
            nvoEstado_Disponible
        } = this.props

        console.log("Hogar: ", JerarquiasDisponibles)
        return (
            <React.Fragment>
                <div className="form-group">
                    <div className="alert alert-info mt-3" role="alert">
                        <h5><strong>AVISO: </strong>Si selecciona "Nuevo Hogar / Domicilio", llene los datos del domicilio.

                        </h5>
                    </div>
                    <div className="row">
                        <div className="col-sm-2">
                            <label>Asignar al Hogar: </label>
                        </div>
                        <div className="col-sm-9">
                            <select
                                name="hd_Id_Hogar"
                                className="form-control"
                                onChange={handle_hd_Id_Hogar}
                                /* id="hd_Id_Hogar" */
                                value={hogar.hd_Id_Hogar}
                            >
                                {habilitaPerBautizado &&
                                    <option value="0">Nuevo hogar / Domicilio</option>
                                }
                                {!habilitaPerBautizado &&
                                    <option value="0">Selecciona un Hogar</option>
                                }
                                {
                                    this.state.ListaHogares.map((h) => {
                                        return (
                                            <option key={h.hd_Id_Hogar} value={h.hd_Id_Hogar}>
                                                {h.per_Nombre} {h.apellidoPrincipal} {h.per_Apellido_Materno} |
                                                {h.hd_Calle} {h.hd_Numero_Exterior}, {h.hd_Municipio_Ciudad}, {h.est_Nombre}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    </div>
                </div>

                {/* Si se elige Un HOGAR EXISTENTE */}
                {hogar.hd_Id_Hogar !== '0' &&
                    <React.Fragment>
                        <div className="alert alert-warning mt-3" role="alert">
                            <h5>ATENCIÓN: </h5>
                            <ul>
                                <li>Debe establecer una jerarquía para la persona que está registrando, siendo la jerarquía 1 el representante del hogar.</li>
                                <li>Sólo puede seleccionar una jerarquia que esté entre la jerarquía 1 y la mas baja registrada.</li>
                                {/* <li>Al establecer una jerarquia intermedia entre los miembros del hogar, se sumara 1 a los miembros con jerarquía mas baja a la establecida.</li> */}
                            </ul>
                        </div>
                        <strong>HOGAR: </strong>

                        {
                            DatosHogarDomicilio.map((HogarDomicilio) => {
                                return (
                                    <p><h7>{direccion}</h7></p>
                                )
                            })
                        }
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Miembros del hogar</th>
                                    <th scope="col">Jerarquía</th>
                                    <th scope="col">Activo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    MiembrosDelHogar.map((miembro, i) => {
                                        return (
                                            <tr key={i}>
                                                <td>{miembro.per_Nombre} {miembro.apellidoPrincipal} {miembro.per_Apellido_Materno}</td>
                                                <td>{miembro.hp_Jerarquia}</td>
                                                <td>{miembro.per_Activo ? "SI" : "NO"}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>

                        <div className="form-group">
                            <div className="row">
                                <div className="col-sm-2">
                                    <label>Jerarquía por asignar</label>
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

                {/* <Domicilio /> Si se elige NUEVO HOGAR / DOMICILIO */}
                {hogar.hd_Id_Hogar === '0' && habilitaPerBautizado === true &&
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
                                        onBlur={onBlurDomicilio}
                                        autoComplete="nope"
                                        maxlength="80"
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
                                        onBlur={onBlurDomicilio}
                                        autoComplete="nope"
                                        maxlength="20"
                                    />
                                    <label>Número Exterior</label>
                                </div>
                                <div className="col-sm-4">
                                    <input
                                        type="text"
                                        name="hd_Numero_Interior"
                                        className="form-control"
                                        value={domicilio.hd_Numero_Interior}
                                        onChange={onChangeDomicilio}
                                        onBlur={onBlurDomicilio}
                                        autoComplete="nope"
                                        maxlength="20"
                                    />
                                    <label>Número Interior</label>
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
                                            onBlur={onBlurDomicilio}

                                        >
                                            <option value="COL.">COLONIA</option>
                                            <option value="FRACC.">FRACCIONAMIENTO</option>
                                            <option value="EJ.">EJIDO</option>
                                            <option value="SUBDIV.">SUBDIVICIÓN</option>
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
                                        <label>Tipo de Asentamiento/Barrio</label>
                                    </div>
                                    <div className="col-sm-4">
                                        <input
                                            type="text"
                                            name="hd_Subdivision"
                                            className="form-control"
                                            value={domicilio.hd_Subdivision}
                                            onChange={onChangeDomicilio}
                                            onBlur={onBlurDomicilio}
                                            maxlength="80"
                                        />
                                        <label>Nombre del Asentamiento/Barrio/Subdivisión/Referencia</label>
                                    </div>
                                    <div className="col-sm-4">
                                        <input
                                            type="text"
                                            name="hd_Localidad"
                                            className="form-control"
                                            value={domicilio.hd_Localidad}
                                            onChange={onChangeDomicilio}
                                            onBlur={onBlurDomicilio}
                                            autoComplete="nope"
                                            maxlength="80"
                                        />
                                        <label>Localidad/Poblado</label>
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
                                            onBlur={onBlurDomicilio}
                                            autoComplete="nope"
                                            maxlength="80"
                                        />
                                        <label>Municipio/Ciudad *</label>
                                    </div>
                                    <div className="col-sm-4">
                                        <input
                                            type="text"
                                            name="hd_CP"
                                            className="form-control"
                                            value={domicilio.hd_CP}
                                            onChange={onChangeDomicilio}
                                            onBlur={onBlurDomicilio}
                                            autoComplete="nope"
                                            maxlength="8"
                                        />
                                        <label>Código Postal</label>
                                    </div>
                                    <div className="col-sm-4">
                                        <input
                                            type="text"
                                            name="hd_Telefono"
                                            className="form-control"
                                            value={domicilio.hd_Telefono}
                                            onChange={onChangeDomicilio}
                                            onBlur={onBlurDomicilio}
                                            autoComplete="nope"
                                            maxlength="25"
                                        />
                                        <label>Teléfono de Casa</label>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="row">
                                <PaisEstado
                                    domicilio={domicilio}
                                    onChangeDomicilio={onChangeDomicilio}
                                    onBlurDomicilio={onBlurDomicilio}
                                    boolNvoEstado={boolNvoEstado}
                                    handleChangeEstado={handleChangeEstado}
                                    nvoEstado_Disponible={nvoEstado_Disponible}
                                />
                            </div>
                        </div>
                    </React.Fragment>
                }
            </React.Fragment>
        )
    }
}

export default Domicilio;