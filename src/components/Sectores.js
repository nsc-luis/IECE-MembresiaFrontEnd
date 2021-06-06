import React, { Component } from 'react'
import helpers from './Helpers'
import { Row, Col, Container, FormFeedback } from 'reactstrap'

class Sectores extends Component {
    url = helpers.url_api

    constructor(props) {
        super(props)
    }

    render() {
        const { sectores, handle_sec_Id_Sector, sectorSeleccionado } = this.props

        return (
            <Container>
                <Row>
                    <Col xs="4">
                        <label><strong>*</strong> Sector</label>
                    </Col>
                    <Col xs="8">
                        <select
                            name="sec_Id_Sector"
                            className="form-control"
                            onChange={handle_sec_Id_Sector}
                            value={sectorSeleccionado}
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
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Sectores