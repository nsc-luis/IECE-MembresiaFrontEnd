import React, { Component } from 'react';
import helpers from '../../components/Helpers';
import Layout from '../Layout';
import Modal from 'react-modal';
import {
    Container, Row, Col, Form, FormGroup, Input, Button,
    FormFeedback, /* CardTitle, */ Card, CardBody, CardHeader
} from 'reactstrap';
import HogarPersonaDomicilio from '../Persona/HogarPersonaDomicilio';

class RevinculaDomicilio extends Component {

    constructor(props) {
        super(props)
        this.state = {
            domicilio: {},
            hogar: {},
            DatosHogarDomicilio: {},
            MiembrosDelHogar: {},
            JerarquiasDisponibles: {}
        }
    }

    componentDidMount(){

    }

    onChangeDomicilio = () => {

    }

    handle_hd_Id_Hogar = () => {

    }

    handle_hp_Jerarquia = () => {

    }

    render() {
        return (
            <Layout>
                <HogarPersonaDomicilio
                    domicilio={this.state.domicilio}
                    onChangeDomicilio={this.onChangeDomicilio}
                    handle_hd_Id_Hogar={this.handle_hd_Id_Hogar}
                    handle_hp_Jerarquia={this.handle_hp_Jerarquia}
                    hogar={this.state.hogar}
                    DatosHogarDomicilio={this.state.DatosHogarDomicilio}
                    MiembrosDelHogar={this.state.MiembrosDelHogar}
                    JerarquiasDisponibles={this.state.JerarquiasDisponibles}
                />
            </Layout>
        )
    }
}

export default RevinculaDomicilio;