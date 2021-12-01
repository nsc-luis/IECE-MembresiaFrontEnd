import React, { Component/* , useEffect */ } from 'react';
import axios from 'axios';
import {
    Form, FormGroup, Input, Button, Row, Col,
    Container, /* FormFeedback, */ Card, CardBody, CardTitle
} from 'reactstrap'
import Distritos from '../../components/Distritos';
import Sectores from '../../components/Sectores';
import PersonalMinisterial from './PersonalMinisterial';
import EmailsMinistro from './EmailsMinistro';
import helpers from '../../components/Helpers';
import PasswordEmailUsuario from './PasswordEmailUsuario';

class Signup extends Component {
    url = helpers.url_api;

    constructor(props) {
        super(props);
        this.state = {
            distritoSeleccionado: "0",
            districtSelected: false,
            sectorSeleccionado: "0",
            sectorSelected: false,
            sectores: [],
            ministroSeleccionado: "0",
            minSelected: false,
            ministros: [],
            ministro: {},
            emailsMinistro: [],
            noExisteCorreo: false,
            emailParaRegistro: "",
            passEmailRegistro: "",
            emailInvalido: true,
            passwordInvalido: true,
            confirmacion: "",
            confirmacionInvalida: true,
            habilitaBotonGuardar: false,
            superSecreto: ""
        };
    }

    componentWillMount() {
    }

    // METODOS PARA DISTRITOS
    handle_dis_Id_Distrito = (e) => {
        if (e.target.value !== '0') {
            this.setState({
                distritoSeleccionado: e.target.value,
                districtSelected: true,
                sectores: [],
                ministros: [],
                emailsMinistro: [],
                habilitaBotonGuardar: false,
                emailInvalido: true,
                minSelected: false
            });
            this.getSectores(e.target.value);
        } else {
            this.setState({
                distritoSeleccionado: e.target.value,
                districtSelected: false,
                habilitaBotonGuardar: false,
                emailInvalido: true,
                minSelected: false
            });
        }
    }

    // METODOS PARA SECTORES
    getSectores = async (distrito) => {
        await axios.get(this.url + "/Sector/GetSectoresByDistrito/" + distrito)
            .then(res => {
                this.setState({
                    sectores: res.data.sectores
                })
            })
    }

    handle_sec_Id_Sector = (e) => {
        if (e.target.value !== '0') {
            this.setState({
                sectorSeleccionado: e.target.value,
                sectorSelected: true,
                ministros: [],
                ministro: {},
                emailsMinistro: [],
                habilitaBotonGuardar: false,
                emailInvalido: true,
                minSelected: false
            });
            this.getMinistros(e.target.value);
        } else {
            this.setState({
                sectorSeleccionado: e.target.value,
                sectorSelected: false,
                ministros: [],
                ministro: {},
                emailsMinistro: [],
                habilitaBotonGuardar: false,
                emailInvalido: true,
                minSelected: false
            });
        }
    }

    // METODOS PARA MINISTROS
    handle_pem_Id_Ministro = (e) => {
        if (e.target.value !== '0') {
            this.setState({
                ministroSeleccionado: e.target.value,
                minSelected: true,
                emailsMinistro: [],
                emailParaRegistro: "",
                emailInvalido: true,
                passEmailRegistro: "",
                passwordInvalido: true,
                habilitaBotonGuardar: false
            });
            this.getMinistro(e.target.value)
        } else {
            this.setState({
                ministroSeleccionado: e.target.value,
                minSelected: false,
                noExisteCorreo: false,
                habilitaBotonGuardar: false
            });
        }
    }

    getMinistros = async (sector) => {
        // await axios.get(this.url + "/PersonalMinisterial/GetMinistrosBySector/" + sector)
        await axios.get(this.url + "/Sector/GetPastorBySector/" + sector)
            .then(res => {
                this.setState({
                    // ministros: res.data.personalMinisterial
                    ministros: res.data.ministros
                })
            })
    }

