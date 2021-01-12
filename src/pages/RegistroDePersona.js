import React, { Component } from 'react';
import PersonaForm from '../components/PersonaForm';
// import MomentLocalUtils from 'react-day-picker/moment';

class RegistroDePersonal extends Component {

    state = {
        form: {}
    }

    handleChange = (e) => {
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        })
        if (e.target.name === "per_Nombre"
            || e.target.name === "per_Apellido_Paterno"
            || e.target.name === "per_Apellido_Materno"
            || e.target.name === "per_Fecha_Nacimiento") {
            // Obtener primera letra del apellido paterno
            //var ap = e.target.name.per_Apellido_Paterno.split("");
            // Obtener primera vocal del apellido paterno
            var regex = /[^aeiou]/gi;
            //var vowels = e.target.name.per_Apellido_Paterno.replace(regex, "");
            //var pv = vowels[0] === ap[0] ? vowels[1] : vowels[0];

            // Obtener primera letra del apellido materno
            //var am = e.target.name.per_Apellido_Materno.split("");
            // Obtener primera letra del primer nombre
            //var n = e.target.name.per_Nombre.split("");

            //var RFCSinHomo = ap[0] + pv + am[0] + n[0];
            console.log(e.target.name);
            // this.getPersonaByRFCSinHomo(RFCSinHomo);

            // let fNacimPer = MomentLocalUtils.formatDate(day, 'YYYY-MM-DD')
            // this.setState({
            //     fechanNacimiento: fNacimPer
            // });
        }
    }

    render() {

        return (
            <PersonaForm
                onChange={this.handleChange}
                form={this.state.form}
            />
        )
    }
}

export default RegistroDePersonal;