import React, { Component } from 'react';
import helpers from '../../components/Helpers';
import '../../assets/css/index.css';
import {
    Modal, ModalHeader, ModalBody, ModalFooter,
    Button, Input, Alert, Container, Row, Col, Card,
    Label, CardHeader, CardTitle, CardBody, CardFooter
} from 'reactstrap';
import { Link } from 'react-router-dom';
import IECELogo from '../../assets/images/IECE_logo.png'
import ModalInfoHogar from './ModalInfoHogar';
import moment from 'moment/min/moment-with-locales';
import 'moment/dist/locale/es'

class ListaDePersonal extends Component {

    url = helpers.url_api;
    infoSesion = JSON.parse(localStorage.getItem('infoSesion'));

    constructor(props) {
        if (!localStorage.getItem("token")) {
            document.location.href = '/';
        }

        super(props);
        this.state = {
            personas: [],
            personasTodas: [],
            status: null,
            sector: {},
            distrito: {},
            modalOpen: false,
            showModalPersonaGenerales: false,
            showModalPersonaFamiliaAsendente: false,
            showModalPersonaEclesiasticos: false,
            showModalPersonaEstadoCivil: false,
            showModalPersonaHogar: false,
            currentPersona: {},
            currentProfesion1: {},
            currentProfesion2: {},
            MiembrosDelHogar: [],
            DatosHogarDomicilio: {},
            CasadoDivorciadoViudo: false,
            ConcubinadoSolteroConHijos: false,
            soltero: false,
            modalInfoPersona: false,
            showModalEliminaPersona: false,
            tempPersonas: [],
            sectores: [],
            fNombre: '',
            fCategoria: '0',
            fSector: '0',
            fGrupo: '0',
            fProfesionOficio: '',
            fActivoComunionVivo: 'activo',
            habilitaFiltroNombre: '',
            habilitaFiltroCategoria: '',
            habilitaFiltroSector: '',
            habilitaFiltroGrupo: '',
            habilitaFiltroProfesionOficio: '',
            habilitaFiltroActivoComunionVivo: '',
            modalInfoHogar: false,
            objPersona: {},
            direccion: "",
            modalShow: false,
            mensajeDelProceso: ""

        };
    }

    componentDidMount() {
        this.handle_LinkEncabezado("Sección: Monitoreo", "Análisis de Membresía")
        this.getPersonas();
        this.getSector();
        this.getDistrito();
        this.getSectoresPorDistrito();
        window.scrollTo(0, 0);
    }

    handle_LinkEncabezado = (seccion, componente) => {
        localStorage.setItem('seccion', seccion);
        localStorage.setItem('componente', componente);
    }

    getActivos() {
        let result = this.state.personasTodas.filter((obj) => {
            return obj.persona.per_Activo === true;
        })
        this.setState({ personas: result })
    }

    getInactivos() {
        let result = this.state.personasTodas.filter((obj) => {
            return obj.persona.per_Activo === false;
        })
        this.setState({ personas: result })
    }

    getTodos() {
        this.setState({ personas: this.state.personasTodas });
    }

    getDomicilio = async (id) => {
        await helpers.validaToken().then(helpers.authAxios.get(`/HogarDomicilio/${id}`)
            .then(res => {
                if (res.data.status === "success") {
                    this.setState({
                        direccion: res.data.direccion,
                        hogarDomicilio: res.data.hogardomicilio[0]
                    });
                }
                else {
                    this.setState({
                        direccion: null,
                        hogarDomicilio: null
                    });
                }
            })
        );
    }

    getSectoresPorDistrito = async () => {
        if (localStorage.getItem('sector') === null) {
            await helpers.validaToken().then(helpers.authAxios.get(this.url + '/Sector/GetSectoresByDistrito/' + localStorage.getItem('dto'))
                .then(res => {
                    this.setState({
                        sectores: res.data.sectores.filter(sec => sec.sec_Tipo_Sector == "SECTOR")
                    })
                })
            );
        }
        else {
            await helpers.validaToken().then(helpers.authAxios.get(this.url + '/Sector/' + localStorage.getItem('sector'))
                .then(res => {
                    this.setState({
                        sectores: res.data.sector
                    })
                })
            );
        }
    }

    getPersonas = async () => {
        this.setState({
            mensajeDelProceso: "Procesando...",
            modalShow: true
        })

        if (localStorage.getItem("sector") !== null) {//Si es Sesión Pastor
            await helpers.validaToken().then(helpers.authAxios.get(helpers.url_api + "/Persona/GetBySector/" + localStorage.getItem("sector"))
                .then(res => {
                    let data = res.data.sort(function (a, b) {
                        if (a.persona.per_Nombre < b.persona.per_Nombre) { return -1; }
                        if (a.persona.per_Nombre > b.persona.per_Nombre) { return 1; }
                        return 0;
                    })
                    this.setState({
                        personasTodas: data,
                        status: 'success',
                        tempPersonas: data,
                        modalShow: false
                    });
                    this.getActivos();
                })
                .catch((error) => {
                    alert("Error: Hubo un problema en la comunicación con el Servidor. Intente mas tarde.");
                    setTimeout(() => { document.location.href = '/'; }, 3000);
                    this.setState({ modalShow: false })
                })
            );
        }
        else { //Si es Sesión Obispo
            await helpers.validaToken().then(helpers.authAxios.get(this.url + "/persona/GetByDistrito/" + localStorage.getItem('dto'))
                .then(res => {
                    let data = res.data.sort(function (a, b) {
                        if (a.persona.per_Nombre < b.persona.per_Nombre) { return -1; }
                        if (a.persona.per_Nombre > b.persona.per_Nombre) { return 1; }
                        return 0;
                    })
                    this.setState({
                        personasTodas: data,
                        status: 'success',
                        tempPersonas: data,
                        modalShow: false
                    });
                    this.getActivos();
                })
                .catch((error) => {
                    alert("Error: Hubo un problema en la comunicación con el Servidor. Intente mas tarde.");
                    setTimeout(() => { document.location.href = '/'; }, 3000);
                    this.setState({ modalShow: false })
                })
            )
        }
    };

    InfoAdicional = () => {
        return (
            alert("Disponible proximamente.")
        );
    }

    fnEliminaPersona = async (persona) => {
        await helpers.validaToken().then(helpers.authAxios.delete(this.url + "/persona/" + persona.per_Id_Persona)
            .then(res => res.data)
            .catch(error => error)
        );
        window.location.reload();
    }

    InfoStatus = (persona) => {
        let bautizado = persona.per_Bautizado === true ? "BAUTIZADO" : "NO BAUTIZADO";
        let activo = persona.per_Activo === true ? "ACTIVO" : "NO ACTIVO";
        let vivo = persona.per_Vivo === true ? "VIVO" : "FINADO";

        let infoStatus = {
            bautizado,
            activo,
            vivo
        }
        return infoStatus;
    }

    getSector = async () => {
        if (localStorage.getItem('sector') !== null) {
            await helpers.validaToken().then(helpers.authAxios.get(this.url + "/sector/" + localStorage.getItem('sector'))
                .then(res => {
                    this.setState({
                        sector: res.data.sector[0]
                    });
                })
            );
        }
    }

    getDistrito = async () => {
        if (localStorage.getItem('dto') !== null) {
            await helpers.validaToken().then(helpers.authAxios.get(this.url + "/distrito/" + localStorage.getItem('dto'))
                .then(res => {
                    this.setState({
                        distrito: res.data
                    });
                })
            );
        }
    }

