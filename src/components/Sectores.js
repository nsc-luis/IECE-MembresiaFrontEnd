import React, { Component } from 'react'
import axios from 'axios'
import Globales from '../Global'

class Sectores extends Component {
    url = Globales.url_api

    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const { sectores, form, onChange } = this.props

        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-sm-2">
                        <label><strong>*</strong> Sector</label>
                    </div>
                    <div className="col-sm-4">
                        <select
                            name="sec_Id_Sector"
                            className="form-control"
                            onChange={onChange}
                            value={form.sec_Id_Sector}
                        >
                            <option value="0">Seleccione un sector</option>
                            {
                                sectores.map((sector) => {
                                    return (
                                        <option key={sector.sec_Id_Sector} value={sector.sec_Id_Sector}>
                                            {sector.sec_Tipo_Sector}:&nbsp;
                                            {sector.sec_Alias}
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

export default Sectores