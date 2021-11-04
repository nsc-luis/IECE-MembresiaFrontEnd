import React, { Component } from 'react';
import {
    Container, Row, Col, Card, CardHeader,
    CardBody, CardFooter, Form, Input, Label,
    Button, FormFeedback, Table, FormGroup,
    Modal, ModalFooter, ModalBody, ModalHeader
} from 'reactstrap';
import axios from 'axios';
import helpers from '../../components/Helpers';
import Layout from '../Layout';
import './style.css';
import FrmMatrimonioLegalizacion from './FrmMatrimonioLegalizacion';

class Matrimonio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            enableFrmRegistroMatLegal: false
        }
    }

    handle_frmMatrimonioLegalizacion = () => {
        this.setState({ enableFrmRegistroMatLegal: true })
    }

    handle_CancelaCaptura = () => {
        this.setState({ enableFrmRegistroMatLegal: false })
    }

    render() {
        return (
            <Layout>
                <Container>
                    {!this.state.enableFrmRegistroMatLegal &&
                        <React.Fragment>
                            <Row>
                                <h1 className="text-info">Matrimonios y legalizaciones</h1>
                            </Row>
                            <Row>
                                <Col sm="8"></Col>
                                <Col sm="4">
                                    <Button
                                        onClick={this.handle_frmMatrimonioLegalizacion}
                                        color="primary"
                                        size="sm"
                                        className="btnNuevoRegistro">
                                        Registrar nuevo matrimonio/legalización
                                    </Button>
                                </Col>
                            </Row>
                        </React.Fragment>
                    }
                    {this.state.enableFrmRegistroMatLegal &&
                        <FrmMatrimonioLegalizacion
                            handle_CancelaCaptura = {this.handle_CancelaCaptura}
                        />
                    }
                </Container>
            </Layout>
        )
    }
}

export default Matrimonio;