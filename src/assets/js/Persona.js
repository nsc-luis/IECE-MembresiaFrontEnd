import axios from 'axios';
import SimpleReactValidator from 'simple-react-validator';
import Global from '../../Global';
import MomentLocalUtils from 'react-day-picker/moment';

class Persona {

    url = Global.url_api;
    fechaActual = MomentLocalUtils.formatDate(new Date(), "YYYY-MM-DD");

    state = {
        // generales: {},
        datosDelFormulario: {},
        sector: [],
        fechanNacimiento: this.fechaActual,
        RFCSinHomoclave: '',
        PersonaEncontrada: false,
        datosPersonaEncontrada: {},
        profesiones_oficios: [],
        ElMiembroEsBautizado: false,
        fechaBautismo: this.fechaActual,
        TienePromesaDelEspitiruSanto: false,
        fechaPromesaDelEspitiru: this.fechaActual,
        per_Fecha_Recibio_Espiritu: "",
        per_Bajo_Imposicion_De_Manos: "",
        fechaBodaCivil: this.fechaActual,
        fechaBodaEclesiastica: this.fechaActual,
        ConcubinatoSolteroConHijos: false,
        CasadoDivorciadoViudo: false,
        // distrito: [],
        paises: [],
        estados: [],
        SelectHogarId: 0,
        ListaHogares: [],
        MiembrosDelHogar: [],
        //eclesiasticos: [],
        status: null,
        per_Categoria: 0,
        per_Nombre: '',
        per_Apellido_Paterno: '',
        per_Apellido_Materno: '',
        per_Telefono_Fijo: '',
        per_Telefono_Movil: '',
        per_Email_Personal: ''
    };

    componentWillMount() {
        this.getEstados();
        this.getPaises();
        this.getProfesionesOficios();
        this.getListaHogares();
        this.validator = new SimpleReactValidator({
            messages: {
                alpha_space: 'Campo requerido, solo acepta letras y espacios.',
                required: "Este campo es requerido.",
                regex: "Selecciona una opciona valida.",
                phone: "Ingrese un numero valido de 10 digitos, solo numeros.",
                email: "Email invalido."
            }
        });
    };

    CheckNvaPersona = (day) => {
        // Obtener primera letra del apellido paterno
        var ap = this.per_Apellido_PaternoRef.current.value.split("");
        // Obtener primera vocal del apellido paterno
        var regex = /[^aeiou]/gi;
        var vowels = this.per_Apellido_PaternoRef.current.value.replace(regex, "");
        var pv = vowels[0] === ap[0] ? vowels[1] : vowels[0];

        // Obtener primera letra del apellido materno
        var am = this.per_Apellido_MaternoRef.current.value.split("");
        // Obtener primera letra del primer nombre
        var n = this.per_NombreRef.current.value.split("");

        var RFCSinHomo = ap[0] + pv + am[0] + n[0] + MomentLocalUtils.formatDate(day, 'YYMMDD');

        this.getPersonaByRFCSinHomo(RFCSinHomo);

        let fNacimPer = MomentLocalUtils.formatDate(day, 'YYYY-MM-DD')
        this.setState({
            fechanNacimiento: fNacimPer
        });
    }

    valida_per_Categoria = () => {
        this.setState({
            per_Categoria: this.per_CategoriaRef.current.value
        });
        this.validator.showMessages();
        this.forceUpdate();
    }

    valida_per_Nombre = () => {
        this.setState({
            per_Nombre: this.per_NombreRef.current.value
        });
        this.validator.showMessages();
        this.forceUpdate();
    }

    valida_per_Apellido_Paterno = () => {
        this.setState({
            per_Apellido_Paterno: this.per_Apellido_PaternoRef.current.value
        });
        this.validator.showMessages();
        this.forceUpdate();
    }

    valida_per_Apellido_Materno = () => {
        this.setState({
            per_Apellido_Materno: this.per_Apellido_MaternoRef.current.value
        });
        this.validator.showMessages();
        this.forceUpdate();
    }

    valida_per_Telefono_Movil = () => {
        this.setState({
            per_Telefono_Movil: this.per_Telefono_MovilRef.current.value
        });
        this.validator.showMessages();
        this.forceUpdate();
    }

    valida_per_Telefono_Fijo = () => {
        this.setState({
            per_Telefono_Fijo: this.per_Telefono_FijoRef.current.value
        });
        this.validator.showMessages();
        this.forceUpdate();
    }

