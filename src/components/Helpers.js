import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import moment from 'moment';

const helpers = {
    // EXPRESIONES REGULARES
    regex: {
        alphaSpaceRequired: /^[a-zA-Z]{2}[a-zA-ZÑ\d\s]{0,37}$/,
        formatoFecha: /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\2))(?:(?:19\d{2}|20\d{2}))$|^(?:29(\/|-|\.)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\4(?:(?:19\d{2}|20\d{2}))$/,
        formatoEmail: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        formatoTelefono: /^(\+\d{1,3})*(\(\d{2,3}\))*\d{7,25}$/,
        //formatoPassword: /^(?=.{6,20}$)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%&*_-+=()]).*/
        formatoPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$#@!%*?&])[A-Za-z\d$#@!%*?&]{7,19}[^'\s]$/
    },

    // MENSAJES PARA RegEx INCORRECTOS
    msjRegexInvalido: {
        alphaSpaceRequired: 'Formato incorrecto. Solo se aceptan espacios y letras',
        emailInvalido: 'Formato incorrecto. Ej: buzon@dominio.com.',
        fechaBautismoInvalida: 'Formato de fecha invalido.',
        fechaBodaCivilInvalida: 'Formato de fecha invalido.',
        fechaEspitiruSantoInvalida: 'Formato de fecha invalido.',
        fechaBodaEclesiasticaInvalida: 'Formato de fecha invalido.',
        formatoFecha: 'Formato de fecha invalido.',
        telMovilInvalido: 'Formatos admintidos: +521234567890, +52(123)4567890, (123)4567890, 1234567890. Hasta 25 numeros sin espacios.',
        confirmaPassInvalido: 'Las contraseñas no coinciden.'
    },

    meses: {
        "01": "ENERO",
        "02": "FEBRERO",
        "03": "MARZO",
        "04": "ABRIL",
        "05": "MAYO",
        "06": "JUNIO",
        "07": "JULIO",
        "08": "AGOSTO",
        "09": "SEPTIEMBRE",
        "10": "OCTUBRE",
        "11": "NOVIEMBRE",
        "12": "DICIEMBRE"
    },

    // URLs PARA PRUEBA
    //url_api: "http://" + window.location.hostname + ":59239/api",
    url_api: "http://" + window.location.hostname + ":81/webapi/api",

    // METODO PARA VALIDAR CAMPOS
    validaFormatos: function (formato, campo) {
        if (formato.test(campo)) {
            return false;
        } else {
            return true;
        }
    },

    authAxios: axios.create({
        //baseURL: "http://" + window.location.hostname + ":59239/api",
        baseURL: "http://" + window.location.hostname + ":81/webapi/api",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            contentType: 'application/json'
        }
    }),

    //Versión de la Aplicación Publicada
    version: '2.2',

    validaToken: () => {
        let timestampNow = moment(new Date()).unix();
        let tokenExpires = jwt_decode(localStorage.getItem("token")).exp;

        // FECHA DEL TOKEN MENOS 10 MIN
        let tokenExpiresLessTen = moment(tokenExpires * 1000).subtract(10, 'minutes').unix();
        if (timestampNow > tokenExpiresLessTen) {
            localStorage.removeItem('token');
            localStorage.removeItem('infoSesion');
            alert("Alerta!\nSu sesion ha expirado, debe volver a iniciar sesión.");
            window.location = "/";
        }
        return new Promise((resolve) => {
            resolve();
        })
    },

    // METODO PARA VERIFICAR SI SE HA INICIADO SESION
    isLoggedIn: () => {
        if (localStorage.getItem('LoginValido')) { return true }
        else {
            localStorage.clear();
            return false
        }
    },

    // METODO PARA INVOCAR UN FORMULARIO DE PERSONA NUEVO
    handle_RegistroNvaPersona: function () {
        localStorage.setItem("idPersona", "0");
        document.location.href = "/RegistroDePersona";
    },

    // ARRAY DE FECHAS A VALIDAR-FORMATEAR
    fechas: [
        "per_Fecha_Bautismo",
        "per_Fecha_Boda_Civil",
        "per_Fecha_Boda_Eclesiastica",
        "per_Fecha_Nacimiento",
        "per_Fecha_Recibio_Espiritu_Santo"
    ],

    // FUNCION PARA FORMATO DE FECHAS PARA BD
    fnFormatoFecha: function (fecha) {
        let sub = fecha.split("/")
        let fechaFormateada = sub[1] + "/" + sub[0] + "/" + sub[2]
        return fechaFormateada
    },

    fnFormatoFecha2: function (fecha) {
        let sub = fecha.split("/")
        let fechaFormateada = sub[2] + "-" + sub[1] + "-" + sub[0]
        return fechaFormateada
    },

    // FUNCION PARA FORMATO DE FECHAS PARA BD
    fnFormatoFecha3: function (fecha) {
        let sub = fecha.split("-")
        let fechaFormateada = sub[2] + "/" + sub[1] + "/" + sub[0]
        return fechaFormateada
    },

    // FUNCION PARA FORMATO DE FECHAS DESDE BD A WEBUI
    reFormatoFecha: function (fecha) {
        /* let foo = fecha.split("T");
        let bar = foo[0].split("-");
        let f = bar[2] + "/" + bar[1] + "/" + bar[0]; */
        let foo = fecha.split("T");
        let f = foo[0];
        return f;
    },

    ToPDF: function (div) {
        html2canvas(document.querySelector(`#${div}`)).then(canvas => {
            document.body.appendChild(canvas);  // if you want see your screenshot in body.
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'PNG', 0, 0);
            pdf.save("documento.pdf");
        });
    },

    handle_LinkEncabezado: function (seccion, componente) {
        localStorage.setItem('seccion', seccion);
        localStorage.setItem('componente', componente);
    },

    getDomicilio: async function (id) {
        let direccion = "";
        let hogarDomicilio = {};
        await this.authAxios.get(`/HogarDomicilio/${id}`)
            .then(res => {
                if (res.data.status === "success") {
                    return (
                        direccion = res.data.direccion,
                        hogarDomicilio = res.data.hogardomicilio[0]
                    );
                }
            });
    },

    modalDeCarga: {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#626567',
            opacity: '60%'
        },
        content: {
            top: '10%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            paddingRight: '10em',
            paddingLeft: '10em',
            transform: 'translate(-50%, -50%)',
            opacity: '100%',
            borderRadius: '10px',
            fontWeight: 'bold',
            fontSize: '15px'
        }
    }
}

export default helpers;