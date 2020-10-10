import React, { Component } from 'react';

class ListaDePersonal extends Component {

    contador = 0;

    /* constructor(props){
        super(props);
        this.state = {
            contador : 0
        }
    } */

    state = {
        contador: 0,
        sector: "Sector 1, Vivienda popular",
        distrito: "Distrito 42",
        personas: [
            { id: 1, nombre: "Dalila Itzarelly", apellidoPaterno: "Alonso", apellidoMaterno: "Velazquez" },
            { id: 2, nombre: "Luis Gerardo", apellidoPaterno: "Rodriguez", apellidoMaterno: "Ovalle" }
        ]
    }

    sumar = (e) => {
        //this.contador = this.contador++;
        this.setState({
            contador: (this.state.contador + 1)
        });
    }

    restar = (e) => {
        //this.contador = this.contador--;
        this.setState({
            contador: (this.state.contador - 1)
        });
    }

    render() {
        return (

            <React.Fragment>
                <h1>Listado de personal</h1>
                <p>Personal del sector {this.state.sector} en el {this.state.distrito}</p>
                <a href="/RegistroDePersonal" className="btn bnt-sm btn-primary">Registrar persona</a>

                <table className="table" id="tblPersonas">
                    <thead>
                        <tr>
                            <th scope="col">Nombre</th>
                            <th scope="col">Apellido paterno</th>
                            <th scope="col">Apellido materno</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.personas.map((persona, i) => {
                                return (
                                    <tr key={i}>
                                        <td scope="row">{persona.nombre}</td>
                                        <td>{persona.apellidoPaterno}</td>
                                        <td>{persona.apellidoMaterno}</td>
                                        <td>Editar Borrar Hogar</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>

                {/*<p>
                    Contador: {this.state.contador}
                </p>
                <input type="button" value="sumar" onClick={this.sumar} />
                <input type="button" value="restar" onClick={this.restar} />*/}
            </React.Fragment>

        );
    };
}

export default ListaDePersonal;