    valida_per_Email_Personal = () => {
        this.setState({
            per_Email_Personal: this.per_Email_PersonalRef.current.value
        });
        this.validator.showMessages();
        this.forceUpdate();
    }

    getEstados = () => {
        axios.get(this.url + "/estado")
            .then(res => {
                this.setState({
                    estados: res.data,
                    status: 'success'
                });
            });
    };

    EstadoCivilSeleccion = () => {
        // console.log(this.per_Estado_CivilRef.current.value);
        switch (this.per_Estado_CivilRef.current.value) {
            case "casado":
                this.setState({
                    ConcubinatoSolteroConHijos: true,
                    CasadoDivorciadoViudo: true
                });
                break;
            case "divorciado":
                this.setState({
                    ConcubinatoSolteroConHijos: true,
                    CasadoDivorciadoViudo: true
                });
                break;
            case "viudo":
                this.setState({
                    ConcubinatoSolteroConHijos: true,
                    CasadoDivorciadoViudo: true
                });
                break;
            case "concubinato":
                this.setState({
                    ConcubinatoSolteroConHijos: true,
                    CasadoDivorciadoViudo: false
                });
                break;
            case "solteroconhijos":
                this.setState({
                    ConcubinatoSolteroConHijos: true,
                    CasadoDivorciadoViudo: false
                });
                break
            default:
                this.setState({
                    ConcubinatoSolteroConHijos: false,
                    CasadoDivorciadoViudo: false
                });
                break;
        }
    }

    getPaises = () => {
        axios.get(this.url + "/pais")
            .then(res => {
                this.setState({
                    paises: res.data,
                    status: 'success'
                });
            });
    };

    getPersonaByRFCSinHomo = (str) => {
        axios.get(this.url + "/persona/GetByRFCSinHomo/" + str)
            .then(res => {
                if (res.data[0].status === true) {
                    this.setState({
                        PersonaEncontrada: true,
                        datosPersonaEncontrada: res.data[0].persona[0],
                        RFCSinHomoclave: str
                    });
                    console.log(this.state.datosPersonaEncontrada);
                }
                if (res.data[0].status === false) {
                    this.setState({
                        PersonaEncontrada: false,
                        datosPersonaEncontrada: {},
                        RFCSinHomoclave: ''
                    });
                }
            });
    };

    getProfesionesOficios = () => {
        axios.get(this.url + "/profesion_oficio")
            .then(res => {
                this.setState({
                    profesiones_oficios: res.data,
                    status: 'success'
                });
            });
    };

    getListaHogares = () => {
        axios.get(this.url + "/hogar/GetListaHogares")
            .then(res => {
                this.setState({
                    ListaHogares: res.data,
                    status: 'success'
                });
            });
    }

    HogarSeleccionado = () => {
        axios.get(this.url + "/Hogar/GetMiembros/" + this.hog_Id_HogarRef.current.value)
            .then(res => {
                this.setState({
                    MiembrosDelHogar: res.data,
                    status: 'success',
                    SelectHogarId: this.hog_Id_HogarRef.current.value
                });
            });
        // console.log(this.hog_Id_HogarRef.current.value);
    }

    EsMiembroBautizado = () => {
        // console.log(this.per_BautizadoRef.current.checked);
        if (this.per_BautizadoRef.current.checked) {
            this.setState({ ElMiembroEsBautizado: true });
        } else {
            this.setState({ ElMiembroEsBautizado: false });
        }
    }

    fnPromesaDelEspirituSanto = () => {
        if (this.PromesaDelEspirituSantoRef.current.checked) {
            this.setState({ TienePromesaDelEspitiruSanto: true });
        } else {
            this.setState({ TienePromesaDelEspitiruSanto: false });
        }
    }