    handle_modalEliminaPersona = (info) => {
        this.setState({
            showModalEliminaPersona: true,
            currentPersona: info
        });
    }

    handle_closeModalEliminaPersona = (info) => {
        this.setState({
            showModalEliminaPersona: false,
            currentPersona: {}
        });
    }

    handle_modalInfoPersona = async (persona) => {
        persona.per_Fecha_BautismoFormateada = helpers.reFormatoFecha(persona.per_Fecha_Bautismo);
        persona.per_Fecha_Boda_CivilFormateada = helpers.reFormatoFecha(persona.per_Fecha_Boda_Civil);
        persona.per_Fecha_Boda_EclesiasticaFormateada = helpers.reFormatoFecha(persona.per_Fecha_Boda_Eclesiastica);
        persona.per_Fecha_NacimientoFormateada = helpers.reFormatoFecha(persona.per_Fecha_Nacimiento);
        persona.per_Fecha_Recibio_Espiritu_SantoFormateada = helpers.reFormatoFecha(persona.per_Fecha_Recibio_Espiritu_Santo);
        this.setState({
            modalInfoPersona: true,
            currentPersona: persona
        });

        let getHogar = await helpers.validaToken().then(helpers.authAxios.get(this.url + "/Hogar_Persona/GetHogarByPersona/" + persona.per_Id_Persona)
            .then(res => res.data)
        );

        await helpers.validaToken().then(helpers.authAxios.get(this.url + "/Hogar_Persona/GetDatosHogarDomicilio/" + getHogar.hd_Id_Hogar)
            .then(res => {
                this.setState({
                    DatosHogarDomicilio: res.data[0]
                });
            })
        );
    }

    handle_modalInfoPersonaClose = () => {
        this.setState({
            modalInfoPersona: false,
            currentPersona: {},
            MiembrosDelHogar: [],
            DatosHogarDomicilio: {},
            CasadoDivorciadoViudo: false,
            ConcubinadoSolteroConHijos: false,
            soltero: false,
        });
    }

    handle_editarPersona = (infoPersona) => {
        if (localStorage.getItem("idPersona")) {
            localStorage.removeItem("idPersona");
            localStorage.removeItem("currentPersona");
        }
        localStorage.setItem("idPersona", infoPersona.per_Id_Persona);
        localStorage.setItem("currentPersona", JSON.stringify(infoPersona));
        document.location.href = "/RegistroDePersona";
    }

    handle_filtroPorNombre = (e) => {

        this.setState({ fNombre: e.target.value });
        if (e.target.value !== '' && e.target.value.length > 2) {
            var result = this.state.personas.filter((obj) => {
                const query = e.target.value.toLowerCase();
                console.log("Query: ", query)
                if (obj.persona.per_Apellido_Materno) {
                    return obj.persona.per_Nombre.toLowerCase().includes(query)
                        || obj.persona.per_Apellido_Paterno.toLowerCase().includes(query)
                        || obj.persona.per_Apellido_Materno.toLowerCase().includes(query)
                } else {
                    return obj.persona.per_Nombre.toLowerCase().includes(query)
                        || obj.persona.per_Apellido_Paterno.toLowerCase().includes(query)
                }
            });
            this.setState({
                personas: result,
                habilitaFiltroCategoria: 'disabled',
                habilitaFiltroGrupo: 'disabled',
                habilitaFiltroSector: 'disabled'
            });
        } else {
            //this.handle_BorrarFiltros();
            // this.setState({
            //     personas: this.state.tempPersonas
            // })
            this.getActivos()
        }
    }

    handle_filtroPorCategoria = (e) => {
        this.setState({ fCategoria: e.target.value })
        if (e.target.value !== '0') {
            var result = this.state.personas.filter((obj) => {
                return obj.persona.per_Categoria.startsWith(e.target.value)
            });
            this.setState({ personas: result })
        }
        this.setState({ habilitaFiltroCategoria: 'disabled' })
    }

    handle_filtroPorGrupo = (e) => {
        this.setState({ fGrupo: e.target.value })
        if (e.target.value !== '0') {
            let boolBautizado = e.target.value === "bautizado" ? true : false;
            var result = this.state.personas.filter((obj) => {
                return obj.persona.per_Bautizado === boolBautizado
            });
            this.setState({ personas: result })
        }
        this.setState({ habilitaFiltroGrupo: 'disabled' })
    }

    handle_filtroPorSector = (e) => {
        this.setState({ fSector: e.target.value })
        if (e.target.value !== '0') {
            var result = this.state.personas.filter((obj) => {
                return obj.persona.sec_Id_Sector === parseInt(e.target.value)
            });
            this.setState({ personas: result })
        }
        this.setState({ habilitaFiltroSector: 'disabled' })
    }

    handle_filtroPorProfesion = (e) => {
        this.setState({ fProfesionOficio: e.target.value });
        if (e.target.value !== '' && e.target.value.length > 2) {
            var result = this.state.personas.filter((obj) => {
                const query = e.target.value.toLowerCase();
                return (
                    obj.persona.profesionOficio1[0].pro_Sub_Categoria.toLowerCase().includes(query)
                    || obj.persona.profesionOficio1[0].pro_Categoria.toLowerCase().includes(query)
                    || obj.persona.profesionOficio2[0].pro_Sub_Categoria.toLowerCase().includes(query)
                    || obj.persona.profesionOficio2[0].pro_Categoria.toLowerCase().includes(query)
                );
            });
            this.setState({
                personas: result,
                habilitaFiltroCategoria: 'disabled',
                habilitaFiltroGrupo: 'disabled',
                habilitaFiltroSector: 'disabled'
            });
        } else {
            //this.handle_BorrarFiltros();
            // this.setState({
            //     personas: this.state.tempPersonas
            // })
            this.getActivos()
        }
    }

    handle_filtroActivoComunionVivo = (e) => {
        this.setState({ fActivoComunionVivo: e.target.value })
        switch (e.target.value) {
            case 'todos':
                this.getTodos();
                break;
            case 'inactivo':
                this.getInactivos();
                break;
            case 'activo':
                this.getActivos();
                break;
            default:
        }
        this.setState({ habilitaFiltroActivoComunionVivo: 'disabled' })
    }

    handle_BorrarFiltros = () => {
        this.getActivos();
        this.setState({
            //personas: this.state.tempPersonas,
            fCategoria: '0',
            fNombre: '',
            fGrupo: '0',
            fSector: '0',
            fProfesionOficio: '',
            fActivoComunionVivo: 'activo',
            habilitaFiltroCategoria: '',
            habilitaFiltroGrupo: '',
            habilitaFiltroNombre: '',
            habilitaFiltroProfesionOficio: '',
            habilitaFiltroSector: '',
            habilitaFiltroActivoComunionVivo: ''
        });
    }

    handle_showModalInfoHogar = async (info) => {
        this.setState({
            objPersona: info,
            modalInfoHogar: true
        })
    }

    handle_closeModalInfoHogar = () => {
        this.setState({ modalInfoHogar: false })
    }

    handle_LinkEncabezado = (seccion, componente, info) => {
        localStorage.setItem('seccion', seccion);
        localStorage.setItem('componente', componente);
        localStorage.setItem('objPersona', JSON.stringify(info));
    }

