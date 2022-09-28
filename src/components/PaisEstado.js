import React from 'react';
import axios from 'axios';
import helpers from './Helpers'

class PaisEstado extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            paises: [],
            estados: [],
            mostrarEstados: false
        }
    }

    componentDidMount() {
        this.getPaises();
    }

    getEstados = async (pais_Id_Pais) => {
        await helpers.authAxios.get(helpers.url_api + "/Estado/GetEstadoByIdPais/" + pais_Id_Pais)
            .then(res => {
                if (res.data.status === true) {
                    let contador = 0;
                    res.data.estados.forEach(estado => {
                        contador = contador + 1;
                    });
                    if (contador > 0) {
                        this.setState({
                            estados: res.data.estados,
                            mostrarEstados: true
                        });
                    }
                    else {
                        this.setState({ mostrarEstados: false });
                    }
                }
            });
    }

    getPaises = async () => {
        await helpers.authAxios.get(helpers.url_api + "/pais")
            .then(res => {
                this.setState({
                    paises: res.data
                });
            });
    };

    render() {

        const { domicilio, onChangeDomicilio } = this.props
        const handle_pais_Id_Pais = (e) => {
            this.getEstados(e.target.value)
            onChangeDomicilio(e)
        }

        return (
            <React.Fragment>
                <div className="col-sm-4">
                    <select
                        name="pais_Id_Pais"
                        className="form-control"
                        onChange={handle_pais_Id_Pais}
                        value={domicilio.pais_Id_Pais}
                    >
                        <option value="0">Selecciona un pais *</option>
                        {
                            this.state.paises.map((pais) => {
                                return (
                                    <option key={pais.pais_Id_Pais} value={pais.pais_Id_Pais}> {pais.pais_Nombre} </option>
                                )
                            })
                        }
                    </select>
                    <label htmlFor="pais_Id_Pais">País</label>
                </div>
                {this.state.mostrarEstados &&
                    <div className="col-sm-4">
                        <select
                            name="est_Id_Estado"
                            className="form-control"
                            value={domicilio.est_Id_Estado}
                            onChange={onChangeDomicilio}
                        >
                            <option value="0">Selecciona un estado</option>
                            {
                                this.state.estados.map((estado) => {
                                    return (
                                        <option key={estado.est_Id_Estado} value={estado.est_Id_Estado}> {estado.est_Nombre} </option>
                                    )
                                })
                            }
                        </select>
                        <label>Estado/Provincia</label>
                    </div>
                }
                {!this.state.mostrarEstados &&
                    <div className="col-sm-4">
                        <input
                            type="text"
                            name="nvoEstado"
                            className="form-control"
                            value={domicilio.nvoEstado}
                            onChange={onChangeDomicilio}
                        />
                        <label>Estado/Provincia</label>
                    </div>
                }
            </React.Fragment>
        )
    }
}

export default PaisEstado;