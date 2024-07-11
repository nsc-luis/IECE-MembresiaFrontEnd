import React, { Component } from 'react';
import PersonaForm from './PersonaForm';
import axios from 'axios';
import helpers from '../../components/Helpers';
import { v4 as uuidv4 } from 'uuid';
import Layout from '../Layout';
import { Modal, ModalBody, /* ModalFooter, ModalHeader, Button */ } from 'reactstrap';
import { fotoDefault } from '../../assets/images/a53d4671-5d0f-491f-b95e-95f5cfbc2d8d.png';

class RegistroDePersonal extends Component {

    url = helpers.url_api;
    infoSesion = JSON.parse(localStorage.getItem('infoSesion'));

    constructor(props) {
        super(props);
        if (!localStorage.getItem('token')) { //Si No trae toquen lo envía al pantalla de Login
            document.location.href = '/';
        }
        if (!localStorage.getItem("idPersona")) { // Si No trae valor en idPersona, significa que es un Registro Nuevo. No es edición.
            localStorage.setItem("idPersona", "0");
            localStorage.setItem("nvaAltaBautizado", "false");
            localStorage.setItem("nvaAltaComunion", "false");
        }

        this.state = {
            form: {},
            domicilio: {},
            FrmValidaPersona: true,
            bolPersonaEncontrada: false,
            categoriaSeleccionada: true,
            msjCategoriaSeleccionada: "Seleccione una Categoría",
            habilitaPerBautizado: false,
            per_Nombre_NoValido: false,
            per_Apellido_Paterno_NoValido: false,
            per_Apellido_Materno_OK: true,
            per_Fecha_Nacimiento_NoValido: false,
            modalShow: false,
            mensajeDelProceso: "",
            tituloAgregarEditar: "Agregar nuevo miembro",
            boolAgregarNvaPersona: true,
            boolComentarioEdicion: false,
            ComentarioHistorialTransacciones: "",
            descNvaProfesion: {},
            foto: "",
            formDataFoto: null,
            nuevaFoto: false,
            boolNvoEstado: false,
            fechaBautismoInvalida: false,
            fechaNuevoIngresoInvalida: false,
            FechaTransaccionHistorica: "",
            buscarLugarDeBautismo: true,
            listaResultadoBusquedaLugarBautismo: [],
            submitBtnDisable: false,
            nvoEstado_Disponible: true,
            idSectorBautismo: 0,
            buscarOficio1: true,
            buscarOficio2: true,
            listaResultadoBusquedaOficio: [],
            idOficio1: "",
            idOficio2: ""
        }
    }