    getMinistro = async (ministro) => {
        if (ministro !== '0') {
            await axios.get(this.url + "/PersonalMinisterial/" + ministro)
                .then(res => {
                    this.setState({
                        ministro: res.data
                    })
                    if (res.data.pem_emailIECE !== null && res.data.pem_emailIECE !== "") {
                        this.setState({
                            emailsMinistro: [
                                ...this.state.emailsMinistro, res.data.pem_emailIECE
                            ]
                        })
                    }
                    if (res.data.pem_email_Personal !== null && res.data.pem_email_Personal !== "") {
                        this.setState({
                            emailsMinistro: [
                                ...this.state.emailsMinistro, res.data.pem_email_Personal
                            ]
                        })
                    }
                    if (this.state.emailsMinistro.length === 0) {
                        this.setState({ noExisteCorreo: true })
                    } else {
                        this.setState({ noExisteCorreo: false })
                    }
                })
            // console.log(this.state.emailsMinistro.length);
        } else {
            this.setState({
                emailsMinistro: []
            });
        }
    }

    // METODOS PARA EMAIL
    handle_emailParaRegistro = (e) => {
        // e.target.value.toLowerCase();
        if (e.target.value !== "0") {
            this.setState({ emailParaRegistro: e.target.value })
        } else {
            this.setState({
                emailParaRegistro: e.target.value,
                passEmailRegistro: "",
                passwordInvalido: true,
                habilitaBotonGuardar: false
            })
        }
        if (helpers.validaFormatos(helpers.regex.formatoEmail, e.target.value)) {
            this.setState({ emailInvalido: true });
        } else {
            this.setState({ emailInvalido: false });
        }
    }
    handle_passEmailRegistro = (e) => {
        if (e.target.value !== "0") {
            this.setState({ passEmailRegistro: e.target.value })
        } else {
            this.setState({ passEmailRegistro: e.target.value })
        }
        if (helpers.validaFormatos(helpers.regex.formatoPassword, e.target.value)) {
            this.setState({ passwordInvalido: true });
        } else {
            this.setState({ passwordInvalido: false });
        }
        if (e.target.value === this.state.confirmacion) {
            this.setState({
                confirmacionInvalida: false,
                habilitaBotonGuardar: true
            })
        } else {
            this.setState({
                confirmacionInvalida: true,
                habilitaBotonGuardar: false
            })
        }
    }

    // METODO PARA VALIDAR CONFIRMACION DE PASSWORD
    handle_confirmacion = (e) => {
        if (e.target.value !== "") {
            this.setState({ confirmacion: e.target.value })
        } else {
            this.setState({ confirmacion: e.target.value })
        }
        if (this.state.passEmailRegistro === e.target.value) {
            this.setState({
                confirmacionInvalida: false,
                habilitaBotonGuardar: true
            })
        } else {
            this.setState({
                confirmacionInvalida: true,
                habilitaBotonGuardar: false
            })
        }
    }

    handle_superSecreto = (e) => {
        if (e.target.value !== "") {
            this.setState({ superSecreto: e.target.value })
        } else {
            this.setState({ superSecreto: e.target.value })
        }
    }

    guardarNvoUsuario = async (e) => {
        e.preventDefault();
        var data = {
            Email: this.state.emailParaRegistro,
            Password: this.state.passEmailRegistro,
            superSecreto: this.state.superSecreto
        };
        var altaUsuario = false;
        var AspNetUserId = "";
        this.setState({ superSecreto: "" });
        await axios.post(this.url + "/Usuario/Create/", data)
            .then(res => {
                if (res.data.status === "success") {
                    alert(res.data.mensaje);
                    altaUsuario = true;
                    AspNetUserId = res.data.nvoUsuario.id;
                } else {
                    let mensaje = "Error! \n";
                    if (Array.isArray(res.data.mensaje)) {
                        res.data.mensaje.forEach(msj => {
                            mensaje += "Codigo: " + msj.code + "\nDescripcion: " + msj.description + "\n";
                        })
                        alert(mensaje);
                    }
                    else {
                        alert(res.data.mensaje);
                    }
                }
            })
        if (altaUsuario) {
            await axios.post(
                this.url + "/Ministro_Usuario",
                {
                    mu_aspNetUsers_Id: AspNetUserId,
                    mu_pem_Id_Pastor: this.state.ministroSeleccionado,
                    mu_permiso: "CRUD"
                }
            );
            setTimeout(() => { document.location.href = '/'; }, 1500);
        }
    }

