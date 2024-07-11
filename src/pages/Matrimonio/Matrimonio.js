import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
    Container, Row, Col, Card, CardHeader,
    CardBody, CardFooter, Form, Input, Label,
    Button, FormFeedback, FormGroup,
    Modal, ModalBody, ButtonGroup, Alert
} from 'reactstrap';
import helpers from '../../components/Helpers';
import './style.css';
import HogarPersonaDomicilio from './HogarPersonaDomicilio';

class Matrimonio extends Component {

    url = helpers.url_api;

    constructor(props) {
        super(props);
        this.state = {
            matLegal: {},
            bolForaneoHombre: false,
            bolForaneoMujer: false,
            hombres: [],
            mujeres: [],
            modalShow: false,
            mensajeDelProceso: "",
            rSelected: false,
            hogar: {},
            domicilio: {},
            habilitaComponenteDomicilio: false,
            boolNvoEstado: false,
            matNombreContrayenteMujerForaneoInvalid: false,
            matNombreContrayenteHombreForaneoInvalid: false,
            matTipoEnalceInvalid: false,
            perIdPersonaHombreInvalid: false,
            perIdPersonaMujerInvalid: false,
            matFechaBodaEclesiasticaInvalid: false,
            matFechaBodaCivilInvalid: false,
            sector: {},
            DatosHogarDomicilio: [],
            MiembrosDelHogar: [],
            JerarquiasDisponibles: [],
            direccion: "",
            mensajes: "",
            viviranEnLocalidad: false,
            ListaHogares: [],
            submitBtnDisable: false,
            nvoEstado_Disponible: true
        }
        localStorage.setItem("mat_Id_MatrimonioLegalizacion", "0")
        this.infoSesion = JSON.parse(localStorage.getItem('infoSesion'));
    }

    componentDidMount() {
        this.setState({
            matLegal: {
                ...this.state.matLegal,
                mat_Tipo_Enlace: "MATRIMONIO",
                per_Id_Persona_Hombre: "0",
                per_Id_Persona_Mujer: "0",
                mat_Nombre_Contrayente_Hombre_Foraneo: "",
                mat_Nombre_Contrayente_Mujer_Foraneo: "",
                mat_Fecha_Boda_Civil: null,
                mat_Numero_Acta: "",
                mat_Libro_Acta: "",
                mat_Oficialia: "",
                mat_Registro_Civil: "",
                mat_Fecha_Boda_Eclesiastica: null,
                mat_Cantidad_Hijos: "0",
                mat_Nombre_Hijos: "",
                mat_Apellido_Casada: "",
                dis_Id_Distrito: localStorage.getItem("dto"),
                sec_Id_Sector: localStorage.getItem("sector"),
                usu_Id_Usuario: this.infoSesion.pem_Id_Ministro
            },
            habilitaComponenteDomicilio: true,
            domicilio: {
                ...this.state.domicilio,
                hd_Tipo_Subdivision: "COL.",
                sec_Id_Sector: localStorage.getItem("sector"),
                dis_Id_Distrito: localStorage.getItem("dto"),
                pais_Id_Pais: "0",
                est_Id_Estado: "0",
                hd_Calle: "",
                hd_Localidad: "",
                hd_CP: "",
                hd_Numero_Exterior: "",
                usu_Id_Usuario: JSON.parse(localStorage.getItem('infoSesion')).pem_Id_Ministro,
                hd_Activo: true,
                nvoEstado: ""
            },
            hogar: { //Inicializa las variables del Objeto 'Hogar'
                ...this.state.hogar,
                hd_Id_Hogar: "0",
                hp_Jerarquia: "1"
            },
            mensajes: { //Inicializa las variables del Objeto 'mensajes'
                ...this.state.mensajes,
                emailInvalido: 'Formato incorrecto. Ej: buzon@dominio.com.',
                fechaBautismoInvalida: 'Debe ingresar la fecha de bautismo, formato admintido: dd/mm/aaaa.',
                fechaBodaCivilInvalida: 'Formato admitido: dd/mm/aaaa.',
                fechaEspitiruSantoInvalida: 'Formato admitido: dd/mm/aaaa.',
                fechaBodaEclesiasticaInvalida: 'Formato admitido: dd/mm/aaaa.',
                telMovilInvalido: 'Formatos admitidos: +521234567890, +52(123)4567890, (123)4567890, 1234567890. Hasta 25 numeros sin espacios.',
            }
        })

        this.getSector(localStorage.getItem("sector")); //Trae los datos del Sector y los graba en la Variable de Estado 'sector'
        this.getHombres(localStorage.getItem("sector")); //Trae Candidatos a Matrimonio
        this.getMujeres(localStorage.getItem("sector"));//Trae Candidatas a Matrimonio
    }

    ChangeSubmitBtnDisable = (bol) => {//Sirve para evitar multiples registros por dobleclick en botón Submit
        this.setState({ submitBtnDisable: bol });
    }