    fnDatosEclesiasticos = () => {
        if (this.per_BautizadoRef.current.checked && this.PromesaDelEspirituSantoRef.current.checked) {
            let eclesiasticos = {
                bau_Lugar_Bautismo: this.bau_Lugar_BautismoRef.current.value,
                bau_Fecha_Bautismo: this.state.fechaBautismo,
                bau_Ministro_Que_Bautizo: this.bau_Ministro_Que_BautizoRef.current.value
            };
            this.setState({
                per_Fecha_Recibio_Espiritu: this.state.fechaPromesaDelEspitiru,
                per_Bajo_Imposicion_De_Manos: this.per_Bajo_Imposicion_De_ManosRef.current.value
            });
            return eclesiasticos;
        }
        else if (this.per_BautizadoRef.current.checked && !this.PromesaDelEspirituSantoRef.current.checked) {
            let eclesiasticos = {
                bau_Lugar_Bautismo: this.bau_Lugar_BautismoRef.current.value,
                bau_Fecha_Bautismo: this.state.fechaBautismo,
                bau_Ministro_Que_Bautizo: this.bau_Ministro_Que_BautizoRef.current.value
            };
            return eclesiasticos;
        }
        else if (!this.per_BautizadoRef.current.checked && this.PromesaDelEspirituSantoRef.current.checked) {
            let eclesiasticos = {}
            this.setState({
                per_Fecha_Recibio_Espiritu: this.state.fechaPromesaDelEspitiru,
                per_Bajo_Imposicion_De_Manos: this.per_Bajo_Imposicion_De_ManosRef.current.value
            });
            return eclesiasticos;
        } else {
            let eclesiasticos = {}
            return eclesiasticos;
        }
    }

    fBodaCivil = (day) => {
        this.setState({
            fechaBodaCivil: MomentLocalUtils.formatDate(day, 'YYYY-MM-DD')
        })
    }

    fBodaEclesiastica = (day) => {
        this.setState({
            fechaBodaEclesiastica: MomentLocalUtils.formatDate(day, 'YYYY-MM-DD')
        })
    }

    fBautismo = (day) => {
        this.setState({
            fechaBautismo: MomentLocalUtils.formatDate(day, 'YYYY-MM-DD')
        })
    }

    fRecibioEspirituSanto = (day) => {
        this.setState({
            fechaPromesaDelEspitiru: MomentLocalUtils.formatDate(day, 'YYYY-MM-DD')
        })
    }

    fnDatosEstadoCivil = () => {
        if (this.state.CasadoDivorciadoViudo && this.state.ElMiembroEsBautizado) {
            let estadoCivil = {
                per_Estado_Civil: this.per_Estado_CivilRef.current.value,
                eci_Fecha_Boda_Civil: this.state.fechaBodaCivil,
                eci_Num_Acta_Boda_Civil: this.eci_Num_Acta_Boda_CivilRef.current.value,
                eci_Libro_Acta_Boda_Civil: this.eci_Libro_Acta_Boda_CivilRef.current.value,
                eci_Oficialia_Boda_Civil: this.eci_Oficialia_Boda_CivilRef.current.value,
                eci_Fecha_Boda_Eclesiastica: this.state.fechaBodaEclesiastica,
                eci_Lugar_Boda_Eclesiastica: this.eci_Lugar_Boda_EclesiasticaRef.current.value,
                eci_Nombre_Conyuge: this.eci_Nombre_ConyugeRef.current.value,
                eci_Cantidad_Hijos: this.eci_Cantidad_HijosRef.current.value,
                eci_Nombre_Hijos: this.eci_Nombre_HijosRef.current.value
            }
            return estadoCivil;
        } else if (this.state.CasadoDivorciadoViudo && !this.state.ElMiembroEsBautizado) {
            let estadoCivil = {
                per_Estado_Civil: this.per_Estado_CivilRef.current.value,
                eci_Fecha_Boda_Civil: this.state.fechaBodaCivil,
                eci_Num_Acta_Boda_Civil: this.eci_Num_Acta_Boda_CivilRef.current.value,
                eci_Libro_Acta_Boda_Civil: this.eci_Libro_Acta_Boda_CivilRef.current.value,
                eci_Oficialia_Boda_Civil: this.eci_Oficialia_Boda_CivilRef.current.value,
                eci_Cantidad_Hijos: this.eci_Cantidad_HijosRef.current.value,
                eci_Nombre_Hijos: this.eci_Nombre_HijosRef.current.value
            }
            return estadoCivil;
        } else if (this.state.ConcubinatoSolteroConHijos) {
            let estadoCivil = {
                eci_Cantidad_Hijos: this.eci_Cantidad_HijosRef.current.value,
                eci_Nombre_Hijos: this.eci_Nombre_HijosRef.current.value
            }
            return estadoCivil;
        } else {
            return false;
        }
    }

