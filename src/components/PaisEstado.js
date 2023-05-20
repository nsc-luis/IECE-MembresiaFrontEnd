import React from 'react';
import axios from 'axios';
import helpers from './Helpers'

class PaisEstado extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            paises: [],
            estados: [],
            mostrarEstados: true
        }
    }

    componentDidMount() {
        this.getPaises();
        this.getEstados(this.props.domicilio.pais_Id_Pais)
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
                        this.setState({
                            mostrarEstados: false,
                            estados: []
                        });
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
        console.log("DomicilioPE: ", this.props.domicilio)
        const {
            domicilio,
            onChangeDomicilio,
            boolNvoEstado,
            handleChangeEstado,
            nvoEstado_Disponible
        } = this.props

        const handle_pais_Id_Pais = (e) => {// Cuando cambia el País
            this.getEstados(e.target.value) //Trae los Estados disponibles
            onChangeDomicilio(e) //Pasa los datos del evento a la función Origen
        }

        return (
            <React.Fragment>
                <div className="col-sm-4">
                    <select
                        name="pais_Id_Pais"
                        className="form-control"
                        onChange={handle_pais_Id_Pais}
                        value={domicilio.pais_Id_Pais}
                        autoComplete="nope"
                    >
                        <option value="0">Seleccione un País</option>
                        {
                            this.state.paises.map((pais) => {
                                return (
                                    <option key={pais.pais_Id_Pais} value={pais.pais_Id_Pais}> {pais.pais_Nombre} </option>
                                )
                            })
                        }
                    </select>
                    <label htmlFor="pais_Id_Pais">País *</label>
                </div>
                <div className="col-sm-4">
                    <select
                        name="est_Id_Estado"
                        className="form-control"
                        value={domicilio.est_Id_Estado}
                        onChange={handleChangeEstado}
                        autoComplete="nope"
                    >
                        <option value="0">Seleccione un Estado</option>
                        {
                            this.state.estados.map((estado) => {
                                return (
                                    <option key={estado.est_Id_Estado} value={estado.est_Id_Estado}> {estado.est_Nombre} </option>
                                )
                            })
                        }
                        {nvoEstado_Disponible &&
                            <option value="999">Otro Estado</option>
                        }
                    </select>
                    <label>Estado/Provincia *</label>
                </div>
                {boolNvoEstado &&
                    <div className="col-sm-4">
                        <input
                            type="text"
                            name="nvoEstado"
                            className="form-control"
                            style={{ backgroundColor: '#feffdd' }}
                            value={domicilio.nvoEstado}
                            onChange={onChangeDomicilio}
                        />
                        <label>Nuevo Estado *</label>
                    </div>
                }
            </React.Fragment>
        )
    }
}

export default PaisEstado;