import React, { Component } from 'react'
import axios from 'axios'
import helpers from './Helpers'
import { Row, Col, Container, FormFeedback } from 'reactstrap'

class Distritos extends Component {
    url = helpers.url_api

    constructor(props) {
        super(props)
        this.state = {
            distritos: [],
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
        const { distritoSeleccionado, handle_dis_Id_Distrito } = this.props

        return (
            <Container>
                    <Row>
                        <Col xs="4">
                            <label><strong>*</strong> Distrito</label>
                        </Col>
                        <Col xs="8">
                            <select
                                name="dis_Id_Distrito"
                                className="form-control"
                                onChange={handle_dis_Id_Distrito}
                                value={distritoSeleccionado}
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
                        </Col>
                    </Row>

            </Container>
        )
    }
}

export default Distritos