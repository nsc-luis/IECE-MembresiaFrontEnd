import React, { Component } from 'react'
import helpers from './Helpers'
import { Row, Col, Container/* , FormFeedback */ } from 'reactstrap'
/* import axios from 'axios' */

class PersonalMinisterial extends Component {
    url = helpers.url_api

    constructor(props) {
        super(props)
        this.state = {
        }
    }    

    render() {
        const { ministros, handle_pem_Id_Ministro, ministroSeleccionado } = this.props

        return (
            <Container>
                <Row>
                    <Col xs="4">
                        <label><strong>*</strong> Ministro</label>
                    </Col>
                    <Col xs="8">
                        <select
                            name="pem_Id_Ministro"
                            className="form-control"
                            onChange={handle_pem_Id_Ministro}
                            value={ministroSeleccionado}
                        >
                            <option value="0">Seleccione un ministro</option>
                            {
                                ministros.map((ministro) => {
                                    return (
                                        <option key={ministro.pem_Id_Ministro} value={ministro.pem_Id_Ministro}>
                                            {ministro.pem_Nombre}&nbsp;
                                            ({ministro.pem_Grado_Ministerial})
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

export default PersonalMinisterial;