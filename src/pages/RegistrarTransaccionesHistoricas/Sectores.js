import React, { Component } from 'react'
import { Row, Col, FormGroup, FormFeedback, Input } from 'reactstrap'

class Sectores extends Component {

    render() {
        const { sectores, onChange, sec_Id_Sector, secIdSectorInvalid } = this.props

        return (
            <FormGroup>
                <Row>
                    <Col xs="3">
                        <label>* Sector</label>
                    </Col>
                    <Col xs="9">
                        <Input
                            type="select"
                            name="sec_Id_Sector"
                            className="form-control"
                            onChange={onChange}
                            value={sec_Id_Sector}
                            invalid={secIdSectorInvalid}
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
                        </Input>
                        <FormFeedback>Este campo es requerido</FormFeedback>
                    </Col>
                </Row>
            </FormGroup>
        )
    }
}

export default Sectores