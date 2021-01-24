import React from 'react';
import axios from 'axios';
import Global from '../Global';

class PaisEstado extends React.Component {

    url = Global.url_api;
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

    getEstados = async (pais_Nombre_Corto) => {
        await axios.get(this.url + "/pais/GetEstadoByPais/" + pais_Nombre_Corto)
            .then(res => {
                this.setState({
                    estados: res.data.estados
                });
            });
        if (pais_Nombre_Corto === "MEX"
            || pais_Nombre_Corto === "USA"
            || pais_Nombre_Corto === "CAN")
            this.setState({ mostrarEstados: true });
        else
            this.setState({ mostrarEstados: false });
    };

    getPaises = async () => {
        await axios.get(this.url + "/pais")
            .then(res => {
                this.setState({
                    paises: res.data
                });
            });
    };

    render() {

        const { domicilio, onChangeDomicilio } = this.props

        const handle_pais_Nombre_Corto = (e) => {
            this.getEstados(e.target.value)
            onChangeDomicilio(e)
        }
        
        return (
            <React.Fragment>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-2">
                            <label htmlFor="pais_Id_Pais">Pais</label>
                        </div>
                        <div className="col-sm-4">
                            <select
                                name="pais_Id_Pais"
                                className="form-control"
                                onChange={handle_pais_Nombre_Corto}
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
                        </div>
                    </div>
                </div>
                {this.state.mostrarEstados &&
                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label>Estado</label>
                            </div>
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
                            </div>
                        </div>
                    </div>
                }
            </React.Fragment>
        )
    }
}

export default PaisEstado;