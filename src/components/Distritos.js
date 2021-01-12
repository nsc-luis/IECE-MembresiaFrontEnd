import React, { Component } from 'react'
import axios from 'axios'
import Globales from '../Global'

class Distritos extends Component {
    url = Globales.url_api

    constructor(props) {
        super(props)
        this.state = {
            distritos: []
        }
    }

    componentWillMount() {
        this.getDistritos()
    }

    getDistritos = async () => {
        await axios.get(this.url + '/Distrito')
            .then(res => {
                this.setState({
                    distritos: res.data.distritos
                })
            })
    }

    render() {
        const { handle_dis_Id_Distrito } = this.props

        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-sm-2">
                        <label>Distrito</label>
                    </div>
                    <div className="col-sm-4">
                        <select
                            name="dis_Id_Distrito"
                            className="form-control"
                            onChange={handle_dis_Id_Distrito}
                        >
                            <option value="0">Seleccione un distrito</option>
                            {
                                this.state.distritos.map((distrito) => {
                                    return (
                                        <option key={distrito.dis_Id_Distrito} value={distrito.dis_Id_Distrito}>
                                            {distrito.dis_Tipo_Distrito}:&nbsp;
                                            {distrito.dis_Numero}, &nbsp;
                                            {distrito.dis_Alias}, &nbsp;
                                            {distrito.dis_Area}
                                        </option>
                                    )
                                })
                            }
                        </select>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Distritos