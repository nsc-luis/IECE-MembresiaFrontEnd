import React from 'react';
import helpers from '../../components/Helpers'

class Domicilio extends React.Component {
    url = helpers.url_api;

    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        const {
            handle_hp_Jerarquia,
            hogar,
            DatosHogarDomicilio,
            MiembrosDelHogar,
            JerarquiasDisponibles,
            direccion
        } = this.props

        return (
            <React.Fragment>
                {hogar.hd_Id_Hogar !== '0' &&
                    <React.Fragment>
                        <div className="alert alert-warning mt-3" role="alert">
                            <h5>ATENCIÓN: </h5>
                            <ul>
                                <li>Debe establecer una jerarquía para la persona que está registrando, siendo la jerarquía 1 el representante del hogar.</li>
                                <li>Solo puede seleccionar una jerarquia que esté entre la jerarquía 1 y la mas baja registrada.</li>
                                {/* <li>Al establecer una jerarquia intermedia entre los miembros del hogar, se sumara 1 a los miembros con jerarquía mas baja a la establecida.</li> */}
                            </ul>
                        </div>
                        <strong>HOGAR: </strong>
                        {
                            DatosHogarDomicilio.map((HogarDomicilio) => {
                                return (
                                    // <p key={HogarDomicilio.hd_Id_Hogar}>
                                    //     Calle: {HogarDomicilio.hd_Calle}, No.: {HogarDomicilio.hd_Numero_Exterior}, Interior: {HogarDomicilio.hd_Numero_Interior},
                                    //     Tipo subdivision: {HogarDomicilio.hd_Tipo_Subdivision}, Subdivision: {HogarDomicilio.hd_Subdivision} <br />
                                    //     Localidad: {HogarDomicilio.hd_Localidad}, Municipio/cuidad: {HogarDomicilio.hd_Municipio_Ciudad},
                                    //     {HogarDomicilio.est_Nombre}, Pais: {HogarDomicilio.pais_Nombre_Corto} <br />
                                    //     Telefono: {HogarDomicilio.hd_Telefono}
                                    // </p>
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
                                                <td>{miembro.per_Nombre} {miembro.per_Apellido_Paterno} {miembro.per_Apellido_Materno}</td>
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
            </React.Fragment>
        )
    }
}

export default Domicilio;