    hojaDatosEstadisticosPDF = async (info) => {
        if (!info.persona.per_Bautizado) {
            alert("Esta opción solo está disponible para Personal Bautizado!")
            return false
        }

        // ELIMINA TEXTO null o undefined
        Object.keys(info.persona).forEach((key) => {
            info.persona[key] = info.persona[key] === null || info.persona[key] === undefined ? '' : info.persona[key];
        });


        if (info.domicilio.length > 0) {
            Object.keys(info.domicilio[0]).forEach((key) => {
                info.domicilio[0][key] = info.domicilio[0][key] === null || info.domicilio[0][key] === undefined ? '' : info.domicilio[0][key];
            });
        }
        else {
            info.domicilio.push({
                est_Nombre: "",
                hd_Calle: "Sin información para mostrar. Revíselo con Soporte Técnico.",
                hd_Localidad: "",
                hd_Municipio_Ciudad: "",
                hd_Numero_Exterior: "",
                hd_Numero_Interior: "",
                hd_Subdivision: "",
                hd_Telefono: "Sin información para mostrar. Revíselo con Soporte Técnico.",
                hd_Tipo_Subdivision: "",
                pais_Nombre_Corto: ""
            })
        }

        // await helpers.validaToken().then(helpers.authAxios.get(`/HogarDomicilio/${info.domicilio[0].hd_Id_Hogar}`)
        //     .then(res => {

        //         if (res.data.status === "success") {
        //             this.setState({
        //                 direccion: res.data.direccion
        //             })
        //         }
        //     })
        // )

        console.log("info: ", info.domicilio)
        let fechaActual = new Date();
        console.log("persona:", typeof (moment(info.persona.per_Fecha_Nacimiento).format('D/MMM/YYYY')))
        var datos = {
            "idPersona": info.persona.per_Id_Persona,
            "NombreCompleto": `${info.persona.per_Nombre} ${info.persona.apellidoPrincipal} ${info.persona.per_Apellido_Materno}`,
            "edad": info.persona.edad,
            "Nacionalidad": info.persona.per_Nacionalidad,
            "LugarNacimiento": info.persona.per_Lugar_De_Nacimiento,
            "FechaNacimiento": info.persona.per_Fecha_Nacimiento ? (moment(info.persona.per_Fecha_Nacimiento).format('D/MMM/YYYY')) : "",
            "NombreDePadres": `${info.persona.per_Nombre_Padre} ${info.persona.per_Nombre_Madre != "" ? `y ${info.persona.per_Nombre_Madre}` : ""}`,
            "PadresPaternos": `${info.persona.per_Nombre_Abuelo_Paterno} ${info.persona.per_Nombre_Abuela_Paterna != "" ? `y ${info.persona.per_Nombre_Abuela_Paterna}` : ""}`,
            "PadresMaternos": `${info.persona.per_Nombre_Abuelo_Materno} ${info.persona.per_Nombre_Abuela_Materna != "" ? `y ${info.persona.per_Nombre_Abuela_Materna}` : ""}`,
            "EstadoCivil": info.persona.per_Estado_Civil,
            "FechaBodaCivil": info.persona.per_Fecha_Boda_Civil ? (moment(info.persona.per_Fecha_Boda_Civil).format('D/MMM/YYYY')) : "",
            "Acta": info.persona.per_Num_Acta_Boda_Civil,
            "Libro": info.persona.per_Libro_Acta_Boda_Civil,
            "Oficialia": info.persona.per_Oficialia_Boda_Civil,
            "RegistroCivil": info.persona.per_Registro_Civil,
            "FechaBodaEclesiastica": info.persona.per_Fecha_Boda_Eclesiastica ? (moment(info.persona.per_Fecha_Boda_Eclesiastica).format('D/MMM/YYYY')) : "",
            "LugarBodaEclesiastica": info.persona.per_Lugar_Boda_Eclesiastica,
            "NombreConyugue": info.persona.per_Nombre_Conyuge,
            "CantidadHijos": info.persona.per_Cantidad_Hijos,
            "NombreHijos": info.persona.per_Nombre_Hijos,
            "LugarBautismo": info.persona.per_Lugar_Bautismo,
            "FechaBautismo": info.persona.per_Fecha_Bautismo ? (moment(info.persona.per_Fecha_Bautismo).format('D/MMM/YYYY')) : "",
            "QuienBautizo": info.persona.per_Ministro_Que_Bautizo,
            "FechaPromesaEspiritu": info.persona.per_Fecha_Recibio_Espiritu_Santo ? (moment(info.persona.per_Fecha_Recibio_Espiritu_Santo).format('D/MMM/YYYY')) : "",
            "BajoImposicionDeManos": info.persona.per_Bajo_Imposicion_De_Manos,
            "Puestos": info.persona.per_Cargos_Desempenados,
            "CambiosDomicilio": info.persona.per_Cambios_De_Domicilio,
            "Domicilio": info.domicilio[0].direccion,
            "Telefonos": `${info.persona.per_Telefono_Movil !== null || info.persona.per_Telefono_Movil !== "" ? ("PERSONAL: " + info.persona.per_Telefono_Movil) : ""} ${info.domicilio[0].hd_Telefono == null || info.domicilio[0].hd_Telefono == "" ? "" : ("- CASA: " + info.domicilio[0].hd_Telefono)}`,
            "Email": `${info.persona.per_Email_Personal !== null || info.persona.per_Email_Personal !== "" ? info.persona.per_Email_Personal : "-"}`,
            "Oficio1": `${info.persona.profesionOficio1[0].pro_Sub_Categoria === "OTRO" ? "" : info.persona.profesionOficio1[0].pro_Sub_Categoria}`,
            "Oficio2": `${info.persona.profesionOficio2[0].pro_Sub_Categoria === "OTRO" ? "" : info.persona.profesionOficio2[0].pro_Sub_Categoria}`,
            "Fecha": (moment(fechaActual).format('D/MMM/YYYY')),
            "Secretario":
                await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/PersonalMinisterial/GetSecretarioBySector/${info.persona.sec_Id_Sector}`)
                    .then(res => {
                        if (res.data.status === "success" && res.data.infoSecretario.length > 0) {
                            return `${res.data.infoSecretario[0].pem_Nombre}`;
                        }
                    })
                ),
            "Foto": `${helpers.url_api}/Foto/${info.persona.per_Id_Persona}`
        }

        var request = new Request(
            `${helpers.url_api}/DocumentosPDF/HojaDatosEstadisticos`,
            {
                method: "post",
                body: JSON.stringify(datos),
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json'
                },
                mode: "cors",
                cache: "default",
            });

        this.setState({
            mensajeDelProceso: "Procesando...",
            modalShow: true
        })

        fetch(request)
            .then((response) => response.blob())
            .then((blob) => {
                const file = window.URL.createObjectURL(blob);
                this.setState({
                    mensajeDelProceso: "",
                    modalShow: false
                })
                window.open(file);
            })
            .catch((err) => {
                alert(err);
            })
        // INSTANCIA NUEVO OBJETO PARA CREAR PDF
        /* const doc = new jsPDF("p", "mm", "letter")
        doc.lineHeightProportion = 5;


        await helpers.validaToken().then(helpers.authAxios.get(`/HogarDomicilio/${info.domicilio[0].hd_Id_Hogar}`)
            .then(res => {
                if (res.data.status === "success") {
                    this.setState({
                        direccion: res.data.direccion
                    })
                }
            })

        // AGREGA DECORACION underline AL TEXTO
        //PARAMETROS: x = INICIO DE LINEA, contante = MARGEN, texto = TEXTO A DECORAR, y = ALTURA
        const drawUnderlineTotext = (x, constante, texto, y) => {
            let bar = doc.getTextWidth(x) + constante;
            let foo = doc.getTextWidth(texto);
            return doc.line(bar, y + .5, bar + foo, y + .5);
        }
        var txt = "";


        // FUNCION PARA DIVIDIR TEXTBOX LARGOS
        const dividirTextbox = (limitePrimeraLinea, texto) => {
            let info = {
                primerLinea: "",
                textoTruncado: [],
                totalDeLineas: 0
            }
            info.primerLinea = texto.substring(0, limitePrimeraLinea)
            if (texto.length > limitePrimeraLinea) {
                let restoDelTexto = texto.substring(limitePrimeraLinea, texto.length)
                let siguientesLineas = restoDelTexto.match(/.{1,107}/g);
                info.totalDeLineas = siguientesLineas.length;
                if (info.totalDeLineas > 3) {
                    for (let i = 0; i < 3; i++) {
                        info.textoTruncado.push(siguientesLineas[i]);
                    }
                }
                else {
                    info.textoTruncado = siguientesLineas;
                }
                return info
            }
            else {
                return info = {
                    primerLinea: texto,
                    textoTruncado: [],
                    totalDeLineas: 0
                }
            }
        }

        // ELIMINA TEXTO null
        Object.keys(info.persona).forEach((key) => {
            info.persona[key] = info.persona[key] === null ? '' : info.persona[key];
        });


        if (info.domicilio.length > 0) {
            Object.keys(info.domicilio[0]).forEach((key) => {
                info.domicilio[0][key] = info.domicilio[0][key] === null ? '' : info.domicilio[0][key];
            });
        }
        else {
            info.domicilio.push({
                est_Nombre: "",
                hd_Calle: "Sin información para mostrar. Revíselo con Soporte Técnico.",
                hd_Localidad: "",
                hd_Municipio_Ciudad: "",
                hd_Numero_Exterior: "",
                hd_Numero_Interior: "",
                hd_Subdivision: "",
                hd_Telefono: "Sin información para mostrar. Revíselo con Soporte Técnico.",
                hd_Tipo_Subdivision: "",
                pais_Nombre_Corto: ""
            })
        }

        // FORMATEA FECHA PARA PDF
        helpers.fechas.forEach(fecha => {
            // Comprueba si la fecha fue formateada previamente
            if (/\d{4}-\d{2}-\d{2}T.{8}/.test(info.persona[fecha])) {
                info.persona[fecha] = helpers.reFormatoFecha(info.persona[fecha])
            }
        })

        // INICIA DOCUMENTO
        doc.addImage(nvologo, 'PNG', 13, 5, 85, 22.26);
        doc.text("DATOS ESTADISTICOS", 110, 19);
        doc.line(10, 32, 200, 32);


        let line = 40;
        let renglon = 8;
        // FOTO DE LA PERSONA
        doc.addImage(`${helpers.url_api}/Foto/${info.persona.per_Id_Persona}`, 'PNG', 169, line - 5, 30, 30);
        doc.line(169, line - 5, 199, line - 5)
        doc.line(169, line - 5, 169, line - 5 + 30)
        doc.line(169, line - 5 + 30, 199, line - 5 + 30)
        doc.line(199, line - 5, 199, line - 5 + 30)
        //doc.addImage(`http://iece-tpr.ddns.net/webapi/api/Foto/${info.persona.per_Id_Persona}`, 'PNG', 169, line-5);

        doc.setFontSize(9)
        doc.text(`1.- Nombre(s): ${info.persona.per_Nombre} ${info.persona.per_Apellido_Paterno} ${info.persona.per_Apellido_Materno} `, 11, line);
        drawUnderlineTotext('1.- Nombre(s): ', 11, `${info.persona.per_Nombre} ${info.persona.per_Apellido_Paterno} ${info.persona.per_Apellido_Materno} `, line);

        line = line + renglon;
        doc.text(`2.- Edad: ${info.persona.edad} `, 11, line);
        drawUnderlineTotext('2.- Edad: ', 11, `${info.persona.edad} `, line)
        doc.text(`Nacionalidad: ${info.persona.per_Nacionalidad} `, 50, line);
        drawUnderlineTotext('Nacionalidad: ', 50, `${info.persona.per_Nacionalidad} `, line);

        line = line + renglon;
        doc.text(`3.- Lugar y Fecha de nacimiento: ${info.persona.per_Lugar_De_Nacimiento}, En fecha: ${info.persona.per_Fecha_Nacimiento} `, 11, line);
        drawUnderlineTotext('3.- Lugar y Fecha de nacimiento: ', 11, `${info.persona.per_Lugar_De_Nacimiento} `, line);
        drawUnderlineTotext(`3.- Lugar y Fecha de nacimiento: ${info.persona.per_Lugar_De_Nacimiento}, En fecha: `, 13, `${info.persona.per_Fecha_Nacimiento} `, line);

        line = line + renglon;
        doc.text(`4.- Nombre de Padres: ${info.persona.per_Nombre_Padre}${info.persona.per_Nombre_Madre ? " y " : " "}${info.persona.per_Nombre_Madre} `, 11, line);
        drawUnderlineTotext('4.- Nombre de Padres: ', 11, `${info.persona.per_Nombre_Padre}, ${info.persona.per_Nombre_Madre}      `, line);

        line = line + renglon;
        doc.text(`5.- Abuelos Paternos: ${info.persona.per_Nombre_Abuelo_Paterno}${info.persona.per_Nombre_Abuela_Paterna ? " y " : " "}${info.persona.per_Nombre_Abuela_Paterna} `, 11, line);
        drawUnderlineTotext('5.- Abuelos Paternos: ', 11, `${info.persona.per_Nombre_Abuelo_Paterno}, ${info.persona.per_Nombre_Abuela_Paterna}     `, line);

        line = line + renglon;
        doc.text(`6.- Abuelos Maternos: ${info.persona.per_Nombre_Abuelo_Materno}${info.persona.per_Nombre_Abuela_Materna ? " y " : " "}${info.persona.per_Nombre_Abuela_Materna} `, 11, line);
        drawUnderlineTotext('6.- Abuelos Maternos: ', 11, `${info.persona.per_Nombre_Abuelo_Materno}, ${info.persona.per_Nombre_Abuela_Materna}     `, line);

        line = line + renglon;
        doc.text(`7.- Estado Civil: ${info.persona.per_Estado_Civil} `, 11, line);
        drawUnderlineTotext('7.- Estado Civil: ', 11, `${info.persona.per_Estado_Civil}   `, line);

        doc.text(`Fecha Boda Civil: ${info.persona.per_Fecha_Boda_Civil} `, 120, line);
        drawUnderlineTotext('Fecha Boda Civil: ', 120, `${info.persona.per_Fecha_Boda_Civil}   `, line);

        line = line + renglon - 3;
        doc.text(`Según Acta No.: ${info.persona.per_Num_Acta_Boda_Civil} `, 16, line);
        drawUnderlineTotext('Según Acta No.: ', 16, `${info.persona.per_Num_Acta_Boda_Civil}   `, line);

        doc.text(`del Libro No.: ${info.persona.per_Libro_Acta_Boda_Civil} `, 70, line);
        drawUnderlineTotext('del Libro No.: ', 70, `${info.persona.per_Libro_Acta_Boda_Civil}   `, line);

        doc.text(`Que lleva la oficialía.: ${info.persona.per_Oficialia_Boda_Civil} `, 120, line);
        drawUnderlineTotext('Que lleva la Oficialía.: ', 120, `${info.persona.per_Oficialia_Boda_Civil}   `, line);

        line = line + renglon - 3;
        doc.text(`del Registro Civil en: ${info.persona.per_Registro_Civil} `, 16, line);
        drawUnderlineTotext('del Registro Civil en: ', 16, `${info.persona.per_Registro_Civil}   `, line);

        line = line + renglon;
        doc.text(`8.- Contrajo matrimonio eclesiástico en la IECE el día: ${info.persona.per_Fecha_Boda_Eclesiastica}   `, 11, line);
        drawUnderlineTotext('8.- Contrajo matrimonio eclesiástico en la IECE el día: ', 11, `${info.persona.per_Fecha_Boda_Eclesiastica}   `, line);

        line = line + renglon - 3;
        doc.text(`Lugar de matrimonio eclesiástico en la IECE: ${info.persona.per_Lugar_Boda_Eclesiastica}   `, 16, line);
        drawUnderlineTotext('Lugar de matrimonio eclesiástico en la IECE: ', 16, `${info.persona.per_Lugar_Boda_Eclesiastica}   `, line);

        line = line + renglon;
        doc.text(`9.- Nombre de esposa(o): ${info.persona.per_Nombre_Conyuge}   `, 11, line);
        drawUnderlineTotext('9.- Nombre de esposa(o): ', 11, `${info.persona.per_Nombre_Conyuge}   `, line);

        line = line + renglon;
        doc.text(`10.- Cuántos hijos y sus nombres: ${info.persona.per_Cantidad_Hijos === 0 ? "" : info.persona.per_Cantidad_Hijos} `, 11, line);
        drawUnderlineTotext('10.- Cuántos hijos y sus nombres: ', 11, `${info.persona.per_Cantidad_Hijos === 0 ? "" : info.persona.per_Cantidad_Hijos}  `, line);

        if (info.persona.per_Nombre_Hijos !== null) {
            txt = dividirTextbox(71, info.persona.per_Nombre_Hijos);
            doc.text(`${txt.primerLinea} `, 67, line);
            drawUnderlineTotext('', 67, `${txt.primerLinea} `, line);
            if (txt.textoTruncado.length > 0) {

                for (let i = 0; i < txt.textoTruncado.length; i++) {
                    line = line + 6;
                    doc.text(txt.textoTruncado[i], 13, line);
                    drawUnderlineTotext('', 13, txt.textoTruncado[i], line);
                }
                if (txt.totalDeLineas > 3) {
                    line = line + 6;
                    doc.text('. . . . . . . . . .', 13, line);
                }
            }
        }
        else {
            doc.text(``, 67, line);
        }


        line = line + renglon;
        doc.text(`11.- Lugar y fecha de Bautismo: ${info.persona.per_Lugar_Bautismo}, En fecha: ${info.persona.per_Fecha_Bautismo} `, 11, line);
        drawUnderlineTotext('11.- Lugar y fecha de Bautismo: ', 11, `${info.persona.per_Lugar_Bautismo} `, line);
        drawUnderlineTotext(`11.- Lugar y fecha de Bautismo: ${info.persona.per_Lugar_Bautismo}, En fecha: `, 11, `${info.persona.per_Fecha_Bautismo} `, line);

        line = line + renglon;
        doc.text(`12.- Por quién fue bautizado: ${info.persona.per_Ministro_Que_Bautizo} `, 11, line);
        drawUnderlineTotext('12.- Por quién fue bautizado: ', 11, `${info.persona.per_Ministro_Que_Bautizo} `, line);

        line = line + renglon;
        doc.text(`13.- Fecha en la que recibió la Promesa del Espíritu Santo: ${info.persona.per_Fecha_Recibio_Espiritu_Santo} `, 11, line);
        drawUnderlineTotext('13.- Fecha en la que recibió la Promesa del Espíritu Santo: ', 11, `${info.persona.per_Fecha_Recibio_Espiritu_Santo} `, line);
        line = line + renglon - 3;
        doc.text(`Bajo la imposición de manos del Presbiterio: ${info.persona.per_Bajo_Imposicion_De_Manos} `, 16, line);
        drawUnderlineTotext('Bajo la imposición de manos del Presbiterio: ', 16, `${info.persona.per_Bajo_Imposicion_De_Manos} `, line);

        line = line + renglon;
        if (info.persona.per_Cargos_Desempenados !== null) {
            txt = dividirTextbox(68, info.persona.per_Cargos_Desempenados);
            doc.text(`14.- Puestos que ha desempeñado en la iglesia: ${txt.primerLinea} `, 11, line);
            drawUnderlineTotext('14.- Puestos que ha desempeñado en la iglesia: ', 11, `${txt.primerLinea} `, line);
            if (txt.textoTruncado.length > 0) {

                for (let i = 0; i < txt.textoTruncado.length; i++) {
                    line = line + 6;
                    doc.text(txt.textoTruncado[i], 11, line);
                    drawUnderlineTotext('', 11, txt.textoTruncado[i], line);
                }
                if (txt.totalDeLineas > 3) {
                    line = line + 6;
                    doc.text('. . . . . . . . . .', 11, line);
                }
            }
        }
        else {
            doc.text(`14.- Puestos desempeñados en la iglesia: `, 11, line);
        }

        line = line + renglon;
        if (info.persona.per_Cambios_De_Domicilio !== null) {
            txt = dividirTextbox(82, info.persona.per_Cambios_De_Domicilio);
            doc.text(`15.- Cambios de Domicilio: ${txt.primerLinea} `, 11, line);
            drawUnderlineTotext('15.- Cambios de Domicilio: ', 11, `${txt.primerLinea} `, line);
            if (txt.textoTruncado.length > 0) {
                for (let i = 0; i < txt.textoTruncado.length; i++) {
                    line = line + 6;
                    doc.text(txt.textoTruncado[i], 11, line);
                    drawUnderlineTotext('', 11, txt.textoTruncado[i], line);
                }
                if (txt.totalDeLineas > 3) {
                    line = line + 6;
                    doc.text('. . . . . . . . . .', 11, line);
                }
            }
        }
        else {
            doc.text(`15.- Cambios de domicilio: `, 11, line);
        }

        line = line + renglon; */
        /* doc.text(`16. - Domicilio actual: ${info.domicilio[0].hd_Calle} ${info.domicilio[0].hd_Numero_Exterior}, ${info.domicilio[0].hd_Numero_Interior === "" ? "" : "Interior: " + info.domicilio[0].hd_Numero_Interior}, ${info.domicilio[0].hd_Tipo_Subdivision} ${info.domicilio[0].hd_Subdivision}, ${info.domicilio[0].hd_Municipio_Ciudad}, ${info.domicilio[0].est_Nombre}, ${info.domicilio[0].pais_Nombre_Corto} `, 13, line);
        drawUnderlineTotext('16. - Domicilio actual: ', 13, `${info.domicilio[0].hd_Calle} ${info.domicilio[0].hd_Numero_Exterior} `, line);
        drawUnderlineTotext(`16. - Domicilio actual: ${info.domicilio[0].hd_Calle} ${info.domicilio[0].hd_Numero_Exterior}`, 13, `${info.domicilio[0].hd_Numero_Interior === "" ? "" : "Interior: " + info.domicilio[0].hd_Numero_Interior}, ${info.domicilio[0].hd_Tipo_Subdivision} ${info.domicilio[0].hd_Subdivision}, ${info.domicilio[0].hd_Municipio_Ciudad}, ${info.domicilio[0].est_Nombre}, ${info.domicilio[0].pais_Nombre_Corto} `, line); */

        /* doc.text(`16. - Domicilio actual: ${this.state.direccion}`, 11, line);
        drawUnderlineTotext('16.- Domicilio actual: ', 11, `${this.state.direccion} `, line);

        line = line + renglon;
        doc.text(`17.- Teléfonos: ${info.persona.per_Telefono_Movil !== null || info.persona.per_Telefono_Movil !== "" ? "Personal: " + info.persona.per_Telefono_Movil : ""} ${info.domicilio[0].hd_Telefono !== null || info.domicilio[0].hd_Telefono !== "" ? ", Hogar: " + info.domicilio[0].hd_Telefono : ""} `, 11, line);
        drawUnderlineTotext('17.- Teléfonos. ', 11, `${info.persona.per_Telefono_Movil !== null || info.persona.per_Telefono_Movil !== "" ? "Personal: " + info.persona.per_Telefono_Movil : ""} ${info.domicilio[0].hd_Telefono !== null || info.domicilio[0].hd_Telefono !== "" ? ", Hogar: " + info.domicilio[0].hd_Telefono : ""} `, line);

        line = line + renglon;
        doc.text(`18.- Profesión / Oficio1: ${info.persona.profesionOficio1[0].pro_Categoria === "OTRO" ? "" : info.persona.profesionOficio1[0].pro_Categoria} / ${info.persona.profesionOficio1[0].pro_Sub_Categoria === "OTRO" ? "" : info.persona.profesionOficio1[0].pro_Sub_Categoria}`, 11, line);
        drawUnderlineTotext('18.- Profesión / Oficio1: ', 11, `${info.persona.profesionOficio1[0].pro_Categoria === "OTRO" ? "" : info.persona.profesionOficio1[0].pro_Categoria} / ${info.persona.profesionOficio1[0].pro_Sub_Categoria === "OTRO" ? "" : info.persona.profesionOficio1[0].pro_Sub_Categoria}`, line);

        line = line + renglon;
        doc.text(`Profesión / Oficio2: ${info.persona.profesionOficio2[0].pro_Categoria === "OTRO" ? "" : info.persona.profesionOficio2[0].pro_Categoria} / ${info.persona.profesionOficio2[0].pro_Sub_Categoria === "OTRO" ? "" : info.persona.profesionOficio2[0].pro_Sub_Categoria}`, 17, line);
        drawUnderlineTotext('Profesión / Oficio2: ', 17, `${info.persona.profesionOficio2[0].pro_Categoria === "OTRO" ? "" : info.persona.profesionOficio2[0].pro_Categoria} / ${info.persona.profesionOficio2[0].pro_Sub_Categoria === "OTRO" ? "" : info.persona.profesionOficio2[0].pro_Sub_Categoria}`, line);

        doc.text(`${fechaActual.getFullYear()}-${fechaActual.getMonth() + 1}-${fechaActual.getDate()}`, 52, 249);
        doc.line(30, 250, 90, 250);
        doc.text("FECHA", 54, 255);

        await helpers.validaToken().then(helpers.authAxios.get(`${helpers.url_api}/PersonalMinisterial/GetSecretarioBySector/${info.persona.sec_Id_Sector}`)
            .then(res => {
                //console.log(res.data.infoSecretario[0].pem_Nombre)
                if (res.data.status === "success" && res.data.infoSecretario.length > 0) {
                    doc.text(`${res.data.infoSecretario[0].pem_Nombre}`, 130, 249);
                }
                else {
                    doc.text("", 135, 249);
                }
            })
        doc.line(120, 250, 180, 250);
        doc.text("LA COMISIÓN", 142, 255);
        doc.save(`${info.persona.per_Nombre} ${info.persona.per_Apellido_Paterno} ${info.persona.per_Apellido_Materno}.pdf`); */
    }

    render() {
        return (
            <>
                {/* <h1 className="text-info">Listado de personal</h1> */}
                <Container>
                    <Row>
                        <Col xs="9">
                            {localStorage.getItem('sector') !== null &&
                                <p>
                                    <h4>{this.state.sector.sec_Tipo_Sector} {this.state.sector.sec_Numero}: {this.state.sector.sec_Alias}</h4>
                                </p>
                            }
                            {localStorage.getItem('sector') === null &&
                                <p>
                                    <h4> {this.state.distrito.dis_Tipo_Distrito} {this.state.distrito.dis_Numero} ({this.state.distrito.dis_Alias}, {this.state.distrito.dis_Area}) </h4>
                                </p>
                            }
                        </Col>
                        <Col xs="2">
                            {/* <Link to="/RegistroDePersona" className="btn bnt-sm btn-primary">Registrar persona</Link> */}
                            {/* <button onClick={helpers.handle_RegistroNvaPersona} className="btn bnt-sm btn-primary">Registrar persona</button> */}
                        </Col>
                    </Row>

                    {/* SECCION DE FILTROS 1 */}
                    <Row>
                        <Col xs="6">
                            <Input
                                type="select"
                                onChange={this.handle_filtroPorSector}
                                value={this.state.fSector}
                                disabled={this.state.habilitaFiltroSector}
                            >
                                {localStorage.getItem('sector') === null &&
                                    <React.Fragment>
                                        <option value="0">TODOS LOS SECTORES</option>
                                        {this.state.sectores.map(sector => {
                                            return (
                                                <React.Fragment key={sector.sec_Id_Sector}>
                                                    <option value={sector.sec_Id_Sector}>{sector.sec_Tipo_Sector} {sector.sec_Numero}: {sector.sec_Alias}</option>
                                                </React.Fragment>
                                            )
                                        })
                                        }
                                    </React.Fragment>
                                }
                                {localStorage.getItem('sector') !== null &&
                                    <React.Fragment>
                                        {this.state.sectores.map(sector => {
                                            return (
                                                <React.Fragment key={sector.sec_Id_Sector}>
                                                    <option value={sector.sec_Id_Sector}> {sector.sec_Tipo_Sector} {sector.sec_Numero}: {sector.sec_Alias}</option>
                                                </React.Fragment>
                                            )
                                        })
                                        }
                                    </React.Fragment>
                                }
                            </Input>
                            <Label>Filtro por sector</Label>
                        </Col>
                        <Col xs="3">
                            <Input
                                type="select"
                                value={this.state.fGrupo}
                                onChange={this.handle_filtroPorGrupo}
                                disabled={this.state.habilitaFiltroGrupo}
                            >
                                <option value="0">TODOS</option>
                                <option value="bautizado">BAUTIZADO</option>
                                <option value="noBautizado">NO BAUTIZADO</option>
                            </Input>
                            <Label>Filtro por Grupo</Label>
                        </Col>
                        <Col xs="3">
                            <Input
                                type="select"
                                value={this.state.fCategoria}
                                onChange={this.handle_filtroPorCategoria}
                                disabled={this.state.habilitaFiltroCategoria}
                            >
                                <option value="0">TODOS</option>
                                <option value="ADULTO_HOMBRE">ADULTO HOMBRE</option>
                                <option value="ADULTO_MUJER">ADULTO MUJER</option>
                                <option value="JOVEN_HOMBRE">JOVEN HOMBRE</option>
                                <option value="JOVEN_MUJER">JOVEN MUJER</option>
                                <option value="NIÑO">NIÑO</option>
                                <option value="NIÑA">NIÑA</option>
                            </Input>
                            <Label>Filtro por categoría</Label>
                        </Col>
                    </Row>

                    {/* SECCION DE FILTROS 2 */}
                    <Row>
                        <Col xs="3">
                            <Input
                                type="text"
                                placeholder='Ej: Nombre o Apellido'
                                value={this.state.fNombre}
                                onChange={this.handle_filtroPorNombre}
                            >
                            </Input>
                            <Label>Filtro por Nombre o Apellido</Label>
                        </Col>
                        <Col xs="3">
                            <Input
                                type="text"
                                placeholder='Ej: Medico, Carpintero'
                                value={this.state.fProfesionOficio}
                                onChange={this.handle_filtroPorProfesion}
                            />
                            <Label>Filtro por Profesión/Oficio</Label>
                        </Col>
                        <Col xs="3">
                            <Input
                                type="select"
                                value={this.state.fActivoComunionVivo}
                                onChange={this.handle_filtroActivoComunionVivo}
                                disabled={this.state.habilitaFiltroActivoComunionVivo}
                            >
                                <option value="todos" defaultChecked>TODOS</option>
                                <option value="activo" >ACTIVO</option>
                                <option value="inactivo">INACTIVO</option>
                                {/* <option value="sinComunion">SIN COMUNION</option> */}
                            </Input>
                            <Label>Filtro por estatus de la persona</Label>
                        </Col>
                        <Col xs="3">
                            <Button
                                type="button"
                                onClick={this.handle_BorrarFiltros}
                            >
                                Reiniciar Filtros
                            </Button>
                        </Col>
                    </Row>
                    {this.state.personas.length >= 1 &&

                        <React.Fragment>
                            {/* TABLA: LISTA DE PERSONAS */}
                            <table className="table" id="tblPersonas">
                                <thead>
                                    <tr>
                                        <th scope="col">Nombre</th>
                                        <th scope="col" className="text-center">Grupo</th>
                                        <th scope="col" className="text-center">Categoría</th>
                                        <th scope="col" className="text-center">Activo</th>
                                        {/* <th scope="col" className="text-center">Vivo</th> */}
                                        <th scope="col" className="text-center">Sector</th>
                                        <th scope="col" className="text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.personas.map((obj) => {
                                            return (
                                                <React.Fragment key={obj.persona.per_Id_Persona}>
                                                    <tr>
                                                        <td>{obj.persona.per_Nombre} {obj.persona.apellidoPrincipal} {obj.persona.per_Apellido_Materno} </td>
                                                        <td className="text-center">
                                                            {this.InfoStatus(obj.persona).bautizado}
                                                        </td>
                                                        <td className="text-center">
                                                            {obj.persona.per_Categoria}
                                                        </td>
                                                        <td className="text-center">
                                                            {this.InfoStatus(obj.persona).activo}
                                                        </td>
                                                        <td className="text-center">
                                                            {obj.persona.sec_Numero}
                                                        </td>
                                                        <td className="text-center">
                                                            <Link
                                                                // onClick={this.handle_modalInfoPersona}
                                                                onClick={() => this.handle_LinkEncabezado("Seccion: ", "Análisis Personal", obj)}
                                                                className="btn btn-success btn-sm btnMarginRight"
                                                                title="Analizar persona"
                                                                to={{
                                                                    pathname: "/AnalisisPersonal",
                                                                    persona: obj
                                                                }}
                                                            >
                                                                <span className="fas fa-eye icon-btn-p"></span>Analizar
                                                            </Link>
                                                            <button
                                                                // onClick={this.handle_modalInfoPersona}
                                                                onClick={() => this.handle_showModalInfoHogar(obj)}
                                                                className="btn btn-info btn-sm btnMarginRight"
                                                                title="Hogar">
                                                                <span className="fas fa-home icon-btn-p"></span>Hogar
                                                            </button>
                                                            <button
                                                                // onClick={this.handle_modalInfoPersona}
                                                                onClick={() => this.hojaDatosEstadisticosPDF(obj)}
                                                                className="btn btn-danger btn-sm"
                                                                title="Hoja de datos">
                                                                <span className="fas fa-file-pdf icon-btn-p"></span>Hoja Datos
                                                            </button>

                                                        </td>
                                                    </tr>

                                                    {/* MODAL INFORMACION DE LA PERSONA (OBSOLETO) */}
                                                    <Modal isOpen={this.state.modalInfoPersona} contentClassName="modalVerInfoPersona" size="lg">
                                                        <Container>
                                                            <div id="infoDatosEstadisticos">
                                                                <ModalHeader>
                                                                    <Row>
                                                                        <Col sm="5">
                                                                            <img src={IECELogo} className="imgLogoModalDatosEstadisticos" alt="Logo" />
                                                                        </Col>
                                                                        <Col sm="7" className="tituloDatosEstadisticos">
                                                                            Hoja de Datos Estadísticos
                                                                        </Col>
                                                                    </Row>
                                                                </ModalHeader>
                                                                <ModalBody>
                                                                    <Row className="modalBodyRowDatosEstadisticos">
                                                                        <Col sm="12">
                                                                            <span className="tituloListaDatosEstadisticos" >1.- Nombre: </span>
                                                                            <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Nombre} {this.state.currentPersona.per_Apellido_Paterno} {this.state.currentPersona.per_Apellido_Materno} </span>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row className="modalBodyRowDatosEstadisticos">
                                                                        <Col sm="4">
                                                                            <span className="tituloListaDatosEstadisticos" >2.- Edad: </span>
                                                                            <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Fecha_NacimientoFormateada} </span>
                                                                        </Col>
                                                                        <Col sm="4">
                                                                            <span className="tituloListaDatosEstadisticos" >Nacionalidad: </span>
                                                                            <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Nacionalidad} </span>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row className="modalBodyRowDatosEstadisticos">
                                                                        <Col sm="12">
                                                                            <span className="tituloListaDatosEstadisticos" >3.- Lugar y fecha de nacimiento: </span>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row className="modalBodyRowDatosEstadisticos">
                                                                        <Col sm="12">
                                                                            <span className="tituloListaDatosEstadisticos" >4.- Nombre de sus padres: </span>
                                                                            <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Nombre_Padre}, {this.state.currentPersona.per_Nombre_Madre} </span>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row className="modalBodyRowDatosEstadisticos">
                                                                        <Col sm="12">
                                                                            <span className="tituloListaDatosEstadisticos" >5.- Abuelos paternos: </span>
                                                                            <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Nombre_Abuelo_Paterno}, {this.state.currentPersona.per_Nombre_Abuela_Paterna} </span>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row className="modalBodyRowDatosEstadisticos">
                                                                        <Col sm="12">
                                                                            <span className="tituloListaDatosEstadisticos" >6.- Abuelos maternos: </span>
                                                                            <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Nombre_Abuelo_Materno}, {this.state.currentPersona.per_Nombre_Abuela_Materna} </span>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row className="modalBodyRowDatosEstadisticos">
                                                                        <Col sm="4">
                                                                            <span className="tituloListaDatosEstadisticos" >7.- Estado civil: </span>
                                                                            <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Estado_Civil} </span>
                                                                        </Col>
                                                                        <Col sm="4">
                                                                            <span className="tituloListaDatosEstadisticos" >Fecha de la boda civil: </span>
                                                                            <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Fecha_Boda_CivilFormateada} </span>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row className="modalBodyRowDatosEstadisticos">
                                                                        <Col sm="4">
                                                                            <span className="tituloListaDatosEstadisticos" >Según acta: </span>
                                                                            <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Num_Acta_Boda_Civil} </span>
                                                                        </Col>
                                                                        <Col sm="4">
                                                                            <span className="tituloListaDatosEstadisticos" >Del Libro No.: </span>
                                                                            <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Libro_Acta_Boda_Civil} </span>
                                                                        </Col>
                                                                        <Col sm="4">
                                                                            <span className="tituloListaDatosEstadisticos" >Que lleva la oficialía: </span>
                                                                            <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Oficialia_Boda_Civil} </span>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row className="modalBodyRowDatosEstadisticos">
                                                                        <Col sm="12">
                                                                            <span className="tituloListaDatosEstadisticos" >Del Registro Civil en: </span>
                                                                            <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Registro_Civil} </span>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row className="modalBodyRowDatosEstadisticos">
                                                                        <Col sm="12">
                                                                            <span className="tituloListaDatosEstadisticos" >8.- Contrajo Matrimonio Eclesiástico en la I.E.C.E el día: </span>
                                                                            <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Fecha_Boda_EclesiasticaFormateada} </span>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row className="modalBodyRowDatosEstadisticos">
                                                                        <Col sm="12">
                                                                            <span className="tituloListaDatosEstadisticos" >Lugar de Matrimonio Eclesiástico en la I.E.C.E.: </span>
                                                                            <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Lugar_Boda_Eclesiastica} </span>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row className="modalBodyRowDatosEstadisticos">
                                                                        <Col sm="4">
                                                                            <span className="tituloListaDatosEstadisticos" >10.- Cuantos hijos y sus nombres: </span>
                                                                            <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Cantidad_Hijos} </span>
                                                                        </Col>
                                                                        <Col sm="8">
                                                                            <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Nombre_Hijos} </span>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row className="modalBodyRowDatosEstadisticos">
                                                                        <Col sm="12">
                                                                            <span className="tituloListaDatosEstadisticos" >13.- Fecha en la que recibio la promesa del Espíritu Santo: </span>
                                                                            <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Fecha_Recibio_Espíritu_SantoFormateada} </span>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row className="modalBodyRowDatosEstadisticos">
                                                                        <Col sm="12">
                                                                            <span className="tituloListaDatosEstadisticos" >Bajo la imposición de manos del presbiterio: </span>
                                                                            <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Bajo_Imposicion_De_Manos} </span>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row className="modalBodyRowDatosEstadisticos">
                                                                        <Col sm="12">
                                                                            <span className="tituloListaDatosEstadisticos" >14.- Puestos desempeñados en la IECE: </span>
                                                                            <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Cargos_Desempenados} </span>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row className="modalBodyRowDatosEstadisticos">
                                                                        <Col sm="12">
                                                                            <span className="tituloListaDatosEstadisticos" >15.- Cambios de domicilio: </span>
                                                                            <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Cambios_De_Domicilio} </span>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row className="modalBodyRowDatosEstadisticos">
                                                                        <Col sm="12">
                                                                            <span className="tituloListaDatosEstadisticos" >16.- Domicilio actual: </span>
                                                                            <span className="infoDatosEstadisticos" >
                                                                                Calle: {this.state.DatosHogarDomicilio.hd_Calle}, No.: {this.state.DatosHogarDomicilio.hd_Numero_Exterior}, Interior: {this.state.DatosHogarDomicilio.hd_Numero_Interior},
                                                                                {this.state.DatosHogarDomicilio.hd_Tipo_Subdivision}, {this.state.DatosHogarDomicilio.hd_Subdivision} <br />
                                                                                Localidad: {this.state.DatosHogarDomicilio.hd_Localidad}, Municipio/cuidad: {this.state.DatosHogarDomicilio.hd_Municipio_Ciudad},
                                                                                {this.state.DatosHogarDomicilio.est_Nombre}, Pais: {this.state.DatosHogarDomicilio.pais_Nombre_Corto} <br />
                                                                                Telefono: {this.state.DatosHogarDomicilio.hd_Telefono}
                                                                            </span>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row className="modalBodyRowDatosEstadisticos">
                                                                        <Col sm="4">
                                                                            <span className="tituloListaDatosEstadisticos" >17.- Teléfono: </span>
                                                                            <span className="infoDatosEstadisticos" > {this.state.currentPersona.per_Telefono_Movil} </span>
                                                                        </Col>
                                                                        <Col sm="4">
                                                                            <span className="tituloListaDatosEstadisticos" >E-mail: </span>
                                                                            <span className="infoDatosEstadisticos" > {this.state.currentPersona.per_Email_Personal} </span>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row className="modalBodyRowDatosEstadisticos">
                                                                        <Col sm="6">
                                                                            <span className="tituloListaDatosEstadisticos" >18.- Profesión / Oficio: </span>
                                                                            <span className="infoDatosEstadisticos" > {this.state.currentPersona.pro_Id_Profesion_Oficio1} </span>
                                                                        </Col>
                                                                        <Col sm="6">
                                                                            <span className="tituloListaDatosEstadisticos" >Profesión / Oficio: </span>
                                                                            <span className="infoDatosEstadisticos" > {this.state.currentPersona.pro_Id_Profesion_Oficio2} </span>
                                                                        </Col>
                                                                    </Row>
                                                                </ModalBody>
                                                            </div>
                                                            <ModalFooter>
                                                                <Button color="secondary" onClick={this.handle_modalInfoPersonaClose}>Cancel</Button>
                                                                <Button
                                                                    color="danger"
                                                                    onClick={() => helpers.ToPDF("infoDatosEstadisticos")} >
                                                                    <span className="fas fa-file-pdf icon-btn-p"></span>Generar PDF
                                                                </Button>
                                                                <Button
                                                                    color="success"
                                                                    onClick={() => this.handle_editarPersona(this.state.currentPersona)} >
                                                                    <span className="fas fa-pencil-alt icon-btn-p"></span>Editar
                                                                </Button>
                                                            </ModalFooter>
                                                        </Container>
                                                    </Modal>
                                                </React.Fragment>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>

                            {/* MODAL: INFORMACION DEL HOGAR */}
                            <Modal
                                isOpen={this.state.modalInfoHogar}
                                onRequestClose={this.handle_closeModalInfoHogar}
                                size="lg"
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle><h4>INFORMACION DE HOGAR</h4></CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        <ModalInfoHogar
                                            objPersona={this.state.objPersona}
                                        />
                                    </CardBody>
                                    <CardFooter>
                                        <Button
                                            type="button"
                                            onClick={this.handle_closeModalInfoHogar}
                                        >
                                            Cerrar
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </Modal>

                            {/* MODAL: ELIMINAR UNA PERSONA (OBSOLETO) */}
                            <Modal
                                isOpen={this.state.showModalEliminaPersona}
                                onRequestClose={this.handle_closeModalEliminaPersona}
                                size="lg"
                            >
                                <ModalHeader>
                                    Eliminar persona.
                                </ModalHeader>
                                <ModalBody>
                                    <Alert color="warning">
                                        <strong>Advertencia: </strong><br />
                                        Al eliminar una persona serán reorganizadas las jerarquías dentro del hogar y
                                        si la persona es la última del hogar, el hogar también será dado de baja.
                                    </Alert>
                                    ¿Esta seguro de querer eliminar a la persona: <strong>{this.state.currentPersona.per_Nombre} {this.state.currentPersona.per_Apellido_Paterno} {this.state.currentPersona.per_Apellido_Materno}</strong>?
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="secondary" onClick={this.handle_closeModalEliminaPersona}>Cancelar</Button>
                                    <Button color="danger" onClick={() => this.fnEliminaPersona(this.state.currentPersona)}>Eliminar</Button>
                                </ModalFooter>
                            </Modal>
                        </React.Fragment>
                    }
                    {this.state.personas.length === 0 &&
                        <React.Fragment>
                            <h3>Aun no hay personas registradas o no hay coincidencias con el filtro!</h3>
                            {/* <p>Haga clic en el boton Registrar persona para registrar una persona.</p> */}
                        </React.Fragment>
                    }

                </Container>
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
            </>
        )

    };
}

export default ListaDePersonal;