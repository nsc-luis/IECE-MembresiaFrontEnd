import React, { Component } from 'react';
import PersonaForm from '../../components/PersonaForm';
import axios from 'axios';
import helpers from '../../components/Helpers';
import { v4 as uuidv4 } from 'uuid';
import Layout from '../Layout';
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from 'reactstrap';

class RegistroDePersonal extends Component {

    url = helpers.url_api;
    infoSesion = JSON.parse(localStorage.getItem('infoSesion'));

    constructor(props) {
        super(props);
        this.state = {
            form: {},
            domicilio: {},
            categoriaSeleccionada: false,
            msjCategoriaSeleccionada: "",
            habilitaPerBautizado: false,
            per_Nombre_NoValido: true,
            per_Apellido_Paterno_NoValido: true,
            per_Fecha_Nacimiento_NoValido: true,
            modalShow: false,
            mensajeDelProceso: ""
        }
    }

    componentWillMount() {
        this.setState({
            form: {
                ...this.state.form,
                per_Bautizado: false,
                per_RFC_Sin_Homo: "XAXX010101XXX",
                per_Estado_Civil: "SOLTERO(A)",
                per_foto: uuidv4(),
                per_Activo: 1,
                per_En_Comunion: 1,
                per_Vivo: 1,
                pro_Id_Profesion_Oficio1: "1",
                pro_Id_Profesion_Oficio2: "1",
                per_Fecha_Boda_Civil: "01/01/1900",
                per_Fecha_Boda_Eclesiastica: "01/01/1900",
                per_Fecha_Bautismo: "01/01/1900",
                per_Fecha_Recibio_Espiritu_Santo: "01/01/1900",
                per_Cargos_Desempenados: "",
                sec_Id_Sector: this.infoSesion.sec_Id_Sector
            },
            domicilio: {
                ...this.state.domicilio,
                hd_Tipo_Subdivision: "COL"
            }
        })
    }

    const_regex = {
        alphaSpaceRequired: /^[a-zA-Z]{3}[a-zA-Z\d\s]{0,37}$/,
        formatoFecha: /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/
    }

    handleChangeDomicilio = (e) => {
        this.setState({
            domicilio: {
                ...this.state.domicilio,
                [e.target.name]: e.target.value.toUpperCase()
            }
        })
    }