    getHombres = async (str) => {//Trae a los Hombres del Sector que esten Activas y que su estado civil sea diferente a 'Casado(a)' o 'Concubinato'
        await helpers.validaToken().then(helpers.authAxios.get(this.url + "/Matrimonio_Legalizacion/GetHombresPorSectorParaMatrimonio/" + localStorage.getItem("sector"))
            .then(res => {
                this.setState({
                    hombres: res.data.hombresParaMatrimonio.sort((a, b) => {
                        const nameA = a.per_Nombre; // ignore upper and lowercase
                        const nameB = b.per_Nombre; // ignore upper and lowercase
                        if (nameA < nameB) {
                            return -1;
                        }
                        if (nameA > nameB) {
                            return 1;
                        }

                        // names must be equal
                        return 0;
                    })

                })
            })
        )
    }

    getSector = async (id) => { //Trae los datos del Sector y los graba en la Variable de Estado 'sector'
        await helpers.validaToken().then(helpers.authAxios.get(`/Sector/${id}`)
            .then(res => {
                this.setState({ sector: res.data.sector[0] })
            })
        )
    }



    getMujeres = async (str) => {//Trae a las Mujeres del Sector que esten Activas y que su estado civil sea diferente a 'Casado(a)' o 'Concubinato'
        await helpers.validaToken().then(helpers.authAxios.get(this.url + "/Matrimonio_Legalizacion/GetMujeresPorSectorParaMatrimonio/" + localStorage.getItem("sector"))
            .then(res => {
                this.setState({
                    mujeres: res.data.mujeresParaMatrimonio.sort((a, b) => {
                        const nameA = a.per_Nombre; // ignore upper and lowercase
                        const nameB = b.per_Nombre; // ignore upper and lowercase
                        if (nameA < nameB) {
                            return -1;
                        }
                        if (nameA > nameB) {
                            return 1;
                        }

                        // names must be equal
                        return 0;
                    })
                })
            })
        )
    }

    onChangeForeaneos = (e) => {
        switch (e.target.name) {
            case "foraneoHombre":
                if (e.target.checked) {
                    this.setState({
                        bolForaneoHombre: true,
                        matLegal: {
                            ...this.state.matLegal,
                            per_Id_Persona_Hombre: "0"
                        }
                    });
                    this.setState({ bolForaneoMujer: false })
                }
                else {
                    this.setState({
                        bolForaneoHombre: false,
                        matLegal: {
                            ...this.state.matLegal,
                            mat_Nombre_Contrayente_Hombre_Foraneo: "",
                            per_Id_Persona_Hombre: "0"
                        }
                    });

                }
                break;
            case "foraneoMujer":
                if (e.target.checked) {
                    this.setState({
                        bolForaneoMujer: true,
                        matLegal: {
                            ...this.state.matLegal,
                            per_Id_Persona_Mujer: "0"
                        }
                    });
                    this.setState({ bolForaneoHombre: false })
                }
                else {
                    this.setState({
                        bolForaneoMujer: false,
                        matLegal: {
                            ...this.state.matLegal,
                            mat_Nombre_Contrayente_Mujer_Foraneo: "",
                            per_Id_Persona_Mujer: "0"
                        }
                    });
                }
                break;
            default:
        }
    }


    handleBlur = (e) => {

        this.setState({
            matLegal: {
                ...this.state.matLegal,
                [e.target.name]: e.target.value.toUpperCase().trim()
            }
        })
    }


    onChange = (e) => {
        console.log("LibroActa: ", e.target.name, e.target.value)
        this.setState({
            matLegal: {
                ...this.state.matLegal,
                [e.target.name]: e.target.value.toUpperCase()
            }
        });

        if (e.target.name === "per_Id_Persona_Hombre") {
            this.setState({
                perIdPersonaHombreInvalid: false,
            })
        }
        if (e.target.name === "mat_Nombre_Contrayente_Hombre_Foraneo") {
            this.setState({
                matNombreContrayenteHombreForaneoInvalid: false
            })
        }


        if (e.target.name === "per_Id_Persona_Mujer") {
            this.setState({
                perIdPersonaMujerInvalid: false,
            })
        }
        if (e.target.name === "mat_Nombre_Contrayente_Mujer_Foraneo") {
            this.setState({
                matNombreContrayenteMujerForaneoInvalid: false
            })
        }

        if (e.target.name === "mat_Fecha_Boda_Civil") {
            this.setState({
                matFechaBodaCivilInvalid: false
            })
        }

        if (e.target.name === "mat_Fecha_Boda_Eclesiastica") {
            this.setState({
                matFechaBodaEclesiasticaInvalid: false,
            })
        }

        //Si es persona Local, trae sus datos de Hogar para conformar la Posible Lista de Hogares Existentes
        if (e.target.name === "per_Id_Persona_Mujer" || e.target.name === "per_Id_Persona_Hombre") {

            helpers.validaToken().then(helpers.authAxios.get(this.url + "/Hogar_Persona/GetHogarByPersona/" + e.target.value)
                .then(res => {

                    //Si en el hogar de este conyuge, él o ella es el único bautizado, lo toma en cuenta para conformar la Lista de Hogares
                    if (res.data.datosDelHogarPorPersona.bautizadosVivos < 2) {
                        this.setState({
                            ListaHogares: [...this.state.ListaHogares, res.data.datosDelHogarPorPersona]
                        });
                        console.log("Datos-Hogar: ", res.data.datosDelHogarPorPersona);
                    }
                })
            );
        }

    }

