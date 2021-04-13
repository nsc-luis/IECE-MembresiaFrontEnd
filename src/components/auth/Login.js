import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Globales from '../../Global';
import axios from 'axios';

class Login extends Component {

    url = Globales.url_api;
    constructor(props) {
        super(props);
        this.state = {
            token: "",
            credenciales: {}
        }
    }

    handleChange = (e) => {
        this.setState({
            credenciales: {
                ...this.state.credenciales,
                [e.target.name]: e.target.value
            }
        });
    }

    Login = async (e) => {
        e.preventDefault();
        await axios.post(
            this.url + '/usuario/login',
            this.state.credenciales)
            .then(res => {
                this.setState({
                    token: res.data.token
                });
                localStorage.setItem('token', this.state.token);
                localStorage.setItem('emailUser', this.state.credenciales.Email);
                console.log(localStorage.getItem('token'));
            });        
    }    

    render() {
        return (
            <React.Fragment>
                <div className="container">

                    {/* <!-- Outer Row --> */}
                    <div className="row justify-content-center">

                        <div className="col-xl-10 col-lg-12 col-md-9">

                            <div className="card o-hidden border-0 shadow-lg my-5">
                                <div className="card-body p-0">
                                    {/* <!-- Nested Row within Card Body --> */}
                                    <div className="row">
                                        {/* <div className="col-lg-6 d-none d-lg-block bg-login-image"></div> */}
                                        <div className="col-lg-3"></div>
                                        <div className="col-lg-6">
                                            <div className="p-5">
                                                <div className="text-center">
                                                    <h1 className="h4 text-gray-900 mb-4">Bienvenido!</h1>
                                                </div>
                                                <form onSubmit={this.Login} className="user">
                                                    <div className="form-group">
                                                        <input type="email" name="Email" onChange={this.handleChange} className="form-control form-control-user" id="exampleInputEmail" value={this.state.email} aria-describedby="emailHelp" placeholder="Direccion Email" />
                                                    </div>
                                                    <div className="form-group">
                                                        <input type="password" name="Password" onChange={this.handleChange} className="form-control form-control-user" value={this.state.contrasena} id="exampleInputPassword" placeholder="Contraseña" />
                                                    </div>
                                                    {/* <div className="form-group">
                                                                <div className="custom-control custom-checkbox small">
                                                                    <input type="checkbox" className="custom-control-input" id="customCheck" />
                                                                    <label className="custom-control-label" for="customCheck">Remember Me</label>
                                                                </div>
                                                            </div> */}
                                                    {/* <Link to="Home" className="btn btn-primary btn-user btn-block">
                                                        Iniciar sesion
                    </Link> */}
                                                    <button type="submit">
                                                        Iniciar sesion
                    </button>
                                                    {/* <hr />
                                                            <Link To="Home" className="btn btn-google btn-user btn-block">
                                                                <i className="fab fa-google fa-fw"></i> Login with Google
                    </Link>
                                                            <Link To="Home" className="btn btn-facebook btn-user btn-block">
                                                                <i className="fab fa-facebook-f fa-fw"></i> Login with Facebook
                    </Link> */}
                                                </form>
                                                {/* <hr />
                                                        <div className="text-center">
                                                            <Link className="small" href="forgot-password.html">Forgot Password?</Link>
                                                        </div>
                                                        <div className="text-center">
                                                            <Link className="small" href="register.html">Create an Account!</Link>
                                                        </div> */}
                                            </div>
                                        </div>
                                        <div className="col-lg-3"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment >
        )
    }
};

export default Login;