    handleChange = (e) => {
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value.toUpperCase()
            }
        })
        if (e.target.name === "per_Categoria") {
            console.log(e.target.value)
            switch (e.target.value) {
                default:
                    this.setState({
                        categoriaSeleccionada: false,
                        msjCategoriaSeleccionada: "Debes seleccionar una categoria valida.",
                        habilitaPerBautizado: false,
                        form: {
                            ...this.state.form,
                            per_Bautizado: false,
                            [e.target.name]: e.target.value.toUpperCase()
                        }
                    });
                    break;
                case "ADULTO_HOMBRE":
                    this.setState({
                        categoriaSeleccionada: true,
                        msjCategoriaSeleccionada: "Habilita todas las pestañas / Bautizado por defecto.",
                        habilitaPerBautizado: false,
                        form: {
                            ...this.state.form,
                            per_Bautizado: true,
                            [e.target.name]: e.target.value.toUpperCase()
                        }
                    });
                    break;
                case "ADULTO_MUJER":
                    this.setState({
                        categoriaSeleccionada: true,
                        msjCategoriaSeleccionada: "Habilita todas las pestañas / Bautizado por defecto.",
                        habilitaPerBautizado: false,
                        form: {
                            ...this.state.form,
                            per_Bautizado: true,
                            [e.target.name]: e.target.value.toUpperCase()
                        }
                    });
                    break;
                case "JOVEN_HOMBRE":
                    this.setState({
                        categoriaSeleccionada: true,
                        msjCategoriaSeleccionada: "Habilita las perstañas: Personales, Eclesiasticos y Hogar.",
                        habilitaPerBautizado: true,
                        form: {
                            ...this.state.form,
                            per_Bautizado: false,
                            [e.target.name]: e.target.value.toUpperCase()
                        }
                    });
                    break;
                case "JOVEN_MUJER":
                    this.setState({
                        categoriaSeleccionada: true,
                        msjCategoriaSeleccionada: "Habilita las perstañas: Personales, Eclesiasticos y Hogar.",
                        habilitaPerBautizado: true,
                        form: {
                            ...this.state.form,
                            per_Bautizado: false,
                            [e.target.name]: e.target.value.toUpperCase()
                        }
                    });
                    break;
                case "NIÑO":
                    this.setState({
                        categoriaSeleccionada: true,
                        msjCategoriaSeleccionada: "Habilita solo la pestaña Hogar / NO Bautizado por defecto.",
                        habilitaPerBautizado: false,
                        form: {
                            ...this.state.form,
                            per_Bautizado: false,
                            [e.target.name]: e.target.value.toUpperCase()
                        }
                    });
                    break;
                case "NIÑA":
                    this.setState({
                        categoriaSeleccionada: true,
                        msjCategoriaSeleccionada: "Habilita solo la pestaña Hogar / NO Bautizado por defecto.",
                        habilitaPerBautizado: false,
                        form: {
                            ...this.state.form,
                            per_Bautizado: false,
                            [e.target.name]: e.target.value.toUpperCase()
                        }
                    });
                    break;
            }
        }
        if (e.target.name === "per_Bautizado") {
            if (e.target.checked) {
                this.setState({
                    // per_Bautizado: true,
                    form: {
                        ...this.state.form,
                        per_Bautizado: true
                    }
                });
            } else {
                this.setState({
                    // per_Bautizado: false,
                    form: {
                        ...this.state.form,
                        [e.target.name]: false
                    }
                });
            }
        }
        if (e.target.name === "per_Nombre") {
            if (!this.const_regex.alphaSpaceRequired.test(e.target.value)) {
                this.setState({
                    per_Nombre_NoValido: true
                });
            } else {
                this.setState({
                    per_Nombre_NoValido: false
                });
            }
        }
        if (e.target.name === "per_Apellido_Paterno") {
            if (!this.const_regex.alphaSpaceRequired.test(e.target.value)) {
                this.setState({
                    per_Apellido_Paterno_NoValido: true
                });
            } else {
                this.setState({
                    per_Apellido_Paterno_NoValido: false
                });
            }
        }
        if (e.target.name === "per_Fecha_Nacimiento") {
            if (!this.const_regex.formatoFecha.test(e.target.value)) {
                this.setState({ per_Fecha_Nacimiento_NoValido: true });
            } else {
                this.setState({
                    per_Fecha_Nacimiento_NoValido: false
                });

            }
        }
    }

    changeRFCSinHomo = (str) => {
        this.setState({
            form: {
                ...this.state.form,
                per_RFC_Sin_Homo: str.toUpperCase()
            }
        })
    }

    changeEstadoCivil = (str) => {
        this.setState({
            form: {
                ...this.state.form,
                per_Estado_Civil: str.toUpperCase()
            }
        })
    }

    fnGuardaPersona = async (datos) => {
        try {
            await axios.post(this.url + "/persona/AddPersonaDomicilioHogar", datos)
                .then(res => {
                    if (res.data.status === "success") {
                        alert("Datos guardados satisfactoriamente");
                        setTimeout(() => { document.location.href = '/ListaDePersonal'; }, 3000);
                    } else {
                        alert("Error: No se pudo guardar. Revise los datos ingresados");
                    }
                });
        } catch (error) {
            alert("Error: Hubo un problema en la comunicacion con el servidor. Intente mas tarde.");
            setTimeout(() => { document.location.href = '/ListaDePersonal'; }, 3000);
        }
    }

    fnGuardaPersonaEnHogar = async (datos, jerarquia, hdId) => {
        try {
            await axios.post(this.url + "/persona/AddPersonaHogar/" + jerarquia + "/" + hdId, datos)
                .then(res => {
                    if (res.data.status === "success") {
                        this.setState({
                            mensajeDelProceso: "Procesando...",
                            modalShow: true
                        });
                        setTimeout(() => {
                            this.setState({
                                mensajeDelProceso: "Los datos fueron grabados satisfactoriamente."
                            });
                        }, 1500);
                        setTimeout(() => {
                            document.location.href = '/ListaDePersonal'
                        }, 3500);
                    } else {
                        alert("Error: No se pudo guardar. Revise los datos ingresados");
                    }
                })
        } catch (error) {
            alert("Error: Hubo un problema en la comunicacion con el servidor. Intente mas tarde.");
            setTimeout(() => { document.location.href = '/ListaDePersonal'; }, 3000);
        }
    }

    render() {

        return (
            <Layout>
                <PersonaForm
                    onChange={this.handleChange}
                    form={this.state.form}
                    onChangeDomicilio={this.handleChangeDomicilio}
                    domicilio={this.state.domicilio}
                    categoriaSeleccionada={this.state.categoriaSeleccionada}
                    msjCategoriaSeleccionada={this.state.msjCategoriaSeleccionada}
                    habilitaPerBautizado={this.state.habilitaPerBautizado}
                    per_Nombre_NoValido={this.state.per_Nombre_NoValido}
                    per_Apellido_Paterno_NoValido={this.state.per_Apellido_Paterno_NoValido}
                    per_Fecha_Nacimiento_NoValido={this.state.per_Fecha_Nacimiento_NoValido}
                    changeRFCSinHomo={this.changeRFCSinHomo}
                    changeEstadoCivil={this.changeEstadoCivil}
                    fnGuardaPersona={this.fnGuardaPersona}
                    fnGuardaPersonaEnHogar={this.fnGuardaPersonaEnHogar}
                />
                {/*Modal success*/}
                <Modal isOpen={this.state.modalShow}>
                    {/* <ModalHeader>
                        Solo prueba.
                    </ModalHeader> */}
                    <ModalBody>
                        {this.state.mensajeDelProceso}
                    </ModalBody>
                    {/* <ModalFooter>
                        <Button color="secondary" onClick={this.handle_modalClose}>Cancel</Button>
                    </ModalFooter> */}
                </Modal>
            </Layout>
        )
    }
}

export default RegistroDePersonal;