    componentWillUnmount() {
        localStorage.removeItem("mat_Id_MatrimonioLegalizacion");
    }

    onRadioBtnClick(rSelected) {
        this.setState({ rSelected });
        rSelected ? this.setState({ viviranEnLocalidad: true }) : this.setState({ viviranEnLocalidad: false });
    }

    /// METODOS PARA HOGAR - DOMICILIO ///
    fnGetDatosDelHogar = async (id) => {
        if (id !== "0") {
            await helpers.validaToken().then(helpers.authAxios.get(this.url + "/Hogar_Persona/GetMiembros/" + id)
                .then(res => {
                    this.setState({ MiembrosDelHogar: res.data })
                })
            )
            await helpers.validaToken().then(helpers.authAxios.get(this.url + "/Hogar_Persona/GetDatosHogarDomicilio/" + id)
                .then(res => {
                    this.setState({ domicilio: res.data })
                })
            )

            let jerarquias = [];
            for (let i = 1; i < this.state.MiembrosDelHogar.length + 2; i++) {
                jerarquias.push(<option key={i} value={i}>{i}</option>)
            }

            this.setState({
                JerarquiasDisponibles: jerarquias,
                domicilio: {
                    ...this.state.hogar,
                    hp_Jerarquia: jerarquias.length
                }
            })
        } else {
            this.setState({
                domicilio: {
                    ...this.state.domicilio,
                    hd_Tipo_Subdivision: "COL.",
                    sec_Id_Sector: localStorage.getItem("sector"),
                    dis_Id_Distrito: localStorage.getItem("dto"),
                    pais_Id_Pais: "0",
                    est_Id_Estado: "0",
                    hd_Calle: "",
                    hd_Localidad: "",
                    hd_Numero_Exterior: "",
                    usu_Id_Usuario: JSON.parse(localStorage.getItem('infoSesion')).pem_Id_Ministro,
                    hd_Activo: true,
                    nvoEstado: ""
                },
                hogar: { //Inicializa las variables del Objeto 'Hogar'
                    ...this.state.hogar,
                    hd_Id_Hogar: "0",
                    hp_Jerarquia: "1"
                },
            })
        }
    }

    handle_hd_Id_Hogar = async (e) => { //Al cambiar el Select de Nuevo Hogar=0 o Hogar Existente=X
        console.log("Hogar: ", e.target.value)
        let idHogar = e.target.value;

        if (idHogar !== "0") {//Si es un Hogar Existente trae los Datos de los Miembros y datos del Hogar
            await helpers.validaToken().then(helpers.authAxios.get(this.url + '/Hogar_Persona/GetMiembros/' + idHogar)
                .then(res => {
                    this.setState({
                        hogar: {
                            ...this.state.hogar,
                            hp_Jerarquia: res.data.length
                        }
                    })
                })
            );
            this.setState({
                hogar: {
                    ...this.state.hogar,
                    hd_Id_Hogar: idHogar
                }
            })
            //Fn que llama la API que trae la Dirección con multi-nomenclatura por países, ésta se ejecuta en el componentDidMount
            let getDireccion = async (id) => {
                await helpers.validaToken().then(helpers.authAxios.get(this.url + "/HogarDomicilio/" + id)
                    .then(res => {
                        this.setState({ direccion: res.data.direccion });
                        console.log("direccion" + this.state.direccion)
                    })
                );
            }
            getDireccion(idHogar);
        }
        else { //Si es un Hogar Nuevo
            this.setState({
                hogar: {
                    ...this.state.hogar,
                    hd_Id_Hogar: idHogar,
                    hp_Jerarquia: "1"
                }
            })
        }

        this.fnGetDatosDelHogar(idHogar);
    }


    handleBlurDomicilio = (e) => {
        this.setState({ //Carga el Objeto 'domicilio' con cada input que se va llenando desde lso componentes HogarPersonaDomicilio y PaisEstado.
            domicilio: {
                ...this.state.domicilio,
                [e.target.name]: e.target.value.toUpperCase().trim(),
            }
        })
    }


    handleChangeDomicilio = (e) => {
        if (e.target.name === "pais_Id_Pais") { //Si el elemento que cambio es País, resetea el Id_Estado a '0 y el boolNvoEstado a 'false'.
            this.setState({
                domicilio: {
                    ...this.state.domicilio,
                    nvoEstado: "",
                    est_Id_Estado: "0",
                    pais_Id_Pais: e.target.value.toUpperCase(),
                },
                boolNvoEstado: false,
            })

            if (e.target.value == "66" || e.target.value == "151") {
                this.setState({ nvoEstado_Disponible: false })
            } else {
                this.setState({ nvoEstado_Disponible: true })
            }

        } else {//si el elemento que cambió es algun otro del Domicilio, lo graba en el Objeto "domicilio"

            this.setState({ //Carga el Objeto 'domicilio' con cada input que se va llenando desde lso componentes HogarPersonaDomicilio y PaisEstado.
                domicilio: {
                    ...this.state.domicilio,
                    [e.target.name]: e.target.value.toUpperCase(),
                }
            })
        }
    }

