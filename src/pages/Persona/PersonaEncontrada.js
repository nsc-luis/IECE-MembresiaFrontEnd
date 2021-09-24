import React from 'react';

class PersonaEncontrada extends React.Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {

        const { datosPersonaEncontrada } = this.props

        return (
            <React.Fragment>
                <div className="alert alert-warning mt-3" role="alert">
                    <h5><strong>AVISO: </strong>Se ha encontrado una persona con el mismo RFC: {/* {form.RFCSinHomoclave} */} (SIN homoclave), asegurese de no duplicar a la persona.</h5>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Nombre</th>
                            <th scope="col">Nacimiento</th>
                            <th scope="col">Distrito</th>
                            <th scope="col">Sector</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{datosPersonaEncontrada.per_Nombre} {datosPersonaEncontrada.per_Apellido_Paterno} {datosPersonaEncontrada.per_Apellido_Materno} </td>
                            <td>{datosPersonaEncontrada.per_Fecha_Nacimiento} </td>
                            <td>{datosPersonaEncontrada.dis_Tipo_Distrito} {datosPersonaEncontrada.dis_Numero}</td>
                            <td>{datosPersonaEncontrada.sec_Alias}</td>
                        </tr>
                    </tbody>
                </table>
            </React.Fragment>
        )
    }
}

export default PersonaEncontrada;