    fnDatoshogar = () => {
        if (this.state.SelectHogarId === 0) {
            let hogar = {
                dom_Calle: this.dom_CalleRef.current.value,
                dom_Numero_Exterior: this.dom_Numero_ExteriorRef.current.value,
                dom_Numero_Interior: this.dom_Numero_InteriorRef.current.value,
                dom_Tipo_Subdivision: this.dom_Tipo_SubdivisionRef.current.value,
                dom_Subdivision: this.dom_SubdivisionRef.current.value,
                dom_Localidad: this.dom_LocalidadRef.current.value,
                dom_Municipio_Cuidad: this.dom_Municipio_CuidadRef.current.value,
                pais_Id_Pais: this.pais_Id_PaisRef.current.value,
                est_Id_Estado: this.est_Id_EstadoRef.current.value,
                dom_Telefono: this.dom_TelefonoRef.current.value
            }
            return hogar;
        } else {
            let hogar = {
                hog_Jerarquia: this.hog_JerarquiaRef.current.value,
                hog_Id_Hogar: this.hog_Id_HogarRef.current.value
            }
            return hogar;
        }
    }

    fnGuardaPersona = async (datos) => {
        let encabezado = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };
        await axios.post(this.url + "/persona", datos, encabezado)
            .then(res => {
                return res.data;
            })
            .catch(error => {
                return error;
            }
            );
    }

    datosDelFormularioPersona = (persona) => {
        this.setState({
            datosDelFormulario: { persona }
        });
        console.log(this.state.datosDelFormulario);
    }

    FrmRegistroPersona = (e) => {
        e.preventDefault();

        let datos = {
            persona: {
                //per_Categoria: this.per_CategoriaRef.current.value,
                //per_Nombre: this.per_NombreRef.current.value,
                //per_Apellido_Paterno: this.per_Apellido_PaternoRef.current.value,
                //per_Apellido_Materno: this.per_Apellido_MaternoRef.current.value,
                //per_Fecha_Nacimiento: this.state.fechanNacimiento,
                pro_Id_Profesion_Oficio1: this.pro_Id_Profesion_Oficio1Ref.current.value,
                pro_Id_Profesion_Oficio2: this.pro_Id_Profesion_Oficio2Ref.current.value,
                per_Telefono_Fijo: this.per_Telefono_FijoRef.current.value,
                per_Telefono_Movil: this.per_Telefono_MovilRef.current.value,
                per_Email_Personal: this.per_Email_PersonalRef.current.value,
                per_Observaciones: this.per_ObservacionesRef.current.value,
                per_Nombre_Padre: this.per_Nombre_PadreRef.current.value,
                per_Nombre_Madre: this.per_Nombre_MadreRef.current.value,
                per_Nombre_Abuelo_Paterno: this.per_Nombre_Abuelo_PaternoRef.current.value,
                per_Nombre_Abuela_Paterna: this.per_Nombre_Abuela_PaternaRef.current.value,
                per_Nombre_Abuelo_Materno: this.per_Nombre_Abuelo_MaternoRef.current.value,
                per_Nombre_Abuela_Materna: this.per_Nombre_Abuela_MaternaRef.current.value,
                per_Bautizado: this.state.ElMiembroEsBautizado,
                per_Estado_Civil: this.per_Estado_CivilRef.current.value,
                per_Cambios_De_Domicilio: this.per_Cambios_De_DomicilioRef.current.value,
                per_Fecha_Recibio_Espiritu: this.state.per_Fecha_Recibio_Espiritu,
                per_Bajo_Imposicion_De_Manos: this.state.per_Bajo_Imposicion_De_Manos,
                sec_Id_Sector: 227,
                per_Activo: true,
                per_En_Comunion: true,
                per_Vivo: true,
                sw_Registro: true,
                usu_Id_Usuario: 1,
                Fecha_Registro: this.fechaActual,
                per_Visibilidad_Abierta: false
            }
        };

        if (this.validator.allValid()) {
            /* let nvaPersona = this.fnGuardaPersona(this.state.datosDelFormulario.persona);

            datos.eclesiasticos = [];
            datos.eclesiasticos.push(this.fnDatosEclesiasticos());

            datos.estadoCivil = [];
            datos.estadoCivil.push(this.fnDatosEstadoCivil());

            datos.hogar = [];
            datos.hogar.push(this.fnDatoshogar()); */

            console.log(datos.persona);
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    };
}

export default Persona;