    handleChangeEstado = (e) => {
        if (e.target.value === "999") {
            this.setState({
                boolNvoEstado: true,
                domicilio: {
                    ...this.state.domicilio,
                    est_Id_Estado: e.target.value
                }
            })
        }
        else {
            this.setState({
                boolNvoEstado: false,
                domicilio: {
                    ...this.state.domicilio,
                    nvoEstado: "",
                    est_Id_Estado: e.target.value
                }
            })
        }
    }


    handle_CancelaCaptura = () => {
        this.setState({ enableFrmRegistroMatLegal: false })
    }

    handle_hp_Jerarquia = (e) => {
        this.setState({
            hogar: {
                ...this.state.hogar,
                hp_Jerarquia: e.target.value
            }
        })
    }

    handleBlur = () => {
        //Resetea el estado de Fecha Invalida para quitar la Alerta de error en controles input        
        let fechaTransaccionInvalida = !this.validateFechaTransaccion(this.state.matLegal.mat_Fecha_Boda_Eclesiastica);// Validación de la fecha: no anterior a 1924 ni posterior a la fecha actual
        // Si la fecha es inválida, actualiza el estado correspondiente
        this.setState({
            matFechaBodaEclesiasticaInvalid: fechaTransaccionInvalida ? true : false
        });
    }

    validateFechaTransaccion = (fecha) => {
        // Validación de la fecha: no anterior a 1924 ni posterior a la fecha actual
        const fechaSeleccionada = new Date(fecha);
        const fechaLimiteInferior = new Date('1924-01-01');
        const fechaActual = new Date();

        console.log(fechaSeleccionada, ("fechas", fechaSeleccionada >= fechaLimiteInferior && fechaSeleccionada <= fechaActual))
        return fechaSeleccionada >= fechaLimiteInferior && fechaSeleccionada <= fechaActual;
    };



