import React from 'react';

class PersonaEncontrada extends React.Component {
    render() {
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
                            <th scope="col">Distrito / Localidad</th>
                            <th scope="col">Sector / Localidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {/* <td>{form.datosPersonaEncontrada.per_Nombre} {form.datosPersonaEncontrada.per_Apellido_Paterno} {form.datosPersonaEncontrada.per_Apellido_Materno} </td>
                            <td>{form.datosPersonaEncontrada.per_Fecha_Nacimiento} </td>
                            <td>{form.datosPersonaEncontrada.dis_Numero} / {form.datosPersonaEncontrada.dis_Localidad}</td>
                                                        <td>{form.datosPersonaEncontrada.sec_Numero} / {form.datosPersonaEncontrada.sec_Localidad}</td> */}
                        </tr>
                    </tbody>
                </table>
            </React.Fragment>
        )
    }
}

export default PersonaEncontrada;