    render() {
        return (
            <React.Fragment>
                <Container>
                    {/* <!-- Outer Row --> */}
                    <Row className="justify-content-center">
                        <Col xs="12">
                            <Card className="o-hidden border-0 shadow-lg my-5">
                                <CardBody className="p-0">
                                    {/* <!-- Nested Row within Card Body --> */}
                                    <Row>
                                        <Col xs="3" />
                                        <Col xs="6" className="p-3">
                                            <CardTitle className="text-center">
                                                <h1 className="h4 text-gray-900 mb-4">Registro de usuarios</h1>
                                            </CardTitle>
                                            <Form onSubmit={this.guardarNvoUsuario}>
                                                <div className="alert alert-warning mt-3" role="alert">
                                                    <h5><strong>AVISO: </strong>Los campos marcados con <strong>*</strong> son requeridos.</h5>
                                                </div>
                                                <FormGroup>
                                                    <Distritos
                                                        handle_dis_Id_Distrito={this.handle_dis_Id_Distrito}
                                                        distritoSeleccionado={this.state.distritoSeleccionado}
                                                    />
                                                </FormGroup>
                                                {this.state.districtSelected &&
                                                    <React.Fragment>
                                                        <FormGroup>
                                                            <Sectores
                                                                sectores={this.state.sectores}
                                                                handle_sec_Id_Sector={this.handle_sec_Id_Sector}
                                                                sectorSeleccionado={this.state.sectorSeleccionado}
                                                            />
                                                        </FormGroup>
                                                    </React.Fragment>
                                                }
                                                {this.state.sectorSelected &&
                                                    <React.Fragment>
                                                        <FormGroup>
                                                            <PersonalMinisterial
                                                                ministros={this.state.ministros}
                                                                handle_pem_Id_Ministro={this.handle_pem_Id_Ministro}
                                                                ministroSeleccionado={this.state.ministroSeleccionado}
                                                            />
                                                        </FormGroup>
                                                        {this.state.minSelected &&
                                                            <FormGroup>
                                                                <EmailsMinistro
                                                                    emailsMinistro={this.state.emailsMinistro}
                                                                    noExisteCorreo={this.state.noExisteCorreo}
                                                                    emailParaRegistro={this.state.emailParaRegistro}
                                                                    handle_emailParaRegistro={this.handle_emailParaRegistro}
                                                                    emailInvalido={this.state.emailInvalido}
                                                                    msjRegexInvalido={helpers.msjRegexInvalido}
                                                                />
                                                            </FormGroup>
                                                        }
                                                        {!this.state.emailInvalido &&
                                                            <FormGroup>
                                                                <PasswordEmailUsuario
                                                                    handle_passEmailRegistro={this.handle_passEmailRegistro}
                                                                    passEmailRegistro={this.state.passEmailRegistro}
                                                                    passwordInvalido={this.state.passwordInvalido}
                                                                    msjRegexInvalido={helpers.msjRegexInvalido}
                                                                    handle_confirmacion={this.handle_confirmacion}
                                                                    confirmacionInvalida={this.state.confirmacionInvalida}
                                                                />
                                                            </FormGroup>
                                                        }
                                                        {this.state.habilitaBotonGuardar &&
                                                            <React.Fragment>
                                                                <div className="alert alert-warning mt-3" role="alert">
                                                                    <strong>AVISO: </strong>Por seguridad se requiere la <strong>clave secreta</strong> para el registro.
                                                                </div>
                                                                <FormGroup>
                                                                    <Row>
                                                                        <Col xs="4">
                                                                            <label>* Super secreto: </label>
                                                                        </Col>
                                                                        <Col xs="8">
                                                                            <Input
                                                                                type="text"
                                                                                onChange={this.handle_superSecreto}
                                                                                value={this.state.superSecreto}
                                                                                className="inputEmail"
                                                                            />
                                                                        </Col>
                                                                    </Row>
                                                                </FormGroup>
                                                                <FormGroup className="text-center">
                                                                    <Button
                                                                        color="primary"
                                                                        type="submit"
                                                                    >
                                                                        Guardar
                                                                </Button>
                                                                </FormGroup>
                                                            </React.Fragment>
                                                        }
                                                    </React.Fragment>
                                                }
                                            </Form>
                                        </Col>
                                        <Col xs="3" />
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </React.Fragment>
        )
    }
}

export default Signup;