    handle_Submit = async (e) => { //Al presionar el Botón grabar
        e.preventDefault();

        if (localStorage.getItem("mat_Id_MatrimonioLegalizacion") === "0") {//Si no Edición, sino un NUevo Registro de Matrimonio/Legaliz.
            // VALIDACIONES
            //Modifica los estados de las varibales de bloque las Variables de Invalidaciones, si deben estar en 'true'
            this.setState({
                matTipoEnalceInvalid: this.state.matLegal.mat_Tipo_Enlace === "0" ? true : false,
                matNombreContrayenteMujerForaneoInvalid: this.state.bolForaneoMujer && this.state.matLegal.mat_Nombre_Contrayente_Mujer_Foraneo === "" ? true : false,
                matNombreContrayenteHombreForaneoInvalid: this.state.bolForaneoHombre && this.state.matLegal.mat_Nombre_Contrayente_Hombre_Foraneo === "" ? true : false,
                perIdPersonaMujerInvalid: !this.state.bolForaneoMujer && this.state.matLegal.per_Id_Persona_Mujer === "0" ? true : false,
                perIdPersonaHombreInvalid: !this.state.bolForaneoHombre && this.state.matLegal.per_Id_Persona_Hombre === "0" ? true : false,
                matFechaBodaEclesiasticaInvalid: this.state.matLegal.mat_Fecha_Boda_Eclesiastica === null || this.state.matLegal.mat_Fecha_Boda_Eclesiastica === "" ? true : false,
                matFechaBodaCivilInvalid: this.state.matLegal.mat_Fecha_Boda_Civil === null || this.state.matLegal.mat_Fecha_Boda_Civil === "" ? true : false
            });

            //Pone en varibales de bloque las Variables de Invalidaciones, si deben estar en 'true'
            let matTipoEnalceInvalidTmp = this.state.matLegal.mat_Tipo_Enlace === "0" ? true : false;
            let matNombreContrayenteMujerForaneoInvalidTmp = this.state.bolForaneoMujer && this.state.matLegal.mat_Nombre_Contrayente_Mujer_Foraneo === "" ? true : false;
            let matNombreContrayenteHombreForaneoInvalidTmp = this.state.bolForaneoHombre && this.state.matLegal.mat_Nombre_Contrayente_Hombre_Foraneo === "" ? true : false;
            let perIdPersonaMujerInvalidTmp = !this.state.bolForaneoMujer && this.state.matLegal.per_Id_Persona_Mujer === "0" ? true : false;
            let perIdPersonaHombreInvalidTmp = !this.state.bolForaneoHombre && this.state.matLegal.per_Id_Persona_Hombre === "0" ? true : false;
            let matFechaBodaEclesiasticaInvalidTmp = this.state.matLegal.mat_Fecha_Boda_Eclesiastica === null || this.state.matLegal.mat_Fecha_Boda_Eclesiastica === "" ? true : false;
            let matFechaBodaCivilInvalidTmp = this.state.matLegal.mat_Fecha_Boda_Civil === null || this.state.matLegal.mat_Fecha_Boda_Civil === "" ? true : false;
            //Si alguna variable de Invalidación tiene valor 'true' cancela la Transacción,
            if (matTipoEnalceInvalidTmp || matNombreContrayenteMujerForaneoInvalidTmp ||
                matNombreContrayenteHombreForaneoInvalidTmp || perIdPersonaMujerInvalidTmp ||
                perIdPersonaHombreInvalidTmp || matFechaBodaEclesiasticaInvalidTmp ||
                matFechaBodaCivilInvalidTmp) {
                return false;
            }

            // Si se va a crear un Hogar Nuevo
            if (this.state.rSelected === true && this.state.hogar.hd_Id_Hogar === "0") {

                if (this.state.domicilio.pais_Id_Pais == "0"
                    || this.state.domicilio.hd_Calle === ""
                    || this.state.domicilio.hd_Municipio_Ciudad === ""
                    || this.state.domicilio.est_Id_Estado == "0") {
                    alert("Error!. Debe ingresar al menos Calle, Ciudad y País y Estado para un Nuevo Domicilio.")
                    return false;
                }
                // Valida campos del Componente 'HogarPersonaDomicilio'

                if (this.state.domicilio.pais_Id_Pais == "0" || this.state.domicilio.est_Id_Estado == "0") {
                    alert("Error:\nDebe seleccionar un Pais / Estado.");
                    return false;
                }
                if (this.state.domicilio.est_Id_Estado == "999" && this.state.domicilio.nvoEstado == "") {
                    alert("Error:\nHas seleccionado agregar \"Otro Estado\", por lo tanto, el campo no puede quedar vacío.");
                    return false;
                }
            }

            // Validación de la fecha: no anterior a 1924 ni posterior a la fecha actual
            let fechaTransaccionInvalida = !this.validateFechaTransaccion(this.state.matLegal.mat_Fecha_Boda_Eclesiastica);

            // Si la fecha es inválida, actualiza el estado correspondiente y detén el envío del formulario
            if (fechaTransaccionInvalida) {
                this.setState({
                    matFechaBodaEclesiasticaInvalid: true,
                });
                return;
            }

            // PREPARA OBJETO PARA REGISTRO DE BASE DE DATOS
            let matLegalDom = {
                matLegalEntity: this.state.matLegal, //Objeto que contiene los datos del Formulario
                HogarDomicilioEntity: this.state.domicilio, //Objeto que contiene los datos del Domicilio
                boolNvoDomicilio: this.state.rSelected && this.state.hogar.hd_Id_Hogar === "0" ? true : false, //Si se creará un Nuevo Hogar
                nvoEstado: this.state.domicilio.nvoEstado, //Si se creará un Nuevo Estado
                sectorAlias: this.state.sector.sec_Alias, //El Alias del Sector.
                viviranEnLocalidad: this.state.viviranEnLocalidad
            }
            //Para deshabilitar el botón y evitar multiples registros de Matrimonio y Ediciones de Persona
            this.ChangeSubmitBtnDisable(true)

            //Procede a Registrar el Matrimonio y a editar Personas
            try {
                this.setState({
                    mensajeDelProceso: "Procesando...",
                    modalShow: true
                });

                helpers.validaToken().then(helpers.authAxios.post(`${helpers.url_api}/Matrimonio_Legalizacion/AltaMatrimonio`, matLegalDom)
                    .then(res => {

                        if (res.data.status === "success") {
                            setTimeout(() => {
                                this.setState({
                                    mensajeDelProceso: "Los datos fueron grabados satisfactoriamente."
                                });
                            }, 1500);
                            setTimeout(() => {
                                document.location.href = '/Main'
                            }, 1500);
                        } else {
                            //alert(res.data.mensaje);
                            this.setState({
                                mensajeDelProceso: "Procesando...",
                                modalShow: true
                            });
                            setTimeout(() => {
                                this.setState({
                                    mensajeDelProceso: res.data.mensaje,
                                    modalShow: false
                                });
                            }, 1500);
                        }
                    })
                );
            }
            catch (error) {
                alert("Error: Hubo un problema en la comunicacion con el servidor. Intente mas tarde.");
                // setTimeout(() => { document.location.href = '/ListaDePersonal'; }, 3000);
            }
        }
        else { //Si es una Edición y trae el numero de Id de un Registro de Matrimonio/Leg.
            try {
                helpers.validaToken().then(helpers.authAxios.put(helpers.url_api + "/Matrimonio_Legalizacion/" + localStorage.getItem("mat_Id_MatrimonioLegalizacion"), this.state.matLegal)
                    .then(res => {
                        if (res.data.status === "success") {
                            // alert(res.data.mensaje);
                            setTimeout(() => { document.location.href = '/Matrimonio'; }, 3000);
                            this.setState({
                                mensajeDelProceso: "Procesando...",
                                modalShow: true
                            });
                            setTimeout(() => {
                                this.setState({
                                    mensajeDelProceso: "Los datos fueron actualizados satisfactoriamente."
                                });
                            }, 1500);
                            setTimeout(() => {
                                document.location.href = '/Matrimonio'
                            }, 1500);
                        } else {
                            // alert(res.data.mensaje);
                            this.setState({
                                mensajeDelProceso: "Procesando...",
                                modalShow: true
                            });
                            setTimeout(() => {
                                this.setState({
                                    mensajeDelProceso: res.data.mensaje,
                                    modalShow: false
                                });
                            }, 1500);
                        }
                    })
                );
            } catch (error) {
                alert("Error: Hubo un problema en la comunicación con el Servidor. Intente mas tarde.");
                // setTimeout(() => { document.location.href = '/ListaDePersonal'; }, 3000);
            }
        }
    }