    componentDidMount() {
        //Iniciación de Variables de Estado que son Para Nuevos Registros como para Edición
        this.setState({
            descNvaProfesion: {
                ...this.state.descNvaProfesion,
                nvaProf1: "",
                nvaProf2: ""
            },

        })

        if (localStorage.getItem("idPersona") === "0") {//Si se trata de un Nuevo Registro , No Edición Ni de un No Bautizado que pasa a Bautizado
            this.setState({
                foto: `${helpers.url_api}/Foto/FotoDefault`,
                form: {
                    ...this.state.form,
                    per_Categoria: "0",
                    per_Bautizado: JSON.parse(localStorage.getItem("nvaAltaBautizado")),
                    per_RFC_Sin_Homo: "XAXX010101XXX",
                    per_Estado_Civil: "SOLTERO(A)",
                    idFoto: 1,
                    per_Foto: "",
                    per_Activo: 1,
                    per_En_Comunion: JSON.parse(localStorage.getItem("nvaAltaComunion")),
                    per_Vivo: 1,
                    pro_Profesion_Oficio1: "",
                    pro_Profesion_Oficio2: "",
                    per_Nombre_Padre: "",
                    per_Nombre_Madre: "",
                    per_Nombre_Completo: "",
                    per_Nombre_Abuelo_Paterno: "",
                    per_Nombre_Abuela_Paterna: "",
                    per_Nombre_Abuelo_Materno: "",
                    per_Nombre_Abuela_Materna: "",
                    per_Nacionalidad: "",
                    per_Fecha_Boda_Civil: "",
                    per_Fecha_Boda_Eclesiastica: "",
                    per_Fecha_Nacimiento: "",
                    per_Num_Acta_Boda_Civil: "",
                    per_Oficialia_Boda_Civil: "",
                    per_Registro_Civil: "",
                    per_Nombre_Conyuge: "",
                    per_Libro_Acta_Boda_Civil: "",
                    per_Apellido_Casada: "",
                    per_Fecha_Bautismo: "",
                    per_Fecha_Recibio_Espiritu_Santo: "",
                    per_Cargos_Desempenados: "",
                    per_Cantidad_Hijos: "0",
                    per_Nombre_Hijos: "",
                    sec_Id_Sector: localStorage.getItem("sector"),
                    usu_Id_Usuario: JSON.parse(localStorage.getItem('infoSesion')).pem_Id_Ministro,
                },
                domicilio: {
                    ...this.state.domicilio,
                    hd_Tipo_Subdivision: "COL.",
                    sec_Id_Sector: localStorage.getItem("sector"),
                    dis_Id_Distrito: localStorage.getItem("dto"),
                    pais_Id_Pais: "0",
                    hd_Calle: "",
                    hd_Numero_Exterior: "",
                    hd_Numero_Interior: "",
                    hd_Localidad: "",
                    hd_Municipio_Ciudad: "",
                    est_Id_Estado: "0",
                    hd_CP: "",
                    hd_Telefono: "",
                    hd_Activo: true,
                    nvoEstado: "",
                    usu_Id_Usuario: JSON.parse(localStorage.getItem('infoSesion')).pem_Id_Ministro,
                },
                habilitaPerBautizado: true,
                // descNvaProfesion: {
                //     ...this.state.descNvaProfesion,
                //     nvaProf1: "",
                //     nvaProf2: ""
                // },
                idOficio1: "1",
                idOficio2: "1"
            })
        } else {//si trae un Id significa que se trata de una Edición o de un Cambio de estatus de No Bautizado a Bautizado
            console.log("Entra en Edición");
            helpers.validaToken().then(helpers.authAxios.get(this.url + "/Persona/" + localStorage.getItem("idPersona"))
                .then(res => {
                    res.data.per_Fecha_Nacimiento = res.data.per_Fecha_Nacimiento != null ? helpers.reFormatoFecha(res.data.per_Fecha_Nacimiento) : "";
                    res.data.per_Fecha_Bautismo = res.data.per_Fecha_Bautismo != null ? helpers.reFormatoFecha(res.data.per_Fecha_Bautismo) : "";
                    res.data.per_Fecha_Boda_Civil = res.data.per_Fecha_Boda_Civil != null ? helpers.reFormatoFecha(res.data.per_Fecha_Boda_Civil) : "";
                    res.data.per_Fecha_Boda_Eclesiastica = res.data.per_Fecha_Boda_Eclesiastica != null ? helpers.reFormatoFecha(res.data.per_Fecha_Boda_Eclesiastica) : "";
                    res.data.per_Fecha_Recibio_Espiritu_Santo = res.data.per_Fecha_Recibio_Espiritu_Santo != null ? helpers.reFormatoFecha(res.data.per_Fecha_Recibio_Espiritu_Santo) : "";
                    res.data.per_Bautizado = JSON.parse(localStorage.getItem("nvaAltaBautizado"));
                    res.data.per_En_Comunion = JSON.parse(localStorage.getItem("nvaAltaComunion"));
                    res.data.per_Categoria = localStorage.getItem("categoria") ? localStorage.getItem("categoria") : res.data.per_Categoria;

                    this.setState({
                        foto: `${helpers.url_api}/Foto/${localStorage.getItem("idPersona")}`,
                        form: res.data //Aquí carga la mayoría de los datos de la persona.
                    })
                    localStorage.setItem('estadoCivil', res.data.per_Estado_Civil);

                    //Consulta el Alias de la Profesión_Oficio1 que tiene la Persona
                    helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/Profesion_Oficio/${res.data.pro_Id_Profesion_Oficio1}`)
                        .then(res => {

                            this.setState({
                                form: {
                                    ...this.state.form,
                                    pro_Profesion_Oficio1: res.data.pro_Sub_Categoria
                                },
                                idOficio1: res.data.pro_Id_Profesion_Oficio
                            })
                            console.log("idOficio1 desde API", res.data);
                        }))

                    //Consulta el Alias de la Profesión_Oficio1 que tiene la Persona
                    helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/Profesion_Oficio/${res.data.pro_Id_Profesion_Oficio2}`)
                        .then(res => {
                            this.setState({
                                form: {
                                    ...this.state.form,
                                    pro_Profesion_Oficio2: res.data.pro_Sub_Categoria
                                },
                                idOficio2: res.data.pro_Id_Profesion_Oficio
                            })
                        }))

                    //Consulta el Id del Sector de Bautismo que se registro en el Registro Histórico del Bautismo
                    helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/Sector/PorTransaccionBautismo/${res.data.per_Id_Persona}`)
                        .then(res => {

                            this.setState({
                                idSectorBautismo: res.data.sector
                            })
                            console.log("idSectorBautismodesdeAPI", res.data.sector);
                        }))

                })
            )
            this.setState({
                categoriaSeleccionada: true,
                per_Nombre_NoValido: false,
                per_Apellido_Paterno_NoValido: false,
                per_Fecha_Nacimiento_NoValido: false,
                FrmValidaPersona: false,
                bolPersonaEncontrada: false,
                tituloAgregarEditar: "Editar información de la persona",
                boolAgregarNvaPersona: false,
                boolComentarioEdicion: true,
                form: {
                    ...this.state.form,
                    /* per_Bautizado: JSON.parse(localStorage.getItem("nvaAltaBautizado")),
                    per_En_Comunion: JSON.parse(localStorage.getItem("nvaAltaComunion")),
                    per_Categoria: localStorage.getItem("categoria"), */
                    per_Id_Persona: localStorage.getItem("idPersona"),
                    sec_Id_Sector: localStorage.getItem("sector"),
                    usu_Id_Usuario: JSON.parse(localStorage.getItem('infoSesion')).pem_Id_Ministro
                }
            });
        }
    }

    ChangeSubmitBtnDisable = (bol) => {//Sirve para evitar multiples registros por dobleclick en botón Submit
        this.setState({ submitBtnDisable: bol });
    }

    setFrmValidaPersona = (bol) => {
        this.setState({ FrmValidaPersona: bol })
    }

    setBolPersonaEncontrada = (bol) => {
        this.setState({ bolPersonaEncontrada: bol })
    }

    const_regex = {
        alphaSpaceRequired: /^[a-zA-ZáéíóúÁÉÍÓÚ]{1}[a-zA-ZÑñáéíóúÁÉÍÓÚ\d\s]{0,37}$/,
        alphaSpace: /^[a-zñA-ZÑáéíóúÁÉÍÓÚ\s]{0,37}$/,
        formatoFecha: /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/
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

            //Para que no esté disponible crear Nuevos Estados para México y Estados Unidos
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

    handleChangeEstado = (e) => { //Al cambiar el input est_Id_Estado

        if (e.target.value == "999") { //Si el valor del nvoEstado es 999 significa que elegió 'Otro Estado' porque quiere registrar uno Nuevo
            this.setState({
                boolNvoEstado: true, //Muestra el textBox para registro de un Nuevo Estado
                domicilio: {
                    ...this.state.domicilio,
                    est_Id_Estado: e.target.value
                }
            })
        }
        else { //Si no es 999, significa que eligió un Estadó Existente
            this.setState({
                boolNvoEstado: false, //Quita el input de registro de un Nuevo Estado
                domicilio: {
                    ...this.state.domicilio,
                    nvoEstado: "",
                    est_Id_Estado: e.target.value
                }
            })
        }
    }

    onChangeFechaBautismo = (e) => {
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        })

        if (e.target.name === "per_Fecha_Bautismo") {

            if (e.target.value === '') {
                this.setState({ fechaBautismoInvalida: true });
            }
            else {
                this.setState({
                    fechaBautismoInvalida: false
                });
            }
        }
    }

    ChangeFechaBautismoInvalida = (bol) => {
        this.setState({ fechaBautismoInvalida: bol });
    }

    handleChange = (e) => {

        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value.toUpperCase()
            }
        })

        if (e.target.name === "per_Email_Personal") {
            this.setState({
                form: {
                    ...this.state.form,
                    [e.target.name]: e.target.value.toLowerCase()
                }
            })
        }
        if (e.target.name === "per_Categoria") {
            switch (e.target.value) {
                default:
                    this.setState({
                        categoriaSeleccionada: false,
                        msjCategoriaSeleccionada: "Debe seleccionar una Categoría.",
                        habilitaPerBautizado: false,
                        form: {
                            ...this.state.form,
                            // per_Bautizado: false,
                            [e.target.name]: e.target.value1 != 0 ? e.target.value.toUpperCase() : "0"
                        }
                    });
                    break;
                case "ADULTO_HOMBRE":
                    this.setState({
                        categoriaSeleccionada: true,
                        msjCategoriaSeleccionada: "",
                        habilitaPerBautizado: true,
                        form: {
                            ...this.state.form,
                            // per_Bautizado: false,
                            [e.target.name]: e.target.value.toUpperCase()
                        }
                    });
                    break;
                case "ADULTO_MUJER":
                    this.setState({
                        categoriaSeleccionada: true,
                        msjCategoriaSeleccionada: "",
                        habilitaPerBautizado: true,
                        form: {
                            ...this.state.form,
                            // per_Bautizado: false,
                            [e.target.name]: e.target.value.toUpperCase()
                        }
                    });
                    break;
                case "JOVEN_HOMBRE":
                    this.setState({
                        categoriaSeleccionada: true,
                        msjCategoriaSeleccionada: "",
                        habilitaPerBautizado: true,
                        form: {
                            ...this.state.form,
                            // per_Bautizado: false,
                            [e.target.name]: e.target.value.toUpperCase()
                        }
                    });
                    break;
                case "JOVEN_MUJER":
                    this.setState({
                        categoriaSeleccionada: true,
                        msjCategoriaSeleccionada: "",
                        habilitaPerBautizado: true,
                        form: {
                            ...this.state.form,
                            // per_Bautizado: false,
                            [e.target.name]: e.target.value.toUpperCase()
                        }
                    });
                    break;
                case "NIÑO":
                    this.setState({
                        categoriaSeleccionada: true,
                        msjCategoriaSeleccionada: "",
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
                        msjCategoriaSeleccionada: "",
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

        if (e.target.name === "per_Apellido_Materno") {
            if (!this.const_regex.alphaSpace.test(e.target.value)) {
                this.setState({
                    per_Apellido_Materno_OK: false

                });
            } else if (e.target.value === '' || this.const_regex.alphaSpace.test(e.target.value)) {

                this.setState({
                    per_Apellido_Materno_OK: true
                });
            }

        }
        if (e.target.name === "per_Fecha_Nacimiento") {
            if (e.target.value === '') {
                this.setState({ per_Fecha_Nacimiento_NoValido: true });
            }
            else {
                this.setState({
                    per_Fecha_Nacimiento_NoValido: false
                });
            }
        }

        if (e.target.name === 'pro_Profesion_Oficio1') {
            //Si se elije una Profesion de la BBDD, asegura que la variable 'nvaProf1' vaya vacía.
            if (e.target.value !== "") {
                this.setState({
                    descNvaProfesion: {
                        ...this.state.descNvaProfesion,
                        nvaProf1: ""
                    }
                })
            } else {
                this.setState({
                    buscarOficio1: true,
                    idOficio1: "1"
                })
            }
            this.buscaProfesionOficio1(e.target.value)
        }


        if (e.target.name === 'pro_Profesion_Oficio2') {
            //Si se elije una Profesion de la BBDD, asegura que la variable 'nvaProf2' vaya vacía.
            if (e.target.value !== "") {
                this.setState({
                    descNvaProfesion: {
                        ...this.state.descNvaProfesion,
                        nvaProf2: ""
                    }
                })
            } else {
                this.setState({
                    buscarOficio2: true,
                    idOficio2: "1"
                })
            }
            this.buscaProfesionOficio2(e.target.value)
        }

        if (e.target.name === "idFoto") {
            var mimeTypeValidos = ["image/png", "image/jpeg", "image/jpg"];

            //Si la foto Excede 3MB y si NO es de formatos permitidos
            if (e.target.files[0].size / 1024 / 1024 > 3
                || !mimeTypeValidos.includes(e.target.files[0].type)) {
                alert("Error: \nSólo se admiten archivos menores o iguales a 3MB y que sea de tipo 'png', 'jpg' o jpeg.")
                this.setState({
                    form: {
                        ...this.state.form,
                        [e.target.name]: 1
                    },
                    foto: `${helpers.url_api}/Foto/FotoDefault`,
                    nuevaFoto: false
                })
                e.target.value = null
            }
            else { //Si la foto no excede 3MB y si es de los formatos permitidos
                let formData = new FormData();
                formData.append('image', e.target.files[0]);
                console.log("formData:", formData);
                this.setState({
                    formDataFoto: formData,
                    foto: URL.createObjectURL(e.target.files[0]),
                    nuevaFoto: true
                })
            }
        }

        if (e.target.name === "per_Lugar_Bautismo") {
            if (e.target.value.length > 1) {
                axios.get(`${helpers.url_api}/Sector/BuscarPorTexto/${e.target.value}`)
                    .then(res => {
                        this.setState({
                            buscarLugarDeBautismo: res.data.query.length > 0 ? false : true,
                            listaResultadoBusquedaLugarBautismo: res.data.query
                        })
                    })
            }
            else {
                this.setState({
                    buscarLugarDeBautismo: true,
                    listaResultadoBusquedaLugarBautismo: []
                })
            }
        }
    }

    handleBlur = (e) => {

        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value.trim()
            }
        })
    }

    handleBlurFechaNacimiento = (e) => {

        //Resetea el estado de Fecha Invalida para quitar la Alerta de error en controles input        
        let fechaTransaccionInvalida = !this.validateFechaTransaccion(this.state.form.per_Fecha_Nacimiento);// Validación de la fecha: no anterior a 1924 ni posterior a la fecha actual
        // Si la fecha es inválida, actualiza el estado correspondiente
        this.setState({
            per_Fecha_Nacimiento_NoValido: fechaTransaccionInvalida ? true : false
        });
    }

    handleBlurFechaBautismo = (e) => {

        //Resetea el estado de Fecha Invalida para quitar la Alerta de error en controles input        
        let fechaTransaccionInvalida = !this.validateFechaTransaccion(this.state.form.per_Fecha_Bautismo);// Validación de la fecha: no anterior a 1924 ni posterior a la fecha actual
        // Si la fecha es inválida, actualiza el estado correspondiente
        this.setState({
            fechaBautismoInvalida: fechaTransaccionInvalida ? true : false
        });
    }

    handleBlurNuevoIngreso = (e) => {

        //Resetea el estado de Fecha Invalida para quitar la Alerta de error en controles input        
        let fechaNuevoIngresoInvalida = !this.validateFechaTransaccion(this.state.FechaTransaccionHistorica);// Validación de la fecha: no anterior a 1924 ni posterior a la fecha actual
        // Si la fecha es inválida, actualiza el estado correspondiente
        this.setState({
            fechaNuevoIngresoInvalida: fechaNuevoIngresoInvalida ? true : false
        });
    }

    validateFechaTransaccion = (fecha) => {
        // Validación de la fecha: no anterior a 1924 ni posterior a la fecha actual
        const fechaSeleccionada = new Date(fecha);
        const fechaLimiteInferior = new Date('1924-01-01');
        const fechaActual = new Date();

        return fechaSeleccionada >= fechaLimiteInferior && fechaSeleccionada <= fechaActual;
    };

    buscaProfesionOficio1 = (palabraclave) => {
        if (palabraclave.length > 1) {
            axios.get(`${helpers.url_api}/Profesion_Oficio/BuscarPorTexto/${palabraclave}`)
                .then(res => {
                    this.setState({
                        buscarOficio1: res.data.query.length > 0 ? false : true,
                        listaResultadoBusquedaOficio: res.data.query
                    })
                })
        }
        else {
            this.setState({
                buscarOficio1: true,
                listaResultadoBusquedaOficio: [],
                idOficio1: "1"
            })
        }
    }

    buscaProfesionOficio2 = (palabraclave) => {
        if (palabraclave.length > 1) {
            axios.get(`${helpers.url_api}/Profesion_Oficio/BuscarPorTexto/${palabraclave}`)
                .then(res => {
                    this.setState({
                        buscarOficio2: res.data.query.length > 0 ? false : true,
                        listaResultadoBusquedaOficio: res.data.query
                    })
                })
        }
        else {
            this.setState({
                buscarOficio2: true,
                listaResultadoBusquedaOficio: [],
                idOficio2: "1"
            })
        }
    }

    seleccionaOficio1 = (oficio) => {
        this.setState({
            buscarOficio1: true,
            form: {
                ...this.state.form,
                pro_Profesion_Oficio1: oficio.pro_Sub_Categoria
            },
            idOficio1: oficio.pro_Id_Profesion_Oficio
        })
    }

    seleccionaOficio2 = (oficio) => {
        this.setState({
            buscarOficio2: true,
            form: {
                ...this.state.form,
                pro_Profesion_Oficio2: oficio.pro_Sub_Categoria
            },
            idOficio2: oficio.pro_Id_Profesion_Oficio
        })
    }

    seleccionaLugarDeBautismo = (info) => {
        this.setState({
            buscarLugarDeBautismo: true,
            form: {
                ...this.state.form,
                per_Lugar_Bautismo: info.sec_Alias
            },
            idSectorBautismo: info.sec_Id_Sector
        })
    }

    borrarSeleccionLugarBautismo = () => {
        this.setState({
            form: {
                ...this.state.form,
                per_Lugar_Bautismo: ""
            }
        })
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
        localStorage.setItem('estadoCivil', str)
        this.setState({
            form: {
                ...this.state.form,
                per_Estado_Civil: str.toUpperCase()
            }
        })
    }

    fnGuardaPersona = async (datos) => { //Graba persona en un Hogar Nuevo
        //console.log("Entra en funcion GuardaPersona", this.state.idOficio1, this.state.idOficio2, datos)

        var info = {
            PersonaEntity: datos.PersonaEntity,
            HogarDomicilioEntity: datos.HogarDomicilioEntity,
            nvaProfesionOficio1: this.state.descNvaProfesion.nvaProf1 !== "" && this.state.descNvaProfesion.nvaProf1 ? this.state.descNvaProfesion.nvaProf1.toUpperCase() : "",
            nvaProfesionOficio2: this.state.descNvaProfesion.nvaProf2 !== "" && this.state.descNvaProfesion.nvaProf2 ? this.state.descNvaProfesion.nvaProf2.toUpperCase() : "",
            nvoEstado: this.state.domicilio.nvoEstado,
            FechaTransaccionHistorica: this.state.FechaTransaccionHistorica,
            idSectorBautismo: datos.idSectorBautismo,
            idOficio1: this.state.idOficio1,
            idOficio2: this.state.idOficio2
        }
        await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/Estado/GetEstadoByIdPais/${this.state.domicilio.pais_Id_Pais}`)
            .then(res => {
                if (res.data.status === true) {
                    let contador = 0
                    res.data.estados.forEach(element => {
                        contador = contador + 1
                    })
                    if (contador < 1 && this.state.domicilio.nvoEstado == "") {//Si detecta que No hay Estados para ese País y que no trae indicado un Estado
                        alert("Error: \nEl País seleccionado no tiene Estados para mostrar, por lo tanto, debe ingresar un nombre de Estado.")
                        return false
                    }
                    else { //Si detecta que Sí hay Estados para ese País
                        try {
                            if (this.state.nuevaFoto) { //Si trae Foto
                                helpers.validaToken().then(helpers.authAxios.post(`${helpers.url_api}/Persona/AgregarFoto`, this.state.formDataFoto)
                                    .then(resFoto => {
                                        if (resFoto.data.status === "success") {
                                            info.PersonaEntity.idFoto = resFoto.data.foto.idFoto
                                            this.setState({
                                                mensajeDelProceso: "Procesando...",
                                                modalShow: true
                                            });
                                        }

                                        helpers.validaToken().then(helpers.authAxios.post(`${helpers.url_api}/Persona/AddPersonaDomicilioHogar`, info)
                                            .then(res => {
                                                if (res.data.status === "success") {
                                                    setTimeout(() => {
                                                        this.setState({
                                                            mensajeDelProceso: "Los datos fueron grabados satisfactoriamente."
                                                        });
                                                    }, 1000);
                                                    setTimeout(() => {
                                                        document.location.href = '/ListaDePersonal'
                                                    }, 2000);
                                                }
                                                else {
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
                                                    alert(`Error: \n${res.data.mensaje}`);
                                                }
                                            })
                                        );
                                    })
                                )
                            }
                            else {
                                helpers.validaToken().then(helpers.authAxios.post(`${helpers.url_api}/Persona/AddPersonaDomicilioHogar`, info)
                                    .then(res => {
                                        if (res.data.status === "success") {
                                            //alert("Datos guardados satisfactoriamente");
                                            this.setState({
                                                mensajeDelProceso: "Procesando...",
                                                modalShow: true
                                            });
                                            setTimeout(() => {
                                                this.setState({
                                                    mensajeDelProceso: "Los datos fueron grabados satisfactoriamente."
                                                });
                                            }, 1000);
                                            setTimeout(() => {
                                                document.location.href = '/ListaDePersonal'
                                            }, 2000);
                                        }
                                        else {
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
                                            alert(`Error: \n${res.data.mensaje}`);
                                        }
                                    })
                                )
                            }
                        }
                        catch (error) {
                            alert("Error: Hubo un problema en la comunicación con el Servidor. Intente mas tarde.");
                            setTimeout(() => { document.location.href = '/ListaDePersonal'; }, 3000);
                        }
                    }
                }
            })
        );
    }

