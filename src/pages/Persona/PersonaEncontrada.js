import React from 'react';
import helpers from '../../components/Helpers';
import { Button } from 'reactstrap';

class PersonaEncontrada extends React.Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    fnCambiarABautizado = (id) => {
        localStorage.setItem("CambiarABautizado", true);
        localStorage.setItem("idPersona", id);
        localStorage.setItem("nvaAltaBautizado", true);
        localStorage.setItem("nvaAltaComunion", true);
        document.location.href = '/RegistroDePersona';
    }

    render() {

        const { datosPersonaEncontrada } = this.props

        console.log("Persona: ", datosPersonaEncontrada.per_Bautizado, localStorage.getItem('nvaAltaBautizado'))

        return (
            <React.Fragment>
                <div className="alert alert-danger mt-3" role="alert">
                    <h5><strong>AVISO: </strong>Se ha encontrado una persona con la misma Clave-Persona, asegúrese de no duplicar personas.
                        <br></br>Si es diferente persona, presione el botón <strong>'Continuar Captura'</strong>. Pero si es la misma, presione <strong>'Cancelar'</strong>.
                        <br></br>Si se trata de una Edición/Actualización de un dato Personal clave, puede presionar el botón <strong>'Continuar Captura'</strong>.
                    </h5>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Nombre</th>
                            <th scope="col">Nacimiento</th>
                            <th scope="col">Bautizado</th>
                            <th scope="col">Distrito</th>
                            <th scope="col">Sector</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {datosPersonaEncontrada.map((persona) => {
                            return (
                                <tr key={persona.per_Id_Persona}>
                                    <td>{persona.per_Nombre} {persona.per_Apellido_Paterno} {persona.per_Apellido_Materno} </td>
                                    <td>{persona.per_Fecha_Nacimiento != null ? helpers.reFormatoFecha(persona.per_Fecha_Nacimiento) : null} </td>
                                    <td>{persona.per_Bautizado === true ? "Si" : "No"} </td>
                                    <td>{persona.dis_Tipo_Distrito} {persona.dis_Numero}</td>
                                    <td>{persona.sec_Alias}</td>
                                    <td>
                                        {persona.per_Bautizado === false && localStorage.getItem('nvaAltaBautizado') === "true" ? (
                                            <React.Fragment>
                                                <Button
                                                    color="info"
                                                    onClick={() => this.fnCambiarABautizado(persona.per_Id_Persona)}>
                                                    <span className="fa fa-user-check" style={{ paddingRight: "5px" }}></span>
                                                    Cambiar estatus a BAUTIZADO
                                                </Button>
                                            </React.Fragment>)
                                            : null
                                        }
                                    </td>
                                </tr>
                            )
                        })}

                    </tbody>
                </table>
            </React.Fragment>
        )
    }
}

export default PersonaEncontrada;