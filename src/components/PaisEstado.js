import React from 'react';
import axios from 'axios';
import Global from '../Global';

class PaisEstado extends React.Component {

    url = Global.url_api;
    accessToken = localStorage.getItem('token');

    authAxios = axios.create({
        baseURL: this.url,
        headers: {
            Authorization: `Bearer ${this.accessToken}`
        }
    });

    constructor(props) {
        super(props);
        this.state = {
            paises: [],
            estados: [],
            mostrarEstados: false
        }
    }

    componentWillMount() {
        this.getPaises();
    }

    getEstados = async (pais_Id_Pais) => {
        await axios.get(this.url + "/Estado/GetEstadoByIdPais/" + pais_Id_Pais)
            .then(res => {
                this.setState({
                    estados: res.data.estados
                });
            });
        if (pais_Id_Pais === "151"
            || pais_Id_Pais === "66"
            || pais_Id_Pais === "40")
            this.setState({ mostrarEstados: true });
        else
            this.setState({ mostrarEstados: false });
    };

    getPaises = async () => {
        await this.authAxios.get("/pais")
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
                        <option value="0">Selecciona un pais</option>
                        {
                            this.state.paises.map((pais) => {
                                return (
                                    <option key={pais.pais_Id_Pais} value={pais.pais_Id_Pais}> {pais.pais_Nombre} </option>
                                )
                            })
                        }
                    </select>
                    <label htmlFor="pais_Id_Pais">Pais</label>
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
                        <label>Estado</label>
                    </div>
                }
            </React.Fragment>
        )
    }
}

export default PaisEstado;