    fnEditaPersona = async (datos) => {
        if (datos.per_Estado_Civil === "CONCUBINATO") {
            datos.per_Fecha_Boda_Civil = "";
            datos.per_Fecha_Boda_Eclesiastica = "";
            datos.per_Num_Acta_Boda_Civil = "";
            datos.per_Oficialia_Boda_Civil = "";
            datos.per_Registro_Civil = "";
            datos.per_Libro_Acta_Boda_Civil = "";
        }
        if (datos.per_Estado_Civil === "SOLTERO(A) CON HIJOS") {
            datos.per_Fecha_Boda_Civil = "";
            datos.per_Fecha_Boda_Eclesiastica = "";
            datos.per_Num_Acta_Boda_Civil = "";
            datos.per_Oficialia_Boda_Civil = "";
            datos.per_Registro_Civil = "";
            datos.per_Nombre_Conyuge = "";
            datos.per_Libro_Acta_Boda_Civil = "";
        }
        if (datos.per_Estado_Civil === "SOLTERO(A)") {
            datos.per_Fecha_Boda_Civil = "";
            datos.per_Fecha_Boda_Eclesiastica = "";
            datos.per_Num_Acta_Boda_Civil = "";
            datos.per_Oficialia_Boda_Civil = "";
            datos.per_Registro_Civil = "";
            datos.per_Nombre_Conyuge = "";
            datos.per_Libro_Acta_Boda_Civil = "";
            datos.per_Nombre_Hijos = "";
            datos.per_Cantidad_Hijos = "0";
        }

        var info = {
            PersonaEntity: datos,
            ComentarioHTE: this.state.ComentarioHistorialTransacciones.toUpperCase(),
            nvaProfesionOficio1: this.state.descNvaProfesion.nvaProf1 !== "" && this.state.descNvaProfesion.nvaProf1 ? this.state.descNvaProfesion.nvaProf1.toUpperCase() : "",
            nvaProfesionOficio2: this.state.descNvaProfesion.nvaProf2 !== "" && this.state.descNvaProfesion.nvaProf2 ? this.state.descNvaProfesion.nvaProf2.toUpperCase() : "",
            idSectorBautismo: this.state.idSectorBautismo,
            idOficio1: this.state.idOficio1,
            idOficio2: this.state.idOficio2
        };
        //console.log("Info_Editar: ", info)
        if (this.state.nuevaFoto) {
            await helpers.validaToken().then(helpers.authAxios.post(`${helpers.url_api}/Persona/AgregarFoto`, this.state.formDataFoto)
                .then(res => {
                    if (res.data.status === "success") {
                        info.PersonaEntity.idFoto = res.data.foto.idFoto
                        this.setState({
                            mensajeDelProceso: "Procesando...",
                            modalShow: true
                        });
                    }
                    try {
                        helpers.validaToken().then(helpers.authAxios.put(this.url + "/persona/" + localStorage.getItem("idPersona"), info)
                            .then(res => {
                                if (res.data.status === "success") {
                                    setTimeout(() => {
                                        this.setState({
                                            mensajeDelProceso: "Los datos fueron grabados satisfactoriamente."
                                        });
                                    }, 1000);
                                    setTimeout(() => {
                                        document.location.href = '/ListaDePersonal'
                                    }, 2000);
                                } else {
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
                                    alert(`Error: \n${res.data.mensaje}`);
                                }
                            })
                        );
                    } catch (error) {
                        alert("Error: Hubo un problema en la comunicación con el Servidor. Intente mas tarde.");
                        // setTimeout(() => { document.location.href = '/ListaDePersonal'; }, 3000);
                    }
                })
            )
        }
        else {
            try {
                helpers.validaToken().then(helpers.authAxios.put(this.url + "/persona/" + localStorage.getItem("idPersona"), info)
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
                            }, 1000);
                            setTimeout(() => {
                                document.location.href = '/ListaDePersonal'
                            }, 2000);
                        } else {
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
                            alert(`Error: \n${res.data.mensaje}`);
                        }
                    })
                );
            } catch (error) {
                alert("Error: Hubo un problema en la comunicación con el Servidor. Intente mas tarde.");
                // setTimeout(() => { document.location.href = '/ListaDePersonal'; }, 3000);
            }
        }
    }

    fnGuardaPersonaEnHogar = async (datos, jerarquia, hdId) => { //Graba persona en un HogarExistente
        var PersonaEntity = datos;
        datos = {
            PersonaEntity,
            jerarquia: jerarquia,
            hdId: hdId,
            nvaProfesionOficio1: this.state.descNvaProfesion.nvaProf1 !== "" && this.state.descNvaProfesion.nvaProf1 ? this.state.descNvaProfesion.nvaProf1.toUpperCase() : "",
            nvaProfesionOficio2: this.state.descNvaProfesion.nvaProf2 !== "" && this.state.descNvaProfesion.nvaProf2 ? this.state.descNvaProfesion.nvaProf2.toUpperCase() : "",
            FechaTransaccionHistorica: this.state.FechaTransaccionHistorica,
            idSectorBautismo: this.state.idSectorBautismo,
            idOficio1: this.state.idOficio1,
            idOficio2: this.state.idOficio2
        }
        try {
            if (this.state.nuevaFoto) { //Se graba Foto y datos de la persona
                helpers.validaToken().then(helpers.authAxios.post(`${helpers.url_api}/Persona/AgregarFoto`, this.state.formDataFoto)
                    .then(resFoto => {
                        if (resFoto.data.status === "success") {
                            datos.PersonaEntity.idFoto = resFoto.data.foto.idFoto
                            this.setState({
                                mensajeDelProceso: "Procesando...",
                                modalShow: true
                            });
                            //datos.idFoto = resFoto.data.foto.idFoto
                        }
                        helpers.validaToken().then(helpers.authAxios.post(this.url + "/persona/AddPersonaHogar", datos)
                            .then(res => {
                                if (res.data.status === "success") {
                                    setTimeout(() => {
                                        this.setState({
                                            mensajeDelProceso: "Los datos fueron grabados satisfactoriamente."
                                        });
                                    }, 1000);
                                    setTimeout(() => {
                                        document.location.href = '/ListaDePersonal'
                                    }, 2000);
                                } else {
                                    alert("Error: No se pudo guardar. Revise los datos ingresados");
                                }
                            })
                        )
                    })
                )
            }
            else { //Se graban solo los datos de la persona, no la foto.
                helpers.validaToken().then(helpers.authAxios.post(this.url + "/persona/AddPersonaHogar", datos)
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
                            }, 1000);
                            setTimeout(() => {
                                document.location.href = '/ListaDePersonal'
                            }, 2000);
                        } else {
                            alert("Error: No se pudo guardar. Revise los datos ingresados");
                        }
                    })
                )
            }

        } catch (error) {
            alert("Error: Hubo un problema en la comunicación con el Servidor. Intente mas tarde.");
            setTimeout(() => { document.location.href = '/ListaDePersonal'; }, 3000);
        }
    }

    componentWillUnmount() {
        this.setState({
            form: {}
        });
        localStorage.removeItem("CambiarABautizado");
        localStorage.removeItem("idPersona");
        localStorage.removeItem("nvaAltaBautizado");
        localStorage.removeItem("nvaAltaComunion");
        localStorage.removeItem("categoria");
    }

    handle_ComentarioHistorialTransacciones = (e) => {
        this.setState({ ComentarioHistorialTransacciones: e.target.value })
    }

    handle_descNvaProfesion = (e) => {
        this.setState({
            descNvaProfesion: {
                ...this.state.descNvaProfesion,
                [e.target.name]: e.target.value
            }
        })
    }

    handleCampoInvalido = (elementoState, bool) => {

        this.setState({
            [elementoState]: bool
        })
    }

    handleFechaDeTransaccion = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() {
        /* console.log("idOficio1", this.state.idOficio1);
        console.log("idOficio2", this.state.idOficio2);
        console.log("nvaProf1", this.state.descNvaProfesion.nvaProf1);
        console.log("nvaProf2", this.state.descNvaProfesion.nvaProf2);
        console.log("LugarBautismo", this.state.idSectorBautismo); */

        return (
            <>

                <PersonaForm
                    onChange={this.handleChange}
                    onBlur={this.handleBlur}
                    onBlurNuevoIngreso={this.handleBlurNuevoIngreso}
                    onBlurFechaBautismo={this.handleBlurFechaBautismo}
                    onBlurFechaNacimiento={this.handleBlurFechaNacimiento}
                    FrmValidaPersona={this.state.FrmValidaPersona}
                    bolPersonaEncontrada={this.state.bolPersonaEncontrada}
                    setFrmValidaPersona={this.setFrmValidaPersona}
                    setBolPersonaEncontrada={this.setBolPersonaEncontrada}
                    form={this.state.form}
                    onChangeDomicilio={this.handleChangeDomicilio}

                    onBlurDomicilio={this.handleBlurDomicilio}
                    domicilio={this.state.domicilio}
                    /* hogar={this.state.hogar} */
                    categoriaSeleccionada={this.state.categoriaSeleccionada}
                    msjCategoriaSeleccionada={this.state.msjCategoriaSeleccionada}
                    habilitaPerBautizado={this.state.habilitaPerBautizado}
                    per_Nombre_NoValido={this.state.per_Nombre_NoValido}
                    per_Apellido_Paterno_NoValido={this.state.per_Apellido_Paterno_NoValido}
                    per_Apellido_Materno_OK={this.state.per_Apellido_Materno_OK}
                    per_Fecha_Nacimiento_NoValido={this.state.per_Fecha_Nacimiento_NoValido}
                    changeRFCSinHomo={this.changeRFCSinHomo}
                    changeEstadoCivil={this.changeEstadoCivil}
                    fnGuardaPersona={this.fnGuardaPersona}
                    fnGuardaPersonaEnHogar={this.fnGuardaPersonaEnHogar}
                    tituloAgregarEditar={this.state.tituloAgregarEditar}
                    boolAgregarNvaPersona={this.state.boolAgregarNvaPersona}
                    boolComentarioEdicion={this.state.boolComentarioEdicion}
                    handle_ComentarioHistorialTransacciones={this.handle_ComentarioHistorialTransacciones}
                    ComentarioHistorialTransacciones={this.state.ComentarioHistorialTransacciones}
                    fnEditaPersona={this.fnEditaPersona}
                    handle_descNvaProfesion={this.handle_descNvaProfesion}
                    descNvaProfesion={this.state.descNvaProfesion}
                    foto={this.state.foto}
                    boolNvoEstado={this.state.boolNvoEstado}
                    handleChangeEstado={this.handleChangeEstado}
                    handleCampoInvalido={this.handleCampoInvalido}
                    onChangeFechaBautismo={this.onChangeFechaBautismo}
                    fechaBautismoInvalida={this.state.fechaBautismoInvalida}
                    fechaNuevoIngresoInvalida={this.state.fechaNuevoIngresoInvalida}
                    ChangeFechaBautismoInvalida={this.ChangeFechaBautismoInvalida}
                    handleFechaDeTransaccion={this.handleFechaDeTransaccion}
                    FechaTransaccionHistorica={this.state.FechaTransaccionHistorica}
                    buscarLugarDeBautismo={this.state.buscarLugarDeBautismo}
                    listaResultadoBusquedaLugarBautismo={this.state.listaResultadoBusquedaLugarBautismo}
                    buscarOficio1={this.state.buscarOficio1}
                    buscarOficio2={this.state.buscarOficio2}
                    listaResultadoBusquedaOficio={this.state.listaResultadoBusquedaOficio}
                    seleccionaLugarDeBautismo={this.seleccionaLugarDeBautismo}
                    borrarSeleccionLugarBautismo={this.borrarSeleccionLugarBautismo}
                    ChangeSubmitBtnDisable={this.ChangeSubmitBtnDisable}
                    submitBtnDisable={this.state.submitBtnDisable}
                    nvoEstado_Disponible={this.state.nvoEstado_Disponible}
                    idSectorBautismo={this.state.idSectorBautismo}
                    seleccionaOficio1={this.seleccionaOficio1}
                    seleccionaOficio2={this.seleccionaOficio2}
                />
                {/*Modal success*/}
                <Modal isOpen={this.state.modalShow}>
                    <ModalBody>
                        {this.state.mensajeDelProceso}
                    </ModalBody>
                </Modal>
            </>
        )
    }
}

export default RegistroDePersonal;