    handleKeyPress = (e) => {
        console.log("Tecla: ", e.key)
        if (e.key === 'Enter') {
            alert("No se permiten saltos de linea en este campo. Escriba a Renglón seguido.");
            e.preventDefault();
        }
    }

    render() {
        console.log("Domicilio_Matrimonio", this.state.domicilio);
        return (
            <Container>
                <Row>
                    <Col xs="12">
                        <Form onSubmit={this.handle_Submit}>
                            <Card>
                                <CardHeader>
                                    <h5><strong>Matrimonio</strong></h5>
                                </CardHeader>
                                <CardBody>
                                    <Alert color="warning" >
                                        <strong>Aviso: </strong> <br />
                                        <ul>
                                            <li>El personal aplicable a Matrimonio debe tener un estado civil diferente a 'Casado(a)' o 'Concubinato'.
                                            </li>
                                            <li>Si uno o ambos contrayentes tiene hijos, llene los campos aplicables. Los datos se grabarán en las Hojas de Datos Estadísticos de ambos contrayentes..
                                            </li>
                                        </ul>
                                    </Alert>
                                    <Row>
                                        <Col xs="6">
                                            <Card>
                                                <CardHeader className='cardTituloContrayenteHombre'>
                                                    Contrayente Hombre
                                                </CardHeader>
                                                <CardBody className='cardBodyContrayenteHombre'>
                                                    <FormGroup>
                                                        <Row>
                                                            <Col xs="3">
                                                                <Label>Foraneo:</Label>
                                                            </Col>
                                                            <Col xs="1">
                                                                <Input
                                                                    type="checkbox"
                                                                    name="foraneoHombre"
                                                                    onChange={this.onChangeForeaneos}
                                                                    value={this.state.bolForaneoHombre}
                                                                    checked={this.state.bolForaneoHombre}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </FormGroup>
                                                    {!this.state.bolForaneoHombre &&
                                                        <FormGroup>
                                                            <Row>
                                                                <Col xs="3">
                                                                    <Label><strong>Hombre: *</strong></Label>
                                                                </Col>
                                                                <Col xs="9">
                                                                    <Input type="select"
                                                                        name="per_Id_Persona_Hombre"
                                                                        onChange={this.onChange}
                                                                        value={this.state.matLegal.per_Id_Persona_Hombre}
                                                                        invalid={this.state.perIdPersonaHombreInvalid}
                                                                    >
                                                                        <option value="0">Seleccionar hombre</option>
                                                                        {
                                                                            this.state.hombres.map((hombre) => {
                                                                                return (
                                                                                    <option key={hombre.per_Id_Persona} value={hombre.per_Id_Persona}> {hombre.per_Nombre} {hombre.per_Apellido_Paterno} {hombre.per_Apellido_Materno} </option>
                                                                                )
                                                                            })
                                                                        }
                                                                    </Input>
                                                                    <FormFeedback>Debe seleccionar el contrayente hombre.</FormFeedback>
                                                                </Col>
                                                            </Row>
                                                        </FormGroup>
                                                    }
                                                    {this.state.bolForaneoHombre &&
                                                        <FormGroup>
                                                            <Row>
                                                                <Col xs="3">
                                                                    <Label><strong>Nombre: *</strong></Label>
                                                                </Col>
                                                                <Col xs="9">
                                                                    <Input
                                                                        name="mat_Nombre_Contrayente_Hombre_Foraneo"
                                                                        type="text"
                                                                        onChange={this.onChange}
                                                                        onBlur={this.handleBlur}
                                                                        value={this.state.matLegal.mat_Nombre_Contrayente_Hombre_Foraneo}
                                                                        invalid={this.state.matNombreContrayenteHombreForaneoInvalid}
                                                                    />
                                                                    <FormFeedback>Este campo no puede quedar vacío.</FormFeedback>
                                                                </Col>
                                                            </Row>
                                                        </FormGroup>
                                                    }
                                                </CardBody>
                                            </Card>
                                        </Col>
                                        <Col xs="6">
                                            <Card>
                                                <CardHeader className='cardTituloContrayenteMujer'>
                                                    Contrayente Mujer
                                                </CardHeader>
                                                <CardBody className='cardBodyContrayenteMujer'>
                                                    <FormGroup>
                                                        <Row>
                                                            <Col xs="3">
                                                                <Label>Foraneo:</Label>
                                                            </Col>
                                                            <Col xs="1">
                                                                <Input
                                                                    type="checkbox"
                                                                    name="foraneoMujer"
                                                                    onChange={this.onChangeForeaneos}
                                                                    value={this.state.bolForaneoMujer}
                                                                    checked={this.state.bolForaneoMujer}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </FormGroup>

                                                    {!this.state.bolForaneoMujer &&
                                                        <FormGroup>
                                                            <Row>
                                                                <Col xs="3">
                                                                    <Label><strong>Mujer: *</strong></Label>
                                                                </Col>
                                                                <Col xs="9">
                                                                    <Input type="select"
                                                                        name="per_Id_Persona_Mujer"
                                                                        onChange={this.onChange}
                                                                        value={this.state.matLegal.per_Id_Persona_Mujer}
                                                                        invalid={this.state.perIdPersonaMujerInvalid}
                                                                    >
                                                                        <option value="0">Seleccionar mujer</option>
                                                                        {
                                                                            this.state.mujeres.map((mujer) => {
                                                                                return (
                                                                                    <option key={mujer.per_Id_Persona} value={mujer.per_Id_Persona}> {mujer.per_Nombre} {mujer.apellidoPrincipal} {mujer.per_Apellido_Materno} </option>
                                                                                )
                                                                            })
                                                                        }
                                                                    </Input>
                                                                    <FormFeedback>Debe seleccionar la contrayente mujer.</FormFeedback>
                                                                </Col>
                                                            </Row>
                                                        </FormGroup>
                                                    }

                                                    {this.state.bolForaneoMujer &&
                                                        <FormGroup>
                                                            <Row>
                                                                <Col xs="3">
                                                                    <Label><strong>Nombre: *</strong></Label>
                                                                </Col>
                                                                <Col xs="9">
                                                                    <Input
                                                                        name="mat_Nombre_Contrayente_Mujer_Foraneo"
                                                                        onChange={this.onChange}
                                                                        onBlur={this.handleBlur}
                                                                        type="text"
                                                                        value={this.state.matLegal.mat_Nombre_Contrayente_Mujer_Foraneo}
                                                                        invalid={this.state.matNombreContrayenteMujerForaneoInvalid}
                                                                    />
                                                                    <FormFeedback>Este campo no puede quedar vacío.</FormFeedback>
                                                                </Col>
                                                            </Row>
                                                        </FormGroup>
                                                    }
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col xs="4">
                                            <FormGroup>
                                                <Input
                                                    name="mat_Fecha_Boda_Civil"
                                                    onChange={this.onChange}
                                                    type="date"
                                                    value={this.state.matLegal.mat_Fecha_Boda_Civil}
                                                    invalid={this.state.matFechaBodaCivilInvalid}
                                                    autoComplete="nope"
                                                />
                                                <Label><strong>Fecha Boda Civil: </strong></Label>
                                                <FormFeedback>Debe seleccionar una fecha para continuar.</FormFeedback>
                                            </FormGroup>
                                        </Col>
                                        <Col xs="4">
                                            <FormGroup>
                                                <Input
                                                    name="mat_Numero_Acta"
                                                    onChange={this.onChange}
                                                    onBlur={this.handleBlur}
                                                    type="text"
                                                    value={this.state.matLegal.mat_Numero_Acta}
                                                    autoComplete="nope"
                                                />
                                                <Label><strong>Número Acta: </strong></Label>
                                                <FormFeedback></FormFeedback>
                                            </FormGroup>
                                        </Col>
                                        <Col xs="4">
                                            <FormGroup>
                                                <Input
                                                    name="mat_Libro_Acta"
                                                    onChange={this.onChange}
                                                    onBlur={this.handleBlur}
                                                    type="text"
                                                    value={this.state.matLegal.mat_Libro_Acta}
                                                    autoComplete="nope"
                                                />
                                                <Label><strong>Libro Acta: </strong></Label>
                                                <FormFeedback></FormFeedback>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="4">
                                            <FormGroup>
                                                <Input
                                                    name="mat_Oficialia"
                                                    onChange={this.onChange}
                                                    onBlur={this.handleBlur}
                                                    type="text"
                                                    value={this.state.matLegal.mat_Oficialia}
                                                    autoComplete="nope"
                                                />
                                                <Label><strong>Oficialía: </strong></Label>
                                                <FormFeedback></FormFeedback>
                                            </FormGroup>
                                        </Col>
                                        <Col xs="4">
                                            <FormGroup>
                                                <Input
                                                    name="mat_Registro_Civil"
                                                    onChange={this.onChange}
                                                    onBlur={this.handleBlur}
                                                    type="text"
                                                    value={this.state.matLegal.mat_Registro_Civil}
                                                    autoComplete="nope"
                                                />
                                                <Label><strong>Registro Civil: </strong></Label>
                                                <FormFeedback></FormFeedback>
                                            </FormGroup>
                                        </Col>
                                        <Col xs="4">
                                            <FormGroup>
                                                <Input
                                                    name="mat_Fecha_Boda_Eclesiastica"
                                                    onChange={this.onChange}
                                                    type="date"
                                                    value={this.state.matLegal.mat_Fecha_Boda_Eclesiastica}
                                                    invalid={this.state.matFechaBodaEclesiasticaInvalid}
                                                    onBlur={this.handleBlur}
                                                    autoComplete="nope"
                                                />
                                                <Label><strong>Fecha Boda Eclesiastica: </strong></Label>
                                                <FormFeedback>Debe seleccionar una fecha válida</FormFeedback>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <hr />
                                    <Row>
                                        {!this.state.bolForaneoMujer &&
                                            <Col xs="4" className="col-sm-4">
                                                <Input
                                                    type="text"
                                                    name="mat_Apellido_Casada"
                                                    onChange={this.onChange}
                                                    onBlur={this.handleBlur}
                                                    className="form-control"
                                                    value={this.state.matLegal.mat_Apellido_Casada}
                                                    autoComplete="nope"
                                                />
                                                <label><strong>Apellido de Casada</strong> &#40;Nota: Sólo si se desea que aparezca con Apellido de Casada.&#41;</label>
                                            </Col>
                                        }
                                        <Col xs="4">
                                            <FormGroup>

                                                <Input
                                                    name="mat_Cantidad_Hijos"
                                                    onChange={this.onChange}
                                                    type="number"
                                                    className="form-control"
                                                    value={this.state.matLegal.mat_Cantidad_Hijos}
                                                    autoComplete="nope"
                                                    min="0"
                                                    max="25"
                                                />
                                                <Label><strong>Cantidad Hijos: </strong></Label>
                                                <FormFeedback></FormFeedback>
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col xs="12">
                                            <FormGroup>
                                                <Input
                                                    name="mat_Nombre_Hijos"
                                                    onChange={this.onChange}
                                                    onBlur={this.handleBlur}
                                                    type="textarea"
                                                    value={this.state.matLegal.mat_Nombre_Hijos}
                                                    autoComplete="nope"
                                                    onKeyPress={this.handleKeyPress}
                                                />
                                                <Label><strong>Nombre de Hijos: </strong> &#40;Nota: Donde sea aplicable, incluya los hijos de ambos.&#41;</Label>
                                                <FormFeedback></FormFeedback>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <hr />
                                    {this.state.habilitaComponenteDomicilio &&
                                        <Row>
                                            <Col xs="5">
                                                <FormGroup>
                                                    <Label><strong>¿El Nuevo Hogar que se forma pertenecerá al Sector Local? </strong></Label>
                                                </FormGroup>
                                            </Col>
                                            <Col xs="7">
                                                <FormGroup>
                                                    <ButtonGroup>
                                                        <Button color="info" onClick={() => this.onRadioBtnClick(true)} active={this.state.rSelected === true}>Si</Button>
                                                        <Button color="info" onClick={() => this.onRadioBtnClick(false)} active={this.state.rSelected === false}>No</Button>
                                                    </ButtonGroup>
                                                    <FormFeedback></FormFeedback>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    }

                                    {this.state.rSelected &&
                                        <HogarPersonaDomicilio
                                            domicilio={this.state.domicilio}
                                            onChangeDomicilio={this.handleChangeDomicilio}
                                            onBlurDomicilio={this.handleBlurDomicilio}
                                            handle_hd_Id_Hogar={this.handle_hd_Id_Hogar}
                                            hogar={this.state.hogar}
                                            handleChangeEstado={this.handleChangeEstado}
                                            boolNvoEstado={this.state.boolNvoEstado}
                                            handle_hp_Jerarquia={this.handle_hp_Jerarquia}
                                            DatosHogarDomicilio={this.state.DatosHogarDomicilio}
                                            MiembrosDelHogar={this.state.MiembrosDelHogar}
                                            JerarquiasDisponibles={this.state.JerarquiasDisponibles}
                                            direccion={this.state.direccion}
                                            ListaHogares={this.state.ListaHogares}
                                            nvoEstado_Disponible={this.state.nvoEstado_Disponible}
                                        />
                                    }
                                </CardBody>
                                <CardFooter>
                                    <Row >
                                        <Col className="col xs-10"></Col>
                                        <Col className=" col-auto xs-2">
                                            <Link
                                                type="button"
                                                to="/ListaDePersonal"
                                                className="btn btn-secondary"
                                            >
                                                Cancelar
                                            </Link>
                                        </Col>
                                        <Col className="col-auto  xs-2">
                                            <Button
                                                type="submit"
                                                color="primary"
                                                disabled={this.state.submitBtnDisable}
                                            >
                                                <span className="fas fa-save icon-btn-p"></span>Guardar
                                            </Button>
                                        </Col>
                                    </Row>
                                </CardFooter>
                            </Card>
                        </Form>
                    </Col>
                </Row>
                <Modal isOpen={this.state.modalShow}>
                    <ModalBody>
                        {this.state.mensajeDelProceso}
                    </ModalBody>
                </Modal>
            </Container >
        )
    }
}

export default Matrimonio;